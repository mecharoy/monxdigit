import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { isAdminAuthenticated } from '@/lib/admin-auth'

// GET /api/admin/submissions/[id]/download — download the attached file
export async function GET(_req: Request, { params }: { params: { id: string } }) {
  if (!(await isAdminAuthenticated())) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const attachment = await prisma.fileAttachment.findUnique({
    where: { submissionId: params.id },
  })

  if (!attachment) return NextResponse.json({ error: 'No file found' }, { status: 404 })

  return new NextResponse(new Uint8Array(attachment.data), {
    headers: {
      'Content-Type': attachment.mimeType,
      'Content-Disposition': `attachment; filename="${attachment.fileName}"`,
      'Content-Length': String(attachment.data.length),
    },
  })
}
