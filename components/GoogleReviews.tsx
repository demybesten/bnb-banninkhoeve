// components/GoogleReviews.tsx
'use client'

import { useEffect, useState } from 'react'
import { HiStar } from 'react-icons/hi'

interface Review {
    author_name: string
    rating: number
    text: string
    time: number
    profile_photo_url: string
}

export default function GoogleReviews() {
    const [reviews, setReviews] = useState<Review[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')

    useEffect(() => {
        fetchReviews()
    }, [])

    const fetchReviews = async () => {
        try {
            // You'll need to set up a Google Places API endpoint
            const res = await fetch('/api/reviews')
            if (res.ok) {
                const data = await res.json()
                setReviews(data.reviews || [])
            }
        } catch (err) {
            setError('Failed to load reviews')
        } finally {
            setLoading(false)
        }
    }

    if (loading) {
        return (
            <div className="text-center py-8">
                <div className="animate-pulse">Loading reviews...</div>
            </div>
        )
    }

    if (error) {
        return null // Silently fail - reviews are nice to have
    }

    if (reviews.length === 0) {
        return null
    }

    return (
        <div className="py-12">
            <div className="max-w-7xl mx-auto px-4">
                <div className="text-center mb-12">
                    <h2 className="text-4xl font-bold mb-4">What Our Guests Say</h2>
                    <a
                        href={`https://search.google.com/local/reviews?placeid=${process.env.NEXT_PUBLIC_GOOGLE_PLACE_ID}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-amber-800 hover:text-amber-600 underline"
                    >
                        Read all reviews on Google
                    </a>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {reviews.slice(0, 6).map((review, index) => (
                        <div key={index} className="bg-white p-6 rounded-lg shadow-lg">
                            <div className="flex items-center gap-4 mb-4">
                                <img
                                    src={review.profile_photo_url}
                                    alt={review.author_name}
                                    className="w-12 h-12 rounded-full"
                                />
                                <div>
                                    <h3 className="font-semibold">{review.author_name}</h3>
                                    <div className="flex text-amber-400">
                                        {[...Array(5)].map((_, i) => (
                                            <HiStar
                                                key={i}
                                                className={i < review.rating ? 'text-amber-400' : 'text-gray-300'}
                                            />
                                        ))}
                                    </div>
                                </div>
                            </div>
                            <p className="text-gray-700 line-clamp-4">{review.text}</p>
                            <p className="text-sm text-gray-500 mt-2">
                                {new Date(review.time * 1000).toLocaleDateString()}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}