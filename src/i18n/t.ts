import i18n from './index.js'

// On the server every request must render in ITS OWN language while many
// requests run concurrently in the same process, so the global i18n language
// cannot be switched. The server registers a resolver (AsyncLocalStorage-backed,
// see server/luxosaTest/language.ts); in the browser none is registered and
// behaviour is exactly the plain i18n.t it always was.
type LanguageResolver = () => string | undefined

let languageResolver: LanguageResolver | undefined

export function setLanguageResolver(resolver: LanguageResolver | undefined) {
  languageResolver = resolver
}

export function currentLanguage(): string {
  return languageResolver?.() ?? i18n.resolvedLanguage ?? i18n.language ?? 'it'
}

export function t(key: string, options?: Record<string, unknown>) {
  const lng = languageResolver?.()
  return i18n.t(key, lng ? { ...options, lng } : options)
}
