import { NextRequest, NextResponse } from 'next/server'
import { razorpay } from '@/lib/razorpay'

export async function POST(req: NextRequest) {
  try {
    const { amount, phone } = await req.json()

    if (!amount || amount < 100)
      return NextResponse.json({ success: false, error: 'Invalid amount' }, { status: 400 })

    // Create a Razorpay Payment Link (available on ALL accounts)
    const link = await razorpay.paymentLink.create({
      amount,                          // in paise
      currency: 'INR',
      accept_partial: false,
      description: 'NareshBookStore — Book Order',
      customer: { contact: `+91${phone}` },
      notify: { sms: false, email: false },
      reminder_enable: false,
      notes: { phone },
      expire_by: Math.floor(Date.now() / 1000) + 15 * 60, // 15 min
    } as any)

    return NextResponse.json({
      success: true,
      link_id: link.id,
      short_url: link.short_url,    // ← we'll QR-encode this
      amount,
      expires_at: Math.floor(Date.now() / 1000) + 15 * 60,
    })

  } catch (err: any) {
    console.error('Payment link error:', err)
    return NextResponse.json(
      { success: false, error: err?.error?.description || 'Failed to create payment link' },
      { status: 500 }
    )
  }
}
