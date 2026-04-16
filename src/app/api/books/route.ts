import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabaseAdmin'

export const dynamic = 'force-dynamic'

export async function GET() {
  const { data, error } = await supabaseAdmin
    .from('books')
    .select('*')
    .order('created_at', { ascending: false })

  if (error)
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })

  return NextResponse.json(
    { success: true, data },
    { headers: { 'Cache-Control': 'no-store' } }
  )
}

export async function POST(req: NextRequest) {
  const body = await req.json()
  const { title, author, price, stock, image_url, description } = body

  if (!title || !author || !price || stock === undefined)
    return NextResponse.json(
      { success: false, error: 'title, author, price, stock required' },
      { status: 400 }
    )

  const { data, error } = await supabaseAdmin
    .from('books')
    .insert({
      title,
      author,
      price: Number(price),
      stock: Number(stock),
      image_url: image_url || null,
      description: description || null,
    })
    .select()
    .single()

  if (error)
    return NextResponse.json({ success: false, error: 'Failed to add book' }, { status: 500 })

  return NextResponse.json({ success: true, data }, { status: 201 })
}