import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabaseAdmin'

export async function GET() {
  const { data: orders, error } = await supabaseAdmin
    .from('orders')
    .select('id, status, total_amount, created_at, payment_method')
    .order('created_at', { ascending: false })

  if (error)
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })

  const allOrders = orders || []

  // IST timezone
  const istOffset = 5.5 * 60 * 60 * 1000
  const now = new Date()
  const istNow = new Date(now.getTime() + istOffset)
  const todayStr = istNow.toISOString().split('T')[0]

  // Today's orders
  const todayOrders = allOrders.filter((o) => {
    const d = new Date(new Date(o.created_at).getTime() + istOffset)
    return d.toISOString().split('T')[0] === todayStr
  }).length

  // Status breakdown
  const pendingOrders = allOrders.filter((o) => o.status === 'pending').length
  const confirmedOrders = allOrders.filter((o) => o.status === 'confirmed').length
  const shippedOrders = allOrders.filter((o) => o.status === 'shipped').length
  const deliveredOrders = allOrders.filter((o) => o.status === 'delivered').length

  // Total revenue
  const totalRevenue = allOrders.reduce((sum, o) => sum + (Number(o.total_amount) || 0), 0)

  // Weekly orders (last 7 days — Mon to Sun)
  const weeklyOrders = [0, 0, 0, 0, 0, 0, 0]
  const weeklyRevenue = [0, 0, 0, 0, 0, 0, 0]

  allOrders.forEach((o) => {
    const orderDate = new Date(new Date(o.created_at).getTime() + istOffset)
    const dayOfWeek = orderDate.getDay() // 0=Sun, 1=Mon...6=Sat
    const idx = dayOfWeek === 0 ? 6 : dayOfWeek - 1 // Mon=0, Sun=6
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
