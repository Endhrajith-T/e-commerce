import { NextRequest, NextResponse } from 'next/server'
import { verifyAdminToken } from '@/lib/auth'

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl

  const isAdminPage = pathname.startsWith('/admin') && pathname !== '/admin'
  const isAdminApi = pathname.startsWith('/api/admin') && pathname !== '/api/admin/login'

  if (isAdminPage || isAdminApi) {
    const token = req.cookies.get('admin_token')?.value
    if (!token || !verifyAdminToken(token)) {
      if (isAdminApi) {
        return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
      }
      return NextResponse.redirect(new URL('/admin', req.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/admin/:path+', '/api/admin/:path*'],
}
