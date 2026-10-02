import { Disposable, Emitter } from 'event-kit'
import { defaultLanguage, Language } from './translate'

/** The languages offered in Settings, named in their own language. */
export const languageOptions: ReadonlyArray<{
  readonly language: Language
  readonly label: string
}> = [
  { language: 'ja', label: '日本語' },
  { language: 'en', label: 'English' },
]

const languageKey = 'ms2026-language'
const emitter = new Emitter()
let current: Language | null = null

const isLanguage = (value: unknown): value is Language =>
  languageOptions.some(o => o.language === value)

/** The language the user interface is shown in. */
export function getLanguage(): Language {
  if (current === null) {
    try {
      const stored = localStorage.getItem(languageKey)
      current = isLanguage(stored) ? stored : defaultLanguage
    } catch {
      current = defaultLanguage
    }
  }
  return current
}

/** Change the language of the user interface. */
export function setLanguage(language: Language) {
  if (language === getLanguage()) {
    return
  }

  current = language
  try {
    localStorage.setItem(languageKey, language)
  } catch (e) {
    log.error('Failed to save the language', e)
  }
  emitter.emit('changed', language)
}

/** Subscribe to changes of the language. */
export function onLanguageChanged(
  fn: (language: Language) => void
): Disposable {
  return emitter.on('changed', fn)
}

/** The locale used to format dates and times, e.g. "ja-JP". */
export function getLocale(language: Language = getLanguage()) {
  return language === 'ja' ? 'ja-JP' : 'en-US'
}
