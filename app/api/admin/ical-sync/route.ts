// app/api/admin/ical-sync/route.ts
import { NextResponse } from 'next/server'
import { getSession } from '@/lib/auth'
import { syncAllIcalSources, syncIcalSource } from '@/lib/ical'

export async function POST(request: Request) {
  const session = await getSession()
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const body = await request.json().catch(() => ({}))
    const sourceId = body.sourceId ? parseInt(body.sourceId) : null

    if (sourceId) {
      const result = await syncIcalSource(sourceId)
      return NextResponse.json(result)
    } else {
      const result = await syncAllIcalSources()
      return NextResponse.json(result)
    }
  } catch (error: any) {
    console.error('iCal sync failed:', error)
    return NextResponse.json({ error: error.message || 'Sync failed' }, { status: 500 })
  }
}
