// components/AdminNav.tsx
'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { HiHome, HiPhotograph, HiCalendar, HiLogout } from 'react-icons/hi'

export default function AdminNav() {
    const pathname = usePathname()
    const router = useRouter()

    const handleLogout = async () => {
        await fetch('/api/auth/logout', { method: 'POST' })
        router.push('/admin/login')
    }

    const isActive = (path: string) => {
        return pathname === path || pathname.startsWith(path + '/')
    }

    return (
        <nav className="bg-amber-900 text-white shadow-lg sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4">
                <div className="flex justify-between items-center h-14">
                    {/* Left side - Navigation */}
                    <div className="flex items-center gap-1">
                        <Link
                            href="/admin/dashboard"
                            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm transition ${
                                isActive('/admin/dashboard') ? 'bg-amber-700' : 'hover:bg-amber-800'
                            }`}
                        >
                            <HiHome />
                            Dashboard
                        </Link>

                        <Link
                            href="/admin/availability"
                            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm transition ${
                                isActive('/admin/availability') ? 'bg-amber-700' : 'hover:bg-amber-800'
                            }`}
                        >
                            <HiCalendar />
                            Availability
                        </Link>
                        
                    </div>

                    {/* Right side - Back to site & Logout */}
                    <div className="flex items-center gap-2">
                        <Link
                            href="/"
                            className="text-sm text-amber-200 hover:text-white transition px-3 py-1"
                        >
                            View Site
                        </Link>
                        <button
                            onClick={handleLogout}
                            className="flex items-center gap-2 bg-red-800 hover:bg-red-700 px-4 py-2 rounded-lg text-sm transition"
                        >
                            <HiLogout />
                            Logout
                        </button>
                    </div>
                </div>
            </div>
        </nav>
    )
}