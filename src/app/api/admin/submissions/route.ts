import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { isAdminAuthenticated } from '@/lib/admin-auth'

// GET /api/admin/submissions — all submissions (admin only)
export async function GET() {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const submissions = await prisma.submission.findMany({
    orderBy: { createdAt: 'desc' },
    include: { author: { select: { name: true, email: true } } },
  })

  return NextResponse.json(submissions)
}
