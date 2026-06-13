import { notFound } from 'next/navigation'
import { prisma } from '@/lib/db'
import { RFQDetailClient } from '@/components/admin/rfq-detail-client'
import { RFQItem } from '@/types'

interface Props {
  params: Promise<{ id: string }>
}

export default async function RFQDetailPage({ params }: Props) {
  const { id } = await params

  const [rfq, products] = await Promise.all([
    prisma.rFQ.findUnique({ where: { id } }),
    prisma.product.findMany({
      where: { status: 'active' },
      select: { id: true, name: true, brand: true, stock: true },
      orderBy: { name: 'asc' },
    }),
  ])

  if (!rfq) notFound()

  const rfqData = {
    ...rfq,
    message: rfq.message ?? undefined,
    notes: rfq.notes ?? undefined,
    confirmedProductId: rfq.confirmedProductId ?? undefined,
    confirmedQty: rfq.confirmedQty ?? undefined,
    status: rfq.status as 'new' | 'in_review' | 'quoted' | 'closed',
    items: JSON.parse(rfq.items) as RFQItem[],
  }

  return <RFQDetailClient rfq={rfqData} products={products} />
}
