'use client'

import { useLanguage } from '@/hooks/use-language'
import { Award, Users, Globe, Target, Eye, History } from 'lucide-react'

export function AboutClient() {
  const { lang } = useLanguage()

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <div className="bg-[#0d1b2a] py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl font-bold text-white mb-4">
            {lang === 'en' ? 'About Mr. Ismail Trading LLC' : 'عن شركة السيد إسماعيل للتجارة'}
          </h1>
          <p className="text-gray-400 max-w-2xl mx-auto text-lg">
            {lang === 'en'
              ? "Dubai's trusted wholesale partner for mobile phones and accessories since 2009"
              : 'الشريك الموثوق للجملة في دبي لهواتف الجوال والإكسسوارات منذ 2009'}
          </p>
        </div>
      </div>

      {/* Story */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <History className="w-6 h-6 text-[#c8a96e]" />
                <h2 className="text-2xl font-bold text-[#0d1b2a]">
                  {lang === 'en' ? 'Our Story' : 'قصتنا'}
                </h2>
              </div>
              <p className="text-gray-600 leading-relaxed mb-4">
                {lang === 'en'
                  ? 'Founded in 2009 in the heart of Dubai, Mr. Ismail Trading LLC started as a small mobile phone import/export business. Over 15 years, we\'ve grown into one of the UAE\'s most trusted B2B mobile trading companies, serving over 500 retailers and wholesalers across 30 countries.'
                  : 'تأسست عام 2009 في قلب دبي، بدأت شركة السيد إسماعيل للتجارة كمشروع صغير لاستيراد وتصدير الهواتف الجوال. على مدى 15 عاماً، نمونا لنصبح إحدى أكثر شركات تجارة الهواتف B2B موثوقية في الإمارات، نخدم أكثر من 500 تاجر جملة وتجزئة في 30 دولة.'}
              </p>
              <p className="text-gray-600 leading-relaxed">
                {lang === 'en'
                  ? 'Our deep relationships with manufacturers and authorized distributors of Samsung, Apple, Xiaomi, and Huawei allow us to offer our clients competitive pricing, genuine products, and reliable supply chains that keep their businesses running smoothly.'
                  : 'علاقاتنا العميقة مع الشركات المصنعة والموزعين المعتمدين لسامسونج وآبل وشاومي وهواوي تتيح لنا تقديم أسعار تنافسية ومنتجات أصلية وسلاسل توريد موثوقة تحافظ على استمرارية أعمال عملائنا.'}
              </p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {[
                { num: '15+', label: { en: 'Years in Business', ar: 'سنوات في العمل' } },
                { num: '500+', label: { en: 'Active Clients', ar: 'عميل نشط' } },
                { num: '30+', label: { en: 'Countries Served', ar: 'دولة نخدمها' } },
                { num: '2,500+', label: { en: 'SKUs Available', ar: 'منتج متاح' } },
              ].map(({ num, label }) => (
                <div key={num} className="bg-[#f8f4ee] rounded-xl p-6 text-center border border-[#c8a96e]/20">
                  <div className="text-3xl font-bold text-[#c8a96e]">{num}</div>
                  <div className="text-sm text-[#0d1b2a] mt-1 font-medium">{label[lang as 'en' | 'ar']}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white rounded-xl p-8 border border-gray-200">
              <div className="flex items-center gap-3 mb-4">
                <Target className="w-8 h-8 text-[#c8a96e]" />
                <h2 className="text-xl font-bold text-[#0d1b2a]">
                  {lang === 'en' ? 'Our Mission' : 'مهمتنا'}
                </h2>
              </div>
              <p className="text-gray-600 leading-relaxed">
                {lang === 'en'
                  ? 'To be the most reliable and efficient B2B mobile trading partner in the MENA region, enabling retailers and distributors to grow their businesses with genuine products, competitive pricing, and exceptional service.'
                  : 'أن نكون الشريك التجاري الأكثر موثوقية وكفاءة في تجارة الهواتف B2B في منطقة الشرق الأوسط وشمال أفريقيا، وتمكين تجار التجزئة والموزعين من تنمية أعمالهم بمنتجات أصلية وأسعار تنافسية وخدمة استثنائية.'}
              </p>
            </div>
            <div className="bg-[#0d1b2a] rounded-xl p-8">
              <div className="flex items-center gap-3 mb-4">
                <Eye className="w-8 h-8 text-[#c8a96e]" />
                <h2 className="text-xl font-bold text-white">
                  {lang === 'en' ? 'Our Vision' : 'رؤيتنا'}
                </h2>
              </div>
              <p className="text-gray-300 leading-relaxed">
                {lang === 'en'
                  ? 'To become the leading wholesale mobile technology trading company in the GCC by 2030, known for unmatched reliability, innovation in service delivery, and sustainable business practices.'
                  : 'أن نصبح شركة تجارة الجملة الرائدة في تكنولوجيا الهواتف في دول الخليج العربي بحلول 2030، المعروفة بالموثوقية التي لا مثيل لها والابتكار في تقديم الخدمات وممارسات الأعمال المستدامة.'}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Certifications */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold text-[#0d1b2a] mb-8 text-center">
            {lang === 'en' ? 'Certifications & Partners' : 'الشهادات والشركاء'}
          </h2>
          <div className="flex flex-wrap justify-center gap-6">
            {[
              'Samsung Authorized Distributor',
              'Apple Authorized Reseller',
              'ISO 9001:2015 Certified',
              'DED Licensed - Dubai',
              'TRA Approved - UAE',
              'Dubai Chamber Member',
            ].map((cert) => (
              <div
                key={cert}
                className="bg-gray-50 border border-gray-200 rounded-lg px-6 py-4 text-center"
              >
                <div className="w-8 h-8 bg-[#0d1b2a] rounded-full flex items-center justify-center mx-auto mb-2">
                  <Award className="w-4 h-4 text-[#c8a96e]" />
                </div>
                <p className="text-sm font-semibold text-[#0d1b2a]">{cert}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Location */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold text-[#0d1b2a] mb-6 text-center">
            {lang === 'en' ? 'Our Location' : 'موقعنا'}
          </h2>
          <div className="bg-[#0d1b2a] rounded-xl h-64 flex items-center justify-center">
            <div className="text-center">
              <Globe className="w-12 h-12 text-[#c8a96e] mx-auto mb-3" />
              <p className="text-white font-semibold">Sheikh Zayed Road, Dubai, UAE</p>
              <p className="text-gray-400 text-sm mt-1">
                {lang === 'en' ? 'Near Dubai Metro Station' : 'بالقرب من محطة مترو دبي'}
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
