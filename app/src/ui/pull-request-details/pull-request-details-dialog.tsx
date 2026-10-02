import * as React from 'react'
import {
  API,
  IAPIIdentity,
  IAPIPullRequestDetails,
  IAPIPullRequestReview,
  PullRequestMergeMethod,
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
  /** The users who can be asked to review, null while loading */
  readonly reviewerCandidates: ReadonlyArray<IAPIIdentity> | null
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
      reviewerCandidates: null,
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

    const { owner, name, pullRequestNumber } = this.props

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

    try {
      const [pullRequest, reviews] = await Promise.all([
        api.fetchPullRequestDetails(owner, name, pullRequestNumber),
        this.fetchReviews(api),
      ])
      if (this.mounted) {
        this.setState({ pullRequest, reviews, loading: false })
      }
    } catch (e) {
      if (this.mounted) {
        this.setState({ loading: false, error: errorMessage(e) })
      }
    }
  }

  private fetchReviews(api: API) {
    const { owner, name, pullRequestNumber } = this.props
    return api
      .fetchAllPullRequestReviews(owner, name, pullRequestNumber)
      .catch(e => {
        log.warn('Failed to load the pull request reviews', e)
        return []
      })
  }

  /** Add or remove a reviewer and show the result */
  private async changeReviewers(add: boolean, login: string) {
    const { api } = this
    if (api === null) {
      return
    }

    this.setState({ busy: true, error: null })
    const { owner, name, pullRequestNumber } = this.props
    try {
      if (add) {
        await api.requestReviewers(owner, name, pullRequestNumber, [login])
      } else {
        await api.removeRequestedReviewers(owner, name, pullRequestNumber, [
          login,
        ])
      }
      const [pullRequest, reviews] = await Promise.all([
        api.fetchPullRequestDetails(owner, name, pullRequestNumber),
        this.fetchReviews(api),
      ])
      if (this.mounted) {
        this.setState({ pullRequest, reviews, busy: false })
      }
    } catch (e) {
      if (this.mounted) {
        this.setState({
          busy: false,
          error: `レビュワーを変更できませんでした: ${errorMessage(e)}`,
        })
      }
    }
  }

  private onAddReviewer = (login: string) => this.changeReviewers(true, login)

  private onRemoveReviewer = (login: string) =>
    this.changeReviewers(false, login)

  private renderReviewers(pr: IAPIPullRequestDetails, isOpen: boolean) {
    const { reviews, reviewerCandidates, busy } = this.state
    const reviewers = getReviewers(
      pr.user.login,
      reviews,
      pr.requested_reviewers ?? []
    )

    return (
      <div className="pr-reviewers">
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

    return (
      <>
        <div className="pr-meta">
          <span className={`pr-status ${status}`}>
            {pullRequestStatusLabels[status]}
          </span>
          <span className="pr-author">{pullRequest.user.login}</span>
          <span className="pr-branches">
            <Ref>{pullRequest.head.ref}</Ref>
            <Octicon symbol={octicons.arrowRight} />
            <Ref>{pullRequest.base.ref}</Ref>
          </span>
        </div>
        <div className="pr-body">
          {pullRequest.body.trim().length > 0 ? (
            pullRequest.body
          ) : (
            <span className="pr-body-empty">説明はありません。</span>
          )}
        </div>
        {this.renderReviewers(
          pullRequest,
          status === 'open' || status === 'draft'
        )}
        {status === 'open' || status === 'draft'
          ? this.renderMergeOptions(pullRequest)
          : null}
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
