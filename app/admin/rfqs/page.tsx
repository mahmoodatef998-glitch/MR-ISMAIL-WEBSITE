import { getRFQs } from '@/app/actions/rfq'
import { AdminRFQsClient } from '@/components/admin/admin-rfqs-client'

interface Props {
  searchParams: Promise<{ page?: string; status?: string; search?: string }>
}

export default async function AdminRFQsPage({ searchParams }: Props) {
  const params = await searchParams
  const page = parseInt(params.page || '1')
  const status = params.status || ''
  const search = params.search || ''

  const { data: rfqs, total, totalPages } = await getRFQs(page, 15, status, search)

  return (
    <AdminRFQsClient
      rfqs={rfqs}
      total={total}
      totalPages={totalPages}
      currentPage={page}
      currentStatus={status}
      currentSearch={search}
    />
  )
}
