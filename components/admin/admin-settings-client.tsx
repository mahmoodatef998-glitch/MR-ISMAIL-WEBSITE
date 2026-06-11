'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Loader2, Save } from 'lucide-react'
import { toast } from '@/hooks/use-toast'

interface Props {
  settings: Record<string, string>
}

export function AdminSettingsClient({ settings }: Props) {
  const [data, setData] = useState({
    companyName: settings.companyName || 'Mr. Ismail Trading LLC',
    companyNameAr: settings.companyNameAr || 'السيد إسماعيل للتجارة',
    email: settings.email || 'info@mr-ismail-trading.ae',
    phone: settings.phone || '+971 50 123 4567',
    whatsapp: settings.whatsapp || '+971501234567',
    address: settings.address || 'Sheikh Zayed Road, Dubai, UAE',
    addressAr: settings.addressAr || 'شارع الشيخ زايد، دبي، الإمارات',
  })
  const [isLoading, setIsLoading] = useState(false)

  const handleSave = async () => {
    setIsLoading(true)
    try {
      const res = await fetch('/api/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
      if (res.ok) {
        toast({ title: 'Settings saved!', variant: 'success' as any })
      } else {
        toast({ title: 'Failed to save settings', variant: 'destructive' })
      }
    } catch {
      toast({ title: 'Error saving settings', variant: 'destructive' })
    } finally {
      setIsLoading(false)
    }
  }

  const Field = ({ label, id, value, onChange, dir }: {
    label: string; id: string; value: string; onChange: (v: string) => void; dir?: string
  }) => (
    <div>
      <Label className="text-xs font-medium text-gray-600 mb-1.5 block">{label}</Label>
      <Input id={id} value={value} onChange={(e) => onChange(e.target.value)} dir={dir} />
    </div>
  )

  return (
    <div className="max-w-2xl">
      <h1 className="text-xl font-bold text-gray-800 mb-6">Site Settings</h1>

      <div className="space-y-6">
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h2 className="font-semibold text-gray-800 mb-4">Company Information</h2>
          <div className="space-y-4">
            <Field label="Company Name (English)" id="companyName" value={data.companyName}
              onChange={(v) => setData({ ...data, companyName: v })} />
            <Field label="اسم الشركة (Arabic)" id="companyNameAr" value={data.companyNameAr}
              onChange={(v) => setData({ ...data, companyNameAr: v })} dir="rtl" />
            <Field label="Email" id="email" value={data.email}
              onChange={(v) => setData({ ...data, email: v })} />
            <Field label="Phone" id="phone" value={data.phone}
              onChange={(v) => setData({ ...data, phone: v })} />
            <Field label="WhatsApp Number (with country code, no +)" id="whatsapp" value={data.whatsapp}
              onChange={(v) => setData({ ...data, whatsapp: v })} />
            <Field label="Address (English)" id="address" value={data.address}
              onChange={(v) => setData({ ...data, address: v })} />
            <Field label="العنوان (Arabic)" id="addressAr" value={data.addressAr}
              onChange={(v) => setData({ ...data, addressAr: v })} dir="rtl" />
          </div>
        </div>

        <Button size="lg" onClick={handleSave} disabled={isLoading}>
          {isLoading ? <><Loader2 className="mr-2 w-4 h-4 animate-spin" />Saving...</> : <><Save className="mr-2 w-4 h-4" />Save Settings</>}
        </Button>
      </div>
    </div>
  )
}
