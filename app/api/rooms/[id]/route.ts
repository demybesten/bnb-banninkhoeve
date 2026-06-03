// app/api/rooms/[id]/route.ts
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getSession } from '@/lib/auth'

export async function GET(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params;

    const room = await prisma.room.findUnique({
        where: { id: parseInt(id) }
    })

    if (!room) {
        return NextResponse.json(
            { error: 'Room not found' },
            { status: 404 }
        )
    }

    return NextResponse.json(room)
}

const ROOM_UPDATE_FIELDS = ['name', 'nameNl', 'description', 'descriptionNl', 'price', 'capacity', 'amenities', 'amenitiesNl', 'images'] as const

export async function PUT(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const session = await getSession()
    if (!session) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    try {
        const { id } = await params;
        const data = await request.json()

        // Validate at least one field is present
        if (!data || Object.keys(data).length === 0) {
            return NextResponse.json({ error: 'No fields to update' }, { status: 400 })
        }

        // Validate types if provided
        if (data.price !== undefined && (typeof data.price !== 'number' || data.price <= 0)) {
            return NextResponse.json({ error: 'Price must be a positive number' }, { status: 400 })
        }
        if (data.capacity !== undefined && (typeof data.capacity !== 'number' || data.capacity < 1)) {
            return NextResponse.json({ error: 'Capacity must be at least 1' }, { status: 400 })
        }

        // Whitelist only allowed fields
        const updateData: Record<string, unknown> = {}
        for (const field of ROOM_UPDATE_FIELDS) {
            if (field in data) updateData[field] = data[field]
        }

        const room = await prisma.room.update({
            where: { id: parseInt(id) },
            data: updateData as any
        })
        return NextResponse.json(room)
    } catch (error) {
        console.error('Update error:', error)
        return NextResponse.json(
            { error: 'Failed to update room' },
            { status: 500 }
        )
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
        const { id } = await params;
        await prisma.room.delete({
            where: { id: parseInt(id) }
        })
        return NextResponse.json({ success: true })
    } catch (error) {
        console.error('Delete error:', error)
        return NextResponse.json(
            { error: 'Failed to delete room' },
            { status: 500 }
        )
    }
}