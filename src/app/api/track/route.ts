import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabaseAdmin'

export async function POST(req: NextRequest) {
  const body = await req.json()
  const { phone } = body

  if (!phone || !/^\d{10}$/.test(phone))
    return NextResponse.json({ success: false, error: 'Valid 10-digit phone required' }, { status: 400 })

  const { data, error } = await supabaseAdmin
    .from('orders')
    .select('*, books(title, author, image_url, price)')
    .eq('phone', phone)
    .order('created_at', { ascending: false })

  if (error)
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })

  return NextResponse.json({ success: true, data: data || [] })
}
