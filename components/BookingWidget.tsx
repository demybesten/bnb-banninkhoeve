// components/BookingWidget.tsx
'use client'

import { useState } from 'react'
import { HiCalendar, HiPhone } from 'react-icons/hi'
import { toast } from 'react-hot-toast'
import { useT } from '@/lib/i18n-client'
import { getPriceBreakdown } from '@/lib/pricing'

export default function BookingWidget({ roomName, roomPrice }: { roomName?: string, roomPrice?: number }) {
    const t = useT()
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
            const { sendBookingEmail } = await import('@/lib/emailjs')

            const nights = calculateNights()
            const pricing = getPriceBreakdown(nights, roomPrice || 0)

            await sendBookingEmail({
                from_name: formData.name,
                reply_to: formData.email,
                phone: formData.phone,
                message: formData.message || t.booking.noSpecialRequests,
                check_in: checkIn,
                check_out: checkOut,
                guests: guests,
                room_name: roomName || 'Room',
                nights: nights,
                total_price: pricing.total > 0 ? `€${pricing.total}` : t.booking.toBeConfirmed,
            })

            toast.success(t.booking.successToast)
            setShowForm(false)
            setFormData({ name: '', email: '', phone: '', message: '' })
        } catch (err) {
            toast.error(t.booking.errorToast)
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
    const pricing = getPriceBreakdown(nights, roomPrice || 0)
    const nightsLabel = nights === 1 ? t.booking.night : t.booking.nights

    return (
        <div className="bg-white rounded-lg shadow-lg p-6">
            <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <HiCalendar className="text-amber-800" />
                {t.booking.title}
            </h3>

            <div className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            {t.booking.checkIn}
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
                            {t.booking.checkOut}
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
                        {t.booking.guests}
                    </label>
                    <select
                        value={guests}
                        onChange={(e) => setGuests(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-amber-500 focus:border-amber-500 text-sm"
                    >
                        {[1,2,3,4,5,6].map(num => (
                            <option key={num} value={num}>{num} {num === 1 ? t.booking.guest : t.booking.guestsPlural}</option>
                        ))}
                    </select>
                </div>

                {/* Price Summary */}
                {nights > 0 && roomPrice && (
                    <div className="bg-amber-50 rounded-lg p-4">
                        <div className="flex justify-between text-sm mb-2">
                            <span>€{roomPrice} × {nights} {nightsLabel}</span>
                            <span className={pricing.hasDiscount ? 'line-through text-gray-400' : 'font-semibold'}>
                                €{pricing.subtotal}
                            </span>
                        </div>
                        {pricing.hasDiscount && (
                            <div className="flex justify-between text-sm mb-2 text-green-700">
                                <span>{t.booking.discount}</span>
                                <span>−€{pricing.discount}</span>
                            </div>
                        )}
                        <div className="border-t pt-2 flex justify-between">
                            <span className="font-semibold">{t.booking.total}</span>
                            <span className="font-bold text-amber-800">€{pricing.total}</span>
                        </div>
                        <p className="text-xs text-gray-500 mt-2">
                            {t.booking.priceNote}
                        </p>
                    </div>
                )}

                {!showForm ? (
                    <button
                        onClick={() => setShowForm(true)}
                        disabled={!checkIn || !checkOut}
                        className="w-full bg-amber-800 text-white py-3 rounded-lg font-semibold hover:bg-amber-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {t.booking.requestBooking}
                    </button>
                ) : (
                    <form onSubmit={handleSubmit} className="space-y-3">
                        <input
                            type="text"
                            placeholder={t.booking.form.namePlaceholder}
                            required
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                        />
                        <input
                            type="email"
                            placeholder={t.booking.form.emailPlaceholder}
                            required
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                        />
                        <input
                            type="tel"
                            placeholder={t.booking.form.phonePlaceholder}
                            value={formData.phone}
                            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                        />
                        <textarea
                            placeholder={t.booking.form.messagePlaceholder}
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
                            {sending ? t.booking.form.sending : t.booking.form.submit}
                        </button>
                        <button
                            type="button"
                            onClick={() => setShowForm(false)}
                            className="w-full text-sm text-gray-500 hover:text-gray-700"
                        >
                            {t.booking.form.cancel}
                        </button>
                    </form>
                )}

                {/* Direct Contact */}
                <div className="border-t pt-4 mt-4">
                    <p className="text-sm font-semibold text-green-700 mb-3">
                        {t.booking.bestRate}
                    </p>
                    <div className="space-y-2">
                        <a
                            href="tel:+31628472405"
                            className="flex items-center gap-2 text-gray-700 hover:text-amber-800 transition text-sm"
                        >
                            <HiPhone className="text-amber-800" />
                            <span>{t.booking.callUs}</span>
                        </a>
                    </div>
                </div>
            </div>
        </div>
    )
}
