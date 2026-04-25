import twilio from 'twilio'

function getTwilioClient() {
  return twilio(
    process.env.TWILIO_ACCOUNT_SID!,
    process.env.TWILIO_AUTH_TOKEN!
  )
}

const WHATSAPP_FROM = process.env.TWILIO_WHATSAPP_FROM || 'whatsapp:+14155238886'

// ─── OTP SMS to Customer ──────────────────────────────────
export async function sendOtpSms(phone: string, otp: string): Promise<boolean> {
  if (!process.env.TWILIO_ACCOUNT_SID || !process.env.TWILIO_PHONE_NUMBER) {
    console.log(`[DEV] OTP for ${phone}: ${otp}`)
    return true
  }

  try {
    const client = getTwilioClient()
    await client.messages.create({
      body: `Your NareshBookStore OTP is ${otp}. Valid for 5 minutes. Do not share this code.`,
      from: process.env.TWILIO_PHONE_NUMBER!,
      to: `+91${phone}`,
    })
    return true
  } catch (err: any) {
    console.error('OTP SMS error:', err?.message || err)
    return false
  }
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
  if (!ownerPhone || !process.env.TWILIO_ACCOUNT_SID) {
    console.log('[DEV] New order (notifications skipped):', order.customer_name)
    return
  }

  const body =
    `📦 NEW ORDER — NareshBookStore!\n` +
    `Customer: ${order.customer_name}\n` +
    `Phone: ${order.phone}\n` +
    `Book: ${order.book_title} ×${order.quantity}\n` +
    `Amount: ₹${order.total_amount}\n` +
    `Payment: ${order.payment_method.toUpperCase()}\n` +
    `Address: ${order.address}, ${order.pincode}`

  const client = getTwilioClient()
  const to = `+91${ownerPhone}`

  try {
    await client.messages.create({
      body,
      from: process.env.TWILIO_PHONE_NUMBER!,
      to,
    })
    console.log(`✅ Order SMS sent to owner`)
  } catch (err: any) {
    console.error('Owner SMS error:', err?.message || err)
  }

  // WhatsApp to owner
  if (process.env.TWILIO_WHATSAPP_FROM) {
    try {
      await client.messages.create({
        body,
        from: WHATSAPP_FROM,
        to: `whatsapp:${to}`,
      })
      console.log(`✅ Order WhatsApp sent to owner`)
    } catch (err: any) {
      console.error('Owner WhatsApp error:', err?.message || err)
    }
  }
}

// ─── Order Confirmation to Customer (WhatsApp + SMS) ─────
export async function sendOrderConfirmationToCustomer(
  phone: string,
  customerName: string,
  bookTitle: string,
  amount: number
): Promise<void> {
  const msg =
    `Hi ${customerName}! ✅ Your order for "${bookTitle}" (₹${amount}) is placed successfully at NareshBookStore. ` +
    `We will contact you within 24 hours to confirm delivery. Track your order at our website.`

  if (!process.env.TWILIO_ACCOUNT_SID || !process.env.TWILIO_PHONE_NUMBER) {
    console.log(`[DEV] Customer confirmation for ${phone}:`, msg)
    return
  }

  const client = getTwilioClient()
  const to = `+91${phone}`

  try {
    await client.messages.create({
      body: msg,
      from: process.env.TWILIO_PHONE_NUMBER!,
      to,
    })
    console.log(`✅ Confirmation SMS sent to customer`)
  } catch (err: any) {
    console.error('Customer SMS error:', err?.message || err)
  }

  // WhatsApp to customer
  if (process.env.TWILIO_WHATSAPP_FROM) {
    try {
      await client.messages.create({
        body: msg,
        from: WHATSAPP_FROM,
        to: `whatsapp:${to}`,
      })
      console.log(`✅ Confirmation WhatsApp sent to customer`)
    } catch (err: any) {
      console.error('Customer WhatsApp error:', err?.message || err)
    }
  }
}
