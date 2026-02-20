import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { timingSafeEqual } from 'crypto'
import { computeAdminToken } from '@/lib/admin-auth'

export async function POST(request: NextRequest) {
  try {
    const { password } = await request.json()

    const adminPassword = process.env.ADMIN_PASSWORD ?? ''
    const inputBuf = Buffer.from(String(password ?? ''))
    const adminBuf = Buffer.from(adminPassword)

    // Always run timingSafeEqual (even on length mismatch) to avoid timing leaks
    const dummyBuf = Buffer.alloc(adminBuf.length)
    const candidate = inputBuf.length === adminBuf.length ? inputBuf : dummyBuf
    const valid = inputBuf.length === adminBuf.length && timingSafeEqual(candidate, adminBuf)

    if (valid) {
      const cookieStore = await cookies()
      cookieStore.set('admin_auth', computeAdminToken(), {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 60 * 24 * 7,
      })
      return NextResponse.json({ success: true })
    }

    return NextResponse.json({ success: false }, { status: 401 })
  } catch {
    return NextResponse.json({ success: false }, { status: 500 })
  }
}
