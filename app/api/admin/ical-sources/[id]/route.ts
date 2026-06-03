// app/api/admin/ical-sources/[id]/route.ts
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getSession } from '@/lib/auth'

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getSession()
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const { id } = await params
    const data = await request.json()

    const source = await prisma.icalSource.update({
      where: { id: parseInt(id) },
      data: {
        ...(data.name !== undefined && { name: data.name }),
        ...(data.url !== undefined && { url: data.url }),
        ...(data.enabled !== undefined && { enabled: data.enabled }),
      },
    })

    return NextResponse.json(source)
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getSession()
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const { id } = await params

    // Also clean up any bookings that came from this source
    const source = await prisma.icalSource.findUnique({ where: { id: parseInt(id) } })
    if (source) {
      await prisma.booking.deleteMany({
        where: { source: source.name, icalUid: { not: null } },
      })
    }

    await prisma.icalSource.delete({ where: { id: parseInt(id) } })

    return NextResponse.json({ success: true })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
