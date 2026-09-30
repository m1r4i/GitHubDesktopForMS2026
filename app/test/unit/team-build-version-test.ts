import { describe, it } from 'node:test'
import assert from 'node:assert'
import * as semver from 'semver'
import { getTeamBuildVersion } from '../../../script/build-team'

describe('getTeamBuildVersion', () => {
  it('stamps the release with the build time', () => {
    assert.equal(
      getTeamBuildVersion('3.6.7-beta2', new Date(Date.UTC(2026, 8, 30, 3, 5))),
      '3.6.7-ms202609300305'
    )
  })

  it('produces increasing versions installers can update to', () => {
    const first = getTeamBuildVersion(
      '3.6.7-beta2',
      new Date(Date.UTC(2026, 8, 30, 23, 59))
    )
    const second = getTeamBuildVersion(
      '3.6.7-beta2',
      new Date(Date.UTC(2026, 9, 1, 0, 0))
    )

    assert(semver.gt(first, '3.6.7-beta2'))
    assert(semver.gt(second, first))
    // NuGet/Squirrel only accept SemVer 1 pre-release labels (no dots)
    assert.match(second, /^\d+\.\d+\.\d+-[0-9A-Za-z-]+$/)
  })
})
