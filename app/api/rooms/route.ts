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

const ROOM_FIELDS = ['name', 'nameNl', 'description', 'descriptionNl', 'price', 'capacity', 'amenities', 'amenitiesNl', 'images'] as const

function validateRoomData(data: Record<string, unknown>): { valid: boolean; error?: string } {
    if (!data.name || typeof data.name !== 'string' || data.name.trim().length === 0) {
        return { valid: false, error: 'Name is required' }
    }
    if (!data.description || typeof data.description !== 'string') {
        return { valid: false, error: 'Description is required' }
    }
    if (data.price === undefined || typeof data.price !== 'number' || data.price <= 0) {
        return { valid: false, error: 'Price must be a positive number' }
    }
    if (data.capacity === undefined || typeof data.capacity !== 'number' || data.capacity < 1) {
        return { valid: false, error: 'Capacity must be at least 1' }
    }
    return { valid: true }
}

export async function POST(request: Request) {
    const session = await getSession()
    if (!session) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    try {
        const data = await request.json()
        const validation = validateRoomData(data)
        if (!validation.valid) {
            return NextResponse.json({ error: validation.error }, { status: 400 })
        }

        // Whitelist only allowed fields
        const roomData: Record<string, unknown> = {}
        for (const field of ROOM_FIELDS) {
            if (field in data) roomData[field] = data[field]
        }

        const room = await prisma.room.create({ data: roomData as any })
        return NextResponse.json(room, { status: 201 })
    } catch (error) {
        console.error('Error creating room:', error)
        return NextResponse.json(
            { error: 'Failed to create room' },
            { status: 500 }
        )
    }
}