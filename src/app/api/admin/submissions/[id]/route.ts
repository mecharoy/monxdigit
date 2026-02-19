import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { prisma } from '@/lib/prisma'

async function checkAdmin() {
  const cookieStore = await cookies()
  const auth = cookieStore.get('admin_auth')
  return auth?.value === 'authenticated'
}

// PUT /api/admin/submissions/[id] — save admin reply
export async function PUT(req: Request, { params }: { params: { id: string } }) {
  if (!(await checkAdmin())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = await req.json()
  const { adminReply } = body

  if (typeof adminReply !== 'string') {
    return NextResponse.json({ error: 'Invalid reply' }, { status: 400 })
  }

  const updated = await prisma.submission.update({
    where: { id: params.id },
    data: { adminReply: adminReply.trim() || null },
  })

  return NextResponse.json(updated)
}

// PATCH /api/admin/submissions/[id] — update submission status OR thread state
export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  if (!(await checkAdmin())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = await req.json()
  const { status, threadClosed } = body

  // Only allow closing a thread — once closed it cannot be reopened
  if (typeof threadClosed === 'boolean') {
    if (!threadClosed) {
      return NextResponse.json({ error: 'Thread cannot be reopened once closed' }, { status: 403 })
    }
    const updated = await prisma.submission.update({
      where: { id: params.id },
      data: { threadClosed: true },
    })
    return NextResponse.json(updated)
  }

  const validStatuses = ['PENDING', 'REVIEWED', 'ACKNOWLEDGED']
  if (!validStatuses.includes(status)) {
    return NextResponse.json({ error: 'Invalid status' }, { status: 400 })
  }

  const updated = await prisma.submission.update({
    where: { id: params.id },
    data: { status },
  })

  return NextResponse.json(updated)
}
