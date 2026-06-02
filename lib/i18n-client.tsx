// lib/i18n-client.tsx - Client-side translation utilities
'use client'

import { createContext, useContext, type ReactNode } from 'react'
import type { Dictionary, Locale } from '@/lib/i18n'

interface TranslationContextValue {
  dictionary: Dictionary
  locale: Locale
  setLocaleCookie: (locale: Locale) => void
}

const TranslationContext = createContext<TranslationContextValue | null>(null)

/**
 * Provide translations and locale switching to client components.
 * The dictionary is read-only — switching languages triggers a full page reload
 * so the server can serve the correct dictionary from the start.
 */
export function TranslationProvider({
  children,
  dictionary,
  initialLocale,
}: {
  children: ReactNode
  dictionary: Dictionary
  initialLocale: Locale
}) {
  const setLocaleCookie = (newLocale: Locale) => {
    document.cookie = `NEXT_LOCALE=${newLocale};path=/;max-age=${60 * 60 * 24 * 365};SameSite=Lax`
  }

  return (
    <TranslationContext.Provider value={{ dictionary, locale: initialLocale, setLocaleCookie }}>
      {children}
    </TranslationContext.Provider>
  )
}

/**
 * Hook to access translations in client components.
 */
export function useT(): Dictionary {
  const ctx = useContext(TranslationContext)
  if (!ctx) {
    throw new Error('useT() must be used within a <TranslationProvider>')
  }
  return ctx.dictionary
}

/**
 * Hook to get the current locale and a function to switch it.
 * Switching triggers a full page reload so the server renders the correct language.
 *
 *   const { locale, setLocale } = useLocale()
 *   setLocale('nl') // sets cookie + reloads page in Dutch
 */
export function useLocale() {
  const ctx = useContext(TranslationContext)
  if (!ctx) {
    throw new Error('useLocale() must be used within a <TranslationProvider>')
  }
  return { locale: ctx.locale, setLocale: ctx.setLocaleCookie }
}
