import { NextRequest, NextResponse } from 'next/server'
import { getSessionUser } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

const MAX_SIZE = 20 * 1024 * 1024 // 20 MB

const ALLOWED_TYPES: Record<string, string> = {
  'application/pdf': 'pdf',
  'application/msword': 'doc',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document': 'docx',
  'application/vnd.ms-excel': 'xls',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': 'xlsx',
  'application/vnd.ms-powerpoint': 'ppt',
  'application/vnd.openxmlformats-officedocument.presentationml.presentation': 'pptx',
  'text/plain': 'txt',
  'text/csv': 'csv',
  'application/zip': 'zip',
  'image/png': 'png',
  'image/jpeg': 'jpg',
  'image/gif': 'gif',
  'image/webp': 'webp',
}

export async function POST(req: NextRequest) {
  const user = await getSessionUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const formData = await req.formData()
  const file = formData.get('file') as File | null
  if (!file) return NextResponse.json({ error: 'No file provided' }, { status: 400 })

  if (file.size > MAX_SIZE) {
    return NextResponse.json({ error: 'File too large (max 20 MB)' }, { status: 400 })
  }

  if (!ALLOWED_TYPES[file.type]) {
    return NextResponse.json(
      { error: 'Invalid file type.' },
      { status: 400 },
    )
  }

  const bytes = await file.arrayBuffer()
  const buffer = Buffer.from(bytes)
  const originalName = file.name.replace(/[^a-zA-Z0-9._-]/g, '_')

  const record = await prisma.fileAttachment.create({
    data: {
      fileName: originalName,
      mimeType: file.type,
      data: buffer,
    },
  })

  return NextResponse.json({ attachmentId: record.id, fileName: originalName })
}
