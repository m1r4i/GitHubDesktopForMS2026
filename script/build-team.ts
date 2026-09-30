/**
 * Build and package MS2026 Desktop for the production channel.
 *
 * Every build gets a version that is higher than the previous one
 * (`<major>.<minor>.<patch>-ms<build number>`) so that running a newer
 * installer updates an existing installation in place. Squirrel.Windows
 * doesn't reinstall a version that is already installed. Set
 * DESKTOP_VERSION_OVERRIDE to use a specific version instead.
 */

import { spawnSync } from 'child_process'
import { version } from '../app/package.json'

/** Builds are numbered by the minutes elapsed since this date (UTC) */
const buildNumberEpoch = Date.UTC(2026, 0, 1)

/**
 * The version for a team build made at the given time.
 *
 * Squirrel.Windows compares the number at the end of a pre-release label as
 * a 32 bit integer, and NuGet only supports SemVer 1 pre-release labels
 * (letters, digits and hyphens, no dots). The build number is therefore the
 * minutes since 2026-01-01, zero padded to 8 digits so that it also sorts
 * correctly as text, e.g. `3.6.7-ms00391685`.
 */
export function getTeamBuildVersion(baseVersion: string, date: Date) {
  const minutes = Math.max(
    0,
    Math.floor((date.getTime() - buildNumberEpoch) / 60000)
  )
  const buildNumber = minutes.toString().padStart(8, '0')
  const [release] = baseVersion.split('-')
  return `${release}-ms${buildNumber}`
}

function run(command: string, env: NodeJS.ProcessEnv) {
  const result = spawnSync(command, { stdio: 'inherit', shell: true, env })
  if (result.status !== 0) {
    process.exit(result.status ?? 1)
  }
}

if (require.main === module) {
  const teamVersion =
    process.env.DESKTOP_VERSION_OVERRIDE ||
    getTeamBuildVersion(version, new Date())

  console.log(`Building MS2026 Desktop ${teamVersion}…`)

  const env = {
    ...process.env,
    RELEASE_CHANNEL: 'production',
    DESKTOP_VERSION_OVERRIDE: teamVersion,
  }

  run('yarn build:prod', env)
  run('yarn package', env)

  console.log(`Built MS2026 Desktop ${teamVersion}`)
}
