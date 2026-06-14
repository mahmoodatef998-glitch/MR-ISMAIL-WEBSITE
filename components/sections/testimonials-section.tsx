'use client'

import { useLanguage } from '@/hooks/use-language'
import { Star, Quote } from 'lucide-react'
import { m } from 'framer-motion'
import { fadeUp, fadeLeft, fadeRight, stagger, scaleIn, viewportOnce } from '@/lib/motion'

const TESTIMONIALS = [
  {
    nameEn: 'Ahmed Al-Rashidi',
    nameAr: 'أحمد الراشدي',
    roleEn: 'CEO, TechMart Electronics',
    roleAr: 'الرئيس التنفيذي، تك مارت للإلكترونيات',
    country: 'Saudi Arabia',
    countryAr: 'المملكة العربية السعودية',
    flag: '🇸🇦',
    rating: 5,
    quoteEn: "Mr. Ismail Trading has been our go-to supplier for 4 years. Their pricing is unmatched in the GCC and every shipment arrives exactly as described. 100% genuine — we\'ve never had a counterfeit issue.",
    quoteAr: 'شركة السيد إسماعيل شريكنا المفضل منذ 4 سنوات. أسعارهم لا مثيل لها في الخليج وكل شحنة تصل كما وُصفت تمامًا. أصلية 100٪ — لم نواجه أي مشكلة تزوير قط.',
    highlight: true,
    orders: '200+ orders',
    ordersAr: '+200 طلب',
  },
  {
    nameEn: 'Emeka Okonkwo',
    nameAr: 'إيميكا أوكونكوو',
    roleEn: 'Director, Lagos Mobile Hub',
    roleAr: 'مدير، لاغوس موبايل هب',
    country: 'Nigeria',
    countryAr: 'نيجيريا',
    flag: '🇳🇬',
    rating: 5,
    quoteEn: 'Shipping to Nigeria used to be a nightmare with other suppliers. Mr. Ismail\'s team handled customs documentation perfectly and our DHL shipment cleared in 2 days. Outstanding.',
    quoteAr: 'الشحن إلى نيجيريا كان كابوسًا مع موردين آخرين. فريق السيد إسماعيل تعامل مع وثائق الجمارك بشكل مثالي وخلص شحننا من DHL في يومين. رائع.',
    highlight: false,
    orders: '85 orders',
    ordersAr: '85 طلب',
  },
  {
    nameEn: 'Wang Fang',
    nameAr: 'وانج فانج',
    roleEn: 'Procurement Manager, ShenzhenPro',
    roleAr: 'مدير المشتريات، شنتشن برو',
    country: 'China',
    countryAr: 'الصين',
    flag: '🇨🇳',
    rating: 5,
    quoteEn: 'We source Apple and Samsung from multiple suppliers globally. Mr. Ismail consistently offers the most competitive bulk pricing with zero compromise on authenticity.',
    quoteAr: 'نحن نشتري أجهزة Apple وSamsung من موردين متعددين حول العالم. يقدم السيد إسماعيل باستمرار أكثر أسعار الجملة تنافسية دون أي تنازل عن الأصالة.',
    highlight: false,
    orders: '320+ orders',
    ordersAr: '+320 طلب',
  },
  {
    nameEn: 'Khalid Al-Mansoori',
    nameAr: 'خالد المنصوري',
    roleEn: 'Owner, Gulf Device Center',
    roleAr: 'صاحب، مركز الجلف للأجهزة',
    country: 'UAE',
    countryAr: 'الإمارات',
    flag: '🇦🇪',
    rating: 5,
    quoteEn: 'Being in the UAE, we\'ve dealt with many Dubai traders. Mr. Ismail stands apart — transparent pricing, same-day responses, and genuine stock with original serial numbers every time.',
    quoteAr: 'بوصفنا في الإمارات، تعاملنا مع كثير من تجار دبي. السيد إسماعيل مختلف — أسعار شفافة، ردود في نفس اليوم، ومخزون أصلي بأرقام تسلسلية أصلية في كل مرة.',
    highlight: true,
    orders: '150+ orders',
    ordersAr: '+150 طلب',
  },
  {
    nameEn: 'James Thornton',
    nameAr: 'جيمس ثورنتون',
    roleEn: 'Buyer, Thornton Electronics Ltd.',
    roleAr: 'مشتري، ثورنتون إلكترونيكس',
    country: 'United Kingdom',
    countryAr: 'المملكة المتحدة',
    flag: '🇬🇧',
    rating: 5,
    quoteEn: 'We import refurbished and new devices to the UK. Mr. Ismail\'s wholesale prices beat any European distributor I\'ve found. Fast quote turnaround and excellent payment flexibility.',
    quoteAr: 'نستورد أجهزة مجددة وجديدة إلى المملكة المتحدة. أسعار الجملة لدى السيد إسماعيل تتفوق على أي موزع أوروبي وجدته. ردود سريعة على العروض ومرونة ممتازة في الدفع.',
    highlight: false,
    orders: '60+ orders',
    ordersAr: '+60 طلب',
  },
]

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          className={`w-3.5 h-3.5 ${i < rating ? 'text-[#c8a96e] fill-[#c8a96e]' : 'text-gray-600'}`}
        />
      ))}
    </div>
  )
}

export function TestimonialsSection() {
  const { lang } = useLanguage()

  const featured = TESTIMONIALS.filter((t) => t.highlight)
  const regular = TESTIMONIALS.filter((t) => !t.highlight)

  return (
    <section id="testimonials" className="py-24 bg-[#030810] overflow-hidden">
      <div className="section-divider mb-0" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-24">

        {/* Header */}
        <m.div
          className="text-center max-w-2xl mx-auto mb-16"
          variants={stagger(0, 0.12)}
          initial="hidden"
          whileInView="show"
          viewport={viewportOnce}
        >
          <m.p variants={fadeUp} className="text-[#c8a96e] text-xs font-bold uppercase tracking-[0.2em] mb-3 section-label">
            {lang === 'en' ? 'Client Stories' : 'قصص عملائنا'}
          </m.p>
          <m.h2 variants={fadeUp} className="text-3xl sm:text-4xl lg:text-5xl font-black text-white leading-tight mb-4">
            {lang === 'en' ? (
              <>Trusted by Buyers<br /><span className="gold-text">Across 30+ Countries</span></>
            ) : (
              <>موثوق به من مشترين<br /><span className="gold-text">في أكثر من 30 دولة</span></>
            )}
          </m.h2>
          <m.p variants={fadeUp} className="text-gray-500 text-sm leading-relaxed">
            {lang === 'en'
              ? 'Real feedback from wholesale buyers who trust us for their mobile device supply chains.'
              : 'آراء حقيقية من مشتري الجملة الذين يثقون بنا في سلاسل توريد أجهزتهم المحمولة.'}
          </m.p>
        </m.div>

        {/* Featured testimonials — large cards */}
        <m.div
          className="grid grid-cols-1 lg:grid-cols-2 gap-5 mb-5"
          variants={stagger(0.1, 0.15)}
          initial="hidden"
          whileInView="show"
          viewport={viewportOnce}
        >
          {featured.map((t, i) => (
            <m.div
              key={t.nameEn}
              variants={i === 0 ? fadeLeft : fadeRight}
              whileHover={{ y: -6, transition: { duration: 0.25, ease: 'easeOut' } }}
              className="group relative bg-gradient-to-br from-[#0d1e36] to-[#0a1628] border border-[#c8a96e]/15 rounded-2xl p-8 hover:border-[#c8a96e]/35 transition-all duration-300 overflow-hidden cursor-default"
            >
              {/* Glow */}
              <div className="absolute -top-16 -right-16 w-48 h-48 rounded-full bg-[#c8a96e]/0 group-hover:bg-[#c8a96e]/8 blur-3xl transition-all duration-500 pointer-events-none" />

              {/* Quote icon */}
              <div className="absolute top-6 right-6 opacity-[0.06] group-hover:opacity-[0.1] transition-opacity">
                <Quote className="w-16 h-16 text-[#c8a96e]" />
              </div>

              <div className="relative">
                <div className="flex items-start justify-between mb-5">
                  <StarRating rating={t.rating} />
                  <span className="text-[10px] font-bold text-[#c8a96e]/70 bg-[#c8a96e]/8 border border-[#c8a96e]/15 px-2.5 py-1 rounded-full uppercase tracking-wider">
                    {lang === 'en' ? t.orders : t.ordersAr}
                  </span>
                </div>

                <p className="text-gray-300 text-base leading-relaxed mb-7 italic">
                  "{lang === 'en' ? t.quoteEn : t.quoteAr}"
                </p>

                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#c8a96e]/15 border border-[#c8a96e]/20 flex items-center justify-center text-lg shrink-0">
                    {t.flag}
                  </div>
                  <div>
                    <p className="text-white font-bold text-sm">{lang === 'en' ? t.nameEn : t.nameAr}</p>
                    <p className="text-gray-500 text-xs">{lang === 'en' ? t.roleEn : t.roleAr}</p>
                  </div>
                  <div className="ml-auto text-right">
                    <p className="text-[10px] text-gray-600 uppercase tracking-wider">{lang === 'en' ? t.country : t.countryAr}</p>
                  </div>
                </div>
              </div>
            </m.div>
          ))}
        </m.div>

        {/* Regular testimonials — compact row */}
        <m.div
          className="grid grid-cols-1 sm:grid-cols-3 gap-5"
          variants={stagger(0.1, 0.12)}
          initial="hidden"
          whileInView="show"
          viewport={viewportOnce}
        >
          {regular.map((t) => (
            <m.div
              key={t.nameEn}
              variants={scaleIn}
              whileHover={{ y: -5, transition: { duration: 0.25, ease: 'easeOut' } }}
              className="group relative bg-[#0a1628] border border-white/[0.05] rounded-2xl p-6 hover:border-[#c8a96e]/20 hover:bg-[#0d1e36] transition-all duration-300 overflow-hidden cursor-default"
            >
              <div className="absolute -top-10 -right-10 w-32 h-32 rounded-full bg-[#c8a96e]/0 group-hover:bg-[#c8a96e]/6 blur-2xl transition-all duration-500 pointer-events-none" />

              <div className="relative">
                <div className="flex items-center justify-between mb-4">
                  <StarRating rating={t.rating} />
                  <span className="text-xs">{t.flag}</span>
                </div>

                <p className="text-gray-400 text-sm leading-relaxed mb-5 italic line-clamp-4">
                  "{lang === 'en' ? t.quoteEn : t.quoteAr}"
                </p>

                <div className="border-t border-white/[0.05] pt-4 flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-full bg-[#c8a96e]/10 border border-[#c8a96e]/15 flex items-center justify-center text-sm shrink-0">
                    {t.flag}
                  </div>
                  <div className="min-w-0">
                    <p className="text-white font-semibold text-xs truncate">{lang === 'en' ? t.nameEn : t.nameAr}</p>
                    <p className="text-gray-600 text-[10px] truncate">{lang === 'en' ? t.roleEn : t.roleAr}</p>
                  </div>
                  <span className="ml-auto shrink-0 text-[9px] font-bold text-[#c8a96e]/60 bg-[#c8a96e]/6 px-2 py-0.5 rounded-full">
                    {lang === 'en' ? t.orders : t.ordersAr}
                  </span>
                </div>
              </div>
            </m.div>
          ))}
        </m.div>

        {/* Trust summary bar */}
        <m.div
          variants={fadeUp}
          initial="hidden"
          whileInView="show"
          viewport={viewportOnce}
          className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-6 sm:gap-12 py-6 border-t border-white/[0.04]"
        >
          {[
            { value: '4.9/5', labelEn: 'Average Rating', labelAr: 'متوسط التقييم' },
            { value: '500+', labelEn: 'Verified Clients', labelAr: 'عميل موثق' },
            { value: '30+', labelEn: 'Countries', labelAr: 'دولة' },
          ].map(({ value, labelEn, labelAr }) => (
            <div key={value} className="text-center">
              <div className="text-2xl font-black gold-text mb-0.5">{value}</div>
              <div className="text-xs text-gray-600">{lang === 'en' ? labelEn : labelAr}</div>
            </div>
          ))}
        </m.div>
      </div>
    </section>
  )
}
