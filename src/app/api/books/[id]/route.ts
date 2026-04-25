import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabaseAdmin'

export const dynamic = 'force-dynamic'

export async function GET(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  const { data, error } = await supabaseAdmin
    .from('books')
    .select('*')
    .eq('id', params.id)
    .single()

  if (error || !data)
    return NextResponse.json({ success: false, error: 'Book not found' }, { status: 404 })

  return NextResponse.json({ success: true, data })
}
