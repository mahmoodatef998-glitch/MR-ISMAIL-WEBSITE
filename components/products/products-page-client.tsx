'use client'

import { useRouter, usePathname } from 'next/navigation'
import { useLanguage } from '@/hooks/use-language'
import { ProductCard } from './product-card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Product } from '@/types'
import { Search, SlidersHorizontal, ChevronLeft, ChevronRight } from 'lucide-react'
import { useState, useTransition } from 'react'

interface Props {
  products: Product[]
  brands: string[]
  total: number
  totalPages: number
  currentPage: number
  currentCategory: string
  currentBrand: string
  currentSearch: string
  currentSort: string
}

const CATEGORIES = ['', 'Smartphones', 'Accessories', 'Spare Parts']

export function ProductsPageClient({
  products,
  brands,
  total,
  totalPages,
  currentPage,
  currentCategory,
  currentBrand,
  currentSearch,
  currentSort,
}: Props) {
  const { t, lang } = useLanguage()
  const router = useRouter()
  const pathname = usePathname()
  const [isPending, startTransition] = useTransition()
  const [search, setSearch] = useState(currentSearch)
  const [mobileFilters, setMobileFilters] = useState(false)

  const updateParams = (updates: Record<string, string>) => {
    const params = new URLSearchParams()
    const current = {
      category: currentCategory,
      brand: currentBrand,
      search: currentSearch,
      sort: currentSort,
      page: String(currentPage),
    }
    const merged = { ...current, ...updates, page: '1' }
    Object.entries(merged).forEach(([k, v]) => { if (v) params.set(k, v) })
    startTransition(() => router.push(`${pathname}?${params.toString()}`))
  }

  const categoryLabels: Record<string, string> = {
    '': t.categories.all,
    Smartphones: t.categories.smartphones,
    Accessories: t.categories.accessories,
    'Spare Parts': t.categories.spareParts,
  }

  const Sidebar = () => (
    <div className="space-y-6">
      {/* Categories */}
      <div>
        <h3 className="font-semibold text-[#0d1b2a] mb-3 text-sm uppercase tracking-wide">
          {lang === 'en' ? 'Category' : 'الفئة'}
        </h3>
        <div className="space-y-1">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => updateParams({ category: cat })}
              className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                currentCategory === cat
                  ? 'bg-[#0d1b2a] text-[#c8a96e] font-semibold'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              {categoryLabels[cat]}
            </button>
          ))}
        </div>
      </div>

      {/* Brands */}
      {brands.length > 0 && (
        <div>
          <h3 className="font-semibold text-[#0d1b2a] mb-3 text-sm uppercase tracking-wide">
            {lang === 'en' ? 'Brand' : 'العلامة التجارية'}
          </h3>
          <div className="space-y-1">
            <button
              onClick={() => updateParams({ brand: '' })}
              className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                !currentBrand ? 'bg-[#0d1b2a] text-[#c8a96e] font-semibold' : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              {lang === 'en' ? 'All Brands' : 'جميع الماركات'}
            </button>
            {brands.map((b) => (
              <button
                key={b}
                onClick={() => updateParams({ brand: b })}
                className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                  currentBrand === b ? 'bg-[#0d1b2a] text-[#c8a96e] font-semibold' : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                {b}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-[#0d1b2a] py-10">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-bold text-white mb-2">{t.products.title}</h1>
          <p className="text-gray-400">{t.products.subtitle}</p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Search & Sort bar */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <form onSubmit={(e) => { e.preventDefault(); updateParams({ search }) }}>
              <Input
                placeholder={t.products.search}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9"
              />
            </form>
          </div>

          <select
            value={currentSort}
            onChange={(e) => updateParams({ sort: e.target.value })}
            className="h-10 rounded-md border border-gray-200 bg-white px-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#c8a96e]"
          >
            <option value="newest">{t.products.newest}</option>
            <option value="name">{t.products.nameAZ}</option>
            <option value="category">{t.products.category}</option>
          </select>

          <Button
            variant="outline"
            className="sm:hidden flex items-center gap-2"
            onClick={() => setMobileFilters(!mobileFilters)}
          >
            <SlidersHorizontal className="w-4 h-4" />
            {lang === 'en' ? 'Filters' : 'فلاتر'}
          </Button>
        </div>

        {/* Mobile filters */}
        {mobileFilters && (
          <div className="sm:hidden bg-white rounded-xl border border-gray-200 p-4 mb-6">
            <Sidebar />
          </div>
        )}

        <div className="flex gap-8">
          {/* Sidebar - Desktop */}
          <aside className="hidden sm:block w-56 shrink-0">
            <div className="bg-white rounded-xl border border-gray-200 p-5 sticky top-24">
              <Sidebar />
            </div>
          </aside>

          {/* Products Grid */}
          <div className="flex-1">
            {/* Count */}
            <p className="text-sm text-gray-500 mb-4">
              {total} {lang === 'en' ? 'products found' : 'منتج موجود'}
            </p>

            {isPending ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="bg-white rounded-xl border border-gray-200 h-72 skeleton" />
                ))}
              </div>
            ) : products.length === 0 ? (
              <div className="text-center py-20">
                <p className="text-gray-400 text-lg">{t.products.noProducts}</p>
                <Button variant="outline" className="mt-4" onClick={() => updateParams({ category: '', brand: '', search: '' })}>
                  {lang === 'en' ? 'Clear Filters' : 'مسح الفلاتر'}
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {products.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="mt-8 flex items-center justify-center gap-2">
                <Button
                  variant="outline"
                  size="icon"
                  disabled={currentPage <= 1}
                  onClick={() => updateParams({ page: String(currentPage - 1) })}
                >
                  <ChevronLeft className="w-4 h-4" />
                </Button>

                {Array.from({ length: Math.min(totalPages, 7) }, (_, i) => {
                  const p = i + 1
                  return (
                    <Button
                      key={p}
                      variant={currentPage === p ? 'default' : 'outline'}
                      size="icon"
                      onClick={() => updateParams({ page: String(p) })}
                    >
                      {p}
                    </Button>
                  )
                })}

                <Button
                  variant="outline"
                  size="icon"
                  disabled={currentPage >= totalPages}
                  onClick={() => updateParams({ page: String(currentPage + 1) })}
                >
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
