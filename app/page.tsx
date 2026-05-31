// app/page.tsx (Home Screen)
import Image from 'next/image'
import Link from 'next/link'
import { prisma } from '@/lib/prisma'

export default async function Home() {
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
                Welcome to Cozy B&B
              </h1>
              <p className="text-xl md:text-2xl mb-8">
                Experience comfort, luxury, and warm hospitality
              </p>
              <div className="flex gap-4">
                <Link
                    href="/rooms"
                    className="bg-white text-amber-900 px-8 py-3 rounded-lg font-semibold hover:bg-amber-100 transition"
                >
                  View Rooms
                </Link>
                <Link
                    href="/contact"
                    className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-amber-900 transition"
                >
                  Contact Us
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-20 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4">
            <h2 className="text-4xl font-bold text-center mb-12">Why Choose Us</h2>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center p-8 bg-white rounded-lg shadow-lg">
                <div className="text-5xl mb-4">🏠</div>
                <h3 className="text-2xl font-semibold mb-4">Comfortable Rooms</h3>
                <p className="text-gray-600">
                  Each room is carefully designed for your ultimate comfort and relaxation.
                </p>
              </div>
              <div className="text-center p-8 bg-white rounded-lg shadow-lg">
                <div className="text-5xl mb-4">🍳</div>
                <h3 className="text-2xl font-semibold mb-4">Homemade Breakfast</h3>
                <p className="text-gray-600">
                  Start your day with a delicious, freshly prepared breakfast.
                </p>
              </div>
              <div className="text-center p-8 bg-white rounded-lg shadow-lg">
                <div className="text-5xl mb-4">📍</div>
                <h3 className="text-2xl font-semibold mb-4">Perfect Location</h3>
                <p className="text-gray-600">
                  Centrally located with easy access to all major attractions.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Featured Rooms Section */}
        {rooms.length > 0 && (
            <section className="py-20">
              <div className="max-w-7xl mx-auto px-4">
                <h2 className="text-4xl font-bold text-center mb-12">Our Rooms</h2>
                <div className="grid md:grid-cols-3 gap-8">
                  {rooms.map((room) => (
                      <div key={room.id} className="bg-white rounded-lg shadow-lg overflow-hidden">
                        <div className="h-48 bg-gray-200 relative">
                          {room.images && JSON.parse(room.images)[0] && (
                              <img
                                  src={JSON.parse(room.images)[0]}
                                  alt={room.name}
                                  className="w-full h-full object-cover"
                              />
                          )}
                        </div>
                        <div className="p-6">
                          <h3 className="text-2xl font-semibold mb-2">{room.name}</h3>
                          <p className="text-gray-600 mb-4 line-clamp-3">{room.description}</p>
                          <div className="flex justify-between items-center">
                      <span className="text-2xl font-bold text-amber-800">
                        ${room.price}/night
                      </span>
                            <Link
                                href={`/rooms/${room.id}`}
                                className="bg-amber-800 text-white px-4 py-2 rounded hover:bg-amber-700 transition"
                            >
                              View Details
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
                    View All Rooms
                  </Link>
                </div>
              </div>
            </section>
        )}
      </>
  )
}