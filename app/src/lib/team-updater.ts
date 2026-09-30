import { Emitter, Disposable } from 'event-kit'
import { Account } from '../models/account'
import * as ipcRenderer from './ipc-renderer'
import {
  getReleaseSourceAPIEndpoint,
  ITeamUpdate,
  teamReleaseSource,
} from './team-release-source'

export type TeamUpdateState =
  | { readonly kind: 'idle' }
  | { readonly kind: 'checking' }
  | { readonly kind: 'up-to-date'; readonly checkedAt: Date }
  | { readonly kind: 'available'; readonly update: ITeamUpdate }
  | {
      readonly kind: 'downloading'
      readonly update: ITeamUpdate
      readonly progress: number
    }
  | { readonly kind: 'installing'; readonly update: ITeamUpdate }
  | {
      readonly kind: 'error'
      readonly message: string
      readonly update: ITeamUpdate | null
    }

/** Check for updates this long after launching */
const initialCheckDelay = 15 * 1000
/** And then this often */
const checkInterval = 3 * 60 * 60 * 1000

const errorMessage = (e: unknown) =>
  (e instanceof Error ? e.message : `${e}`).replace(
    /^Error invoking remote method '[^']+': (Error: )?/,
    ''
  )

/**
 * Checks the team's releases for newer builds of the app and installs them,
 * see app/src/main-process/team-updater.ts.
 */
class TeamUpdater {
  private readonly emitter = new Emitter()
  private accounts: ReadonlyArray<Account> = []
  private started = false
  private _state: TeamUpdateState = { kind: 'idle' }

  public constructor() {
    ipcRenderer.on('team-update-progress', (_, progress) => {
      const { state } = this
      if (state.kind === 'downloading') {
        this.setState({ ...state, progress })
      }
    })
  }

  public get state() {
    return this._state
  }

  private setState(state: TeamUpdateState) {
    this._state = state
    this.emitter.emit('changed', state)
  }

  public onChanged(fn: (state: TeamUpdateState) => void): Disposable {
    return this.emitter.on('changed', fn)
  }

  /** Used to authenticate against private release repositories */
  public setAccounts(accounts: ReadonlyArray<Account>) {
    this.accounts = accounts
  }

  private get token() {
    const endpoint = getReleaseSourceAPIEndpoint(teamReleaseSource)
    return this.accounts.find(a => a.endpoint === endpoint)?.token || null
  }

  /** Start checking for updates periodically (once per app launch). */
  public start() {
    // Development builds don't have increasing versions
    if (this.started || __RELEASE_CHANNEL__ === 'development') {
      return
    }
    this.started = true
    window.setTimeout(() => this.check(true), initialCheckDelay)
    window.setInterval(() => this.check(true), checkInterval)
  }

  /**
   * Look for a newer version.
   *
   * @param inBackground Don't report failures of background checks
   */
  public async check(inBackground = false) {
    const { kind } = this.state
    if (
      kind === 'checking' ||
      kind === 'downloading' ||
      kind === 'installing'
    ) {
      return
    }

    const previous = this.state
    this.setState({ kind: 'checking' })
    try {
      const update = await ipcRenderer.invoke('team-update-check', this.token)
      this.setState(
        update === null
          ? { kind: 'up-to-date', checkedAt: new Date() }
          : { kind: 'available', update }
      )
    } catch (e) {
      log.warn('Failed to check for updates', e)
      this.setState(
        inBackground
          ? previous
          : { kind: 'error', message: errorMessage(e), update: null }
      )
    }
  }

  /** Download and install the available update, restarting the app. */
  public async install() {
    const { state } = this
    const update =
      state.kind === 'available' || state.kind === 'error' ? state.update : null

    if (update === null) {
      return
    }

    this.setState({ kind: 'downloading', update, progress: 0 })
    try {
      await ipcRenderer.invoke('team-update-install', update, this.token)
      this.setState({ kind: 'installing', update })
    } catch (e) {
      log.error('Failed to install the update', e)
      this.setState({ kind: 'error', message: errorMessage(e), update })
    }
  }
}

export const teamUpdater = new TeamUpdater()
