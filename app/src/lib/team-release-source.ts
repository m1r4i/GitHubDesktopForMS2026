import * as semver from 'semver'

/**
 * Where MS2026 Desktop looks for new versions: the releases of a GitHub or
 * Gitea repository. `yarn publish:team` uploads builds there.
 */
export interface ITeamReleaseSource {
  readonly provider: 'github' | 'gitea'
  /** The web address of the server, e.g. https://github.com */
  readonly server: string
  readonly owner: string
  readonly repo: string
}

export const teamReleaseSource: ITeamReleaseSource = {
  provider: 'github',
  server: 'https://github.com',
  owner: 'm1r4i',
  repo: 'GitHubDesktopForMS2026',
}

/** The API endpoint of the release source, as used by accounts. */
export function getReleaseSourceAPIEndpoint(source: ITeamReleaseSource) {
  return source.provider === 'github'
    ? 'https://api.github.com'
    : `${source.server.replace(/\/+$/, '')}/api/v1`
}

/** The API URL listing the most recent releases of the source. */
export function getReleasesURL(source: ITeamReleaseSource) {
  const base = getReleaseSourceAPIEndpoint(source)
  const page = source.provider === 'github' ? 'per_page=30' : 'limit=30'
  return `${base}/repos/${source.owner}/${source.repo}/releases?${page}`
}

/** The subset of a release as returned by the GitHub and Gitea APIs. */
export interface IAPIRelease {
  readonly tag_name: string
  readonly name?: string | null
  readonly draft: boolean
  readonly html_url: string
  readonly assets: ReadonlyArray<IAPIReleaseAsset>
}

export interface IAPIReleaseAsset {
  readonly name: string
  /** The API URL of the asset (GitHub), used to download private assets */
  readonly url?: string
  readonly browser_download_url: string
  readonly size?: number
}

/** An update which can be installed. */
export interface ITeamUpdate {
  readonly version: string
  readonly assetName: string
  /** Where to download the installer or archive */
  readonly downloadURL: string
  /** The API URL of the asset, if any (GitHub) */
  readonly apiURL: string | null
  readonly releaseURL: string
}

/**
 * The kinds of Linux builds: a portable archive which can update itself, or
 * a Debian package installed by the package manager.
 */
export type LinuxPackageFormat = 'tar.gz' | 'deb'

const debianArchitectures: Record<string, string> = {
  x64: 'amd64',
  arm64: 'arm64',
}

/**
 * Whether a release asset is the installer (Windows), archive (macOS) or
 * package (Linux, both formats unless one is given) for the given platform
 * and architecture.
 */
export function isAssetForPlatform(
  name: string,
  platform: NodeJS.Platform,
  arch: string,
  linuxFormat?: LinuxPackageFormat
) {
  const lower = name.toLowerCase()
  if (platform === 'win32') {
    return lower.endsWith(`setup-${arch}.exe`)
  }
  if (platform === 'darwin') {
    return lower.endsWith(`-${arch}.zip`) && lower.includes('desktop')
  }
  if (platform === 'linux') {
    const archive = lower.endsWith(`linux-${arch}.tar.gz`)
    const deb = lower.endsWith(`linux-${debianArchitectures[arch] ?? arch}.deb`)
    return linuxFormat === 'tar.gz'
      ? archive
      : linuxFormat === 'deb'
      ? deb
      : archive || deb
  }
  return false
}

/** Parse the version of a release from its tag, e.g. v3.6.7-ms00392575 */
export function getReleaseVersion(release: IAPIRelease): string | null {
  const version = semver.valid(release.tag_name.replace(/^v/i, ''))
  return version
}

/**
 * Pick the newest release which is newer than the running version and has a
 * build for this platform. Builds for different platforms may be published
 * as separate releases.
 */
export function selectTeamUpdate(
  releases: ReadonlyArray<IAPIRelease>,
  currentVersion: string,
  platform: NodeJS.Platform,
  arch: string,
  linuxFormat?: LinuxPackageFormat
): ITeamUpdate | null {
  let best: ITeamUpdate | null = null

  for (const release of releases) {
    const version = getReleaseVersion(release)
    if (release.draft || version === null) {
      continue
    }

    if (!semver.gt(version, currentVersion)) {
      continue
    }

    if (best !== null && !semver.gt(version, best.version)) {
      continue
    }

    const asset = release.assets.find(a =>
      isAssetForPlatform(a.name, platform, arch, linuxFormat)
    )
    if (asset === undefined) {
      continue
    }

    best = {
      version,
      assetName: asset.name,
      downloadURL: asset.browser_download_url,
      apiURL: asset.url ?? null,
      releaseURL: release.html_url,
    }
  }

  return best
}
