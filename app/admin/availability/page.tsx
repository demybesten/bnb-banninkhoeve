// app/admin/availability/page.tsx
'use client'

import { useState, useEffect } from 'react'
import AvailabilityCalendar from '@/components/AvailabilityCalendar'
import IcalSourceManager from '@/components/IcalSourceManager'
import { toast } from 'react-hot-toast'
import { useT } from '@/lib/i18n-client'

interface Room {
    id: number
    name: string
}

export default function AvailabilityManagement() {
    const t = useT()
    const [rooms, setRooms] = useState<Room[]>([])
    const [selectedRoom, setSelectedRoom] = useState<number | null>(null)
    const [tab, setTab] = useState<'calendar' | 'sync'>('calendar')

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
            toast.error(t.admin.availability.fetchError)
        }
    }

    return (
        <div className="min-h-screen bg-gray-100">
            <div className="max-w-7xl mx-auto px-4 py-8">
                {/* Room Selector (shared by both tabs) */}
                <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        {t.admin.availability.selectRoom}
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

                {/* Tab Switcher */}
                <div className="flex gap-0 mb-8">
                    <button
                        onClick={() => setTab('calendar')}
                        className={`px-6 py-3 rounded-l-lg font-semibold transition ${
                            tab === 'calendar'
                                ? 'bg-amber-800 text-white'
                                : 'bg-white text-gray-700 hover:bg-amber-50'
                        }`}
                    >
                        Calendar
                    </button>
                    <button
                        onClick={() => setTab('sync')}
                        className={`px-6 py-3 rounded-r-lg font-semibold transition ${
                            tab === 'sync'
                                ? 'bg-amber-800 text-white'
                                : 'bg-white text-gray-700 hover:bg-amber-50'
                        }`}
                    >
                        iCal Sync
                    </button>
                </div>

                {tab === 'calendar' && selectedRoom && (
                    <AvailabilityCalendar roomId={selectedRoom} isAdmin={true} />
                )}

                {tab === 'sync' && selectedRoom && (
                    <IcalSourceManager roomId={selectedRoom} />
                )}
            </div>
        </div>
    )
}
