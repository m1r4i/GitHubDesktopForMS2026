import assert from 'node:assert'
import { afterEach, beforeEach, describe, it, mock } from 'node:test'
import * as React from 'react'
import { ipcRenderer } from 'electron'

import { fireEvent, render, screen, waitFor } from '../../helpers/ui/render'
import { gitHubRepoFixture } from '../../helpers/github-repo-builder'
import {
  API,
  getDotComAPIEndpoint,
  IAPIPullRequestDetails,
} from '../../../src/lib/api'
import { Account } from '../../../src/models/account'
import { PopupType } from '../../../src/models/popup'
import {
  Repository,
  RepositoryWithGitHubRepository,
} from '../../../src/models/repository'
import type { Dispatcher } from '../../../src/ui/dispatcher'
import { PullRequestListDialog } from '../../../src/ui/pull-request-list/pull-request-list-dialog'
import { ReviewerPicker } from '../../../src/ui/pull-request-details/reviewer-picker'

const user = (login: string) => ({
  id: 1,
  login,
  avatar_url: '',
  html_url: '',
  type: 'User' as const,
})

function pullRequest(
  prNumber: number,
  title: string,
  fields: Partial<IAPIPullRequestDetails> = {}
): IAPIPullRequestDetails {
  const ref = (name: string) => ({ ref: name, sha: 'abc', repo: null })
  return {
    number: prNumber,
    title,
    created_at: '2026-10-01T00:00:00Z',
    updated_at: '2026-10-01T00:00:00Z',
    user: user('alice'),
    head: ref(`feature-${prNumber}`),
    base: ref('main'),
    body: '',
    state: 'open',
    draft: false,
    ...fields,
  }
}

const account = new Account(
  'alice',
  getDotComAPIEndpoint(),
  'token',
  [],
  '',
  1,
  'Alice'
)

const repository = new Repository(
  '/tmp/desktop',
  1,
  gitHubRepoFixture({ owner: 'team', name: 'app' }),
  false
) as RepositoryWithGitHubRepository

describe('PullRequestListDialog', () => {
  const previousSend = ipcRenderer.send

  beforeEach(() => {
    // Dialogs tell the main process when they open and close
    ipcRenderer.send = () => {}
  })

  afterEach(() => {
    ipcRenderer.send = previousSend
    mock.restoreAll()
  })

  it('lists the pull requests of the repository and opens one', async () => {
    const fetchPage = mock.method(
      API.prototype,
      'fetchPullRequestsPage',
      async (
        _owner: string,
        _name: string,
        state: string
      ): Promise<ReadonlyArray<IAPIPullRequestDetails>> =>
        state === 'open'
          ? [
              pullRequest(2, 'Add the team bar', {
                requested_reviewers: [user('bob')],
              }),
              pullRequest(1, 'Fix the build', { draft: true }),
            ]
          : [
              pullRequest(3, 'Old change', {
                state: 'closed',
                merged_at: '2026-09-01T00:00:00Z',
              }),
            ]
    )
    const popups = new Array<unknown>()
    const dispatcher = {
      showPopup: (popup: unknown) => popups.push(popup),
    } as unknown as Dispatcher

    render(
      <PullRequestListDialog
        dispatcher={dispatcher}
        repository={repository}
        account={account}
        owner="team"
        name="app"
        onDismissed={() => {}}
      />
    )

    await waitFor(() => assert.ok(screen.getByText('Add the team bar')))
    assert.ok(screen.getByText('Fix the build'))
    assert.deepEqual(fetchPage.mock.calls[0].arguments.slice(0, 4), [
      'team',
      'app',
      'open',
      1,
    ])

    // Filtering happens as you type
    fireEvent.change(screen.getByLabelText('プルリクエストを絞り込む'), {
      target: { value: '#1' },
    })
    await waitFor(() =>
      assert.equal(screen.queryByText('Add the team bar'), null)
    )
    assert.ok(screen.getByText('Fix the build'))

    fireEvent.click(screen.getByText('Fix the build'))
    assert.deepEqual(popups, [
      {
        type: PopupType.PullRequestDetails,
        repository,
        owner: 'team',
        name: 'app',
        pullRequestNumber: 1,
      },
    ])

    // Closed pull requests
    fireEvent.change(screen.getByLabelText('プルリクエストを絞り込む'), {
      target: { value: '' },
    })
    fireEvent.click(screen.getByText('クローズ済み'))
    await waitFor(() => assert.ok(screen.getByText('Old change')))
    assert.equal(fetchPage.mock.calls[1].arguments[2], 'closed')
  })
})

describe('ReviewerPicker', () => {
  it('adds candidates and removes reviewers who have not reviewed yet', () => {
    const added = new Array<string>()
    const removed = new Array<string>()

    render(
      <ReviewerPicker
        reviewers={[
          { login: 'bob', state: 'requested' },
          { login: 'carol', state: 'APPROVED' },
        ]}
        candidates={[user('bob'), user('carol'), user('dave')]}
        onAdd={login => added.push(login)}
        onRemove={login => removed.push(login)}
      />
    )

    assert.ok(screen.getByText('承認'))
    assert.ok(screen.getByText('レビュー待ち'))

    // Only people who aren't reviewers yet can be added
    const select = screen.getByLabelText(
      'レビュワーを追加'
    ) as HTMLSelectElement
    const options = Array.from(select.options).map(o => o.value)
    assert.deepEqual(options, ['', 'dave'])

    fireEvent.change(select, { target: { value: 'dave' } })
    assert.deepEqual(added, ['dave'])

    // Reviews can't be taken back, requests can
    const removeButtons = screen.getAllByRole('button', {
      name: /をレビュワーから外す$/,
    })
    assert.equal(removeButtons.length, 1)
    fireEvent.click(removeButtons[0])
    assert.deepEqual(removed, ['bob'])
  })
})
