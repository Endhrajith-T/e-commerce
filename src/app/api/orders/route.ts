import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabaseAdmin'
import { sendOrderNotificationToOwner, sendOrderConfirmationToCustomer } from '@/lib/msg91'
import { sendOrderConfirmationEmail, sendNewOrderAlertToAdmin } from '@/lib/email'

export const dynamic = 'force-dynamic'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { name, phone, address, pincode, cart, payment_method, razorpay_order_id, razorpay_payment_id } = body

    if (!name || !phone || !address || !pincode || !cart?.length || !payment_method)
      return NextResponse.json({ success: false, error: 'Missing required fields' }, { status: 400 })

    if (!/^\d{10}$/.test(phone))
      return NextResponse.json({ success: false, error: 'Invalid phone number' }, { status: 400 })

    if (!['cod', 'razorpay'].includes(payment_method))
      return NextResponse.json({ success: false, error: 'Invalid payment method' }, { status: 400 })

    const orders = cart.map((item: any) => ({
      customer_name: name,
      phone,
      address,
      pincode,
      book_id: item.id,
      quantity: item.qty,
      total_amount: item.price * item.qty,
      payment_method,
      payment_status: payment_method === 'razorpay' ? 'paid' : 'pending',
      razorpay_order_id: razorpay_order_id || null,
      razorpay_payment_id: razorpay_payment_id || null,
      status: 'pending',
      is_verified: true,
    }))

    const { data, error } = await supabaseAdmin
      .from('orders')
      .insert(orders)
      .select()

    if (error) {
      console.error('Order insert error:', error)
      return NextResponse.json({ success: false, error: 'Failed to create order' }, { status: 500 })
    }

    // Fire-and-forget notifications (don't block the response)
    const totalAmount = cart.reduce((sum: number, item: any) => sum + item.price * item.qty, 0)
    const bookTitles = cart.map((item: any) => item.title).join(', ')
    const firstItem = cart[0]

    void Promise.allSettled([
      // Owner: SMS + WhatsApp
      sendOrderNotificationToOwner({
        customer_name: name,
        phone,
        book_title: bookTitles,
        quantity: cart.reduce((sum: number, i: any) => sum + i.qty, 0),
        total_amount: totalAmount,
        payment_method,
        address,
        pincode,
      }),
      // Customer: SMS + WhatsApp
      sendOrderConfirmationToCustomer(phone, name, bookTitles, totalAmount),
      // Owner: Email
      sendNewOrderAlertToAdmin({
        customerName: name,
        phone,
        bookTitle: bookTitles,
        quantity: cart.reduce((sum: number, i: any) => sum + i.qty, 0),
        totalAmount,
        paymentMethod: payment_method,
        address,
        pincode,
      }),
      // Customer: Email (only if email provided)
      ...(body.email
        ? [sendOrderConfirmationEmail({
            toEmail: body.email,
            customerName: name,
            bookTitle: firstItem?.title || bookTitles,
            quantity: firstItem?.qty || 1,
            totalAmount,
            paymentMethod: payment_method,
            address,
            pincode,
          })]
        : []),
    ])

    return NextResponse.json({ success: true, data }, { status: 201 })

  } catch (err) {
    console.error('Order creation error:', err)
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 })
  }
}
