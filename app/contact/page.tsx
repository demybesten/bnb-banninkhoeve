// app/contact/page.tsx
export default function ContactPage() {
    return (
        <div className="py-12">
            <div className="max-w-7xl mx-auto px-4">
                <h1 className="text-4xl font-bold text-center mb-12">Contact Us</h1>

                <div className="grid md:grid-cols-2 gap-12">
                    <div>
                        <h2 className="text-3xl font-semibold mb-6">Get in Touch</h2>
                        <div className="space-y-6">
                            <div>
                                <h3 className="text-xl font-semibold mb-2">Address</h3>
                                <p className="text-gray-700">123 Main Street</p>
                                <p className="text-gray-700">City, State 12345</p>
                            </div>
                            <div>
                                <h3 className="text-xl font-semibold mb-2">Phone</h3>
                                <p className="text-gray-700">(555) 123-4567</p>
                            </div>
                            <div>
                                <h3 className="text-xl font-semibold mb-2">Email</h3>
                                <p className="text-gray-700">info@cozybnb.com</p>
                            </div>
                            <div>
                                <h3 className="text-xl font-semibold mb-2">Check-in / Check-out</h3>
                                <p className="text-gray-700">Check-in: 3:00 PM - 9:00 PM</p>
                                <p className="text-gray-700">Check-out: 11:00 AM</p>
                            </div>
                        </div>
                    </div>

                    <div>
                        <h2 className="text-3xl font-semibold mb-6">Send us a Message</h2>
                        <form className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Name
                                </label>
                                <input
                                    type="text"
                                    required
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-amber-500 focus:border-amber-500"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Email
                                </label>
                                <input
                                    type="email"
                                    required
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-amber-500 focus:border-amber-500"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Message
                                </label>
                                <textarea
                                    rows={5}
                                    required
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-amber-500 focus:border-amber-500"
                                />
                            </div>
                            <button
                                type="submit"
                                className="w-full bg-amber-800 text-white py-3 rounded-lg font-semibold hover:bg-amber-700 transition"
                            >
                                Send Message
                            </button>
                        </form>
                    </div>
                </div>

                <div className="mt-16">
                    <h2 className="text-3xl font-semibold text-center mb-8">Location</h2>
                    <div className="bg-gray-200 rounded-lg h-96 flex items-center justify-center">
                        <p className="text-gray-500 text-xl">Map will be displayed here</p>
                    </div>
                </div>
            </div>
        </div>
    )
}