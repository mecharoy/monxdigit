import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { prisma } from '@/lib/prisma'

async function checkAdmin() {
  const cookieStore = await cookies()
  const auth = cookieStore.get('admin_auth')
  return auth?.value === 'authenticated'
}

// GET /api/admin/submissions/[id]/todos — get todo items
export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!(await checkAdmin())) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { id } = await params

  const todos = await prisma.todoItem.findMany({
    where: { submissionId: id },
    orderBy: { order: 'asc' },
  })

  return NextResponse.json(todos)
}

// POST /api/admin/submissions/[id]/todos — admin adds a todo item
export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!(await checkAdmin())) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { id } = await params

  const submission = await prisma.submission.findUnique({ where: { id } })
  if (!submission) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  const body = await req.json()
  const { text } = body
  if (!text?.trim()) return NextResponse.json({ error: 'Text is required' }, { status: 400 })

  const count = await prisma.todoItem.count({ where: { submissionId: id } })

  const todo = await prisma.todoItem.create({
    data: {
      submissionId: id,
      text: text.trim(),
      order: count,
    },
  })

  return NextResponse.json(todo, { status: 201 })
}
