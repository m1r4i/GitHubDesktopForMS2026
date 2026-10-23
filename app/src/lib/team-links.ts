/**
 * Team specific customizations for the HAL2026 MS build of the app.
 *
 * The links shown in the bar at the bottom of the window default to
 * `defaultTeamLinks` and can be edited by each user in the settings.
 */

import { Emitter, Disposable } from 'event-kit'

/** The icons users can choose from for their links, with their names */
export const teamLinkIconOptions = [
  { icon: 'folder', label: 'フォルダ' },
  { icon: 'build', label: 'ビルド' },
  { icon: 'calendar', label: 'カレンダー' },
  { icon: 'repo', label: 'リポジトリ' },
  { icon: 'document', label: '本' },
  { icon: 'docs', label: 'ノート' },
  { icon: 'chat', label: 'チャット' },
  { icon: 'link', label: 'リンク' },
  { icon: 'globe', label: 'Web' },
  { icon: 'people', label: 'メンバー' },
  { icon: 'checklist', label: 'タスク' },
  { icon: 'code', label: 'コード' },
  { icon: 'bug', label: 'バグ' },
  { icon: 'rocket', label: 'リリース' },
  { icon: 'server', label: 'サーバー' },
  { icon: 'megaphone', label: 'お知らせ' },
  { icon: 'briefcase', label: '仕事' },
  { icon: 'home', label: 'ホーム' },
] as const

/** The icons available for team links, see TeamBar */
export type TeamLinkIcon = typeof teamLinkIconOptions[number]['icon']

export interface ITeamLink {
  /** Short label shown in the bar */
  readonly label: string
  /** Icon shown in front of the label */
  readonly icon: TeamLinkIcon
  /** Tooltip / accessible description */
  readonly description?: string
  readonly url: string
}

/** The name of the team, shown in the bar at the bottom of the window. */
export const teamName = 'HAL2026_MS'

/** The team's Gitea server, used as the default when adding an account. */
export const teamGiteaServer = 'https://gitea-proxy.mt-cloud.workers.dev'

/** The team's links, used until the user edits them in the settings */
export const defaultTeamLinks: ReadonlyArray<ITeamLink> = [
  {
    label: 'ドライブ',
    icon: 'folder',
    description: 'チームの共有ドライブを開く',
    url: 'https://drive.google.com/drive/folders/1nlj9wwaEi6w3Yn3BuKB2Om5Qz79HUWaz?usp=drive_link',
  },
  {
    label: 'ビルド',
    icon: 'build',
    description: 'ビルド成果物のフォルダを開く',
    url: 'https://drive.google.com/drive/folders/1eA39YkZEMAK6FOKZh8oo22OW1_X9NyTk?usp=drive_link',
  },
  {
    label: 'カレンダー',
    icon: 'calendar',
    description: 'チームのカレンダーを開く',
    url: 'https://calendar.google.com/calendar/u/0/r?cid=YjY0ZDEyYzZkOWJhMDVlNDFkZDUzZGI2Yjc4YmQyYjM3M2RjZThmMDFhZWRkZmIyZTU3N2FkYjE5ZjE3NGZiYkBncm91cC5jYWxlbmRhci5nb29nbGUuY29t',
  },
  {
    label: 'リポジトリ',
    icon: 'repo',
    description: 'Gitea のリポジトリを開く',
    url: `${teamGiteaServer}/HAL2026_MS/HAL2026_MSProject`,
  },
  {
    label: '仕様書',
    icon: 'document',
    description: '仕様書のフォルダを開く',
    url: 'https://drive.google.com/drive/folders/1ygi4C8uLXuME0-aEfENOlbbKpjdrnGeG?usp=drive_link',
  },
  {
    label: 'ドキュメント',
    icon: 'docs',
    description: 'チームのドキュメントを開く',
    url: 'https://msdocs.m1r4i.com/docs/Documents/README.md?b=develop',
  },
  {
    label: 'Discord',
    icon: 'chat',
    description: 'チームの Discord を開く',
    url: 'https://discord.com/channels/1539970951481921657/1539970953046528115',
  },
]

const teamLinksKey = 'team-links'
const emitter = new Emitter()

const isTeamLinkIcon = (icon: unknown): icon is TeamLinkIcon =>
  teamLinkIconOptions.some(o => o.icon === icon)

/** Parse stored links, ignoring anything which isn't a valid link. */
export function parseTeamLinks(json: string): ReadonlyArray<ITeamLink> | null {
  try {
    const value: unknown = JSON.parse(json)
    if (!Array.isArray(value)) {
      return null
    }

    const links = new Array<ITeamLink>()
    for (const item of value) {
      if (
        typeof item === 'object' &&
        item !== null &&
        typeof item.label === 'string' &&
        typeof item.url === 'string' &&
        isTeamLinkIcon(item.icon)
      ) {
        links.push({ label: item.label, url: item.url, icon: item.icon })
      }
    }
    return links
  } catch {
    return null
  }
}

/** Whether the URL can be opened from the team bar (http or https). */
export function isValidTeamLinkURL(url: string) {
  try {
    const { protocol } = new URL(url.trim())
    return protocol === 'https:' || protocol === 'http:'
  } catch {
    return false
  }
}

/** Get the links to show in the team bar. */
export function getTeamLinks(): ReadonlyArray<ITeamLink> {
  try {
    const stored = localStorage.getItem(teamLinksKey)
    const links = stored === null ? null : parseTeamLinks(stored)
    return links ?? defaultTeamLinks
  } catch {
    return defaultTeamLinks
  }
}

/** Save the user's links, pass null to restore the team's defaults. */
export function setTeamLinks(links: ReadonlyArray<ITeamLink> | null) {
  try {
    if (links === null) {
      localStorage.removeItem(teamLinksKey)
    } else {
      const toStore = links.map(({ label, url, icon }) => ({
        label,
        url,
        icon,
      }))
      localStorage.setItem(teamLinksKey, JSON.stringify(toStore))
    }
  } catch (e) {
    log.error('Failed to save the team links', e)
  }
  emitter.emit('changed', getTeamLinks())
}

/** Subscribe to changes to the user's links. */
export function onTeamLinksChanged(
  fn: (links: ReadonlyArray<ITeamLink>) => void
): Disposable {
  return emitter.on('changed', fn)
}

type GreetingTime = 'morning' | 'noon' | 'afternoon' | 'evening' | 'night'

/** Greetings for each time of day, one is picked per day */
export const teamGreetings: Record<GreetingTime, ReadonlyArray<string>> = {
  morning: [
    'おはようございます',
    'おはようございます。今日も一日よろしくお願いします',
    'まずはフェッチから始めましょう',
    'コーヒーの準備はできましたか',
    '新しい一日、新しいブランチ',
    '朝の静かなうちに進めましょう',
  ],
  noon: [
    'お昼の時間です',
    'お昼ごはんはしっかりと',
    'ひと休みしてから続きをどうぞ',
    '午前の作業はコミットしましたか',
    '午後に向けてひと息つきましょう',
  ],
  afternoon: [
    '今日もいいコミットを',
    '小さなコミットを重ねていきましょう',
    'プルリクエストのレビューもお忘れなく',
    'ここからもうひと頑張り',
    '集中できていますか。水分補給もどうぞ',
    'コンフリクトは早めに解決しましょう',
  ],
  evening: [
    'おつかれさまです',
    '今日の作業はプッシュしましたか',
    '今日もおつかれさまでした',
    '帰る前にコミットを忘れずに',
    'いいところで区切りをつけましょう',
  ],
  night: [
    '夜更かしはほどほどに',
    '遅くまでおつかれさまです',
    '続きは明日の自分に任せるのもありです',
    '夜のコミットは見直してからプッシュを',
    'そろそろ休みませんか',
  ],
}

function getGreetingTime(hour: number): GreetingTime {
  if (hour >= 5 && hour < 11) {
    return 'morning'
  } else if (hour >= 11 && hour < 14) {
    return 'noon'
  } else if (hour >= 14 && hour < 18) {
    return 'afternoon'
  } else if (hour >= 18 && hour < 22) {
    return 'evening'
  }
  return 'night'
}

/** Greetings for special days, which take precedence over the usual ones */
function getSpecialGreeting(date: Date, time: GreetingTime): string | null {
  const month = date.getMonth() + 1
  const day = date.getDate()
  const weekday = date.getDay()

  if (month === 1 && day <= 3) {
    return 'あけましておめでとうございます'
  } else if (month === 12 && day === 31) {
    return '今年も一年おつかれさまでした'
  } else if (month === 12 && (day === 24 || day === 25)) {
    return 'メリークリスマス'
  } else if (weekday === 0 || weekday === 6) {
    return time === 'night'
      ? '休日の夜更かしはほどほどに'
      : '休日もおつかれさまです'
  } else if (weekday === 1 && time === 'morning') {
    return '今週もよろしくお願いします'
  } else if (weekday === 5 && (time === 'evening' || time === 'night')) {
    return '今週もおつかれさまでした'
  }

  return null
}

/** A number from a string, so that the same day picks the same greeting */
function hash(text: string) {
  let h = 0
  for (let i = 0; i < text.length; i++) {
    h = (h * 31 + text.charCodeAt(i)) | 0
  }
  return Math.abs(h)
}

/**
 * A greeting for the time of day, shown on the home screen. It changes from
 * day to day but stays the same while the app is open during a time of day.
 */
export function getTeamGreeting(date: Date = new Date()): string {
  const time = getGreetingTime(date.getHours())
  const special = getSpecialGreeting(date, time)
  if (special !== null) {
    return special
  }

  const greetings = teamGreetings[time]
  const key = `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}-${time}`
  return greetings[hash(key) % greetings.length]
}
