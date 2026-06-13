'use client'

import { useLanguage } from '@/hooks/use-language'
import { ArrowRight, Shield, Zap, Globe, PhoneCall, Sparkles } from 'lucide-react'
import { m } from 'framer-motion'
import { CountUp } from '@/components/ui/count-up'
import { fadeUp, fadeIn, stagger, viewportOnce } from '@/lib/motion'

function scrollTo(id: string) {
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
}

const statsData = [
  { value: 15, suffix: '+', en: 'Years in Business',  ar: 'سنوات خبرة'  },
  { value: 2500, suffix: '+', en: 'Products',          ar: 'منتج'         },
  { value: 500, suffix: '+', en: 'Active Clients',    ar: 'عميل نشط'    },
  { value: 30,  suffix: '+', en: 'Countries',         ar: 'دولة'         },
]

const trustItems = [
  { icon: Shield,    en: 'Genuine Products', ar: 'منتجات أصلية' },
  { icon: Zap,       en: 'Fast Shipping',    ar: 'شحن سريع'     },
  { icon: Globe,     en: '30+ Countries',    ar: '+30 دولة'     },
  { icon: PhoneCall, en: '24/7 Support',     ar: 'دعم مستمر'    },
]

export function HeroSection() {
  const { lang } = useLanguage()

  return (
    <section id="home" className="relative min-h-screen flex items-center overflow-hidden bg-[#050b18]">

      {/* Background — CSS-only, zero JS overhead */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(200,169,110,0.025)_1px,transparent_1px),linear-gradient(to_right,rgba(200,169,110,0.025)_1px,transparent_1px)] bg-[size:72px_72px]" />
        <div className="animate-float-slow absolute top-1/4 -left-32 w-[700px] h-[700px] rounded-full bg-[#c8a96e] blur-[140px] opacity-[0.07]" />
        <div className="animate-float-slower absolute bottom-1/4 -right-32 w-[500px] h-[500px] rounded-full bg-blue-600 blur-[120px] opacity-[0.06]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_30%,#050b18_80%)]" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 pt-24 pb-20 w-full">
        <m.div
          className="max-w-5xl mx-auto text-center"
          variants={stagger(0, 0.15)}
          initial="hidden"
          animate="show"
        >
          {/* Badge */}
          <m.div variants={fadeUp} className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-[#c8a96e]/10 border border-[#c8a96e]/25 text-[#c8a96e] text-xs sm:text-sm font-semibold mb-8">
            <Sparkles className="w-3.5 h-3.5" />
            {lang === 'en' ? "UAE's Premier B2B Mobile Trading Company" : 'الشركة الأولى في الإمارات لتجارة الجملة بالأجهزة المحمولة'}
          </m.div>

          {/* Headline */}
          <m.h1 variants={fadeUp} className="text-[2.75rem] sm:text-6xl lg:text-7xl font-black text-white leading-[1.04] tracking-tight mb-6">
            {lang === 'en' ? (
              <>Your Trusted Source for{' '}<span className="gold-text">Wholesale</span><br className="hidden sm:block" />{' '}Mobile Devices</>
            ) : (
              <>مصدرك الموثوق<br className="hidden sm:block" />{' '}<span className="gold-text">لجملة</span>{' '}الأجهزة المحمولة</>
            )}
          </m.h1>

          {/* Subtitle */}
          <m.p variants={fadeUp} className="text-base sm:text-lg text-gray-400 max-w-2xl mx-auto mb-10 leading-relaxed">
            {lang === 'en'
              ? 'Supplying genuine smartphones, accessories & spare parts across the GCC. Competitive wholesale pricing, flexible MOQ, and fast delivery from Dubai.'
              : 'نوفر هواتف وإكسسوارات وقطع غيار أصلية عبر دول الخليج. أسعار جملة تنافسية، كميات طلب مرنة، وتوصيل سريع من دبي.'}
          </m.p>

          {/* CTAs */}
          <m.div variants={fadeUp} className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-14">
            <m.button
              whileHover={{ scale: 1.03, y: -2 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => scrollTo('contact')}
              className="group btn-glow w-full sm:w-auto flex items-center justify-center gap-2.5 px-8 py-4 bg-gradient-to-r from-[#c8a96e] to-[#e8c97a] text-[#050b18] font-bold text-base rounded-xl shadow-lg shadow-[#c8a96e]/20 hover:shadow-2xl hover:shadow-[#c8a96e]/30 transition-shadow duration-300"
            >
              {lang === 'en' ? 'Request a Quote' : 'طلب عرض سعر'}
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </m.button>
            <m.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => scrollTo('products')}
              className="w-full sm:w-auto flex items-center justify-center gap-2.5 px-8 py-4 bg-white/[0.04] backdrop-blur-sm border border-white/10 text-white font-semibold text-base rounded-xl hover:bg-white/[0.08] hover:border-white/20 transition-all duration-300"
            >
              {lang === 'en' ? 'Browse Catalog' : 'تصفح الكتالوج'}
            </m.button>
          </m.div>

          {/* Trust badges */}
          <m.div variants={stagger(0, 0.08)} className="flex flex-wrap items-center justify-center gap-5 mb-16">
            {trustItems.map(({ icon: Icon, en, ar }) => (
              <m.div key={en} variants={fadeUp} className="flex items-center gap-2 text-sm text-gray-500">
                <div className="w-7 h-7 rounded-lg bg-[#c8a96e]/10 border border-[#c8a96e]/15 flex items-center justify-center">
                  <Icon className="w-3.5 h-3.5 text-[#c8a96e]" />
                </div>
                {lang === 'en' ? en : ar}
              </m.div>
            ))}
          </m.div>

          {/* Stats — CountUp */}
          <m.div variants={fadeUp} className="grid grid-cols-2 sm:grid-cols-4 gap-px bg-[#c8a96e]/10 rounded-2xl overflow-hidden border border-[#c8a96e]/10">
            {statsData.map(({ value, suffix, en, ar }) => (
              <m.div
                key={en}
                whileHover={{ backgroundColor: 'rgba(10,22,40,1)' }}
                className="bg-[#050b18] px-4 py-5 text-center transition-colors duration-200"
              >
                <div className="text-2xl sm:text-3xl font-black gold-text">
                  <CountUp end={value} suffix={suffix} duration={2} />
                </div>
                <div className="text-xs text-gray-500 mt-1">{lang === 'en' ? en : ar}</div>
              </m.div>
            ))}
          </m.div>
        </m.div>
      </div>

      {/* Scroll indicator — CSS pulse, no JS */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-pulse">
        <div className="w-px h-10 bg-gradient-to-b from-transparent via-[#c8a96e]/60 to-transparent" />
      </div>
    </section>
  )
}
