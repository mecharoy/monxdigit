import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getSessionUser } from '@/lib/auth'

// GET /api/posts/[id] — get a single post by id (for editing)
export async function GET(req: Request, { params }: { params: { id: string } }) {
  const user = await getSessionUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const post = await prisma.post.findUnique({ where: { id: params.id } })
  if (!post) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  if (post.authorId !== user.id && user.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  return NextResponse.json(post)
}

// PUT /api/posts/[id] — update a post
export async function PUT(req: Request, { params }: { params: { id: string } }) {
  const user = await getSessionUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const post = await prisma.post.findUnique({ where: { id: params.id } })
  if (!post) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  if (post.authorId !== user.id && user.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  const body = await req.json()
  const { title, content, published } = body

  if (!title?.trim() || !content?.trim()) {
    return NextResponse.json({ error: 'Title and content are required' }, { status: 400 })
  }

  const updated = await prisma.post.update({
    where: { id: params.id },
    data: {
      title: title.trim(),
      content: content.trim(),
      published: Boolean(published),
    },
  })

  return NextResponse.json(updated)
}

// DELETE /api/posts/[id] — delete a post
export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  const user = await getSessionUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const post = await prisma.post.findUnique({ where: { id: params.id } })
  if (!post) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  if (post.authorId !== user.id && user.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  await prisma.post.delete({ where: { id: params.id } })
  return NextResponse.json({ success: true })
}
