// components/RoomGallery.tsx
'use client'

import { useState } from 'react'
import Image from 'next/image'
import { HiChevronLeft, HiChevronRight } from 'react-icons/hi'

interface RoomGalleryProps {
    images: string[]
    roomName: string
}

export default function RoomGallery({ images, roomName }: RoomGalleryProps) {
    const [currentIndex, setCurrentIndex] = useState(0)

    if (images.length === 0) {
        return (
            <div className="h-96 bg-gray-200 rounded-lg flex items-center justify-center">
                <p className="text-gray-500">No images available</p>
            </div>
        )
    }

    const nextImage = () => {
        setCurrentIndex((prev) => (prev + 1) % images.length)
    }

    const prevImage = () => {
        setCurrentIndex((prev) => (prev - 1 + images.length) % images.length)
    }

    const isExternalUrl = (url: string) => {
        return url.startsWith('http://') || url.startsWith('https://')
    }

    return (
        <div>
            {/* Main Image */}
            <div className="relative h-96 bg-gray-200 rounded-lg overflow-hidden mb-4">
                <img
                    src={images[currentIndex]}
                    alt={`${roomName} - Image ${currentIndex + 1}`}
                    className="w-full h-full object-cover"
                />

                {images.length > 1 && (
                    <>
                        <button
                            onClick={prevImage}
                            className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white p-2 rounded-full shadow-lg transition"
                        >
                            <HiChevronLeft size={24} />
                        </button>
                        <button
                            onClick={nextImage}
                            className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white p-2 rounded-full shadow-lg transition"
                        >
                            <HiChevronRight size={24} />
                        </button>
                    </>
                )}

                <div className="absolute bottom-4 right-4 bg-black/60 text-white px-3 py-1 rounded-full text-sm">
                    {currentIndex + 1} / {images.length}
                </div>
            </div>

            {/* Thumbnails */}
            {images.length > 1 && (
                <div className="flex gap-2 overflow-x-auto pb-2">
                    {images.map((image, index) => (
                        <button
                            key={index}
                            onClick={() => setCurrentIndex(index)}
                            className={`flex-shrink-0 w-20 h-20 rounded overflow-hidden border-2 transition ${
                                index === currentIndex ? 'border-amber-800' : 'border-transparent'
                            }`}
                        >
                            <img
                                src={image}
                                alt={`${roomName} thumbnail ${index + 1}`}
                                className="w-full h-full object-cover"
                            />
                        </button>
                    ))}
                </div>
            )}
        </div>
    )
}