import crypto from 'crypto'

export function generateOtp(): string {
  return Math.floor(100000 + Math.random() * 900000).toString()
}

export function hashOtp(otp: string): string {
  return crypto.createHash('sha256').update(otp + process.env.ADMIN_JWT_SECRET).digest('hex')
}

export function verifyOtp(inputOtp: string, hashedOtp: string): boolean {
  return hashOtp(inputOtp) === hashedOtp
}

export function otpExpiresAt(): string {
  const d = new Date()
  d.setMinutes(d.getMinutes() + 5)
  return d.toISOString()
}
