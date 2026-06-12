'use client'

import { useLanguage } from '@/hooks/use-language'
import { CheckCircle2, Award, Users, Globe2, TrendingUp } from 'lucide-react'

const MILESTONES = [
  { year: '2008', en: 'Founded in Dubai', ar: 'تأسست في دبي' },
  { year: '2012', en: 'Expanded to GCC region', ar: 'التوسع في دول الخليج' },
  { year: '2017', en: 'Became Samsung authorized distributor', ar: 'موزع معتمد لسامسونج' },
  { year: '2023', en: 'Serving 30+ countries worldwide', ar: 'خدمة +30 دولة حول العالم' },
]

const CERTS = [
  'Authorized Samsung Distributor',
  'Authorized Apple Reseller',
  'ISO 9001:2015 Certified',
  'DED Licensed — Dubai',
  'TRA Approved — UAE',
  'Dubai Chamber Member',
]

export function AboutSection() {
  const { lang } = useLanguage()

  return (
    <section id="about" className="py-24 bg-[#050b18]">
      <div className="section-divider mb-0" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

          {/* Left — Text */}
          <div>
            <p className="text-[#c8a96e] text-xs font-bold uppercase tracking-[0.2em] mb-3">
              {lang === 'en' ? 'About Us' : 'من نحن'}
            </p>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white leading-tight mb-6">
              {lang === 'en' ? (
                <>Trusted by Businesses<br /><span className="gold-text">Across the Globe</span></>
              ) : (
                <>موثوق به من قِبَل الشركات<br /><span className="gold-text">حول العالم</span></>
              )}
            </h2>
            <p className="text-gray-400 leading-relaxed mb-6">
              {lang === 'en'
                ? 'Mr. Ismail Trading LLC has been a leading wholesale supplier of mobile phones and accessories in the UAE since 2008. Based in Dubai, we serve retailers, distributors, and repair shops across the GCC and beyond.'
                : 'شركة السيد إسماعيل للتجارة ذ.م.م رائدة في توريد الأجهزة المحمولة والإكسسوارات بالجملة في الإمارات منذ 2008. نخدم تجار التجزئة والموزعين ومحلات الإصلاح عبر منطقة الخليج وخارجها.'}
            </p>
            <p className="text-gray-400 leading-relaxed mb-10">
              {lang === 'en'
                ? 'We partner directly with manufacturers and authorized distributors to ensure every product we supply is 100% genuine, warranty-backed, and competitively priced for bulk buyers.'
                : 'نتشارك مباشرة مع المصنّعين والموزعين المعتمدين لضمان أن كل منتج نوفره أصلي 100٪ ومضمون وبسعر تنافسي لمشتري الجملة.'}
            </p>

            {/* Timeline */}
            <div className="space-y-4">
              {MILESTONES.map((m) => (
                <div key={m.year} className="flex items-start gap-4">
                  <div className="shrink-0 w-14 h-7 flex items-center justify-center bg-[#c8a96e]/10 border border-[#c8a96e]/20 rounded-lg">
                    <span className="text-[#c8a96e] text-xs font-bold">{m.year}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-400 pt-0.5">
                    <CheckCircle2 className="w-4 h-4 text-[#c8a96e] shrink-0" />
                    {lang === 'ar' ? m.ar : m.en}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right — Cards */}
          <div className="space-y-4">

            {/* Big stat card */}
            <div className="bg-gradient-to-br from-[#c8a96e] to-[#e8c97a] rounded-2xl p-8 text-[#050b18]">
              <div className="flex items-center justify-between mb-4">
                <TrendingUp className="w-8 h-8 opacity-60" />
                <span className="text-[10px] font-bold uppercase tracking-widest opacity-60">
                  {lang === 'en' ? 'Growth' : 'نمو'}
                </span>
              </div>
              <div className="text-6xl font-black mb-1">15+</div>
              <div className="font-semibold opacity-80">
                {lang === 'en' ? 'Years of trusted wholesale excellence' : 'سنة من التميز في تجارة الجملة'}
              </div>
            </div>

            {/* Two small cards */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-[#0a1628] border border-white/[0.06] rounded-2xl p-6 text-center">
                <Users className="w-6 h-6 text-[#c8a96e] mx-auto mb-3" />
                <div className="text-3xl font-black text-white mb-1">500+</div>
                <div className="text-xs text-gray-500">{lang === 'en' ? 'Active Business Clients' : 'عميل نشط'}</div>
              </div>
              <div className="bg-[#0a1628] border border-white/[0.06] rounded-2xl p-6 text-center">
                <Globe2 className="w-6 h-6 text-[#c8a96e] mx-auto mb-3" />
                <div className="text-3xl font-black text-white mb-1">30+</div>
                <div className="text-xs text-gray-500">{lang === 'en' ? 'Countries Worldwide' : 'دولة حول العالم'}</div>
              </div>
            </div>

            {/* Certifications */}
            <div className="bg-[#0a1628] border border-white/[0.06] rounded-2xl p-6">
              <div className="flex items-center gap-2 mb-4">
                <Award className="w-4 h-4 text-[#c8a96e]" />
                <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                  {lang === 'en' ? 'Certifications & Partnerships' : 'الشهادات والشراكات'}
                </span>
              </div>
              <div className="flex flex-wrap gap-2">
                {CERTS.map((c) => (
                  <span key={c} className="px-3 py-1.5 bg-white/[0.04] border border-[#c8a96e]/15 text-[#c8a96e] text-[11px] font-medium rounded-full">
                    {c}
                  </span>
                ))}
              </div>
            </div>

          </div>
        </div>
      </div>
    </section>
  )
}
