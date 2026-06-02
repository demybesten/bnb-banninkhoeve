export default function RoomDetailLoading() {
    return (
        <div className="py-12 animate-pulse">
            <div className="max-w-7xl mx-auto px-4">
                <div className="h-96 bg-gray-200 rounded-lg mb-8" />
                <div className="grid lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2">
                        <div className="h-10 bg-gray-200 rounded w-1/2 mb-4" />
                        <div className="h-5 bg-gray-200 rounded w-full mb-2" />
                        <div className="h-5 bg-gray-200 rounded w-full mb-2" />
                        <div className="h-5 bg-gray-200 rounded w-3/4 mb-8" />
                        <div className="h-64 bg-gray-200 rounded mb-8" />
                    </div>
                    <div className="h-96 bg-gray-200 rounded" />
                </div>
            </div>
        </div>
    )
}
