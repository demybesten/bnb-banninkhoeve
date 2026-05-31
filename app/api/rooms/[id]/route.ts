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
        const room = await prisma.room.update({
            where: { id: parseInt(id) },
            data
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