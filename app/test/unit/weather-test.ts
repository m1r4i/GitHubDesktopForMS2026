import { afterEach, describe, it, mock } from 'node:test'
import assert from 'node:assert'
import {
  defaultWeatherLocation,
  getForecastURL,
  getWeatherCondition,
  parseForecast,
  parsePlaces,
} from '../../src/lib/weather'
import { weatherStore } from '../../src/lib/weather-store'
import { translate } from '../../src/lib/i18n/translate'

const osaka = {
  name: '大阪市',
  region: '大阪府, 日本',
  latitude: 34.6937,
  longitude: 135.5023,
}

function response(code = 61) {
  const hours = Array.from(
    { length: 48 },
    (_, i) => `2026-10-0${i < 24 ? 6 : 7}T${String(i % 24).padStart(2, '0')}:00`
  )
  return {
    current: {
      time: '2026-10-06T14:15',
      temperature_2m: 18.6,
      relative_humidity_2m: 72,
      weather_code: code,
      is_day: 1,
    },
    hourly: {
      time: hours,
      temperature_2m: hours.map((_, i) => i),
      precipitation_probability: hours.map((_, i) => i * 2),
      weather_code: hours.map(() => 3),
      is_day: hours.map((_, i) => (i % 24 >= 6 && i % 24 < 18 ? 1 : 0)),
    },
    daily: {
      time: ['2026-10-06', '2026-10-07'],
      weather_code: [61, 0],
      temperature_2m_max: [21.4, 24],
      temperature_2m_min: [15.2, 16],
      precipitation_probability_max: [80, null],
    },
  }
}

describe('weather', () => {
  it('describes weather codes', () => {
    assert.deepEqual(getWeatherCondition(0), { kind: 'clear', label: '快晴' })
    assert.equal(getWeatherCondition(81).kind, 'rain')
    assert.equal(getWeatherCondition(96).kind, 'thunder')
    assert.equal(getWeatherCondition(1234).label, '不明')
  })

  it('asks for the temperature, humidity and chance of rain', () => {
    const url = new URL(getForecastURL(osaka))
    assert.equal(url.searchParams.get('latitude'), '34.6937')
    assert.match(url.searchParams.get('current')!, /relative_humidity_2m/)
    assert.match(url.searchParams.get('hourly')!, /precipitation_probability/)
    assert.equal(url.searchParams.get('timezone'), 'auto')
  })

  it('parses a forecast starting at the current hour', () => {
    const forecast = parseForecast(osaka, response())

    assert.equal(forecast.current.temperature, 18.6)
    assert.equal(forecast.current.humidity, 72)
    assert.equal(forecast.current.condition.label, '小雨')
    // The 14:00 hour
    assert.equal(forecast.current.precipitationProbability, 28)
    assert.equal(forecast.hourly.length, 24)
    assert.equal(forecast.hourly[0].time.getHours(), 14)
    assert.equal(forecast.hourly[0].temperature, 14)
    assert.equal(forecast.hourly[23].time.getDate(), 7)

    assert.equal(forecast.daily.length, 2)
    assert.equal(forecast.daily[0].temperatureMax, 21.4)
    assert.equal(forecast.daily[1].precipitationProbability, null)
  })

  it('parses places', () => {
    assert.deepEqual(
      parsePlaces([
        {
          name: '大阪市',
          latitude: 34.6937,
          longitude: 135.5023,
          admin1: '大阪府',
          country: '日本',
        },
        { name: 'Somewhere', latitude: 1, longitude: 2 },
      ]),
      [osaka, { name: 'Somewhere', region: '', latitude: 1, longitude: 2 }]
    )
    assert.deepEqual(parsePlaces(undefined), [])
  })

  it('has an English translation of every weather', () => {
    for (const code of [0, 1, 2, 3, 45, 48, 51, 53, 55, 56, 57, 61, 63, 65]) {
      const { label } = getWeatherCondition(code)
      assert.notEqual(translate(label, 'en'), null, label)
    }
    for (const code of [
      66, 67, 71, 73, 75, 77, 80, 81, 82, 85, 86, 95, 96, 99,
    ]) {
      const { label } = getWeatherCondition(code)
      assert.notEqual(translate(label, 'en'), null, label)
    }
  })
})

describe('weatherStore', () => {
  afterEach(() => mock.restoreAll())

  it('remembers the selected places and fetches their forecast', async () => {
    const urls = new Array<string>()
    mock.method(globalThis, 'fetch', async (url: string) => {
      urls.push(url)
      return new Response(JSON.stringify(response(0)))
    })

    weatherStore.selectLocation(osaka)
    assert.equal(weatherStore.state.locations[0], osaka)
    assert.equal(weatherStore.state.forecast, null)

    await weatherStore.refresh()
    assert.match(urls.at(-1)!, /latitude=34\.6937/)
    assert.equal(weatherStore.state.forecast?.location, osaka)
    assert.equal(weatherStore.state.forecast?.current.condition.kind, 'clear')

    // Remembered for the next launch
    const stored = JSON.parse(localStorage.getItem('ms2026-weather-locations')!)
    assert.equal(stored[0].name, '大阪市')

    // Going back to a remembered place moves it to the front
    weatherStore.selectLocation(defaultWeatherLocation)
    assert.deepEqual(
      weatherStore.state.locations.map(l => l.name),
      ['東京', '大阪市']
    )

    // The selected place can't be removed, others can
    weatherStore.removeLocation(osaka)
    assert.deepEqual(
      weatherStore.state.locations.map(l => l.name),
      ['東京']
    )
    weatherStore.removeLocation(defaultWeatherLocation)
    assert.equal(weatherStore.state.locations.length, 1)
  })

  it('reports when the forecast cannot be fetched', async () => {
    mock.method(
      globalThis,
      'fetch',
      async () => new Response('busy', { status: 503 })
    )
    await weatherStore.refresh()
    assert.match(weatherStore.state.error ?? '', /HTTP 503/)
  })
})
