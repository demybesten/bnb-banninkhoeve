// app/api/upload/route.ts
import { NextResponse } from 'next/server'
import { writeFile, mkdir } from 'fs/promises'
import { join } from 'path'
import { getSession } from '@/lib/auth'

const ALLOWED_TYPES = [
    'image/jpeg',
    'image/png',
    'image/webp',
    'image/avif',
    'image/gif',
]

const MAX_FILE_SIZE = 5 * 1024 * 1024 // 5MB
const MAX_FILES = 10

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

        if (files.length > MAX_FILES) {
            return NextResponse.json(
                { error: `Maximum ${MAX_FILES} files per upload` },
                { status: 400 }
            )
        }

        // Validate each file
        for (const file of files) {
            if (!ALLOWED_TYPES.includes(file.type)) {
                return NextResponse.json(
                    { error: `File type not allowed: ${file.type}. Allowed: ${ALLOWED_TYPES.join(', ')}` },
                    { status: 400 }
                )
            }
            if (file.size > MAX_FILE_SIZE) {
                return NextResponse.json(
                    { error: `File too large: ${(file.size / 1024 / 1024).toFixed(1)}MB. Max: ${MAX_FILE_SIZE / 1024 / 1024}MB` },
                    { status: 400 }
                )
            }
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
            // Generate unique filename with safe extension
            const timestamp = Date.now()
            const randomString = Math.random().toString(36).substring(7)
            const extension = file.name.split('.').pop()?.toLowerCase() || 'jpg'
            // Map MIME type to safe extension
            const safeExtension = extension.replace(/[^a-z0-9]/g, '').slice(0, 4) || 'jpg'
            const filename = `${timestamp}-${randomString}.${safeExtension}`

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