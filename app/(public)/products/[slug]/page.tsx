import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getProductBySlug, getProducts } from '@/app/actions/products'
import { ProductDetailClient } from '@/components/products/product-detail-client'

interface Props {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const product = await getProductBySlug(slug)
  if (!product) return { title: 'Product Not Found' }

  return {
    title: product.name,
    description: product.description.slice(0, 160),
  }
}

export default async function ProductPage({ params }: Props) {
  const { slug } = await params
  const product = await getProductBySlug(slug)

  if (!product || product.status === 'inactive') {
    notFound()
  }

  const { data: related } = await getProducts({
    category: product.category,
    pageSize: 4,
    status: 'active',
  })

  const relatedFiltered = related.filter((p) => p.id !== product.id).slice(0, 4)

  return <ProductDetailClient product={product} relatedProducts={relatedFiltered} />
}
