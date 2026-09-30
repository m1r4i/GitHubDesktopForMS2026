import { describe, it } from 'node:test'
import assert from 'node:assert'
import {
  getReleasesURL,
  IAPIRelease,
  isAssetForPlatform,
  selectTeamUpdate,
} from '../../src/lib/team-release-source'

const release = (
  tag: string,
  assets: ReadonlyArray<string>,
  draft = false
): IAPIRelease => ({
  tag_name: tag,
  draft,
  html_url: `https://github.com/o/r/releases/tag/${tag}`,
  assets: assets.map(name => ({
    name,
    url: `https://api.github.com/repos/o/r/releases/assets/${name}`,
    browser_download_url: `https://github.com/o/r/releases/download/${tag}/${name}`,
  })),
})

const win = 'MS2026DesktopSetup-x64.exe'
const mac = 'MS2026.Desktop-arm64.zip'

describe('team releases', () => {
  it('recognizes installers and archives for each platform', () => {
    assert(isAssetForPlatform(win, 'win32', 'x64'))
    assert(!isAssetForPlatform(win, 'win32', 'arm64'))
    assert(!isAssetForPlatform('MS2026DesktopSetup-x64.msi', 'win32', 'x64'))
    assert(isAssetForPlatform(mac, 'darwin', 'arm64'))
    assert(isAssetForPlatform('MS2026 Desktop-x64.zip', 'darwin', 'x64'))
    assert(!isAssetForPlatform(mac, 'darwin', 'x64'))
    assert(!isAssetForPlatform(mac, 'linux', 'arm64'))
  })

  it('picks the newest release with a build for this platform', () => {
    const releases = [
      release('v3.6.7-ms00400000', [mac]),
      release('v3.6.7-ms00390000', [win]),
      release('v3.6.7-ms00395000', [win]),
      release('v3.6.7-ms00399000', [win], true),
      release('nightly', [win]),
    ]

    const update = selectTeamUpdate(
      releases,
      '3.6.7-ms00380000',
      'win32',
      'x64'
    )
    assert(update !== null)
    assert.equal(update.version, '3.6.7-ms00395000')
    assert.equal(update.assetName, win)
    assert.equal(
      update.downloadURL,
      'https://github.com/o/r/releases/download/v3.6.7-ms00395000/' + win
    )

    const macUpdate = selectTeamUpdate(
      releases,
      '3.6.7-ms00380000',
      'darwin',
      'arm64'
    )
    assert.equal(macUpdate?.version, '3.6.7-ms00400000')
  })

  it('does not offer older or identical versions', () => {
    const releases = [release('v3.6.7-ms00395000', [win])]
    assert.equal(
      selectTeamUpdate(releases, '3.6.7-ms00395000', 'win32', 'x64'),
      null
    )
    assert.equal(
      selectTeamUpdate(releases, '3.6.8-ms00000001', 'win32', 'x64'),
      null
    )
  })

  it('updates builds from before team versions', () => {
    const releases = [release('v3.6.7-ms00395000', [win])]
    assert.equal(
      selectTeamUpdate(releases, '3.6.7-beta2', 'win32', 'x64')?.version,
      '3.6.7-ms00395000'
    )
  })

  it('builds the releases URL for GitHub and Gitea', () => {
    assert.equal(
      getReleasesURL({
        provider: 'github',
        server: 'https://github.com',
        owner: 'o',
        repo: 'r',
      }),
      'https://api.github.com/repos/o/r/releases?per_page=30'
    )
    assert.equal(
      getReleasesURL({
        provider: 'gitea',
        server: 'https://gitea.example.com/',
        owner: 'o',
        repo: 'r',
      }),
      'https://gitea.example.com/api/v1/repos/o/r/releases?limit=30'
    )
  })
})
