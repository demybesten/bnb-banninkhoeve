// app/rooms/[id]/page.tsx
import { prisma } from '@/lib/prisma'
import RoomGallery from '@/components/RoomGallery'
import BookingWidget from '@/components/BookingWidget'
import AvailabilityCalendar from '@/components/AvailabilityCalendar'
import { getTranslations, detectLocale } from '@/lib/i18n-server'
import { getLocalizedField } from '@/lib/i18n'

export default async function RoomDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const locale = await detectLocale()
    const dict = await getTranslations(locale)

    const room = await prisma.room.findUnique({
        where: { id: parseInt(id) }
    })

    if (!room) {
        return (
            <div className="py-20 text-center">
                <h1 className="text-4xl font-bold">{dict.roomDetail.notFound}</h1>
            </div>
        )
    }

    const images = JSON.parse(room.images || '[]')
    const amenitiesRaw = getLocalizedField(room, 'amenities', locale)
    const amenities = amenitiesRaw.split(',').map(a => a.trim()).filter(a => a !== '')

    return (
        <div className="py-12">
            <div className="max-w-7xl mx-auto px-4">
                {/* Gallery - Full Width */}
                <div className="mb-8">
                    <RoomGallery images={images} roomName={getLocalizedField(room, 'name', locale)} />
                </div>

                {/* Room Details */}
                <div className="grid lg:grid-cols-3 gap-8">
                    {/* Main Content - Takes 2/3 */}
                    <div className="lg:col-span-2">
                        <h1 className="text-4xl font-bold mb-4">{getLocalizedField(room, 'name', locale)}</h1>

                        <div className="mb-8">
                            <h2 className="text-2xl font-semibold mb-4">{dict.roomDetail.description}</h2>
                            <p className="text-gray-700 leading-relaxed whitespace-pre-line text-lg">
                                {getLocalizedField(room, 'description', locale)}
                            </p>
                        </div>
                        <div className="mb-8">
                            <AvailabilityCalendar
                                roomId={room.id}
                                roomName={room.name}
                                roomPrice={room.price}
                                roomCapacity={room.capacity}
                            />
                        </div>

                        {/* Amenities Grid */}
                        {amenities.length > 0 && (
                            <div className="mb-8">
                                <h2 className="text-2xl font-semibold mb-4">{dict.roomDetail.amenities}</h2>
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

                </div>
            </div>
        </div>
    )
}
