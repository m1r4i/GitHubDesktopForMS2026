import { describe, it } from 'node:test'
import assert from 'node:assert'
import { IAPIPullRequestReview } from '../../src/lib/api'
import { getReviewers } from '../../src/ui/pull-request-details/reviewer-picker'
import { getPullRequestStatus } from '../../src/ui/pull-request-details/pull-request-status'

const user = (login: string) => ({
  id: 1,
  login,
  avatar_url: '',
  html_url: '',
  type: 'User' as const,
})

const review = (
  login: string,
  state: IAPIPullRequestReview['state']
): IAPIPullRequestReview => ({
  id: 1,
  user: user(login),
  body: '',
  html_url: '',
  submitted_at: '2026-10-01T00:00:00Z',
  state,
})

describe('getReviewers', () => {
  it('shows the latest review of each reviewer', () => {
    const reviewers = getReviewers(
      'author',
      [
        review('alice', 'CHANGES_REQUESTED'),
        review('bob', 'COMMENTED'),
        review('alice', 'APPROVED'),
      ],
      []
    )
    assert.deepEqual(reviewers, [
      { login: 'alice', state: 'APPROVED' },
      { login: 'bob', state: 'COMMENTED' },
    ])
  })

  it('keeps an approval when the reviewer comments afterwards', () => {
    const reviewers = getReviewers(
      'author',
      [review('alice', 'APPROVED'), review('alice', 'COMMENTED')],
      []
    )
    assert.deepEqual(reviewers, [{ login: 'alice', state: 'APPROVED' }])
  })

  it('shows requested reviewers and ignores the author', () => {
    const reviewers = getReviewers(
      'author',
      [review('author', 'COMMENTED'), review('alice', 'APPROVED')],
      [user('alice'), user('carol')]
    )
    assert.deepEqual(reviewers, [
      { login: 'alice', state: 'requested' },
      { login: 'carol', state: 'requested' },
    ])
  })
})

describe('getPullRequestStatus', () => {
  const pr = (fields: object) =>
    ({
      number: 1,
      title: 'x',
      state: 'open',
      draft: false,
      ...fields,
    } as any)

  it('tells open, draft, merged and closed pull requests apart', () => {
    assert.equal(getPullRequestStatus(pr({})), 'open')
    assert.equal(getPullRequestStatus(pr({ draft: true })), 'draft')
    assert.equal(getPullRequestStatus(pr({ state: 'closed' })), 'closed')
    assert.equal(
      getPullRequestStatus(pr({ state: 'closed', merged: true })),
      'merged'
    )
    // Lists only include merged_at
    assert.equal(
      getPullRequestStatus(
        pr({ state: 'closed', merged_at: '2026-10-01T00:00:00Z' })
      ),
      'merged'
    )
  })
})
