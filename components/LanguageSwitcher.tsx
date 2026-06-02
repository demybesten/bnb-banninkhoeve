// components/LanguageSwitcher.tsx
'use client'

import { useLocale } from '@/lib/i18n-client'

const FLAGS: Record<string, string> = {
  en: '🇬🇧',
  nl: '🇳🇱',
}

const LABELS: Record<string, string> = {
  en: 'EN',
  nl: 'NL',
}

export default function LanguageSwitcher() {
  const { locale, setLocale } = useLocale()

  const toggle = () => {
    const next = locale === 'en' ? 'nl' : 'en'
    setLocale(next)
    window.location.reload()
  }

  return (
    <button
      onClick={toggle}
      className="flex items-center gap-1 px-3 py-1.5 rounded-full border border-gray-300 hover:border-amber-500 hover:bg-amber-50 transition text-sm font-medium text-gray-700"
      title={`Switch to ${locale === 'en' ? 'Dutch' : 'English'}`}
    >
      <span>{FLAGS[locale]}</span>
      <span>{LABELS[locale]}</span>
    </button>
  )
}
