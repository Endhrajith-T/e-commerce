import { NextRequest, NextResponse } from 'next/server'
import { signAdminToken } from '@/lib/auth'

export async function POST(req: NextRequest) {
  const { password } = await req.json()

  if (!password)
    return NextResponse.json({ success: false, error: 'Password required' }, { status: 400 })

  const adminPassword = process.env.ADMIN_PASSWORD
  if (!adminPassword)
    return NextResponse.json({ success: false, error: 'Server misconfiguration' }, { status: 500 })

  if (password !== adminPassword)
    return NextResponse.json({ success: false, error: 'Incorrect password' }, { status: 401 })

  const token = signAdminToken()

  const res = NextResponse.json({ success: true, message: 'Login successful' })
  res.cookies.set('admin_token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 60 * 60 * 8,
    path: '/',
  })

  return res
}
