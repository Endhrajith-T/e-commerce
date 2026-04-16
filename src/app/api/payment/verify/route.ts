import { NextRequest, NextResponse } from 'next/server'
import { verifyRazorpaySignature } from '@/lib/razorpay'

export async function POST(req: NextRequest) {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = await req.json()

  if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature)
    return NextResponse.json({ success: false, error: 'Missing payment details' }, { status: 400 })

  const isValid = verifyRazorpaySignature(razorpay_order_id, razorpay_payment_id, razorpay_signature)

  if (!isValid)
    return NextResponse.json({ success: false, error: 'Invalid payment signature' }, { status: 400 })

  return NextResponse.json({ success: true, message: 'Payment verified' })
}
