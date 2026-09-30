import { app, net, WebContents } from 'electron'
import { spawn, execFile } from 'child_process'
import * as Fs from 'fs'
import * as Os from 'os'
import * as Path from 'path'
import { promisify } from 'util'
import * as ipcMain from './ipc-main'
import * as ipcWebContents from './ipc-webcontents'
import {
  getReleasesURL,
  IAPIRelease,
  ITeamUpdate,
  selectTeamUpdate,
  teamReleaseSource,
} from '../lib/team-release-source'

const execFileAsync = promisify(execFile)

function getHeaders(token: string | null, accept: string) {
  const headers: Record<string, string> = {
    Accept: accept,
    'User-Agent': `MS2026Desktop/${app.getVersion()}`,
  }
  if (token !== null && token.length > 0) {
    headers.Authorization = `Bearer ${token}`
  }
  return headers
}

/** Look for a newer build of the app for this platform. */
async function checkForUpdate(token: string | null) {
  const response = await net.fetch(getReleasesURL(teamReleaseSource), {
    headers: getHeaders(token, 'application/json'),
  })

  if (!response.ok) {
    throw new Error(
      `リリースを取得できませんでした (HTTP ${response.status})。` +
        (response.status === 404
          ? 'リポジトリが非公開の場合はアカウントを追加してください。'
          : '')
    )
  }

  const releases: ReadonlyArray<IAPIRelease> = await response.json()
  return selectTeamUpdate(
    releases,
    app.getVersion(),
    process.platform,
    process.arch
  )
}

/** Download the update, reporting progress between 0 and 1. */
async function download(
  update: ITeamUpdate,
  token: string | null,
  onProgress: (progress: number) => void
) {
  // Private GitHub assets can only be downloaded through the API
  const useAPI =
    teamReleaseSource.provider === 'github' &&
    token !== null &&
    update.apiURL !== null

  const response = await net.fetch(
    useAPI && update.apiURL !== null ? update.apiURL : update.downloadURL,
    { headers: getHeaders(token, 'application/octet-stream') }
  )

  if (!response.ok || response.body === null) {
    throw new Error(
      `アップデートをダウンロードできませんでした (HTTP ${response.status})`
    )
  }

  const dir = await Fs.promises.mkdtemp(
    Path.join(Os.tmpdir(), 'ms2026-update-')
  )
  const file = Path.join(dir, Path.basename(update.assetName))
  const total = parseInt(response.headers.get('content-length') ?? '0', 10)
  const out = Fs.createWriteStream(file)
  const reader = response.body.getReader()
  let received = 0

  try {
    for (;;) {
      const { done, value } = await reader.read()
      if (done) {
        break
      }
      received += value.length
      if (!out.write(value)) {
        await new Promise(resolve => out.once('drain', resolve))
      }
      if (total > 0) {
        onProgress(Math.min(received / total, 1))
      }
    }
  } finally {
    await new Promise(resolve => out.end(resolve))
  }

  return { dir, file }
}

/**
 * Install the downloaded Windows installer once the app has quit. Squirrel
 * updates the existing installation and starts the new version.
 */
function installWindows(installer: string) {
  const script =
    `Wait-Process -Id ${process.pid} -ErrorAction SilentlyContinue; ` +
    `Start-Process -FilePath '${installer.replace(/'/g, "''")}'`

  spawn(
    'powershell.exe',
    [
      '-NoProfile',
      '-NonInteractive',
      '-WindowStyle',
      'Hidden',
      '-Command',
      script,
    ],
    { detached: true, stdio: 'ignore', windowsHide: true }
  ).unref()
}

/** The .app bundle the app is running from */
function getAppBundlePath() {
  const match = /^(.*?\.app)\//.exec(process.execPath)
  if (match === null) {
    throw new Error('アプリの場所を特定できませんでした。')
  }
  return match[1]
}

const shellQuote = (s: string) => `'${s.replace(/'/g, `'\\''`)}'`

/**
 * Replace the app bundle with the downloaded one once the app has quit, then
 * relaunch it.
 */
async function installMac(archive: string, dir: string) {
  const extracted = Path.join(dir, 'extracted')
  await execFileAsync('/usr/bin/ditto', ['-x', '-k', archive, extracted])

  const bundle = (await Fs.promises.readdir(extracted)).find(f =>
    f.endsWith('.app')
  )
  if (bundle === undefined) {
    throw new Error('ダウンロードしたファイルにアプリが含まれていません。')
  }

  const current = getAppBundlePath()
  const next = Path.join(extracted, bundle)
  const backup = `${current}.old`

  await Fs.promises.access(Path.dirname(current), Fs.constants.W_OK)

  const script = [
    `while kill -0 ${process.pid} 2>/dev/null; do sleep 0.5; done`,
    `rm -rf ${shellQuote(backup)}`,
    `if mv ${shellQuote(current)} ${shellQuote(backup)}; then`,
    `  if mv ${shellQuote(next)} ${shellQuote(current)}; then`,
    `    rm -rf ${shellQuote(backup)}`,
    `  else`,
    `    mv ${shellQuote(backup)} ${shellQuote(current)}`,
    `  fi`,
    `fi`,
    `xattr -dr com.apple.quarantine ${shellQuote(current)} 2>/dev/null`,
    `open ${shellQuote(current)}`,
  ].join('\n')

  spawn('/bin/sh', ['-c', script], { detached: true, stdio: 'ignore' }).unref()
}

async function install(
  sender: WebContents,
  update: ITeamUpdate,
  token: string | null
) {
  if (process.platform !== 'win32' && process.platform !== 'darwin') {
    throw new Error('この OS では自動アップデートに対応していません。')
  }

  const { dir, file } = await download(update, token, progress => {
    if (!sender.isDestroyed()) {
      ipcWebContents.send(sender, 'team-update-progress', progress)
    }
  })

  if (process.platform === 'win32') {
    installWindows(file)
  } else {
    await installMac(file, dir)
  }

  log.info(`Installing MS2026 Desktop ${update.version} and restarting`)
  setTimeout(() => app.quit(), 250)
}

/** Register the IPC handlers for checking for and installing updates. */
export function registerTeamUpdaterHandlers() {
  ipcMain.handle('team-update-check', async (_, token) => checkForUpdate(token))
  ipcMain.handle('team-update-install', async (event, update, token) =>
    install(event.sender, update, token)
  )
}
