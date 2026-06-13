'use client'

import { useState, useTransition } from 'react'
import Link from 'next/link'
import { useRouter, usePathname } from 'next/navigation'
import { Product } from '@/types'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { deleteProduct, updateProduct } from '@/app/actions/products'
import { getStatusColor, getStatusLabel } from '@/lib/utils'
import { Plus, Search, Edit, Trash2, Eye, ToggleLeft, ToggleRight, Loader2 } from 'lucide-react'
import { toast } from '@/hooks/use-toast'

interface Props {
  products: Product[]
  total: number
  totalPages: number
  currentPage: number
  currentSearch: string
  currentCategory: string
  currentStatus: string
}

export function AdminProductsClient({ products, total, totalPages, currentPage, currentSearch, currentCategory, currentStatus }: Props) {
  const router = useRouter()
  const pathname = usePathname()
  const [, startTransition] = useTransition()
  const [search, setSearch] = useState(currentSearch)
  const [loadingId, setLoadingId] = useState<string | null>(null)

  const updateParams = (updates: Record<string, string>) => {
    const params = new URLSearchParams()
    const current = { search: currentSearch, category: currentCategory, status: currentStatus, page: String(currentPage) }
    const merged = { ...current, ...updates, page: '1' }
    Object.entries(merged).forEach(([k, v]) => { if (v) params.set(k, v) })
    startTransition(() => router.push(`${pathname}?${params.toString()}`))
  }

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Delete "${name}"? This cannot be undone.`)) return
    setLoadingId(id)
    const result = await deleteProduct(id)
    setLoadingId(null)
    if (result.success) {
      toast({ title: 'Product deleted', variant: 'success' as any })
      router.refresh()
    } else {
      toast({ title: result.error || 'Error', variant: 'destructive' })
    }
  }

  const handleToggleStatus = async (id: string, currentStatus: string) => {
    setLoadingId(id)
    const newStatus = currentStatus === 'active' ? 'inactive' : 'active'
    const result = await updateProduct(id, { status: newStatus as 'active' | 'inactive' })
    setLoadingId(null)
    if (result.success) {
      toast({ title: `Product ${newStatus}`, variant: 'success' as any })
      router.refresh()
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-bold text-gray-800">Products ({total})</h1>
        <Link href="/admin/products/new">
          <Button className="flex items-center gap-2">
            <Plus className="w-4 h-4" />
            Add Product
          </Button>
        </Link>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl border border-gray-200 p-4 mb-5 flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <form onSubmit={(e) => { e.preventDefault(); updateParams({ search }) }}>
            <Input placeholder="Search products..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9 h-9" />
          </form>
        </div>

        <select
          value={currentCategory}
          onChange={(e) => updateParams({ category: e.target.value })}
          className="h-9 rounded-md border border-gray-200 bg-white px-3 text-sm"
        >
          <option value="">All Categories</option>
          <option value="Smartphones">Smartphones</option>
          <option value="Accessories">Accessories</option>
          <option value="Spare Parts">Spare Parts</option>
        </select>

        <select
          value={currentStatus}
          onChange={(e) => updateParams({ status: e.target.value })}
          className="h-9 rounded-md border border-gray-200 bg-white px-3 text-sm"
        >
          <option value="all">All Status</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
          <option value="out_of_stock">Out of Stock</option>
        </select>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        {products.length === 0 ? (
          <div className="text-center py-12 text-gray-400">
            <p>No products found</p>
            <Link href="/admin/products/new">
              <Button className="mt-4">Add First Product</Button>
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  <th className="text-left py-3 px-4 text-xs text-gray-500 font-medium">PRODUCT</th>
                  <th className="text-left py-3 px-4 text-xs text-gray-500 font-medium">BRAND</th>
                  <th className="text-left py-3 px-4 text-xs text-gray-500 font-medium">CATEGORY</th>
                  <th className="text-center py-3 px-4 text-xs text-gray-500 font-medium">MOQ</th>
                  <th className="text-center py-3 px-4 text-xs text-gray-500 font-medium">STOCK</th>
                  <th className="text-left py-3 px-4 text-xs text-gray-500 font-medium">STATUS</th>
                  <th className="text-left py-3 px-4 text-xs text-gray-500 font-medium">FEATURED</th>
                  <th className="text-right py-3 px-4 text-xs text-gray-500 font-medium">ACTIONS</th>
                </tr>
              </thead>
              <tbody>
                {products.map((product) => (
                  <tr key={product.id} className="border-t border-gray-50 hover:bg-gray-50/50 transition-colors">
                    <td className="py-3 px-4">
                      <div>
                        <p className="font-medium text-gray-800 line-clamp-1">{product.name}</p>
                        <p className="text-xs text-gray-400">{product.slug}</p>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-gray-600">{product.brand}</td>
                    <td className="py-3 px-4">
                      <span className="text-xs bg-gray-100 text-gray-700 px-2 py-0.5 rounded-full">{product.category}</span>
                    </td>
                    <td className="py-3 px-4 text-center text-gray-700">{product.moq}</td>
                    <td className="py-3 px-4 text-center">
                      <span className={`font-bold text-sm ${
                        product.stock === 0
                          ? 'text-red-500'
                          : product.stock < 100
                          ? 'text-amber-600'
                          : 'text-green-600'
                      }`}>
                        {product.stock.toLocaleString()}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium ${getStatusColor(product.status)}`}>
                        {getStatusLabel(product.status)}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <span className={`text-xs ${product.featured ? 'text-[#c8a96e] font-semibold' : 'text-gray-400'}`}>
                        {product.featured ? '★ Yes' : 'No'}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center justify-end gap-2">
                        {loadingId === product.id ? (
                          <Loader2 className="w-4 h-4 animate-spin text-gray-400" />
                        ) : (
                          <>
                            <Link href={`/products/${product.slug}`} target="_blank">
                              <button className="p-1.5 text-gray-400 hover:text-blue-600 transition-colors" title="View">
                                <Eye className="w-4 h-4" />
                              </button>
                            </Link>
                            <button
                              onClick={() => handleToggleStatus(product.id, product.status)}
                              className="p-1.5 text-gray-400 hover:text-green-600 transition-colors"
                              title="Toggle Status"
                            >
                              {product.status === 'active' ? <ToggleRight className="w-4 h-4" /> : <ToggleLeft className="w-4 h-4" />}
                            </button>
                            <Link href={`/admin/products/${product.id}/edit`}>
                              <button className="p-1.5 text-gray-400 hover:text-[#c8a96e] transition-colors" title="Edit">
                                <Edit className="w-4 h-4" />
                              </button>
                            </Link>
                            <button
                              onClick={() => handleDelete(product.id, product.name)}
                              className="p-1.5 text-gray-400 hover:text-red-600 transition-colors"
                              title="Delete"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
