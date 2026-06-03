// lib/i18n.ts - Types and pure utilities (safe for both server & client)

// Import the dictionary type from the JSON file
import type enDict from '@/dictionaries/en.json'
export type Dictionary = typeof enDict

export const locales = ['en', 'nl'] as const
export type Locale = (typeof locales)[number]

/**
 * Simple template interpolation.
 * Replaces {key} patterns in a string with values from an object.
 *
 * Example: t('€{price}/nacht', { price: 150 }) → "€150/nacht"
 */
export function t(template: string, values?: Record<string, string | number>): string {
  if (!values) return template
  return template.replace(/\{(\w+)\}/g, (_, key) => String(values[key] ?? `{${key}}`))
}

/**
 * Pick a localized value from a room-like object.
 * Falls back to the English field if the Dutch translation is empty/null.
 *
 * Example: getLocalizedField(room, 'name', 'nl') → room.nameNl ?? room.name
 */
export function getLocalizedField<T extends Record<string, unknown>>(
  obj: T,
  field: string,
  locale: Locale,
): string {
  if (locale === 'nl') {
    const nlValue = obj[`${field}Nl`]
    if (typeof nlValue === 'string' && nlValue.length > 0) return nlValue
  }
  // fall back to English (plain field name)
  const enValue = obj[field]
  return typeof enValue === 'string' ? enValue : ''
}
