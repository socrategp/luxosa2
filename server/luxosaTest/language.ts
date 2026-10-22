// Per-request language for server-rendered text (dossier PDF, email).
//
// Requests run concurrently in the same Node process, so the global i18n
// language must never be switched. Each request instead runs inside
// withLanguage(), and t() (src/i18n/t.ts) reads the language of the request it
// is executing in through AsyncLocalStorage — two simultaneous requests in
// different languages can never see each other's language.

import { AsyncLocalStorage } from 'node:async_hooks';
import { setLanguageResolver } from '../../src/i18n/t.js';
import { SUPPORTED_LANGUAGES, DEFAULT_LANGUAGE, type SupportedLanguage } from '../../src/i18n/config.js';

const storage = new AsyncLocalStorage<string>();

setLanguageResolver(() => storage.getStore());

export function isSupportedLanguage(value: unknown): value is SupportedLanguage {
  return typeof value === 'string' && (SUPPORTED_LANGUAGES as readonly string[]).includes(value);
}

export function withLanguage<T>(language: string, fn: () => T): T {
  return storage.run(isSupportedLanguage(language) ? language : DEFAULT_LANGUAGE, fn);
}

export { DEFAULT_LANGUAGE, SUPPORTED_LANGUAGES, type SupportedLanguage };
