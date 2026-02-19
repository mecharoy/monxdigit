import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getSessionUser } from '@/lib/auth'
import { slugify } from '@/lib/markdown'

// GET /api/posts — public: all published posts
export async function GET() {
  const posts = await prisma.post.findMany({
    where: { published: true },
    orderBy: { createdAt: 'desc' },
    select: {
      id: true,
      title: true,
      slug: true,
      content: true,
      createdAt: true,
      author: { select: { name: true } },
    },
  })
  return NextResponse.json(posts)
}

// POST /api/posts — create a new post (authenticated)
export async function POST(req: Request) {
  const user = await getSessionUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await req.json()
  const { title, content, published } = body

  if (!title?.trim() || !content?.trim()) {
    return NextResponse.json({ error: 'Title and content are required' }, { status: 400 })
  }

  const slug = slugify(title)

  const post = await prisma.post.create({
    data: {
      title: title.trim(),
      slug,
      content: content.trim(),
      published: Boolean(published),
      authorId: user.id,
    },
  })

  return NextResponse.json(post, { status: 201 })
}
