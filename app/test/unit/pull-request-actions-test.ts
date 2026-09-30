import { describe, it, mock } from 'node:test'
import assert from 'node:assert'
import { API } from '../../src/lib/api'

interface IRecordedRequest {
  readonly method: string
  readonly path: string
  readonly body: unknown
}

/** Stub fetch, recording requests and replying with the given response. */
function stubFetch(
  t: { after: (fn: () => void) => void },
  reply: (req: IRecordedRequest) => Response
) {
  const requests = new Array<IRecordedRequest>()
  const fetchMock = mock.method(
    globalThis,
    'fetch',
    async (input: any, init?: RequestInit) => {
      const url = new URL(`${input}`)
      const req = {
        method: init?.method ?? 'GET',
        path: url.pathname,
        body: init?.body ? JSON.parse(`${init.body}`) : undefined,
      }
      requests.push(req)
      return reply(req)
    }
  )
  t.after(() => fetchMock.mock.restore())
  return requests
}

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json' },
  })

const gitea = new API('https://gitea.example.com/api/v1', 'token')
const github = new API('https://api.github.com', 'token')

const apiPullRequest = {
  number: 7,
  title: 'Add feature',
  created_at: '2026-01-01T00:00:00Z',
  updated_at: '2026-01-01T00:00:00Z',
  user: { id: 1, login: 'ada', avatar_url: '', html_url: '', type: 'User' },
  head: { ref: 'feature', sha: 'abc', repo: null },
  base: { ref: 'main', sha: 'def', repo: null },
  body: 'body',
  state: 'open',
}

describe('pull request actions', () => {
  it('creates pull requests', async t => {
    const requests = stubFetch(t, () => json(apiPullRequest, 201))

    const pr = await gitea.createPullRequest('HAL', 'Project', {
      title: 'Add feature',
      body: 'body',
      head: 'feature',
      base: 'main',
    })

    assert.equal(pr.number, 7)
    assert.deepEqual(requests, [
      {
        method: 'POST',
        path: '/api/v1/repos/HAL/Project/pulls',
        body: {
          title: 'Add feature',
          body: 'body',
          head: 'feature',
          base: 'main',
        },
      },
    ])
  })

  it('merges on Gitea with its own parameters', async t => {
    const requests = stubFetch(t, () => new Response(null, { status: 200 }))

    await gitea.mergePullRequest('HAL', 'Project', 7, 'squash', 'feature')

    assert.deepEqual(requests, [
      {
        method: 'POST',
        path: '/api/v1/repos/HAL/Project/pulls/7/merge',
        body: { Do: 'squash', delete_branch_after_merge: true },
      },
    ])
  })

  it('merges on GitHub and deletes the branch separately', async t => {
    const requests = stubFetch(t, req =>
      req.method === 'PUT'
        ? json({ merged: true })
        : new Response(null, { status: 204 })
    )

    await github.mergePullRequest('octo', 'repo', 7, 'rebase', 'feat/x')

    assert.deepEqual(requests, [
      {
        method: 'PUT',
        path: '/repos/octo/repo/pulls/7/merge',
        body: { merge_method: 'rebase' },
      },
      {
        method: 'DELETE',
        path: '/repos/octo/repo/git/refs/heads/feat/x',
        body: undefined,
      },
    ])
  })

  it('reports why a merge failed', async t => {
    stubFetch(t, () => json({ message: 'Please try again later' }, 405))

    await assert.rejects(
      gitea.mergePullRequest('HAL', 'Project', 7, 'merge', null),
      /Please try again later/
    )
  })

  it('closes pull requests', async t => {
    const requests = stubFetch(t, () =>
      json({ ...apiPullRequest, state: 'closed' })
    )

    await gitea.closePullRequest('HAL', 'Project', 7)

    assert.deepEqual(requests, [
      {
        method: 'PATCH',
        path: '/api/v1/repos/HAL/Project/pulls/7',
        body: { state: 'closed' },
      },
    ])
  })
})
