import * as React from 'react'
import {
  API,
  IAPIPullRequestDetails,
  PullRequestListState,
} from '../../lib/api'
import { Account } from '../../models/account'
import { PopupType } from '../../models/popup'
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
import { TextBox } from '../lib/text-box'
import { Octicon } from '../octicons'
import * as octicons from '../octicons/octicons.generated'
import { RelativeTime } from '../relative-time'
import {
  getPullRequestStatus,
  pullRequestStatusIcons,
  pullRequestStatusLabels,
} from '../pull-request-details/pull-request-status'

interface IPullRequestListDialogProps {
  readonly dispatcher: Dispatcher
  readonly repository: RepositoryWithGitHubRepository
  readonly account: Account | null

  /** The owner of the repository whose pull requests are shown */
  readonly owner: string
  /** The name of the repository whose pull requests are shown */
  readonly name: string

  readonly onDismissed: () => void
}

interface IPullRequestListDialogState {
  readonly filter: PullRequestListState
  readonly query: string
  readonly pullRequests: ReadonlyArray<IAPIPullRequestDetails>
  /** The last page which was loaded */
  readonly page: number
  readonly hasMore: boolean
  readonly loading: boolean
  readonly error: string | null
}

const pageSize = 30

const filters: ReadonlyArray<{
  readonly state: PullRequestListState
  readonly label: string
}> = [
  { state: 'open', label: 'オープン' },
  { state: 'closed', label: 'クローズ済み' },
  { state: 'all', label: 'すべて' },
]

/**
 * The filter is remembered while the app runs, so that it's kept when coming
 * back from a pull request.
 */
let lastFilter: PullRequestListState = 'open'

const errorMessage = (e: unknown) => (e instanceof Error ? e.message : `${e}`)

/** Whether a pull request matches what the user typed in the filter box */
function matches(pr: IAPIPullRequestDetails, query: string) {
  const q = query.trim().toLowerCase().replace(/^#/, '')
  return (
    q.length === 0 ||
    `${pr.number}` === q ||
    pr.title.toLowerCase().includes(q) ||
    pr.user.login.toLowerCase().includes(q) ||
    pr.head.ref.toLowerCase().includes(q)
  )
}

interface IFilterButtonProps {
  readonly state: PullRequestListState
  readonly label: string
  readonly selected: boolean
  readonly onSelect: (state: PullRequestListState) => void
}

/** One segment of the open / closed / all control */
class FilterButton extends React.Component<IFilterButtonProps> {
  private onClick = () => this.props.onSelect(this.props.state)

  public render() {
    const { selected, label } = this.props
    return (
      <Button
        className={selected ? 'selected' : undefined}
        ariaPressed={selected}
        onClick={this.onClick}
      >
        {label}
      </Button>
    )
  }
}

interface IPullRequestListItemProps {
  readonly pullRequest: IAPIPullRequestDetails
  readonly onSelect: (pullRequest: IAPIPullRequestDetails) => void
}

class PullRequestListItem extends React.Component<IPullRequestListItemProps> {
  private onClick = () => this.props.onSelect(this.props.pullRequest)

  public render() {
    const pr = this.props.pullRequest
    const status = getPullRequestStatus(pr)
    const reviewers = pr.requested_reviewers ?? []

    return (
      <li>
        <button className="pr-list-item" type="button" onClick={this.onClick}>
          <span className={`pr-list-icon ${status}`}>
            <Octicon
              symbol={pullRequestStatusIcons[status]}
              title={pullRequestStatusLabels[status]}
            />
          </span>
          <span className="pr-list-info">
            <span className="pr-list-title" translate="no">
              {pr.title}
            </span>
            <span className="pr-list-meta">
              <span>#{pr.number}</span>
              <span translate="no">{pr.user.login}</span>
              <span className="pr-list-branches" translate="no">
                {pr.head.ref} → {pr.base.ref}
              </span>
              <span>
                更新 <RelativeTime date={new Date(pr.updated_at)} />
              </span>
            </span>
          </span>
          {reviewers.length > 0 && (
            <span className="pr-list-reviewers">
              <Octicon symbol={octicons.people} title="レビュー待ち" />
              {reviewers.length}
            </span>
          )}
        </button>
      </li>
    )
  }
}

/** All the pull requests of a repository, not only the current branch's. */
export class PullRequestListDialog extends React.Component<
  IPullRequestListDialogProps,
  IPullRequestListDialogState
> {
  private mounted = false
  /** Ignore responses to requests which have been superseded */
  private requestId = 0

  public constructor(props: IPullRequestListDialogProps) {
    super(props)
    this.state = {
      filter: lastFilter,
      query: '',
      pullRequests: [],
      page: 0,
      hasMore: false,
      loading: true,
      error: null,
    }
  }

  public componentDidMount() {
    this.mounted = true
    this.load(this.state.filter, 1)
  }

  public componentWillUnmount() {
    this.mounted = false
  }

  private async load(filter: PullRequestListState, page: number) {
    const { account, owner, name } = this.props
    if (account === null) {
      this.setState({
        loading: false,
        error: 'このリポジトリのアカウントが見つかりません。',
      })
      return
    }

    const id = ++this.requestId
    this.setState({ loading: true, error: null })

    try {
      const prs = await API.fromAccount(account).fetchPullRequestsPage(
        owner,
        name,
        filter,
        page,
        pageSize
      )
      if (!this.mounted || id !== this.requestId) {
        return
      }
      this.setState(state => ({
        pullRequests: page === 1 ? prs : [...state.pullRequests, ...prs],
        page,
        hasMore: prs.length >= pageSize,
        loading: false,
      }))
    } catch (e) {
      if (this.mounted && id === this.requestId) {
        this.setState({ loading: false, error: errorMessage(e) })
      }
    }
  }

  private onFilterChanged = (filter: PullRequestListState) => {
    if (filter === this.state.filter) {
      return
    }
    lastFilter = filter
    this.setState({ filter, pullRequests: [], hasMore: false })
    this.load(filter, 1)
  }

  private onQueryChanged = (query: string) => {
    this.setState({ query })
  }

  private onRefresh = () => {
    this.load(this.state.filter, 1)
  }

  private onLoadMore = () => {
    this.load(this.state.filter, this.state.page + 1)
  }

  private onOpenInBrowser = () => {
    const { htmlURL } = this.props.repository.gitHubRepository
    if (htmlURL !== null) {
      this.props.dispatcher.openInBrowser(`${htmlURL}/pulls`)
    }
  }

  private onSelect = (pr: IAPIPullRequestDetails) => {
    const { dispatcher, repository, owner, name } = this.props
    dispatcher.showPopup({
      type: PopupType.PullRequestDetails,
      repository,
      owner,
      name,
      pullRequestNumber: pr.number,
    })
  }

  private renderFilters() {
    const { filter, query, loading } = this.state

    return (
      <div className="pr-list-toolbar">
        <div className="pr-list-filters" role="group">
          {filters.map(f => (
            <FilterButton
              key={f.state}
              state={f.state}
              label={f.label}
              selected={f.state === filter}
              onSelect={this.onFilterChanged}
            />
          ))}
        </div>
        <TextBox
          className="pr-list-search"
          type="search"
          value={query}
          onValueChanged={this.onQueryChanged}
          placeholder="タイトル、番号、作成者で絞り込む"
          ariaLabel="プルリクエストを絞り込む"
        />
        <Button
          className="pr-list-refresh"
          onClick={this.onRefresh}
          disabled={loading}
          ariaLabel="再読み込み"
          tooltip="再読み込み"
        >
          <Octicon symbol={octicons.sync} />
        </Button>
      </div>
    )
  }

  private renderPullRequest = (pr: IAPIPullRequestDetails) => (
    <PullRequestListItem
      key={pr.number}
      pullRequest={pr}
      onSelect={this.onSelect}
    />
  )

  private renderList() {
    const { pullRequests, query, loading, hasMore, filter } = this.state
    const visible = pullRequests.filter(pr => matches(pr, query))

    if (visible.length === 0) {
      if (loading) {
        return <p className="pr-list-empty">読み込んでいます…</p>
      }
      const label = filters.find(f => f.state === filter)?.label ?? ''
      return (
        <p className="pr-list-empty">
          {query.trim().length > 0
            ? '一致するプルリクエストはありません。'
            : filter === 'all'
            ? 'プルリクエストはありません。'
            : `${label}のプルリクエストはありません。`}
        </p>
      )
    }

    return (
      <>
        <ul className="pr-list">{visible.map(this.renderPullRequest)}</ul>
        {hasMore && (
          <div className="pr-list-more">
            <Button onClick={this.onLoadMore} disabled={loading}>
              {loading ? '読み込んでいます…' : 'さらに読み込む'}
            </Button>
          </div>
        )}
      </>
    )
  }

  public render() {
    const { owner, name } = this.props
    const { error } = this.state

    return (
      <Dialog
        id="pull-request-list"
        title={`プルリクエスト · ${owner}/${name}`}
        onSubmit={this.props.onDismissed}
        onDismissed={this.props.onDismissed}
      >
        {error !== null && <DialogError>{error}</DialogError>}
        {this.renderFilters()}
        <DialogContent>{this.renderList()}</DialogContent>
        <DialogFooter>
          <Button onClick={this.onOpenInBrowser}>
            <Octicon symbol={octicons.linkExternal} />
            ブラウザで開く
          </Button>
          <OkCancelButtonGroup
            okButtonText="閉じる"
            cancelButtonVisible={false}
          />
        </DialogFooter>
      </Dialog>
    )
  }
}
