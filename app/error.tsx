'use client'

import { useEffect } from 'react'
import Link from 'next/link'

export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string }
    reset: () => void
}) {
    useEffect(() => {
        console.error('Page error:', error)
    }, [error])

    return (
        <div className="flex justify-center items-center min-h-screen">
            <div className="text-center max-w-md px-4">
                <h1 className="text-4xl font-bold text-gray-900 mb-4">Something went wrong</h1>
                <p className="text-gray-600 mb-8">
                    We&apos;re sorry, an unexpected error occurred. Please try again or return home.
                </p>
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
        </div>
    )
}
