import { Disposable, Emitter } from 'event-kit'
import {
  defaultWeatherLocation,
  fetchForecast,
  isSameLocation,
  IWeatherForecast,
  IWeatherLocation,
} from './weather'

export interface IWeatherState {
  /** The places the user has added, the first one is shown */
  readonly locations: ReadonlyArray<IWeatherLocation>
  readonly forecast: IWeatherForecast | null
  readonly loading: boolean
  readonly error: string | null
}

const locationsKey = 'ms2026-weather-locations'
/** Refresh the forecast this often */
const refreshInterval = 30 * 60 * 1000
/** At most this many places are remembered */
const maxLocations = 8

function isLocation(value: unknown): value is IWeatherLocation {
  const l = value as IWeatherLocation
  return (
    typeof l === 'object' &&
    l !== null &&
    typeof l.name === 'string' &&
    typeof l.region === 'string' &&
    typeof l.latitude === 'number' &&
    typeof l.longitude === 'number'
  )
}

function loadLocations(): ReadonlyArray<IWeatherLocation> {
  try {
    const stored = JSON.parse(localStorage.getItem(locationsKey) ?? 'null')
    if (Array.isArray(stored)) {
      const locations = stored.filter(isLocation)
      if (locations.length > 0) {
        return locations
      }
    }
  } catch {}
  return [defaultWeatherLocation]
}

/** Keeps the forecast for the selected place up to date */
class WeatherStore {
  private readonly emitter = new Emitter()
  private started = false
  private requestId = 0
  private _state: IWeatherState = {
    locations: [defaultWeatherLocation],
    forecast: null,
    loading: false,
    error: null,
  }

  public get state() {
    return this._state
  }

  public onChanged(fn: (state: IWeatherState) => void): Disposable {
    return this.emitter.on('changed', fn)
  }

  private setState(changes: Partial<IWeatherState>) {
    this._state = { ...this._state, ...changes }
    this.emitter.emit('changed', this._state)
  }

  /** Start refreshing the forecast periodically (once per app launch) */
  public start() {
    if (this.started) {
      return
    }
    this.started = true
    this.setState({ locations: loadLocations() })
    this.refresh()
    window.setInterval(() => this.refresh(), refreshInterval)
  }

  /** Fetch the forecast for the selected place now */
  public async refresh() {
    const location = this._state.locations[0]
    const id = ++this.requestId
    this.setState({ loading: true, error: null })

    try {
      const forecast = await fetchForecast(location)
      if (id === this.requestId) {
        this.setState({ forecast, loading: false })
      }
    } catch (e) {
      log.warn('Failed to fetch the weather', e)
      if (id === this.requestId) {
        this.setState({
          loading: false,
          error: e instanceof Error ? e.message : `${e}`,
        })
      }
    }
  }

  private saveLocations(locations: ReadonlyArray<IWeatherLocation>) {
    try {
      localStorage.setItem(locationsKey, JSON.stringify(locations))
    } catch (e) {
      log.warn('Failed to save the weather locations', e)
    }
  }

  /** Show the weather for a place, adding it to the remembered places */
  public selectLocation(location: IWeatherLocation) {
    const others = this._state.locations.filter(
      l => !isSameLocation(l, location)
    )
    const locations = [location, ...others].slice(0, maxLocations)
    this.saveLocations(locations)
    // Don't show the previous place's forecast under the new name
    this.setState({ locations, forecast: null })
    this.refresh()
  }

  /** Forget a place, unless it's the only one */
  public removeLocation(location: IWeatherLocation) {
    const locations = this._state.locations.filter(
      l => !isSameLocation(l, location)
    )
    if (locations.length === 0) {
      return
    }
    const wasSelected = isSameLocation(this._state.locations[0], location)
    this.saveLocations(locations)
    this.setState({ locations })
    if (wasSelected) {
      this.setState({ forecast: null })
      this.refresh()
    }
  }
}

export const weatherStore = new WeatherStore()
