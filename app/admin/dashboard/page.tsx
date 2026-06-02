// app/admin/dashboard/page.tsx
'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { toast } from 'react-hot-toast'
import { HiPencil, HiTrash, HiPlus, HiCalendar } from 'react-icons/hi'
import { useT } from '@/lib/i18n-client'
import { t as interpolate } from '@/lib/i18n'

interface Room {
    id: number
    name: string
    description: string
    price: number
    capacity: number
    amenities: string
    images: string
}

export default function AdminDashboard() {
    const t = useT()
    const [rooms, setRooms] = useState<Room[]>([])
    const [loading, setLoading] = useState(true)
    const router = useRouter()

    useEffect(() => {
        fetchRooms()
    }, [])

    const fetchRooms = async () => {
        try {
            const res = await fetch('/api/rooms')
            const data = await res.json()
            setRooms(data)
        } catch (err) {
            toast.error(t.admin.dashboard.fetchError)
        } finally {
            setLoading(false)
        }
    }

    const handleDelete = async (id: number) => {
        if (!confirm(t.admin.dashboard.confirmDelete)) return

        try {
            const res = await fetch(`/api/rooms/${id}`, {
                method: 'DELETE'
            })

            if (res.ok) {
                toast.success(t.admin.dashboard.deleteSuccess)
                fetchRooms()
            } else {
                toast.error(t.admin.dashboard.deleteError)
            }
        } catch (err) {
            toast.error(t.admin.dashboard.deleteError)
        }
    }

    const handleLogout = async () => {
        await fetch('/api/auth/logout', { method: 'POST' })
        router.push('/admin/login')
    }

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <div className="text-xl">{t.common.loading}</div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gray-100">
            <nav className="bg-white shadow-sm">
                <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
                    <h1 className="text-2xl font-bold text-amber-800">{t.admin.dashboard.title}</h1>
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
                            className="text-gray-600 hover:text-gray-800"
                        >
                            {t.admin.dashboard.logout}
                        </button>
                    </div>
                </div>
            </nav>

            <div className="max-w-7xl mx-auto px-4 py-8">
                <h2 className="text-3xl font-bold mb-8">{t.admin.dashboard.manageRooms}</h2>

                {rooms.length === 0 ? (
                    <div className="text-center py-20 bg-white rounded-lg">
                        <p className="text-gray-600 text-xl mb-4">{t.admin.dashboard.noRooms}</p>
                        <Link
                            href="/admin/rooms/new"
                            className="bg-amber-800 text-white px-6 py-3 rounded-lg hover:bg-amber-700 transition inline-block"
                        >
                            {t.admin.dashboard.createFirst}
                        </Link>
                    </div>
                ) : (
                    <div className="grid gap-6">
                        {rooms.map((room) => (
                            <div key={room.id} className="bg-white rounded-lg shadow p-6">
                                <div className="flex justify-between items-start">
                                    <div className="flex gap-6">
                                        {(() => {
                                            const images = room.images ? JSON.parse(room.images) : []
                                            return images[0] && (
                                                <img
                                                    src={images[0]}
                                                    alt={room.name}
                                                    className="w-32 h-32 object-cover rounded"
                                                />
                                            )
                                        })()}
                                        <div>
                                            <h3 className="text-2xl font-semibold mb-2">{room.name}</h3>
                                            <p className="text-gray-600 mb-2 line-clamp-2">{room.description}</p>
                                            <div className="flex gap-4 text-sm text-gray-500">
                                                <span>{interpolate(t.admin.dashboard.pricePerNight, { price: room.price })}</span>
                                                <span>{interpolate(t.admin.dashboard.capacity, { count: room.capacity })}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex gap-2">
                                        <Link
                                            href={`/admin/rooms/${room.id}/edit`}
                                            className="p-2 text-blue-600 hover:bg-blue-50 rounded transition"
                                        >
                                            <HiPencil size={20} />
                                        </Link>
                                        <button
                                            onClick={() => handleDelete(room.id)}
                                            className="p-2 text-red-600 hover:bg-red-50 rounded transition"
                                        >
                                            <HiTrash size={20} />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}
