/**
 * Weather forecasts from Open-Meteo (https://open-meteo.com), a free service
 * which needs no API key, shown on the home screen.
 */

/** A place to show the weather for */
export interface IWeatherLocation {
  readonly name: string
  /** The region and country, e.g. "大阪府, 日本" */
  readonly region: string
  readonly latitude: number
  readonly longitude: number
}

/** The kind of weather, which decides the icon and colors */
export type WeatherKind =
  | 'clear'
  | 'partly-cloudy'
  | 'cloudy'
  | 'fog'
  | 'drizzle'
  | 'rain'
  | 'snow'
  | 'thunder'

export interface IWeatherCondition {
  readonly kind: WeatherKind
  /** A short Japanese description, e.g. "にわか雨" */
  readonly label: string
}

export interface IHourlyForecast {
  /** The local time of the hour */
  readonly time: Date
  readonly temperature: number
  readonly precipitationProbability: number | null
  readonly condition: IWeatherCondition
  readonly isDay: boolean
}

export interface IDailyForecast {
  readonly date: Date
  readonly condition: IWeatherCondition
  readonly temperatureMax: number
  readonly temperatureMin: number
  readonly precipitationProbability: number | null
}

export interface IWeatherForecast {
  readonly location: IWeatherLocation
  readonly fetchedAt: Date
  readonly current: {
    readonly temperature: number
    readonly humidity: number
    readonly condition: IWeatherCondition
    readonly isDay: boolean
    /** The chance of precipitation in the current hour */
    readonly precipitationProbability: number | null
  }
  /** The coming hours, starting with the current one */
  readonly hourly: ReadonlyArray<IHourlyForecast>
  /** The coming days, starting with today */
  readonly daily: ReadonlyArray<IDailyForecast>
}

const conditions: Record<number, IWeatherCondition> = {
  0: { kind: 'clear', label: '快晴' },
  1: { kind: 'clear', label: '晴れ' },
  2: { kind: 'partly-cloudy', label: '晴れ時々曇り' },
  3: { kind: 'cloudy', label: '曇り' },
  45: { kind: 'fog', label: '霧' },
  48: { kind: 'fog', label: '着氷性の霧' },
  51: { kind: 'drizzle', label: '弱い霧雨' },
  53: { kind: 'drizzle', label: '霧雨' },
  55: { kind: 'drizzle', label: '強い霧雨' },
  56: { kind: 'drizzle', label: '着氷性の霧雨' },
  57: { kind: 'drizzle', label: '強い着氷性の霧雨' },
  61: { kind: 'rain', label: '小雨' },
  63: { kind: 'rain', label: '雨' },
  65: { kind: 'rain', label: '大雨' },
  66: { kind: 'rain', label: '着氷性の雨' },
  67: { kind: 'rain', label: '強い着氷性の雨' },
  71: { kind: 'snow', label: '小雪' },
  73: { kind: 'snow', label: '雪' },
  75: { kind: 'snow', label: '大雪' },
  77: { kind: 'snow', label: '霧雪' },
  80: { kind: 'rain', label: 'にわか雨' },
  81: { kind: 'rain', label: 'にわか雨' },
  82: { kind: 'rain', label: '激しいにわか雨' },
  85: { kind: 'snow', label: 'にわか雪' },
  86: { kind: 'snow', label: '激しいにわか雪' },
  95: { kind: 'thunder', label: '雷雨' },
  96: { kind: 'thunder', label: 'ひょうを伴う雷雨' },
  99: { kind: 'thunder', label: '激しいひょうを伴う雷雨' },
}

/** Describe a WMO weather code as used by Open-Meteo */
export function getWeatherCondition(code: number): IWeatherCondition {
  return conditions[code] ?? { kind: 'cloudy', label: '不明' }
}

/** Tokyo, used until the user picks a place */
export const defaultWeatherLocation: IWeatherLocation = {
  name: '東京',
  region: '東京都, 日本',
  latitude: 35.6895,
  longitude: 139.6917,
}

/** How many hours of the hourly forecast to show */
const hoursToShow = 24

/** The forecast request for a location */
export function getForecastURL(location: IWeatherLocation) {
  const url = new URL('https://api.open-meteo.com/v1/forecast')
  url.searchParams.set('latitude', location.latitude.toFixed(4))
  url.searchParams.set('longitude', location.longitude.toFixed(4))
  url.searchParams.set(
    'current',
    'temperature_2m,relative_humidity_2m,weather_code,is_day'
  )
  url.searchParams.set(
    'hourly',
    'temperature_2m,precipitation_probability,weather_code,is_day'
  )
  url.searchParams.set(
    'daily',
    'weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max'
  )
  url.searchParams.set('timezone', 'auto')
  url.searchParams.set('forecast_days', '7')
  return url.toString()
}

/** The subset of the forecast response which is used */
interface IOpenMeteoForecast {
  readonly current: {
    readonly time: string
    readonly temperature_2m: number
    readonly relative_humidity_2m: number
    readonly weather_code: number
    readonly is_day: number
  }
  readonly hourly: {
    readonly time: ReadonlyArray<string>
    readonly temperature_2m: ReadonlyArray<number>
    readonly precipitation_probability: ReadonlyArray<number | null>
    readonly weather_code: ReadonlyArray<number>
    readonly is_day: ReadonlyArray<number>
  }
  readonly daily: {
    readonly time: ReadonlyArray<string>
    readonly weather_code: ReadonlyArray<number>
    readonly temperature_2m_max: ReadonlyArray<number>
    readonly temperature_2m_min: ReadonlyArray<number>
    readonly precipitation_probability_max: ReadonlyArray<number | null>
  }
}

/**
 * Parse a local time like "2026-10-06T10:15" or a date like "2026-10-06".
 * Open-Meteo returns times in the location's time zone, which we show as is.
 */
function parseLocalTime(text: string) {
  const [date, time = '00:00'] = text.split('T')
  const [year, month, day] = date.split('-').map(Number)
  const [hour, minute] = time.split(':').map(Number)
  return new Date(year, month - 1, day, hour, minute)
}

/** Turn an Open-Meteo response into a forecast */
export function parseForecast(
  location: IWeatherLocation,
  data: IOpenMeteoForecast,
  fetchedAt: Date = new Date()
): IWeatherForecast {
  const { current, hourly, daily } = data

  // The hour the current conditions fall into, e.g. "2026-10-06T10:00"
  const currentHour = `${current.time.slice(0, 13)}:00`
  const start = Math.max(0, hourly.time.indexOf(currentHour))

  const hours = hourly.time
    .slice(start, start + hoursToShow)
    .map((time, i) => ({
      time: parseLocalTime(time),
      temperature: hourly.temperature_2m[start + i],
      precipitationProbability: hourly.precipitation_probability[start + i],
      condition: getWeatherCondition(hourly.weather_code[start + i]),
      isDay: hourly.is_day[start + i] === 1,
    }))

  return {
    location,
    fetchedAt,
    current: {
      temperature: current.temperature_2m,
      humidity: current.relative_humidity_2m,
      condition: getWeatherCondition(current.weather_code),
      isDay: current.is_day === 1,
      precipitationProbability: hours[0]?.precipitationProbability ?? null,
    },
    hourly: hours,
    daily: daily.time.map((date, i) => ({
      date: parseLocalTime(date),
      condition: getWeatherCondition(daily.weather_code[i]),
      temperatureMax: daily.temperature_2m_max[i],
      temperatureMin: daily.temperature_2m_min[i],
      precipitationProbability: daily.precipitation_probability_max[i],
    })),
  }
}

/** Fetch the forecast for a location */
export async function fetchForecast(
  location: IWeatherLocation
): Promise<IWeatherForecast> {
  const response = await fetch(getForecastURL(location))
  if (!response.ok) {
    throw new Error(`天気を取得できませんでした (HTTP ${response.status})`)
  }
  return parseForecast(location, await response.json())
}

interface IOpenMeteoPlace {
  readonly name: string
  readonly latitude: number
  readonly longitude: number
  readonly admin1?: string
  readonly country?: string
}

/** Turn place search results into locations */
export function parsePlaces(
  results: ReadonlyArray<IOpenMeteoPlace> | undefined
): ReadonlyArray<IWeatherLocation> {
  return (results ?? []).map(p => ({
    name: p.name,
    region: [p.admin1, p.country].filter(Boolean).join(', '),
    latitude: p.latitude,
    longitude: p.longitude,
  }))
}

/** Search for places by name, e.g. "大阪" or "Nagoya" */
export async function searchWeatherLocations(
  query: string,
  language: string
): Promise<ReadonlyArray<IWeatherLocation>> {
  const url = new URL('https://geocoding-api.open-meteo.com/v1/search')
  url.searchParams.set('name', query)
  url.searchParams.set('count', '8')
  url.searchParams.set('language', language)
  url.searchParams.set('format', 'json')

  const response = await fetch(url.toString())
  if (!response.ok) {
    throw new Error(`地点を検索できませんでした (HTTP ${response.status})`)
  }
  const data: { results?: ReadonlyArray<IOpenMeteoPlace> } =
    await response.json()
  return parsePlaces(data.results)
}

/** Whether two locations are the same place */
export const isSameLocation = (a: IWeatherLocation, b: IWeatherLocation) =>
  Math.abs(a.latitude - b.latitude) < 0.01 &&
  Math.abs(a.longitude - b.longitude) < 0.01
