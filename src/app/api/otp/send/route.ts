import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabaseAdmin'
import { checkRateLimit } from '@/lib/rateLimit'
import { sendOtpSms } from '@/lib/msg91'

function generateOtp(): string {
  return Math.floor(100000 + Math.random() * 900000).toString()
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { phone } = body

    if (!phone || !/^\d{10}$/.test(phone))
      return NextResponse.json(
        { success: false, error: 'Valid 10-digit phone number required' },
        { status: 400 }
      )

    const allowed = await checkRateLimit(phone)
    if (!allowed)
      return NextResponse.json(
        { success: false, error: 'Too many OTP requests. Please wait an hour before retrying.' },
        { status: 429 }
      )

    const otp = generateOtp()
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000).toISOString()

    await supabaseAdmin.from('otp_logs').delete().eq('phone', phone)

    const { error } = await supabaseAdmin
      .from('otp_logs')
      .insert({
        phone,
        otp,
        otp_code: otp,
        expires_at: expiresAt,
        is_used: false,
      })

    if (error) {
      console.error('OTP insert error:', error)
      return NextResponse.json(
        { success: false, error: 'Failed to generate OTP' },
        { status: 500 }
      )
    }

    // Send OTP via SMS (logs to console if Twilio not configured)
    await sendOtpSms(phone, otp)

    const isDev = process.env.NODE_ENV === 'development'

    return NextResponse.json({
      success: true,
      message: isDev
        ? `OTP generated (dev mode) — check terminal or use the otp field`
        : 'OTP sent to your mobile number',
      // Only expose OTP in development — NEVER in production
      ...(isDev && { otp }),
    })

  } catch (err) {
    console.error('OTP send error:', err)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}
