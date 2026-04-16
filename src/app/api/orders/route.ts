import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabaseAdmin'

export const dynamic = 'force-dynamic'

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const status = searchParams.get('status')
  const page = parseInt(searchParams.get('page') ?? '1')
  const limit = 20
  const from = (page - 1) * limit
  const to = from + limit - 1

  let query = supabaseAdmin
    .from('orders')
    .select('*, books(title, author)', { count: 'exact' })
    .order('created_at', { ascending: false })
    .range(from, to)

  if (status && status !== 'all' && ['pending', 'confirmed', 'shipped', 'delivered'].includes(status)) {
    query = query.eq('status', status)
  }

  const { data, error, count } = await query

  if (error)
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })

  return NextResponse.json(
    { success: true, data: data || [], total: count || 0, page, limit },
    { headers: { 'Cache-Control': 'no-store' } }
  )
}