// app/api/rooms/[id]/availability/route.ts
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getSession } from '@/lib/auth'

export async function GET(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params
    const { searchParams } = new URL(request.url)
    const history = searchParams.get('history') === 'true'

    try {
        const where: any = {
            roomId: parseInt(id),
        }

        if (!history) {
            where.checkOut = { gte: new Date() }
            where.status = 'confirmed'
        }

        const bookings = await prisma.booking.findMany({
            where,
            orderBy: {
                checkIn: 'asc'
            }
        })

        return NextResponse.json(bookings)
    } catch (error) {
        return NextResponse.json(
            { error: 'Failed to fetch availability' },
            { status: 500 }
        )
    }
}

export async function POST(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params
    const session = await getSession()

    if (!session) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    try {
        const data = await request.json()
        const booking = await prisma.booking.create({
            data: {
                roomId: parseInt(id),
                checkIn: new Date(data.checkIn),
                checkOut: new Date(data.checkOut),
                guestName: data.guestName || 'Admin Block',
                status: data.status || 'confirmed'
            }
        })

        return NextResponse.json(booking, { status: 201 })
    } catch (error) {
        return NextResponse.json(
            { error: 'Failed to create booking' },
            { status: 500 }
        )
    }
}