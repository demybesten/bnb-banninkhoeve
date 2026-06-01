// app/contact/page.tsx
'use client'

import { useState } from 'react'
import { toast, Toaster } from 'react-hot-toast'
import MapComponent from '@/components/GoogleMap'
import { sendContactEmail } from '@/lib/emailjs'

export default function ContactPage() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        message: '',
    })
    const [sending, setSending] = useState(false)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setSending(true)

        try {
            await sendContactEmail({
                from_name: formData.name,
                reply_to: formData.email,
                phone: formData.phone,
                message: formData.message,
            })

            toast.success('Message sent successfully! We\'ll get back to you soon.')
            setFormData({
                name: '',
                email: '',
                phone: '',
                message: '',
            })
        } catch (err) {
            toast.error('Failed to send message. Please try again.')
        } finally {
            setSending(false)
        }
    }

    // Replace with your B&B's coordinates
    const bnbLocation = {
        lat: 52.441979646798835,  // Your latitude
        lng: 6.27221565391332  // Your longitude
    }

    return (
        <div className="py-12">
            <Toaster position="top-center" />
            <div className="max-w-7xl mx-auto px-4">
                <h1 className="text-4xl font-bold text-center mb-12">Contact Us</h1>

                <div className="grid md:grid-cols-2 gap-12 mb-16">
                    <div>
                        <h2 className="text-3xl font-semibold mb-6">Get in Touch</h2>
                        <div className="space-y-6">
                            <div>
                                <h3 className="text-xl font-semibold mb-2">📍 Address</h3>
                                <p className="text-gray-700">123 Main Street</p>
                                <p className="text-gray-700">City, State 12345</p>
                            </div>
                            <div>
                                <h3 className="text-xl font-semibold mb-2">📞 Phone</h3>
                                <p className="text-gray-700">(555) 123-4567</p>
                            </div>
                            <div>
                                <h3 className="text-xl font-semibold mb-2">✉️ Email</h3>
                                <p className="text-gray-700">info@cozybnb.com</p>
                            </div>
                        </div>
                    </div>

                    <div>
                        <h2 className="text-3xl font-semibold mb-6">Send us a Message</h2>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Name *
                                    </label>
                                    <input
                                        type="text"
                                        required
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-amber-500 focus:border-amber-500"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Email *
                                    </label>
                                    <input
                                        type="email"
                                        required
                                        value={formData.email}
                                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-amber-500 focus:border-amber-500"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Phone
                                </label>
                                <input
                                    type="tel"
                                    value={formData.phone}
                                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-amber-500 focus:border-amber-500"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Message *
                                </label>
                                <textarea
                                    rows={5}
                                    required
                                    value={formData.message}
                                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-amber-500 focus:border-amber-500"
                                    placeholder="Tell us about your stay or any questions..."
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={sending}
                                className="w-full bg-amber-800 text-white py-3 rounded-lg font-semibold hover:bg-amber-700 transition disabled:opacity-50"
                            >
                                {sending ? 'Sending...' : 'Send Message'}
                            </button>
                        </form>
                    </div>
                </div>

                {/* Google Map */}
                <div className="mb-16">
                    <h2 className="text-3xl font-semibold text-center mb-8">Find Us</h2>
                    <div className="rounded-lg overflow-hidden shadow-lg">
                        <MapComponent center={bnbLocation} />
                    </div>
                </div>
            </div>
        </div>
    )
}