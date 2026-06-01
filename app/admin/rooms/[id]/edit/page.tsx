// app/admin/rooms/[id]/edit/page.tsx
import RoomForm from '../../RoomForm'
import { prisma } from '@/lib/prisma'

export default async function EditRoomPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;

    const room = await prisma.room.findUnique({
        where: { id: parseInt(id) }
    })

    if (!room) {
        return (
            <div className="max-w-4xl mx-auto px-4 py-8">
                <h1 className="text-3xl font-bold">Room not found</h1>
            </div>
        )
    }

    return (
        <div className="max-w-4xl mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-8">Edit Room: {room.name}</h1>
            <div className="bg-white rounded-lg shadow p-6">
                <RoomForm room={{
                    id: room.id,
                    name: room.name,
                    description: room.description,
                    price: room.price,
                    capacity: room.capacity,
                    amenities: room.amenities,
                    images: room.images
                }} />
            </div>
        </div>
    )
}