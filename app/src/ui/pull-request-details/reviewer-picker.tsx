import * as React from 'react'
import { IAPIIdentity, IAPIPullRequestReview } from '../../lib/api'
import { Button } from '../lib/button'
import { Select } from '../lib/select'
import { Octicon } from '../octicons'
import * as octicons from '../octicons/octicons.generated'

/** Where a reviewer is in reviewing the pull request */
export type ReviewerState =
  /** Chosen for a pull request which hasn't been created yet */
  | 'selected'
  /** Asked to review, hasn't reviewed yet */
  | 'requested'
  | IAPIPullRequestReview['state']

export interface IReviewer {
  readonly login: string
  readonly state: ReviewerState
}

const stateLabels: Record<ReviewerState, string> = {
  selected: '',
  requested: 'レビュー待ち',
  PENDING: 'レビュー中',
  APPROVED: '承認済み',
  CHANGES_REQUESTED: '変更要求あり',
  COMMENTED: 'コメント済み',
  DISMISSED: '却下',
}

const stateIcons: Partial<Record<ReviewerState, typeof octicons.check>> = {
  requested: octicons.dotFill,
  PENDING: octicons.dotFill,
  APPROVED: octicons.check,
  CHANGES_REQUESTED: octicons.fileDiff,
  COMMENTED: octicons.comment,
}

/**
 * The reviewers of a pull request: everyone asked to review it and everyone
 * who has, with the state of their latest review.
 */
export function getReviewers(
  author: string,
  reviews: ReadonlyArray<IAPIPullRequestReview>,
  requested: ReadonlyArray<IAPIIdentity>
): ReadonlyArray<IReviewer> {
  const states = new Map<string, ReviewerState>()

  for (const review of reviews) {
    const { login } = review.user
    // Comments don't replace an approval or a request for changes
    const previous = states.get(login)
    if (
      login === author ||
      (review.state === 'COMMENTED' &&
        (previous === 'APPROVED' || previous === 'CHANGES_REQUESTED'))
    ) {
      continue
    }
    states.set(login, review.state)
  }

  // A new request replaces earlier reviews
  for (const user of requested) {
    states.set(user.login, 'requested')
  }

  return Array.from(states, ([login, state]) => ({ login, state }))
}

interface IReviewerPickerProps {
  readonly reviewers: ReadonlyArray<IReviewer>

  /** The users who can be added, null while they're loading */
  readonly candidates: ReadonlyArray<IAPIIdentity> | null

  /** Called to add a reviewer, or undefined when they can't be changed */
  readonly onAdd?: (login: string) => void

  /** Called to remove a reviewer who hasn't reviewed yet */
  readonly onRemove?: (login: string) => void

  readonly disabled?: boolean
}

interface IReviewerChipProps {
  readonly reviewer: IReviewer
  readonly onRemove?: (login: string) => void
  readonly disabled?: boolean
}

class ReviewerChip extends React.Component<IReviewerChipProps> {
  private onRemove = () => this.props.onRemove?.(this.props.reviewer.login)

  public render() {
    const { reviewer, onRemove, disabled } = this.props
    const removable =
      onRemove !== undefined &&
      (reviewer.state === 'selected' || reviewer.state === 'requested')
    const icon = stateIcons[reviewer.state]
    const label = stateLabels[reviewer.state]

    return (
      <li className={`reviewer state-${reviewer.state.toLowerCase()}`}>
        <span className="reviewer-login" translate="no">
          {reviewer.login}
        </span>
        {label.length > 0 && (
          <span className="reviewer-state">
            {icon !== undefined && <Octicon symbol={icon} />}
            {label}
          </span>
        )}
        {removable && (
          <Button
            className="reviewer-remove"
            onClick={this.onRemove}
            disabled={disabled}
            ariaLabel={`${reviewer.login} をレビュワーから外す`}
            tooltip="レビュワーから外す"
          >
            <Octicon symbol={octicons.x} />
          </Button>
        )}
      </li>
    )
  }
}

/** Lists the reviewers of a pull request and lets the user change them. */
export class ReviewerPicker extends React.Component<IReviewerPickerProps> {
  private onSelect = (event: React.FormEvent<HTMLSelectElement>) => {
    const login = event.currentTarget.value
    if (login.length > 0) {
      this.props.onAdd?.(login)
    }
  }

  private renderReviewer = (reviewer: IReviewer) => (
    <ReviewerChip
      key={reviewer.login}
      reviewer={reviewer}
      onRemove={this.props.onRemove}
      disabled={this.props.disabled}
    />
  )

  private renderAdd() {
    const { candidates, reviewers, onAdd, disabled } = this.props
    if (onAdd === undefined) {
      return null
    }

    const current = new Set(reviewers.map(r => r.login))
    const available = (candidates ?? []).filter(c => !current.has(c.login))
    const placeholder =
      candidates === null
        ? '読み込んでいます…'
        : available.length === 0
        ? '追加できるユーザーはいません'
        : 'レビュワーを追加…'

    return (
      <Select
        className="reviewer-add"
        label="レビュワーを追加"
        value=""
        onChange={this.onSelect}
        disabled={disabled || available.length === 0}
      >
        <option value="">{placeholder}</option>
        {available.map(c => (
          <option key={c.login} value={c.login} translate="no">
            {c.login}
          </option>
        ))}
      </Select>
    )
  }

  public render() {
    const { reviewers } = this.props

    return (
      <div className="reviewer-picker">
        {reviewers.length > 0 ? (
          <ul className="reviewer-list">
            {reviewers.map(this.renderReviewer)}
          </ul>
        ) : (
          <p className="reviewer-empty">レビュワーはいません。</p>
        )}
        {this.renderAdd()}
      </div>
    )
  }
}
