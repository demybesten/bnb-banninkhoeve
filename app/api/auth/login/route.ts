// app/api/auth/login/route.ts
import { NextResponse } from 'next/server'
import { login } from '@/lib/auth'

// Simple in-memory rate limiter (resets on server restart)
const attempts = new Map<string, { count: number; resetAt: number }>()
const MAX_ATTEMPTS = 5
const WINDOW_MS = 15 * 60 * 1000 // 15 minutes

function getRateLimitInfo(ip: string): { allowed: boolean; remaining: number } {
    const now = Date.now()
    const entry = attempts.get(ip)

    if (!entry || now > entry.resetAt) {
        attempts.set(ip, { count: 1, resetAt: now + WINDOW_MS })
        return { allowed: true, remaining: MAX_ATTEMPTS - 1 }
    }

    if (entry.count >= MAX_ATTEMPTS) {
        return { allowed: false, remaining: 0 }
    }

    entry.count++
    return { allowed: true, remaining: MAX_ATTEMPTS - entry.count }
}

export async function POST(request: Request) {
    // Rate limiting: identify by IP or x-forwarded-for header
    const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim()
        || request.headers.get('x-real-ip')
        || 'unknown'

    const { allowed, remaining } = getRateLimitInfo(ip)
    if (!allowed) {
        return NextResponse.json(
            { error: 'Too many login attempts. Please try again later.' },
            {
                status: 429,
                headers: { 'Retry-After': '900' }
            }
        )
    }

    try {
        const { username, password } = await request.json()

        if (!username || !password) {
            return NextResponse.json(
                { error: 'Username and password are required' },
                { status: 400 }
            )
        }

        const admin = await login(username, password)

        if (!admin) {
            return NextResponse.json(
                { error: 'Invalid credentials' },
                {
                    status: 401,
                    headers: { 'X-RateLimit-Remaining': String(remaining) }
                }
            )
        }

        // Clear rate limit on successful login
        attempts.delete(ip)

        return NextResponse.json({ success: true })
    } catch (error) {
        return NextResponse.json(
            { error: 'Login failed' },
            { status: 500 }
        )
    }
}