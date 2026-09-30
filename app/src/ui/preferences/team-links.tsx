import * as React from 'react'
import {
  ITeamLink,
  isValidTeamLinkURL,
  TeamLinkIcon,
  teamLinkIconOptions,
} from '../../lib/team-links'
import { DialogContent } from '../dialog'
import { Button } from '../lib/button'
import { TextBox } from '../lib/text-box'
import { Octicon } from '../octicons'
import * as octicons from '../octicons/octicons.generated'
import { teamLinkIcons } from '../team-bar/team-link-icons'

interface ITeamLinkIconOptionProps {
  readonly icon: TeamLinkIcon
  readonly label: string
  readonly selected: boolean
  readonly onSelected: (icon: TeamLinkIcon) => void
}

/** One of the icons users can pick for a link */
class TeamLinkIconOption extends React.Component<ITeamLinkIconOptionProps> {
  private onClick = () => this.props.onSelected(this.props.icon)

  public render() {
    const { icon, label, selected } = this.props
    return (
      <Button
        className={
          selected ? 'team-link-icon-option selected' : 'team-link-icon-option'
        }
        onClick={this.onClick}
        ariaLabel={label}
        ariaPressed={selected}
        tooltip={label}
      >
        <Octicon symbol={teamLinkIcons[icon]} />
      </Button>
    )
  }
}

interface ITeamLinkRowProps {
  readonly index: number
  readonly link: ITeamLink
  readonly isFirst: boolean
  readonly isLast: boolean
  readonly onChange: (index: number, change: Partial<ITeamLink>) => void
  readonly onMove: (index: number, offset: number) => void
  readonly onRemove: (index: number) => void
}

interface ITeamLinkRowState {
  readonly pickerOpen: boolean
}

/** A single editable link with an icon picker */
class TeamLinkRow extends React.Component<
  ITeamLinkRowProps,
  ITeamLinkRowState
> {
  public constructor(props: ITeamLinkRowProps) {
    super(props)
    this.state = { pickerOpen: false }
  }

  private onIconSelected = (icon: TeamLinkIcon) => {
    this.props.onChange(this.props.index, { icon })
    this.setState({ pickerOpen: false })
  }

  private onTogglePicker = () =>
    this.setState(state => ({ pickerOpen: !state.pickerOpen }))

  private onLabelChanged = (label: string) =>
    this.props.onChange(this.props.index, { label })

  private onURLChanged = (url: string) =>
    this.props.onChange(this.props.index, { url })

  private onMoveUp = () => this.props.onMove(this.props.index, -1)
  private onMoveDown = () => this.props.onMove(this.props.index, 1)
  private onRemove = () => this.props.onRemove(this.props.index)

  public render() {
    const { link, isFirst, isLast, index } = this.props
    const urlInvalid = !isValidTeamLinkURL(link.url)

    const { pickerOpen } = this.state

    return (
      <li className="team-link-row">
        <div className="team-link-fields">
          <Button
            className="team-link-current-icon"
            onClick={this.onTogglePicker}
            ariaLabel={`リンク ${index + 1} のアイコンを変更`}
            ariaExpanded={pickerOpen}
            tooltip="アイコンを変更"
          >
            <Octicon symbol={teamLinkIcons[link.icon]} />
          </Button>
          <TextBox
            label="名前"
            value={link.label}
            placeholder="ドライブ"
            onValueChanged={this.onLabelChanged}
          />
          <TextBox
            label="URL"
            value={link.url}
            placeholder="https://"
            onValueChanged={this.onURLChanged}
            className={urlInvalid ? 'invalid' : undefined}
          />
          <div className="team-link-row-actions">
            <Button
              onClick={this.onMoveUp}
              disabled={isFirst}
              ariaLabel="上に移動"
              tooltip="上に移動"
            >
              <Octicon symbol={octicons.arrowUp} />
            </Button>
            <Button
              onClick={this.onMoveDown}
              disabled={isLast}
              ariaLabel="下に移動"
              tooltip="下に移動"
            >
              <Octicon symbol={octicons.arrowDown} />
            </Button>
            <Button onClick={this.onRemove} ariaLabel="削除" tooltip="削除">
              <Octicon symbol={octicons.trash} />
            </Button>
          </div>
        </div>
        {pickerOpen && (
          <div
            className="team-link-icon-picker"
            role="group"
            aria-label={`リンク ${index + 1} のアイコン`}
          >
            {teamLinkIconOptions.map(option => (
              <TeamLinkIconOption
                key={option.icon}
                icon={option.icon}
                label={option.label}
                selected={option.icon === link.icon}
                onSelected={this.onIconSelected}
              />
            ))}
          </div>
        )}
        {urlInvalid && (
          <p className="team-link-error">
            http:// または https:// で始まる URL を入力してください。
          </p>
        )}
      </li>
    )
  }
}

interface ITeamLinksPreferencesProps {
  readonly links: ReadonlyArray<ITeamLink>
  readonly onLinksChanged: (links: ReadonlyArray<ITeamLink>) => void
  readonly onResetLinks: () => void
}

/**
 * The settings tab where users edit the links in the bar at the bottom of
 * the window.
 */
export class TeamLinksPreferences extends React.Component<ITeamLinksPreferencesProps> {
  private update(index: number, change: Partial<ITeamLink>) {
    const links = this.props.links.map((link, i) =>
      i === index ? { ...link, ...change } : link
    )
    this.props.onLinksChanged(links)
  }

  private move(index: number, offset: number) {
    const target = index + offset
    const links = [...this.props.links]
    if (target < 0 || target >= links.length) {
      return
    }
    ;[links[index], links[target]] = [links[target], links[index]]
    this.props.onLinksChanged(links)
  }

  private remove(index: number) {
    this.props.onLinksChanged(this.props.links.filter((_, i) => i !== index))
  }

  private onAdd = () => {
    this.props.onLinksChanged([
      ...this.props.links,
      { label: '', url: 'https://', icon: 'link' },
    ])
  }

  public render() {
    const { links } = this.props

    return (
      <DialogContent className="team-links-preferences">
        <h2>リンク</h2>
        <p className="team-links-description">
          画面下のバーに表示するリンクを編集します。アイコンは一覧から選べます。
        </p>
        <ul className="team-links-editor">
          {links.map((link, index) => (
            <TeamLinkRow
              key={index}
              index={index}
              link={link}
              isFirst={index === 0}
              isLast={index === links.length - 1}
              onChange={this.onRowChange}
              onMove={this.onRowMove}
              onRemove={this.onRowRemove}
            />
          ))}
        </ul>
        {links.length === 0 && (
          <p className="team-links-empty">リンクはありません。</p>
        )}
        <div className="team-links-actions">
          <Button onClick={this.onAdd}>
            <Octicon symbol={octicons.plus} />
            リンクを追加
          </Button>
          <Button onClick={this.props.onResetLinks}>チームの既定に戻す</Button>
        </div>
      </DialogContent>
    )
  }

  private onRowChange = (index: number, change: Partial<ITeamLink>) =>
    this.update(index, change)

  private onRowMove = (index: number, offset: number) =>
    this.move(index, offset)

  private onRowRemove = (index: number) => this.remove(index)
}
