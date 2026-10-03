import * as React from 'react'
import { Button } from '../lib/button'
import { Select } from '../lib/select'
import { Octicon } from '../octicons'
import * as octicons from '../octicons/octicons.generated'

export interface ITag {
  readonly key: string
  readonly label: string
  /** A color shown next to the label, e.g. "#d73a4a" */
  readonly color?: string
}

interface ITagChipProps {
  readonly tag: ITag
  readonly onRemove?: (key: string) => void
  readonly disabled?: boolean
}

class TagChip extends React.Component<ITagChipProps> {
  private onRemove = () => this.props.onRemove?.(this.props.tag.key)

  public render() {
    const { tag, onRemove, disabled } = this.props

    return (
      <li className="tag">
        {tag.color !== undefined && (
          <span className="tag-color" style={{ background: tag.color }} />
        )}
        <span className="tag-label" translate="no">
          {tag.label}
        </span>
        {onRemove !== undefined && (
          <Button
            className="tag-remove"
            onClick={this.onRemove}
            disabled={disabled}
            ariaLabel={`${tag.label} を外す`}
            tooltip="外す"
          >
            <Octicon symbol={octicons.x} />
          </Button>
        )}
      </li>
    )
  }
}

interface ITagPickerProps {
  readonly tags: ReadonlyArray<ITag>

  /** The tags which can be added, null while they're loading */
  readonly options: ReadonlyArray<ITag> | null

  /** The label of the select used to add tags */
  readonly addLabel: string

  /** Shown when there are no tags */
  readonly emptyText: string

  /** Called to add a tag, or undefined when the tags can't be changed */
  readonly onAdd?: (key: string) => void

  /** Called to remove a tag */
  readonly onRemove?: (key: string) => void

  readonly disabled?: boolean
}

/**
 * A list of removable chips with a select to add more, used for the
 * assignees and labels of a pull request.
 */
export class TagPicker extends React.Component<ITagPickerProps> {
  private onSelect = (event: React.FormEvent<HTMLSelectElement>) => {
    const key = event.currentTarget.value
    if (key.length > 0) {
      this.props.onAdd?.(key)
    }
  }

  private renderTag = (tag: ITag) => (
    <TagChip
      key={tag.key}
      tag={tag}
      onRemove={this.props.onRemove}
      disabled={this.props.disabled}
    />
  )

  private renderAdd() {
    const { options, tags, onAdd, disabled, addLabel } = this.props
    if (onAdd === undefined) {
      return null
    }

    const current = new Set(tags.map(t => t.key))
    const available = (options ?? []).filter(o => !current.has(o.key))
    const placeholder =
      options === null
        ? '読み込んでいます…'
        : available.length === 0
        ? '追加できるものはありません'
        : `${addLabel}…`

    return (
      <Select
        className="tag-add"
        label={addLabel}
        value=""
        onChange={this.onSelect}
        disabled={disabled || available.length === 0}
      >
        <option value="">{placeholder}</option>
        {available.map(o => (
          <option key={o.key} value={o.key} translate="no">
            {o.label}
          </option>
        ))}
      </Select>
    )
  }

  public render() {
    const { tags, emptyText } = this.props

    return (
      <div className="tag-picker">
        {tags.length > 0 ? (
          <ul className="tag-list">{tags.map(this.renderTag)}</ul>
        ) : (
          <p className="tag-empty">{emptyText}</p>
        )}
        {this.renderAdd()}
      </div>
    )
  }
}
