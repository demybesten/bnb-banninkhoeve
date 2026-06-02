// lib/i18n.ts - Server-side translation utilities
import 'server-only'
import { cookies, headers } from 'next/headers'

// ── Locale type ────────────────────────────────────────────────────────────

export const locales = ['en', 'nl'] as const
export type Locale = (typeof locales)[number]

// Import the dictionary type from the JSON file
import type enDict from '@/dictionaries/en.json'
export type Dictionary = typeof enDict

// ── Locale detection ───────────────────────────────────────────────────────

/**
 * Detect the user's preferred locale.
 * Priority: cookie > Accept-Language header > default 'en'
 */
export async function detectLocale(): Promise<Locale> {
  // 1. Check for locale override cookie
  const cookieStore = await cookies()
  const localeCookie = cookieStore.get('NEXT_LOCALE')?.value
  if (localeCookie === 'en' || localeCookie === 'nl') {
    return localeCookie
  }

  // 2. Parse Accept-Language header
  const headersList = await headers()
  const acceptLanguage = headersList.get('accept-language')
  if (acceptLanguage) {
    const preferred = parseAcceptLanguage(acceptLanguage)
    if (preferred === 'nl') return 'nl'
  }

  // 3. Default to English
  return 'en'
}

/**
 * Simple Accept-Language parser.
 * Returns the first language code from the header.
 */
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

// ── Dictionary loading ─────────────────────────────────────────────────────

const dictionaries: Record<Locale, () => Promise<Dictionary>> = {
  en: () => import('@/dictionaries/en.json').then(m => m.default as unknown as Dictionary),
  nl: () => import('@/dictionaries/nl.json').then(m => m.default as unknown as Dictionary),
}

/**
 * Load translations for a given locale.
 * Use in Server Components:
 *   const locale = await detectLocale()
 *   const t = await getTranslations(locale)
 *   t.home.hero.title // "Welcome to Cozy B&B" or "Welkom bij Cozy B&B"
 */
export async function getTranslations(locale: Locale = 'en'): Promise<Dictionary> {
  return dictionaries[locale]()
}

// ── Interpolation helper ───────────────────────────────────────────────────

/**
 * Simple template interpolation.
 * Replaces {key} patterns in a string with values from an object.
 *
 * Example: t('€{price}/nacht', { price: 150 }) → "€150/nacht"
 *          t('Tot {capacity} gasten', { capacity: 4 }) → "Tot 4 gasten"
 */
export function t(template: string, values?: Record<string, string | number>): string {
  if (!values) return template
  return template.replace(/\{(\w+)\}/g, (_, key) => String(values[key] ?? `{${key}}`))
}
