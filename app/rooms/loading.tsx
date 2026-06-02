import { getTranslations, detectLocale } from '@/lib/i18n-server'

export default async function RoomsLoading() {
    const locale = await detectLocale()
    const t = await getTranslations(locale)
    return (
        <div className="py-12">
            <div className="max-w-7xl mx-auto px-4">
                <h1 className="text-4xl font-bold text-center mb-12">{t.rooms.title}</h1>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {[1, 2, 3].map((i) => (
                        <div key={i} className="bg-white rounded-lg shadow-lg overflow-hidden animate-pulse">
                            <div className="h-64 bg-gray-200" />
                            <div className="p-6">
                                <div className="h-7 bg-gray-200 rounded w-3/4 mb-2" />
                                <div className="h-4 bg-gray-200 rounded w-full mb-1" />
                                <div className="h-4 bg-gray-200 rounded w-2/3 mb-4" />
                                <div className="flex justify-between">
                                    <div className="h-7 bg-gray-200 rounded w-20" />
                                    <div className="h-4 bg-gray-200 rounded w-16" />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}
