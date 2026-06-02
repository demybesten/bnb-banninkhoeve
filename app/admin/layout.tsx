// app/admin/layout.tsx — Admin layout: Dutch-only, no public nav/footer
import { getTranslations } from '@/lib/i18n-server'
import { TranslationProvider } from '@/lib/i18n-client'

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const t = await getTranslations('nl')

  return (
    <TranslationProvider dictionary={t} initialLocale="nl">
      {children}
    </TranslationProvider>
  )
}
