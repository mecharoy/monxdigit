import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { hashPassword, createSession } from '@/lib/auth'
import { registerSchema } from '@/lib/validations'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const result = registerSchema.safeParse(body)

    if (!result.success) {
      const errors = result.error.flatten().fieldErrors
      return NextResponse.json({ success: false, errors }, { status: 400 })
    }

    const { name, email, password } = result.data

    const existing = await prisma.user.findUnique({ where: { email } })
    if (existing) {
      return NextResponse.json(
        { success: false, errors: { email: ['An account with this email already exists'] } },
        { status: 409 }
      )
    }

    const hashed = await hashPassword(password)
    const user = await prisma.user.create({
      data: { name, email, password: hashed },
      select: { id: true },
    })

    await createSession(user.id)
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('[register]', error)
    return NextResponse.json({ success: false, message: 'Internal server error' }, { status: 500 })
  }
}
