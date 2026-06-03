// app/api/calendar/sync/route.ts
// Public endpoint: allows guests to refresh availability from external iCal feeds.
// Rate-limited: only one sync allowed per 5 minutes (checks lastSync across all sources).

import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { syncAllIcalSources } from '@/lib/ical'

const COOLDOWN_MINUTES = 5

export async function POST() {
  try {
    // Check when the most recent sync happened
    const latestSync = await prisma.icalSource.findFirst({
      where: { enabled: true, lastSync: { not: null } },
      orderBy: { lastSync: 'desc' },
      select: { lastSync: true },
    })

    if (latestSync?.lastSync) {
      const elapsed = Date.now() - new Date(latestSync.lastSync).getTime()
      const cooldownMs = COOLDOWN_MINUTES * 60 * 1000

      if (elapsed < cooldownMs) {
        const retryAfterSeconds = Math.ceil((cooldownMs - elapsed) / 1000)
        return NextResponse.json(
          {
            error: 'Rate limited',
            message: `Availability was just refreshed. Please wait ${retryAfterSeconds} seconds before trying again.`,
            retryAfterSeconds,
          },
          {
            status: 429,
            headers: { 'Retry-After': String(retryAfterSeconds) },
          }
        )
      }
    }

    const result = await syncAllIcalSources()
    return NextResponse.json({ success: true, ...result })
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Sync failed'
    console.error('Public iCal sync failed:', message)
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
