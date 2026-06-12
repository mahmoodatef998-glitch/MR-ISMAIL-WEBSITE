'use client'

import { useLanguage } from '@/hooks/use-language'
import { ArrowRight, Shield, Zap, Globe, PhoneCall, Sparkles } from 'lucide-react'

function scrollTo(id: string) {
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
}

export function HeroSection() {
  const { lang } = useLanguage()

  const stats = [
    { value: '15+', label: lang === 'en' ? 'Years in Business' : 'سنوات خبرة' },
    { value: '2,500+', label: lang === 'en' ? 'Products' : 'منتج' },
    { value: '500+', label: lang === 'en' ? 'Active Clients' : 'عميل نشط' },
    { value: '30+', label: lang === 'en' ? 'Countries' : 'دولة' },
  ]

  const trust = [
    { icon: Shield, label: lang === 'en' ? 'Genuine Products' : 'منتجات أصلية' },
    { icon: Zap, label: lang === 'en' ? 'Fast Shipping' : 'شحن سريع' },
    { icon: Globe, label: lang === 'en' ? '30+ Countries' : '+30 دولة' },
    { icon: PhoneCall, label: lang === 'en' ? '24/7 Support' : 'دعم مستمر' },
  ]

  return (
    <section id="home" className="relative min-h-screen flex items-center overflow-hidden bg-[#050b18]">

      {/* Animated background orbs */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(200,169,110,0.025)_1px,transparent_1px),linear-gradient(to_right,rgba(200,169,110,0.025)_1px,transparent_1px)] bg-[size:72px_72px]" />
        <div className="absolute top-1/4 -left-32 w-[700px] h-[700px] rounded-full bg-[#c8a96e]/6 blur-[140px] animate-float-slow" />
        <div className="absolute bottom-1/4 -right-32 w-[500px] h-[500px] rounded-full bg-blue-600/5 blur-[120px] animate-float-slower" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full bg-[#c8a96e]/3 blur-[160px]" />
        {/* Radial vignette */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_30%,#050b18_80%)]" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 pt-24 pb-20 w-full">
        <div className="max-w-5xl mx-auto text-center">

          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-[#c8a96e]/10 border border-[#c8a96e]/25 text-[#c8a96e] text-xs sm:text-sm font-semibold mb-8 animate-fade-in-up">
            <Sparkles className="w-3.5 h-3.5" />
            {lang === 'en'
              ? "UAE's Premier B2B Mobile Trading Company"
              : 'الشركة الأولى في الإمارات لتجارة الجملة بالأجهزة المحمولة'}
          </div>

          {/* Main Headline */}
          <h1 className="text-[2.75rem] sm:text-6xl lg:text-7xl font-black text-white leading-[1.04] tracking-tight mb-6">
            {lang === 'en' ? (
              <>
                Your Trusted Source for{' '}
                <span className="gold-text">Wholesale</span>
                <br className="hidden sm:block" />
                {' '}Mobile Devices
              </>
            ) : (
              <>
                مصدرك الموثوق
                <br className="hidden sm:block" />
                {' '}<span className="gold-text">لجملة</span>{' '}
                الأجهزة المحمولة
              </>
            )}
          </h1>

          {/* Subheadline */}
          <p className="text-base sm:text-lg text-gray-400 max-w-2xl mx-auto mb-10 leading-relaxed">
            {lang === 'en'
              ? 'Supplying genuine smartphones, accessories & spare parts across the GCC. Competitive wholesale pricing, flexible MOQ, and fast delivery from Dubai.'
              : 'نوفر هواتف وإكسسوارات وقطع غيار أصلية عبر دول الخليج. أسعار جملة تنافسية، كميات طلب مرنة، وتوصيل سريع من دبي.'}
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-14">
            <button
              onClick={() => scrollTo('contact')}
              className="group w-full sm:w-auto flex items-center justify-center gap-2.5 px-8 py-4 bg-gradient-to-r from-[#c8a96e] to-[#e8c97a] text-[#050b18] font-bold text-base rounded-xl hover:shadow-2xl hover:shadow-[#c8a96e]/30 transition-all duration-300 hover:-translate-y-0.5"
            >
              {lang === 'en' ? 'Request a Quote' : 'طلب عرض سعر'}
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
            <button
              onClick={() => scrollTo('products')}
              className="w-full sm:w-auto flex items-center justify-center gap-2.5 px-8 py-4 bg-white/[0.04] backdrop-blur-sm border border-white/10 text-white font-semibold text-base rounded-xl hover:bg-white/[0.08] hover:border-white/20 transition-all duration-300"
            >
              {lang === 'en' ? 'Browse Catalog' : 'تصفح الكتالوج'}
            </button>
          </div>

          {/* Trust badges */}
          <div className="flex flex-wrap items-center justify-center gap-5 mb-16">
            {trust.map(({ icon: Icon, label }) => (
              <div key={label} className="flex items-center gap-2 text-sm text-gray-500">
                <div className="w-7 h-7 rounded-lg bg-[#c8a96e]/10 border border-[#c8a96e]/15 flex items-center justify-center">
                  <Icon className="w-3.5 h-3.5 text-[#c8a96e]" />
                </div>
                {label}
              </div>
            ))}
          </div>

          {/* Stats bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-px bg-[#c8a96e]/10 rounded-2xl overflow-hidden border border-[#c8a96e]/10">
            {stats.map(({ value, label }) => (
              <div key={label} className="bg-[#050b18] px-4 py-5 text-center hover:bg-[#0a1628] transition-colors">
                <div className="text-2xl sm:text-3xl font-black gold-text">{value}</div>
                <div className="text-xs text-gray-500 mt-1">{label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Scroll hint */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2">
        <div className="w-px h-10 bg-gradient-to-b from-transparent via-[#c8a96e]/40 to-transparent animate-pulse mx-auto" />
      </div>
    </section>
  )
}
