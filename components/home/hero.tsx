'use client'

import Link from 'next/link'
import { useLanguage } from '@/hooks/use-language'
import { Button } from '@/components/ui/button'
import { ArrowRight, ShieldCheck, Truck, Award, Users } from 'lucide-react'

export function Hero() {
  const { t, lang, isRTL } = useLanguage()

  return (
    <section className="relative bg-[#0d1b2a] overflow-hidden">
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: 'radial-gradient(circle at 1px 1px, #c8a96e 1px, transparent 0)',
          backgroundSize: '32px 32px'
        }} />
      </div>

      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-[#0d1b2a] via-[#0d1b2a]/95 to-[#0d1b2a]/70" />

      <div className="relative container mx-auto px-4 py-20 lg:py-28">
        <div className="max-w-3xl">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-[#c8a96e]/20 border border-[#c8a96e]/40 rounded-full px-4 py-1.5 mb-6">
            <span className="w-2 h-2 bg-[#c8a96e] rounded-full animate-pulse" />
            <span className="text-[#c8a96e] text-sm font-medium">{t.hero.badge}</span>
          </div>

          {/* Headline */}
          <h1 className={`text-4xl lg:text-6xl font-bold text-white leading-tight mb-6 ${isRTL ? 'text-right' : ''}`}>
            {t.hero.headline.split(' ').slice(0, 3).join(' ')}{' '}
            <span className="text-[#c8a96e]">
              {t.hero.headline.split(' ').slice(3).join(' ')}
            </span>
          </h1>

          <p className={`text-lg text-gray-300 mb-8 leading-relaxed max-w-xl ${isRTL ? 'text-right' : ''}`}>
            {t.hero.subheadline}
          </p>

          {/* CTAs */}
          <div className={`flex flex-wrap gap-4 mb-12 ${isRTL ? 'flex-row-reverse' : ''}`}>
            <Link href="/request-quote">
              <Button size="lg" className="group">
                {t.hero.cta}
                <ArrowRight className={`ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform ${isRTL ? 'rotate-180 mr-2 ml-0' : ''}`} />
              </Button>
            </Link>
            <Link href="/products">
              <Button size="lg" variant="outline">
                {t.hero.browse}
              </Button>
            </Link>
          </div>

          {/* Trust badges */}
          <div className={`flex flex-wrap gap-6 ${isRTL ? 'flex-row-reverse' : ''}`}>
            {[
              { icon: ShieldCheck, text: lang === 'en' ? 'Genuine Products' : 'منتجات أصلية' },
              { icon: Truck, text: lang === 'en' ? 'Fast Shipping' : 'شحن سريع' },
              { icon: Award, text: lang === 'en' ? 'ISO Certified' : 'معتمد ISO' },
              { icon: Users, text: lang === 'en' ? '500+ Clients' : '+500 عميل' },
            ].map(({ icon: Icon, text }) => (
              <div key={text} className="flex items-center gap-2 text-gray-400 text-sm">
                <Icon className="w-4 h-4 text-[#c8a96e]" />
                <span>{text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Stats bar */}
      <div className="relative border-t border-[#1a2f45] bg-[#060f18]">
        <div className="container mx-auto px-4 py-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            {[
              { number: '15+', label: t.stats.years },
              { number: '2,500+', label: t.stats.products },
              { number: '500+', label: t.stats.clients },
              { number: '30+', label: t.stats.countries },
            ].map(({ number, label }) => (
              <div key={label}>
                <div className="text-2xl font-bold text-[#c8a96e]">{number}</div>
                <div className="text-gray-400 text-sm mt-1">{label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
