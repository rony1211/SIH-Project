import { defaultLocale } from './config';
import type { Locale } from './config';

// Load locale messages — falls back to English for any missing locale
export async function getMessages(locale: Locale) {
  try {
    return (await import(`./locales/${locale}.json`)).default;
  } catch {
    return (await import(`./locales/${defaultLocale}.json`)).default;
  }
}
