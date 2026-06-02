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
