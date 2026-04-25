import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabaseAdmin'
import { isAdminAuthenticated } from '@/lib/auth'
import { sendStatusUpdateToCustomer } from '@/lib/msg91'

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  if (!isAdminAuthenticated(req))
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })

  try {
    const { status } = await req.json()

    // Fetch order details to get customer phone, name, book
    const { data: order, error } = await supabaseAdmin
      .from('orders')
      .select('customer_name, phone, books(title)')
      .eq('id', params.id)
      .single()

    if (error || !order)
      return NextResponse.json({ success: false, error: 'Order not found' }, { status: 404 })

    const bookTitle = (order.books as any)?.title || 'your book'

    // Fire WhatsApp notification (non-blocking)
    sendStatusUpdateToCustomer(order.phone, order.customer_name, bookTitle, status)
      .catch((err) => console.error('Notify error:', err))

    return NextResponse.json({ success: true })

  } catch (err) {
    console.error('Notify route error:', err)
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 })
  }
}
