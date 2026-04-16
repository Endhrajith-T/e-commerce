import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabaseAdmin'

export const dynamic = 'force-dynamic'

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await req.json()
    const { status } = body

    const validStatuses = ['pending', 'confirmed', 'shipped', 'delivered']
    if (!status || !validStatuses.includes(status))
      return NextResponse.json(
        { success: false, error: 'Invalid status' },
        { status: 400 }
      )

    const { data, error } = await supabaseAdmin
      .from('orders')
      .update({ status })
      .eq('id', params.id)
      .select()
      .single()

    if (error)
      return NextResponse.json(
        { success: false, error: 'Failed to update order' },
        { status: 500 }
      )

    return NextResponse.json({ success: true, data })

  } catch (err: any) {
    console.error('Order update error:', err)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}