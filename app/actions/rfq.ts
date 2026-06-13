'use server'

import { prisma } from '@/lib/db'
import { rfqSchema } from '@/lib/validations'
import { generateRFQRef } from '@/lib/utils'
import { sendRFQNotificationToAdmin, sendRFQConfirmationToCustomer } from '@/lib/email'
import { RFQItem } from '@/types'

export async function submitRFQ(data: unknown) {
  const parsed = rfqSchema.safeParse(data)

  if (!parsed.success) {
    return {
      success: false,
      error: parsed.error.issues[0]?.message || 'Validation failed',
    }
  }

  const { customerName, company, email, phone, country, city, items, message } =
    parsed.data

  const refNumber = generateRFQRef()

  try {
    const rfq = await prisma.rFQ.create({
      data: {
        refNumber,
        customerName,
        company,
        email,
        phone,
        country,
        city,
        items: JSON.stringify(items),
        message: message || null,
        status: 'new',
      },
    })

    // Send emails (non-blocking - don't fail if email fails)
    const emailData = { refNumber, customerName, company, email, phone, country, city, items, message }

    Promise.all([
      sendRFQNotificationToAdmin(emailData).catch(console.error),
      sendRFQConfirmationToCustomer(emailData).catch(console.error),
    ])

    return { success: true, refNumber, rfqId: rfq.id }
  } catch (error) {
    console.error('RFQ submission error:', error)
    return { success: false, error: 'Failed to submit RFQ. Please try again.' }
  }
}

export async function getRFQs(page = 1, pageSize = 20, status?: string, search?: string) {
  const skip = (page - 1) * pageSize

  const where: Record<string, unknown> = {}
  if (status && status !== 'all') where.status = status
  if (search) {
    where.OR = [
      { customerName: { contains: search } },
      { company: { contains: search } },
      { refNumber: { contains: search } },
      { email: { contains: search } },
    ]
  }

  const [rfqs, total] = await Promise.all([
    prisma.rFQ.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      skip,
      take: pageSize,
    }),
    prisma.rFQ.count({ where }),
  ])

  return {
    data: rfqs.map((r) => ({
      ...r,
      message: r.message ?? undefined,
      notes: r.notes ?? undefined,
      confirmedProductId: r.confirmedProductId ?? undefined,
      confirmedQty: r.confirmedQty ?? undefined,
      status: r.status as 'new' | 'in_review' | 'quoted' | 'closed',
      items: JSON.parse(r.items) as RFQItem[],
    })),
    total,
    page,
    pageSize,
    totalPages: Math.ceil(total / pageSize),
  }
}

export async function updateRFQStatus(id: string, status: string, notes?: string) {
  return prisma.rFQ.update({
    where: { id },
    data: { status, notes: notes || undefined, updatedAt: new Date() },
  })
}
