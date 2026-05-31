// app/rooms/[id]/page.tsx
import { prisma } from '@/lib/prisma'
import RoomGallery from '@/components/RoomGallery'

export default async function RoomDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;  // Await params here

    const room = await prisma.room.findUnique({
        where: { id: parseInt(id) }
    })

    if (!room) {
        return (
            <div className="py-20 text-center">
                <h1 className="text-4xl font-bold">Room not found</h1>
            </div>
        )
    }

    const images = JSON.parse(room.images || '[]')
    const amenities = room.amenities.split(',').map(a => a.trim())

    return (
        <div className="py-12">
            <div className="max-w-7xl mx-auto px-4">
                <div className="grid lg:grid-cols-2 gap-12">
                    {/* Gallery */}
                    <div>
                        <RoomGallery images={images} roomName={room.name} />
                    </div>

                    {/* Room Details */}
                    <div>
                        <h1 className="text-4xl font-bold mb-4">{room.name}</h1>
                        <div className="text-3xl font-bold text-amber-800 mb-6">
                            ${room.price}<span className="text-lg font-normal text-gray-600">/night</span>
                        </div>

                        <div className="bg-gray-50 rounded-lg p-6 mb-6">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <span className="text-gray-600">Capacity</span>
                                    <p className="font-semibold">Up to {room.capacity} guests</p>
                                </div>
                            </div>
                        </div>

                        <div className="mb-6">
                            <h2 className="text-2xl font-semibold mb-3">Description</h2>
                            <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                                {room.description}
                            </p>
                        </div>

                        {amenities.length > 0 && amenities[0] !== '' && (
                            <div className="mb-6">
                                <h2 className="text-2xl font-semibold mb-3">Amenities</h2>
                                <div className="flex flex-wrap gap-2">
                                    {amenities.map((amenity, index) => (
                                        <span
                                            key={index}
                                            className="bg-amber-100 text-amber-800 px-3 py-1 rounded-full text-sm"
                                        >
                      {amenity}
                    </span>
                                    ))}
                                </div>
                            </div>
                        )}

                        <button className="w-full bg-amber-800 text-white py-3 rounded-lg font-semibold hover:bg-amber-700 transition">
                            Book This Room
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}