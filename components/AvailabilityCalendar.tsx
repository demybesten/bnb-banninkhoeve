// components/AvailabilityCalendar.tsx
'use client'

import { useState, useEffect } from 'react'
import { toast } from 'react-hot-toast'
import { HiTrash, HiPlus, HiChevronLeft, HiChevronRight } from 'react-icons/hi'

interface Booking {
    id: number
    checkIn: string
    checkOut: string
    guestName: string | null
    status: string
}

interface AvailabilityCalendarProps {
    roomId: number
    roomName?: string
    roomPrice?: number
    roomCapacity?: number
    isAdmin?: boolean
}

export default function AvailabilityCalendar({ roomId, roomName, roomPrice, roomCapacity, isAdmin = false }: AvailabilityCalendarProps) {
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

    // Admin block form
    const [newBooking, setNewBooking] = useState({
        checkIn: '',
        checkOut: '',
        guestName: ''
    })

    useEffect(() => {
        fetchBookings()
    }, [roomId])

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

    // Get all booked dates as a Set for quick lookup
// Find this in AvailabilityCalendar.tsx (around line 65-76)
// Find this function in AvailabilityCalendar.tsx and update it:
    const getBookedDates = (): Set<string> => {
        const dates = new Set<string>()
        bookings.forEach(booking => {
            if (booking.status === 'confirmed') {
                const start = new Date(booking.checkIn)
                const end = new Date(booking.checkOut)

                // Set both to midnight for consistent comparison
                start.setHours(0, 0, 0, 0)
                end.setHours(0, 0, 0, 0)

                // Include the check-out date as booked (since guest occupies the room that night)
                for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
                    dates.add(d.toISOString().split('T')[0])
                }
            }
        })
        return dates
    }

    // Check if a date is booked
    const isDateBooked = (date: Date): boolean => {
        const dateStr = date.toISOString().split('T')[0]
        return getBookedDates().has(dateStr)
    }

    // Check if a date range is valid (no overlap with booked dates)
    const isRangeValid = (start: Date, end: Date): boolean => {
        const bookedDates = getBookedDates()
        for (let d = new Date(start); d < end; d.setDate(d.getDate() + 1)) {
            if (bookedDates.has(d.toISOString().split('T')[0])) {
                return false
            }
        }
        return true
    }

    // Check if a date range overlaps with any bookings
// Update hasOverlap to be more precise:
    const hasOverlap = (start: Date, end: Date): boolean => {
        // Set times to midnight for accurate comparison
        const rangeStart = new Date(start)
        rangeStart.setHours(0, 0, 0, 0)
        const rangeEnd = new Date(end)
        rangeEnd.setHours(23, 59, 59, 999)

        return bookings.some(booking => {
            if (booking.status !== 'confirmed') return false
            const bStart = new Date(booking.checkIn)
            bStart.setHours(0, 0, 0, 0)
            const bEnd = new Date(booking.checkOut)
            bEnd.setHours(23, 59, 59, 999)

            // Check if ranges overlap
            return rangeStart < bEnd && rangeEnd > bStart
        })
    }

    // Handle date click for booking
// Replace the handleDateClick function with this:
    const handleDateClick = (date: Date) => {
        if (isAdmin || isDateBooked(date) || date < new Date(new Date().setHours(0,0,0,0))) return

        // If clicking the same date as selected start (and no end selected), unselect it
        if (selectedStart && !selectedEnd && date.getTime() === selectedStart.getTime()) {
            setSelectedStart(null)
            return
        }

        // If clicking the same date as selected end, just remove the end
        if (selectedEnd && date.getTime() === selectedEnd.getTime()) {
            setSelectedEnd(null)
            return
        }

        // If clicking the same date as selected start (with end selected), clear everything
        if (selectedStart && date.getTime() === selectedStart.getTime()) {
            setSelectedStart(null)
            setSelectedEnd(null)
            return
        }

        if (!selectedStart || (selectedStart && selectedEnd)) {
            // Start new selection
            setSelectedStart(date)
            setSelectedEnd(null)
        } else {
            // Complete selection - check if range is valid
            if (date < selectedStart) {
                // If clicked before start, swap
                const tempStart = date
                const tempEnd = selectedStart

                // Check if this range overlaps with any bookings
                if (hasOverlap(tempStart, tempEnd)) {
                    toast.error('This date range overlaps with booked dates. Please select available dates only.')
                    return
                }

                setSelectedStart(tempStart)
                setSelectedEnd(tempEnd)
            } else {
                // Check if this range overlaps with any bookings
                if (hasOverlap(selectedStart, date)) {
                    toast.error('This date range overlaps with booked dates. Please select available dates only.')
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
                message: bookingForm.message || 'No special requests',
                check_in: selectedStart.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' }),
                check_out: selectedEnd.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' }),
                guests: bookingForm.guests,
                room_name: roomName || `Room #${roomId}`,
                nights: nights,
                total_price: totalPrice > 0 ? `$${totalPrice}` : 'To be confirmed',
            })

            toast.success('Booking request sent! We\'ll confirm availability shortly.')
            setSelectedStart(null)
            setSelectedEnd(null)
            setShowBookingForm(false)
            setBookingForm({ name: '', email: '', phone: '', guests: '2', message: '' })
        } catch (err) {
            toast.error('Failed to send. Please try again or call us.')
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

    const months = ['January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December']
    const monthName = `${months[currentMonth.getMonth()]} ${currentMonth.getFullYear()}`

    const year = currentMonth.getFullYear()
    const month = currentMonth.getMonth()
    const daysInMonth = new Date(year, month + 1, 0).getDate()
    const firstDayOfMonth = new Date(year, month, 1).getDay()

    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
    const today = new Date()
    today.setHours(0, 0, 0, 0)

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
                        <HiPlus /> Block Dates
                    </button>
                )}
            </div>

            {selectedStart && selectedEnd && (
                <div className="mt-2">
                    <p className="text-sm text-gray-600">
                        {calculateNights()} {calculateNights() === 1 ? 'night' : 'nights'}
                        {roomPrice && ` · $${roomPrice}/night · Total: $${calculateNights() * roomPrice}`}
                    </p>
                    <button
                        onClick={() => {
                            // Double-check validity before showing form
                            if (!selectedStart || !selectedEnd) return
                            if (hasOverlap(selectedStart, selectedEnd)) {
                                toast.error('Selected dates overlap with booked dates. Please reselect.')
                                setSelectedStart(null)
                                setSelectedEnd(null)
                                return
                            }
                            setShowBookingForm(true)
                        }}
                        className="mt-2 bg-green-700 text-white px-6 py-2 rounded-lg hover:bg-green-800 transition text-sm"
                    >
                        Book These Dates
                    </button>
                </div>
            )}

            {/* Admin Add Block Form */}
            {showAddForm && isAdmin && (
                <form onSubmit={addBlockedDates} className="mb-6 bg-amber-50 p-4 rounded-lg">
                    <div className="grid grid-cols-2 gap-4 mb-4">
                        <div>
                            <label className="block text-sm font-medium mb-1">Check-in</label>
                            <input type="date" required value={newBooking.checkIn}
                                   onChange={(e) => setNewBooking({ ...newBooking, checkIn: e.target.value })}
                                   className="w-full px-3 py-2 border rounded-md text-sm" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">Check-out</label>
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
                        <h3 className="text-xl font-semibold mb-4">Complete Your Booking</h3>

                        {/* Booking Summary */}
                        <div className="mb-4 p-3 bg-gray-50 rounded">
                            <p className="text-sm"><strong>Room:</strong> {roomName}</p>
                            <p className="text-sm"><strong>Check-in:</strong> {selectedStart && formatDate(selectedStart)}</p>
                            <p className="text-sm"><strong>Check-out:</strong> {selectedEnd && formatDate(selectedEnd)}</p>
                            <p className="text-sm"><strong>Nights:</strong> {calculateNights()}</p>
                            {roomPrice && (
                                <p className="text-sm font-semibold text-amber-800">
                                    <strong>Estimated Total:</strong> ${calculateNights() * roomPrice}
                                </p>
                            )}
                        </div>

                        <form onSubmit={handleBookingSubmit} className="space-y-3">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Name *</label>
                                <input type="text" required value={bookingForm.name}
                                       onChange={(e) => setBookingForm({ ...bookingForm, name: e.target.value })}
                                       className="w-full px-3 py-2 border rounded-md text-sm" />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
                                <input type="email" required value={bookingForm.email}
                                       onChange={(e) => setBookingForm({ ...bookingForm, email: e.target.value })}
                                       className="w-full px-3 py-2 border rounded-md text-sm" />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                                <input type="tel" value={bookingForm.phone}
                                       onChange={(e) => setBookingForm({ ...bookingForm, phone: e.target.value })}
                                       className="w-full px-3 py-2 border rounded-md text-sm" />
                            </div>

                            {/* Guests Selector*/}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Number of Guests *
                                    <span className="text-gray-500 font-normal"> (Max {roomCapacity})</span>
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
                                                {num} {num === 1 ? 'Guest' : 'Guests'}
                                            </option>
                                        )
                                    })}
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Special Requests</label>
                                <textarea rows={3} value={bookingForm.message}
                                          onChange={(e) => setBookingForm({ ...bookingForm, message: e.target.value })}
                                          placeholder="Any special requirements or questions?"
                                          className="w-full px-3 py-2 border rounded-md text-sm" />
                            </div>

                            <button type="submit" disabled={sending}
                                    className="w-full bg-green-700 text-white py-3 rounded-lg hover:bg-green-800 disabled:opacity-50 font-semibold">
                                {sending ? 'Sending...' : 'Send Booking Request'}
                            </button>

                            <button type="button" onClick={() => setShowBookingForm(false)}
                                    className="w-full text-sm text-gray-500 hover:text-gray-700 py-1">
                                Cancel
                            </button>
                        </form>
                    </div>
                </div>
            )}

            {/* Calendar Grid */}
            <div className="grid grid-cols-7 gap-1">
                {days.map(day => (
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
                    <span>Booked</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-amber-200 rounded border border-amber-300" />
                    <span>Selected</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-gray-50 rounded border" />
                    <span>Available</span>
                </div>
            </div>

            {/* Bookings List (Admin) */}
            {isAdmin && bookings.length > 0 && (
                <div className="mt-6 border-t pt-4">
                    <h4 className="font-semibold mb-3">Upcoming Bookings</h4>
                    <div className="space-y-2">
                        {bookings.map(booking => (
                            <div key={booking.id} className="flex justify-between items-center bg-gray-50 p-3 rounded-lg text-sm">
                                <div>
                                    <p className="font-medium">
                                        {new Date(booking.checkIn).toLocaleDateString('en-US')} → {new Date(booking.checkOut).toLocaleDateString('en-US')}
                                    </p>
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