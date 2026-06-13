'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useLanguage } from '@/hooks/use-language'
import { Product } from '@/types'
import { Tag, ArrowRight } from 'lucide-react'

interface ProductCardProps {
  product: Product
}

export function ProductCard({ product }: ProductCardProps) {
  const { t, lang } = useLanguage()
  const firstImage = product.images[0]
  const displayName = lang === 'ar' && product.nameAr ? product.nameAr : product.name

  return (
    <div className="group bg-[#0a1628] rounded-2xl border border-white/5 hover:border-[#c8a96e]/30 hover:shadow-xl hover:shadow-[#c8a96e]/5 transition-all duration-300 overflow-hidden flex flex-col">
      {/* Image */}
      <Link href={`/products/${product.slug}`} className="relative h-48 bg-[#050b18] overflow-hidden flex-shrink-0">
        {firstImage ? (
          <Image
            src={firstImage}
            alt={displayName}
            fill
            className="object-contain p-4 group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Tag className="w-12 h-12 text-white/10" />
          </div>
        )}
        {product.featured && (
          <div className="absolute top-3 right-3">
            <span className="px-2 py-1 text-[10px] font-bold bg-[#c8a96e] text-[#050b18] rounded-full uppercase tracking-wide">
              {lang === 'en' ? 'Featured' : 'مميز'}
            </span>
          </div>
        )}
        {product.status === 'out_of_stock' && (
          <div className="absolute top-3 left-3">
            <span className="px-2 py-1 text-[10px] font-bold bg-red-500/90 text-white rounded-full uppercase tracking-wide">
              {lang === 'en' ? 'Out of Stock' : 'غير متوفر'}
            </span>
          </div>
        )}
      </Link>

      {/* Content */}
      <div className="p-4 flex flex-col flex-1">
        <span className="text-[10px] text-[#c8a96e]/70 uppercase tracking-widest font-medium mb-1">{product.brand}</span>
        <Link href={`/products/${product.slug}`}>
          <h3 className="font-semibold text-white hover:text-[#c8a96e] transition-colors text-sm leading-snug line-clamp-2 mb-3">
            {displayName}
          </h3>
        </Link>

        <div className="mt-auto pt-3 border-t border-white/5 flex items-center justify-between">
          <div className="text-xs text-gray-500">
            <span className="text-gray-400">{t.products.moq}:</span>{' '}
            <span className="text-[#c8a96e] font-bold">{product.moq}</span>{' '}
            <span className="text-gray-500">{t.products.units}</span>
          </div>
          <Link
            href={`/products/${product.slug}`}
            className="flex items-center gap-1 text-xs text-[#c8a96e] hover:gap-2 transition-all font-medium"
          >
            {lang === 'en' ? 'Details' : 'التفاصيل'}
            <ArrowRight className="w-3 h-3" />
          </Link>
        </div>
      </div>
    </div>
  )
}
