// app/about/page.tsx
import Image from 'next/image'
import { getTranslations, detectLocale } from '@/lib/i18n-server'

export default async function AboutPage() {
    const locale = await detectLocale()
    const dict = await getTranslations(locale)

    return (
        <div className="py-12">
            <div className="max-w-7xl mx-auto px-4">
                <h1 className="text-4xl font-bold text-center mb-12">{dict.about.title}</h1>

                <div className="grid md:grid-cols-2 gap-12 mb-16">
                    <div>
                        <h2 className="text-3xl font-semibold mb-6">{dict.about.ourStory}</h2>
                        <div className="space-y-4 text-gray-700 leading-relaxed">
                            <p>{dict.about.storyP1}</p>
                            <p>{dict.about.storyP2}</p>
                            <p>{dict.about.storyP3}</p>
                        </div>
                    </div>
                    <div className="relative rounded-lg overflow-hidden h-96">
                        <Image
                            src="/about-bb.jpg"
                            alt={dict.about.photoPlaceholder}
                            fill
                            className="object-cover"
                        />
                    </div>
                </div>

                <div className="mb-16">
                    <h2 className="text-3xl font-semibold text-center mb-12">{dict.about.testimonials.title}</h2>
                    <div className="grid md:grid-cols-3 gap-8">
                        <div className="bg-white p-6 rounded-lg shadow-lg">
                            <div className="text-amber-800 text-4xl mb-4">{'"'}</div>
                            <p className="text-gray-700 mb-4">
                                {dict.about.testimonials.testimonial1}
                            </p>
                            <div className="font-semibold">- {dict.about.testimonials.author1}</div>
                        </div>
                        <div className="bg-white p-6 rounded-lg shadow-lg">
                            <div className="text-amber-800 text-4xl mb-4">{'"'}</div>
                            <p className="text-gray-700 mb-4">
                                {dict.about.testimonials.testimonial2}
                            </p>
                            <div className="font-semibold">- {dict.about.testimonials.author2}</div>
                        </div>
                        <div className="bg-white p-6 rounded-lg shadow-lg">
                            <div className="text-amber-800 text-4xl mb-4">{'"'}</div>
                            <p className="text-gray-700 mb-4">
                                {dict.about.testimonials.testimonial3}
                            </p>
                            <div className="font-semibold">- {dict.about.testimonials.author3}</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
