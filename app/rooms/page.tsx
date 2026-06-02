// app/rooms/page.tsx
import Link from 'next/link'
import { prisma } from '@/lib/prisma'
import { getTranslations, detectLocale, t } from '@/lib/i18n'

export default async function RoomsPage() {
    const locale = await detectLocale()
    const dict = await getTranslations(locale)
    const rooms = await prisma.room.findMany()

    return (
        <div className="py-12">
            <div className="max-w-7xl mx-auto px-4">
                <h1 className="text-4xl font-bold text-center mb-12">{dict.rooms.title}</h1>

                {rooms.length === 0 ? (
                    <div className="text-center py-20">
                        <p className="text-gray-600 text-xl">{dict.rooms.noRooms}</p>
                    </div>
                ) : (
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {rooms.map((room) => (
                            <Link
                                href={`/rooms/${room.id}`}
                                key={room.id}
                                className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition"
                            >
                                <div className="h-64 bg-gray-200 relative">
                                    {room.images && JSON.parse(room.images)[0] && (
                                        <img
                                            src={JSON.parse(room.images)[0]}
                                            alt={room.name}
                                            className="w-full h-full object-cover"
                                        />
                                    )}
                                </div>
                                <div className="p-6">
                                    <h2 className="text-2xl font-semibold mb-2">{room.name}</h2>
                                    <p className="text-gray-600 mb-4 line-clamp-2">{room.description}</p>
                                    <div className="flex justify-between items-center">
                    <span className="text-2xl font-bold text-amber-800">
                      {t(dict.rooms.pricePerNight, { price: room.price })}<span className="text-base font-normal">/night</span>
                    </span>
                                        <span className="text-gray-500">{t(dict.rooms.upToGuests, { capacity: room.capacity })}</span>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}
