'use client'

import { useLanguage } from '@/hooks/use-language'
import { CheckCircle2, Award, Users, Globe2, TrendingUp } from 'lucide-react'
import { motion } from 'framer-motion'
import { CountUp } from '@/components/ui/count-up'
import { fadeUp, fadeLeft, fadeRight, stagger, scaleIn, viewportOnce } from '@/lib/motion'

const MILESTONES = [
  { year: '2008', en: 'Founded in Dubai', ar: 'تأسست في دبي' },
  { year: '2012', en: 'Expanded to GCC region', ar: 'التوسع في دول الخليج' },
  { year: '2017', en: 'Became Samsung authorized distributor', ar: 'موزع معتمد لسامسونج' },
  { year: '2023', en: 'Serving 30+ countries worldwide', ar: 'خدمة +30 دولة حول العالم' },
]

const CERTS = [
  'Authorized Samsung Distributor', 'Authorized Apple Reseller',
  'ISO 9001:2015 Certified', 'DED Licensed — Dubai',
  'TRA Approved — UAE', 'Dubai Chamber Member',
]

export function AboutSection() {
  const { lang } = useLanguage()

  return (
    <section id="about" className="py-24 bg-[#050b18]">
      <div className="section-divider mb-0" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

          {/* Left */}
          <motion.div
            variants={stagger(0, 0.12)}
            initial="hidden"
            whileInView="show"
            viewport={viewportOnce}
          >
            <motion.p variants={fadeLeft} className="text-[#c8a96e] text-xs font-bold uppercase tracking-[0.2em] mb-3 section-label">
              {lang === 'en' ? 'About Us' : 'من نحن'}
            </motion.p>
            <motion.h2 variants={fadeLeft} className="text-3xl sm:text-4xl lg:text-5xl font-black text-white leading-tight mb-6">
              {lang === 'en' ? (<>Trusted by Businesses<br /><span className="gold-text">Across the Globe</span></>) : (<>موثوق به من قِبَل الشركات<br /><span className="gold-text">حول العالم</span></>)}
            </motion.h2>
            <motion.p variants={fadeLeft} className="text-gray-400 leading-relaxed mb-6">
              {lang === 'en'
                ? 'Mr. Ismail Trading LLC has been a leading wholesale supplier of mobile phones and accessories in the UAE since 2008. Based in Dubai, we serve retailers, distributors, and repair shops across the GCC and beyond.'
                : 'شركة السيد إسماعيل للتجارة ذ.م.م رائدة في توريد الأجهزة المحمولة والإكسسوارات بالجملة في الإمارات منذ 2008.'}
            </motion.p>
            <motion.p variants={fadeLeft} className="text-gray-400 leading-relaxed mb-10">
              {lang === 'en'
                ? 'We partner directly with manufacturers and authorized distributors to ensure every product we supply is 100% genuine, warranty-backed, and competitively priced for bulk buyers.'
                : 'نتشارك مباشرة مع المصنّعين والموزعين المعتمدين لضمان أن كل منتج نوفره أصلي 100٪ ومضمون وبسعر تنافسي.'}
            </motion.p>

            {/* Timeline */}
            <motion.div className="space-y-4" variants={stagger(0, 0.1)}>
              {MILESTONES.map((m, i) => (
                <motion.div
                  key={m.year}
                  variants={fadeLeft}
                  className="flex items-start gap-4 group"
                >
                  <motion.div
                    whileHover={{ scale: 1.1 }}
                    className="shrink-0 w-14 h-7 flex items-center justify-center bg-[#c8a96e]/10 border border-[#c8a96e]/20 rounded-lg group-hover:bg-[#c8a96e]/20 transition-colors"
                  >
                    <span className="text-[#c8a96e] text-xs font-bold">{m.year}</span>
                  </motion.div>
                  <div className="flex items-center gap-2 text-sm text-gray-400 pt-0.5">
                    <CheckCircle2 className="w-4 h-4 text-[#c8a96e] shrink-0" />
                    {lang === 'ar' ? m.ar : m.en}
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>

          {/* Right */}
          <motion.div
            className="space-y-4"
            variants={stagger(0, 0.15)}
            initial="hidden"
            whileInView="show"
            viewport={viewportOnce}
          >
            {/* Big gold card */}
            <motion.div
              variants={fadeRight}
              whileHover={{ scale: 1.02, transition: { duration: 0.3 } }}
              className="bg-gradient-to-br from-[#c8a96e] to-[#e8c97a] rounded-2xl p-8 text-[#050b18] shadow-2xl shadow-[#c8a96e]/20"
            >
              <div className="flex items-center justify-between mb-4">
                <TrendingUp className="w-8 h-8 opacity-60" />
                <span className="text-[10px] font-bold uppercase tracking-widest opacity-60">
                  {lang === 'en' ? 'Growth' : 'نمو'}
                </span>
              </div>
              <div className="text-6xl font-black mb-1">
                <CountUp end={15} suffix="+" duration={2.5} />
              </div>
              <div className="font-semibold opacity-80">
                {lang === 'en' ? 'Years of trusted wholesale excellence' : 'سنة من التميز في تجارة الجملة'}
              </div>
            </motion.div>

            {/* Two stat cards */}
            <div className="grid grid-cols-2 gap-4">
              {[
                { icon: Users, value: 500, suffix: '+', en: 'Active Business Clients', ar: 'عميل نشط' },
                { icon: Globe2, value: 30, suffix: '+', en: 'Countries Worldwide', ar: 'دولة حول العالم' },
              ].map(({ icon: Icon, value, suffix, en, ar }) => (
                <motion.div
                  key={en}
                  variants={scaleIn}
                  whileHover={{ y: -4, transition: { duration: 0.25 } }}
                  className="bg-[#0a1628] border border-white/[0.06] rounded-2xl p-6 text-center hover:border-[#c8a96e]/20 transition-colors"
                >
                  <Icon className="w-6 h-6 text-[#c8a96e] mx-auto mb-3" />
                  <div className="text-3xl font-black text-white mb-1">
                    <CountUp end={value} suffix={suffix} duration={2} />
                  </div>
                  <div className="text-xs text-gray-500">{lang === 'en' ? en : ar}</div>
                </motion.div>
              ))}
            </div>

            {/* Certifications */}
            <motion.div
              variants={fadeRight}
              className="bg-[#0a1628] border border-white/[0.06] rounded-2xl p-6 hover:border-[#c8a96e]/15 transition-colors"
            >
              <div className="flex items-center gap-2 mb-4">
                <Award className="w-4 h-4 text-[#c8a96e]" />
                <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                  {lang === 'en' ? 'Certifications & Partnerships' : 'الشهادات والشراكات'}
                </span>
              </div>
              <motion.div
                className="flex flex-wrap gap-2"
                variants={stagger(0, 0.06)}
              >
                {CERTS.map((c, i) => (
                  <motion.span
                    key={c}
                    variants={scaleIn}
                    whileHover={{ scale: 1.05 }}
                    className="px-3 py-1.5 bg-white/[0.04] border border-[#c8a96e]/15 text-[#c8a96e] text-[11px] font-medium rounded-full hover:bg-[#c8a96e]/10 transition-colors cursor-default"
                  >
                    {c}
                  </motion.span>
                ))}
              </motion.div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
