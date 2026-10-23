import { describe, it } from 'node:test'
import assert from 'node:assert'
import {
  getDotComAPIEndpoint,
  IAPIComment,
  IAPIPullRequestDetails,
  IAPIPullRequestReview,
} from '../../src/lib/api'
import { Account } from '../../src/models/account'
import { getConversation } from '../../src/ui/pull-request-details/pull-request-conversation'
import { filterByAuthor } from '../../src/ui/pull-request-list/pull-request-list-dialog'
import {
  getReviewRequestKey,
  getReviewRequests,
  IReviewRequestSource,
} from '../../src/lib/review-requests'
import { translate } from '../../src/lib/i18n/translate'

const user = (login: string) => ({
  id: 1,
  login,
  avatar_url: '',
  html_url: '',
  type: 'User' as const,
})

const comment = (id: number, login: string, date: string): IAPIComment => ({
  id,
  body: `comment ${id}`,
  html_url: '',
  user: user(login),
  created_at: date,
})

const review = (
  id: number,
  state: IAPIPullRequestReview['state'],
  date: string,
  body = ''
): IAPIPullRequestReview => ({
  id,
  user: user('bob'),
  body,
  html_url: '',
  submitted_at: date,
  state,
})

function pr(
  prNumber: number,
  author: string,
  reviewers: ReadonlyArray<string> = [],
  state: 'open' | 'closed' = 'open'
): IAPIPullRequestDetails {
  const ref = { ref: 'x', sha: 'abc', repo: null }
  return {
    number: prNumber,
    title: `PR ${prNumber}`,
    created_at: '',
    updated_at: '',
    user: user(author),
    head: ref,
    base: ref,
    body: '',
    state,
    requested_reviewers: reviewers.map(user),
  }
}

describe('getConversation', () => {
  it('merges comments and reviews by date, leaving out empty reviews', () => {
    const items = getConversation(
      [
        comment(1, 'alice', '2026-10-01T10:00:00Z'),
        comment(2, 'bob', '2026-10-01T12:00:00Z'),
      ],
      [
        review(10, 'APPROVED', '2026-10-01T11:00:00Z'),
        // A review which only has comments on the code
        review(11, 'COMMENTED', '2026-10-01T11:30:00Z'),
        review(12, 'PENDING', '2026-10-01T11:40:00Z', 'draft'),
        review(13, 'CHANGES_REQUESTED', '2026-10-01T13:00:00Z', 'Fix it'),
      ]
    )

    assert.deepEqual(
      items.map(i => [i.key, i.review]),
      [
        ['comment-1', undefined],
        ['review-10', 'APPROVED'],
        ['comment-2', undefined],
        ['review-13', 'CHANGES_REQUESTED'],
      ]
    )
  })
})

describe('filterByAuthor', () => {
  const prs = [pr(1, 'me'), pr(2, 'alice', ['me']), pr(3, 'alice', ['bob'])]

  it('keeps everything for everyone', () => {
    assert.equal(filterByAuthor(prs, 'everyone', 'me').length, 3)
  })

  it('keeps your own pull requests', () => {
    assert.deepEqual(
      filterByAuthor(prs, 'mine', 'me').map(p => p.number),
      [1]
    )
  })

  it('keeps the pull requests waiting for your review', () => {
    assert.deepEqual(
      filterByAuthor(prs, 'review-requested', 'me').map(p => p.number),
      [2]
    )
  })
})

describe('getReviewRequests', () => {
  const account = new Account(
    'me',
    getDotComAPIEndpoint(),
    'token',
    [],
    '',
    1,
    'Me'
  )
  const source = {
    account,
    owner: 'team',
    name: 'app',
  } as unknown as IReviewRequestSource

  it('finds open pull requests waiting for your review', () => {
    const requests = getReviewRequests(source, [
      pr(1, 'alice', ['me']),
      pr(2, 'alice', ['bob']),
      pr(3, 'alice', ['me'], 'closed'),
    ])

    assert.deepEqual(
      requests.map(r => [r.number, r.author]),
      [[1, 'alice']]
    )
    assert.equal(
      getReviewRequestKey(requests[0]),
      `${getDotComAPIEndpoint()}|team/app#1`
    )
  })
})

describe('home screen translations', () => {
  it('translates the suggestions for the current branch', () => {
    assert.equal(
      translate(
        "The current branch ({0}) hasn't been published to the remote yet. By publishing it to Gitea you can share it, open a pull request, and collaborate with others.",
        'ja'
      ),
      '現在のブランチ ({0}) はまだリモートに公開されていません。Gitea に公開すると、共有、プルリクエストの作成や共同作業ができます。'
    )
    assert.equal(
      translate(
        'You have 2 local commits and 1 tag waiting to be pushed to GitHub.',
        'ja'
      ),
      'GitHub にプッシュしていないローカルコミット 2 個とタグ 1 個があります。'
    )
  })
})
