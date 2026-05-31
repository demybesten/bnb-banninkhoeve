// app/api/rooms/route.ts
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getSession } from '@/lib/auth'

export async function GET() {
    try {
        const rooms = await prisma.room.findMany({
            orderBy: { createdAt: 'desc' }
        })
        return NextResponse.json(rooms)
    } catch (error) {
        console.error('Error fetching rooms:', error)
        return NextResponse.json(
            { error: 'Failed to fetch rooms' },
            { status: 500 }
        )
    }
}

export async function POST(request: Request) {
    const session = await getSession()
    if (!session) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    try {
        const data = await request.json()
        const room = await prisma.room.create({ data })
        return NextResponse.json(room, { status: 201 })
    } catch (error) {
        console.error('Error creating room:', error)
        return NextResponse.json(
            { error: 'Failed to create room' },
            { status: 500 }
        )
    }
}