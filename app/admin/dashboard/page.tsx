// app/admin/dashboard/page.tsx
'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { toast } from 'react-hot-toast'
import { HiPencil, HiTrash, HiPlus } from 'react-icons/hi'

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
    const [rooms, setRooms] = useState<Room[]>([])
    const [loading, setLoading] = useState(true)
    const router = useRouter()

    useEffect(() => {
        checkAuth()
        fetchRooms()
    }, [])

    const checkAuth = async () => {
        try {
            const res = await fetch('/api/auth/check')
            if (!res.ok) {
                router.push('/admin/login')
            }
        } catch (err) {
            router.push('/admin/login')
        }
    }

    const fetchRooms = async () => {
        try {
            const res = await fetch('/api/rooms')
            const data = await res.json()
            setRooms(data)
        } catch (err) {
            toast.error('Failed to fetch rooms')
        } finally {
            setLoading(false)
        }
    }

    const handleDelete = async (id: number) => {
        if (!confirm('Are you sure you want to delete this room?')) return

        try {
            const res = await fetch(`/api/rooms/${id}`, {
                method: 'DELETE'
            })

            if (res.ok) {
                toast.success('Room deleted successfully')
                fetchRooms()
            } else {
                const error = await res.json()
                toast.error(error.error || 'Failed to delete room')
            }
        } catch (err) {
            toast.error('Failed to delete room')
        }
    }

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <div className="text-xl">Loading...</div>
            </div>
        )
    }

    return (
        <div className="max-w-7xl mx-auto px-4 py-8">
            <div className="flex justify-between items-center mb-8">
                <h2 className="text-3xl font-bold">Manage Rooms</h2>
                <Link
                    href="/admin/rooms/new"
                    className="bg-amber-800 text-white px-6 py-3 rounded-lg hover:bg-amber-700 transition flex items-center gap-2 font-semibold"
                >
                    <HiPlus />
                    Add Room
                </Link>
            </div>

            {rooms.length === 0 ? (
                <div className="text-center py-20 bg-white rounded-lg shadow">
                    <p className="text-gray-600 text-xl mb-4">No rooms created yet</p>
                    <Link
                        href="/admin/rooms/new"
                        className="bg-amber-800 text-white px-6 py-3 rounded-lg hover:bg-amber-700 transition inline-block"
                    >
                        Create Your First Room
                    </Link>
                </div>
            ) : (
                <div className="grid gap-6">
                    {rooms.map((room) => (
                        <div key={room.id} className="bg-white rounded-lg shadow p-6">
                            <div className="flex justify-between items-start">
                                <div className="flex gap-6">
                                    {JSON.parse(room.images)[0] && (
                                        <img
                                            src={JSON.parse(room.images)[0]}
                                            alt={room.name}
                                            className="w-32 h-32 object-cover rounded-lg"
                                        />
                                    )}
                                    <div>
                                        <h3 className="text-2xl font-semibold mb-2">{room.name}</h3>
                                        <p className="text-gray-600 mb-2 line-clamp-2">{room.description}</p>
                                        <div className="flex gap-4 text-sm text-gray-500">
                                            <span>Price: ${room.price}/night</span>
                                            <span>Capacity: {room.capacity} guests</span>
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
    )
}