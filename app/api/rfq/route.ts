import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { generateRFQRef } from '@/lib/utils'
import { sendRFQNotificationToAdmin, sendRFQConfirmationToCustomer } from '@/lib/email'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const {
      customerName, company, email, phone,
      country = '', city = '—', product = '', quantity = '', message = '',
    } = body

    if (!customerName || !company || !email || !phone || !country) {
      return NextResponse.json({ success: false, error: 'Missing required fields' }, { status: 400 })
    }

    const refNumber = generateRFQRef()
    const itemsText = product ? `${product}${quantity ? ` × ${quantity}` : ''}` : 'General inquiry'

    const rfq = await prisma.rFQ.create({
      data: {
        refNumber,
        customerName,
        company,
        email,
        phone,
        country,
        city,
        items: JSON.stringify([{ productName: itemsText, productId: 'inquiry', quantity: 1 }]),
        message: message || null,
        status: 'new',
      },
    })

    const emailData = {
      refNumber,
      customerName,
      company,
      email,
      phone,
      country,
      city,
      items: [{ productId: 'inquiry', productName: itemsText, quantity: 1 }],
      message,
    }
    Promise.all([
      sendRFQNotificationToAdmin(emailData).catch(console.error),
      sendRFQConfirmationToCustomer(emailData).catch(console.error),
    ])

    return NextResponse.json({ success: true, refNumber, rfqId: rfq.id })
  } catch (err) {
    console.error('RFQ route error:', err)
    return NextResponse.json({ success: false, error: 'Server error' }, { status: 500 })
  }
}
