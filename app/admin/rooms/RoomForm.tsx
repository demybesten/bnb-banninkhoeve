// app/admin/rooms/RoomForm.tsx
'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'react-hot-toast'
import ImageUpload from '@/components/ImageUpload'
import { useT } from '@/lib/i18n-client'

interface RoomFormProps {
    room?: {
        id?: number
        name: string
        nameNl?: string | null
        description: string
        descriptionNl?: string | null
        price: number
        capacity: number
        amenities: string
        amenitiesNl?: string | null
        images: string
    }
}

export default function RoomForm({ room }: RoomFormProps) {
    const t = useT()
    const router = useRouter()
    const [formData, setFormData] = useState({
        name: room?.name || '',
        nameNl: room?.nameNl || '',
        description: room?.description || '',
        descriptionNl: room?.descriptionNl || '',
        price: room?.price || '',
        capacity: room?.capacity || '',
        amenities: room?.amenities || '',
        amenitiesNl: room?.amenitiesNl || '',
    })
    const [images, setImages] = useState<string[]>(
        room?.images ? JSON.parse(room.images) : []
    )
    const [saving, setSaving] = useState(false)
    const [activeLang, setActiveLang] = useState<'en' | 'nl'>('en')

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
                toast.success(room?.id ? t.admin.roomForm.updateSuccess : t.admin.roomForm.createSuccess)
                router.push('/admin/dashboard')
                router.refresh()
            } else {
                toast.error(t.admin.roomForm.genericError)
            }
        } catch (err) {
            toast.error(t.admin.roomForm.saveError)
        } finally {
            setSaving(false)
        }
    }

    const set = (field: string, value: string) =>
        setFormData(prev => ({ ...prev, [field]: value }))

    return (
        <form onSubmit={handleSubmit} className="max-w-4xl mx-auto space-y-6">
            {/* Language Tabs */}
            <div className="flex gap-2 border-b border-gray-200 pb-2">
                <button
                    type="button"
                    onClick={() => setActiveLang('en')}
                    className={`px-4 py-2 rounded-t font-medium transition ${
                        activeLang === 'en'
                            ? 'bg-amber-800 text-white'
                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                >
                    {t.admin.roomForm.englishLabel}
                </button>
                <button
                    type="button"
                    onClick={() => setActiveLang('nl')}
                    className={`px-4 py-2 rounded-t font-medium transition ${
                        activeLang === 'nl'
                            ? 'bg-amber-800 text-white'
                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                >
                    {t.admin.roomForm.dutchLabel}
                </button>
            </div>

            {/* English fields */}
            {activeLang === 'en' && (
                <>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            {t.admin.roomForm.roomName}
                        </label>
                        <input
                            type="text"
                            required
                            value={formData.name}
                            onChange={(e) => set('name', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-amber-500 focus:border-amber-500"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            {t.admin.roomForm.description}
                        </label>
                        <textarea
                            required
                            rows={6}
                            value={formData.description}
                            onChange={(e) => set('description', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-amber-500 focus:border-amber-500"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            {t.admin.roomForm.amenities}
                        </label>
                        <input
                            type="text"
                            value={formData.amenities}
                            onChange={(e) => set('amenities', e.target.value)}
                            placeholder={t.admin.roomForm.amenitiesPlaceholder}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-amber-500 focus:border-amber-500"
                        />
                    </div>
                </>
            )}

            {/* Dutch fields */}
            {activeLang === 'nl' && (
                <>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            {t.admin.roomForm.roomNameNl}
                        </label>
                        <input
                            type="text"
                            value={formData.nameNl}
                            onChange={(e) => set('nameNl', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-amber-500 focus:border-amber-500"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            {t.admin.roomForm.descriptionNl}
                        </label>
                        <textarea
                            rows={6}
                            value={formData.descriptionNl}
                            onChange={(e) => set('descriptionNl', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-amber-500 focus:border-amber-500"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            {t.admin.roomForm.amenitiesNl}
                        </label>
                        <input
                            type="text"
                            value={formData.amenitiesNl}
                            onChange={(e) => set('amenitiesNl', e.target.value)}
                            placeholder={t.admin.roomForm.amenitiesPlaceholder}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-amber-500 focus:border-amber-500"
                        />
                    </div>
                </>
            )}

            {/* Shared fields (not language-specific) */}
            <div className="grid grid-cols-2 gap-6">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        {t.admin.roomForm.pricePerNight}
                    </label>
                    <input
                        type="number"
                        required
                        min="0"
                        step="0.01"
                        value={formData.price}
                        onChange={(e) => set('price', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-amber-500 focus:border-amber-500"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        {t.admin.roomForm.capacity}
                    </label>
                    <input
                        type="number"
                        required
                        min="1"
                        value={formData.capacity}
                        onChange={(e) => set('capacity', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-amber-500 focus:border-amber-500"
                    />
                </div>
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t.admin.roomForm.roomImages}
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
                    {saving ? t.admin.roomForm.saving : (room?.id ? t.admin.roomForm.updateRoom : t.admin.roomForm.createRoom)}
                </button>
                <button
                    type="button"
                    onClick={() => router.back()}
                    className="flex-1 bg-gray-300 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-400 transition"
                >
                    {t.admin.roomForm.cancel}
                </button>
            </div>
        </form>
    )
}
