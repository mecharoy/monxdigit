import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { prisma } from '@/lib/prisma'

async function checkAdmin() {
  const cookieStore = await cookies()
  const auth = cookieStore.get('admin_auth')
  return auth?.value === 'authenticated'
}

// PATCH /api/admin/submissions/[id] — update submission status
export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  if (!(await checkAdmin())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = await req.json()
  const { status } = body

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
