import i18n from './index'

export function t(key: string, options?: Record<string, unknown>) {
  return i18n.t(key, options)
}
