import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabaseAdmin'
import { isAdminAuthenticated } from '@/lib/auth'

export const dynamic = 'force-dynamic'

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  if (!isAdminAuthenticated(req))
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })

  const body = await req.json()
  const { title, author, price, stock, image_url, description } = body

  const updates: Record<string, unknown> = {}
  if (title !== undefined) updates.title = title
  if (author !== undefined) updates.author = author
  if (price !== undefined) updates.price = price
  if (stock !== undefined) updates.stock = stock
  if (image_url !== undefined) updates.image_url = image_url
  if (description !== undefined) updates.description = description

  if (Object.keys(updates).length === 0)
    return NextResponse.json({ success: false, error: 'No fields to update' }, { status: 400 })

  const { data, error } = await supabaseAdmin
    .from('books')
    .update(updates)
    .eq('id', params.id)
    .select()
    .single()

  if (error)
    return NextResponse.json({ success: false, error: 'Failed to update book' }, { status: 500 })

  return NextResponse.json({ success: true, data })
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  if (!isAdminAuthenticated(req))
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })

  try {
    const { data: orders } = await supabaseAdmin
      .from('orders')
      .select('id')
      .eq('book_id', params.id)
      .limit(1)

    if (orders && orders.length > 0) {
      const { error } = await supabaseAdmin
        .from('books')
        .update({ stock: 0 })
        .eq('id', params.id)

      if (error)
        return NextResponse.json({ success: false, error: 'Failed to update stock' }, { status: 500 })

      return NextResponse.json({ success: true, message: 'Book marked as out of stock' })
    }

    const { error } = await supabaseAdmin
      .from('books')
      .delete()
      .eq('id', params.id)

    if (error)
      return NextResponse.json({ success: false, error: 'Failed to delete book' }, { status: 500 })

    return NextResponse.json({ success: true, message: 'Book deleted successfully' })

  } catch (err) {
    console.error('Delete error:', err)
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 })
  }
}
