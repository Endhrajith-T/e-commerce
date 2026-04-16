import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabaseAdmin'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { phone, otp } = body

    if (!phone || !otp)
      return NextResponse.json(
        { success: false, error: 'Phone and OTP required' },
        { status: 400 }
      )

    // Get OTP from DB
    const { data, error } = await supabaseAdmin
      .from('otp_logs')
      .select('*')
      .eq('phone', phone)
      .eq('otp', otp)
      .single()

    if (error || !data)
      return NextResponse.json(
        { success: false, error: 'Invalid OTP' },
        { status: 400 }
      )

    // Check expiry
    if (new Date(data.expires_at) < new Date())
      return NextResponse.json(
        { success: false, error: 'OTP expired. Please request a new one.' },
        { status: 400 }
      )

    // Delete used OTP
    await supabaseAdmin
      .from('otp_logs')
      .delete()
      .eq('phone', phone)

    return NextResponse.json({ success: true, message: 'OTP verified successfully' })

  } catch (err: any) {
    console.error('OTP verify error:', err)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}