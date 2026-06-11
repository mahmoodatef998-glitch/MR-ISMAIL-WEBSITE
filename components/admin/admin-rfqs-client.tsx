'use client'

import { useState, useTransition } from 'react'
import Link from 'next/link'
import { useRouter, usePathname } from 'next/navigation'
import { RFQ } from '@/types'
import { Input } from '@/components/ui/input'
import { getStatusColor, getStatusLabel, formatDate } from '@/lib/utils'
import { Search, Eye, Download } from 'lucide-react'

interface Props {
  rfqs: RFQ[]
  total: number
  totalPages: number
  currentPage: number
  currentStatus: string
  currentSearch: string
}

export function AdminRFQsClient({ rfqs, total, totalPages, currentPage, currentStatus, currentSearch }: Props) {
  const router = useRouter()
  const pathname = usePathname()
  const [, startTransition] = useTransition()
  const [search, setSearch] = useState(currentSearch)

  const updateParams = (updates: Record<string, string>) => {
    const params = new URLSearchParams()
    const current = { search: currentSearch, status: currentStatus, page: String(currentPage) }
    const merged = { ...current, ...updates, page: '1' }
    Object.entries(merged).forEach(([k, v]) => { if (v) params.set(k, v) })
    startTransition(() => router.push(`${pathname}?${params.toString()}`))
  }

  const exportCSV = () => {
    const headers = ['Ref', 'Customer', 'Company', 'Email', 'Phone', 'Country', 'Status', 'Date']
    const rows = rfqs.map((r) => [
      r.refNumber, r.customerName, r.company, r.email, r.phone, `${r.city}, ${r.country}`, r.status,
      formatDate(r.createdAt),
    ])
    const csv = [headers, ...rows].map((r) => r.join(',')).join('\n')
    const blob = new Blob([csv], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `rfqs-${new Date().toISOString().split('T')[0]}.csv`
    a.click()
    URL.revokeObjectURL(url)
  }

  const statuses = [
    { value: '', label: 'All' },
    { value: 'new', label: 'New' },
    { value: 'in_review', label: 'In Review' },
    { value: 'quoted', label: 'Quoted' },
    { value: 'closed', label: 'Closed' },
  ]

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-bold text-gray-800">RFQ Requests ({total})</h1>
        <button
          onClick={exportCSV}
          className="flex items-center gap-2 text-sm text-gray-600 hover:text-[#c8a96e] transition-colors border border-gray-200 rounded-lg px-3 py-2"
        >
          <Download className="w-4 h-4" />
          Export CSV
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl border border-gray-200 p-4 mb-5 flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <form onSubmit={(e) => { e.preventDefault(); updateParams({ search }) }}>
            <Input placeholder="Search by name, company, ref..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9 h-9" />
          </form>
        </div>
        <div className="flex gap-1">
          {statuses.map(({ value, label }) => (
            <button
              key={value}
              onClick={() => updateParams({ status: value })}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                currentStatus === value
                  ? 'bg-[#0d1b2a] text-white'
                  : 'text-gray-500 hover:bg-gray-100'
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        {rfqs.length === 0 ? (
          <div className="text-center py-12 text-gray-400 text-sm">No RFQ requests found</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  <th className="text-left py-3 px-4 text-xs text-gray-500 font-medium">REF</th>
                  <th className="text-left py-3 px-4 text-xs text-gray-500 font-medium">CUSTOMER</th>
                  <th className="text-left py-3 px-4 text-xs text-gray-500 font-medium">COMPANY</th>
                  <th className="text-left py-3 px-4 text-xs text-gray-500 font-medium">LOCATION</th>
                  <th className="text-center py-3 px-4 text-xs text-gray-500 font-medium">ITEMS</th>
                  <th className="text-left py-3 px-4 text-xs text-gray-500 font-medium">STATUS</th>
                  <th className="text-left py-3 px-4 text-xs text-gray-500 font-medium">DATE</th>
                  <th className="text-right py-3 px-4 text-xs text-gray-500 font-medium">ACTIONS</th>
                </tr>
              </thead>
              <tbody>
                {rfqs.map((rfq) => (
                  <tr key={rfq.id} className="border-t border-gray-50 hover:bg-gray-50/50 transition-colors">
                    <td className="py-3 px-4">
                      <Link href={`/admin/rfqs/${rfq.id}`} className="text-[#c8a96e] hover:underline font-medium text-xs">
                        {rfq.refNumber}
                      </Link>
                    </td>
                    <td className="py-3 px-4 text-gray-800 font-medium">{rfq.customerName}</td>
                    <td className="py-3 px-4 text-gray-600">{rfq.company}</td>
                    <td className="py-3 px-4 text-gray-500 text-xs">{rfq.city}, {rfq.country}</td>
                    <td className="py-3 px-4 text-center">
                      <span className="bg-gray-100 text-gray-700 px-2 py-0.5 rounded-full text-xs">
                        {rfq.items.length}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium ${getStatusColor(rfq.status)}`}>
                        {getStatusLabel(rfq.status)}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-gray-500 text-xs">{formatDate(rfq.createdAt)}</td>
                    <td className="py-3 px-4 text-right">
                      <Link href={`/admin/rfqs/${rfq.id}`}>
                        <button className="p-1.5 text-gray-400 hover:text-[#c8a96e] transition-colors" title="View Details">
                          <Eye className="w-4 h-4" />
                        </button>
                      </Link>
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
