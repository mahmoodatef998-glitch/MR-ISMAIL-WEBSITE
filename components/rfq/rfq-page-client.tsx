'use client'

import { useLanguage } from '@/hooks/use-language'
import { RFQForm } from './rfq-form'
import { CheckCircle, Clock, ShieldCheck, Headset } from 'lucide-react'

export function RFQPageClient() {
  const { t, lang } = useLanguage()

  const benefits = [
    {
      icon: Clock,
      title: { en: '24-Hour Response', ar: 'رد خلال 24 ساعة' },
      desc: { en: 'We respond to all quotes within 24 business hours', ar: 'نرد على جميع الطلبات خلال 24 ساعة عمل' },
    },
    {
      icon: ShieldCheck,
      title: { en: 'Genuine Products', ar: 'منتجات أصلية' },
      desc: { en: '100% authentic products with warranty', ar: '100% منتجات أصلية مع ضمان' },
    },
    {
      icon: CheckCircle,
      title: { en: 'PDF Quote', ar: 'عرض سعر PDF' },
      desc: { en: 'Get a professional PDF quote to download', ar: 'احصل على عرض سعر احترافي للتحميل' },
    },
    {
      icon: Headset,
      title: { en: 'Dedicated Support', ar: 'دعم مخصص' },
      desc: { en: 'Account manager assigned to your request', ar: 'مدير حساب مخصص لطلبك' },
    },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-[#0d1b2a] py-12">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-3xl font-bold text-white mb-3">{t.rfq.title}</h1>
          <p className="text-gray-400 max-w-xl mx-auto">{t.rfq.subtitle}</p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Form */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl border border-gray-200 p-6 lg:p-8">
              <RFQForm />
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Benefits */}
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h3 className="font-bold text-[#0d1b2a] mb-4">
                {lang === 'en' ? 'Why Request a Quote?' : 'لماذا تطلب عرض سعر؟'}
              </h3>
              <div className="space-y-4">
                {benefits.map(({ icon: Icon, title, desc }) => (
                  <div key={title.en} className="flex gap-3">
                    <div className="w-9 h-9 bg-[#f8f4ee] rounded-lg flex items-center justify-center flex-shrink-0">
                      <Icon className="w-4 h-4 text-[#c8a96e]" />
                    </div>
                    <div>
                      <p className="font-semibold text-sm text-[#0d1b2a]">{title[lang as 'en' | 'ar']}</p>
                      <p className="text-xs text-gray-500 mt-0.5">{desc[lang as 'en' | 'ar']}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Contact */}
            <div className="bg-[#0d1b2a] rounded-xl p-6">
              <h3 className="font-bold text-white mb-3">
                {lang === 'en' ? 'Need Immediate Help?' : 'تحتاج مساعدة فورية؟'}
              </h3>
              <p className="text-gray-400 text-sm mb-4">
                {lang === 'en'
                  ? 'Contact our wholesale team directly'
                  : 'تواصل مع فريق الجملة مباشرة'}
              </p>
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2 text-gray-300">
                  <span>📞</span>
                  <span>+971 50 123 4567</span>
                </div>
                <div className="flex items-center gap-2 text-gray-300">
                  <span>💬</span>
                  <span>WhatsApp: +971 50 123 4567</span>
                </div>
                <div className="flex items-center gap-2 text-gray-300">
                  <span>✉</span>
                  <span>info@mr-ismail-trading.ae</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
