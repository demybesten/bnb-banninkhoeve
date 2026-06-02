// lib/i18n-server.ts - Server-only: locale detection & dictionary loading
import 'server-only'
import { cookies, headers } from 'next/headers'
import type { Dictionary, Locale } from '@/lib/i18n'

/**
 * Detect the user's preferred locale.
 * Priority: cookie > Accept-Language header > default 'en'
 */
export async function detectLocale(): Promise<Locale> {
  const cookieStore = await cookies()
  const localeCookie = cookieStore.get('NEXT_LOCALE')?.value
  if (localeCookie === 'en' || localeCookie === 'nl') {
    return localeCookie
  }

  const headersList = await headers()
  const acceptLanguage = headersList.get('accept-language')
  if (acceptLanguage) {
    const preferred = parseAcceptLanguage(acceptLanguage)
    if (preferred === 'nl') return 'nl'
  }

  return 'en'
}

function parseAcceptLanguage(header: string): string | null {
  const langs = header
    .split(',')
    .map(part => {
      const [code, qValue] = part.trim().split(';q=')
      return { code: code.split('-')[0].toLowerCase(), q: qValue ? parseFloat(qValue) : 1 }
    })
    .sort((a, b) => b.q - a.q)

  return langs[0]?.code ?? null
}

/**
 * Load translations for a given locale.
 */
const dictionaries: Record<Locale, () => Promise<Dictionary>> = {
  en: () => import('@/dictionaries/en.json').then(m => m.default as unknown as Dictionary),
  nl: () => import('@/dictionaries/nl.json').then(m => m.default as unknown as Dictionary),
}

export async function getTranslations(locale: Locale = 'en'): Promise<Dictionary> {
  return dictionaries[locale]()
}
