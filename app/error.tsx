'use client'

import { useEffect } from 'react'
import Link from 'next/link'
import { useT } from '@/lib/i18n-client'

export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string }
    reset: () => void
}) {
    const t = useT()

    useEffect(() => {
        console.error('Page error:', error)
    }, [error])

    return (
        <div className="flex justify-center items-center min-h-screen">
            <div className="text-center max-w-md px-4">
                <h1 className="text-4xl font-bold text-gray-900 mb-4">{t.error.somethingWrong}</h1>
                <p className="text-gray-600 mb-8">
                    {t.error.genericMessage}
                </p>
                <div className="flex gap-4 justify-center">
                    <button
                        onClick={reset}
                        className="bg-amber-800 text-white px-6 py-2 rounded-lg hover:bg-amber-700 transition"
                    >
                        {t.error.tryAgain}
                    </button>
                    <Link
                        href="/"
                        className="border border-amber-800 text-amber-800 px-6 py-2 rounded-lg hover:bg-amber-50 transition"
                    >
                        {t.error.goHome}
                    </Link>
                </div>
            </div>
        </div>
    )
}
