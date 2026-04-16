import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabaseAdmin'

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

    const otp = generateOtp()
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000).toISOString()

    // Delete old OTPs
    await supabaseAdmin.from('otp_logs').delete().eq('phone', phone)

    // Insert new OTP
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

    console.log(`\n📱 OTP for ${phone}: ${otp}\n`)

    return NextResponse.json({
      success: true,
      message: 'OTP sent successfully',
      ...(process.env.NODE_ENV === 'development' && { otp }),
    })

  } catch (err: any) {
    console.error('OTP send error:', err)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}