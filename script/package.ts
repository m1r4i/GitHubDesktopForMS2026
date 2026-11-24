/* eslint-disable no-sync */

import * as cp from 'child_process'
import * as path from 'path'
import * as electronInstaller from 'electron-winstaller'
import { getProductName, getCompanyName } from '../app/package-info'
import {
  getDistPath,
  getOSXZipPath,
  getWindowsIdentifierName,
  getWindowsStandaloneName,
  getWindowsInstallerName,
  shouldMakeDelta,
  getUpdatesURL,
  isPublishable,
  getBundleSizes,
  getDistRoot,
  getDistArchitecture,
  getIconDirectory,
  getLinuxArchivePath,
  getLinuxPackageName,
  getDebianArchitecture,
  getDebianPackagePath,
  getExecutableName,
} from './dist-info'
import { isGitHubActions } from './build-platforms'
import {
  chmodSync,
  copyFileSync,
  cpSync,
  existsSync,
  lstatSync,
  mkdirSync,
  readdirSync,
  readlinkSync,
  rmSync,
  symlinkSync,
  writeFileSync,
} from 'fs'
import { getVersion } from '../app/package-info'
import { computeBundleHashSync } from '../app/src/lib/compute-bundle-hash'
import { rename } from 'fs/promises'
import { join } from 'path'
import { assertNonNullable } from '../app/src/lib/fatal-error'

const distPath = getDistPath()
const productName = getProductName()
const outputDir = getDistRoot()

const assertExistsSync = (path: string) => {
  if (!existsSync(path)) {
    throw new Error(`Expected ${path} to exist`)
  }
}

if (process.platform === 'darwin') {
  packageOSX()
} else if (process.platform === 'win32') {
  packageWindows()
} else if (process.platform === 'linux') {
  packageLinux()
} else {
  console.error(`I don't know how to package for ${process.platform} :(`)
  process.exit(1)
}

console.log('Writing bundle size info…')
writeFileSync(
  path.join(getDistRoot(), 'bundle-size.json'),
  JSON.stringify(getBundleSizes())
)

console.log('Writing bundle hash…')
writeFileSync(
  path.join(getDistRoot(), 'bundle-hash.json'),
  JSON.stringify({
    bundleHash: computeBundleHashSync(path.join(__dirname, '..', 'out')),
  })
)

function packageOSX() {
  const dest = getOSXZipPath()
  rmSync(dest, { recursive: true, force: true })

  console.log('Packaging for macOS…')
  cp.execSync(
    `ditto -ck --keepParent "${distPath}/${productName}.app" "${dest}"`
  )
}

function packageWindows() {
  const iconSource = join(getIconDirectory(), 'icon-logo.ico')

  if (!existsSync(iconSource)) {
    console.error(`expected setup icon not found at location: ${iconSource}`)
    process.exit(1)
  }

  const splashScreenPath = path.resolve(
    __dirname,
    '../app/static/logos/win32-installer-splash.gif'
  )

  if (!existsSync(splashScreenPath)) {
    console.error(
      `expected setup splash screen gif not found at location: ${splashScreenPath}`
    )
    process.exit(1)
  }

  const iconUrl = 'https://desktop.githubusercontent.com/app-icon.ico'

  const nugetPkgName = getWindowsIdentifierName()
  const options: electronInstaller.Options = {
    name: nugetPkgName,
    appDirectory: distPath,
    outputDirectory: outputDir,
    authors: getCompanyName(),
    iconUrl: iconUrl,
    setupIcon: iconSource,
    loadingGif: splashScreenPath,
    exe: `${nugetPkgName}.exe`,
    title: productName,
    setupExe: getWindowsStandaloneName(),
    setupMsi: getWindowsInstallerName(),
  }

  if (shouldMakeDelta()) {
    const url = new URL(getUpdatesURL())
    // Make sure Squirrel.Windows isn't affected by partially or completely
    // disabled releases.
    url.searchParams.set('bypassStaggeredRelease', '1')
    options.remoteReleases = url.toString()
  }

  if (isGitHubActions() && isPublishable()) {
    assertNonNullable(process.env.RUNNER_TEMP, 'Missing RUNNER_TEMP env var')

    const acsPath = join(process.env.RUNNER_TEMP, 'acs')
    const dlibPath = join(acsPath, 'bin', 'x64', 'Azure.CodeSigning.Dlib.dll')

    assertExistsSync(dlibPath)

    const metadataPath = join(acsPath, 'metadata.json')
    const acsMetadata = {
      Endpoint: 'https://wus3.codesigning.azure.net/',
      CodeSigningAccountName: 'GitHubInc',
      CertificateProfileName: 'GitHubInc',
      CorrelationId: `${process.env.GITHUB_SERVER_URL}/${process.env.GITHUB_REPOSITORY}/actions/runs/${process.env.GITHUB_RUN_ID}`,
    }
    writeFileSync(metadataPath, JSON.stringify(acsMetadata))

    options.signWithParams = `/v /fd SHA256 /tr "http://timestamp.acs.microsoft.com" /td SHA256 /dlib "${dlibPath}" /dmdf "${metadataPath}"`
  }

  console.log('Packaging for Windows…')
  electronInstaller
    .createWindowsInstaller(options)
    .then(() => console.log(`Installers created in ${outputDir}`))
    .then(async () => {
      // electron-winstaller (more specifically Squirrel.Windows) doesn't let
      // us control the name of the nuget packages but we want them to include
      // the architecture similar to how the setup exe and msi do so we'll just
      // have to rename them here after the fact.
      const arch = getDistArchitecture()
      const prefix = `${getWindowsIdentifierName()}-${getVersion()}`

      for (const kind of shouldMakeDelta() ? ['full', 'delta'] : ['full']) {
        const from = join(outputDir, `${prefix}-${kind}.nupkg`)
        const to = join(outputDir, `${prefix}-${arch}-${kind}.nupkg`)

        console.log(`Renaming ${from} to ${to}`)
        await rename(from, to)
      }
    })
    .catch(e => {
      console.error(`Error packaging: ${e}`)
      process.exit(1)
    })
}

function getLinuxIconPath() {
  return path.resolve(__dirname, '../app/static/linux/icon-logo.png')
}

/**
 * A launcher which starts the app, turning Chromium's sandbox off when it
 * can't work: the portable archive can't install chrome-sandbox as setuid
 * root and some distributions (e.g. Ubuntu 24.04) don't allow unprivileged
 * user namespaces either.
 */
function getLinuxLauncher(executable: string) {
  return `#!/bin/sh
# Start MS2026 Desktop
dir="$(dirname "$(readlink -f "$0")")"
sandbox="$dir/chrome-sandbox"
if [ ! -u "$sandbox" ] && ! unshare -Ur true 2>/dev/null; then
  set -- --no-sandbox "$@"
fi
exec "$dir/${executable}" "$@"
`
}

function getLinuxDesktopEntry(exec: string, icon: string) {
  return `[Desktop Entry]
Type=Application
Name=${productName}
GenericName=Git client
Comment=MS2026 Desktop (HAL2026_MS)
Exec=${exec} %U
Icon=${icon}
Terminal=false
Categories=Development;RevisionControl;
MimeType=x-scheme-handler/x-github-desktop-auth;x-scheme-handler/x-github-client;
StartupWMClass=${productName}
StartupNotify=true
`
}

/**
 * A script which adds the portable archive to the application menu (and
 * registers it for sign in links) from wherever it was extracted.
 */
function getLinuxDesktopEntryInstaller() {
  const name = getLinuxPackageName()
  const entry = getLinuxDesktopEntry(
    '"$dir/' + name + '.sh"',
    '$dir/' + name + '.png'
  )
  return `#!/bin/sh
# Add MS2026 Desktop to the application menu of the current user
set -e
dir="$(dirname "$(readlink -f "$0")")"
apps="\${XDG_DATA_HOME:-$HOME/.local/share}/applications"
mkdir -p "$apps"
cat > "$apps/${name}.desktop" <<EOF
${entry}EOF
command -v update-desktop-database >/dev/null && update-desktop-database -q "$apps" || true
echo "Added ${productName} to the application menu"
`
}

/**
 * The packager copies the files symbolic links point at, which turns the
 * links of Git's commands (git-add, git-commit, ...) into ~140 copies of the
 * Git executable. Restore the links found in the source.
 */
function restoreSymbolicLinks(source: string, destination: string) {
  let restored = 0
  for (const entry of readdirSync(source)) {
    const from = join(source, entry)
    const to = join(destination, entry)
    const stat = lstatSync(from)
    if (stat.isSymbolicLink()) {
      if (existsSync(to) && !lstatSync(to).isSymbolicLink()) {
        rmSync(to, { recursive: true, force: true })
        symlinkSync(readlinkSync(from), to)
        restored++
      }
    } else if (stat.isDirectory() && existsSync(to)) {
      restored += restoreSymbolicLinks(from, to)
    }
  }
  return restored
}

function packageLinux() {
  const gitSource = path.resolve(__dirname, '../app/node_modules/dugite/git')
  const gitDestination = join(distPath, 'resources', 'app', 'git')
  if (existsSync(gitSource) && existsSync(gitDestination)) {
    const count = restoreSymbolicLinks(gitSource, gitDestination)
    console.log(`Restored ${count} symbolic links in Git`)
  }

  // node-pty is built for Linux, its prebuilt binaries are for other systems
  const ptyPrebuilds = join(
    distPath,
    'resources/app/node_modules/node-pty/prebuilds'
  )
  rmSync(ptyPrebuilds, { recursive: true, force: true })

  const executable = getExecutableName()
  const launcherName = `${getLinuxPackageName()}.sh`

  writeFileSync(join(distPath, launcherName), getLinuxLauncher(executable))
  chmodSync(join(distPath, launcherName), 0o755)
  copyFileSync(
    getLinuxIconPath(),
    join(distPath, `${getLinuxPackageName()}.png`)
  )

  const installer = join(distPath, 'install-desktop-entry.sh')
  writeFileSync(installer, getLinuxDesktopEntryInstaller())
  chmodSync(installer, 0o755)

  packageLinuxArchive()

  if (hasCommand('dpkg-deb')) {
    packageDebian()
  } else {
    console.warn('dpkg-deb not found, skipping the .deb package')
  }
}

function hasCommand(command: string) {
  return cp.spawnSync('sh', ['-c', `command -v ${command}`]).status === 0
}

/** A .tar.gz which can be extracted anywhere and updates itself */
function packageLinuxArchive() {
  const dest = getLinuxArchivePath()
  rmSync(dest, { force: true })

  console.log('Packaging the Linux archive…')
  // Name the top directory after the app instead of desktop-linux-x64
  const topDirectory = getWindowsIdentifierName()
  cp.execFileSync('tar', [
    '-czf',
    dest,
    '-C',
    path.dirname(distPath),
    `--transform=s,^${path.basename(distPath)},${topDirectory},`,
    path.basename(distPath),
  ])
  console.log(`Created ${dest}`)
}

/** A Debian package (Ubuntu, Debian, ...) installed to /opt */
function packageDebian() {
  const name = getLinuxPackageName()
  const root = join(outputDir, 'deb')
  const installDir = join(root, 'opt', name)
  rmSync(root, { recursive: true, force: true })

  console.log('Packaging the Debian package…')
  mkdirSync(join(root, 'DEBIAN'), { recursive: true })
  mkdirSync(join(root, 'usr', 'bin'), { recursive: true })
  mkdirSync(join(root, 'usr', 'share', 'applications'), { recursive: true })
  const iconDir = join(root, 'usr/share/icons/hicolor/512x512/apps')
  mkdirSync(iconDir, { recursive: true })

  cpSync(distPath, installDir, { recursive: true, verbatimSymlinks: true })
  // The package adds the desktop entry itself
  rmSync(join(installDir, 'install-desktop-entry.sh'))
  // Installed by the package manager, chrome-sandbox can be setuid root
  chmodSync(join(installDir, 'chrome-sandbox'), 0o4755)

  symlinkSync(`/opt/${name}/${name}.sh`, join(root, 'usr', 'bin', name))
  copyFileSync(getLinuxIconPath(), join(iconDir, `${name}.png`))
  writeFileSync(
    join(root, 'usr', 'share', 'applications', `${name}.desktop`),
    getLinuxDesktopEntry(`/opt/${name}/${name}.sh`, name)
  )

  const installedSize = Math.ceil(
    parseInt(
      cp.execFileSync('du', ['-sk', installDir], { encoding: 'utf8' }),
      10
    )
  )

  writeFileSync(
    join(root, 'DEBIAN', 'control'),
    [
      `Package: ${name}`,
      `Version: ${getVersion()}`,
      `Architecture: ${getDebianArchitecture()}`,
      `Maintainer: HAL2026_MS`,
      `Installed-Size: ${installedSize}`,
      'Depends: libgtk-3-0 | libgtk-3-0t64, libnss3, libsecret-1-0, ' +
        'libxss1, libasound2 | libasound2t64, libgbm1, xdg-utils',
      'Section: devel',
      'Priority: optional',
      `Description: ${productName}`,
      ` The Git client of HAL2026_MS, based on GitHub Desktop.`,
      '',
    ].join('\n')
  )

  // Let the desktop pick up the new entry and icon
  const refresh = [
    '#!/bin/sh',
    'command -v update-desktop-database >/dev/null && ' +
      'update-desktop-database -q /usr/share/applications || true',
    'command -v gtk-update-icon-cache >/dev/null && ' +
      'gtk-update-icon-cache -q /usr/share/icons/hicolor || true',
    '',
  ].join('\n')
  for (const script of ['postinst', 'postrm']) {
    writeFileSync(join(root, 'DEBIAN', script), refresh)
    chmodSync(join(root, 'DEBIAN', script), 0o755)
  }

  const dest = getDebianPackagePath()
  rmSync(dest, { force: true })
  cp.execFileSync(
    'dpkg-deb',
    ['--root-owner-group', '-Zxz', '--build', root, dest],
    { stdio: 'inherit' }
  )
  rmSync(root, { recursive: true, force: true })
  console.log(`Created ${dest}`)
}
