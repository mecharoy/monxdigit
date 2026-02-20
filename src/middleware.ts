import { NextRequest, NextResponse } from 'next/server'

const PROTECTED_PATHS = ['/dashboard']
const AUTH_PATHS = ['/auth/login', '/auth/register']
const USER_SESSION_COOKIE = 'user_session'

async function verifySessionToken(token: string): Promise<boolean> {
  try {
    const secret = process.env.SESSION_SECRET
    if (!secret) return false

    const decoded = Buffer.from(token, 'base64url').toString('utf8')
    const lastColon = decoded.lastIndexOf(':')
    if (lastColon === -1) return false

    const userId = decoded.slice(0, lastColon)
    const sig = decoded.slice(lastColon + 1)

    const encoder = new TextEncoder()
    const key = await crypto.subtle.importKey(
      'raw',
      encoder.encode(secret),
      { name: 'HMAC', hash: 'SHA-256' },
      false,
      ['sign']
    )
    const signatureBuffer = await crypto.subtle.sign('HMAC', key, encoder.encode(userId))
    const expected = Array.from(new Uint8Array(signatureBuffer))
      .map((b) => b.toString(16).padStart(2, '0'))
      .join('')

    return sig === expected
  } catch {
    return false
  }
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  const tokenValue = request.cookies.get(USER_SESSION_COOKIE)?.value
  const isLoggedIn = tokenValue ? await verifySessionToken(tokenValue) : false

  // If a cookie exists but the token is invalid, clear it to prevent redirect loops
  if (tokenValue && !isLoggedIn) {
    if (PROTECTED_PATHS.some((path) => pathname.startsWith(path))) {
      const loginUrl = new URL('/auth/login', request.url)
      loginUrl.searchParams.set('from', pathname)
      const redirect = NextResponse.redirect(loginUrl)
      redirect.cookies.delete(USER_SESSION_COOKIE)
      return redirect
    }
    const response = NextResponse.next()
    response.cookies.delete(USER_SESSION_COOKIE)
    return response
  }

  // Redirect unauthenticated users away from protected pages
  if (PROTECTED_PATHS.some((path) => pathname.startsWith(path))) {
    if (!isLoggedIn) {
      const loginUrl = new URL('/auth/login', request.url)
      loginUrl.searchParams.set('from', pathname)
      return NextResponse.redirect(loginUrl)
    }
  }

  // Redirect authenticated users away from auth pages
  if (AUTH_PATHS.some((path) => pathname.startsWith(path))) {
    if (isLoggedIn) {
      return NextResponse.redirect(new URL('/dashboard', request.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/dashboard/:path*', '/auth/:path*'],
}
