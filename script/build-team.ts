/**
 * Build and package MS2026 Desktop for the production channel.
 *
 * Every build gets a version that is higher than the previous one
 * (`<major>.<minor>.<patch>-ms<UTC yyyymmddHHMM>`) so that running a newer
 * installer updates an existing installation in place. Squirrel.Windows
 * doesn't reinstall a version that is already installed. Set
 * DESKTOP_VERSION_OVERRIDE to use a specific version instead.
 */

import { spawnSync } from 'child_process'
import { version } from '../app/package.json'

/** The version for a team build made at the given time. */
export function getTeamBuildVersion(baseVersion: string, date: Date) {
  const pad = (n: number) => n.toString().padStart(2, '0')
  const stamp =
    `${date.getUTCFullYear()}${pad(date.getUTCMonth() + 1)}` +
    `${pad(date.getUTCDate())}${pad(date.getUTCHours())}` +
    `${pad(date.getUTCMinutes())}`

  // NuGet (used by Squirrel.Windows) only supports SemVer 1 pre-release
  // labels, i.e. letters, digits and hyphens without dots.
  const [release] = baseVersion.split('-')
  return `${release}-ms${stamp}`
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
