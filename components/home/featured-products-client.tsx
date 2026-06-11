'use client'

import Link from 'next/link'
import { useLanguage } from '@/hooks/use-language'
import { ProductCard } from '@/components/products/product-card'
import { Button } from '@/components/ui/button'
import { Product } from '@/types'
import { ArrowRight } from 'lucide-react'

interface Props {
  products: Product[]
}

export function FeaturedProductsClient({ products }: Props) {
  const { lang } = useLanguage()

  if (products.length === 0) return null

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="flex items-end justify-between mb-10">
          <div>
            <h2 className="text-3xl font-bold text-[#0d1b2a] mb-2">
              {lang === 'en' ? 'Featured Products' : 'المنتجات المميزة'}
            </h2>
            <p className="text-gray-500">
              {lang === 'en'
                ? 'Hand-picked products for wholesale buyers'
                : 'منتجات مختارة لمشتري الجملة'}
            </p>
          </div>
          <Link href="/products">
            <Button variant="outline" className="hidden sm:flex items-center gap-2">
              {lang === 'en' ? 'View All' : 'عرض الكل'}
              <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        <div className="mt-8 text-center sm:hidden">
          <Link href="/products">
            <Button variant="outline">
              {lang === 'en' ? 'View All Products' : 'عرض جميع المنتجات'}
            </Button>
          </Link>
        </div>
      </div>
    </section>
  )
}
