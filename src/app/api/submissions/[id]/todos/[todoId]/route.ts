import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getSessionUser } from '@/lib/auth'

// PATCH /api/submissions/[id]/todos/[todoId] — user toggles a todo item
export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string; todoId: string }> }
) {
  const user = await getSessionUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { id, todoId } = await params

  const submission = await prisma.submission.findFirst({
    where: { id, authorId: user.id },
  })
  if (!submission) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  const body = await req.json()
  const { completed } = body
  if (typeof completed !== 'boolean') {
    return NextResponse.json({ error: 'completed must be a boolean' }, { status: 400 })
  }

  const todo = await prisma.todoItem.update({
    where: { id: todoId, submissionId: id },
    data: { completed },
  })

  return NextResponse.json(todo)
}
