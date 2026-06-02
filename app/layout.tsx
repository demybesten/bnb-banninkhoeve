// app/layout.tsx
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import Navigation from '@/components/Navigation'
import Footer from '@/components/Footer'
import { Toaster } from 'react-hot-toast'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Cozy B&B - Your Home Away From Home',
  description: 'Experience comfort and luxury at our charming bed and breakfast',
}

export default function RootLayout({
                                     children,
                                   }: {
  children: React.ReactNode
}) {
  return (
      <html lang="en">
      <body className={inter.className}>
      <Toaster position="top-center" />
      <Navigation />
      <main className="min-h-screen">
        {children}
      </main>
      <Footer />
      </body>
      </html>
  )
}