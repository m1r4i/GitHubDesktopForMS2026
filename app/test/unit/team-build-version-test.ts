import { describe, it } from 'node:test'
import assert from 'node:assert'
import * as semver from 'semver'
import { getTeamBuildVersion } from '../../../script/build-team'

describe('getTeamBuildVersion', () => {
  it('numbers builds by the minutes since 2026', () => {
    assert.equal(
      getTeamBuildVersion('3.6.7-beta2', new Date(Date.UTC(2026, 0, 1, 1, 5))),
      '3.6.7-ms00000065'
    )
  })

  it('keeps the build number within a 32 bit integer for Squirrel', () => {
    const version = getTeamBuildVersion('3.6.7', new Date(Date.UTC(2100, 0, 1)))
    const buildNumber = parseInt(version.replace(/^.*-ms/, ''), 10)
    assert(buildNumber < 2 ** 31 - 1)
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
    // Sorts the same way as text as it does as a number
    assert(second > first)
    // NuGet/Squirrel only accept SemVer 1 pre-release labels (no dots)
    assert.match(second, /^\d+\.\d+\.\d+-[0-9A-Za-z-]+$/)
  })
})
