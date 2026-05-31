// components/ImageUpload.tsx
'use client'

import { useState } from 'react'
import { HiX, HiUpload } from 'react-icons/hi'

interface ImageUploadProps {
    images: string[]
    onChange: (images: string[]) => void
}

export default function ImageUpload({ images, onChange }: ImageUploadProps) {
    const [uploading, setUploading] = useState(false)
    const [urlInput, setUrlInput] = useState('')

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files
        if (!files || files.length === 0) return

        setUploading(true)

        try {
            const filePromises = Array.from(files).map((file) => {
                return new Promise<string>((resolve, reject) => {
                    const reader = new FileReader()
                    reader.onload = () => resolve(reader.result as string)
                    reader.onerror = reject
                    reader.readAsDataURL(file)
                })
            })

            const base64Images = await Promise.all(filePromises)
            onChange([...images, ...base64Images])
        } catch (err) {
            alert('Error processing images')
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

    return (
        <div className="space-y-4">
            <div className="flex gap-4">
                <label className="flex-1">
                    <div className="flex items-center justify-center gap-2 px-4 py-3 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-amber-500 transition">
                        <HiUpload className="text-xl" />
                        <span>{uploading ? 'Processing...' : 'Upload Photos'}</span>
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
                    placeholder="Or paste an image URL..."
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-amber-500 focus:border-amber-500"
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddUrl())}
                />
                <button
                    type="button"
                    onClick={handleAddUrl}
                    className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition"
                >
                    Add URL
                </button>
            </div>

            {images.length > 0 && (
                <div className="grid grid-cols-3 gap-4 mt-4">
                    {images.map((image, index) => (
                        <div key={index} className="relative group">
                            <img
                                src={image}
                                alt={`Upload ${index + 1}`}
                                className="w-full h-32 object-cover rounded-lg"
                            />
                            <button
                                type="button"
                                onClick={() => removeImage(index)}
                                className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition"
                            >
                                <HiX />
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}