'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useLanguage } from '@/hooks/use-language'
import { Product } from '@/types'
import { ArrowRight, Tag } from 'lucide-react'
import { m, AnimatePresence } from 'framer-motion'
import { fadeUp, fadeLeft, fadeRight, stagger, scaleIn, viewportOnce } from '@/lib/motion'
import { ScrollGallery } from './scroll-gallery'
import { MobileGallery } from './mobile-gallery'

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

  return (
    <section id="products" className="py-24 bg-[#080503]">
      <div className="section-divider mb-0" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-24">

        {/* Header */}
        <m.div
          className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-12"
          variants={stagger(0, 0.12)}
          initial="hidden"
          whileInView="show"
          viewport={viewportOnce}
        >
          <div>
            <m.p variants={fadeLeft} className="text-[#C4922A] text-xs font-bold uppercase tracking-[0.2em] mb-3 section-label">
              {lang === 'en' ? 'Our Catalog' : 'الكتالوج'}
            </m.p>
            <m.h2 variants={fadeLeft} className="text-3xl sm:text-4xl lg:text-5xl font-black text-white leading-tight">
              {lang === 'en' ? 'Premium Wholesale' : 'منتجات الجملة'}<br />
              <span className="gold-text">{lang === 'en' ? 'Products' : 'المتميزة'}</span>
            </m.h2>
          </div>
          <m.div variants={fadeRight}>
            <Link
              href="/products"
              className="inline-flex items-center gap-2 text-sm font-semibold text-[#C4922A] hover:gap-3 transition-all group"
            >
              {lang === 'en' ? 'View Full Catalog' : 'عرض الكتالوج الكامل'}
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </m.div>
        </m.div>

        {/* Category Tabs */}
        <m.div
          className="flex flex-wrap gap-2 mb-10"
          variants={stagger(0.05, 0.07)}
          initial="hidden"
          whileInView="show"
          viewport={viewportOnce}
        >
          {CATS.map((c) => (
            <m.button
              key={c.key}
              variants={scaleIn}
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
              onClick={() => setCat(c.key)}
              className={`relative px-5 py-2.5 rounded-full text-sm font-semibold transition-colors duration-200 ${
                cat === c.key
                  ? 'bg-gradient-to-r from-[#C4922A] to-[#D4A840] text-[#080503] shadow-lg shadow-[#C4922A]/20'
                  : 'bg-white/[0.04] border border-white/[0.08] text-gray-400 hover:text-white hover:border-white/[0.15]'
              }`}
            >
              {lang === 'ar' ? c.ar : c.en}
            </m.button>
          ))}
        </m.div>

      </div>

      {/* Galleries */}
      <AnimatePresence mode="wait">
        {filtered.length === 0 ? (
          <m.div
            key="empty"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="max-w-7xl mx-auto px-4 sm:px-6 text-center py-24"
          >
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-[#C4922A]/10 border border-[#C4922A]/20 mb-6">
              <Tag className="w-7 h-7 text-[#C4922A]" />
            </div>
            <h3 className="text-white font-bold text-lg mb-2">
              {lang === 'en' ? 'Catalog Coming Soon' : 'الكتالوج قريبًا'}
            </h3>
            <p className="text-gray-500 text-sm mb-6 max-w-xs mx-auto">
              {lang === 'en'
                ? 'Our full product catalog is being updated. Contact us directly for pricing and availability.'
                : 'يتم تحديث كتالوج المنتجات الكامل. تواصل معنا مباشرة للأسعار والتوفر.'}
            </p>
            <a
              href="#contact"
              onClick={(e) => {
                e.preventDefault()
                document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })
              }}
              className="inline-flex items-center gap-2 px-6 py-3 bg-[#C4922A]/10 border border-[#C4922A]/25 text-[#C4922A] font-semibold text-sm rounded-xl hover:bg-[#C4922A]/15 transition-all"
            >
              {lang === 'en' ? 'Request a Quote' : 'طلب عرض سعر'}
              <ArrowRight className="w-4 h-4" />
            </a>
          </m.div>
        ) : (
          <m.div
            key={cat}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, transition: { duration: 0.15 } }}
          >
            {/* Desktop: 3D staircase gallery (md+) */}
            <div className="hidden md:block">
              <ScrollGallery products={filtered} />
            </div>

            {/* Mobile: swipeable card deck (< md) */}
            <div className="flex justify-center md:hidden">
              <MobileGallery products={filtered} />
            </div>
          </m.div>
        )}
      </AnimatePresence>

      {/* View Full Catalog link */}
      {filtered.length > 0 && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-10 flex justify-center">
          <m.div
            variants={fadeUp}
            initial="hidden"
            whileInView="show"
            viewport={viewportOnce}
          >
            <Link
              href="/products"
              className="inline-flex items-center gap-2 px-8 py-3.5 border border-[#c8a96e]/25 text-[#c8a96e] font-semibold rounded-xl hover:bg-[#c8a96e]/[0.08] hover:border-[#c8a96e]/50 transition-all text-sm"
            >
              {lang === 'en' ? 'View Full Catalog' : 'عرض الكتالوج الكامل'}
              <ArrowRight className="w-4 h-4" />
            </Link>
          </m.div>
        </div>
      )}
    </section>
  )
}
