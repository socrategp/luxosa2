import i18n from './index.js'

type LocaleModule = { default: Record<string, unknown> }

const bundles = import.meta.glob<LocaleModule>(['./locales/*/*.json', '!./locales/it/*.json'])

export async function loadLanguage(language: string): Promise<void> {
  if (i18n.hasResourceBundle(language, 'common')) return

  const prefix = `./locales/${language}/`
  const loaded = await Promise.all(
    Object.entries(bundles)
      .filter(([path]) => path.startsWith(prefix))
      .map(async ([path, load]) => [path.slice(prefix.length, -'.json'.length), (await load()).default] as const),
  )

  for (const [namespace, data] of loaded) {
    i18n.addResourceBundle(language, namespace, data, true, true)
  }
}
