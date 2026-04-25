import twilio from 'twilio'

// Fix SSL certificate issue on local Windows dev machines
// This is safe — only applies in development, never in production (Vercel)
if (process.env.NODE_ENV === 'development') {
  process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0'
}

function getTwilioClient() {
  const client = twilio(
    process.env.TWILIO_ACCOUNT_SID!,
    process.env.TWILIO_AUTH_TOKEN!
  )
  return client
}

const WHATSAPP_FROM = process.env.TWILIO_WHATSAPP_FROM || 'whatsapp:+14155238886'

function isTwilioConfigured(): boolean {
  return !!(process.env.TWILIO_ACCOUNT_SID && process.env.TWILIO_AUTH_TOKEN)
}

// ─── OTP via WhatsApp (primary) + SMS (fallback) ──────────
export async function sendOtpSms(phone: string, otp: string): Promise<boolean> {
  if (!isTwilioConfigured()) {
    console.log(`[DEV] OTP for ${phone}: ${otp}`)
    return true
  }

  const client = getTwilioClient()
  const to = `+91${phone}`

  const body =
    `🔐 *NareshBookStore OTP*\n\n` +
    `Your verification code is:\n\n` +
    `*${otp}*\n\n` +
    `Valid for *5 minutes*. Do not share this code with anyone.`

  // ── Try WhatsApp first ──
  if (process.env.TWILIO_WHATSAPP_FROM) {
    try {
      await client.messages.create({
        body,
        from: WHATSAPP_FROM,
        to: `whatsapp:${to}`,
      })
      console.log(`✅ OTP sent via WhatsApp to ${phone}`)
      return true
    } catch (err: any) {
      console.warn(`⚠️ WhatsApp OTP failed, trying SMS: ${err?.message}`)
    }
  }

  // ── Fallback: SMS ──
  if (process.env.TWILIO_PHONE_NUMBER) {
    try {
      await client.messages.create({
        body: `Your NareshBookStore OTP is ${otp}. Valid for 5 minutes. Do not share this code.`,
        from: process.env.TWILIO_PHONE_NUMBER!,
        to,
      })
      console.log(`✅ OTP sent via SMS to ${phone}`)
      return true
    } catch (err: any) {
      console.error(`❌ SMS OTP also failed: ${err?.message}`)
      return false
    }
  }

  console.warn('⚠️ No Twilio phone number or WhatsApp configured')
  return false
}

// ─── Order WhatsApp + SMS to Owner ───────────────────────
export async function sendOrderNotificationToOwner(order: {
  customer_name: string
  phone: string
  book_title: string
  quantity: number
  total_amount: number
  payment_method: string
  address: string
  pincode: string
}): Promise<void> {
  const ownerPhone = process.env.OWNER_PHONE
  if (!ownerPhone || !isTwilioConfigured()) {
    console.log('[DEV] New order (notifications skipped):', order.customer_name)
    return
  }

  const body =
    `📦 *NEW ORDER — NareshBookStore!*\n\n` +
    `👤 Customer: ${order.customer_name}\n` +
    `📱 Phone: ${order.phone}\n` +
    `📚 Book: ${order.book_title} ×${order.quantity}\n` +
    `💰 Amount: ₹${order.total_amount}\n` +
    `💳 Payment: ${order.payment_method.toUpperCase()}\n` +
    `📍 Address: ${order.address}, ${order.pincode}`

  const client = getTwilioClient()
  const to = `+91${ownerPhone}`

  // WhatsApp to owner (primary)
  if (process.env.TWILIO_WHATSAPP_FROM) {
    try {
      await client.messages.create({ body, from: WHATSAPP_FROM, to: `whatsapp:${to}` })
      console.log(`✅ Order WhatsApp sent to owner`)
    } catch (err: any) {
      console.error('Owner WhatsApp error:', err?.message || err)
    }
  }

  // SMS to owner (fallback)
  if (process.env.TWILIO_PHONE_NUMBER) {
    try {
      await client.messages.create({ body, from: process.env.TWILIO_PHONE_NUMBER!, to })
      console.log(`✅ Order SMS sent to owner`)
    } catch (err: any) {
      console.error('Owner SMS error:', err?.message || err)
    }
  }
}

// ─── Order Confirmation to Customer via WhatsApp ──────────
export async function sendOrderConfirmationToCustomer(
  phone: string,
  customerName: string,
  bookTitle: string,
  amount: number
): Promise<void> {
  if (!isTwilioConfigured()) {
    console.log(`[DEV] Customer confirmation skipped for ${phone}`)
    return
  }

  const msg =
    `✅ *Order Confirmed — NareshBookStore!*\n\n` +
    `Hi ${customerName}! 👋\n\n` +
    `Your order for *"${bookTitle}"* (₹${amount}) has been placed successfully.\n\n` +
    `📦 Expected delivery: *3–5 business days*\n` +
    `📞 We'll contact you within 24 hours to confirm delivery.\n\n` +
    `Thank you for shopping with us! 🙏`

  const client = getTwilioClient()
  const to = `+91${phone}`

  // WhatsApp to customer (primary)
  if (process.env.TWILIO_WHATSAPP_FROM) {
    try {
      await client.messages.create({ body: msg, from: WHATSAPP_FROM, to: `whatsapp:${to}` })
      console.log(`✅ Confirmation WhatsApp sent to customer`)
    } catch (err: any) {
      console.error('Customer WhatsApp error:', err?.message || err)
    }
  }

  // SMS to customer (fallback)
  if (process.env.TWILIO_PHONE_NUMBER) {
    try {
      await client.messages.create({
        body: `Hi ${customerName}! Your order for "${bookTitle}" (Rs.${amount}) is confirmed at NareshBookStore. Delivery in 3-5 days.`,
        from: process.env.TWILIO_PHONE_NUMBER!,
        to,
      })
      console.log(`✅ Confirmation SMS sent to customer`)
    } catch (err: any) {
      console.error('Customer SMS error:', err?.message || err)
    }
  }
}

// ─── Status Update Notification to Customer ──────────────
const STATUS_MESSAGES: Record<string, (name: string, book: string) => string> = {
  confirmed: (name, book) =>
    `✅ *Order Confirmed — NareshBookStore*\n\n` +
    `Hi ${name}! 👋\n\n` +
    `Your order for *"${book}"* has been *confirmed*.\n\n` +
    `We'll pack it and dispatch soon. 📦\n` +
    `Thank you for shopping with us! 🙏`,

  shipped: (name, book) =>
    `🚚 *Order Shipped — NareshBookStore*\n\n` +
    `Hi ${name}! 👋\n\n` +
    `Great news! Your order for *"${book}"* has been *shipped*.\n\n` +
    `📅 Expected delivery: *3–5 business days*\n` +
    `We'll contact you before delivery. 🙏`,

  delivered: (name, book) =>
    `📦 *Order Delivered — NareshBookStore*\n\n` +
    `Hi ${name}! 👋\n\n` +
    `Your order for *"${book}"* has been *delivered*. ✅\n\n` +
    `Hope you love it! For any issues, reply here.\n` +
    `Thank you for choosing NareshBookStore! 🙏`,
}

export async function sendStatusUpdateToCustomer(
  phone: string,
  customerName: string,
  bookTitle: string,
  newStatus: string
): Promise<void> {
  const messageFn = STATUS_MESSAGES[newStatus]
  if (!messageFn) return // no notification for 'pending'

  if (!isTwilioConfigured()) {
    console.log(`[DEV] Status "${newStatus}" notification skipped for ${phone}`)
    return
  }

  const body = messageFn(customerName, bookTitle)
  const client = getTwilioClient()
  const to = `+91${phone}`

  // WhatsApp (primary)
  if (process.env.TWILIO_WHATSAPP_FROM) {
    try {
      await client.messages.create({ body, from: WHATSAPP_FROM, to: `whatsapp:${to}` })
      console.log(`✅ Status "${newStatus}" WhatsApp sent to ${phone}`)
    } catch (err: any) {
      console.error(`WhatsApp status notify failed: ${err?.message}`)
    }
  }

  // SMS fallback
  if (process.env.TWILIO_PHONE_NUMBER) {
    const smsBody = `NareshBookStore: Your order for "${bookTitle}" is now ${newStatus}. ${newStatus === 'shipped' ? 'Expected delivery: 3-5 days.' : ''}`
    try {
      await client.messages.create({ body: smsBody, from: process.env.TWILIO_PHONE_NUMBER!, to })
      console.log(`✅ Status "${newStatus}" SMS sent to ${phone}`)
    } catch (err: any) {
      console.error(`SMS status notify failed: ${err?.message}`)
    }
  }
}
