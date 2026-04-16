import { NextRequest, NextResponse } from 'next/server'
import { razorpay } from '@/lib/razorpay'

export async function POST(req: NextRequest) {
  const { amount, phone } = await req.json()

  if (!amount || amount < 100)
    return NextResponse.json({ success: false, error: 'Invalid amount' }, { status: 400 })

  const order = await razorpay.orders.create({
    amount,
    currency: 'INR',
    receipt: `rcpt_${phone}_${Date.now()}`,
  })

  return NextResponse.json({ success: true, data: order })
}
