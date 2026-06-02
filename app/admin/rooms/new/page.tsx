// app/admin/rooms/new/page.tsx
import RoomForm from '../RoomForm'
import { getTranslations } from '@/lib/i18n-server'

export default async function NewRoomPage() {
    const t = await getTranslations('nl')

    return (
        <div className="min-h-screen bg-gray-100 py-12">
            <div className="max-w-4xl mx-auto px-4">
                <h1 className="text-3xl font-bold mb-8">{t.admin.newRoom.title}</h1>
                <div className="bg-white rounded-lg shadow p-6">
                    <RoomForm />
                </div>
            </div>
        </div>
    )
}
