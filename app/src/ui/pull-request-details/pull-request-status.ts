import { IAPIPullRequestDetails } from '../../lib/api'
import * as octicons from '../octicons/octicons.generated'

export type PullRequestStatus = 'open' | 'draft' | 'merged' | 'closed'

/** Whether a pull request is open (or a draft), merged or closed. */
export function getPullRequestStatus(
  pr: IAPIPullRequestDetails
): PullRequestStatus {
  // Lists only include when a pull request was merged, not whether it was
  if (pr.merged || (pr.merged_at !== undefined && pr.merged_at !== null)) {
    return 'merged'
  } else if (pr.state === 'closed') {
    return 'closed'
  }
  return pr.draft ? 'draft' : 'open'
}

export const pullRequestStatusLabels: Record<PullRequestStatus, string> = {
  open: 'オープン',
  draft: '下書き',
  merged: 'マージ済み',
  closed: 'クローズ済み',
}

export const pullRequestStatusIcons: Record<
  PullRequestStatus,
  typeof octicons.gitPullRequest
> = {
  open: octicons.gitPullRequest,
  draft: octicons.gitPullRequestDraft,
  merged: octicons.gitMerge,
  closed: octicons.gitPullRequestClosed,
}
