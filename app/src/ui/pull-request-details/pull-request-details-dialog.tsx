import * as React from 'react'
import {
  API,
  IAPIComment,
  IAPIIdentity,
  IAPILabel,
  IAPIPullRequestDetails,
  IAPIPullRequestReview,
  PullRequestMergeMethod,
  PullRequestReviewEvent,
} from '../../lib/api'
import { getPullRequestURL } from '../../lib/gitea'
import { Account } from '../../models/account'
import { RepositoryWithGitHubRepository } from '../../models/repository'
import {
  Dialog,
  DialogContent,
  DialogError,
  DialogFooter,
  OkCancelButtonGroup,
} from '../dialog'
import { Dispatcher } from '../dispatcher'
import { Button } from '../lib/button'
import { Checkbox, CheckboxValue } from '../lib/checkbox'
import { Ref } from '../lib/ref'
import { Select } from '../lib/select'
import { Octicon } from '../octicons'
import * as octicons from '../octicons/octicons.generated'
import { getReviewers, ReviewerPicker } from './reviewer-picker'
import { ITag, TagPicker } from './tag-picker'
import {
  getConversation,
  PullRequestConversation,
} from './pull-request-conversation'
import {
  getPullRequestStatus,
  pullRequestStatusLabels,
} from './pull-request-status'

interface IPullRequestDetailsDialogProps {
  readonly dispatcher: Dispatcher
  readonly repository: RepositoryWithGitHubRepository
  readonly account: Account | null

  /** The owner of the repository the pull request was opened against */
  readonly owner: string
  /** The name of the repository the pull request was opened against */
  readonly name: string
  readonly pullRequestNumber: number

  readonly onDismissed: () => void
}

interface IPullRequestDetailsDialogState {
  readonly pullRequest: IAPIPullRequestDetails | null
  readonly reviews: ReadonlyArray<IAPIPullRequestReview>
  readonly comments: ReadonlyArray<IAPIComment>
  /** The users who can review or be assigned, null while loading */
  readonly reviewerCandidates: ReadonlyArray<IAPIIdentity> | null
  /** The labels of the repository, null while loading */
  readonly labels: ReadonlyArray<IAPILabel> | null
  readonly loading: boolean
  readonly busy: boolean
  readonly error: string | null
  readonly mergeMethod: PullRequestMergeMethod
  readonly deleteBranch: boolean
}

const mergeMethodLabels: Record<PullRequestMergeMethod, string> = {
  merge: 'マージコミットを作成',
  squash: 'スカッシュしてマージ',
  rebase: 'リベースしてマージ',
}

const getStatus = getPullRequestStatus

const errorMessage = (e: unknown) => (e instanceof Error ? e.message : `${e}`)

/**
 * A dialog showing a pull request which lets the user merge or close it
 * without leaving the app.
 */
export class PullRequestDetailsDialog extends React.Component<
  IPullRequestDetailsDialogProps,
  IPullRequestDetailsDialogState
> {
  private mounted = false

  public constructor(props: IPullRequestDetailsDialogProps) {
    super(props)
    this.state = {
      pullRequest: null,
      reviews: [],
      comments: [],
      reviewerCandidates: null,
      labels: null,
      loading: true,
      busy: false,
      error: null,
      mergeMethod: 'merge',
      deleteBranch: true,
    }
  }

  public componentDidMount() {
    this.mounted = true
    this.load()
  }

  public componentWillUnmount() {
    this.mounted = false
  }

  private get api() {
    const { account } = this.props
    return account === null ? null : API.fromAccount(account)
  }

  private async load() {
    const { api } = this
    if (api === null) {
      this.setState({
        loading: false,
        error: 'このリポジトリのアカウントが見つかりません。',
      })
      return
    }

    const { owner, name } = this.props

    // Reviews and reviewers are extras, don't fail when they can't be loaded
    api
      .fetchReviewerCandidates(owner, name)
      .catch(e => {
        log.warn('Failed to load the reviewer candidates', e)
        return []
      })
      .then(reviewerCandidates => {
        if (this.mounted) {
          this.setState({ reviewerCandidates })
        }
      })

    api
      .fetchLabels(owner, name)
      .catch(e => {
        log.warn('Failed to load the labels', e)
        return []
      })
      .then(labels => {
        if (this.mounted) {
          this.setState({ labels })
        }
      })

    try {
      const state = await this.fetchPullRequest(api)
      if (this.mounted) {
        this.setState({ ...state, loading: false })
      }
    } catch (e) {
      if (this.mounted) {
        this.setState({ loading: false, error: errorMessage(e) })
      }
    }
  }

  /** The pull request with its reviews and comments */
  private async fetchPullRequest(api: API) {
    const { owner, name, pullRequestNumber: n } = this.props
    const [pullRequest, reviews, comments] = await Promise.all([
      api.fetchPullRequestDetails(owner, name, n),
      // Reviews and comments are extras, don't fail when they can't be loaded
      api.fetchAllPullRequestReviews(owner, name, n).catch(e => {
        log.warn('Failed to load the pull request reviews', e)
        return []
      }),
      api.fetchPullRequestConversation(owner, name, n).catch(e => {
        log.warn('Failed to load the pull request comments', e)
        return []
      }),
    ])
    return { pullRequest, reviews, comments }
  }

  /**
   * Change the pull request and show the result.
   *
   * @returns whether the change succeeded
   */
  private async update(
    change: (api: API) => Promise<void>,
    failure: string
  ): Promise<boolean> {
    const { api } = this
    if (api === null) {
      return false
    }

    this.setState({ busy: true, error: null })
    try {
      await change(api)
      const state = await this.fetchPullRequest(api)
      if (this.mounted) {
        this.setState({ ...state, busy: false })
      }
      return true
    } catch (e) {
      if (this.mounted) {
        this.setState({
          busy: false,
          error: `${failure}: ${errorMessage(e)}`,
        })
      }
      return false
    }
  }

  private onAddReviewer = (login: string) => {
    const { owner, name, pullRequestNumber: n } = this.props
    return this.update(
      api => api.requestReviewers(owner, name, n, [login]),
      'レビュワーを変更できませんでした'
    )
  }

  private onRemoveReviewer = (login: string) => {
    const { owner, name, pullRequestNumber: n } = this.props
    return this.update(
      api => api.removeRequestedReviewers(owner, name, n, [login]),
      'レビュワーを変更できませんでした'
    )
  }

  private setAssignees(logins: ReadonlyArray<string>) {
    const { owner, name, pullRequestNumber: n } = this.props
    return this.update(
      api => api.setPullRequestAssignees(owner, name, n, logins),
      '担当者を変更できませんでした'
    )
  }

  private get assignees() {
    return (this.state.pullRequest?.assignees ?? []).map(a => a.login)
  }

  private onAddAssignee = (login: string) =>
    this.setAssignees([...this.assignees, login])

  private onRemoveAssignee = (login: string) =>
    this.setAssignees(this.assignees.filter(a => a !== login))

  private setLabels(labels: ReadonlyArray<IAPILabel>) {
    const { owner, name, pullRequestNumber: n } = this.props
    return this.update(
      api => api.setPullRequestLabels(owner, name, n, labels),
      'ラベルを変更できませんでした'
    )
  }

  private get currentLabels() {
    return this.state.pullRequest?.labels ?? []
  }

  private onAddLabel = (key: string) => {
    const label = this.state.labels?.find(l => `${l.id}` === key)
    if (label !== undefined) {
      this.setLabels([...this.currentLabels, label])
    }
  }

  private onRemoveLabel = (key: string) =>
    this.setLabels(this.currentLabels.filter(l => `${l.id}` !== key))

  private onComment = (body: string) => {
    const { owner, name, pullRequestNumber: n } = this.props
    return this.update(
      api => api.createPullRequestComment(owner, name, n, body),
      'コメントできませんでした'
    )
  }

  private onReview = (event: PullRequestReviewEvent, body: string) => {
    const { owner, name, pullRequestNumber: n } = this.props
    return this.update(
      api => api.submitPullRequestReview(owner, name, n, event, body),
      'レビューを送信できませんでした'
    )
  }

  private renderAssigneesAndLabels(pr: IAPIPullRequestDetails) {
    const { reviewerCandidates, labels, busy } = this.state
    const labelTag = (l: IAPILabel): ITag => ({
      key: `${l.id}`,
      label: l.name,
      color: `#${l.color.replace(/^#/, '')}`,
    })

    return (
      <div className="pr-side-sections">
        <div className="pr-section">
          <h3>
            <Octicon symbol={octicons.person} />
            担当者
          </h3>
          <TagPicker
            tags={(pr.assignees ?? []).map(a => ({
              key: a.login,
              label: a.login,
            }))}
            options={
              reviewerCandidates?.map(c => ({
                key: c.login,
                label: c.login,
              })) ?? null
            }
            addLabel="担当者を追加"
            emptyText="担当者はいません。"
            onAdd={this.onAddAssignee}
            onRemove={this.onRemoveAssignee}
            disabled={busy}
          />
        </div>
        <div className="pr-section">
          <h3>
            <Octicon symbol={octicons.tag} />
            ラベル
          </h3>
          <TagPicker
            tags={(pr.labels ?? []).map(labelTag)}
            options={labels?.map(labelTag) ?? null}
            addLabel="ラベルを追加"
            emptyText="ラベルはありません。"
            onAdd={this.onAddLabel}
            onRemove={this.onRemoveLabel}
            disabled={busy}
          />
        </div>
      </div>
    )
  }

  private renderConversation(pr: IAPIPullRequestDetails, isOpen: boolean) {
    const { comments, reviews, busy } = this.state
    const me = this.props.account?.login

    return (
      <div className="pr-section">
        <h3>
          <Octicon symbol={octicons.comment} />
          会話
        </h3>
        <PullRequestConversation
          items={getConversation(comments, reviews)}
          canReview={isOpen && me !== undefined && me !== pr.user.login}
          onComment={this.onComment}
          onReview={this.onReview}
          disabled={busy}
        />
      </div>
    )
  }

  private renderReviewers(pr: IAPIPullRequestDetails, isOpen: boolean) {
    const { reviews, reviewerCandidates, busy } = this.state
    const reviewers = getReviewers(
      pr.user.login,
      reviews,
      pr.requested_reviewers ?? []
    )

    return (
      <div className="pr-section pr-reviewers">
        <h3>
          <Octicon symbol={octicons.people} />
          レビュワー
        </h3>
        <ReviewerPicker
          reviewers={reviewers}
          candidates={
            reviewerCandidates?.filter(c => c.login !== pr.user.login) ?? null
          }
          onAdd={isOpen ? this.onAddReviewer : undefined}
          onRemove={isOpen ? this.onRemoveReviewer : undefined}
          disabled={busy}
        />
      </div>
    )
  }

  /** The branch to delete after merging, if it lives in the same repository */
  private get deletableBranch(): string | null {
    const { pullRequest } = this.state
    const headRepo = pullRequest?.head.repo
    const baseRepo = pullRequest?.base.repo

    if (
      pullRequest === null ||
      headRepo === null ||
      headRepo === undefined ||
      baseRepo === null ||
      baseRepo === undefined ||
      headRepo.owner.login !== baseRepo.owner.login ||
      headRepo.name !== baseRepo.name
    ) {
      return null
    }

    return pullRequest.head.ref
  }

  private onMerge = async () => {
    const { api } = this
    const { pullRequest, mergeMethod, deleteBranch } = this.state
    if (api === null || pullRequest === null) {
      return
    }

    this.setState({ busy: true, error: null })
    try {
      const { owner, name, pullRequestNumber } = this.props
      await api.mergePullRequest(
        owner,
        name,
        pullRequestNumber,
        mergeMethod,
        deleteBranch ? this.deletableBranch : null
      )
      await this.props.dispatcher.refreshPullRequests(this.props.repository)
      this.props.onDismissed()
    } catch (e) {
      if (this.mounted) {
        this.setState({
          busy: false,
          error: `マージできませんでした: ${errorMessage(e)}`,
        })
      }
    }
  }

  private onClose = async () => {
    const { api } = this
    if (api === null) {
      return
    }

    this.setState({ busy: true, error: null })
    try {
      const { owner, name, pullRequestNumber } = this.props
      await api.closePullRequest(owner, name, pullRequestNumber)
      await this.props.dispatcher.refreshPullRequests(this.props.repository)
      this.props.onDismissed()
    } catch (e) {
      if (this.mounted) {
        this.setState({
          busy: false,
          error: `クローズできませんでした: ${errorMessage(e)}`,
        })
      }
    }
  }

  private onOpenInBrowser = () => {
    const { pullRequest } = this.state
    const { repository, pullRequestNumber } = this.props
    const { gitHubRepository } = repository
    const htmlURL = pullRequest?.base.repo?.html_url ?? gitHubRepository.htmlURL

    if (htmlURL !== null) {
      this.props.dispatcher.openInBrowser(
        getPullRequestURL(htmlURL, gitHubRepository.endpoint, pullRequestNumber)
      )
    }
  }

  private onMergeMethodChanged = (e: React.FormEvent<HTMLSelectElement>) => {
    const value = e.currentTarget.value
    if (value === 'merge' || value === 'squash' || value === 'rebase') {
      this.setState({ mergeMethod: value })
    }
  }

  private onDeleteBranchChanged = (e: React.FormEvent<HTMLInputElement>) => {
    this.setState({ deleteBranch: e.currentTarget.checked })
  }

  private renderMergeability(pr: IAPIPullRequestDetails) {
    if (pr.mergeable === true) {
      return (
        <div className="pr-mergeable ok">
          <Octicon symbol={octicons.check} />
          コンフリクトはありません。マージできます。
        </div>
      )
    } else if (pr.mergeable === false) {
      return (
        <div className="pr-mergeable conflict">
          <Octicon symbol={octicons.alert} />
          コンフリクトがあるためマージできません。
        </div>
      )
    }

    return (
      <div className="pr-mergeable">
        <Octicon symbol={octicons.clock} />
        マージできるか確認中です。
      </div>
    )
  }

  private renderMergeOptions(pr: IAPIPullRequestDetails) {
    const { busy, mergeMethod, deleteBranch } = this.state
    const deletableBranch = this.deletableBranch

    return (
      <div className="pr-merge-options">
        {this.renderMergeability(pr)}
        <Select
          label="マージ方法"
          value={mergeMethod}
          onChange={this.onMergeMethodChanged}
          disabled={busy}
        >
          {Object.entries(mergeMethodLabels).map(([value, label]) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </Select>
        {deletableBranch !== null && (
          <Checkbox
            label={
              <>
                マージ後にブランチ <Ref>{deletableBranch}</Ref> を削除する
              </>
            }
            value={deleteBranch ? CheckboxValue.On : CheckboxValue.Off}
            onChange={this.onDeleteBranchChanged}
            disabled={busy}
          />
        )}
      </div>
    )
  }

  private renderContent() {
    const { pullRequest, loading } = this.state

    if (loading) {
      return <p className="pr-loading">読み込んでいます…</p>
    }

    if (pullRequest === null) {
      return null
    }

    const status = getStatus(pullRequest)
    const isOpen = status === 'open' || status === 'draft'

    return (
      <>
        <div className="pr-meta">
          <span className={`pr-status ${status}`}>
            {pullRequestStatusLabels[status]}
          </span>
          <span className="pr-author" translate="no">
            {pullRequest.user.login}
          </span>
          <span className="pr-branches">
            <Ref>{pullRequest.head.ref}</Ref>
            <Octicon symbol={octicons.arrowRight} />
            <Ref>{pullRequest.base.ref}</Ref>
          </span>
        </div>
        <div className="pr-body">
          {pullRequest.body.trim().length > 0 ? (
            <span translate="no">{pullRequest.body}</span>
          ) : (
            <span className="pr-body-empty">説明はありません。</span>
          )}
        </div>
        {this.renderReviewers(pullRequest, isOpen)}
        {this.renderAssigneesAndLabels(pullRequest)}
        {this.renderConversation(pullRequest, isOpen)}
        {isOpen ? this.renderMergeOptions(pullRequest) : null}
      </>
    )
  }

  private renderFooter() {
    const { pullRequest, busy } = this.state
    const status = pullRequest === null ? null : getStatus(pullRequest)
    const isOpen = status === 'open' || status === 'draft'

    return (
      <DialogFooter>
        <div className="pr-secondary-actions">
          <Button onClick={this.onOpenInBrowser} disabled={busy}>
            <Octicon symbol={octicons.linkExternal} />
            ブラウザで開く
          </Button>
          {isOpen && (
            <Button onClick={this.onClose} disabled={busy}>
              クローズ
            </Button>
          )}
        </div>
        {isOpen ? (
          <OkCancelButtonGroup
            okButtonText="マージ"
            okButtonDisabled={busy || pullRequest?.mergeable === false}
            cancelButtonText="閉じる"
            cancelButtonDisabled={busy}
          />
        ) : (
          <OkCancelButtonGroup
            okButtonText="閉じる"
            cancelButtonVisible={false}
          />
        )}
      </DialogFooter>
    )
  }

  private onSubmit = () => {
    const { pullRequest } = this.state
    const status = pullRequest === null ? null : getStatus(pullRequest)

    if (status === 'open' || status === 'draft') {
      this.onMerge()
    } else {
      this.props.onDismissed()
    }
  }

  public render() {
    const { pullRequest, error, busy } = this.state
    const { pullRequestNumber } = this.props
    const title =
      pullRequest === null
        ? `プルリクエスト #${pullRequestNumber}`
        : `#${pullRequestNumber} ${pullRequest.title}`

    return (
      <Dialog
        id="pull-request-details"
        title={title}
        onSubmit={this.onSubmit}
        onDismissed={this.props.onDismissed}
        loading={busy}
        disabled={busy}
      >
        {error !== null && <DialogError>{error}</DialogError>}
        <DialogContent>{this.renderContent()}</DialogContent>
        {this.renderFooter()}
      </Dialog>
    )
  }
}
