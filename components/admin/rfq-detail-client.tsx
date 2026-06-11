'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { RFQ, RFQItem } from '@/types'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { updateRFQStatus } from '@/app/actions/rfq'
import { getStatusColor, getStatusLabel, formatDate } from '@/lib/utils'
import { ArrowLeft, Loader2, Save, User, Building, Mail, Phone, MapPin, Calendar } from 'lucide-react'
import { toast } from '@/hooks/use-toast'

interface Props {
  rfq: Omit<RFQ, 'items'> & { items: RFQItem[] }
}

export function RFQDetailClient({ rfq }: Props) {
  const router = useRouter()
  const [status, setStatus] = useState(rfq.status)
  const [notes, setNotes] = useState(rfq.notes || '')
  const [isLoading, setIsLoading] = useState(false)

  const handleSave = async () => {
    setIsLoading(true)
    await updateRFQStatus(rfq.id, status, notes)
    setIsLoading(false)
    toast({ title: 'RFQ updated!', variant: 'success' as any })
    router.refresh()
  }

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
        </div>

        {/* Sidebar - Actions */}
        <div className="space-y-5">
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

          <a
            href={`mailto:${rfq.email}?subject=Re: Your Quote Request - ${rfq.refNumber}`}
            className="block"
          >
            <Button variant="outline" className="w-full">
              Reply via Email
            </Button>
          </a>
        </div>
      </div>
    </div>
  )
}
