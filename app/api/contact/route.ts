// app/api/contact/route.ts — server-side contact form handler
// NOTE: The contact page currently uses EmailJS directly from the client (see lib/emailjs.ts).
// This route is a server-side fallback if you prefer to send via webhook instead.
// To use it, switch the contact page to POST here rather than calling EmailJS directly.
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
    try {
        const body = await request.json()
        const { name, email, phone, message } = body

        if (!name || !email || !message) {
            return NextResponse.json(
                { error: 'Name, email, and message are required' },
                { status: 400 }
            )
        }

        // Send to webhook (Zapier, Make, etc.)
        if (process.env.CONTACT_WEBHOOK_URL) {
            try {
                await fetch(process.env.CONTACT_WEBHOOK_URL, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ name, email, phone, message }),
                })
            } catch (err) {
                console.error('Webhook failed:', err)
            }
        }

        return NextResponse.json({
            success: true,
            message: "Thank you for your message! We'll get back to you soon.",
        })
    } catch (error) {
        console.error('Contact form error:', error)
        return NextResponse.json(
            { error: 'Failed to send message' },
            { status: 500 }
        )
    }
}
