// app/api/reviews/route.ts
import { NextResponse } from 'next/server'

export async function GET() {
    const apiKey = process.env.GOOGLE_PLACES_API_KEY
    const placeId = process.env.NEXT_PUBLIC_GOOGLE_PLACE_ID

    if (!apiKey || !placeId) {
        return NextResponse.json({ reviews: [] })
    }

    try {
        const url = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&fields=reviews&key=${apiKey}`
        const response = await fetch(url)
        const data = await response.json()

        return NextResponse.json({
            reviews: data.result?.reviews || []
        })
    } catch (error) {
        console.error('Failed to fetch reviews:', error)
        return NextResponse.json({ reviews: [] })
    }
}