import { createHmac, timingSafeEqual } from 'crypto'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

const COOKIE_NAME = 'admin_auth'
const PAYLOAD = 'admin:authenticated'

export function computeAdminToken(): string {
  const secret = process.env.ADMIN_PASSWORD
  if (!secret) throw new Error('ADMIN_PASSWORD env var is not set')
  return createHmac('sha256', secret).update(PAYLOAD).digest('hex')
}

/** Use in Server Components/pages — redirects to login if not authenticated. */
export async function requireAdmin(): Promise<void> {
  if (!(await isAdminAuthenticated())) redirect('/admin/login')
}

export async function isAdminAuthenticated(): Promise<boolean> {
  try {
    const cookieStore = await cookies()
    const cookie = cookieStore.get(COOKIE_NAME)
    if (!cookie?.value) return false

    const expected = Buffer.from(computeAdminToken())
    const actual = Buffer.from(cookie.value)

    if (actual.length !== expected.length) return false
    return timingSafeEqual(actual, expected)
  } catch {
    return false
  }
}
