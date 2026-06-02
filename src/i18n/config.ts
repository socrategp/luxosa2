export const DEFAULT_LANGUAGE = 'it'

export const SUPPORTED_LANGUAGES = ['it', 'en', 'fr', 'de', 'es'] as const

export type SupportedLanguage = (typeof SUPPORTED_LANGUAGES)[number]

export const i18nConfig = {
  resources: {
    it: { translation: {} },
    en: { translation: {} },
    fr: { translation: {} },
    de: { translation: {} },
    es: { translation: {} },
  },
  lng: DEFAULT_LANGUAGE,
  fallbackLng: DEFAULT_LANGUAGE,
  supportedLngs: SUPPORTED_LANGUAGES,
  ns: ['translation'],
  defaultNS: 'translation',
  interpolation: {
    escapeValue: false,
  },
  react: {
    useSuspense: false,
  },
}
