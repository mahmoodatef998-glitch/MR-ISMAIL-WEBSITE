'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useLanguage } from '@/hooks/use-language'
import { Product } from '@/types'
import { Tag, ArrowUpRight, ArrowRight } from 'lucide-react'

interface Props {
  products: Product[]
}

const CATS = [
  { key: 'All',         en: 'All Products',  ar: 'كل المنتجات' },
  { key: 'Smartphones', en: 'Smartphones',   ar: 'هواتف ذكية'  },
  { key: 'Accessories', en: 'Accessories',   ar: 'إكسسوارات'  },
  { key: 'Spare Parts', en: 'Spare Parts',   ar: 'قطع غيار'   },
]

export function ProductsSection({ products }: Props) {
  const { lang } = useLanguage()
  const [cat, setCat] = useState('All')

  const filtered = cat === 'All' ? products : products.filter((p) => p.category === cat)
  const shown = filtered.slice(0, 9)

  return (
    <section id="products" className="py-24 bg-[#050b18]">
      <div className="section-divider mb-0" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-24">

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-12">
          <div>
            <p className="text-[#c8a96e] text-xs font-bold uppercase tracking-[0.2em] mb-3">
              {lang === 'en' ? 'Our Catalog' : 'الكتالوج'}
            </p>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white leading-tight">
              {lang === 'en' ? 'Premium Wholesale' : 'منتجات الجملة'}<br />
              <span className="gold-text">{lang === 'en' ? 'Products' : 'المتميزة'}</span>
            </h2>
          </div>
          <Link
            href="/products"
            className="inline-flex items-center gap-2 text-sm font-semibold text-[#c8a96e] hover:gap-3 transition-all group"
          >
            {lang === 'en' ? 'View Full Catalog' : 'عرض الكتالوج الكامل'}
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* Category Tabs */}
        <div className="flex flex-wrap gap-2 mb-10">
          {CATS.map((c) => (
            <button
              key={c.key}
              onClick={() => setCat(c.key)}
              className={`px-5 py-2.5 rounded-full text-sm font-semibold transition-all duration-200 ${
                cat === c.key
                  ? 'bg-gradient-to-r from-[#c8a96e] to-[#e8c97a] text-[#050b18] shadow-lg shadow-[#c8a96e]/20'
                  : 'bg-white/[0.04] border border-white/[0.08] text-gray-400 hover:text-white hover:border-white/[0.15]'
              }`}
            >
              {lang === 'ar' ? c.ar : c.en}
            </button>
          ))}
        </div>

        {/* Grid */}
        {shown.length === 0 ? (
          <div className="text-center py-20 text-gray-600 text-sm">
            {lang === 'en' ? 'No products yet — connect your database.' : 'لا توجد منتجات حتى الآن'}
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-10">
              {shown.map((product) => (
                <ProductCard key={product.id} product={product} lang={lang} />
              ))}
            </div>

            {filtered.length > 9 && (
              <div className="text-center">
                <Link
                  href="/products"
                  className="inline-flex items-center gap-2 px-8 py-3.5 border border-[#c8a96e]/25 text-[#c8a96e] font-semibold rounded-xl hover:bg-[#c8a96e]/[0.08] hover:border-[#c8a96e]/50 transition-all text-sm"
                >
                  {lang === 'en' ? `View All ${filtered.length} Products` : `عرض كل ${filtered.length} منتج`}
                  <ArrowUpRight className="w-4 h-4" />
                </Link>
              </div>
            )}
          </>
        )}

      </div>
    </section>
  )
}

function ProductCard({ product, lang }: { product: Product; lang: string }) {
  const name = lang === 'ar' && product.nameAr ? product.nameAr : product.name
  const img = product.images[0]

  return (
    <Link href={`/products/${product.slug}`} className="group block">
      <div className="bg-[#0a1628] border border-white/[0.06] rounded-2xl overflow-hidden hover:border-[#c8a96e]/30 hover:shadow-xl hover:shadow-black/40 transition-all duration-300">

        {/* Image */}
        <div className="relative h-52 bg-gradient-to-br from-[#0d1b2a] to-[#070e1a] flex items-center justify-center overflow-hidden">
          {img ? (
            <Image
              src={img} alt={name} fill
              className="object-contain p-6 group-hover:scale-105 transition-transform duration-500"
            />
          ) : (
            <Tag className="w-14 h-14 text-white/8" />
          )}
          {/* Category chip */}
          <span className="absolute bottom-3 left-3 px-2.5 py-1 bg-[#050b18]/80 backdrop-blur-sm border border-white/10 text-gray-400 text-[10px] font-medium rounded-full">
            {product.category}
          </span>
          {product.featured && (
            <span className="absolute top-3 right-3 px-2.5 py-1 bg-gradient-to-r from-[#c8a96e] to-[#e8c97a] text-[#050b18] text-[10px] font-black rounded-full uppercase tracking-wider">
              {lang === 'en' ? 'Featured' : 'مميز'}
            </span>
          )}
        </div>

        {/* Info */}
        <div className="p-4">
          <p className="text-[10px] font-bold text-[#c8a96e] uppercase tracking-[0.15em] mb-1.5">{product.brand}</p>
          <h3 className="text-white font-semibold text-sm leading-snug line-clamp-2 group-hover:text-[#c8a96e] transition-colors duration-200 mb-4">
            {name}
          </h3>
          <div className="flex items-center justify-between pt-3 border-t border-white/[0.06]">
            <div className="text-xs text-gray-500">
              {lang === 'en' ? 'MOQ' : 'الحد الأدنى'}:{' '}
              <span className="text-[#c8a96e] font-bold text-sm">{product.moq}</span>{' '}
              <span className="text-gray-600">{lang === 'en' ? 'units' : 'وحدة'}</span>
            </div>
            <div className="flex items-center gap-1 text-xs font-semibold text-gray-500 group-hover:text-[#c8a96e] transition-colors">
              {lang === 'en' ? 'Details' : 'التفاصيل'}
              <ArrowUpRight className="w-3.5 h-3.5" />
            </div>
          </div>
        </div>
      </div>
    </Link>
  )
}
