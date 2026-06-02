import { resources } from './resources'

export const DEFAULT_LANGUAGE = 'it'

export const SUPPORTED_LANGUAGES = ['it', 'en', 'fr', 'de', 'es', 'ru', 'ja'] as const

export type SupportedLanguage = (typeof SUPPORTED_LANGUAGES)[number]

const getInitialLanguage = (): SupportedLanguage => {
  if (typeof window === 'undefined') {
    return DEFAULT_LANGUAGE
  }

  const savedLanguage = window.localStorage.getItem('luxosa-language')
  return SUPPORTED_LANGUAGES.includes(savedLanguage as SupportedLanguage)
    ? (savedLanguage as SupportedLanguage)
    : DEFAULT_LANGUAGE
}

export const i18nConfig = {
  resources,
  lng: getInitialLanguage(),
  fallbackLng: DEFAULT_LANGUAGE,
  supportedLngs: SUPPORTED_LANGUAGES,
  ns: ['common', 'home', 'percorsi', 'esperienze', 'messina-cavour', 'test', 'report', 'forms'],
  defaultNS: 'common',
  interpolation: {
    escapeValue: false,
  },
  react: {
    useSuspense: false,
  },
}
