// app/api/admin/ical-sources/route.ts
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getSession } from '@/lib/auth'

export async function GET() {
  const session = await getSession()
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const sources = await prisma.icalSource.findMany({
    include: { room: { select: { id: true, name: true } } },
    orderBy: { createdAt: 'asc' },
  })

  return NextResponse.json(sources)
}

export async function POST(request: Request) {
  const session = await getSession()
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const data = await request.json()
    const { roomId, name, url, enabled } = data

    if (!roomId || !name || !url) {
      return NextResponse.json({ error: 'roomId, name, and url are required' }, { status: 400 })
    }

    const source = await prisma.icalSource.create({
      data: {
        roomId: parseInt(roomId),
        name,
        url,
        enabled: enabled !== false,
      },
    })

    return NextResponse.json(source, { status: 201 })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
