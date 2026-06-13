'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useLanguage } from '@/hooks/use-language'
import { Product } from '@/types'
import { ProductCard } from './product-card'
import { RFQForm } from '@/components/rfq/rfq-form'
import { ChevronRight, Package, Tag, MessageCircle } from 'lucide-react'

interface Props {
  product: Product
  relatedProducts: Product[]
}

export function ProductDetailClient({ product, relatedProducts }: Props) {
  const { lang } = useLanguage()
  const [activeImage, setActiveImage] = useState(0)

  const images = product.images
  const displayName = lang === 'ar' && product.nameAr ? product.nameAr : product.name
  const displayDesc = lang === 'ar' && product.descriptionAr ? product.descriptionAr : product.description
  const specs = product.specs

  const categoryLabel =
    lang === 'ar'
      ? product.category === 'Smartphones' ? 'الهواتف الذكية'
        : product.category === 'Accessories' ? 'الإكسسوارات'
        : 'قطع الغيار'
      : product.category

  return (
    <div className="min-h-screen bg-[#050b18]">
      {/* Breadcrumb */}
      <div className="bg-[#0a1628] border-b border-white/5 pt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <Link href="/" className="hover:text-[#c8a96e] transition-colors">{lang === 'en' ? 'Home' : 'الرئيسية'}</Link>
            <ChevronRight className="w-3 h-3" />
            <Link href="/products" className="hover:text-[#c8a96e] transition-colors">{lang === 'en' ? 'Products' : 'المنتجات'}</Link>
            <ChevronRight className="w-3 h-3" />
            <span className="text-gray-300 truncate max-w-[200px]">{displayName}</span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
        {/* Product Main */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 mb-14">
          {/* Images */}
          <div>
            <div className="relative h-80 bg-[#0a1628] rounded-2xl overflow-hidden border border-white/5 mb-3">
              {images[activeImage] ? (
                <Image
                  src={images[activeImage]}
                  alt={displayName}
                  fill
                  className="object-contain p-8"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <Tag className="w-20 h-20 text-white/10" />
                </div>
              )}
            </div>
            {images.length > 1 && (
              <div className="flex gap-2 overflow-x-auto pb-2">
                {images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveImage(i)}
                    className={`relative w-16 h-16 rounded-xl border-2 flex-shrink-0 overflow-hidden bg-[#0a1628] transition-all ${
                      activeImage === i ? 'border-[#c8a96e]' : 'border-white/5 hover:border-white/20'
                    }`}
                  >
                    <Image src={img} alt="" fill className="object-contain p-1" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Details */}
          <div>
            <div className="mb-1">
              <span className="text-[11px] text-[#c8a96e]/70 uppercase tracking-widest font-semibold">{product.brand}</span>
              <span className="mx-2 text-white/10">·</span>
              <span className="text-[11px] text-gray-500">{categoryLabel}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white mb-5 leading-tight">{displayName}</h1>

            {/* MOQ */}
            <div className="bg-[#0a1628] border border-[#c8a96e]/15 rounded-xl p-4 mb-5 flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-[#c8a96e]/10 flex items-center justify-center shrink-0">
                <Package className="w-5 h-5 text-[#c8a96e]" />
              </div>
              <div>
                <p className="text-xs text-gray-500 mb-0.5">
                  {lang === 'en' ? 'Minimum Order Quantity' : 'الحد الأدنى للطلب'}
                </p>
                <p className="font-black text-white text-lg">
                  {product.moq}{' '}
                  <span className="text-sm font-normal text-gray-400">
                    {lang === 'en' ? 'units' : 'وحدة'}
                  </span>
                </p>
              </div>
            </div>

            {/* Price */}
            <div className="mb-5">
              <p className="text-[#c8a96e] font-semibold text-lg">
                {lang === 'en' ? 'Contact for Wholesale Price' : 'تواصل للحصول على سعر الجملة'}
              </p>
              <p className="text-sm text-gray-500 mt-1">
                {lang === 'en'
                  ? 'Pricing varies based on quantity and payment terms'
                  : 'يختلف السعر حسب الكمية وشروط الدفع'}
              </p>
            </div>

            {/* Description */}
            <p className="text-gray-400 text-sm leading-relaxed mb-7">{displayDesc}</p>

            {/* CTAs */}
            <div className="flex gap-3">
              <Link
                href="/request-quote"
                className="flex-1 flex items-center justify-center py-3 px-5 bg-gradient-to-r from-[#c8a96e] to-[#e8c97a] text-[#050b18] font-bold rounded-xl hover:shadow-lg hover:shadow-[#c8a96e]/20 hover:-translate-y-px transition-all duration-200"
              >
                {lang === 'en' ? 'Request a Quote' : 'طلب عرض سعر'}
              </Link>
              <a
                href={`https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_NUMBER?.replace(/\+/g, '') || '971501234567'}?text=${encodeURIComponent(`Hi, I'm interested in ${displayName}`)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 px-5 py-3 rounded-xl border border-white/10 text-white hover:border-[#c8a96e]/30 hover:text-[#c8a96e] transition-all duration-200"
              >
                <MessageCircle className="w-4 h-4" />
                WhatsApp
              </a>
            </div>
          </div>
        </div>

        {/* Specs */}
        {specs.length > 0 && (
          <div className="mb-12">
            <h2 className="text-xl font-bold text-white mb-4">
              {lang === 'en' ? 'Specifications' : 'المواصفات'}
            </h2>
            <div className="bg-[#0a1628] border border-white/5 rounded-xl overflow-hidden">
              <table className="w-full text-sm">
                <tbody>
                  {specs.map(({ key, value }, i) => (
                    <tr key={i} className={`border-b border-white/5 last:border-0 ${i % 2 === 0 ? 'bg-white/[0.02]' : ''}`}>
                      <td className="py-3 px-5 font-medium text-gray-300 w-1/3">{key}</td>
                      <td className="py-3 px-5 text-gray-400">{value}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* RFQ Form */}
        <div className="mb-12">
          <h2 className="text-xl font-bold text-white mb-4">
            {lang === 'en' ? 'Request a Quote for this Product' : 'طلب عرض سعر لهذا المنتج'}
          </h2>
          <div className="bg-[#0a1628] rounded-xl border border-white/5 p-6">
            <RFQForm preselectedProduct={{ id: product.id, name: product.name, moq: product.moq }} />
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div>
            <h2 className="text-xl font-bold text-white mb-6">
              {lang === 'en' ? 'Related Products' : 'منتجات ذات صلة'}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {relatedProducts.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
