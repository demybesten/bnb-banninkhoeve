'use client'

import { useEffect } from 'react'
import Link from 'next/link'

export default function RoomsError({
    error,
    reset,
}: {
    error: Error & { digest?: string }
    reset: () => void
}) {
    useEffect(() => {
        console.error('Rooms page error:', error)
    }, [error])

    return (
        <div className="py-20 text-center">
            <h1 className="text-4xl font-bold mb-4">Unable to load rooms</h1>
            <p className="text-gray-600 mb-8">Please try again or check back later.</p>
            <div className="flex gap-4 justify-center">
                <button
                    onClick={reset}
                    className="bg-amber-800 text-white px-6 py-2 rounded-lg hover:bg-amber-700 transition"
                >
                    Try again
                </button>
                <Link
                    href="/"
                    className="border border-amber-800 text-amber-800 px-6 py-2 rounded-lg hover:bg-amber-50 transition"
                >
                    Go home
                </Link>
            </div>
        </div>
    )
}
