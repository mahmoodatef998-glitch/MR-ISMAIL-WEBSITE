'use client'

import { useState, useEffect } from 'react'
import { useLanguage } from '@/hooks/use-language'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { submitRFQ } from '@/app/actions/rfq'
import { getProducts } from '@/app/actions/products'
import { Product, RFQItem } from '@/types'
import { generateRFQPDF } from '@/lib/pdf-generator'
import { formatDate } from '@/lib/utils'
import { Trash2, CheckCircle, Download, Loader2, Search } from 'lucide-react'
import { toast } from '@/hooks/use-toast'

interface Props {
  preselectedProduct?: { id: string; name: string; moq: number }
}

interface FormData {
  customerName: string
  company: string
  email: string
  phone: string
  country: string
  city: string
  message: string
}

export function RFQForm({ preselectedProduct }: Props) {
  const { t, lang } = useLanguage()
  const [formData, setFormData] = useState<FormData>({
    customerName: '',
    company: '',
    email: '',
    phone: '',
    country: '',
    city: '',
    message: '',
  })
  const [items, setItems] = useState<RFQItem[]>(
    preselectedProduct
      ? [{ productId: preselectedProduct.id, productName: preselectedProduct.name, quantity: preselectedProduct.moq }]
      : []
  )
  const [productSearch, setProductSearch] = useState('')
  const [searchResults, setSearchResults] = useState<Product[]>([])
  const [isSearching, setIsSearching] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [successData, setSuccessData] = useState<{ refNumber: string } | null>(null)
  const [errors, setErrors] = useState<Record<string, string>>({})

  // Search products
  useEffect(() => {
    if (productSearch.length < 2) {
      setSearchResults([])
      return
    }
    const timer = setTimeout(async () => {
      setIsSearching(true)
      const { data } = await getProducts({ search: productSearch, pageSize: 6 })
      setSearchResults(data)
      setIsSearching(false)
    }, 300)
    return () => clearTimeout(timer)
  }, [productSearch])

  const addProduct = (product: Product) => {
    const existing = items.find((i) => i.productId === product.id)
    if (!existing) {
      setItems([...items, { productId: product.id, productName: product.name, quantity: product.moq || 1 }])
    }
    setProductSearch('')
    setSearchResults([])
  }

  const removeItem = (id: string) => {
    setItems(items.filter((i) => i.productId !== id))
  }

  const updateQuantity = (id: string, qty: number) => {
    setItems(items.map((i) => (i.productId === id ? { ...i, quantity: Math.max(1, qty) } : i)))
  }

  const validate = () => {
    const errs: Record<string, string> = {}
    if (!formData.customerName.trim()) errs.customerName = lang === 'en' ? 'Required' : 'مطلوب'
    if (!formData.company.trim()) errs.company = lang === 'en' ? 'Required' : 'مطلوب'
    if (!formData.email.trim() || !/\S+@\S+\.\S+/.test(formData.email)) errs.email = lang === 'en' ? 'Valid email required' : 'بريد إلكتروني صحيح مطلوب'
    if (!formData.phone.trim()) errs.phone = lang === 'en' ? 'Required' : 'مطلوب'
    if (!formData.country.trim()) errs.country = lang === 'en' ? 'Required' : 'مطلوب'
    if (!formData.city.trim()) errs.city = lang === 'en' ? 'Required' : 'مطلوب'
    if (items.length === 0) errs.items = lang === 'en' ? 'Add at least one product' : 'أضف منتجاً واحداً على الأقل'
    setErrors(errs)
    return Object.keys(errs).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validate()) return

    setIsSubmitting(true)
    try {
      const result = await submitRFQ({ ...formData, items })
      if (result.success && result.refNumber) {
        setSuccessData({ refNumber: result.refNumber })
        toast({ title: t.rfq.success, variant: 'success' as any })
      } else {
        toast({ title: result.error || 'Error', variant: 'destructive' })
      }
    } catch {
      toast({ title: 'Something went wrong', variant: 'destructive' })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDownloadPDF = async () => {
    if (!successData) return
    const today = new Date()
    const validUntil = new Date(today)
    validUntil.setDate(today.getDate() + 7)

    const blob = await generateRFQPDF({
      refNumber: successData.refNumber,
      ...formData,
      items,
      date: formatDate(today),
      validUntil: formatDate(validUntil),
    })

    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${successData.refNumber}.pdf`
    a.click()
    URL.revokeObjectURL(url)
  }

  if (successData) {
    return (
      <div className="text-center py-10">
        <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
        <h3 className="text-xl font-bold text-[#0d1b2a] mb-2">{t.rfq.success}</h3>
        <p className="text-gray-500 mb-2">{t.rfq.successMessage}</p>
        <p className="text-sm text-gray-400 mb-6">
          {lang === 'en' ? 'Reference Number:' : 'رقم المرجع:'}{' '}
          <span className="font-bold text-[#c8a96e]">{successData.refNumber}</span>
        </p>
        <Button onClick={handleDownloadPDF} className="flex items-center gap-2 mx-auto">
          <Download className="w-4 h-4" />
          {t.rfq.downloadPDF}
        </Button>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Customer Details */}
      <div>
        <h3 className="font-semibold text-[#0d1b2a] mb-4 text-sm uppercase tracking-wide border-b pb-2">
          {t.rfq.customerDetails}
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {[
            { field: 'customerName', label: t.rfq.fullName },
            { field: 'company', label: t.rfq.company },
            { field: 'email', label: t.rfq.email, type: 'email' },
            { field: 'phone', label: t.rfq.phone, type: 'tel' },
            { field: 'country', label: t.rfq.country },
            { field: 'city', label: t.rfq.city },
          ].map(({ field, label, type = 'text' }) => (
            <div key={field}>
              <Label htmlFor={field} className="text-xs font-medium text-gray-600 mb-1.5 block">
                {label} <span className="text-red-500">*</span>
              </Label>
              <Input
                id={field}
                type={type}
                value={formData[field as keyof FormData]}
                onChange={(e) => setFormData({ ...formData, [field]: e.target.value })}
                className={errors[field] ? 'border-red-400' : ''}
              />
              {errors[field] && <p className="text-red-500 text-xs mt-1">{errors[field]}</p>}
            </div>
          ))}
        </div>
      </div>

      {/* Products */}
      <div>
        <h3 className="font-semibold text-[#0d1b2a] mb-4 text-sm uppercase tracking-wide border-b pb-2">
          {t.rfq.products}
        </h3>

        {/* Search */}
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input
            placeholder={t.rfq.searchProducts}
            value={productSearch}
            onChange={(e) => setProductSearch(e.target.value)}
            className="pl-9"
          />
          {isSearching && (
            <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 animate-spin" />
          )}

          {searchResults.length > 0 && (
            <div className="absolute z-10 top-full mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-lg max-h-48 overflow-y-auto">
              {searchResults.map((p) => (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => addProduct(p)}
                  className="w-full text-left px-4 py-2.5 hover:bg-[#f8f4ee] text-sm border-b last:border-0 flex items-center justify-between"
                >
                  <span className="font-medium text-[#0d1b2a]">{p.name}</span>
                  <span className="text-xs text-gray-400">{p.brand}</span>
                </button>
              ))}
            </div>
          )}
        </div>

        {errors.items && <p className="text-red-500 text-xs mb-3">{errors.items}</p>}

        {/* Items */}
        {items.length > 0 && (
          <div className="border border-gray-200 rounded-lg overflow-hidden mb-3">
            <table className="w-full text-sm">
              <thead className="bg-gray-50">
                <tr>
                  <th className="text-left py-2 px-3 text-xs text-gray-500 font-medium">
                    {lang === 'en' ? 'Product' : 'المنتج'}
                  </th>
                  <th className="text-center py-2 px-3 text-xs text-gray-500 font-medium w-32">
                    {t.rfq.quantity}
                  </th>
                  <th className="w-10" />
                </tr>
              </thead>
              <tbody>
                {items.map((item) => (
                  <tr key={item.productId} className="border-t border-gray-100">
                    <td className="py-2 px-3 font-medium text-[#0d1b2a]">{item.productName}</td>
                    <td className="py-2 px-3">
                      <Input
                        type="number"
                        min={1}
                        value={item.quantity}
                        onChange={(e) => updateQuantity(item.productId, parseInt(e.target.value) || 1)}
                        className="w-full text-center h-8 text-sm"
                      />
                    </td>
                    <td className="py-2 px-3">
                      <button
                        type="button"
                        onClick={() => removeItem(item.productId)}
                        className="text-red-400 hover:text-red-600 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Message */}
      <div>
        <Label htmlFor="message" className="text-xs font-medium text-gray-600 mb-1.5 block">
          {t.rfq.message}
        </Label>
        <Textarea
          id="message"
          placeholder={t.rfq.messagePlaceholder}
          value={formData.message}
          onChange={(e) => setFormData({ ...formData, message: e.target.value })}
          rows={4}
        />
      </div>

      <Button type="submit" size="lg" className="w-full" disabled={isSubmitting}>
        {isSubmitting ? (
          <>
            <Loader2 className="mr-2 w-4 h-4 animate-spin" />
            {t.rfq.submitting}
          </>
        ) : (
          t.rfq.submit
        )}
      </Button>
    </form>
  )
}
