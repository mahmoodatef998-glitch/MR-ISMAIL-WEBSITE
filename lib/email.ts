import nodemailer from 'nodemailer'
import { RFQItem } from '@/types'

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST || 'smtp.gmail.com',
  port: parseInt(process.env.EMAIL_PORT || '587'),
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
})

interface RFQEmailData {
  refNumber: string
  customerName: string
  company: string
  email: string
  phone: string
  country: string
  city: string
  items: RFQItem[]
  message?: string
}

export async function sendRFQNotificationToAdmin(data: RFQEmailData) {
  const itemsHtml = data.items
    .map(
      (item) =>
        `<tr>
          <td style="padding:8px;border:1px solid #ddd;">${item.productName}</td>
          <td style="padding:8px;border:1px solid #ddd;text-align:center;">${item.quantity}</td>
        </tr>`
    )
    .join('')

  const html = `
    <!DOCTYPE html>
    <html>
    <head><meta charset="utf-8"></head>
    <body style="font-family:Arial,sans-serif;background:#f4f4f4;margin:0;padding:20px;">
      <div style="max-width:600px;margin:0 auto;background:#fff;border-radius:8px;overflow:hidden;">
        <div style="background:#0d1b2a;padding:24px;text-align:center;">
          <h1 style="color:#c8a96e;margin:0;font-size:22px;">New RFQ Received</h1>
          <p style="color:#fff;margin:8px 0 0;font-size:14px;">Reference: <strong>${data.refNumber}</strong></p>
        </div>
        <div style="padding:24px;">
          <h2 style="color:#0d1b2a;border-bottom:2px solid #c8a96e;padding-bottom:8px;">Customer Details</h2>
          <table style="width:100%;border-collapse:collapse;">
            <tr><td style="padding:6px 0;color:#666;width:40%;">Name:</td><td style="padding:6px 0;font-weight:bold;">${data.customerName}</td></tr>
            <tr><td style="padding:6px 0;color:#666;">Company:</td><td style="padding:6px 0;font-weight:bold;">${data.company}</td></tr>
            <tr><td style="padding:6px 0;color:#666;">Email:</td><td style="padding:6px 0;"><a href="mailto:${data.email}">${data.email}</a></td></tr>
            <tr><td style="padding:6px 0;color:#666;">Phone:</td><td style="padding:6px 0;">${data.phone}</td></tr>
            <tr><td style="padding:6px 0;color:#666;">Location:</td><td style="padding:6px 0;">${data.city}, ${data.country}</td></tr>
          </table>

          <h2 style="color:#0d1b2a;border-bottom:2px solid #c8a96e;padding-bottom:8px;margin-top:24px;">Requested Products</h2>
          <table style="width:100%;border-collapse:collapse;">
            <thead>
              <tr style="background:#0d1b2a;color:#fff;">
                <th style="padding:10px 8px;text-align:left;border:1px solid #ddd;">Product</th>
                <th style="padding:10px 8px;text-align:center;border:1px solid #ddd;">Quantity</th>
              </tr>
            </thead>
            <tbody>${itemsHtml}</tbody>
          </table>

          ${data.message ? `<h2 style="color:#0d1b2a;border-bottom:2px solid #c8a96e;padding-bottom:8px;margin-top:24px;">Message</h2><p style="color:#444;line-height:1.6;">${data.message}</p>` : ''}

          <div style="margin-top:24px;padding:16px;background:#f8f4ee;border-radius:6px;border-left:4px solid #c8a96e;">
            <p style="margin:0;color:#0d1b2a;font-weight:bold;">Action Required</p>
            <p style="margin:8px 0 0;color:#666;font-size:14px;">Please review this RFQ and respond to the customer within 24 hours.</p>
          </div>
        </div>
        <div style="background:#0d1b2a;padding:16px;text-align:center;">
          <p style="color:#888;margin:0;font-size:12px;">© ${new Date().getFullYear()} Mr. Ismail Trading LLC - Dubai, UAE</p>
        </div>
      </div>
    </body>
    </html>
  `

  await transporter.sendMail({
    from: process.env.EMAIL_FROM,
    to: process.env.ADMIN_EMAIL,
    subject: `New RFQ Received - ${data.refNumber}`,
    html,
  })
}

export async function sendRFQConfirmationToCustomer(data: RFQEmailData) {
  const itemsHtml = data.items
    .map(
      (item) =>
        `<tr>
          <td style="padding:8px;border:1px solid #ddd;">${item.productName}</td>
          <td style="padding:8px;border:1px solid #ddd;text-align:center;">${item.quantity}</td>
        </tr>`
    )
    .join('')

  const html = `
    <!DOCTYPE html>
    <html>
    <head><meta charset="utf-8"></head>
    <body style="font-family:Arial,sans-serif;background:#f4f4f4;margin:0;padding:20px;">
      <div style="max-width:600px;margin:0 auto;background:#fff;border-radius:8px;overflow:hidden;">
        <div style="background:#0d1b2a;padding:24px;text-align:center;">
          <h1 style="color:#c8a96e;margin:0;font-size:22px;">Mr. Ismail Trading LLC</h1>
          <p style="color:#888;margin:4px 0 0;font-size:13px;">Mobile Phones & Accessories - Dubai, UAE</p>
        </div>
        <div style="padding:24px;">
          <h2 style="color:#0d1b2a;">Thank You, ${data.customerName}!</h2>
          <p style="color:#444;line-height:1.6;">We have received your quote request and will get back to you within <strong>24 business hours</strong>.</p>

          <div style="background:#f8f4ee;border:1px solid #c8a96e;border-radius:6px;padding:16px;margin:20px 0;">
            <p style="margin:0;color:#0d1b2a;font-weight:bold;font-size:16px;">Quote Reference: <span style="color:#c8a96e;">${data.refNumber}</span></p>
            <p style="margin:6px 0 0;color:#666;font-size:13px;">Please keep this reference number for your records.</p>
          </div>

          <h3 style="color:#0d1b2a;border-bottom:1px solid #eee;padding-bottom:8px;">Your Requested Items</h3>
          <table style="width:100%;border-collapse:collapse;">
            <thead>
              <tr style="background:#0d1b2a;color:#fff;">
                <th style="padding:10px 8px;text-align:left;border:1px solid #ddd;">Product</th>
                <th style="padding:10px 8px;text-align:center;border:1px solid #ddd;">Quantity</th>
              </tr>
            </thead>
            <tbody>${itemsHtml}</tbody>
          </table>

          <h3 style="color:#0d1b2a;border-bottom:1px solid #eee;padding-bottom:8px;margin-top:24px;">What Happens Next?</h3>
          <ol style="color:#444;line-height:2;">
            <li>Our team will review your request</li>
            <li>We'll prepare a competitive wholesale price quote</li>
            <li>You'll receive a detailed quote within 24 hours</li>
          </ol>

          <div style="margin-top:24px;padding:16px;background:#0d1b2a;border-radius:6px;color:#fff;">
            <p style="margin:0;font-weight:bold;color:#c8a96e;">Contact Us Directly</p>
            <p style="margin:8px 0 4px;font-size:14px;">📧 info@mr-ismail-trading.ae</p>
            <p style="margin:4px 0;font-size:14px;">📞 +971 50 123 4567</p>
            <p style="margin:4px 0;font-size:14px;">💬 WhatsApp: +971 50 123 4567</p>
          </div>
        </div>
        <div style="background:#0d1b2a;padding:16px;text-align:center;">
          <p style="color:#888;margin:0;font-size:12px;">© ${new Date().getFullYear()} Mr. Ismail Trading LLC - Dubai, UAE</p>
        </div>
      </div>
    </body>
    </html>
  `

  await transporter.sendMail({
    from: process.env.EMAIL_FROM,
    to: data.email,
    subject: `Your Quote Request - ${data.refNumber}`,
    html,
  })
}
