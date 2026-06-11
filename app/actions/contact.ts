'use server'

import { contactSchema } from '@/lib/validations'
import nodemailer from 'nodemailer'

export async function submitContact(data: unknown) {
  const parsed = contactSchema.safeParse(data)

  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0]?.message }
  }

  const { name, email, phone, subject, message } = parsed.data

  try {
    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: parseInt(process.env.EMAIL_PORT || '587'),
      secure: false,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    })

    await transporter.sendMail({
      from: process.env.EMAIL_FROM,
      to: process.env.ADMIN_EMAIL,
      subject: `Contact Form: ${subject}`,
      html: `
        <h2>New Contact Form Submission</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Phone:</strong> ${phone || 'N/A'}</p>
        <p><strong>Subject:</strong> ${subject}</p>
        <p><strong>Message:</strong></p>
        <p>${message}</p>
      `,
    })

    return { success: true }
  } catch (error) {
    console.error('Contact form error:', error)
    return { success: false, error: 'Failed to send message. Please try again.' }
  }
}
