export const dynamic = 'force-dynamic'
import { NextRequest, NextResponse } from 'next/server'
import { razorpay } from '@/lib/razorpay'

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const linkId = searchParams.get('link_id')

    if (!linkId)
      return NextResponse.json({ success: false, error: 'link_id required' }, { status: 400 })

    const link = await razorpay.paymentLink.fetch(linkId) as any

    // paid
    if (link.status === 'paid') {
      const paymentId = link.payments?.[0]?.payment_id || null
      return NextResponse.json({ success: true, paid: true, payment_id: paymentId })
    }

    // expired / cancelled
    if (link.status === 'expired' || link.status === 'cancelled') {
      return NextResponse.json({ success: true, paid: false, expired: true })
    }

    // still active — waiting
    return NextResponse.json({ success: true, paid: false, expired: false })

  } catch (err: any) {
    console.error('QR status error:', err)
    return NextResponse.json({ success: false, error: 'Failed to check status' }, { status: 500 })
  }
}
