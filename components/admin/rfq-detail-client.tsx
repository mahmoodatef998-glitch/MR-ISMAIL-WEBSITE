'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { RFQ, RFQItem } from '@/types'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { updateRFQStatus } from '@/app/actions/rfq'
import { getStatusColor, getStatusLabel, formatDate } from '@/lib/utils'
import {
  ArrowLeft, Loader2, Save, User, Building, Mail, Phone,
  MapPin, Calendar, CheckCircle2, Package, X, AlertTriangle,
} from 'lucide-react'
import { toast } from '@/hooks/use-toast'

interface ProductOption {
  id: string
  name: string
  brand: string
  stock: number
}

interface Props {
  rfq: Omit<RFQ, 'items'> & { items: RFQItem[] }
  products: ProductOption[]
}

export function RFQDetailClient({ rfq, products }: Props) {
  const router = useRouter()
  const [status, setStatus] = useState(rfq.status)
  const [notes, setNotes] = useState(rfq.notes || '')
  const [isLoading, setIsLoading] = useState(false)

  // Confirm modal state
  const [showConfirm, setShowConfirm] = useState(false)
  const [selectedProductId, setSelectedProductId] = useState('')
  const [confirmQty, setConfirmQty] = useState(
    rfq.items[0]?.quantity ? String(rfq.items[0].quantity) : ''
  )
  const [confirmLoading, setConfirmLoading] = useState(false)
  const [confirmedResult, setConfirmedResult] = useState<{
    productName: string; newStock: number; qty: number
  } | null>(
    rfq.confirmedProductId
      ? {
          productName: products.find((p) => p.id === rfq.confirmedProductId)?.name ?? 'Product',
          newStock: products.find((p) => p.id === rfq.confirmedProductId)?.stock ?? 0,
          qty: rfq.confirmedQty ?? 0,
        }
      : null
  )

  const selectedProduct = products.find((p) => p.id === selectedProductId)

  const handleSave = async () => {
    setIsLoading(true)
    await updateRFQStatus(rfq.id, status, notes)
    setIsLoading(false)
    toast({ title: 'RFQ updated!', variant: 'success' as any })
    router.refresh()
  }

  const handleConfirmOrder = async () => {
    if (!selectedProductId || !confirmQty || Number(confirmQty) < 1) return
    setConfirmLoading(true)
    try {
      const res = await fetch('/api/rfq/confirm', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ rfqId: rfq.id, productId: selectedProductId, qty: Number(confirmQty) }),
      })
      const data = await res.json()
      if (!res.ok || !data.success) {
        toast({ title: data.error || 'Failed to confirm order', variant: 'destructive' })
      } else {
        setConfirmedResult({ productName: data.productName, newStock: data.newStock, qty: Number(confirmQty) })
        setStatus('closed')
        setShowConfirm(false)
        toast({ title: 'Order confirmed! Stock updated.', variant: 'success' as any })
        router.refresh()
      }
    } finally {
      setConfirmLoading(false)
    }
  }

  const alreadyConfirmed = !!rfq.confirmedProductId || !!confirmedResult

  return (
    <div className="max-w-4xl">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <Link href="/admin/rfqs">
          <Button variant="outline" size="sm">
            <ArrowLeft className="w-4 h-4 mr-1" /> Back
          </Button>
        </Link>
        <div className="flex-1">
          <h1 className="text-xl font-bold text-gray-800">{rfq.refNumber}</h1>
          <p className="text-sm text-gray-500">Submitted {formatDate(rfq.createdAt)}</p>
        </div>
        <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(rfq.status)}`}>
          {getStatusLabel(rfq.status)}
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main info */}
        <div className="lg:col-span-2 space-y-5">
          {/* Customer */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h2 className="font-semibold text-gray-800 mb-4">Customer Information</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {[
                { icon: User, label: 'Name', value: rfq.customerName },
                { icon: Building, label: 'Company', value: rfq.company },
                { icon: Mail, label: 'Email', value: rfq.email },
                { icon: Phone, label: 'Phone', value: rfq.phone },
                { icon: MapPin, label: 'Location', value: `${rfq.city}, ${rfq.country}` },
                { icon: Calendar, label: 'Submitted', value: formatDate(rfq.createdAt) },
              ].map(({ icon: Icon, label, value }) => (
                <div key={label} className="flex gap-2.5">
                  <Icon className="w-4 h-4 text-[#c8a96e] mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-xs text-gray-400">{label}</p>
                    <p className="text-sm font-medium text-gray-800">{value}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Products */}
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100">
              <h2 className="font-semibold text-gray-800">Requested Products ({rfq.items.length})</h2>
            </div>
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50">
                  <th className="text-left py-3 px-4 text-xs text-gray-500 font-medium">#</th>
                  <th className="text-left py-3 px-4 text-xs text-gray-500 font-medium">PRODUCT</th>
                  <th className="text-center py-3 px-4 text-xs text-gray-500 font-medium">QTY</th>
                </tr>
              </thead>
              <tbody>
                {rfq.items.map((item, i) => (
                  <tr key={i} className="border-t border-gray-50">
                    <td className="py-3 px-4 text-gray-400">{i + 1}</td>
                    <td className="py-3 px-4 font-medium text-gray-800">{item.productName}</td>
                    <td className="py-3 px-4 text-center text-gray-700">{item.quantity}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Message */}
          {rfq.message && (
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h2 className="font-semibold text-gray-800 mb-3">Special Requirements</h2>
              <p className="text-gray-600 text-sm leading-relaxed">{rfq.message}</p>
            </div>
          )}

          {/* Confirmed stock result */}
          {confirmedResult && (
            <div className="bg-green-50 border border-green-200 rounded-xl p-5 flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5 shrink-0" />
              <div>
                <p className="font-semibold text-green-800 text-sm">Order Confirmed</p>
                <p className="text-green-700 text-sm mt-0.5">
                  Deducted <strong>{confirmedResult.qty.toLocaleString()} units</strong> of{' '}
                  <strong>{confirmedResult.productName}</strong>.
                </p>
                <p className="text-green-600 text-sm mt-0.5">
                  Remaining stock:{' '}
                  <span className="font-bold text-green-800">
                    {confirmedResult.newStock.toLocaleString()} units
                  </span>
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-5">

          {/* Confirm Order card */}
          <div className={`rounded-xl border p-5 ${alreadyConfirmed ? 'bg-gray-50 border-gray-200' : 'bg-[#f8f4ee] border-[#c8a96e]/40'}`}>
            <div className="flex items-center gap-2 mb-3">
              <Package className={`w-4 h-4 ${alreadyConfirmed ? 'text-gray-400' : 'text-[#c8a96e]'}`} />
              <h2 className={`font-semibold text-sm ${alreadyConfirmed ? 'text-gray-500' : 'text-gray-800'}`}>
                Confirm Order & Deduct Stock
              </h2>
            </div>
            {alreadyConfirmed ? (
              <p className="text-xs text-gray-400">This RFQ has already been confirmed.</p>
            ) : (
              <>
                <p className="text-xs text-gray-500 mb-4">
                  Select which product to deduct from inventory and confirm the quantity sold.
                </p>
                <Button
                  className="w-full bg-[#c8a96e] hover:bg-[#b8975e] text-[#050b18] font-bold"
                  onClick={() => setShowConfirm(true)}
                >
                  <CheckCircle2 className="w-4 h-4 mr-2" />
                  Confirm Order
                </Button>
              </>
            )}
          </div>

          {/* Status */}
          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <h2 className="font-semibold text-gray-800 mb-4">Update Status</h2>
            <div className="space-y-3">
              {['new', 'in_review', 'quoted', 'closed'].map((s) => (
                <button
                  key={s}
                  onClick={() => setStatus(s as RFQ['status'])}
                  className={`w-full text-left px-3 py-2.5 rounded-lg text-sm transition-colors border ${
                    status === s
                      ? 'border-[#c8a96e] bg-[#f8f4ee] text-[#0d1b2a] font-semibold'
                      : 'border-transparent hover:bg-gray-50 text-gray-600'
                  }`}
                >
                  <span className={`inline-block w-2 h-2 rounded-full mr-2 ${getStatusColor(s)}`} />
                  {getStatusLabel(s)}
                </button>
              ))}
            </div>
          </div>

          {/* Notes */}
          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <h2 className="font-semibold text-gray-800 mb-3">Internal Notes</h2>
            <Textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Add internal notes about this RFQ..."
              rows={4}
              className="text-sm"
            />
          </div>

          <Button className="w-full" onClick={handleSave} disabled={isLoading}>
            {isLoading ? <><Loader2 className="mr-2 w-4 h-4 animate-spin" />Saving...</> : <><Save className="mr-2 w-4 h-4" />Save Changes</>}
          </Button>

          <a href={`mailto:${rfq.email}?subject=Re: Your Quote Request - ${rfq.refNumber}`} className="block">
            <Button variant="outline" className="w-full">Reply via Email</Button>
          </a>
        </div>
      </div>

      {/* Confirm Order Modal */}
      {showConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6">
            {/* Modal header */}
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-lg font-bold text-gray-800">Confirm Order</h3>
              <button onClick={() => setShowConfirm(false)} className="p-1.5 rounded-lg hover:bg-gray-100">
                <X className="w-4 h-4 text-gray-500" />
              </button>
            </div>

            {/* Customer summary */}
            <div className="bg-gray-50 rounded-xl p-3 mb-5 text-sm">
              <p className="font-medium text-gray-800">{rfq.customerName} — {rfq.company}</p>
              <p className="text-gray-500 text-xs mt-0.5">{rfq.refNumber} · {rfq.country}</p>
            </div>

            {/* Product picker */}
            <div className="mb-4">
              <label className="block text-xs font-bold text-gray-600 uppercase tracking-wider mb-1.5">
                Select Product *
              </label>
              <select
                value={selectedProductId}
                onChange={(e) => setSelectedProductId(e.target.value)}
                className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#c8a96e]/40 bg-white"
              >
                <option value="">— Choose a product —</option>
                {products.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.brand} {p.name} (Stock: {p.stock.toLocaleString()})
                  </option>
                ))}
              </select>
            </div>

            {/* Current stock badge */}
            {selectedProduct && (
              <div className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm mb-4 ${
                selectedProduct.stock > 0
                  ? 'bg-blue-50 border border-blue-200 text-blue-800'
                  : 'bg-red-50 border border-red-200 text-red-700'
              }`}>
                <Package className="w-4 h-4 shrink-0" />
                <span>
                  Current stock: <strong>{selectedProduct.stock.toLocaleString()} units</strong>
                  {selectedProduct.stock === 0 && ' — Out of stock!'}
                </span>
              </div>
            )}

            {/* Quantity */}
            <div className="mb-5">
              <label className="block text-xs font-bold text-gray-600 uppercase tracking-wider mb-1.5">
                Quantity to Deduct *
              </label>
              <input
                type="number"
                min={1}
                max={selectedProduct?.stock ?? undefined}
                value={confirmQty}
                onChange={(e) => setConfirmQty(e.target.value)}
                className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#c8a96e]/40"
                placeholder="Enter quantity"
              />
              {selectedProduct && confirmQty && Number(confirmQty) > selectedProduct.stock && (
                <p className="flex items-center gap-1.5 text-red-600 text-xs mt-1.5">
                  <AlertTriangle className="w-3.5 h-3.5" />
                  Exceeds available stock ({selectedProduct.stock.toLocaleString()} units)
                </p>
              )}
              {selectedProduct && confirmQty && Number(confirmQty) <= selectedProduct.stock && Number(confirmQty) > 0 && (
                <p className="text-green-700 text-xs mt-1.5 font-medium">
                  After confirmation: {(selectedProduct.stock - Number(confirmQty)).toLocaleString()} units remaining
                </p>
              )}
            </div>

            {/* Actions */}
            <div className="flex gap-3">
              <Button variant="outline" className="flex-1" onClick={() => setShowConfirm(false)}>
                Cancel
              </Button>
              <Button
                className="flex-1 bg-[#c8a96e] hover:bg-[#b8975e] text-[#050b18] font-bold"
                disabled={
                  confirmLoading ||
                  !selectedProductId ||
                  !confirmQty ||
                  Number(confirmQty) < 1 ||
                  (!!selectedProduct && Number(confirmQty) > selectedProduct.stock)
                }
                onClick={handleConfirmOrder}
              >
                {confirmLoading ? (
                  <><Loader2 className="mr-2 w-4 h-4 animate-spin" />Confirming...</>
                ) : (
                  <><CheckCircle2 className="mr-2 w-4 h-4" />Confirm & Deduct</>
                )}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
