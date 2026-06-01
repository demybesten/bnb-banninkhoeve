// lib/emailjs.ts
import emailjs from '@emailjs/browser'

interface BaseFormData {
    from_name: string
    reply_to: string
    phone: string
}

interface ContactFormData extends BaseFormData {
    message: string
}

interface BookingFormData extends BaseFormData {
    message: string
    check_in: string
    check_out: string
    guests: string
    room_name: string
    nights: number
    total_price: string
}

// Contact form (from /contact page)
export async function sendContactEmail(data: ContactFormData) {
    const serviceId = process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID!
    const templateId = process.env.NEXT_PUBLIC_EMAILJS_CONTACT_TEMPLATE_ID!
    const publicKey = process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY!

    try {
        const result = await emailjs.send(
            serviceId,
            templateId,
            {
                from_name: data.from_name,
                reply_to: data.reply_to,
                phone: data.phone || 'Not provided',
                message: data.message,
            },
            publicKey
        )
        return { success: true, result }
    } catch (error) {
        console.error('EmailJS error:', error)
        throw error
    }
}

// Booking form (from room calendar)
export async function sendBookingEmail(data: BookingFormData) {
    const serviceId = process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID!
    const templateId = process.env.NEXT_PUBLIC_EMAILJS_BOOKING_TEMPLATE_ID!
    const publicKey = process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY!

    try {
        const result = await emailjs.send(
            serviceId,
            templateId,
            {
                from_name: data.from_name,
                reply_to: data.reply_to,
                phone: data.phone || 'Not provided',
                message: data.message,
                check_in: data.check_in,
                check_out: data.check_out,
                guests: data.guests,
                room_name: data.room_name,
                nights: data.nights,
                total_price: data.total_price,
            },
            publicKey
        )
        return { success: true, result }
    } catch (error) {
        console.error('EmailJS error:', error)
        throw error
    }
}