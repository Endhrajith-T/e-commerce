import nodemailer from 'nodemailer'

function getTransporter() {
  return nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.GMAIL_USER!,
      pass: process.env.GMAIL_APP_PASSWORD!,
    },
  })
}

function isEmailConfigured(): boolean {
  return !!(process.env.GMAIL_USER && process.env.GMAIL_APP_PASSWORD)
}

// ─── Order Confirmation to Customer ──────────────────────
export async function sendOrderConfirmationEmail(opts: {
  toEmail: string
  customerName: string
  bookTitle: string
  quantity: number
  totalAmount: number
  paymentMethod: string
  address: string
  pincode: string
}): Promise<void> {
  if (!isEmailConfigured()) {
    console.log('[DEV] Email not configured — skipping customer confirmation')
    return
  }

  const payLabel = opts.paymentMethod === 'razorpay' ? 'Paid Online (Razorpay)' : 'Cash on Delivery'

  const html = `
    <div style="font-family:Georgia,serif;max-width:520px;margin:0 auto;background:#f7f0e0;padding:32px;border-radius:12px">
      <h2 style="color:#2E1E0F;margin-bottom:4px">Order Confirmed! 🎉</h2>
      <p style="color:#9A7230;font-size:13px;margin-bottom:24px">Thank you for shopping with NareshBookStore</p>

      <div style="background:#fdfaf3;border:1px solid #e5d9c5;border-radius:10px;padding:20px;margin-bottom:16px">
        <p style="font-size:11px;letter-spacing:0.15em;text-transform:uppercase;color:#9A7230;margin-bottom:12px">Order Summary</p>
        <table style="width:100%;border-collapse:collapse">
          <tr><td style="padding:6px 0;color:#555">Book</td><td style="padding:6px 0;font-weight:700;color:#2E1E0F;text-align:right">${opts.bookTitle}</td></tr>
          <tr><td style="padding:6px 0;color:#555">Qty</td><td style="padding:6px 0;font-weight:700;color:#2E1E0F;text-align:right">${opts.quantity}</td></tr>
          <tr><td style="padding:6px 0;color:#555">Amount</td><td style="padding:6px 0;font-weight:700;color:#9A7230;text-align:right">₹${opts.totalAmount.toLocaleString('en-IN')}</td></tr>
          <tr><td style="padding:6px 0;color:#555">Payment</td><td style="padding:6px 0;font-weight:700;color:#2E1E0F;text-align:right">${payLabel}</td></tr>
          <tr><td style="padding:6px 0;color:#555">Deliver to</td><td style="padding:6px 0;color:#2E1E0F;text-align:right">${opts.address}, ${opts.pincode}</td></tr>
        </table>
      </div>

      <div style="background:#f0fdf4;border:1px solid #bbf7d0;border-radius:8px;padding:14px;font-size:13px;color:#166534;margin-bottom:16px">
        📦 Expected delivery in <strong>3-5 business days</strong>. We'll contact you within 24 hours to confirm.
      </div>

      <p style="color:#888;font-size:12px;text-align:center">NareshBookStore — Quality Books for Every Student</p>
    </div>
  `

  try {
    await getTransporter().sendMail({
      from: `"NareshBookStore" <${process.env.GMAIL_USER}>`,
      to: opts.toEmail,
      subject: `Order Confirmed — ${opts.bookTitle}`,
      html,
    })
    console.log(`✅ Confirmation email sent to ${opts.toEmail}`)
  } catch (err: any) {
    console.error('Customer email error:', err?.message || err)
  }
}

// ─── New Order Alert to Admin ─────────────────────────────
export async function sendNewOrderAlertToAdmin(opts: {
  customerName: string
  phone: string
  bookTitle: string
  quantity: number
  totalAmount: number
  paymentMethod: string
  address: string
  pincode: string
}): Promise<void> {
  const adminEmail = process.env.ADMIN_EMAIL
  if (!adminEmail || !isEmailConfigured()) {
    console.log('[DEV] Admin email not configured — skipping admin alert')
    return
  }

  const payLabel = opts.paymentMethod === 'razorpay' ? '💳 Razorpay (Paid)' : '💵 Cash on Delivery'

  const html = `
    <div style="font-family:Georgia,serif;max-width:520px;margin:0 auto;background:#fff;padding:32px;border-radius:12px;border:2px solid #2E1E0F">
      <h2 style="color:#2E1E0F;margin-bottom:4px">📦 New Order Received!</h2>
      <p style="color:#9A7230;font-size:13px;margin-bottom:24px">${new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })} IST</p>

      <table style="width:100%;border-collapse:collapse;font-size:14px">
        <tr style="border-bottom:1px solid #f0e7da"><td style="padding:10px 0;color:#555">Customer</td><td style="padding:10px 0;font-weight:700;color:#2E1E0F">${opts.customerName}</td></tr>
        <tr style="border-bottom:1px solid #f0e7da"><td style="padding:10px 0;color:#555">Phone</td><td style="padding:10px 0;font-weight:700;color:#2E1E0F">${opts.phone}</td></tr>
        <tr style="border-bottom:1px solid #f0e7da"><td style="padding:10px 0;color:#555">Book</td><td style="padding:10px 0;font-weight:700;color:#2E1E0F">${opts.bookTitle} ×${opts.quantity}</td></tr>
        <tr style="border-bottom:1px solid #f0e7da"><td style="padding:10px 0;color:#555">Amount</td><td style="padding:10px 0;font-weight:800;color:#9A7230;font-size:16px">₹${opts.totalAmount.toLocaleString('en-IN')}</td></tr>
        <tr style="border-bottom:1px solid #f0e7da"><td style="padding:10px 0;color:#555">Payment</td><td style="padding:10px 0;font-weight:700;color:#2E1E0F">${payLabel}</td></tr>
        <tr><td style="padding:10px 0;color:#555">Address</td><td style="padding:10px 0;color:#2E1E0F">${opts.address}, ${opts.pincode}</td></tr>
      </table>

      <div style="margin-top:20px;text-align:center">
        <a href="${process.env.NEXT_PUBLIC_SITE_URL || ''}/admin/dashboard" style="background:#2E1E0F;color:white;padding:12px 28px;border-radius:8px;text-decoration:none;font-weight:700;font-size:14px">
          View in Dashboard →
        </a>
      </div>
    </div>
  `

  try {
    await getTransporter().sendMail({
      from: `"NareshBookStore Orders" <${process.env.GMAIL_USER}>`,
      to: adminEmail,
      subject: `🛒 New Order: ${opts.bookTitle} — ₹${opts.totalAmount}`,
      html,
    })
    console.log(`✅ Admin alert email sent`)
  } catch (err: any) {
    console.error('Admin email error:', err?.message || err)
  }
}
