import * as React from 'react'
import { Disposable } from 'event-kit'
import { getTeamGreeting } from '../../lib/team-links'
import { getLanguage, onLanguageChanged } from '../../lib/i18n/language'
import { Language } from '../../lib/i18n/translate'

const timeFormat = new Intl.DateTimeFormat('ja-JP', {
  hour: '2-digit',
  minute: '2-digit',
  hour12: false,
})

const weekdayFormat = new Intl.DateTimeFormat('ja-JP', { weekday: 'long' })

const englishDateFormat = new Intl.DateTimeFormat('en-US', {
  weekday: 'long',
  month: 'long',
  day: 'numeric',
})

/** Format a date like "9月30日 水曜日" or "Wednesday, September 30" */
export const formatHomeDate = (date: Date, language: Language = 'ja') =>
  language === 'ja'
    ? `${date.getMonth() + 1}月${date.getDate()}日 ${weekdayFormat.format(
        date
      )}`
    : englishDateFormat.format(date)

/** Format a time like "09:05" */
export const formatHomeTime = (date: Date) => timeFormat.format(date)

interface IHomeHeaderState {
  readonly time: string
  readonly date: string
  readonly greeting: string
}

function getState(now: Date = new Date()): IHomeHeaderState {
  return {
    time: formatHomeTime(now),
    date: formatHomeDate(now, getLanguage()),
    greeting: getTeamGreeting(now),
  }
}

/**
 * A lock screen style header with the current time, date and a greeting,
 * shown when the repository has no local changes.
 */
export class HomeHeader extends React.Component<{}, IHomeHeaderState> {
  private timer: number | null = null
  private languageSubscription: Disposable | null = null

  public constructor(props: {}) {
    super(props)
    this.state = getState()
  }

  public componentDidMount() {
    this.timer = window.setInterval(this.tick, 1000)
    this.languageSubscription = onLanguageChanged(this.tick)
  }

  public componentWillUnmount() {
    if (this.timer !== null) {
      window.clearInterval(this.timer)
    }
    this.languageSubscription?.dispose()
  }

  private tick = () => {
    const next = getState()
    if (
      next.time !== this.state.time ||
      next.date !== this.state.date ||
      next.greeting !== this.state.greeting
    ) {
      this.setState(next)
    }
  }

  public render() {
    const { time, date, greeting } = this.state

    return (
      <div className="ms-home-header">
        <div className="ms-home-date">{date}</div>
        <div className="ms-home-time" aria-hidden="true">
          {time}
        </div>
        <h1 className="ms-home-greeting">{greeting}</h1>
        <p className="ms-home-subtitle">
          未コミットの変更はありません。次にできることはこちらです。
        </p>
      </div>
    )
  }
}
