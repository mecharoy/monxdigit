import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getSessionUser } from '@/lib/auth'

// GET /api/submissions — get logged-in user's own submissions
export async function GET() {
  const user = await getSessionUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const submissions = await prisma.submission.findMany({
    where: { authorId: user.id },
    orderBy: { createdAt: 'desc' },
  })

  return NextResponse.json(submissions)
}

// POST /api/submissions — create a submission
export async function POST(req: Request) {
  const user = await getSessionUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await req.json()
  const { title, type, content } = body

  if (!title?.trim() || !type || !content?.trim()) {
    return NextResponse.json({ error: 'Title, type, and content are required' }, { status: 400 })
  }

  const validTypes = ['DOCUMENT', 'TODO_LIST', 'UPDATE', 'MESSAGE']
  if (!validTypes.includes(type)) {
    return NextResponse.json({ error: 'Invalid submission type' }, { status: 400 })
  }

  const submission = await prisma.submission.create({
    data: {
      title: title.trim(),
      type,
      content: content.trim(),
      authorId: user.id,
    },
  })

  return NextResponse.json(submission, { status: 201 })
}
