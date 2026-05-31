// lib/emailjs.ts
import emailjs from '@emailjs/browser'

interface ContactFormData {
    from_name: string
    reply_to: string
    phone: string
    message: string
    check_in: string
    check_out: string
    guests: string
}

export async function sendContactEmail(data: ContactFormData) {
    const serviceId = process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID!
    const templateId = process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID!
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
                check_in: data.check_in || 'Not specified',
                check_out: data.check_out || 'Not specified',
                guests: data.guests || '1',
            },
            publicKey
        )

        return { success: true, result }
    } catch (error) {
        console.error('EmailJS error:', error)
        throw error
    }
}