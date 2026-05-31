// app/api/contact/route.ts
import { NextResponse } from 'next/server'
import nodemailer from 'nodemailer'

export async function POST(request: Request) {
    try {
        const body = await request.json()
        const { name, email, phone, message, checkIn, checkOut, guests } = body

        // Validate required fields
        if (!name || !email || !message) {
            return NextResponse.json(
                { error: 'Name, email, and message are required' },
                { status: 400 }
            )
        }

        // Option 1: Send email notification (requires email service)
        if (process.env.SMTP_HOST) {
            await sendEmail({
                name,
                email,
                phone,
                message,
                checkIn,
                checkOut,
                guests
            })
        }

        // Option 2: Save to database
        if (process.env.DATABASE_URL) {
            await saveToDatabase({
                name,
                email,
                phone,
                message,
                checkIn,
                checkOut,
                guests
            })
        }

        // Option 3: Send to webhook (Zapier, Make, etc.)
        if (process.env.CONTACT_WEBHOOK_URL) {
            await sendToWebhook({
                name,
                email,
                phone,
                message,
                checkIn,
                checkOut,
                guests
            })
        }

        return NextResponse.json({
            success: true,
            message: 'Thank you for your message! We\'ll get back to you soon.'
        })
    } catch (error) {
        console.error('Contact form error:', error)
        return NextResponse.json(
            { error: 'Failed to send message' },
            { status: 500 }
        )
    }
}

async function sendEmail(data: any) {
    const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: parseInt(process.env.SMTP_PORT || '587'),
        secure: false,
        auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS,
        },
    })

    const mailOptions = {
        from: process.env.SMTP_FROM || data.email,
        to: process.env.ADMIN_EMAIL,
        subject: `New Inquiry from ${data.name} - Cozy B&B`,
        html: `
      <h2>New Contact Form Submission</h2>
      <p><strong>Name:</strong> ${data.name}</p>
      <p><strong>Email:</strong> ${data.email}</p>
      <p><strong>Phone:</strong> ${data.phone || 'Not provided'}</p>
      ${data.checkIn ? `<p><strong>Check-in:</strong> ${data.checkIn}</p>` : ''}
      ${data.checkOut ? `<p><strong>Check-out:</strong> ${data.checkOut}</p>` : ''}
      <p><strong>Guests:</strong> ${data.guests || 1}</p>
      <h3>Message:</h3>
      <p>${data.message}</p>
    `
    }

    await transporter.sendMail(mailOptions)
}

async function saveToDatabase(data: any) {
    // If you want to save inquiries to database
    const { prisma } = await import('@/lib/prisma')

    // You'd need to add an Inquiry model to your schema
    // await prisma.inquiry.create({ data })
}

async function sendToWebhook(data: any) {
    await fetch(process.env.CONTACT_WEBHOOK_URL!, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    })
}