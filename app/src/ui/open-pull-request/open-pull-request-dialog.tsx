import * as React from 'react'
import { IConstrainedValue, IPullRequestState } from '../../lib/app-state'
import { getDotComAPIEndpoint, IAPIIdentity } from '../../lib/api'
import { isGiteaEndpoint } from '../../lib/gitea'
import { Branch } from '../../models/branch'
import { ImageDiffType } from '../../models/diff'
import {
  isRepositoryWithGitHubRepository,
  Repository,
} from '../../models/repository'
import {
  DialogFooter,
  OkCancelButtonGroup,
  Dialog,
  DialogError,
} from '../dialog'
import { PopupType } from '../../models/popup'
import { TextBox } from '../lib/text-box'
import { TextArea } from '../lib/text-area'
import { Button } from '../lib/button'
import { Dispatcher } from '../dispatcher'
import { Ref } from '../lib/ref'
import { Octicon } from '../octicons'
import * as octicons from '../octicons/octicons.generated'
import {
  OpenPullRequestDialogHeader,
  OpenPullRequestDialogId,
} from './open-pull-request-header'
import { PullRequestFilesChanged } from './pull-request-files-changed'
import { PullRequestMergeStatus } from './pull-request-merge-status'
import { ComputedAction } from '../../models/computed-action'
import { ReviewerPicker } from '../pull-request-details/reviewer-picker'

interface IOpenPullRequestDialogProps {
  readonly repository: Repository
  readonly dispatcher: Dispatcher

  /**
   * The IRepositoryState.pullRequestState
   */
  readonly pullRequestState: IPullRequestState

  /**
   * The currently checked out branch
   */
  readonly currentBranch: Branch

  /**
   * See IBranchesState.defaultBranch
   */
  readonly defaultBranch: Branch | null

  /**
   * Branches in the repo with the repo's default remote
   *
   * We only want branches that are also on dotcom such that, when we ask a user
   * to create a pull request, the base branch also exists on dotcom.
   */
  readonly prBaseBranches: ReadonlyArray<Branch>

  /**
   * Recent branches with the repo's default remote
   *
   * We only want branches that are also on dotcom such that, when we ask a user
   * to create a pull request, the base branch also exists on dotcom.
   */
  readonly prRecentBaseBranches: ReadonlyArray<Branch>

  /** Whether we should display side by side diffs. */
  readonly showSideBySideDiff: boolean

  /** Whether we should hide whitespace in diff. */
  readonly hideWhitespaceInDiff: boolean

  /** The type of image diff to display. */
  readonly imageDiffType: ImageDiffType

  /** Label for selected external editor */
  readonly externalEditorLabel?: string

  /**
   * Callback to open a selected file using the configured external editor
   *
   * @param fullPath The full path to the file on disk
   */
  readonly onOpenInExternalEditor: (fullPath: string) => void

  /** Width to use for the files list pane in the files changed view */
  readonly fileListWidth: IConstrainedValue

  /** If the latest commit of the pull request is not local, this will contain
   * it's SHA  */
  readonly nonLocalCommitSHA: string | null

  /** Whether the current branch already has a pull request*/
  readonly currentBranchHasPullRequest: boolean

  /** Called to dismiss the dialog */
  readonly onDismissed: () => void
}

interface IOpenPullRequestDialogState {
  readonly title: string
  readonly body: string
  /** The logins of the users to ask for a review */
  readonly reviewers: ReadonlyArray<string>
  /** The users who can be asked to review, null while loading */
  readonly reviewerCandidates: ReadonlyArray<IAPIIdentity> | null
  readonly creating: boolean
  readonly error: string | null
}

/** The component for start a pull request. */
export class OpenPullRequestDialog extends React.Component<
  IOpenPullRequestDialogProps,
  IOpenPullRequestDialogState
> {
  private mounted = false

  public constructor(props: IOpenPullRequestDialogProps) {
    super(props)
    this.state = {
      // Suggest the branch name as the title
      title: props.currentBranch.nameWithoutRemote,
      body: '',
      reviewers: [],
      reviewerCandidates: null,
      creating: false,
      error: null,
    }
  }

  public componentDidMount() {
    this.mounted = true

    if (this.canCreateInApp && !this.props.currentBranchHasPullRequest) {
      this.props.dispatcher
        .fetchReviewerCandidates(this.props.repository)
        .catch(e => {
          log.warn('Failed to load the reviewer candidates', e)
          return []
        })
        .then(reviewerCandidates => {
          if (this.mounted) {
            this.setState({ reviewerCandidates })
          }
        })
    }
  }

  public componentWillUnmount() {
    this.mounted = false
  }

  /** Whether pull requests can be created through the API */
  private get canCreateInApp() {
    return isRepositoryWithGitHubRepository(this.props.repository)
  }

  private onCreatePullRequest = async () => {
    const { currentBranchHasPullRequest, dispatcher, repository, onDismissed } =
      this.props

    if (currentBranchHasPullRequest) {
      dispatcher.showPullRequest(repository)
      onDismissed()
      return
    }

    const { baseBranch } = this.props.pullRequestState
    if (!this.canCreateInApp || baseBranch === null) {
      this.onCreateInBrowser()
      return
    }

    this.setState({ creating: true, error: null })
    try {
      const created = await dispatcher.createPullRequestInApp(
        repository,
        baseBranch,
        this.state.title.trim(),
        this.state.body,
        this.state.reviewers
      )
      dispatcher.incrementMetric('createPullRequestFromPreviewCount')
      onDismissed()

      if (isRepositoryWithGitHubRepository(repository)) {
        dispatcher.showPopup({
          type: PopupType.PullRequestDetails,
          repository,
          ...created,
        })
      }
    } catch (e) {
      if (this.mounted) {
        this.setState({
          creating: false,
          error: `プルリクエストを作成できませんでした: ${
            e instanceof Error ? e.message : e
          }`,
        })
      }
    }
  }

  private onCreateInBrowser = () => {
    const { dispatcher, repository, onDismissed } = this.props
    const { baseBranch } = this.props.pullRequestState
    dispatcher.createPullRequest(repository, baseBranch ?? undefined)
    dispatcher.incrementMetric('createPullRequestCount')
    dispatcher.incrementMetric('createPullRequestFromPreviewCount')
    onDismissed()
  }

  private onTitleChanged = (title: string) => {
    this.setState({ title })
  }

  private onBodyChanged = (body: string) => {
    this.setState({ body })
  }

  private onAddReviewer = (login: string) => {
    this.setState(state => ({ reviewers: [...state.reviewers, login] }))
  }

  private onRemoveReviewer = (login: string) => {
    this.setState(state => ({
      reviewers: state.reviewers.filter(r => r !== login),
    }))
  }

  private renderForm() {
    if (this.props.currentBranchHasPullRequest || !this.canCreateInApp) {
      return null
    }

    const { title, body, creating, reviewers, reviewerCandidates } = this.state

    return (
      <div className="open-pull-request-form">
        <TextBox
          label="タイトル"
          value={title}
          onValueChanged={this.onTitleChanged}
          disabled={creating}
          autoFocus={true}
        />
        <TextArea
          label="説明"
          value={body}
          onValueChanged={this.onBodyChanged}
          disabled={creating}
          rows={3}
          placeholder="変更内容やレビューしてほしい点など"
        />
        <ReviewerPicker
          reviewers={reviewers.map(login => ({ login, state: 'selected' }))}
          candidates={reviewerCandidates}
          onAdd={this.onAddReviewer}
          onRemove={this.onRemoveReviewer}
          disabled={creating}
        />
      </div>
    )
  }

  private onBranchChange = (branch: Branch) => {
    const { repository } = this.props
    this.props.dispatcher.updatePullRequestBaseBranch(repository, branch)
  }

  private renderHeader() {
    const {
      currentBranch,
      pullRequestState,
      defaultBranch,
      prBaseBranches,
      prRecentBaseBranches,
    } = this.props
    const { baseBranch, commitSelection, commitSHAs } = pullRequestState
    if (commitSelection === null) {
      // type checking - will render no default branch message
      return
    }

    const { changesetData } = commitSelection

    return (
      <OpenPullRequestDialogHeader
        repository={this.props.repository}
        baseBranch={baseBranch}
        currentBranch={currentBranch}
        defaultBranch={defaultBranch}
        prBaseBranches={prBaseBranches}
        prRecentBaseBranches={prRecentBaseBranches}
        commitCount={commitSHAs?.length ?? 0}
        changesetData={changesetData}
        onBranchChange={this.onBranchChange}
        onDismissed={this.props.onDismissed}
      />
    )
  }

  private renderContent() {
    return (
      <div className="open-pull-request-content">
        {this.renderNoChanges()}
        {this.renderNoDefaultBranch()}
        {this.renderFilesChanged()}
      </div>
    )
  }

  private renderFilesChanged() {
    const {
      dispatcher,
      externalEditorLabel,
      hideWhitespaceInDiff,
      imageDiffType,
      pullRequestState,
      repository,
      fileListWidth,
      nonLocalCommitSHA,
    } = this.props
    const { commitSelection } = pullRequestState
    if (commitSelection === null) {
      // type checking - will render no default branch message
      return
    }

    const { diff, file, changesetData, shas } = commitSelection
    const { files } = changesetData

    if (shas.length === 0) {
      return
    }

    return (
      <PullRequestFilesChanged
        diff={diff}
        dispatcher={dispatcher}
        externalEditorLabel={externalEditorLabel}
        fileListWidth={fileListWidth}
        files={files}
        hideWhitespaceInDiff={hideWhitespaceInDiff}
        imageDiffType={imageDiffType}
        nonLocalCommitSHA={nonLocalCommitSHA}
        selectedFile={file}
        showSideBySideDiff={this.props.showSideBySideDiff}
        repository={repository}
        onOpenInExternalEditor={this.props.onOpenInExternalEditor}
      />
    )
  }

  private renderNoChanges() {
    const { pullRequestState, currentBranch } = this.props
    const { commitSelection, baseBranch, mergeStatus } = pullRequestState
    if (commitSelection === null || baseBranch === null) {
      // type checking - will render no default branch message
      return
    }

    const { shas } = commitSelection
    if (shas.length !== 0) {
      return
    }
    const hasMergeBase = mergeStatus?.kind !== ComputedAction.Invalid
    const message = hasMergeBase ? (
      <>
        <Ref>{baseBranch.name}</Ref> is up to date with all commits from{' '}
        <Ref>{currentBranch.name}</Ref>.
      </>
    ) : (
      <>
        <Ref>{baseBranch.name}</Ref> and <Ref>{currentBranch.name}</Ref> are
        entirely different commit histories.
      </>
    )
    return (
      <div className="open-pull-request-message">
        <div>
          <Octicon symbol={octicons.gitPullRequest} />
          <h3>There are no changes.</h3>
          {message}
        </div>
      </div>
    )
  }

  private renderNoDefaultBranch() {
    const { baseBranch } = this.props.pullRequestState

    if (baseBranch !== null) {
      return
    }

    return (
      <div className="open-pull-request-message">
        <div>
          <Octicon symbol={octicons.gitPullRequest} />
          <h3>Could not find a default branch to compare against.</h3>
          Select a base branch above.
        </div>
      </div>
    )
  }

  private renderFooter() {
    const { currentBranchHasPullRequest, pullRequestState, repository } =
      this.props
    const { mergeStatus, commitSHAs } = pullRequestState
    const gitHubRepository = repository.gitHubRepository
    const isEnterprise =
      gitHubRepository && gitHubRepository.endpoint !== getDotComAPIEndpoint()

    const viewCreate = currentBranchHasPullRequest ? 'View' : ' Create'
    const isGitea =
      gitHubRepository !== null && isGiteaEndpoint(gitHubRepository.endpoint)
    const buttonTitle = isGitea
      ? `${viewCreate} pull request on Gitea.`
      : `${viewCreate} pull request on GitHub${
          isEnterprise ? ' Enterprise' : ''
        }.`

    const createInApp = !currentBranchHasPullRequest && this.canCreateInApp

    const okButton = createInApp ? (
      'プルリクエストを作成'
    ) : (
      <>
        {currentBranchHasPullRequest && (
          <Octicon symbol={octicons.gitPullRequest} />
        )}
        {__DARWIN__
          ? `${viewCreate} Pull Request`
          : `${viewCreate} pull request`}
      </>
    )

    const noChanges = commitSHAs === null || commitSHAs.length === 0

    return (
      <DialogFooter>
        <PullRequestMergeStatus mergeStatus={mergeStatus} />

        {createInApp && (
          <Button
            onClick={this.onCreateInBrowser}
            disabled={noChanges || this.state.creating}
            tooltip={buttonTitle}
          >
            <Octicon symbol={octicons.linkExternal} />
            ブラウザで作成
          </Button>
        )}

        <OkCancelButtonGroup
          okButtonText={okButton}
          okButtonTitle={createInApp ? undefined : buttonTitle}
          cancelButtonText="Cancel"
          okButtonDisabled={
            noChanges ||
            this.state.creating ||
            (createInApp && this.state.title.trim().length === 0)
          }
        />
      </DialogFooter>
    )
  }

  public render() {
    return (
      <Dialog
        titleId={OpenPullRequestDialogId}
        className="open-pull-request"
        onSubmit={this.onCreatePullRequest}
        onDismissed={this.props.onDismissed}
        loading={this.state.creating}
        disabled={this.state.creating}
      >
        {this.renderHeader()}
        {this.state.error !== null && (
          <DialogError>{this.state.error}</DialogError>
        )}
        {this.renderForm()}
        {this.renderContent()}
        {this.renderFooter()}
      </Dialog>
    )
  }
}
