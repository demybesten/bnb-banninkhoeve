// app/rooms/[id]/page.tsx
import { prisma } from '@/lib/prisma'
import RoomGallery from '@/components/RoomGallery'

export default async function RoomDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;

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
    const amenities = room.amenities.split(',').map(a => a.trim()).filter(a => a !== '')

    return (
        <div className="py-12">
            <div className="max-w-7xl mx-auto px-4">
                {/* Gallery - Full Width */}
                <div className="mb-8">
                    <RoomGallery images={images} roomName={room.name} />
                </div>

                {/* Room Details */}
                <div className="grid lg:grid-cols-3 gap-8">
                    {/* Main Content - Takes 2/3 */}
                    <div className="lg:col-span-2">
                        <h1 className="text-4xl font-bold mb-4">{room.name}</h1>

                        <div className="mb-8">
                            <h2 className="text-2xl font-semibold mb-4">Description</h2>
                            <p className="text-gray-700 leading-relaxed whitespace-pre-line text-lg">
                                {room.description}
                            </p>
                        </div>

                        {/* Amenities Grid */}
                        {amenities.length > 0 && (
                            <div className="mb-8">
                                <h2 className="text-2xl font-semibold mb-4">Amenities</h2>
                                <div className="grid grid-cols-2 gap-3">
                                    {amenities.map((amenity, index) => (
                                        <div key={index} className="flex items-center gap-2">
                                            <span className="text-amber-800">✓</span>
                                            <span className="text-gray-700">{amenity}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Sidebar - Booking Card */}
                    <div className="lg:col-span-1">
                        <div className="bg-white rounded-lg shadow-lg p-6 sticky top-24">
                            <div className="text-3xl font-bold text-amber-800 mb-2">
                                ${room.price}
                                <span className="text-lg font-normal text-gray-600">/night</span>
                            </div>

                            <div className="border-t border-b py-4 my-4">
                                <div className="flex items-center gap-2 mb-2">
                                    <span>👤</span>
                                    <span className="text-gray-700">Up to {room.capacity} guests</span>
                                </div>
                            </div>

                            <button className="w-full bg-amber-800 text-white py-3 rounded-lg font-semibold hover:bg-amber-700 transition mb-3">
                                Book This Room
                            </button>

                            <button className="w-full border-2 border-amber-800 text-amber-800 py-3 rounded-lg font-semibold hover:bg-amber-50 transition">
                                Contact Us
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}