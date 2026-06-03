// app/admin/rooms/[id]/edit/page.tsx
import RoomForm from '../../RoomForm'
import { prisma } from '@/lib/prisma'
import { getTranslations } from '@/lib/i18n-server'
import { t as interpolate } from '@/lib/i18n'

export default async function EditRoomPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const t = await getTranslations('nl')

    const room = await prisma.room.findUnique({
        where: { id: parseInt(id) }
    })

    if (!room) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <h1 className="text-3xl font-bold">{t.admin.editRoom.notFound}</h1>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gray-100 py-12">
            <div className="max-w-4xl mx-auto px-4">
                <h1 className="text-3xl font-bold mb-8">{interpolate(t.admin.editRoom.title, { name: room.name })}</h1>
                <div className="bg-white rounded-lg shadow p-6">
                    <RoomForm room={{
                        id: room.id,
                        name: room.name,
                        nameNl: room.nameNl,
                        description: room.description,
                        descriptionNl: room.descriptionNl,
                        price: room.price,
                        capacity: room.capacity,
                        amenities: room.amenities,
                        amenitiesNl: room.amenitiesNl,
                        images: room.images
                    }} />
                </div>
            </div>
        </div>
    )
}
