// app/admin/rooms/RoomForm.tsx
'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'react-hot-toast'
import ImageUpload from '@/components/ImageUpload'

interface RoomFormProps {
    room?: {
        id?: number
        name: string
        description: string
        price: number
        capacity: number
        amenities: string
        images: string
    }
}

export default function RoomForm({ room }: RoomFormProps) {
    const router = useRouter()
    const [formData, setFormData] = useState({
        name: room?.name || '',
        description: room?.description || '',
        price: room?.price || '',
        capacity: room?.capacity || '',
        amenities: room?.amenities || '',
    })
    const [images, setImages] = useState<string[]>(
        room?.images ? JSON.parse(room.images) : []
    )
    const [saving, setSaving] = useState(false)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setSaving(true)

        const data = {
            ...formData,
            price: parseFloat(formData.price as string),
            capacity: parseInt(formData.capacity as string),
            images: JSON.stringify(images.filter(url => url.trim() !== ''))
        }

        try {
            const url = room?.id
                ? `/api/rooms/${room.id}`
                : '/api/rooms'

            const method = room?.id ? 'PUT' : 'POST'

            const res = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            })

            if (res.ok) {
                toast.success(room?.id ? 'Room updated!' : 'Room created!')
                router.push('/admin/dashboard')
                router.refresh()
            } else {
                const error = await res.json()
                toast.error(error.error || 'Something went wrong')
            }
        } catch (err) {
            toast.error('Failed to save room')
        } finally {
            setSaving(false)
        }
    }

    return (
        <form onSubmit={handleSubmit} className="max-w-4xl mx-auto space-y-6">
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    Room Name
                </label>
                <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-amber-500 focus:border-amber-500"
                />
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description
                </label>
                <textarea
                    required
                    rows={6}
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-amber-500 focus:border-amber-500"
                />
            </div>

            <div className="grid grid-cols-2 gap-6">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Price per Night ($)
                    </label>
                    <input
                        type="number"
                        required
                        min="0"
                        step="0.01"
                        value={formData.price}
                        onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-amber-500 focus:border-amber-500"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Capacity (guests)
                    </label>
                    <input
                        type="number"
                        required
                        min="1"
                        value={formData.capacity}
                        onChange={(e) => setFormData({ ...formData, capacity: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-amber-500 focus:border-amber-500"
                    />
                </div>
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    Amenities (comma-separated)
                </label>
                <input
                    type="text"
                    value={formData.amenities}
                    onChange={(e) => setFormData({ ...formData, amenities: e.target.value })}
                    placeholder="WiFi, TV, Air Conditioning, Mini Bar"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-amber-500 focus:border-amber-500"
                />
            </div>

            {/* New Image Upload Component */}
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    Room Images
                </label>
                <ImageUpload
                    images={images}
                    onChange={setImages}
                />
            </div>

            <div className="flex gap-4">
                <button
                    type="submit"
                    disabled={saving}
                    className="flex-1 bg-amber-800 text-white py-3 rounded-lg font-semibold hover:bg-amber-700 transition disabled:opacity-50"
                >
                    {saving ? 'Saving...' : (room?.id ? 'Update Room' : 'Create Room')}
                </button>
                <button
                    type="button"
                    onClick={() => router.back()}
                    className="flex-1 bg-gray-300 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-400 transition"
                >
                    Cancel
                </button>
            </div>
        </form>
    )
}