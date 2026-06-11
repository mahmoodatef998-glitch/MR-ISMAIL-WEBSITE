import { Suspense } from 'react'
import { Metadata } from 'next'
import { getProducts, getBrands } from '@/app/actions/products'
import { ProductsPageClient } from '@/components/products/products-page-client'

export const metadata: Metadata = {
  title: 'Products - Wholesale Mobile Phones & Accessories',
  description: 'Browse our wholesale catalog of smartphones, accessories and spare parts. Competitive pricing for bulk orders.',
}

interface Props {
  searchParams: Promise<{ category?: string; brand?: string; search?: string; sort?: string; page?: string }>
}

export default async function ProductsPage({ searchParams }: Props) {
  const params = await searchParams
  const page = parseInt(params.page || '1')
  const category = params.category || ''
  const brand = params.brand || ''
  const search = params.search || ''
  const sort = params.sort || 'newest'

  const [{ data: products, total, totalPages }, brands] = await Promise.all([
    getProducts({ page, category, brand, search, sort, pageSize: 12 }),
    getBrands(),
  ])

  return (
    <ProductsPageClient
      products={products}
      brands={brands}
      total={total}
      totalPages={totalPages}
      currentPage={page}
      currentCategory={category}
      currentBrand={brand}
      currentSearch={search}
      currentSort={sort}
    />
  )
}
