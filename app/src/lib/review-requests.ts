import { Disposable, Emitter } from 'event-kit'
import { Account } from '../models/account'
import { RepositoryWithGitHubRepository } from '../models/repository'
import { API, IAPIPullRequestDetails } from './api'
import { getLanguage } from './i18n/language'
import { showNotification } from './notifications/show-notification'

/** A repository whose pull requests are checked for review requests */
export interface IReviewRequestSource {
  readonly repository: RepositoryWithGitHubRepository
  readonly account: Account
  /** The repository the pull requests are opened against */
  readonly owner: string
  readonly name: string
}

/** An open pull request waiting for the user's review */
export interface IReviewRequest {
  readonly source: IReviewRequestSource
  readonly number: number
  readonly title: string
  readonly author: string
}

/** Check for review requests this long after launching */
const initialCheckDelay = 20 * 1000
/** And then this often */
const checkInterval = 5 * 60 * 1000
/** Show at most this many notifications at once, then a summary */
const maxNotifications = 3

const seenKey = 'ms2026-seen-review-requests'
const maxSeen = 500

/** Identifies a review request across app launches */
export const getReviewRequestKey = (request: IReviewRequest) =>
  `${request.source.account.endpoint}|${request.source.owner}/${request.source.name}#${request.number}`

/** The pull requests in which `login` has been asked to review */
export function getReviewRequests(
  source: IReviewRequestSource,
  pullRequests: ReadonlyArray<IAPIPullRequestDetails>
): ReadonlyArray<IReviewRequest> {
  const { login } = source.account
  return pullRequests
    .filter(
      pr =>
        pr.state === 'open' &&
        (pr.requested_reviewers ?? []).some(r => r.login === login)
    )
    .map(pr => ({
      source,
      number: pr.number,
      title: pr.title,
      author: pr.user.login,
    }))
}

function readSeen(): Set<string> | null {
  try {
    const stored = localStorage.getItem(seenKey)
    return stored === null ? null : new Set(JSON.parse(stored))
  } catch {
    return null
  }
}

function writeSeen(seen: ReadonlyArray<string>) {
  try {
    localStorage.setItem(seenKey, JSON.stringify(seen.slice(-maxSeen)))
  } catch (e) {
    log.warn('Failed to save the seen review requests', e)
  }
}

/**
 * Periodically looks for pull requests waiting for the user's review in all
 * their repositories, notifying them of new ones.
 */
class ReviewRequestWatcher {
  private readonly emitter = new Emitter()
  private _requests: ReadonlyArray<IReviewRequest> = []
  private started = false
  private checking = false
  private getSources: () => ReadonlyArray<IReviewRequestSource> = () => []
  private onOpen: (request: IReviewRequest) => void = () => {}

  /** The open pull requests waiting for the user's review */
  public get requests() {
    return this._requests
  }

  public onChanged(
    fn: (requests: ReadonlyArray<IReviewRequest>) => void
  ): Disposable {
    return this.emitter.on('changed', fn)
  }

  /**
   * Start checking periodically (once per app launch).
   *
   * @param getSources The repositories to check, called before every check
   * @param onOpen     Called when the user clicks on a notification
   */
  public start(
    getSources: () => ReadonlyArray<IReviewRequestSource>,
    onOpen: (request: IReviewRequest) => void
  ) {
    if (this.started) {
      return
    }
    this.started = true
    this.getSources = getSources
    this.onOpen = onOpen
    window.setTimeout(() => this.check(), initialCheckDelay)
    window.setInterval(() => this.check(), checkInterval)
  }

  /** Look for review requests now */
  public async check() {
    if (this.checking) {
      return
    }
    this.checking = true

    try {
      // Several clones of the same repository only need one request
      const sources = new Map<string, IReviewRequestSource>()
      for (const source of this.getSources()) {
        const key = `${source.account.endpoint}|${source.owner}/${source.name}`
        if (!sources.has(key)) {
          sources.set(key, source)
        }
      }

      const requests = new Array<IReviewRequest>()
      for (const source of sources.values()) {
        try {
          const prs = await API.fromAccount(
            source.account
          ).fetchAllPullRequests(source.owner, source.name, 'open')
          requests.push(...getReviewRequests(source, prs))
        } catch (e) {
          log.warn(
            `Failed to check ${source.owner}/${source.name} for review requests`,
            e
          )
        }
      }

      this._requests = requests
      this.emitter.emit('changed', requests)
      this.notify(requests)
    } finally {
      this.checking = false
    }
  }

  /** Notify the user of requests they haven't been notified of before */
  private notify(requests: ReadonlyArray<IReviewRequest>) {
    const seen = readSeen()
    const keys = requests.map(getReviewRequestKey)

    // Don't notify of everything that's already waiting the first time
    if (seen !== null) {
      const fresh = requests.filter((_, i) => !seen.has(keys[i]))
      this.showNotifications(fresh)
    }

    writeSeen([...(seen ?? []), ...keys.filter(k => !seen?.has(k))])
  }

  private showNotifications(requests: ReadonlyArray<IReviewRequest>) {
    const ja = getLanguage() === 'ja'
    const title = ja ? 'レビュー依頼が届きました' : 'Review requested'

    if (requests.length > maxNotifications) {
      showNotification({
        title,
        body: ja
          ? `${requests.length} 件のプルリクエストがあなたのレビューを待っています`
          : `${requests.length} pull requests are waiting for your review`,
        onClick: () => this.onOpen(requests[0]),
      })
      return
    }

    for (const request of requests) {
      const { owner, name } = request.source
      showNotification({
        title,
        body: `${owner}/${name} #${request.number} ${request.title} (${request.author})`,
        onClick: () => this.onOpen(request),
      })
    }
  }
}

export const reviewRequests = new ReviewRequestWatcher()
