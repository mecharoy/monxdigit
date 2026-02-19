import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { prisma } from '@/lib/prisma'

async function checkAdmin() {
  const cookieStore = await cookies()
  const auth = cookieStore.get('admin_auth')
  return auth?.value === 'authenticated'
}

// GET /api/admin/submissions/[id]/download — download the attached file
export async function GET(_req: Request, { params }: { params: { id: string } }) {
  if (!(await checkAdmin())) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const attachment = await prisma.fileAttachment.findUnique({
    where: { submissionId: params.id },
  })

  if (!attachment) return NextResponse.json({ error: 'No file found' }, { status: 404 })

  return new NextResponse(attachment.data, {
    headers: {
      'Content-Type': attachment.mimeType,
      'Content-Disposition': `attachment; filename="${attachment.fileName}"`,
      'Content-Length': String(attachment.data.length),
    },
  })
}
