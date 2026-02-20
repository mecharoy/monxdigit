import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { isAdminAuthenticated } from '@/lib/admin-auth'

// GET /api/admin/submissions/[id]/messages — get thread messages
export async function GET(_req: Request, { params }: { params: { id: string } }) {
  if (!(await isAdminAuthenticated())) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const messages = await prisma.submissionMessage.findMany({
    where: { submissionId: params.id },
    orderBy: { createdAt: 'asc' },
  })

  return NextResponse.json(messages)
}

// POST /api/admin/submissions/[id]/messages — admin sends a message
export async function POST(req: Request, { params }: { params: { id: string } }) {
  if (!(await isAdminAuthenticated())) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const submission = await prisma.submission.findUnique({ where: { id: params.id } })
  if (!submission) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  if (submission.threadClosed) return NextResponse.json({ error: 'Thread is closed' }, { status: 403 })

  const body = await req.json()
  const { content } = body
  if (!content?.trim()) return NextResponse.json({ error: 'Content is required' }, { status: 400 })

  const message = await prisma.submissionMessage.create({
    data: {
      submissionId: params.id,
      content: content.trim(),
      isAdmin: true,
    },
  })

  return NextResponse.json(message, { status: 201 })
}
