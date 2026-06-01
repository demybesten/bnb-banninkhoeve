// app/admin/availability/page.tsx - Remove the <nav> section at the top
// Keep everything from the max-w-7xl div onwards

'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import AvailabilityCalendar from '@/components/AvailabilityCalendar'
import { toast } from 'react-hot-toast'

interface Room {
    id: number
    name: string
}

export default function AvailabilityManagement() {
    const [rooms, setRooms] = useState<Room[]>([])
    const [selectedRoom, setSelectedRoom] = useState<number | null>(null)
    const router = useRouter()

    useEffect(() => {
        checkAuth()
        fetchRooms()
    }, [])

    const checkAuth = async () => {
        try {
            const res = await fetch('/api/auth/check')
            if (!res.ok) router.push('/admin/login')
        } catch (err) {
            router.push('/admin/login')
        }
    }

    const fetchRooms = async () => {
        try {
            const res = await fetch('/api/rooms')
            const data = await res.json()
            setRooms(data)
            if (data.length > 0) setSelectedRoom(data[0].id)
        } catch (err) {
            toast.error('Failed to fetch rooms')
        }
    }

    return (
        <div className="max-w-7xl mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-8">Manage Availability</h1>

            {/* Room Selector */}
            <div className="mb-8">
                <label className="block text-sm font-medium text-gray-700 mb-3">
                    Select Room
                </label>
                <div className="flex gap-3 flex-wrap">
                    {rooms.map(room => (
                        <button
                            key={room.id}
                            onClick={() => setSelectedRoom(room.id)}
                            className={`px-6 py-3 rounded-lg font-semibold transition ${
                                selectedRoom === room.id
                                    ? 'bg-amber-800 text-white shadow-lg'
                                    : 'bg-white text-gray-700 hover:bg-amber-50 shadow'
                            }`}
                        >
                            {room.name}
                        </button>
                    ))}
                </div>
            </div>

            {/* Calendar */}
            {selectedRoom && (
                <AvailabilityCalendar roomId={selectedRoom} isAdmin={true} />
            )}
        </div>
    )
}