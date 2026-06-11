'use client'

import { useState } from 'react'
import { useLanguage } from '@/hooks/use-language'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { submitContact } from '@/app/actions/contact'
import { Phone, Mail, MapPin, Clock, MessageCircle, Loader2, CheckCircle } from 'lucide-react'
import { toast } from '@/hooks/use-toast'

export function ContactClient() {
  const { t, lang } = useLanguage()
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', subject: '', message: '' })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    try {
      const result = await submitContact(formData)
      if (result.success) {
        setSubmitted(true)
        toast({ title: lang === 'en' ? 'Message sent!' : 'تم الإرسال!', variant: 'success' as any })
      } else {
        toast({ title: result.error || 'Error', variant: 'destructive' })
      }
    } catch {
      toast({ title: 'Something went wrong', variant: 'destructive' })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-[#0d1b2a] py-12">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-3xl font-bold text-white mb-3">{t.contact.title}</h1>
          <p className="text-gray-400">{t.contact.subtitle}</p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Form */}
          <div className="lg:col-span-2 bg-white rounded-xl border border-gray-200 p-8">
            {submitted ? (
              <div className="text-center py-10">
                <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-[#0d1b2a] mb-2">
                  {lang === 'en' ? 'Message Sent!' : 'تم إرسال الرسالة!'}
                </h3>
                <p className="text-gray-500">
                  {lang === 'en' ? "We'll get back to you within 24 hours." : 'سنتواصل معك خلال 24 ساعة.'}
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <Label className="text-xs font-medium text-gray-600 mb-1.5 block">
                      {t.contact.form.name} *
                    </Label>
                    <Input
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label className="text-xs font-medium text-gray-600 mb-1.5 block">
                      {t.contact.form.email} *
                    </Label>
                    <Input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label className="text-xs font-medium text-gray-600 mb-1.5 block">
                      {t.contact.form.phone}
                    </Label>
                    <Input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label className="text-xs font-medium text-gray-600 mb-1.5 block">
                      {t.contact.form.subject} *
                    </Label>
                    <Input
                      required
                      value={formData.subject}
                      onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    />
                  </div>
                </div>
                <div>
                  <Label className="text-xs font-medium text-gray-600 mb-1.5 block">
                    {t.contact.form.message} *
                  </Label>
                  <Textarea
                    required
                    rows={5}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  />
                </div>
                <Button type="submit" size="lg" className="w-full" disabled={isSubmitting}>
                  {isSubmitting ? (
                    <><Loader2 className="mr-2 w-4 h-4 animate-spin" />{lang === 'en' ? 'Sending...' : 'جاري الإرسال...'}</>
                  ) : (
                    t.contact.form.send
                  )}
                </Button>
              </form>
            )}
          </div>

          {/* Contact Info */}
          <div className="space-y-5">
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h3 className="font-bold text-[#0d1b2a] mb-4">
                {lang === 'en' ? 'Get In Touch' : 'تواصل معنا'}
              </h3>
              <div className="space-y-4">
                {[
                  { icon: Phone, label: t.contact.info.phone, value: '+971 50 123 4567' },
                  { icon: Mail, label: t.contact.info.email, value: 'info@mr-ismail-trading.ae' },
                  {
                    icon: MapPin,
                    label: t.contact.info.address,
                    value: lang === 'en' ? 'Sheikh Zayed Road, Dubai, UAE' : 'شارع الشيخ زايد، دبي، الإمارات',
                  },
                  { icon: Clock, label: t.contact.info.hours, value: t.contact.info.hoursValue },
                ].map(({ icon: Icon, label, value }) => (
                  <div key={label} className="flex gap-3">
                    <div className="w-9 h-9 bg-[#f8f4ee] rounded-lg flex items-center justify-center flex-shrink-0">
                      <Icon className="w-4 h-4 text-[#c8a96e]" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-400">{label}</p>
                      <p className="text-sm font-medium text-[#0d1b2a]">{value}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <a
              href="https://wa.me/971501234567"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 bg-green-500 hover:bg-green-600 text-white rounded-xl p-4 transition-colors"
            >
              <MessageCircle className="w-6 h-6" />
              <div>
                <p className="font-semibold text-sm">WhatsApp</p>
                <p className="text-xs text-green-100">+971 50 123 4567</p>
              </div>
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
