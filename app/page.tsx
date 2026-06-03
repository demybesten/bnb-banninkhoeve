// app/page.tsx (Home Screen)
import Image from 'next/image'
import Link from 'next/link'
import { prisma } from '@/lib/prisma'
import GoogleReviews from '@/components/GoogleReviews'
import { getTranslations, detectLocale } from '@/lib/i18n-server'
import { t, getLocalizedField } from '@/lib/i18n'

export default async function Home() {
  const locale = await detectLocale()
  const dict = await getTranslations(locale)
  const rooms = await prisma.room.findMany({
    take: 3,
    orderBy: { createdAt: 'desc' }
  })

  return (
      <>
        {/* Hero Section */}
        <section className="relative h-[70vh] bg-gradient-to-r from-amber-800 to-amber-600">
          <div className="absolute inset-0 bg-black opacity-40"></div>
          <div className="relative max-w-7xl mx-auto px-4 h-full flex items-center">
            <div className="text-white">
              <h1 className="text-5xl md:text-6xl font-bold mb-4">
                {dict.home.hero.title}
              </h1>
              <p className="text-xl md:text-2xl mb-8">
                {dict.home.hero.subtitle}
              </p>
              <div className="flex gap-4">
                <Link
                    href="/rooms"
                    className="bg-white text-amber-900 px-8 py-3 rounded-lg font-semibold hover:bg-amber-100 transition"
                >
                  {dict.home.hero.viewRooms}
                </Link>
                <Link
                    href="/contact"
                    className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-amber-900 transition"
                >
                  {dict.home.hero.contactUs}
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-20 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4">
            <h2 className="text-4xl font-bold text-center mb-12">{dict.home.features.title}</h2>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center p-8 bg-white rounded-lg shadow-lg">
                <div className="text-5xl mb-4">🏠</div>
                <h3 className="text-2xl font-semibold mb-4">{dict.home.features.comfortable.title}</h3>
                <p className="text-gray-600">
                  {dict.home.features.comfortable.description}
                </p>
              </div>
              <div className="text-center p-8 bg-white rounded-lg shadow-lg">
                <div className="text-5xl mb-4">🍳</div>
                <h3 className="text-2xl font-semibold mb-4">{dict.home.features.breakfast.title}</h3>
                <p className="text-gray-600">
                  {dict.home.features.breakfast.description}
                </p>
              </div>
              <div className="text-center p-8 bg-white rounded-lg shadow-lg">
                <div className="text-5xl mb-4">📍</div>
                <h3 className="text-2xl font-semibold mb-4">{dict.home.features.location.title}</h3>
                <p className="text-gray-600">
                  {dict.home.features.location.description}
                </p>
              </div>
            </div>
          </div>
        </section>
        <GoogleReviews />

        {/* Featured Rooms Section */}
        {rooms.length > 0 && (
            <section className="py-20">
              <div className="max-w-7xl mx-auto px-4">
                <h2 className="text-4xl font-bold text-center mb-12">{dict.home.featuredRooms.title}</h2>
                <div className="grid md:grid-cols-3 gap-8">
                  {rooms.map((room) => (
                      <div key={room.id} className="bg-white rounded-lg shadow-lg overflow-hidden">
                        <div className="h-48 bg-gray-200 relative">
                          {room.images && JSON.parse(room.images)[0] && (
                              <img
                                  src={JSON.parse(room.images)[0]}
                                  alt={getLocalizedField(room, 'name', locale)}
                                  className="w-full h-full object-cover"
                              />
                          )}
                        </div>
                        <div className="p-6">
                          <h3 className="text-2xl font-semibold mb-2">{getLocalizedField(room, 'name', locale)}</h3>
                          <p className="text-gray-600 mb-4 line-clamp-3">{getLocalizedField(room, 'description', locale)}</p>
                          <div className="flex justify-between items-center gap-4">
                      <span className="text-2xl font-bold text-amber-800">
                        {t(dict.home.featuredRooms.pricePerNight, { price: room.price })}
                      </span>
                            <Link
                                href={`/rooms/${room.id}`}
                                className="bg-amber-800 text-white px-3 py-1.5 rounded text-sm hover:bg-amber-700 transition shrink-0"
                            >
                              {dict.home.featuredRooms.viewDetails}
                            </Link>
                          </div>
                        </div>
                      </div>
                  ))}
                </div>
                <div className="text-center mt-12">
                  <Link
                      href="/rooms"
                      className="bg-amber-800 text-white px-8 py-3 rounded-lg font-semibold hover:bg-amber-700 transition inline-block"
                  >
                    {dict.home.featuredRooms.viewAll}
                  </Link>
                </div>
              </div>
            </section>
        )}
        {/* Why Book Direct Section */}
        <section className="py-16 bg-green-50">
          <div className="max-w-7xl mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold mb-4">{dict.home.bookDirect.title}</h2>
            <div className="grid md:grid-cols-3 gap-8 mt-12">
              <div className="bg-white p-6 rounded-lg shadow">
                <div className="text-4xl mb-4">💰</div>
                <h3 className="text-xl font-semibold mb-2">{dict.home.bookDirect.bestPrice.title}</h3>
                <p className="text-gray-600">
                  {dict.home.bookDirect.bestPrice.description}
                </p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow">
                <div className="text-4xl mb-4">🎁</div>
                <h3 className="text-xl font-semibold mb-2">{dict.home.bookDirect.perks.title}</h3>
                <p className="text-gray-600">
                  {dict.home.bookDirect.perks.description}
                </p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow">
                <div className="text-4xl mb-4">📞</div>
                <h3 className="text-xl font-semibold mb-2">{dict.home.bookDirect.service.title}</h3>
                <p className="text-gray-600">
                  {dict.home.bookDirect.service.description}
                </p>
              </div>
            </div>
          </div>
        </section>
      </>
  )
}
