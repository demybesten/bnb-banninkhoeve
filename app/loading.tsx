export default function Loading() {
    return (
        <div className="flex justify-center items-center min-h-screen">
            <div className="flex flex-col items-center gap-4">
                <div className="w-10 h-10 border-4 border-amber-200 border-t-amber-800 rounded-full animate-spin" />
                <p className="text-gray-500">Loading...</p>
            </div>
        </div>
    )
}
