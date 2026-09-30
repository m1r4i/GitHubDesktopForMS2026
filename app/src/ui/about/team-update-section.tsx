import * as React from 'react'
import { Disposable } from 'event-kit'
import { teamUpdater, TeamUpdateState } from '../../lib/team-updater'
import { Button } from '../lib/button'
import { Row } from '../lib/row'

interface ITeamUpdateSectionState {
  readonly update: TeamUpdateState
}

/** Shows the status of team updates and lets the user check manually. */
export class TeamUpdateSection extends React.Component<
  {},
  ITeamUpdateSectionState
> {
  private subscription: Disposable | null = null

  public constructor(props: {}) {
    super(props)
    this.state = { update: teamUpdater.state }
  }

  public componentDidMount() {
    this.subscription = teamUpdater.onChanged(update =>
      this.setState({ update })
    )
  }

  public componentWillUnmount() {
    this.subscription?.dispose()
  }

  private onCheck = () => {
    teamUpdater.check()
  }

  private onInstall = () => {
    teamUpdater.install()
  }

  private renderStatus() {
    const { update } = this.state
    switch (update.kind) {
      case 'checking':
        return 'アップデートを確認しています…'
      case 'up-to-date':
        return '最新バージョンです。'
      case 'available':
        return `新しいバージョン ${update.update.version} があります。`
      case 'downloading':
        return `ダウンロード中… ${Math.round(update.progress * 100)}%`
      case 'installing':
        return 'インストールして再起動しています…'
      case 'error':
        return `アップデートを確認できませんでした: ${update.message}`
      default:
        return '新しいバージョンはチームのリリースから自動で確認されます。'
    }
  }

  public render() {
    const { update } = this.state
    const busy =
      update.kind === 'checking' ||
      update.kind === 'downloading' ||
      update.kind === 'installing'
    const canInstall =
      update.kind === 'available' ||
      (update.kind === 'error' && update.update !== null)

    return (
      <div className="team-update-section">
        <p className="no-padding">{this.renderStatus()}</p>
        <Row>
          {canInstall ? (
            <Button onClick={this.onInstall}>アップデートして再起動</Button>
          ) : (
            <Button onClick={this.onCheck} disabled={busy}>
              アップデートを確認
            </Button>
          )}
        </Row>
      </div>
    )
  }
}
