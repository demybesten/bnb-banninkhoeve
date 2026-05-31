// app/about/page.tsx
export default function AboutPage() {
    return (
        <div className="py-12">
            <div className="max-w-7xl mx-auto px-4">
                <h1 className="text-4xl font-bold text-center mb-12">About Cozy B&B</h1>

                <div className="grid md:grid-cols-2 gap-12 mb-16">
                    <div>
                        <h2 className="text-3xl font-semibold mb-6">Our Story</h2>
                        <div className="space-y-4 text-gray-700 leading-relaxed">
                            <p>
                                Welcome to Cozy B&B, where comfort meets elegance. Our charming bed and breakfast
                                has been welcoming guests since 2010, offering a warm and inviting atmosphere
                                that makes you feel right at home.
                            </p>
                            <p>
                                Located in the heart of the city, we provide the perfect base for exploring
                                local attractions while enjoying peaceful and comfortable accommodations.
                            </p>
                            <p>
                                Each morning, we serve a delicious homemade breakfast made with fresh,
                                locally-sourced ingredients. Our rooms are individually decorated to provide
                                a unique and memorable stay for every guest.
                            </p>
                        </div>
                    </div>
                    <div className="bg-gray-200 rounded-lg h-96 flex items-center justify-center">
                        <p className="text-gray-500 text-xl">Photo of our B&B</p>
                    </div>
                </div>

                <div className="mb-16">
                    <h2 className="text-3xl font-semibold text-center mb-12">What Our Guests Say</h2>
                    <div className="grid md:grid-cols-3 gap-8">
                        <div className="bg-white p-6 rounded-lg shadow-lg">
                            <div className="text-amber-800 text-4xl mb-4">"</div>
                            <p className="text-gray-700 mb-4">
                                Amazing experience! The room was beautiful and the breakfast was delicious.
                                Will definitely come back.
                            </p>
                            <div className="font-semibold">- Sarah M.</div>
                        </div>
                        <div className="bg-white p-6 rounded-lg shadow-lg">
                            <div className="text-amber-800 text-4xl mb-4">"</div>
                            <p className="text-gray-700 mb-4">
                                The perfect place for a weekend getaway. The hosts were incredibly welcoming
                                and helpful with local recommendations.
                            </p>
                            <div className="font-semibold">- James & Emily T.</div>
                        </div>
                        <div className="bg-white p-6 rounded-lg shadow-lg">
                            <div className="text-amber-800 text-4xl mb-4">"</div>
                            <p className="text-gray-700 mb-4">
                                Beautiful property with attention to every detail. The garden is stunning
                                and the location couldn't be better.
                            </p>
                            <div className="font-semibold">- Michael R.</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}