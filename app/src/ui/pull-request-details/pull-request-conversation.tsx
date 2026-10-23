import * as React from 'react'
import {
  IAPIComment,
  IAPIPullRequestReview,
  PullRequestReviewEvent,
} from '../../lib/api'
import { Button } from '../lib/button'
import { TextArea } from '../lib/text-area'
import { Octicon } from '../octicons'
import * as octicons from '../octicons/octicons.generated'
import { RelativeTime } from '../relative-time'

/** A comment or a review in the conversation of a pull request */
export interface IConversationItem {
  readonly key: string
  readonly login: string
  readonly date: Date
  readonly body: string
  /** The verdict of a review, or undefined for a comment */
  readonly review?: IAPIPullRequestReview['state']
}

/**
 * Merge the comments and reviews of a pull request into one conversation,
 * oldest first. Reviews without a verdict or text are left out.
 */
export function getConversation(
  comments: ReadonlyArray<IAPIComment>,
  reviews: ReadonlyArray<IAPIPullRequestReview>
): ReadonlyArray<IConversationItem> {
  const items: IConversationItem[] = [
    ...comments.map(c => ({
      key: `comment-${c.id}`,
      login: c.user.login,
      date: new Date(c.created_at),
      body: c.body ?? '',
    })),
    ...reviews
      .filter(
        r =>
          r.state !== 'PENDING' &&
          (r.state !== 'COMMENTED' || (r.body ?? '').trim().length > 0)
      )
      .map(r => ({
        key: `review-${r.id}`,
        login: r.user.login,
        date: new Date(r.submitted_at),
        body: r.body ?? '',
        review: r.state,
      })),
  ]

  return items.sort((a, b) => a.date.getTime() - b.date.getTime())
}

const reviewActions: Partial<Record<IAPIPullRequestReview['state'], string>> = {
  APPROVED: '承認しました',
  CHANGES_REQUESTED: '変更を要求しました',
  COMMENTED: 'レビューしました',
  DISMISSED: 'レビューが却下されました',
}

const reviewIcons: Partial<
  Record<IAPIPullRequestReview['state'], typeof octicons.check>
> = {
  APPROVED: octicons.check,
  CHANGES_REQUESTED: octicons.fileDiff,
  COMMENTED: octicons.eye,
}

interface IPullRequestConversationProps {
  readonly items: ReadonlyArray<IConversationItem>

  /** Whether the user can approve or request changes (not their own) */
  readonly canReview: boolean

  readonly onComment: (body: string) => Promise<boolean>
  readonly onReview: (
    event: PullRequestReviewEvent,
    body: string
  ) => Promise<boolean>

  readonly disabled: boolean
}

interface IPullRequestConversationState {
  readonly draft: string
}

/** The comments and reviews of a pull request, and a box to add yours. */
export class PullRequestConversation extends React.Component<
  IPullRequestConversationProps,
  IPullRequestConversationState
> {
  public constructor(props: IPullRequestConversationProps) {
    super(props)
    this.state = { draft: '' }
  }

  private onDraftChanged = (draft: string) => this.setState({ draft })

  /** Clear the draft once it's been posted */
  private async send(post: Promise<boolean>) {
    if (await post) {
      this.setState({ draft: '' })
    }
  }

  private onComment = () =>
    this.send(this.props.onComment(this.state.draft.trim()))

  private onApprove = () =>
    this.send(this.props.onReview('APPROVE', this.state.draft.trim()))

  private onRequestChanges = () =>
    this.send(this.props.onReview('REQUEST_CHANGES', this.state.draft.trim()))

  private renderItem = (item: IConversationItem) => {
    const action =
      item.review !== undefined ? reviewActions[item.review] : undefined
    const icon =
      item.review !== undefined ? reviewIcons[item.review] : undefined

    return (
      <li
        key={item.key}
        className={`conversation-item ${
          item.review !== undefined ? `review ${item.review.toLowerCase()}` : ''
        }`}
      >
        <div className="conversation-header">
          {icon !== undefined && <Octicon symbol={icon} />}
          <span className="conversation-login" translate="no">
            {item.login}
          </span>
          {action !== undefined && (
            <span className="conversation-action">{action}</span>
          )}
          <RelativeTime className="conversation-date" date={item.date} />
        </div>
        {item.body.trim().length > 0 && (
          <div className="conversation-body" translate="no">
            {item.body}
          </div>
        )}
      </li>
    )
  }

  public render() {
    const { items, canReview, disabled } = this.props
    const hasText = this.state.draft.trim().length > 0

    return (
      <div className="pr-conversation">
        {items.length > 0 ? (
          <ul className="conversation-list">{items.map(this.renderItem)}</ul>
        ) : (
          <p className="conversation-empty">コメントはまだありません。</p>
        )}
        <TextArea
          label="コメント"
          value={this.state.draft}
          onValueChanged={this.onDraftChanged}
          placeholder="コメントを書く"
          rows={3}
          disabled={disabled}
        />
        <div className="conversation-actions">
          {canReview && (
            <>
              <Button onClick={this.onApprove} disabled={disabled}>
                <Octicon symbol={octicons.check} />
                承認
              </Button>
              <Button
                onClick={this.onRequestChanges}
                disabled={disabled || !hasText}
                tooltip={
                  hasText
                    ? undefined
                    : '変更を要求するにはコメントを書いてください'
                }
              >
                <Octicon symbol={octicons.fileDiff} />
                変更を要求
              </Button>
            </>
          )}
          <Button onClick={this.onComment} disabled={disabled || !hasText}>
            <Octicon symbol={octicons.comment} />
            コメント
          </Button>
        </div>
      </div>
    )
  }
}
