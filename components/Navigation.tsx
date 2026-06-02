// components/Navigation.tsx
'use client'

import Link from 'next/link'
import { useState } from 'react'
import { HiMenu, HiX } from 'react-icons/hi'
import { useT } from '@/lib/i18n-client'
import LanguageSwitcher from '@/components/LanguageSwitcher'

export default function Navigation() {
    const t = useT()
    const [isOpen, setIsOpen] = useState(false)

    return (
        <nav className="bg-white shadow-lg sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4">
                <div className="flex justify-between h-16">
                    <div className="flex items-center">
                        <Link href="/" className="text-2xl font-bold text-amber-800">
                            {t.common.siteName}
                        </Link>
                    </div>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center space-x-6">
                        <Link href="/" className="text-gray-700 hover:text-amber-600 transition">
                            {t.nav.home}
                        </Link>
                        <Link href="/rooms" className="text-gray-700 hover:text-amber-600 transition">
                            {t.nav.rooms}
                        </Link>
                        <Link href="/about" className="text-gray-700 hover:text-amber-600 transition">
                            {t.nav.about}
                        </Link>
                        <Link href="/contact" className="text-gray-700 hover:text-amber-600 transition">
                            {t.nav.contact}
                        </Link>
                        <LanguageSwitcher />
                    </div>

                    {/* Mobile menu button */}
                    <div className="md:hidden flex items-center gap-2">
                        <LanguageSwitcher />
                        <button onClick={() => setIsOpen(!isOpen)} className="text-gray-700">
                            {isOpen ? <HiX size={24} /> : <HiMenu size={24} />}
                        </button>
                    </div>
                </div>

                {/* Mobile Navigation */}
                {isOpen && (
                    <div className="md:hidden pb-4">
                        <Link href="/" className="block py-2 text-gray-700">{t.nav.home}</Link>
                        <Link href="/rooms" className="block py-2 text-gray-700">{t.nav.rooms}</Link>
                        <Link href="/about" className="block py-2 text-gray-700">{t.nav.about}</Link>
                        <Link href="/contact" className="block py-2 text-gray-700">{t.nav.contact}</Link>
                    </div>
                )}
            </div>
        </nav>
    )
}
