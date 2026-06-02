// proxy.ts — protects /admin/* routes (except /admin/login)
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { jwtVerify } from 'jose'

const secretKey = process.env.JWT_SECRET
const key = secretKey ? new TextEncoder().encode(secretKey) : null

export async function proxy(request: NextRequest) {
    const { pathname } = request.nextUrl

    // Only run on /admin routes, skip /admin/login
    if (!pathname.startsWith('/admin') || pathname === '/admin/login') {
        return NextResponse.next()
    }

    // Allow static files
    if (pathname.startsWith('/admin/_next')) {
        return NextResponse.next()
    }

    const sessionCookie = request.cookies.get('session')?.value

    if (!sessionCookie || !key) {
        return NextResponse.redirect(new URL('/admin/login', request.url))
    }

    try {
        await jwtVerify(sessionCookie, key, { algorithms: ['HS256'] })
        return NextResponse.next()
    } catch {
        // Token invalid or expired — redirect to login
        const response = NextResponse.redirect(new URL('/admin/login', request.url))
        response.cookies.delete('session')
        return response
    }
}

export const config = {
    matcher: '/admin/:path*',
}
