import { notFound } from 'next/navigation'
import { prisma } from '@/lib/db'
import { RFQDetailClient } from '@/components/admin/rfq-detail-client'
import { RFQItem } from '@/types'

interface Props {
  params: Promise<{ id: string }>
}

export default async function RFQDetailPage({ params }: Props) {
  const { id } = await params
  const rfq = await prisma.rFQ.findUnique({ where: { id } })

  if (!rfq) notFound()

  const rfqData = {
    ...rfq,
    message: rfq.message ?? undefined,
    notes: rfq.notes ?? undefined,
    status: rfq.status as 'new' | 'in_review' | 'quoted' | 'closed',
    items: JSON.parse(rfq.items) as RFQItem[],
  }

  return <RFQDetailClient rfq={rfqData} />
}
