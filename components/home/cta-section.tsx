'use client'

import Link from 'next/link'
import { useLanguage } from '@/hooks/use-language'
import { Button } from '@/components/ui/button'
import { ArrowRight, MessageCircle } from 'lucide-react'

export function CTASection() {
  const { lang } = useLanguage()

  return (
    <section className="py-20 bg-[#0d1b2a] relative overflow-hidden">
      <div className="absolute inset-0 opacity-5">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: 'radial-gradient(circle at 1px 1px, #c8a96e 1px, transparent 0)',
            backgroundSize: '40px 40px',
          }}
        />
      </div>

      <div className="relative container mx-auto px-4 text-center">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4">
            {lang === 'en' ? 'Ready to Place a Wholesale Order?' : 'هل أنت مستعد لإجراء طلب جملة؟'}
          </h2>
          <p className="text-gray-300 text-lg mb-8 leading-relaxed">
            {lang === 'en'
              ? 'Get competitive wholesale pricing within 24 hours. No commitment, no minimum order for first inquiry.'
              : 'احصل على أسعار جملة تنافسية خلال 24 ساعة. بدون التزامات، بدون حد أدنى للاستفسار الأول.'}
          </p>

          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/request-quote">
              <Button size="xl" className="group">
                {lang === 'en' ? 'Request a Quote Now' : 'اطلب عرض سعر الآن'}
                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
            <a
              href={`https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_NUMBER?.replace(/\+/g, '') || '971501234567'}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button size="xl" variant="outline" className="group">
                <MessageCircle className="mr-2 w-5 h-5 text-green-400" />
                {lang === 'en' ? 'Chat on WhatsApp' : 'تحدث على واتساب'}
              </Button>
            </a>
          </div>

          <p className="mt-6 text-gray-500 text-sm">
            {lang === 'en'
              ? '⚡ Average response time: 2 hours during business hours'
              : '⚡ متوسط وقت الاستجابة: ساعتان خلال ساعات العمل'}
          </p>
        </div>
      </div>
    </section>
  )
}
