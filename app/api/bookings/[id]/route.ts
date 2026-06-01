// app/api/bookings/[id]/route.ts
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getSession } from '@/lib/auth'

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
        await prisma.booking.delete({
            where: { id: parseInt(id) }
        })
        return NextResponse.json({ success: true })
    } catch (error) {
        return NextResponse.json(
            { error: 'Failed to delete booking' },
            { status: 500 }
        )
    }
}