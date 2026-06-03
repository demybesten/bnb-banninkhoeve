// app/api/cron/ical-sync/route.ts
// Called by Vercel Cron Jobs every 30 minutes.
// Auth: x-vercel-cron header (set by Vercel) or Authorization: Bearer <CRON_SECRET>

import { NextResponse } from 'next/server'
import { syncAllIcalSources } from '@/lib/ical'

export async function GET(request: Request) {
  const isCron = request.headers.get('x-vercel-cron') === 'true'
  const authHeader = request.headers.get('authorization')
  const secret = process.env.CRON_SECRET

  // Only accept Vercel cron calls or requests with the shared secret
  if (!isCron && (!secret || authHeader !== `Bearer ${secret}`)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const result = await syncAllIcalSources()
    return NextResponse.json({ success: true, ...result })
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Sync failed'
    console.error('Cron iCal sync failed:', message)
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
