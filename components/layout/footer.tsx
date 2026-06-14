'use client'

import { useLanguage } from '@/hooks/use-language'
import { Phone, Mail, MapPin } from 'lucide-react'
import { m } from 'framer-motion'
import { fadeUp, fadeLeft, stagger, scaleIn, viewportOnce } from '@/lib/motion'

function scrollTo(id: string) {
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
}

export function Footer() {
  const { lang } = useLanguage()

  const links = [
    { id: 'home',     en: 'Home',      ar: 'الرئيسية' },
    { id: 'products', en: 'Products',  ar: 'المنتجات' },
    { id: 'about',    en: 'About Us',  ar: 'من نحن'   },
    { id: 'contact',  en: 'Contact',   ar: 'تواصل'    },
  ]

  const categories = [
    { key: 'Smartphones', en: 'Smartphones',  ar: 'هواتف ذكية' },
    { key: 'Accessories', en: 'Accessories',  ar: 'إكسسوارات'  },
    { key: 'Spare Parts', en: 'Spare Parts',  ar: 'قطع غيار'   },
  ]

  return (
    <>
      <footer className="relative bg-[#080503] border-t border-[#C4922A]/10 overflow-hidden">
        {/* Subtle footer glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-px bg-gradient-to-r from-transparent via-[#C4922A]/30 to-transparent" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-40 bg-[#C4922A]/3 blur-[80px] rounded-full pointer-events-none" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-16">
          <m.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10"
            variants={stagger(0.1, 0.12)}
            initial="hidden"
            whileInView="show"
            viewport={viewportOnce}
          >

            {/* Brand */}
            <m.div variants={fadeLeft} className="lg:col-span-2">
              <a
                href="#home"
                onClick={(e) => { e.preventDefault(); scrollTo('home') }}
                className="inline-flex items-center gap-3 mb-5 group"
              >
                <m.div
                  whileHover={{ rotate: 5, scale: 1.05 }}
                  className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#C4922A] to-[#D4A840] flex items-center justify-center shadow-lg shadow-[#C4922A]/20"
                >
                  <span className="text-[#0A0705] font-black text-sm tracking-tighter">MI</span>
                </m.div>
                <div className="leading-tight">
                  <div className="text-white font-bold text-sm">Mr. Ismail Trading</div>
                  <div className="text-[#C4922A] text-[10px] tracking-widest uppercase">Wholesale Mobile Devices</div>
                </div>
              </a>

              <p className="text-gray-500 text-sm leading-relaxed max-w-sm mb-6">
                {lang === 'en'
                  ? "Dubai's leading B2B wholesale supplier of genuine mobile phones, accessories, and spare parts. Serving 30+ countries since 2008."
                  : 'المورد الرائد في دبي لتجارة الجملة B2B للهواتف المحمولة والإكسسوارات وقطع الغيار الأصلية. نخدم أكثر من 30 دولة منذ 2008.'}
              </p>

              <div className="space-y-2.5">
                {[
                  { icon: MapPin, text: lang === 'en' ? 'Al Ras, Deira, Dubai — UAE' : 'الرأس، ديرة، دبي — الإمارات' },
                  { icon: Phone, text: '+971 50 123 4567' },
                  { icon: Mail, text: 'sales@mr-ismail-trading.ae' },
                ].map(({ icon: Icon, text }) => (
                  <div key={text} className="flex items-center gap-2.5 text-sm text-gray-400">
                    <Icon className="w-3.5 h-3.5 text-[#C4922A] shrink-0" />
                    {text}
                  </div>
                ))}
              </div>
            </m.div>

            {/* Quick Links */}
            <m.div variants={fadeUp}>
              <h4 className="text-white text-xs font-bold uppercase tracking-[0.15em] mb-5">
                {lang === 'en' ? 'Quick Links' : 'روابط سريعة'}
              </h4>
              <ul className="space-y-3">
                {links.map((l) => (
                  <li key={l.id}>
                    <a
                      href={`#${l.id}`}
                      onClick={(e) => { e.preventDefault(); scrollTo(l.id) }}
                      className="link-underline text-sm text-gray-500 hover:text-[#C4922A] transition-colors duration-200"
                    >
                      {lang === 'ar' ? l.ar : l.en}
                    </a>
                  </li>
                ))}
              </ul>
            </m.div>

            {/* Categories */}
            <m.div variants={fadeUp}>
              <h4 className="text-white text-xs font-bold uppercase tracking-[0.15em] mb-5">
                {lang === 'en' ? 'Categories' : 'الفئات'}
              </h4>
              <ul className="space-y-3">
                {categories.map((c) => (
                  <li key={c.key}>
                    <a
                      href="#products"
                      onClick={(e) => { e.preventDefault(); scrollTo('products') }}
                      className="link-underline text-sm text-gray-500 hover:text-[#C4922A] transition-colors duration-200"
                    >
                      {lang === 'ar' ? c.ar : c.en}
                    </a>
                  </li>
                ))}
              </ul>

              {/* Trust badges */}
              <m.div
                className="mt-8 flex flex-wrap gap-1.5"
                variants={stagger(0.05, 0.07)}
              >
                {['Authorized Samsung Distributor', 'ISO 9001:2015', 'DED Licensed'].map((b) => (
                  <m.div
                    key={b}
                    variants={scaleIn}
                    whileHover={{ scale: 1.05 }}
                    className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-[#C4922A]/6 border border-[#C4922A]/12 rounded-full text-[10px] font-medium text-[#C4922A]"
                  >
                    {b}
                  </m.div>
                ))}
              </m.div>
            </m.div>
          </m.div>

          {/* Bottom bar */}
          <m.div
            variants={fadeUp}
            initial="hidden"
            whileInView="show"
            viewport={viewportOnce}
            className="mt-12 pt-6 border-t border-white/[0.05] flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-gray-600"
          >
            <p>© {new Date().getFullYear()} Mr. Ismail Trading LLC. {lang === 'en' ? 'All rights reserved.' : 'جميع الحقوق محفوظة.'}</p>
            <p>{lang === 'en' ? 'Licensed by DED — Dubai · TRA Approved · Dubai Chamber Member' : 'مرخص من دائرة التنمية الاقتصادية · معتمد من هيئة تنظيم الاتصالات · عضو غرفة تجارة دبي'}</p>
          </m.div>
        </div>
      </footer>

    </>
  )
}
