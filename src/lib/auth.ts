import jwt from 'jsonwebtoken'
import { NextRequest } from 'next/server'

const SECRET = process.env.ADMIN_JWT_SECRET!

export function signAdminToken(): string {
  return jwt.sign({ role: 'admin' }, SECRET, { expiresIn: '8h' })
}

export function verifyAdminToken(token: string): boolean {
  try {
    jwt.verify(token, SECRET)
    return true
  } catch {
    return false
  }
}

export function getAdminTokenFromRequest(req: NextRequest): string | null {
  return req.cookies.get('admin_token')?.value ?? null
}

export function isAdminAuthenticated(req: NextRequest): boolean {
  const token = getAdminTokenFromRequest(req)
  if (!token) return false
  return verifyAdminToken(token)
}
