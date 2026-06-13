'use client'

import { useRouter, usePathname } from 'next/navigation'
import { useLanguage } from '@/hooks/use-language'
import { ProductCard } from './product-card'
import { Product } from '@/types'
import { Search, SlidersHorizontal, ChevronLeft, ChevronRight, X } from 'lucide-react'
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
  products, brands, total, totalPages,
  currentPage, currentCategory, currentBrand, currentSearch, currentSort,
}: Props) {
  const { t, lang } = useLanguage()
  const router = useRouter()
  const pathname = usePathname()
  const [isPending, startTransition] = useTransition()
  const [search, setSearch] = useState(currentSearch)
  const [mobileFilters, setMobileFilters] = useState(false)

  const updateParams = (updates: Record<string, string>) => {
    const params = new URLSearchParams()
    const merged = {
      category: currentCategory, brand: currentBrand,
      search: currentSearch, sort: currentSort,
      page: String(currentPage), ...updates,
    }
    merged.page = '1'
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
      <div>
        <h3 className="text-[10px] font-bold text-[#c8a96e]/70 uppercase tracking-widest mb-3">
          {lang === 'en' ? 'Category' : 'الفئة'}
        </h3>
        <div className="space-y-1">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => updateParams({ category: cat })}
              className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-all ${
                currentCategory === cat
                  ? 'bg-[#c8a96e]/15 text-[#c8a96e] font-semibold border border-[#c8a96e]/20'
                  : 'text-gray-400 hover:text-white hover:bg-white/5'
              }`}
            >
              {categoryLabels[cat]}
            </button>
          ))}
        </div>
      </div>

      {brands.length > 0 && (
        <div>
          <h3 className="text-[10px] font-bold text-[#c8a96e]/70 uppercase tracking-widest mb-3">
            {lang === 'en' ? 'Brand' : 'العلامة التجارية'}
          </h3>
          <div className="space-y-1">
            <button
              onClick={() => updateParams({ brand: '' })}
              className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-all ${
                !currentBrand ? 'bg-[#c8a96e]/15 text-[#c8a96e] font-semibold border border-[#c8a96e]/20' : 'text-gray-400 hover:text-white hover:bg-white/5'
              }`}
            >
              {lang === 'en' ? 'All Brands' : 'جميع الماركات'}
            </button>
            {brands.map((b) => (
              <button
                key={b}
                onClick={() => updateParams({ brand: b })}
                className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-all ${
                  currentBrand === b ? 'bg-[#c8a96e]/15 text-[#c8a96e] font-semibold border border-[#c8a96e]/20' : 'text-gray-400 hover:text-white hover:bg-white/5'
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
    <div className="min-h-screen bg-[#050b18]">
      {/* Header */}
      <div className="bg-[#0a1628] border-b border-white/5 pt-24 pb-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <h1 className="text-3xl sm:text-4xl font-black text-white mb-2">{t.products.title}</h1>
          <p className="text-gray-400">{t.products.subtitle}</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        {/* Search & Sort */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
            <form onSubmit={(e) => { e.preventDefault(); updateParams({ search }) }}>
              <input
                placeholder={t.products.search}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full h-10 pl-9 pr-4 bg-[#0a1628] border border-white/10 rounded-lg text-sm text-white placeholder:text-gray-600 focus:outline-none focus:border-[#c8a96e]/50 transition-colors"
              />
            </form>
          </div>

          <select
            value={currentSort}
            onChange={(e) => updateParams({ sort: e.target.value })}
            className="h-10 rounded-lg border border-white/10 bg-[#0a1628] px-3 text-sm text-white focus:outline-none focus:border-[#c8a96e]/50 transition-colors"
          >
            <option value="newest">{t.products.newest}</option>
            <option value="name">{t.products.nameAZ}</option>
            <option value="category">{t.products.category}</option>
          </select>

          <button
            className="sm:hidden flex items-center justify-center gap-2 h-10 px-4 rounded-lg border border-white/10 bg-[#0a1628] text-sm text-gray-300 hover:text-white transition-colors"
            onClick={() => setMobileFilters(!mobileFilters)}
          >
            {mobileFilters ? <X className="w-4 h-4" /> : <SlidersHorizontal className="w-4 h-4" />}
            {lang === 'en' ? 'Filters' : 'فلاتر'}
          </button>
        </div>

        {/* Mobile filters */}
        {mobileFilters && (
          <div className="sm:hidden bg-[#0a1628] rounded-xl border border-white/5 p-4 mb-6">
            <Sidebar />
          </div>
        )}

        <div className="flex gap-8">
          {/* Sidebar Desktop */}
          <aside className="hidden sm:block w-52 shrink-0">
            <div className="bg-[#0a1628] rounded-xl border border-white/5 p-5 sticky top-24">
              <Sidebar />
            </div>
          </aside>

          {/* Grid */}
          <div className="flex-1">
            <p className="text-sm text-gray-500 mb-4">
              {total} {lang === 'en' ? 'products found' : 'منتج موجود'}
            </p>

            {isPending ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="bg-[#0a1628] rounded-2xl border border-white/5 h-72 animate-pulse" />
                ))}
              </div>
            ) : products.length === 0 ? (
              <div className="text-center py-20">
                <p className="text-gray-500 text-lg mb-4">{t.products.noProducts}</p>
                <button
                  onClick={() => updateParams({ category: '', brand: '', search: '' })}
                  className="px-5 py-2 rounded-lg border border-white/10 text-sm text-gray-400 hover:text-white hover:border-white/20 transition-all"
                >
                  {lang === 'en' ? 'Clear Filters' : 'مسح الفلاتر'}
                </button>
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
              <div className="mt-10 flex items-center justify-center gap-2">
                <button
                  disabled={currentPage <= 1}
                  onClick={() => updateParams({ page: String(currentPage - 1) })}
                  className="w-9 h-9 flex items-center justify-center rounded-lg border border-white/10 text-gray-400 hover:text-white hover:border-white/20 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>

                {Array.from({ length: Math.min(totalPages, 7) }, (_, i) => i + 1).map((p) => (
                  <button
                    key={p}
                    onClick={() => updateParams({ page: String(p) })}
                    className={`w-9 h-9 rounded-lg text-sm font-medium transition-all ${
                      currentPage === p
                        ? 'bg-[#c8a96e] text-[#050b18]'
                        : 'border border-white/10 text-gray-400 hover:text-white hover:border-white/20'
                    }`}
                  >
                    {p}
                  </button>
                ))}

                <button
                  disabled={currentPage >= totalPages}
                  onClick={() => updateParams({ page: String(currentPage + 1) })}
                  className="w-9 h-9 flex items-center justify-center rounded-lg border border-white/10 text-gray-400 hover:text-white hover:border-white/20 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
