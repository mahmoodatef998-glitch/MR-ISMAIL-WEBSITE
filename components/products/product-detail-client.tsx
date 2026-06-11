'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useLanguage } from '@/hooks/use-language'
import { Product } from '@/types'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ProductCard } from './product-card'
import { RFQForm } from '@/components/rfq/rfq-form'
import { ChevronRight, Package, Tag } from 'lucide-react'

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
      ? product.category === 'Smartphones'
        ? 'الهواتف الذكية'
        : product.category === 'Accessories'
        ? 'الإكسسوارات'
        : 'قطع الغيار'
      : product.category

  return (
    <div className="min-h-screen bg-white">
      {/* Breadcrumb */}
      <div className="bg-gray-50 border-b">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <Link href="/" className="hover:text-[#c8a96e]">{lang === 'en' ? 'Home' : 'الرئيسية'}</Link>
            <ChevronRight className="w-3 h-3" />
            <Link href="/products" className="hover:text-[#c8a96e]">{lang === 'en' ? 'Products' : 'المنتجات'}</Link>
            <ChevronRight className="w-3 h-3" />
            <span className="text-[#0d1b2a] font-medium truncate max-w-[200px]">{displayName}</span>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 mb-12">
          {/* Images */}
          <div>
            <div className="relative h-80 bg-gray-50 rounded-xl overflow-hidden border border-gray-200 mb-3">
              {images[activeImage] ? (
                <Image
                  src={images[activeImage]}
                  alt={displayName}
                  fill
                  className="object-contain p-6"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <Tag className="w-20 h-20 text-gray-200" />
                </div>
              )}
            </div>
            {images.length > 1 && (
              <div className="flex gap-2 overflow-x-auto pb-2">
                {images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveImage(i)}
                    className={`relative w-16 h-16 rounded-lg border-2 flex-shrink-0 overflow-hidden ${
                      activeImage === i ? 'border-[#c8a96e]' : 'border-gray-200'
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
            <div className="flex items-start justify-between gap-3 mb-3">
              <div>
                <p className="text-sm text-gray-400 uppercase tracking-wide mb-1">{product.brand}</p>
                <h1 className="text-2xl font-bold text-[#0d1b2a]">{displayName}</h1>
              </div>
              <Badge variant="secondary">{categoryLabel}</Badge>
            </div>

            {/* MOQ */}
            <div className="bg-[#f8f4ee] border border-[#c8a96e]/30 rounded-xl p-4 mb-5">
              <div className="flex items-center gap-3">
                <Package className="w-5 h-5 text-[#c8a96e]" />
                <div>
                  <p className="text-xs text-gray-500">
                    {lang === 'en' ? 'Minimum Order Quantity' : 'الحد الأدنى للطلب'}
                  </p>
                  <p className="font-bold text-[#0d1b2a] text-lg">
                    {product.moq}{' '}
                    <span className="text-sm font-normal text-gray-500">
                      {lang === 'en' ? 'units' : 'وحدة'}
                    </span>
                  </p>
                </div>
              </div>
            </div>

            {/* Price */}
            <div className="mb-5">
              <p className="text-lg text-[#c8a96e] font-semibold">
                {lang === 'en' ? 'Contact for Wholesale Price' : 'تواصل للحصول على سعر الجملة'}
              </p>
              <p className="text-sm text-gray-400 mt-1">
                {lang === 'en'
                  ? 'Pricing varies based on quantity and payment terms'
                  : 'يختلف السعر حسب الكمية وشروط الدفع'}
              </p>
            </div>

            {/* Description */}
            <p className="text-gray-600 text-sm leading-relaxed mb-6">{displayDesc}</p>

            {/* CTA Buttons */}
            <div className="flex gap-3">
              <Link href="/request-quote" className="flex-1">
                <Button className="w-full" size="lg">
                  {lang === 'en' ? 'Request a Quote' : 'طلب عرض سعر'}
                </Button>
              </Link>
              <a
                href={`https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_NUMBER?.replace(/\+/g, '') || '971501234567'}?text=${encodeURIComponent(`Hi, I'm interested in ${displayName}`)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-none"
              >
                <Button variant="outline" size="lg">
                  WhatsApp
                </Button>
              </a>
            </div>
          </div>
        </div>

        {/* Specs Table */}
        {specs.length > 0 && (
          <div className="mb-12">
            <h2 className="text-xl font-bold text-[#0d1b2a] mb-4">
              {lang === 'en' ? 'Specifications' : 'المواصفات'}
            </h2>
            <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
              <table className="w-full text-sm">
                <tbody>
                  {specs.map(({ key, value }, i) => (
                    <tr key={i} className={i % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
                      <td className="py-3 px-4 font-medium text-[#0d1b2a] w-1/3">{key}</td>
                      <td className="py-3 px-4 text-gray-600">{value}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* RFQ Form */}
        <div className="mb-12">
          <h2 className="text-xl font-bold text-[#0d1b2a] mb-4">
            {lang === 'en' ? 'Request a Quote for this Product' : 'طلب عرض سعر لهذا المنتج'}
          </h2>
          <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
            <RFQForm preselectedProduct={{ id: product.id, name: product.name, moq: product.moq }} />
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div>
            <h2 className="text-xl font-bold text-[#0d1b2a] mb-6">
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
