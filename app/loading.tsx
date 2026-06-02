import { getTranslations, detectLocale } from '@/lib/i18n'

export default async function Loading() {
    const locale = await detectLocale()
    const t = await getTranslations(locale)
    return (
        <div className="flex justify-center items-center min-h-screen">
            <div className="flex flex-col items-center gap-4">
                <div className="w-10 h-10 border-4 border-amber-200 border-t-amber-800 rounded-full animate-spin" />
                <p className="text-gray-500">{t.common.loading}</p>
            </div>
        </div>
    )
}
