// app/api/calendar/ical.ics/route.ts
import { NextResponse } from 'next/server'
import { generateIcalExport } from '@/lib/ical'

/**
 * Public iCal export endpoint.
 * Usage: GET /api/calendar/ical.ics
 *   - Exports all rooms' bookings.
 * Query params:
 *   ?room=1 — Export only for a specific room.
 *
 * Give this URL to Airbnb / Bedandbreakfast to import your calendar.
 */
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const roomParam = searchParams.get('room')
    const roomId = roomParam ? parseInt(roomParam) : undefined

    const icalData = await generateIcalExport(roomId)

    return new NextResponse(icalData, {
      headers: {
        'Content-Type': 'text/calendar; charset=utf-8',
        'Content-Disposition': 'inline; filename="cozybnb-calendar.ics"',
        'Cache-Control': 'no-cache, must-revalidate',
      },
    })
  } catch (error: any) {
    console.error('iCal export failed:', error)
    return NextResponse.json({ error: 'Export failed' }, { status: 500 })
  }
}
