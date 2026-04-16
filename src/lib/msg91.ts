import twilio from 'twilio'

// ─── Helper ───────────────────────────────────────────────
function getTwilioClient() {
  return twilio(
    process.env.TWILIO_ACCOUNT_SID!,
    process.env.TWILIO_AUTH_TOKEN!
  )
}

// ─── OTP SMS to Customer ──────────────────────────────────
export async function sendOtpSms(phone: string, otp: string): Promise<boolean> {
  // Always log for dev
  console.log(`\n📱 OTP for ${phone}: ${otp}\n`)

  // Twilio SMS — uncomment for production
  // try {
  //   process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0'
  //   const client = getTwilioClient()
  //   await client.messages.create({
  //     body: `Your NareshBookStore OTP is ${otp}. Valid for 5 minutes. Do not share.`,
  //     from: process.env.TWILIO_PHONE_NUMBER!,
  //     to: `+91${phone}`,
  //   })
  //   console.log(`✅ OTP SMS sent to ${phone}`)
  // } catch (err) {
  //   console.error('OTP SMS error:', err)
  // }

  return true
}

// ─── Order SMS to Owner ───────────────────────────────────
export async function sendOrderNotificationSms(order: {
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

  const smsBody =
    `📦 NEW ORDER - NareshBookStore!\n` +
    `Customer: ${order.customer_name}\n` +
    `Phone: ${order.phone}\n` +
    `Book: ${order.book_title} x${order.quantity}\n` +
    `Amount: Rs.${order.total_amount}\n` +
    `Payment: ${order.payment_method.toUpperCase()}\n` +
    `Address: ${order.address}, ${order.pincode}`

  // Console log always
  console.log(`\n${smsBody}\n`)

  if (!ownerPhone) {
    console.warn('⚠️ OWNER_PHONE not set in .env.local')
    return
  }

  try {
    process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0'
    const client = getTwilioClient()

    // ── Send SMS to Owner ──
    await client.messages.create({
      body: smsBody,
      from: process.env.TWILIO_PHONE_NUMBER!,
      to: `+91${ownerPhone}`,
    })
    console.log(`✅ Order SMS sent to owner: ${ownerPhone}`)

    // ── Send WhatsApp to Owner ──
    // Twilio WhatsApp Sandbox: enable at twilio.com/console/sms/whatsapp/sandbox
    // 1. Go to twilio.com/console/sms/whatsapp/sandbox
    // 2. Send "join <your-sandbox-word>" from your WhatsApp to +14155238886
    // 3. Uncomment below:

    // await client.messages.create({
    //   body: smsBody,
    //   from: 'whatsapp:+14155238886',  // Twilio Sandbox number
    //   to: `whatsapp:+91${ownerPhone}`,
    // })
    // console.log(`✅ Order WhatsApp sent to owner: ${ownerPhone}`)

  } catch (err: any) {
    console.error('❌ Notification error:', err?.message || err)
  }
}

// ─── Order Confirmation SMS to Customer ──────────────────
export async function sendOrderConfirmationToCustomer(
  phone: string,
  customerName: string,
  bookTitle: string,
  amount: number
): Promise<void> {
  const msg =
    `Hi ${customerName}! Your order for "${bookTitle}" (Rs.${amount}) has been placed successfully at NareshBookStore. ` +
    `We will contact you within 24 hours to confirm delivery. Thank you!`

  console.log(`\n📩 Customer confirmation for ${phone}: ${msg}\n`)

  // Uncomment for production:
  // try {
  //   process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0'
  //   const client = getTwilioClient()
  //   await client.messages.create({
  //     body: msg,
  //     from: process.env.TWILIO_PHONE_NUMBER!,
  //     to: `+91${phone}`,
  //   })
  //   console.log(`✅ Confirmation SMS sent to customer: ${phone}`)
  // } catch (err: any) {
  //   console.error('Customer SMS error:', err?.message || err)
  // }
}
