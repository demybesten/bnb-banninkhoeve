// app/admin/availability/page.tsx
'use client'

import { useState, useEffect } from 'react'
import AvailabilityCalendar from '@/components/AvailabilityCalendar'
import { toast } from 'react-hot-toast'

interface Room {
    id: number
    name: string
}

export default function AvailabilityManagement() {
    const [rooms, setRooms] = useState<Room[]>([])
    const [selectedRoom, setSelectedRoom] = useState<number | null>(null)

    useEffect(() => {
        fetchRooms()
    }, [])

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
        <div className="min-h-screen bg-gray-100">
            <nav className="bg-white shadow-sm">
                <div className="max-w-7xl mx-auto px-4 py-4">
                    <h1 className="text-2xl font-bold text-amber-800">Manage Availability</h1>
                </div>
            </nav>

            <div className="max-w-7xl mx-auto px-4 py-8">
                {/* Room Selector */}
                <div className="mb-8">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Select Room
                    </label>
                    <div className="flex gap-4">
                        {rooms.map(room => (
                            <button
                                key={room.id}
                                onClick={() => setSelectedRoom(room.id)}
                                className={`px-6 py-3 rounded-lg font-semibold transition ${
                                    selectedRoom === room.id
                                        ? 'bg-amber-800 text-white'
                                        : 'bg-white text-gray-700 hover:bg-amber-50'
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
        </div>
    )
}