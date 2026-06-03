// scripts/seed.ts
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()
async function main() {
    // Create sample rooms
    const rooms = [
        {
            name: 'The Rose Room',
            description: 'A beautiful room with a view of our rose garden. Features a king-size bed, antique furnishings, and a luxurious en-suite bathroom with a claw-foot tub. Perfect for romantic getaways.',
            price: 150,
            capacity: 2,
            amenities: 'King Bed, En-suite Bathroom, Garden View, WiFi, TV, Mini Bar',
            images: JSON.stringify([
                'https://images.unsplash.com/photo-1566665797739-1674de7a421a?w=800',
                'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800'
            ])
        },
        {
            name: 'The Garden Suite',
            description: 'Spacious suite with a private entrance and patio overlooking our gardens. Includes a comfortable sitting area, fireplace, and a spa-like bathroom. Ideal for extended stays.',
            price: 200,
            capacity: 3,
            amenities: 'King Bed, Private Patio, Fireplace, Sitting Area, WiFi, TV, Mini Bar, Room Service',
            images: JSON.stringify([
                'https://images.unsplash.com/photo-1590490360182-c33d57733427?w=800',
                'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800'
            ])
        },
        {
            name: 'The Family Room',
            description: 'Perfect for families, this large room features two queen beds and a separate sitting area. Includes all modern amenities and a large bathroom. Children are always welcome!',
            price: 175,
            capacity: 4,
            amenities: 'Two Queen Beds, Sitting Area, Large Bathroom, WiFi, TV, Mini Bar, Crib Available',
            images: JSON.stringify([
                'https://images.unsplash.com/photo-1595576508898-0ad5c879a061?w=800',
                'https://images.unsplash.com/photo-1582719508461-905c673771fd?w=800'
            ])
        }
    ]

    for (const room of rooms) {
        await prisma.room.create({
            data: room
        })
    }

    console.log('Seed data created successfully!')
}

main()
    .catch((e) => {
        console.error(e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })