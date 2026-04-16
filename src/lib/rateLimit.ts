import { supabaseAdmin } from '@/lib/supabaseAdmin'

export async function checkRateLimit(phone: string): Promise<boolean> {
  try {
    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000).toISOString()

    const { count } = await supabaseAdmin
      .from('otp_logs')
      .select('*', { count: 'exact', head: true })
      .eq('phone', phone)
      .gte('created_at', oneHourAgo)

    // Max 3 OTPs per hour
    if ((count || 0) >= 3) return false

    return true
  } catch (err) {
    console.error('Rate limit check error:', err)
    return true // Allow if check fails
  }
}