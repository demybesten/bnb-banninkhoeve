// components/AvailabilityCalendar.tsx
'use client'

import { useState, useEffect } from 'react'
import { toast } from 'react-hot-toast'
import { HiTrash, HiPlus, HiChevronLeft, HiChevronRight, HiRefresh } from 'react-icons/hi'
import { useT } from '@/lib/i18n-client'

interface Booking {
    id: number
    checkIn: string
    checkOut: string
    guestName: string | null
    status: string
    source: string | null
}

interface AvailabilityCalendarProps {
    roomId: number
    roomName?: string
    roomPrice?: number
    roomCapacity?: number
    isAdmin?: boolean
}

export default function AvailabilityCalendar({ roomId, roomName, roomPrice, roomCapacity, isAdmin = false }: AvailabilityCalendarProps) {
    const t = useT()
    const [bookings, setBookings] = useState<Booking[]>([])
    const [loading, setLoading] = useState(true)
    const [showAddForm, setShowAddForm] = useState(false)
    const [showBookingForm, setShowBookingForm] = useState(false)
    const [selectedStart, setSelectedStart] = useState<Date | null>(null)
    const [selectedEnd, setSelectedEnd] = useState<Date | null>(null)
    const [currentMonth, setCurrentMonth] = useState(new Date())
    const [bookingForm, setBookingForm] = useState({
        name: '',
        email: '',
        phone: '',
        guests: '2',
        message: ''
    })
    const [sending, setSending] = useState(false)
    const [refreshing, setRefreshing] = useState(false)
    const [cooldown, setCooldown] = useState(0)

    // Admin block form
    const [newBooking, setNewBooking] = useState({
        checkIn: '',
        checkOut: '',
        guestName: ''
    })

    useEffect(() => {
        fetchBookings()
    }, [roomId])

    // Cooldown countdown timer
    useEffect(() => {
        if (cooldown <= 0) return
        const timer = setInterval(() => {
            setCooldown(prev => {
                if (prev <= 1) {
                    clearInterval(timer)
                    return 0
                }
                return prev - 1
            })
        }, 1000)
        return () => clearInterval(timer)
    }, [cooldown])

    const fetchBookings = async () => {
        try {
            const res = await fetch(`/api/rooms/${roomId}/availability`)
            if (res.ok) {
                const data = await res.json()
                setBookings(data)
            }
        } catch (err) {
            console.error('Failed to fetch bookings:', err)
        } finally {
            setLoading(false)
        }
    }

    // Trigger iCal sync to refresh availability from external platforms
    const handleRefresh = async () => {
        setRefreshing(true)
        try {
            const res = await fetch('/api/calendar/sync', { method: 'POST' })
            const data = await res.json()

            if (res.status === 429) {
                setCooldown(data.retryAfterSeconds || 300)
                toast.error(t.calendar.refreshWait)
            } else if (res.ok) {
                toast.success(t.calendar.refreshSuccess)
                fetchBookings()
                setCooldown(300) // 5-min cooldown
            } else {
                toast.error(data.error || 'Sync failed')
            }
        } catch (err) {
            toast.error('Failed to refresh')
        } finally {
            setRefreshing(false)
        }
    }

    // Format a Date as YYYY-MM-DD using local time so it matches calendar date construction
    const toDateKey = (d: Date): string => {
        const y = d.getFullYear()
        const m = String(d.getMonth() + 1).padStart(2, '0')
        const day = String(d.getDate()).padStart(2, '0')
        return `${y}-${m}-${day}`
    }

    // Get all booked dates as a Set for quick lookup
    const getBookedDates = (): Set<string> => {
        const dates = new Set<string>()
        bookings.forEach(booking => {
            if (booking.status === 'confirmed') {
                const start = new Date(booking.checkIn)
                const end = new Date(booking.checkOut)
                const startKey = toDateKey(start)
                const endKey = toDateKey(end)
                for (let d = new Date(start); toDateKey(d) < endKey; d.setDate(d.getDate() + 1)) {
                    dates.add(toDateKey(d))
                }
            }
        })
        return dates
    }

    // Check if a date is booked
    const isDateBooked = (date: Date): boolean => {
        return getBookedDates().has(toDateKey(date))
    }

    // Check if a date range is valid (no overlap with booked dates)
    const isRangeValid = (start: Date, end: Date): boolean => {
        const bookedDates = getBookedDates()
        for (let d = new Date(start); toDateKey(d) < toDateKey(end); d.setDate(d.getDate() + 1)) {
            if (bookedDates.has(toDateKey(d))) {
                return false
            }
        }
        return true
    }

    // Check if a date range overlaps with any bookings.
    // Both the user's selection and existing bookings treat the end date as
    // the checkout day (exclusive), so a new check-in on an existing checkout
    // day is allowed.
    const hasOverlap = (start: Date, end: Date): boolean => {
        const rangeStart = new Date(start)
        rangeStart.setHours(0, 0, 0, 0)
        const rangeEnd = new Date(end)
        rangeEnd.setHours(0, 0, 0, 0)

        return bookings.some(booking => {
            if (booking.status !== 'confirmed') return false
            const bStart = new Date(booking.checkIn)
            bStart.setHours(0, 0, 0, 0)
            const bEnd = new Date(booking.checkOut)
            bEnd.setHours(0, 0, 0, 0)

            return rangeStart < bEnd && rangeEnd > bStart
        })
    }

    // Handle date click for booking
    const handleDateClick = (date: Date) => {
        if (isAdmin || isDateBooked(date) || date < new Date(new Date().setHours(0,0,0,0))) return

        if (selectedStart && !selectedEnd && date.getTime() === selectedStart.getTime()) {
            setSelectedStart(null)
            return
        }

        if (selectedEnd && date.getTime() === selectedEnd.getTime()) {
            setSelectedEnd(null)
            return
        }

        if (selectedStart && date.getTime() === selectedStart.getTime()) {
            setSelectedStart(null)
            setSelectedEnd(null)
            return
        }

        if (!selectedStart || (selectedStart && selectedEnd)) {
            setSelectedStart(date)
            setSelectedEnd(null)
        } else {
            if (date < selectedStart) {
                const tempStart = date
                const tempEnd = selectedStart

                if (hasOverlap(tempStart, tempEnd)) {
                    toast.error(t.booking.overlapError)
                    return
                }

                setSelectedStart(tempStart)
                setSelectedEnd(tempEnd)
            } else {
                if (hasOverlap(selectedStart, date)) {
                    toast.error(t.booking.overlapError)
                    return
                }

                setSelectedEnd(date)
            }
        }
    }

    // Check if a date is in the selected range
    const isInRange = (date: Date): boolean => {
        if (!selectedStart) return false
        if (!selectedEnd) return date.getTime() === selectedStart.getTime()
        return date >= selectedStart && date <= selectedEnd
    }

    // Check if date is the start or end of selection
    const isRangeStart = (date: Date): boolean => {
        return selectedStart?.getTime() === date.getTime()
    }

    const isRangeEnd = (date: Date): boolean => {
        return selectedEnd?.getTime() === date.getTime()
    }

    // Format date for display
    const formatDate = (date: Date): string => {
        return date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })
    }

    // Calculate nights
    const calculateNights = (): number => {
        if (!selectedStart || !selectedEnd) return 0
        return Math.ceil((selectedEnd.getTime() - selectedStart.getTime()) / (1000 * 60 * 60 * 24))
    }

    // Send booking email
    const handleBookingSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!selectedStart || !selectedEnd) return

        setSending(true)
        try {
            const { sendBookingEmail } = await import('@/lib/emailjs')

            const nights = calculateNights()
            const totalPrice = roomPrice ? nights * roomPrice : 0

            await sendBookingEmail({
                from_name: bookingForm.name,
                reply_to: bookingForm.email,
                phone: bookingForm.phone,
                message: bookingForm.message || t.booking.noSpecialRequests,
                check_in: selectedStart.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' }),
                check_out: selectedEnd.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' }),
                guests: bookingForm.guests,
                room_name: roomName || `Room #${roomId}`,
                nights: nights,
                total_price: totalPrice > 0 ? `$${totalPrice}` : t.booking.toBeConfirmed,
            })

            toast.success(t.booking.successToastAlt)
            setSelectedStart(null)
            setSelectedEnd(null)
            setShowBookingForm(false)
            setBookingForm({ name: '', email: '', phone: '', guests: '2', message: '' })
        } catch (err) {
            toast.error(t.booking.errorToastAlt)
        } finally {
            setSending(false)
        }
    }

    // Admin: Add blocked dates
    const addBlockedDates = async (e: React.FormEvent) => {
        e.preventDefault()
        try {
            const res = await fetch(`/api/rooms/${roomId}/availability`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    checkIn: newBooking.checkIn,
                    checkOut: newBooking.checkOut,
                    guestName: newBooking.guestName || 'Blocked',
                    status: 'confirmed'
                })
            })

            if (res.ok) {
                toast.success('Dates blocked successfully')
                setShowAddForm(false)
                setNewBooking({ checkIn: '', checkOut: '', guestName: '' })
                fetchBookings()
            }
        } catch (err) {
            toast.error('Failed to block dates')
        }
    }

    // Admin: Remove booking
    const removeBooking = async (bookingId: number) => {
        if (!confirm('Remove this booking/block?')) return
        try {
            const res = await fetch(`/api/bookings/${bookingId}`, { method: 'DELETE' })
            if (res.ok) {
                toast.success('Removed successfully')
                fetchBookings()
            }
        } catch (err) {
            toast.error('Failed to remove')
        }
    }

    // Navigate months
    const prevMonth = () => {
        setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1))
    }

    const nextMonth = () => {
        setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1))
    }

    const monthName = `${t.calendar.months[currentMonth.getMonth()]} ${currentMonth.getFullYear()}`

    const year = currentMonth.getFullYear()
    const month = currentMonth.getMonth()
    const daysInMonth = new Date(year, month + 1, 0).getDate()
    const firstDayOfMonth = new Date(year, month, 1).getDay()
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    const nights = calculateNights()

    return (
        <div className="bg-white rounded-lg shadow p-6">
            {/* Header */}
            <div className="flex justify-between items-center mb-6">
                <div className="flex items-center gap-4">
                    <button onClick={prevMonth} className="p-2 hover:bg-gray-100 rounded-full">
                        <HiChevronLeft />
                    </button>
                    <h3 className="text-xl font-semibold">{monthName}</h3>
                    <button onClick={nextMonth} className="p-2 hover:bg-gray-100 rounded-full">
                        <HiChevronRight />
                    </button>
                </div>
                {isAdmin && (
                    <button
                        onClick={() => setShowAddForm(!showAddForm)}
                        className="flex items-center gap-2 bg-amber-800 text-white px-4 py-2 rounded-lg hover:bg-amber-700 transition text-sm"
                    >
                        <HiPlus /> {t.calendar.blockDates}
                    </button>
                )}
                {!isAdmin && (
                    <button
                        onClick={handleRefresh}
                        disabled={refreshing || cooldown > 0}
                        className="flex items-center gap-2 bg-white text-amber-800 border border-amber-800 px-4 py-2 rounded-lg hover:bg-amber-50 transition text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                        title={cooldown > 0 ? `Wait ${cooldown}s before refreshing again` : 'Check for new bookings from Airbnb & Bedandbreakfast'}
                    >
                        <HiRefresh className={refreshing ? 'animate-spin' : ''} />
                        {refreshing
                            ? t.calendar.refreshing
                            : cooldown > 0
                                ? `${cooldown}s`
                                : t.calendar.refreshAvailability}
                    </button>
                )}
            </div>

            {selectedStart && selectedEnd && (
                <div className="mt-2">
                    <p className="text-sm text-gray-600">
                        {nights} {nights === 1 ? t.booking.night : t.booking.nights}
                        {roomPrice && ` · $${roomPrice}/${t.booking.night} · ${t.booking.total}: $${nights * roomPrice}`}
                    </p>
                    <button
                        onClick={() => {
                            if (!selectedStart || !selectedEnd) return
                            if (hasOverlap(selectedStart, selectedEnd)) {
                                toast.error(t.booking.overlapReselect)
                                setSelectedStart(null)
                                setSelectedEnd(null)
                                return
                            }
                            setShowBookingForm(true)
                        }}
                        className="mt-2 bg-green-700 text-white px-6 py-2 rounded-lg hover:bg-green-800 transition text-sm"
                    >
                        {t.booking.bookTheseDates}
                    </button>
                </div>
            )}

            {/* Admin Add Block Form */}
            {showAddForm && isAdmin && (
                <form onSubmit={addBlockedDates} className="mb-6 bg-amber-50 p-4 rounded-lg">
                    <div className="grid grid-cols-2 gap-4 mb-4">
                        <div>
                            <label className="block text-sm font-medium mb-1">{t.booking.checkIn}</label>
                            <input type="date" required value={newBooking.checkIn}
                                   onChange={(e) => setNewBooking({ ...newBooking, checkIn: e.target.value })}
                                   className="w-full px-3 py-2 border rounded-md text-sm" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">{t.booking.checkOut}</label>
                            <input type="date" required value={newBooking.checkOut}
                                   onChange={(e) => setNewBooking({ ...newBooking, checkOut: e.target.value })}
                                   min={newBooking.checkIn}
                                   className="w-full px-3 py-2 border rounded-md text-sm" />
                        </div>
                    </div>
                    <div className="mb-4">
                        <label className="block text-sm font-medium mb-1">Guest Name (optional)</label>
                        <input type="text" value={newBooking.guestName}
                               onChange={(e) => setNewBooking({ ...newBooking, guestName: e.target.value })}
                               placeholder="Leave blank to just block dates"
                               className="w-full px-3 py-2 border rounded-md text-sm" />
                    </div>
                    <div className="flex gap-2">
                        <button type="submit" className="bg-amber-800 text-white px-4 py-2 rounded-lg hover:bg-amber-700 text-sm">Block</button>
                        <button type="button" onClick={() => setShowAddForm(false)} className="bg-gray-300 px-4 py-2 rounded-lg hover:bg-gray-400 text-sm">Cancel</button>
                    </div>
                </form>
            )}

            {/* Booking Form Modal */}
            {showBookingForm && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-lg p-6 max-w-md w-full max-h-[90vh] overflow-y-auto">
                        <h3 className="text-xl font-semibold mb-4">{t.booking.completeBooking}</h3>

                        {/* Booking Summary */}
                        <div className="mb-4 p-3 bg-gray-50 rounded">
                            <p className="text-sm"><strong>{t.booking.bookingSummary.room}</strong> {roomName}</p>
                            <p className="text-sm"><strong>{t.booking.bookingSummary.checkIn}</strong> {selectedStart && formatDate(selectedStart)}</p>
                            <p className="text-sm"><strong>{t.booking.bookingSummary.checkOut}</strong> {selectedEnd && formatDate(selectedEnd)}</p>
                            <p className="text-sm"><strong>{t.booking.bookingSummary.nights}</strong> {nights}</p>
                            {roomPrice && (
                                <p className="text-sm font-semibold text-amber-800">
                                    <strong>{t.booking.bookingSummary.estimatedTotal}</strong> ${nights * roomPrice}
                                </p>
                            )}
                        </div>

                        <form onSubmit={handleBookingSubmit} className="space-y-3">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">{t.booking.form.name}</label>
                                <input type="text" required value={bookingForm.name}
                                       onChange={(e) => setBookingForm({ ...bookingForm, name: e.target.value })}
                                       className="w-full px-3 py-2 border rounded-md text-sm" />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">{t.booking.form.email}</label>
                                <input type="email" required value={bookingForm.email}
                                       onChange={(e) => setBookingForm({ ...bookingForm, email: e.target.value })}
                                       className="w-full px-3 py-2 border rounded-md text-sm" />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">{t.booking.form.phone}</label>
                                <input type="tel" value={bookingForm.phone}
                                       onChange={(e) => setBookingForm({ ...bookingForm, phone: e.target.value })}
                                       className="w-full px-3 py-2 border rounded-md text-sm" />
                            </div>

                            {/* Guests Selector*/}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    {t.booking.form.numberOfGuests}
                                    <span className="text-gray-500 font-normal"> {t.booking.form.maxCapacity.replace('{capacity}', String(roomCapacity))}</span>
                                </label>
                                <select
                                    required
                                    value={bookingForm.guests}
                                    onChange={(e) => setBookingForm({ ...bookingForm, guests: e.target.value })}
                                    className="w-full px-3 py-2 border rounded-md text-sm"
                                >
                                    {[...Array(roomCapacity)].map((_, i) => {
                                        const num = i + 1
                                        return (
                                            <option key={num} value={num}>
                                                {num} {num === 1 ? t.booking.guest : t.booking.guestsPlural}
                                            </option>
                                        )
                                    })}
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">{t.booking.form.message}</label>
                                <textarea rows={3} value={bookingForm.message}
                                          onChange={(e) => setBookingForm({ ...bookingForm, message: e.target.value })}
                                          placeholder={t.booking.form.messagePlaceholderAlt}
                                          className="w-full px-3 py-2 border rounded-md text-sm" />
                            </div>

                            <button type="submit" disabled={sending}
                                    className="w-full bg-green-700 text-white py-3 rounded-lg hover:bg-green-800 disabled:opacity-50 font-semibold">
                                {sending ? t.booking.form.sending : t.booking.form.submit}
                            </button>

                            <button type="button" onClick={() => setShowBookingForm(false)}
                                    className="w-full text-sm text-gray-500 hover:text-gray-700 py-1">
                                {t.booking.form.cancel}
                            </button>
                        </form>
                    </div>
                </div>
            )}

            {/* Calendar Grid */}
            <div className="grid grid-cols-7 gap-1">
                {t.calendar.days.map(day => (
                    <div key={day} className="text-center text-sm font-semibold text-gray-600 py-2">{day}</div>
                ))}
                {[...Array(firstDayOfMonth)].map((_, i) => (
                    <div key={`empty-${i}`} className="h-12" />
                ))}
                {[...Array(daysInMonth)].map((_, i) => {
                    const day = i + 1
                    const date = new Date(year, month, day)
                    const isBooked = isDateBooked(date)
                    const isToday = date.getTime() === today.getTime()
                    const isPast = date < today
                    const inRange = isInRange(date)
                    const isStart = isRangeStart(date)
                    const isEnd = isRangeEnd(date)
                    const clickable = !isAdmin && !isPast && !isBooked

                    return (
                        <button
                            key={day}
                            onClick={() => clickable && handleDateClick(date)}
                            disabled={!clickable && !isAdmin}
                            className={`
                h-12 flex items-center justify-center rounded-lg text-sm relative transition-all
                ${isBooked ? 'bg-red-100 text-red-800 cursor-not-allowed' : ''}
                ${isPast && !isToday ? 'opacity-30 cursor-not-allowed' : ''}
                ${inRange && !isBooked ? 'bg-amber-200 text-amber-900' : ''}
                ${isStart || isEnd ? 'bg-amber-800 text-white font-bold' : ''}
                ${isToday ? 'ring-2 ring-amber-500 font-bold' : ''}
                ${!isBooked && !isPast && !inRange ? 'bg-gray-50 text-gray-700 hover:bg-amber-100 cursor-pointer' : ''}
              `}
                        >
                            {day}
                            {isBooked && <div className="absolute bottom-1 w-1 h-1 bg-red-500 rounded-full" />}
                        </button>
                    )
                })}
            </div>

            {/* Legend */}
            <div className="flex gap-6 mt-6 text-sm">
                <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-red-100 rounded border border-red-200" />
                    <span>{t.calendar.legend.booked}</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-amber-200 rounded border border-amber-300" />
                    <span>{t.calendar.legend.selected}</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-gray-50 rounded border" />
                    <span>{t.calendar.legend.available}</span>
                </div>
            </div>

            {/* Bookings List (Admin) */}
            {isAdmin && bookings.length > 0 && (
                <div className="mt-6 border-t pt-4">
                    <h4 className="font-semibold mb-3">{t.calendar.upcomingBookings}</h4>
                    <div className="space-y-2">
                        {bookings.map(booking => (
                            <div key={booking.id} className="flex justify-between items-center bg-gray-50 p-3 rounded-lg text-sm">
                                <div>
                                    <div className="flex items-center gap-2">
                                        <p className="font-medium">
                                            {new Date(booking.checkIn).toLocaleDateString('en-US')} → {new Date(booking.checkOut).toLocaleDateString('en-US')}
                                        </p>
                                        {booking.source && booking.source !== 'manual' && (
                                            <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full font-medium">
                                                {booking.source}
                                            </span>
                                        )}
                                    </div>
                                    {booking.guestName && booking.guestName !== 'Blocked' && (
                                        <p className="text-gray-600">{booking.guestName}</p>
                                    )}
                                </div>
                                <button onClick={() => removeBooking(booking.id)} className="text-red-600 hover:text-red-800">
                                    <HiTrash />
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    )
}
