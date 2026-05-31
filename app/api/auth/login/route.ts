// app/api/auth/login/route.ts
import { NextResponse } from 'next/server'
import { login } from '@/lib/auth'

export async function POST(request: Request) {
    try {
        const { username, password } = await request.json()
        const admin = await login(username, password)

        if (!admin) {
            return NextResponse.json(
                { error: 'Invalid credentials' },
                { status: 401 }
            )
        }

        return NextResponse.json({ success: true })
    } catch (error) {
        return NextResponse.json(
            { error: 'Login failed' },
            { status: 500 }
        )
    }
}