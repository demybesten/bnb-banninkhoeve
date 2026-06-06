// components/ImageUpload.tsx
'use client'

import { useState, useRef } from 'react'
import { HiX, HiUpload, HiMenu } from 'react-icons/hi'
import { useT } from '@/lib/i18n-client'

interface ImageUploadProps {
    images: string[]
    onChange: (images: string[]) => void
}

export default function ImageUpload({ images, onChange }: ImageUploadProps) {
    const t = useT()
    const [uploading, setUploading] = useState(false)
    const [urlInput, setUrlInput] = useState('')
    const [dragIndex, setDragIndex] = useState<number | null>(null)
    const [dragOverIndex, setDragOverIndex] = useState<number | null>(null)
    const dragItem = useRef<number | null>(null)

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files
        if (!files || files.length === 0) return

        setUploading(true)

        try {
            const formData = new FormData()
            Array.from(files).forEach((file) => {
                formData.append('files', file)
            })

            const res = await fetch('/api/upload', {
                method: 'POST',
                body: formData,
            })

            if (!res.ok) {
                const data = await res.json()
                throw new Error(data.error || 'Upload failed')
            }

            const { urls } = await res.json()
            onChange([...images, ...urls])
        } catch (err: any) {
            alert(err.message || t.admin.imageUpload.error)
        } finally {
            setUploading(false)
            e.target.value = ''
        }
    }

    const handleAddUrl = () => {
        if (urlInput.trim()) {
            onChange([...images, urlInput.trim()])
            setUrlInput('')
        }
    }

    const removeImage = (index: number) => {
        onChange(images.filter((_, i) => i !== index))
    }

    const moveImage = (fromIndex: number, toIndex: number) => {
        const updated = [...images]
        const [removed] = updated.splice(fromIndex, 1)
        updated.splice(toIndex, 0, removed)
        onChange(updated)
    }

    const handleDragStart = (index: number) => {
        dragItem.current = index
        setDragIndex(index)
    }

    const handleDragOver = (e: React.DragEvent, index: number) => {
        e.preventDefault()
        if (dragItem.current !== index) {
            setDragOverIndex(index)
        }
    }

    const handleDragLeave = () => {
        setDragOverIndex(null)
    }

    const handleDrop = (e: React.DragEvent, index: number) => {
        e.preventDefault()
        const fromIndex = dragItem.current
        if (fromIndex !== null && fromIndex !== index) {
            moveImage(fromIndex, index)
        }
        setDragIndex(null)
        setDragOverIndex(null)
        dragItem.current = null
    }

    const handleDragEnd = () => {
        setDragIndex(null)
        setDragOverIndex(null)
        dragItem.current = null
    }

    return (
        <div className="space-y-4">
            <div className="flex gap-4">
                <label className="flex-1">
                    <div className="flex items-center justify-center gap-2 px-4 py-3 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-amber-500 transition">
                        <HiUpload className="text-xl" />
                        <span>{uploading ? t.admin.imageUpload.processing : t.admin.imageUpload.uploadPhotos}</span>
                    </div>
                    <input
                        type="file"
                        multiple
                        accept="image/*"
                        onChange={handleFileUpload}
                        className="hidden"
                        disabled={uploading}
                    />
                </label>
            </div>

            <div className="flex gap-2">
                <input
                    type="url"
                    value={urlInput}
                    onChange={(e) => setUrlInput(e.target.value)}
                    placeholder={t.admin.imageUpload.urlPlaceholder}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-amber-500 focus:border-amber-500"
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddUrl())}
                />
                <button
                    type="button"
                    onClick={handleAddUrl}
                    className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition"
                >
                    {t.admin.imageUpload.addUrl}
                </button>
            </div>

            {images.length > 0 && (
                <div className="grid grid-cols-3 gap-4 mt-4">
                    {images.map((image, index) => {
                        const isDragging = dragIndex === index
                        const isDragOver = dragOverIndex === index
                        const isCover = index === 0

                        return (
                            <div
                                key={index}
                                draggable
                                onDragStart={() => handleDragStart(index)}
                                onDragOver={(e) => handleDragOver(e, index)}
                                onDragLeave={handleDragLeave}
                                onDrop={(e) => handleDrop(e, index)}
                                onDragEnd={handleDragEnd}
                                className={`relative group cursor-grab active:cursor-grabbing rounded-lg transition-all duration-200 ${
                                    isDragging ? 'opacity-40 scale-95' : ''
                                } ${
                                    isDragOver ? 'ring-2 ring-amber-500 ring-offset-2 scale-105' : ''
                                }`}
                            >
                                <img
                                    src={image}
                                    alt={`Image ${index + 1}`}
                                    className="w-full h-32 object-cover rounded-lg pointer-events-none"
                                    draggable={false}
                                />

                                {/* Cover badge on first image */}
                                {isCover && (
                                    <span className="absolute top-1 left-1 bg-amber-800 text-white text-xs px-2 py-0.5 rounded-full font-medium">
                                        Cover
                                    </span>
                                )}

                                {/* Drag handle - appears on hover */}
                                <div className="absolute top-1/2 left-1 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition bg-black/50 text-white p-1 rounded">
                                    <HiMenu size={14} />
                                </div>

                                {/* Remove button */}
                                <button
                                    type="button"
                                    onClick={() => removeImage(index)}
                                    className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition"
                                >
                                    <HiX />
                                </button>

                                {/* Position number */}
                                <span className="absolute bottom-1 right-1 bg-black/60 text-white text-xs px-1.5 py-0.5 rounded">
                                    {index + 1}
                                </span>
                            </div>
                        )
                    })}
                </div>
            )}
        </div>
    )
}
