// app/api/upload/route.ts
import { NextResponse } from 'next/server'
import { writeFile, mkdir } from 'fs/promises'
import { join } from 'path'
import { getSession } from '@/lib/auth'

export async function POST(request: Request) {
    const session = await getSession()
    if (!session) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    try {
        const formData = await request.formData()
        const files = formData.getAll('files') as File[]

        if (!files || files.length === 0) {
            return NextResponse.json(
                { error: 'No files uploaded' },
                { status: 400 }
            )
        }

        const uploadDir = join(process.cwd(), 'public', 'uploads')

        // Ensure upload directory exists
        try {
            await mkdir(uploadDir, { recursive: true })
        } catch (err) {
            // Directory already exists
        }

        const uploadedUrls: string[] = []

        for (const file of files) {
            // Generate unique filename
            const timestamp = Date.now()
            const randomString = Math.random().toString(36).substring(7)
            const extension = file.name.split('.').pop()
            const filename = `${timestamp}-${randomString}.${extension}`

            const bytes = await file.arrayBuffer()
            const buffer = Buffer.from(bytes)

            // Save file
            const filepath = join(uploadDir, filename)
            await writeFile(filepath, buffer)

            // Create URL path
            const url = `/uploads/${filename}`
            uploadedUrls.push(url)
        }

        return NextResponse.json({ urls: uploadedUrls })
    } catch (error) {
        console.error('Upload error:', error)
        return NextResponse.json(
            { error: 'Failed to upload files' },
            { status: 500 }
        )
    }
}