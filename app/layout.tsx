// app/layout.tsx
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import Navigation from '@/components/Navigation'
import Footer from '@/components/Footer'
import { Toaster } from 'react-hot-toast'
import { getTranslations, detectLocale } from '@/lib/i18n-server'
import { TranslationProvider } from '@/lib/i18n-client'
import { Analytics } from '@vercel/analytics/next'
import { SpeedInsights } from "@vercel/speed-insights/next"

const inter = Inter({ subsets: ['latin'] })

export async function generateMetadata(): Promise<Metadata> {
  const locale = await detectLocale()
  const t = await getTranslations(locale)
  return {
    title: t.metadata.title,
    description: t.metadata.description,
  }
}

export default async function RootLayout({
                                           children,
                                         }: {
  children: React.ReactNode
}) {
  const locale = await detectLocale()
  const t = await getTranslations(locale)

  return (
      <html lang={locale}>
      <body className={inter.className}>
      <TranslationProvider dictionary={t} initialLocale={locale}>
        <Toaster position="top-center" />
        <Navigation />
        <main className="min-h-screen">
          {children}
        </main>
        <Footer />
      </TranslationProvider>
      <Analytics />
      <SpeedInsights/>
      </body>
      </html>
  )
}