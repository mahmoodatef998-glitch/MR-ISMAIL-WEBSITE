'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useLanguage } from '@/hooks/use-language'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Product } from '@/types'
import { parseJsonSafe } from '@/lib/utils'
import { Tag } from 'lucide-react'

interface ProductCardProps {
  product: Product
}

export function ProductCard({ product }: ProductCardProps) {
  const { t, lang } = useLanguage()

  const images = parseJsonSafe<string[]>(product.images as unknown as string, [])
  const firstImage = images[0]

  const displayName = lang === 'ar' && product.nameAr ? product.nameAr : product.name

  return (
    <div className="group bg-white rounded-xl border border-gray-200 hover:border-[#c8a96e] hover:shadow-lg transition-all duration-300 overflow-hidden flex flex-col">
      {/* Image */}
      <Link href={`/products/${product.slug}`} className="relative h-48 bg-gray-50 overflow-hidden flex-shrink-0">
        {firstImage ? (
          <Image
            src={firstImage}
            alt={displayName}
            fill
            className="object-contain p-4 group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200">
            <div className="text-center">
              <Tag className="w-12 h-12 text-gray-300 mx-auto mb-2" />
              <span className="text-xs text-gray-400">No Image</span>
            </div>
          </div>
        )}
        {/* Status badge */}
        {product.status === 'out_of_stock' && (
          <div className="absolute top-2 left-2">
            <Badge variant="destructive" className="text-xs">
              {lang === 'en' ? 'Out of Stock' : 'غير متوفر'}
            </Badge>
          </div>
        )}
        {product.featured && (
          <div className="absolute top-2 right-2">
            <Badge className="text-xs bg-[#c8a96e] text-[#0d1b2a]">
              {lang === 'en' ? 'Featured' : 'مميز'}
            </Badge>
          </div>
        )}
      </Link>

      {/* Content */}
      <div className="p-4 flex flex-col flex-1">
        <div className="flex items-start justify-between gap-2 mb-2">
          <div className="flex-1">
            <span className="text-xs text-gray-400 uppercase tracking-wide">{product.brand}</span>
            <Link href={`/products/${product.slug}`}>
              <h3 className="font-semibold text-[#0d1b2a] hover:text-[#c8a96e] transition-colors text-sm leading-tight mt-0.5 line-clamp-2">
                {displayName}
              </h3>
            </Link>
          </div>
          <Badge variant="secondary" className="text-xs shrink-0">
            {lang === 'ar'
              ? product.category === 'Smartphones' ? 'هاتف' : product.category === 'Accessories' ? 'إكسسوار' : 'قطعة غيار'
              : product.category}
          </Badge>
        </div>

        <div className="mt-auto pt-3 border-t border-gray-100 flex items-center justify-between">
          {/* MOQ */}
          <div className="text-xs text-gray-500">
            <span className="font-semibold text-[#0d1b2a]">{t.products.moq}:</span>{' '}
            <span className="text-[#c8a96e] font-bold">{product.moq}</span>{' '}
            {t.products.units}
          </div>

          <Link href={`/products/${product.slug}`}>
            <Button size="sm" variant="default" className="text-xs h-8 px-3">
              {t.products.requestQuote}
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
