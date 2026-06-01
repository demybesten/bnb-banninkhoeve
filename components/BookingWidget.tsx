// components/BookingWidget.tsx
'use client'

import { useState } from 'react'
import { HiCalendar, HiPhone, HiMail } from 'react-icons/hi'
import { toast } from 'react-hot-toast'

export default function BookingWidget({ roomName, roomPrice }: { roomName?: string, roomPrice?: number }) {
    const [checkIn, setCheckIn] = useState('')
    const [checkOut, setCheckOut] = useState('')
    const [guests, setGuests] = useState('2')
    const [showForm, setShowForm] = useState(false)
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        message: ''
    })
    const [sending, setSending] = useState(false)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setSending(true)

        try {
            const { sendContactEmail } = await import('@/lib/emailjs')

            await sendContactEmail({
                from_name: formData.name,
                reply_to: formData.email,
                phone: formData.phone,
                message: `Booking Inquiry for ${roomName || 'Room'}\n\n` +
                    `Check-in: ${checkIn}\n` +
                    `Check-out: ${checkOut}\n` +
                    `Guests: ${guests}\n` +
                    `Room Price: $${roomPrice}/night\n\n` +
                    `Message: ${formData.message}`,
                check_in: checkIn,
                check_out: checkOut,
                guests: guests,
            })

            toast.success('Booking inquiry sent! We\'ll confirm availability shortly.')
            setShowForm(false)
            setFormData({ name: '', email: '', phone: '', message: '' })
        } catch (err) {
            toast.error('Failed to send. Please call us directly.')
        } finally {
            setSending(false)
        }
    }

    const calculateNights = () => {
        if (!checkIn || !checkOut) return 0
        const start = new Date(checkIn)
        const end = new Date(checkOut)
        return Math.max(0, Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)))
    }

    const nights = calculateNights()
    const totalPrice = roomPrice ? nights * roomPrice : 0

    return (
        <div className="bg-white rounded-lg shadow-lg p-6">
            <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <HiCalendar className="text-amber-800" />
                Book This Room
            </h3>

            <div className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Check-in
                        </label>
                        <input
                            type="date"
                            value={checkIn}
                            onChange={(e) => setCheckIn(e.target.value)}
                            min={new Date().toISOString().split('T')[0]}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-amber-500 focus:border-amber-500 text-sm"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Check-out
                        </label>
                        <input
                            type="date"
                            value={checkOut}
                            onChange={(e) => setCheckOut(e.target.value)}
                            min={checkIn || new Date().toISOString().split('T')[0]}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-amber-500 focus:border-amber-500 text-sm"
                        />
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Guests
                    </label>
                    <select
                        value={guests}
                        onChange={(e) => setGuests(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-amber-500 focus:border-amber-500 text-sm"
                    >
                        {[1,2,3,4,5,6].map(num => (
                            <option key={num} value={num}>{num} {num === 1 ? 'Guest' : 'Guests'}</option>
                        ))}
                    </select>
                </div>

                {/* Price Summary */}
                {nights > 0 && roomPrice && (
                    <div className="bg-amber-50 rounded-lg p-4">
                        <div className="flex justify-between text-sm mb-2">
                            <span>{roomPrice} × {nights} {nights === 1 ? 'night' : 'nights'}</span>
                            <span className="font-semibold">${totalPrice}</span>
                        </div>
                        <div className="border-t pt-2 flex justify-between">
                            <span className="font-semibold">Total</span>
                            <span className="font-bold text-amber-800">${totalPrice}</span>
                        </div>
                        <p className="text-xs text-gray-500 mt-2">
                            * Final price confirmed upon booking. No hidden fees.
                        </p>
                    </div>
                )}

                {!showForm ? (
                    <button
                        onClick={() => setShowForm(true)}
                        disabled={!checkIn || !checkOut}
                        className="w-full bg-amber-800 text-white py-3 rounded-lg font-semibold hover:bg-amber-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        Request Booking
                    </button>
                ) : (
                    <form onSubmit={handleSubmit} className="space-y-3">
                        <input
                            type="text"
                            placeholder="Your Name *"
                            required
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                        />
                        <input
                            type="email"
                            placeholder="Email Address *"
                            required
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                        />
                        <input
                            type="tel"
                            placeholder="Phone Number"
                            value={formData.phone}
                            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                        />
                        <textarea
                            placeholder="Any special requests or questions?"
                            rows={3}
                            value={formData.message}
                            onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                        />
                        <button
                            type="submit"
                            disabled={sending}
                            className="w-full bg-green-700 text-white py-3 rounded-lg font-semibold hover:bg-green-800 transition disabled:opacity-50"
                        >
                            {sending ? 'Sending...' : 'Send Booking Request'}
                        </button>
                        <button
                            type="button"
                            onClick={() => setShowForm(false)}
                            className="w-full text-sm text-gray-500 hover:text-gray-700"
                        >
                            Cancel
                        </button>
                    </form>
                )}

                {/* Direct Contact */}
                <div className="border-t pt-4 mt-4">
                    <p className="text-sm font-semibold text-green-700 mb-3">
                        💰 Best Rate Guaranteed When You Book Direct!
                    </p>
                    <div className="space-y-2">
                        <a
                            href="tel:+15551234567"
                            className="flex items-center gap-2 text-gray-700 hover:text-amber-800 transition text-sm"
                        >
                            <HiPhone className="text-amber-800" />
                            <span>Call (555) 123-4567</span>
                        </a>
                        <a
                            href="mailto:info@cozybnb.com"
                            className="flex items-center gap-2 text-gray-700 hover:text-amber-800 transition text-sm"
                        >
                            <HiMail className="text-amber-800" />
                            <span>info@cozybnb.com</span>
                        </a>
                    </div>
                </div>
            </div>
        </div>
    )
}