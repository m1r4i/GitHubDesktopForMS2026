/**
 * Publish the last `yarn build:team` build as a release of the team's
 * repository (see app/src/lib/team-release-source.ts), from which installed
 * copies of MS2026 Desktop update themselves.
 *
 * Needs a token which can create releases in MS2026_RELEASE_TOKEN (or
 * GITHUB_TOKEN / GITEA_TOKEN depending on where releases live).
 */

import { existsSync, readdirSync, readFileSync, statSync } from 'fs'
import * as Path from 'path'
import { getDistArchitecture, getDistRoot } from './dist-info'
import {
  getReleaseSourceAPIEndpoint,
  isAssetForPlatform,
  teamReleaseSource,
} from '../app/src/lib/team-release-source'

const source = teamReleaseSource
const api = getReleaseSourceAPIEndpoint(source)
const repoPath = `repos/${source.owner}/${source.repo}`

function fail(message: string): never {
  console.error(message)
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

/** Find the installer (Windows) or archive (macOS) of the last build */
function findAsset(dir: string): string | null {
  for (const entry of readdirSync(dir)) {
    const path = Path.join(dir, entry)
    if (statSync(path).isDirectory()) {
      const found = findAsset(path)
      if (found !== null) {
        return found
      }
    } else if (
      isAssetForPlatform(entry, process.platform, getDistArchitecture())
    ) {
      return path
    }
  }
  return null
}

async function request(
  method: string,
  url: string,
  token: string,
  body?: BodyInit,
  contentType = 'application/json'
) {
  const response = await fetch(url, {
    method,
    headers: {
      Authorization: `token ${token}`,
      Accept: 'application/json',
      'User-Agent': 'MS2026Desktop-publisher',
      ...(body !== undefined && !(body instanceof FormData)
        ? { 'Content-Type': contentType }
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

async function upload(release: any, file: string, token: string) {
  const name = Path.basename(file)
  const data = readFileSync(file)

  if (source.provider === 'github') {
    const uploadURL = String(release.upload_url).replace(/\{.*\}$/, '')
    return request(
      'POST',
      `${uploadURL}?name=${encodeURIComponent(name)}`,
      token,
      data,
      'application/octet-stream'
    )
  }

  const form = new FormData()
  form.append('attachment', new Blob([data]), name)
  return request(
    'POST',
    `${api}/${repoPath}/releases/${release.id}/assets?name=${encodeURIComponent(
      name
    )}`,
    token,
    form
  )
}

async function main() {
  const token = getToken()
  const version = getBuiltVersion()
  const asset = findAsset(getDistRoot())

  if (asset === null) {
    fail(`No build for ${process.platform} found in ${getDistRoot()}`)
  }

  const platform = process.platform === 'darwin' ? 'macOS' : 'Windows'
  const tag = `v${version}`
  console.log(`Publishing ${Path.basename(asset)} as ${tag}…`)

  const release = await getOrCreateRelease(
    tag,
    `MS2026 Desktop ${version} (${platform})`,
    token
  )
  await upload(release, asset, token)

  console.log(`Published ${release.html_url}`)
}

main().catch(e => fail(`${e}`))
