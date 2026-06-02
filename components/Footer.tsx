// components/Footer.tsx
import { getTranslations, detectLocale } from '@/lib/i18n'

export default async function Footer() {
    const locale = await detectLocale()
    const t = await getTranslations(locale)

    return (
        <footer className="bg-amber-900 text-white py-8">
            <div className="max-w-7xl mx-auto px-4">
                <div className="grid md:grid-cols-3 gap-8">
                    <div>
                        <h3 className="text-xl font-bold mb-4">{t.common.siteName}</h3>
                        <p>{t.footer.tagline}</p>
                    </div>
                    <div>
                        <h3 className="text-xl font-bold mb-4">{t.footer.contact}</h3>
                        <p>{t.footer.address}</p>
                        <p>{t.footer.cityState}</p>
                        <p>{t.footer.phone}</p>
                        <p>{t.footer.email}</p>
                    </div>
                    <div>
                        <h3 className="text-xl font-bold mb-4">{t.footer.quickLinks}</h3>
                        <ul className="space-y-2">
                            <li><a href="/rooms" className="hover:text-amber-300">{t.footer.ourRooms}</a></li>
                            <li><a href="/about" className="hover:text-amber-300">{t.footer.aboutUs}</a></li>
                            <li><a href="/contact" className="hover:text-amber-300">{t.footer.contactLink}</a></li>
                        </ul>
                    </div>
                </div>
                <div className="mt-8 pt-8 border-t border-amber-700 text-center">
                    <p>{t.footer.copyright}</p>
                </div>
            </div>
        </footer>
    )
}
