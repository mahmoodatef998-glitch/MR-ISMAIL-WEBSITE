'use client'

import { useLanguage } from '@/hooks/use-language'
import { Shield, Zap, Globe2, HeadphonesIcon, BadgeCheck, Package } from 'lucide-react'
import { motion } from 'framer-motion'
import { fadeUp, fadeIn, stagger, viewportOnce } from '@/lib/motion'

const FEATURES = [
  {
    icon: BadgeCheck,
    en: { title: '100% Genuine Products', desc: 'Every item is sourced directly from authorized manufacturers and official distributors — no counterfeits, ever.' },
    ar: { title: 'منتجات أصلية 100٪', desc: 'كل منتج مصدره مباشرة من الشركات المصنّعة المعتمدة — لا بضائع مقلّدة أبدًا.' },
  },
  {
    icon: Zap,
    en: { title: 'Fast Global Shipping', desc: 'Orders processed within 24 hours. We ship worldwide with DHL, FedEx, and Aramex — with full tracking.' },
    ar: { title: 'شحن عالمي سريع', desc: 'تُعالَج الطلبات خلال 24 ساعة، مع الشحن العالمي عبر DHL وFedEx وAramex مع تتبّع كامل.' },
  },
  {
    icon: Shield,
    en: { title: 'Warranty Guaranteed', desc: 'All products come with full manufacturer warranty. We handle after-sales support so you can sell with confidence.' },
    ar: { title: 'ضمان الشركة المصنّعة', desc: 'جميع المنتجات مصحوبة بضمان كامل من الشركة المصنّعة، ونتولى دعم ما بعد البيع.' },
  },
  {
    icon: Package,
    en: { title: 'Flexible MOQ', desc: 'Start small or order by the pallet. We accommodate retailers, distributors, and repair shops of every size.' },
    ar: { title: 'حد أدنى مرن للطلب', desc: 'ابدأ بكميات صغيرة أو اطلب بالأطنان — نستوعب تجار التجزئة والموزعين ومحلات الإصلاح بكل أحجامها.' },
  },
  {
    icon: Globe2,
    en: { title: '30+ Countries Served', desc: 'Our logistics network spans the GCC, Africa, Europe, and Southeast Asia — we know how to get products to you.' },
    ar: { title: 'خدمة أكثر من 30 دولة', desc: 'شبكتنا اللوجستية تشمل الخليج وأفريقيا وأوروبا وجنوب شرق آسيا — نعرف كيف نوصل البضائع إليك.' },
  },
  {
    icon: HeadphonesIcon,
    en: { title: '24/7 Dedicated Support', desc: 'Your dedicated account manager is always reachable via WhatsApp, email, or phone — whatever works for you.' },
    ar: { title: 'دعم مخصص على مدار الساعة', desc: 'مدير حسابك المخصص دائمًا في متناولك عبر واتساب أو البريد الإلكتروني أو الهاتف.' },
  },
]

export function FeaturesSection() {
  const { lang } = useLanguage()

  return (
    <section id="features" className="py-24 bg-[#030810]">
      <div className="section-divider mb-0" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-24">
        {/* Header */}
        <motion.div
          className="text-center max-w-2xl mx-auto mb-16"
          variants={stagger(0, 0.12)}
          initial="hidden"
          whileInView="show"
          viewport={viewportOnce}
        >
          <motion.p variants={fadeUp} className="text-[#c8a96e] text-xs font-bold uppercase tracking-[0.2em] mb-3 section-label">
            {lang === 'en' ? 'Why Choose Us' : 'لماذا تختارنا'}
          </motion.p>
          <motion.h2 variants={fadeUp} className="text-3xl sm:text-4xl lg:text-5xl font-black text-white leading-tight mb-4">
            {lang === 'en' ? (<>Built for Businesses<br /><span className="gold-text">That Demand More</span></>) : (<>مبني للشركات التي<br /><span className="gold-text">تطلب الأفضل</span></>)}
          </motion.h2>
          <motion.p variants={fadeUp} className="text-gray-500 text-sm leading-relaxed">
            {lang === 'en' ? 'Fifteen years of wholesale experience distilled into a supply chain that just works.' : 'خمسة عشر عامًا من الخبرة في الجملة تتجلى في سلسلة توريد تعمل بكفاءة.'}
          </motion.p>
        </motion.div>

        {/* Cards */}
        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5"
          variants={stagger(0.1, 0.1)}
          initial="hidden"
          whileInView="show"
          viewport={viewportOnce}
        >
          {FEATURES.map(({ icon: Icon, en, ar }, i) => {
            const content = lang === 'ar' ? ar : en
            return (
              <motion.div
                key={i}
                variants={fadeUp}
                whileHover={{ y: -6, transition: { duration: 0.25, ease: 'easeOut' } }}
                className="group card-shimmer relative bg-[#0a1628] border border-white/[0.05] rounded-2xl p-7 hover:border-[#c8a96e]/25 hover:bg-[#0d1e36] transition-colors duration-300 overflow-hidden"
              >
                <div className="absolute -top-10 -right-10 w-32 h-32 rounded-full bg-[#c8a96e]/0 group-hover:bg-[#c8a96e]/6 blur-2xl transition-all duration-500" />
                <div className="relative">
                  <motion.div
                    whileHover={{ rotate: [0, -8, 8, 0], transition: { duration: 0.4 } }}
                    className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-[#c8a96e]/10 border border-[#c8a96e]/15 mb-5 group-hover:bg-[#c8a96e]/15 group-hover:border-[#c8a96e]/30 transition-all duration-300"
                  >
                    <Icon className="w-5 h-5 text-[#c8a96e]" />
                  </motion.div>
                  <h3 className="text-white font-bold text-base mb-2.5 group-hover:text-[#c8a96e] transition-colors duration-200">{content.title}</h3>
                  <p className="text-gray-500 text-sm leading-relaxed">{content.desc}</p>
                </div>
              </motion.div>
            )
          })}
        </motion.div>
      </div>
    </section>
  )
}
