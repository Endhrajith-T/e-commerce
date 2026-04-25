import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabaseAdmin'
import { isAdminAuthenticated } from '@/lib/auth'

export const dynamic = 'force-dynamic'

export async function GET(req: NextRequest) {
  if (!isAdminAuthenticated(req))
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })

  const { data: orders, error } = await supabaseAdmin
    .from('orders')
    .select('id, status, total_amount, created_at, payment_method')
    .order('created_at', { ascending: false })

  if (error)
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })

  const allOrders = orders || []

  const istOffset = 5.5 * 60 * 60 * 1000
  const now = new Date()
  const istNow = new Date(now.getTime() + istOffset)
  const todayStr = istNow.toISOString().split('T')[0]

  const todayOrders = allOrders.filter((o) => {
    const d = new Date(new Date(o.created_at).getTime() + istOffset)
    return d.toISOString().split('T')[0] === todayStr
  }).length

  const pendingOrders = allOrders.filter((o) => o.status === 'pending').length
  const confirmedOrders = allOrders.filter((o) => o.status === 'confirmed').length
  const shippedOrders = allOrders.filter((o) => o.status === 'shipped').length
  const deliveredOrders = allOrders.filter((o) => o.status === 'delivered').length

  const totalRevenue = allOrders.reduce((sum, o) => sum + (Number(o.total_amount) || 0), 0)

  const weeklyOrders = [0, 0, 0, 0, 0, 0, 0]
  const weeklyRevenue = [0, 0, 0, 0, 0, 0, 0]

  allOrders.forEach((o) => {
    const orderDate = new Date(new Date(o.created_at).getTime() + istOffset)
    const dayOfWeek = orderDate.getDay()
    const idx = dayOfWeek === 0 ? 6 : dayOfWeek - 1
    const diffDays = Math.floor((istNow.getTime() - orderDate.getTime()) / (1000 * 60 * 60 * 24))
    if (diffDays < 7) {
      weeklyOrders[idx]++
      weeklyRevenue[idx] += Number(o.total_amount) || 0
    }
  })

  return NextResponse.json({
    success: true,
    data: {
      totalOrders: allOrders.length,
      todayOrders,
      pendingOrders,
      confirmedOrders,
      shippedOrders,
      deliveredOrders,
      totalRevenue,
      weeklyOrders,
      weeklyRevenue,
    }
  }, { headers: { 'Cache-Control': 'no-store' } })
}
