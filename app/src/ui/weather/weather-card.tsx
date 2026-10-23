import * as React from 'react'
import classNames from 'classnames'
import { Disposable } from 'event-kit'
import {
  IDailyForecast,
  IHourlyForecast,
  isSameLocation,
  IWeatherForecast,
  IWeatherLocation,
  searchWeatherLocations,
} from '../../lib/weather'
import { IWeatherState, weatherStore } from '../../lib/weather-store'
import {
  getLanguage,
  getLocale,
  onLanguageChanged,
} from '../../lib/i18n/language'
import { TextBox } from '../lib/text-box'
import { Octicon } from '../octicons'
import * as octicons from '../octicons/octicons.generated'
import { WeatherIcon } from './weather-icon'

const formatTemperature = (t: number) => `${Math.round(t)}°`

const formatPercent = (p: number | null) => (p === null ? '–' : `${p}%`)

/** The colors of the card for the weather and time of day */
export const getSkyClassName = (forecast: IWeatherForecast) =>
  `sky-${forecast.current.condition.kind}-${
    forecast.current.isDay ? 'day' : 'night'
  }`

/** A small drawn icon next to a statistic */
const StatIcon = ({ kind }: { kind: 'humidity' | 'rain' | 'range' }) => (
  <svg className="weather-stat-icon" viewBox="0 0 16 16" aria-hidden="true">
    {kind === 'humidity' && (
      <path d="M8 1.5c2.6 3.3 4.5 5.9 4.5 8.2a4.5 4.5 0 0 1-9 0c0-2.3 1.9-4.9 4.5-8.2z" />
    )}
    {kind === 'rain' && (
      <path d="M8 2a6 6 0 0 1 6 6H8.75v4.25a2.25 2.25 0 0 1-4.5 0 .75.75 0 0 1 1.5 0 .75.75 0 0 0 1.5 0V8H2a6 6 0 0 1 6-6z" />
    )}
    {kind === 'range' && (
      <path d="M7 2.5a1.5 1.5 0 0 1 3 0v6.6a3.25 3.25 0 1 1-3 0V2.5zm1.5 8.25a1.25 1.25 0 1 0 0 2.5 1.25 1.25 0 0 0 0-2.5z" />
    )}
  </svg>
)

interface IPlaceButtonProps {
  readonly location: IWeatherLocation
  readonly onSelect: (location: IWeatherLocation) => void
}

class PlaceButton extends React.Component<IPlaceButtonProps> {
  private onClick = () => this.props.onSelect(this.props.location)

  public render() {
    const { location } = this.props
    return (
      <button type="button" className="weather-place" onClick={this.onClick}>
        <span className="weather-place-name" translate="no">
          {location.name}
        </span>
        <span className="weather-place-region" translate="no">
          {location.region}
        </span>
      </button>
    )
  }
}

interface ISavedPlaceProps {
  readonly location: IWeatherLocation
  readonly selected: boolean
  readonly onSelect: (location: IWeatherLocation) => void
  readonly onRemove: (location: IWeatherLocation) => void
}

class SavedPlace extends React.Component<ISavedPlaceProps> {
  private onSelect = () => this.props.onSelect(this.props.location)
  private onRemove = () => this.props.onRemove(this.props.location)

  public render() {
    const { location, selected } = this.props
    return (
      <li className={classNames('weather-saved-place', { selected })}>
        <button type="button" onClick={this.onSelect} translate="no">
          {location.name}
        </button>
        {!selected && (
          <button
            type="button"
            className="weather-saved-remove"
            onClick={this.onRemove}
            aria-label={`${location.name} を削除`}
          >
            <Octicon symbol={octicons.x} />
          </button>
        )}
      </li>
    )
  }
}

interface IWeatherCardState {
  readonly weather: IWeatherState
  readonly pickerOpen: boolean
  readonly query: string
  readonly results: ReadonlyArray<IWeatherLocation> | null
  readonly searching: boolean
  readonly searchError: string | null
  /** Changes with the language so dates are formatted again */
  readonly locale: string
  /** Whether the coming hours and days are shown */
  readonly expanded: boolean
}

const expandedKey = 'ms2026-weather-expanded'

function loadExpanded() {
  try {
    return localStorage.getItem(expandedKey) === '1'
  } catch {
    return false
  }
}

/**
 * The weather at a place of the user's choosing, with the coming hours and
 * days, shown on the home screen.
 */
export class WeatherCard extends React.Component<{}, IWeatherCardState> {
  private subscriptions: Disposable[] = []
  private searchTimer: number | null = null
  private searchId = 0

  public constructor(props: {}) {
    super(props)
    this.state = {
      weather: weatherStore.state,
      pickerOpen: false,
      query: '',
      results: null,
      searching: false,
      searchError: null,
      locale: getLocale(),
      expanded: loadExpanded(),
    }
  }

  public componentDidMount() {
    this.subscriptions.push(
      weatherStore.onChanged(weather => this.setState({ weather })),
      onLanguageChanged(() => this.setState({ locale: getLocale() }))
    )
    weatherStore.start()
  }

  public componentWillUnmount() {
    this.subscriptions.forEach(s => s.dispose())
    if (this.searchTimer !== null) {
      window.clearTimeout(this.searchTimer)
    }
  }

  private onTogglePicker = () => {
    this.setState(state => ({
      pickerOpen: !state.pickerOpen,
      query: '',
      results: null,
      searchError: null,
    }))
  }

  private onQueryChanged = (query: string) => {
    this.setState({ query })
    if (this.searchTimer !== null) {
      window.clearTimeout(this.searchTimer)
    }
    if (query.trim().length === 0) {
      this.setState({ results: null, searching: false, searchError: null })
      return
    }
    // Wait for the user to stop typing
    this.searchTimer = window.setTimeout(() => this.search(query.trim()), 350)
  }

  private async search(query: string) {
    const id = ++this.searchId
    this.setState({ searching: true, searchError: null })
    try {
      const results = await searchWeatherLocations(query, getLanguage())
      if (id === this.searchId) {
        this.setState({ results, searching: false })
      }
    } catch (e) {
      if (id === this.searchId) {
        this.setState({
          searching: false,
          searchError: e instanceof Error ? e.message : `${e}`,
        })
      }
    }
  }

  private onSelectLocation = (location: IWeatherLocation) => {
    weatherStore.selectLocation(location)
    this.setState({ pickerOpen: false, query: '', results: null })
  }

  private onRemoveLocation = (location: IWeatherLocation) => {
    weatherStore.removeLocation(location)
  }

  private onRefresh = () => {
    weatherStore.refresh()
  }

  /** Close the picker with Escape instead of the dialog it's shown in */
  private onSearchKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Escape' && this.state.pickerOpen) {
      e.stopPropagation()
      this.setState({ pickerOpen: false })
    }
  }

  private formatHour(time: Date, index: number) {
    if (index === 0) {
      return '今'
    }
    return new Intl.DateTimeFormat(this.state.locale, {
      hour: 'numeric',
    }).format(time)
  }

  private formatDay(date: Date, index: number) {
    if (index === 0) {
      return '今日'
    }
    return new Intl.DateTimeFormat(this.state.locale, {
      weekday: 'short',
    }).format(date)
  }

  private renderHour = (hour: IHourlyForecast, index: number) => (
    <li key={hour.time.getTime()} className="weather-hour">
      <span className="weather-hour-time">
        {this.formatHour(hour.time, index)}
      </span>
      <WeatherIcon
        kind={hour.condition.kind}
        isDay={hour.isDay}
        size={20}
        animated={false}
      />
      <span className="weather-hour-temp">
        {formatTemperature(hour.temperature)}
      </span>
      <span
        className={classNames('weather-hour-rain', {
          likely: (hour.precipitationProbability ?? 0) >= 50,
        })}
      >
        {formatPercent(hour.precipitationProbability)}
      </span>
    </li>
  )

  private renderDay = (
    day: IDailyForecast,
    index: number,
    days: ReadonlyArray<IDailyForecast>
  ) => {
    // Place each day's range on the scale of the whole week
    const low = Math.min(...days.map(d => d.temperatureMin))
    const high = Math.max(...days.map(d => d.temperatureMax))
    const span = Math.max(high - low, 1)
    const left = ((day.temperatureMin - low) / span) * 100
    const width = ((day.temperatureMax - day.temperatureMin) / span) * 100

    return (
      <li key={day.date.getTime()} className="weather-day">
        <span className="weather-day-name">
          {this.formatDay(day.date, index)}
        </span>
        <WeatherIcon
          kind={day.condition.kind}
          isDay={true}
          size={18}
          animated={false}
        />
        <span
          className={classNames('weather-day-rain', {
            likely: (day.precipitationProbability ?? 0) >= 50,
          })}
        >
          {formatPercent(day.precipitationProbability)}
        </span>
        <span className="weather-day-min">
          {formatTemperature(day.temperatureMin)}
        </span>
        <span className="weather-day-range" aria-hidden="true">
          <span
            className="weather-day-range-bar"
            style={{ left: `${left}%`, width: `${Math.max(width, 4)}%` }}
          />
        </span>
        <span className="weather-day-max">
          {formatTemperature(day.temperatureMax)}
        </span>
      </li>
    )
  }

  private renderPicker() {
    const { weather, query, results, searching, searchError } = this.state

    return (
      <div className="weather-picker" role="dialog" aria-label="地点を選ぶ">
        <TextBox
          className="weather-search"
          type="search"
          value={query}
          onValueChanged={this.onQueryChanged}
          placeholder="地名で検索 (例: 大阪、札幌、New York)"
          ariaLabel="地名で検索"
          autoFocus={true}
          onKeyDown={this.onSearchKeyDown}
        />
        {searching && <p className="weather-picker-note">検索しています…</p>}
        {searchError !== null && (
          <p className="weather-picker-note error">{searchError}</p>
        )}
        {results !== null && !searching && results.length === 0 && (
          <p className="weather-picker-note">見つかりませんでした。</p>
        )}
        {results !== null && results.length > 0 && (
          <div className="weather-results">
            {results.map(r => (
              <PlaceButton
                key={`${r.latitude},${r.longitude}`}
                location={r}
                onSelect={this.onSelectLocation}
              />
            ))}
          </div>
        )}
        <div className="weather-saved">
          <span className="weather-saved-title">保存した地点</span>
          <ul>
            {weather.locations.map((l, i) => (
              <SavedPlace
                key={`${l.latitude},${l.longitude}`}
                location={l}
                selected={i === 0}
                onSelect={this.onSelectLocation}
                onRemove={this.onRemoveLocation}
              />
            ))}
          </ul>
        </div>
      </div>
    )
  }

  private onToggleExpanded = () => {
    const expanded = !this.state.expanded
    try {
      localStorage.setItem(expandedKey, expanded ? '1' : '0')
    } catch {}
    this.setState({ expanded })
  }

  private renderLocationButton() {
    const { weather, pickerOpen } = this.state
    return (
      <button
        type="button"
        className="weather-location"
        onClick={this.onTogglePicker}
        aria-expanded={pickerOpen}
      >
        <span translate="no">{weather.locations[0].name}</span>
        <Octicon
          className="weather-location-chevron"
          symbol={pickerOpen ? octicons.chevronUp : octicons.chevronDown}
        />
      </button>
    )
  }

  /** The one line summary which is always shown */
  private renderSummary(forecast: IWeatherForecast | null) {
    const { loading, error } = this.state.weather

    if (forecast === null) {
      return (
        <div className="weather-bar">
          <span className="weather-bar-icon placeholder" />
          <div className="weather-bar-main">
            {error !== null && !loading ? (
              <span className="weather-bar-error">
                天気を取得できませんでした。
                <button
                  type="button"
                  className="weather-link"
                  onClick={this.onRefresh}
                >
                  再試行
                </button>
              </span>
            ) : (
              <span className="weather-shimmer" aria-busy="true" />
            )}
            {this.renderLocationButton()}
          </div>
        </div>
      )
    }

    const { current, daily } = forecast
    const today = daily.at(0)

    return (
      <div className="weather-bar">
        <WeatherIcon
          className="weather-bar-icon"
          kind={current.condition.kind}
          isDay={current.isDay}
          size={40}
        />
        <div className="weather-bar-main">
          <span className="weather-bar-temp">
            {formatTemperature(current.temperature)}
          </span>
          <span className="weather-bar-text">
            <span className="weather-bar-label">{current.condition.label}</span>
            {this.renderLocationButton()}
          </span>
        </div>
        <dl className="weather-chips">
          <div className="weather-chip">
            <dt>
              <StatIcon kind="humidity" />
              <span className="sr-only">湿度</span>
            </dt>
            <dd>{current.humidity}%</dd>
          </div>
          <div className="weather-chip">
            <dt>
              <StatIcon kind="rain" />
              <span className="sr-only">降水確率</span>
            </dt>
            <dd>{formatPercent(current.precipitationProbability)}</dd>
          </div>
          {today !== undefined && (
            <div className="weather-chip range">
              <dt>
                <StatIcon kind="range" />
                <span className="sr-only">最高 / 最低</span>
              </dt>
              <dd>
                {formatTemperature(today.temperatureMax)}
                <span className="weather-chip-low">
                  {formatTemperature(today.temperatureMin)}
                </span>
              </dd>
            </div>
          )}
        </dl>
        <button
          type="button"
          className="weather-expand"
          onClick={this.onToggleExpanded}
          aria-expanded={this.state.expanded}
          aria-label="詳しい予報"
        >
          <Octicon
            symbol={
              this.state.expanded ? octicons.chevronUp : octicons.chevronDown
            }
          />
        </button>
      </div>
    )
  }

  /** The coming hours and days, shown when expanded */
  private renderDetails(forecast: IWeatherForecast) {
    const { loading } = this.state.weather

    return (
      <div className="weather-details">
        <ul className="weather-hourly" aria-label="1時間ごとの予報">
          {forecast.hourly.slice(0, 12).map(this.renderHour)}
        </ul>
        <ul className="weather-daily" aria-label="週間予報">
          {forecast.daily.map(this.renderDay)}
        </ul>
        <div className="weather-footer">
          <span className="weather-updated">
            {new Intl.DateTimeFormat(this.state.locale, {
              hour: '2-digit',
              minute: '2-digit',
            }).format(forecast.fetchedAt)}{' '}
            更新
          </span>
          <button
            type="button"
            className={classNames('weather-refresh', { spinning: loading })}
            onClick={this.onRefresh}
            aria-label="天気を更新"
          >
            <Octicon symbol={octicons.sync} />
          </button>
        </div>
      </div>
    )
  }

  public render() {
    const { weather, pickerOpen, expanded } = this.state
    const { forecast } = weather
    const location = weather.locations[0]
    // Show the forecast only for the place it was fetched for
    const shown =
      forecast !== null && isSameLocation(forecast.location, location)
        ? forecast
        : null

    return (
      <section
        className={classNames(
          'weather-card',
          shown !== null ? getSkyClassName(shown) : 'sky-loading',
          { expanded }
        )}
        aria-label="天気"
      >
        <div className="weather-sky-decoration" aria-hidden="true" />
        {this.renderSummary(shown)}
        {pickerOpen && this.renderPicker()}
        {expanded && shown !== null && this.renderDetails(shown)}
      </section>
    )
  }
}
