'use client'

import { usePathname, useRouter } from 'next/navigation'
import Link from 'next/link'
import { HiPlus, HiCalendar } from 'react-icons/hi'
import { useT } from '@/lib/i18n-client'

export default function AdminHeader() {
    const t = useT()
    const pathname = usePathname()
    const router = useRouter()

    // Don't show on login page
    if (pathname === '/admin/login') return null

    const handleLogout = async () => {
        await fetch('/api/auth/logout', { method: 'POST' })
        router.push('/admin/login')
    }

    return (
        <nav className="bg-white shadow-sm">
            <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
                <Link href="/admin/dashboard" className="text-2xl font-bold text-amber-800 hover:text-amber-700 transition">
                    {t.admin.dashboard.title}
                </Link>
                <div className="flex gap-4 items-center">
                    <Link
                        href="/admin/availability"
                        className="bg-green-700 text-white px-4 py-2 rounded hover:bg-green-600 transition flex items-center gap-2"
                    >
                        <HiCalendar />
                        {t.admin.dashboard.manageAvailability}
                    </Link>
                    <Link
                        href="/admin/rooms/new"
                        className="bg-amber-800 text-white px-4 py-2 rounded hover:bg-amber-700 transition flex items-center gap-2"
                    >
                        <HiPlus />
                        {t.admin.dashboard.addRoom}
                    </Link>
                    <button
                        onClick={handleLogout}
                        className="text-gray-600 hover:text-gray-800 transition"
                    >
                        {t.admin.dashboard.logout}
                    </button>
                </div>
            </div>
        </nav>
    )
}
