import Link from 'next/link'
import { getProducts } from '@/app/actions/products'
import { AdminProductsClient } from '@/components/admin/admin-products-client'

interface Props {
  searchParams: Promise<{ page?: string; search?: string; category?: string; status?: string }>
}

export default async function AdminProductsPage({ searchParams }: Props) {
  const params = await searchParams
  const page = parseInt(params.page || '1')
  const search = params.search || ''
  const category = params.category || ''
  const status = params.status || 'all'

  const { data: products, total, totalPages } = await getProducts({
    page,
    search,
    category,
    status,
    pageSize: 15,
  })

  return (
    <AdminProductsClient
      products={products}
      total={total}
      totalPages={totalPages}
      currentPage={page}
      currentSearch={search}
      currentCategory={category}
      currentStatus={status}
    />
  )
}
