'use client'

import { useLanguage } from '@/hooks/use-language'
import { ShieldCheck, Package, Truck, Headset, Award, Globe } from 'lucide-react'

export function WhyChooseUs() {
  const { lang } = useLanguage()

  const features = [
    {
      icon: Package,
      title: { en: 'Bulk Order Ready', ar: 'جاهز للطلبات الكبيرة' },
      desc: {
        en: 'Flexible MOQ from 10 to 10,000+ units with volume discounts',
        ar: 'حد أدنى مرن للطلب من 10 إلى 10,000+ وحدة مع خصومات على الحجم',
      },
    },
    {
      icon: ShieldCheck,
      title: { en: '12-Month Warranty', ar: 'ضمان 12 شهراً' },
      desc: {
        en: 'All products backed by manufacturer warranty and our quality guarantee',
        ar: 'جميع المنتجات مضمونة من الشركة المصنعة وضمان الجودة لدينا',
      },
    },
    {
      icon: Truck,
      title: { en: 'Fast UAE Delivery', ar: 'توصيل سريع في الإمارات' },
      desc: {
        en: 'Same-day dispatch within Dubai, 2-3 days UAE-wide, worldwide shipping available',
        ar: 'شحن في نفس اليوم داخل دبي، 2-3 أيام على مستوى الإمارات، شحن دولي متاح',
      },
    },
    {
      icon: Headset,
      title: { en: 'Dedicated Support', ar: 'دعم مخصص' },
      desc: {
        en: '24/7 WhatsApp support, dedicated account manager for wholesale clients',
        ar: 'دعم واتساب على مدار الساعة، مدير حساب مخصص لعملاء الجملة',
      },
    },
    {
      icon: Award,
      title: { en: 'Genuine Products', ar: 'منتجات أصلية' },
      desc: {
        en: '100% authentic products sourced directly from authorized distributors',
        ar: '100% منتجات أصلية مصدرها مباشرة من الموزعين المعتمدين',
      },
    },
    {
      icon: Globe,
      title: { en: 'Global Reach', ar: 'وصول عالمي' },
      desc: {
        en: 'Serving clients in 30+ countries with customs documentation support',
        ar: 'نخدم عملاء في أكثر من 30 دولة مع دعم وثائق الجمارك',
      },
    },
  ]

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-[#0d1b2a] mb-3">
            {lang === 'en' ? 'Why Choose Us?' : 'لماذا تختارنا؟'}
          </h2>
          <p className="text-gray-500 max-w-xl mx-auto">
            {lang === 'en'
              ? 'We\'ve been the trusted wholesale partner for mobile retailers across the GCC for over 15 years'
              : 'نحن الشريك الموثوق في الجملة لتجار الهواتف في منطقة الخليج لأكثر من 15 عاماً'}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map(({ icon: Icon, title, desc }) => (
            <div
              key={title.en}
              className="group p-6 rounded-xl border border-gray-200 hover:border-[#c8a96e] hover:shadow-md transition-all duration-300"
            >
              <div className="w-12 h-12 bg-[#0d1b2a] rounded-xl flex items-center justify-center mb-4 group-hover:bg-[#c8a96e] transition-colors">
                <Icon className="w-6 h-6 text-[#c8a96e] group-hover:text-[#0d1b2a] transition-colors" />
              </div>
              <h3 className="font-bold text-[#0d1b2a] mb-2">{title[lang as 'en' | 'ar']}</h3>
              <p className="text-gray-500 text-sm leading-relaxed">{desc[lang as 'en' | 'ar']}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
