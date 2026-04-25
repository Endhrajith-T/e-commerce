import { NextRequest, NextResponse } from 'next/server'

// NOTE: We do a lightweight cookie-presence check here in middleware (Edge runtime).
// Full JWT signature verification happens inside each API route handler using isAdminAuthenticated().
// jsonwebtoken uses Node.js crypto which is not available in the Edge runtime.

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl

  const isAdminPage = pathname.startsWith('/admin') && pathname !== '/admin'
  const isAdminApi  = pathname.startsWith('/api/admin') && pathname !== '/api/admin/login'

  if (isAdminPage || isAdminApi) {
    const token = req.cookies.get('admin_token')?.value

    // No cookie at all → block immediately
    if (!token) {
      if (isAdminApi) {
        return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
      }
      return NextResponse.redirect(new URL('/admin', req.url))
    }

    // Cookie exists → let the request through.
    // API routes will do full JWT verification via isAdminAuthenticated().
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/admin/:path+', '/api/admin/:path*'],
}
