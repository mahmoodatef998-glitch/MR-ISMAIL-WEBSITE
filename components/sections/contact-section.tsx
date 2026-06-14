'use client'

import { useState } from 'react'
import { useLanguage } from '@/hooks/use-language'
import { MapPin, Mail, Phone, Clock, Send, CheckCircle } from 'lucide-react'
import { m, AnimatePresence } from 'framer-motion'
import { fadeUp, fadeLeft, fadeRight, stagger, scaleIn, viewportOnce } from '@/lib/motion'

const COUNTRIES = [
  'United Arab Emirates', 'Saudi Arabia', 'Kuwait', 'Qatar', 'Bahrain', 'Oman',
  'Egypt', 'Jordan', 'Iraq', 'Pakistan', 'India', 'Bangladesh', 'Nigeria',
  'Kenya', 'South Africa', 'United Kingdom', 'Germany', 'France', 'Other',
]

export function ContactSection() {
  const { lang } = useLanguage()
  const [sent, setSent] = useState(false)
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({
    name: '', company: '', email: '', phone: '',
    country: '', product: '', quantity: '', message: '',
  })

  const set = (k: string, v: string) => setForm((f) => ({ ...f, [k]: v }))

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      await fetch('/api/rfq', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customerName: form.name,
          company: form.company,
          email: form.email,
          phone: form.phone,
          country: form.country,
          city: '',
          items: JSON.stringify([{ product: form.product, qty: form.quantity }]),
          message: form.message,
        }),
      })
      setSent(true)
    } catch {
      setSent(true)
    } finally {
      setLoading(false)
    }
  }

  const INFO = [
    {
      icon: MapPin,
      en: { label: 'Office', value: 'Al Ras, Deira, Dubai — UAE' },
      ar: { label: 'المكتب', value: 'الرأس، ديرة، دبي — الإمارات' },
    },
    {
      icon: Phone,
      en: { label: 'WhatsApp / Phone', value: '+971 50 123 4567' },
      ar: { label: 'واتساب / هاتف', value: '+971 50 123 4567' },
    },
    {
      icon: Mail,
      en: { label: 'Email', value: 'sales@mr-ismail-trading.ae' },
      ar: { label: 'البريد الإلكتروني', value: 'sales@mr-ismail-trading.ae' },
    },
    {
      icon: Clock,
      en: { label: 'Business Hours', value: 'Sun – Thu, 9 AM – 6 PM GST' },
      ar: { label: 'ساعات العمل', value: 'الأحد – الخميس، 9 ص – 6 م' },
    },
  ]

  return (
    <section id="contact" className="py-24 bg-[#080503]">
      <div className="section-divider mb-0" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-24">

        {/* Header */}
        <m.div
          className="text-center max-w-xl mx-auto mb-16"
          variants={stagger(0, 0.12)}
          initial="hidden"
          whileInView="show"
          viewport={viewportOnce}
        >
          <m.p variants={fadeUp} className="text-[#C4922A] text-xs font-bold uppercase tracking-[0.2em] mb-3 section-label">
            {lang === 'en' ? 'Get In Touch' : 'تواصل معنا'}
          </m.p>
          <m.h2 variants={fadeUp} className="text-3xl sm:text-4xl lg:text-5xl font-black text-white leading-tight mb-4">
            {lang === 'en' ? (
              <>Request a<br /><span className="gold-text">Wholesale Quote</span></>
            ) : (
              <>اطلب عرض سعر<br /><span className="gold-text">بالجملة</span></>
            )}
          </m.h2>
          <m.p variants={fadeUp} className="text-gray-500 text-sm">
            {lang === 'en'
              ? 'Fill in the form and our team will respond with a competitive price within 2–4 hours.'
              : 'أكمل النموذج وسيردّ فريقنا بعرض سعر تنافسي خلال 2–4 ساعات.'}
          </m.p>
        </m.div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">

          {/* Contact info sidebar */}
          <m.div
            className="lg:col-span-2 space-y-4"
            variants={stagger(0.1, 0.1)}
            initial="hidden"
            whileInView="show"
            viewport={viewportOnce}
          >
            {INFO.map(({ icon: Icon, en, ar }) => {
              const c = lang === 'ar' ? ar : en
              return (
                <m.div
                  key={c.label}
                  variants={fadeLeft}
                  whileHover={{ x: 4, transition: { duration: 0.2 } }}
                  className="flex items-start gap-4 glass-card rounded-2xl p-5 cursor-default"
                >
                  <div className="shrink-0 w-10 h-10 rounded-xl bg-[#C4922A]/10 border border-[#C4922A]/15 flex items-center justify-center">
                    <Icon className="w-4 h-4 text-[#C4922A]" />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-gray-600 uppercase tracking-wider mb-0.5">{c.label}</p>
                    <p className="text-white text-sm font-medium">{c.value}</p>
                  </div>
                </m.div>
              )
            })}

            {/* WhatsApp CTA */}
            <m.a
              variants={fadeLeft}
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.98 }}
              href={`https://wa.me/971501234567?text=${encodeURIComponent(lang === 'en' ? 'Hi, I want to request a wholesale quote.' : 'مرحبا، أريد طلب عرض سعر بالجملة.')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="relative flex items-center justify-center gap-3 w-full py-4 bg-[#25D366]/10 border border-[#25D366]/25 text-[#25D366] font-bold text-sm rounded-2xl hover:bg-[#25D366]/15 hover:border-[#25D366]/40 transition-all duration-300 overflow-hidden"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
              </svg>
              {lang === 'en' ? 'Chat on WhatsApp' : 'تحدث على واتساب'}
            </m.a>
          </m.div>

          {/* Quote form */}
          <m.div
            className="lg:col-span-3"
            variants={fadeRight}
            initial="hidden"
            whileInView="show"
            viewport={viewportOnce}
          >
            <AnimatePresence mode="wait">
              {sent ? (
                <m.div
                  key="success"
                  initial={{ opacity: 0, scale: 0.92 }}
                  animate={{ opacity: 1, scale: 1, transition: { type: 'spring', stiffness: 300, damping: 22 } }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="h-full flex items-center justify-center glass-card rounded-2xl p-12 text-center"
                >
                  <div>
                    <m.div
                      initial={{ scale: 0, rotate: -30 }}
                      animate={{ scale: 1, rotate: 0, transition: { type: 'spring', stiffness: 400, damping: 18, delay: 0.1 } }}
                      className="w-16 h-16 rounded-full bg-[#C4922A]/10 border border-[#C4922A]/25 flex items-center justify-center mx-auto mb-5"
                    >
                      <CheckCircle className="w-8 h-8 text-[#C4922A]" />
                    </m.div>
                    <m.h3
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0, transition: { delay: 0.2 } }}
                      className="text-white font-black text-xl mb-2"
                    >
                      {lang === 'en' ? 'Request Received!' : 'تم استلام طلبك!'}
                    </m.h3>
                    <m.p
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0, transition: { delay: 0.3 } }}
                      className="text-gray-500 text-sm max-w-xs mx-auto"
                    >
                      {lang === 'en'
                        ? "We'll review your inquiry and get back to you within 2–4 business hours."
                        : 'سنراجع استفسارك ونرد عليك خلال 2–4 ساعات عمل.'}
                    </m.p>
                  </div>
                </m.div>
              ) : (
                <m.form
                  key="form"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onSubmit={handleSubmit}
                  className="glass-card rounded-2xl p-7 space-y-4"
                >
                  {/* Row 1 */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-1.5">
                        {lang === 'en' ? 'Full Name *' : 'الاسم الكامل *'}
                      </label>
                      <input
                        required
                        value={form.name}
                        onChange={(e) => set('name', e.target.value)}
                        className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl px-4 py-3 text-sm text-white placeholder-gray-600/60 focus:outline-none focus:border-[#C4922A]/35 focus:bg-[#C4922A]/[0.04] transition-all duration-200"
                        placeholder={lang === 'en' ? 'John Smith' : 'محمد أحمد'}
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-1.5">
                        {lang === 'en' ? 'Company *' : 'الشركة *'}
                      </label>
                      <input
                        required
                        value={form.company}
                        onChange={(e) => set('company', e.target.value)}
                        className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl px-4 py-3 text-sm text-white placeholder-gray-600/60 focus:outline-none focus:border-[#C4922A]/35 focus:bg-[#C4922A]/[0.04] transition-all duration-200"
                        placeholder={lang === 'en' ? 'Your Company LLC' : 'شركتك ذ.م.م'}
                      />
                    </div>
                  </div>

                  {/* Row 2 */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-1.5">
                        {lang === 'en' ? 'Email *' : 'البريد الإلكتروني *'}
                      </label>
                      <input
                        required
                        type="email"
                        value={form.email}
                        onChange={(e) => set('email', e.target.value)}
                        className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl px-4 py-3 text-sm text-white placeholder-gray-600/60 focus:outline-none focus:border-[#C4922A]/35 focus:bg-[#C4922A]/[0.04] transition-all duration-200"
                        placeholder="you@company.com"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-1.5">
                        {lang === 'en' ? 'Phone / WhatsApp *' : 'الهاتف / واتساب *'}
                      </label>
                      <input
                        required
                        value={form.phone}
                        onChange={(e) => set('phone', e.target.value)}
                        className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl px-4 py-3 text-sm text-white placeholder-gray-600/60 focus:outline-none focus:border-[#C4922A]/35 focus:bg-[#C4922A]/[0.04] transition-all duration-200"
                        placeholder="+971 50 000 0000"
                      />
                    </div>
                  </div>

                  {/* Row 3 */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-1.5">
                        {lang === 'en' ? 'Country *' : 'الدولة *'}
                      </label>
                      <select
                        required
                        value={form.country}
                        onChange={(e) => set('country', e.target.value)}
                        className="w-full bg-[#080503] border border-white/[0.07] rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-[#C4922A]/40 focus:bg-[#1C0E04] transition-all appearance-none"
                      >
                        <option value="" disabled>{lang === 'en' ? 'Select Country' : 'اختر الدولة'}</option>
                        {COUNTRIES.map((c) => <option key={c} value={c}>{c}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-1.5">
                        {lang === 'en' ? 'Product / Model' : 'المنتج / الموديل'}
                      </label>
                      <input
                        value={form.product}
                        onChange={(e) => set('product', e.target.value)}
                        className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl px-4 py-3 text-sm text-white placeholder-gray-600/60 focus:outline-none focus:border-[#C4922A]/35 focus:bg-[#C4922A]/[0.04] transition-all duration-200"
                        placeholder={lang === 'en' ? 'e.g. Samsung Galaxy S25' : 'مثال: سامسونج S25'}
                      />
                    </div>
                  </div>

                  {/* Quantity */}
                  <div>
                    <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-1.5">
                      {lang === 'en' ? 'Quantity (units)' : 'الكمية (وحدات)'}
                    </label>
                    <input
                      value={form.quantity}
                      onChange={(e) => set('quantity', e.target.value)}
                      className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl px-4 py-3 text-sm text-white placeholder-gray-600/60 focus:outline-none focus:border-[#C4922A]/35 focus:bg-[#C4922A]/[0.04] transition-all duration-200"
                      placeholder={lang === 'en' ? 'e.g. 500 units' : 'مثال: 500 وحدة'}
                    />
                  </div>

                  {/* Message */}
                  <div>
                    <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-1.5">
                      {lang === 'en' ? 'Additional Notes' : 'ملاحظات إضافية'}
                    </label>
                    <textarea
                      rows={3}
                      value={form.message}
                      onChange={(e) => set('message', e.target.value)}
                      className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl px-4 py-3 text-sm text-white placeholder-gray-600/60 focus:outline-none focus:border-[#C4922A]/35 focus:bg-[#C4922A]/[0.04] transition-all duration-200 resize-none"
                      placeholder={lang === 'en' ? 'Specifications, target price, delivery timeline…' : 'المواصفات، السعر المستهدف، جدول التسليم…'}
                    />
                  </div>

                  <m.button
                    type="submit"
                    disabled={loading}
                    whileHover={loading ? {} : { scale: 1.02, y: -1 }}
                    whileTap={loading ? {} : { scale: 0.98 }}
                    className="w-full flex items-center justify-center gap-2.5 py-4 btn-bronze font-bold text-sm rounded-xl disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                  >
                    {loading ? (
                      <span className="w-4 h-4 border-2 border-[#050b18]/30 border-t-[#050b18] rounded-full animate-spin" />
                    ) : (
                      <Send className="w-4 h-4" />
                    )}
                    {lang === 'en' ? 'Send Inquiry' : 'إرسال الاستفسار'}
                  </m.button>
                </m.form>
              )}
            </AnimatePresence>
          </m.div>
        </div>
      </div>
    </section>
  )
}
