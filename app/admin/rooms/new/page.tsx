// app/admin/rooms/new/page.tsx
import RoomForm from '../RoomForm'

export default function NewRoomPage() {
    return (
        <div className="max-w-4xl mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-8">Create New Room</h1>
            <div className="bg-white rounded-lg shadow p-6">
                <RoomForm />
            </div>
        </div>
    )
}