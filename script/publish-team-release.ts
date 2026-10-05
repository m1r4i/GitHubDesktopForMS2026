/**
 * Publish the last `yarn build:team` build as a release of the team's
 * repository (see app/src/lib/team-release-source.ts), from which installed
 * copies of MS2026 Desktop update themselves.
 *
 * Needs a token which can create releases in MS2026_RELEASE_TOKEN (or
 * GITHUB_TOKEN / GITEA_TOKEN depending on where releases live).
 */

import {
  createReadStream,
  existsSync,
  lstatSync,
  openAsBlob,
  readdirSync,
  readFileSync,
  statSync,
} from 'fs'
import * as https from 'https'
import * as Path from 'path'
import { getDistArchitecture, getDistRoot, getOSXZipPath } from './dist-info'
import {
  getReleaseSourceAPIEndpoint,
  isAssetForPlatform,
  teamReleaseSource,
} from '../app/src/lib/team-release-source'

const source = teamReleaseSource
const api = getReleaseSourceAPIEndpoint(source)
const repoPath = `repos/${source.owner}/${source.repo}`
const userAgent = 'MS2026Desktop-publisher'

/** How many times to try uploading before giving up */
const uploadAttempts = 3

function fail(message: string): never {
  console.error(`\n${message}`)
  process.exit(1)
}

function getToken() {
  const token =
    process.env.MS2026_RELEASE_TOKEN ||
    (source.provider === 'github'
      ? process.env.GITHUB_TOKEN
      : process.env.GITEA_TOKEN)

  return (
    token ||
    fail(
      'Set MS2026_RELEASE_TOKEN to a token which can create releases in ' +
        `${source.server}/${source.owner}/${source.repo}`
    )
  )
}

/** The version of the last build, see script/build.ts */
function getBuiltVersion() {
  const pkgPath = Path.join(__dirname, '..', 'out', 'package.json')
  if (!existsSync(pkgPath)) {
    fail('Nothing to publish, run `yarn build:team` first.')
  }
  return JSON.parse(readFileSync(pkgPath, 'utf8')).version as string
}

/**
 * Look for the installer (Windows) or archive (macOS) under a directory,
 * skipping symbolic links and app bundles, which can't contain it.
 */
function searchAsset(dir: string): string | null {
  for (const entry of readdirSync(dir).sort()) {
    const path = Path.join(dir, entry)
    const stat = lstatSync(path)
    if (stat.isDirectory() && !entry.endsWith('.app')) {
      const found = searchAsset(path)
      if (found !== null) {
        return found
      }
    } else if (
      stat.isFile() &&
      isAssetForPlatform(entry, process.platform, getDistArchitecture())
    ) {
      return path
    }
  }
  return null
}

/** The installer (Windows) or archive (macOS) of the last build */
function findAsset(): string | null {
  if (process.platform === 'darwin' && existsSync(getOSXZipPath())) {
    return getOSXZipPath()
  }
  return existsSync(getDistRoot()) ? searchAsset(getDistRoot()) : null
}

/** The name to upload the asset as, GitHub replaces spaces with dots */
const getAssetName = (file: string) => Path.basename(file).replace(/\s+/g, '-')

async function request(
  method: string,
  url: string,
  token: string,
  body?: string | FormData
) {
  const response = await fetch(url, {
    method,
    headers: {
      Authorization: `token ${token}`,
      Accept: 'application/json',
      'User-Agent': userAgent,
      ...(typeof body === 'string'
        ? { 'Content-Type': 'application/json' }
        : {}),
    },
    body,
  })
  const text = await response.text()
  if (!response.ok) {
    throw new Error(`${method} ${url} failed (${response.status}): ${text}`)
  }
  return text.length > 0 ? JSON.parse(text) : null
}

async function getOrCreateRelease(tag: string, name: string, token: string) {
  try {
    return await request(
      'GET',
      `${api}/${repoPath}/releases/tags/${encodeURIComponent(tag)}`,
      token
    )
  } catch {
    return request(
      'POST',
      `${api}/${repoPath}/releases`,
      token,
      JSON.stringify({
        tag_name: tag,
        name,
        body: `MS2026 Desktop ${tag.replace(/^v/, '')}`,
        draft: false,
        prerelease: false,
      })
    )
  }
}

/**
 * Remove an asset with the same name, e.g. left behind by an upload which
 * failed, as uploading again would otherwise fail.
 */
async function removeExistingAsset(release: any, name: string, token: string) {
  const existing = (release.assets ?? []).find(
    (a: { name: string }) => a.name === name
  )
  if (existing === undefined) {
    return
  }

  console.log(`Removing the existing ${name}…`)
  const url =
    source.provider === 'github'
      ? `${api}/${repoPath}/releases/assets/${existing.id}`
      : `${api}/${repoPath}/releases/${release.id}/assets/${existing.id}`
  await request('DELETE', url, token)
}

const formatMB = (bytes: number) => `${(bytes / 1024 / 1024).toFixed(1)} MB`

/**
 * Upload a file to GitHub, streaming it from disk and showing the progress.
 * fetch reads the whole file into memory and gives up on slow uploads.
 */
function uploadToGitHub(
  release: any,
  file: string,
  name: string,
  token: string
) {
  const size = statSync(file).size
  const url = new URL(String(release.upload_url).replace(/\{.*\}$/, ''))
  url.searchParams.set('name', name)

  return new Promise<void>((resolve, reject) => {
    const req = https.request(
      url,
      {
        method: 'POST',
        headers: {
          Authorization: `token ${token}`,
          Accept: 'application/json',
          'User-Agent': userAgent,
          'Content-Type': 'application/octet-stream',
          'Content-Length': size,
        },
      },
      res => {
        let text = ''
        res.setEncoding('utf8')
        res.on('data', chunk => (text += chunk))
        res.on('end', () => {
          const status = res.statusCode ?? 0
          if (status >= 200 && status < 300) {
            resolve()
          } else {
            reject(new Error(`Upload failed (${status}): ${text}`))
          }
        })
      }
    )
    req.on('error', reject)
    // Fail instead of hanging forever when the connection stalls
    req.setTimeout(5 * 60 * 1000, () =>
      req.destroy(new Error('The upload timed out'))
    )

    let sent = 0
    let lastReport = 0
    const stream = createReadStream(file)
    stream.on('data', chunk => {
      sent += chunk.length
      const now = Date.now()
      if (now - lastReport > 1000 || sent === size) {
        lastReport = now
        process.stdout.write(
          `\r  ${formatMB(sent)} / ${formatMB(size)} (${Math.round(
            (sent / size) * 100
          )}%)`
        )
      }
    })
    stream.on('end', () => process.stdout.write('\n'))
    stream.on('error', reject)
    stream.pipe(req)
  })
}

async function uploadToGitea(
  release: any,
  file: string,
  name: string,
  token: string
) {
  const form = new FormData()
  form.append('attachment', await openAsBlob(file), name)
  await request(
    'POST',
    `${api}/${repoPath}/releases/${release.id}/assets?name=${encodeURIComponent(
      name
    )}`,
    token,
    form
  )
}

async function upload(release: any, file: string, token: string) {
  const name = getAssetName(file)

  for (let attempt = 1; ; attempt++) {
    try {
      await removeExistingAsset(
        // Get the current assets as a failed attempt may have left one behind
        await request(
          'GET',
          `${api}/${repoPath}/releases/${release.id}`,
          token
        ),
        name,
        token
      )
      console.log(`Uploading ${name} (${formatMB(statSync(file).size)})…`)
      if (source.provider === 'github') {
        await uploadToGitHub(release, file, name, token)
      } else {
        await uploadToGitea(release, file, name, token)
      }
      return
    } catch (e) {
      if (attempt >= uploadAttempts) {
        throw e
      }
      console.warn(`\n${e}\nTrying again (${attempt + 1}/${uploadAttempts})…`)
    }
  }
}

async function main() {
  const token = getToken()
  const version = getBuiltVersion()
  const asset = findAsset()

  if (asset === null) {
    fail(
      `No build for ${process.platform} (${getDistArchitecture()}) found in ` +
        `${getDistRoot()}, run \`yarn build:team\` first.`
    )
  }

  const platform = process.platform === 'darwin' ? 'macOS' : 'Windows'
  const tag = `v${version}`
  console.log(`Publishing ${asset} as ${tag}…`)

  const release = await getOrCreateRelease(
    tag,
    `MS2026 Desktop ${version} (${platform})`,
    token
  )
  await upload(release, asset, token)

  console.log(`Published ${release.html_url}`)
}

main().catch(e =>
  fail(`Publishing failed: ${e instanceof Error ? e.message : e}`)
)
