// components/RoomGallery.tsx
'use client'

import { useState } from 'react'
import { HiChevronLeft, HiChevronRight, HiX } from 'react-icons/hi'
import { useT } from '@/lib/i18n-client'

interface RoomGalleryProps {
    images: string[]
    roomName: string
}

export default function RoomGallery({ images, roomName }: RoomGalleryProps) {
    const t = useT()
    const [currentIndex, setCurrentIndex] = useState(0)
    const [isFullscreen, setIsFullscreen] = useState(false)

    if (images.length === 0) {
        return (
            <div className="h-96 bg-gray-200 rounded-lg flex items-center justify-center">
                <p className="text-gray-500">{t.gallery.noImages}</p>
            </div>
        )
    }

    const nextImage = () => {
        setCurrentIndex((prev) => (prev + 1) % images.length)
    }

    const prevImage = () => {
        setCurrentIndex((prev) => (prev - 1 + images.length) % images.length)
    }

    const openFullscreen = () => {
        setIsFullscreen(true)
        document.body.style.overflow = 'hidden'
    }

    const closeFullscreen = () => {
        setIsFullscreen(false)
        document.body.style.overflow = 'auto'
    }

    // Keyboard navigation for fullscreen
    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'ArrowRight') nextImage()
        if (e.key === 'ArrowLeft') prevImage()
        if (e.key === 'Escape') closeFullscreen()
    }

    return (
        <>
            {/* Main Gallery */}
            <div>
                {/* Main Image */}
                <div
                    className="relative w-full aspect-[4/3] bg-gray-200 rounded-lg overflow-hidden mb-4 cursor-pointer group"
                    onClick={openFullscreen}
                >
                    <img
                        src={images[currentIndex]}
                        alt={`${roomName} - Image ${currentIndex + 1}`}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />

                    {/* Hover overlay */}
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300 flex items-center justify-center">
            <span className="text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-black/50 px-4 py-2 rounded-lg">
              {t.gallery.clickFullscreen}
            </span>
                    </div>

                    {images.length > 1 && (
                        <>
                            <button
                                onClick={(e) => { e.stopPropagation(); prevImage(); }}
                                className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white p-2 rounded-full shadow-lg transition opacity-0 group-hover:opacity-100"
                            >
                                <HiChevronLeft size={24} />
                            </button>
                            <button
                                onClick={(e) => { e.stopPropagation(); nextImage(); }}
                                className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white p-2 rounded-full shadow-lg transition opacity-0 group-hover:opacity-100"
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
                                className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all duration-200 ${
                                    index === currentIndex
                                        ? 'border-amber-800 ring-2 ring-amber-300 scale-105'
                                        : 'border-transparent opacity-70 hover:opacity-100 hover:border-gray-300'
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

            {/* Fullscreen Lightbox */}
            {isFullscreen && (
                <div
                    className="fixed inset-0 z-50 bg-black flex items-center justify-center"
                    onClick={closeFullscreen}
                    onKeyDown={handleKeyDown}
                    tabIndex={0}
                >
                    {/* Close button */}
                    <button
                        onClick={closeFullscreen}
                        className="absolute top-4 right-4 text-white hover:text-gray-300 transition z-10 bg-black/50 p-2 rounded-full"
                    >
                        <HiX size={32} />
                    </button>

                    {/* Image counter */}
                    <div className="absolute top-4 left-4 text-white bg-black/50 px-4 py-2 rounded-full text-lg z-10">
                        {currentIndex + 1} / {images.length}
                    </div>

                    {/* Previous button */}
                    {images.length > 1 && (
                        <button
                            onClick={(e) => { e.stopPropagation(); prevImage(); }}
                            className="absolute left-4 text-white hover:text-gray-300 transition z-10 bg-black/50 p-3 rounded-full"
                        >
                            <HiChevronLeft size={40} />
                        </button>
                    )}

                    {/* Main fullscreen image */}
                    <div
                        className="max-w-[90vw] max-h-[90vh] flex items-center justify-center"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <img
                            src={images[currentIndex]}
                            alt={`${roomName} - Fullscreen ${currentIndex + 1}`}
                            className="max-w-full max-h-[90vh] object-contain rounded-lg"
                        />
                    </div>

                    {/* Next button */}
                    {images.length > 1 && (
                        <button
                            onClick={(e) => { e.stopPropagation(); nextImage(); }}
                            className="absolute right-4 text-white hover:text-gray-300 transition z-10 bg-black/50 p-3 rounded-full"
                        >
                            <HiChevronRight size={40} />
                        </button>
                    )}

                    {/* Bottom thumbnails in fullscreen */}
                    {images.length > 1 && (
                        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 bg-black/50 p-3 rounded-xl">
                            {images.map((image, index) => (
                                <button
                                    key={index}
                                    onClick={(e) => { e.stopPropagation(); setCurrentIndex(index); }}
                                    className={`w-12 h-12 rounded-lg overflow-hidden border-2 transition-all ${
                                        index === currentIndex
                                            ? 'border-white scale-110'
                                            : 'border-transparent opacity-50 hover:opacity-100'
                                    }`}
                                >
                                    <img
                                        src={image}
                                        alt={`Thumbnail ${index + 1}`}
                                        className="w-full h-full object-cover"
                                    />
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            )}
        </>
    )
}
