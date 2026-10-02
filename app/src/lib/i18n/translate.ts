import { japanese } from './ja'
import { english } from './en'

/** The languages MS2026 Desktop can be displayed in. */
export type Language = 'ja' | 'en'

/** MS2026 Desktop is shown in Japanese unless the user picks English. */
export const defaultLanguage: Language = 'ja'

/**
 * Builds the translation of a text matched by a pattern.
 *
 * @param t      Translates a part of the text, e.g. the name of an operation,
 *               returning it unchanged when there's no translation.
 * @param groups The groups captured by the pattern.
 */
export type PatternReplacement =
  | string
  | ((t: (text: string) => string, ...groups: string[]) => string)

/** A translation for texts with variable parts, e.g. "Push origin". */
export type TranslationPattern = readonly [RegExp, PatternReplacement]

/**
 * The translations into one language.
 *
 * Texts which contain other elements, like `A branch named <Ref>x</Ref>
 * already exists.`, are matched as `A branch named {0} already exists.` where
 * {0}, {1}, ... stand for the elements in order. Translations must keep the
 * elements in the same order.
 */
export interface ITranslations {
  /** Exact texts, matched ignoring case and repeated whitespace. */
  readonly phrases: Readonly<Record<string, string>>
  /** Texts with variable parts, tried in order when no phrase matches. */
  readonly patterns: ReadonlyArray<TranslationPattern>
}

const translations: Record<Language, ITranslations> = {
  ja: japanese,
  en: english,
}

const phraseMaps = new Map<Language, Map<string, string>>()

/** Collapse whitespace, including non-breaking spaces, and trim. */
export const normalizeText = (text: string) => text.replace(/\s+/g, ' ').trim()

/**
 * The key a phrase is looked up by: case and whitespace around elements are
 * ignored, as whitespace next to an element is sometimes inside of it.
 */
const normalizeKey = (text: string) =>
  normalizeText(text)
    .toLowerCase()
    .replace(/\s*(\{\d+\})\s*/g, '$1')

function getPhraseMap(language: Language) {
  let map = phraseMaps.get(language)
  if (map === undefined) {
    map = new Map()
    for (const [source, translation] of Object.entries(
      translations[language].phrases
    )) {
      map.set(normalizeKey(source), translation)
    }
    phraseMaps.set(language, map)
  }
  return map
}

function lookup(text: string, language: Language, depth = 0): string | null {
  const phrases = getPhraseMap(language)
  const exact = phrases.get(normalizeKey(text))
  if (exact !== undefined) {
    return exact
  }

  // "Delete…" and "Delete..." are translated like "Delete"
  const ellipsis = /^(.*?[^.…\s])\s*(?:…|\.\.\.)$/.exec(text)
  if (ellipsis !== null) {
    const base = phrases.get(normalizeKey(ellipsis[1]))
    if (base !== undefined) {
      return `${base}…`
    }
  }

  if (depth > 3) {
    return null
  }

  const t = (part: string) => {
    const normalized = normalizeText(part)
    return lookup(normalized, language, depth + 1) ?? part
  }

  for (const [pattern, replacement] of translations[language].patterns) {
    const match = pattern.exec(text)
    if (match !== null) {
      return typeof replacement === 'string'
        ? text.replace(pattern, replacement)
        : replacement(t, ...match.slice(1))
    }
  }

  return null
}

/**
 * Translate a text shown in the user interface.
 *
 * Leading and trailing whitespace is kept. Returns null when there is no
 * translation for the text.
 */
export function translate(text: string, language: Language): string | null {
  const normalized = normalizeText(text)
  if (!/\p{L}/u.test(normalized)) {
    return null
  }

  const translated = lookup(normalized, language)
  if (translated === null || translated === normalized) {
    return null
  }

  const leading = /^\s*/.exec(text)?.[0] ?? ''
  const trailing = /\s*$/.exec(text)?.[0] ?? ''
  return `${leading}${translated}${trailing}`
}

/**
 * Translate the label of a menu item.
 *
 * Access keys (`&File`) are kept on Windows and Linux in the style used by
 * Japanese apps, e.g. `ファイル(&F)`.
 */
export function translateMenuLabel(
  label: string,
  language: Language,
  darwin = __DARWIN__
): string {
  let accessKey: string | null = null
  const plain = label.replace(/&(&|.)/g, (_, c: string) => {
    if (c === '&') {
      return '&'
    }
    accessKey = accessKey ?? c
    return c
  })

  const translated = translate(plain, language)
  if (translated === null) {
    return label
  }

  const escaped = translated.replace(/&/g, '&&')
  if (accessKey === null || darwin) {
    return escaped
  }

  const [, text, ellipsis = ''] = /^(.*?)(…)?$/.exec(escaped) ?? ['', escaped]
  return `${text}(&${String(accessKey).toUpperCase()})${ellipsis}`
}

const japaneseRoleLabels: Record<string, string | ((app: string) => string)> = {
  undo: '元に戻す',
  redo: 'やり直す',
  cut: '切り取り',
  copy: 'コピー',
  paste: '貼り付け',
  pasteandmatchstyle: 'ペーストしてスタイルを合わせる',
  delete: '削除',
  selectall: 'すべてを選択',
  services: 'サービス',
  hide: app => `${app} を非表示`,
  hideothers: 'ほかを非表示',
  unhide: 'すべてを表示',
  quit: app => `${app} を終了`,
  minimize: 'しまう',
  zoom: '拡大/縮小',
  close: '閉じる',
  front: 'すべてを手前に移動',
  window: 'ウインドウ',
  help: 'ヘルプ',
  togglefullscreen: 'フルスクリーンの切り替え',
}

/**
 * The label for a menu item with a role and no label of its own, e.g. "Hide
 * MS2026 Desktop", or undefined to use Electron's (English) label.
 */
export function getRoleLabel(
  role: string,
  language: Language,
  appName: string
): string | undefined {
  if (language !== 'ja') {
    return undefined
  }
  const label = japaneseRoleLabels[role.toLowerCase()]
  return typeof label === 'function' ? label(appName) : label
}

/** Translate the labels of a menu template, see translateMenuLabel. */
export function translateMenuTemplate(
  template: ReadonlyArray<Electron.MenuItemConstructorOptions>,
  language: Language,
  appName: string
): Electron.MenuItemConstructorOptions[] {
  return template.map(item => {
    const label =
      item.label !== undefined
        ? translateMenuLabel(item.label, language)
        : item.role !== undefined
        ? getRoleLabel(item.role, language, appName)
        : undefined

    const submenu = Array.isArray(item.submenu)
      ? translateMenuTemplate(item.submenu, language, appName)
      : item.submenu

    return {
      ...item,
      ...(label !== undefined ? { label } : {}),
      ...(submenu !== undefined ? { submenu } : {}),
    }
  })
}
