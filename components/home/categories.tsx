'use client'

import Link from 'next/link'
import { useLanguage } from '@/hooks/use-language'
import { Smartphone, Headphones, Wrench } from 'lucide-react'

const categories = [
  {
    id: 'Smartphones',
    icon: Smartphone,
    image: '/images/category-smartphones.jpg',
    count: '800+',
  },
  {
    id: 'Accessories',
    icon: Headphones,
    image: '/images/category-accessories.jpg',
    count: '1,200+',
  },
  {
    id: 'Spare Parts',
    icon: Wrench,
    image: '/images/category-spare-parts.jpg',
    count: '500+',
  },
]

export function Categories() {
  const { t, lang } = useLanguage()

  const labels: Record<string, string> = {
    Smartphones: t.categories.smartphones,
    Accessories: t.categories.accessories,
    'Spare Parts': t.categories.spareParts,
  }

  const descriptions: Record<string, { en: string; ar: string }> = {
    Smartphones: {
      en: 'Latest flagship & mid-range phones',
      ar: 'أحدث الهواتف الرائدة والمتوسطة',
    },
    Accessories: {
      en: 'Cases, chargers, earphones & more',
      ar: 'أغطية وشواحن وسماعات والمزيد',
    },
    'Spare Parts': {
      en: 'Screens, batteries & components',
      ar: 'شاشات وبطاريات ومكونات',
    },
  }

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold text-[#0d1b2a] mb-3">
            {lang === 'en' ? 'Product Categories' : 'فئات المنتجات'}
          </h2>
          <p className="text-gray-500 max-w-xl mx-auto">
            {lang === 'en'
              ? 'Browse our comprehensive range of mobile products for wholesale buyers'
              : 'تصفح مجموعتنا الشاملة من منتجات الهواتف لمشتري الجملة'}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {categories.map(({ id, icon: Icon, count }) => (
            <Link
              key={id}
              href={`/products?category=${encodeURIComponent(id)}`}
              className="group relative bg-white rounded-xl overflow-hidden border border-gray-200 hover:border-[#c8a96e] hover:shadow-lg transition-all duration-300"
            >
              {/* Color gradient header */}
              <div className="h-40 bg-gradient-to-br from-[#0d1b2a] to-[#1a3a5c] flex items-center justify-center relative overflow-hidden">
                <div className="absolute inset-0 opacity-10 group-hover:opacity-20 transition-opacity">
                  <div
                    className="absolute inset-0"
                    style={{
                      backgroundImage:
                        'radial-gradient(circle at 1px 1px, #c8a96e 1px, transparent 0)',
                      backgroundSize: '20px 20px',
                    }}
                  />
                </div>
                <Icon className="w-16 h-16 text-[#c8a96e] group-hover:scale-110 transition-transform duration-300" />
              </div>

              <div className="p-5">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-lg font-bold text-[#0d1b2a] group-hover:text-[#c8a96e] transition-colors">
                      {labels[id]}
                    </h3>
                    <p className="text-gray-500 text-sm mt-1">
                      {descriptions[id][lang as 'en' | 'ar']}
                    </p>
                  </div>
                  <span className="bg-[#c8a96e]/10 text-[#c8a96e] text-xs font-semibold px-2 py-1 rounded-full">
                    {count}
                  </span>
                </div>

                <div className="mt-4 flex items-center text-sm text-[#c8a96e] font-medium">
                  <span>{lang === 'en' ? 'Browse Category' : 'تصفح الفئة'}</span>
                  <span className="ml-1 group-hover:translate-x-1 transition-transform inline-block">→</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
