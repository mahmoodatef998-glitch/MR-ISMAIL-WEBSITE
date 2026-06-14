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
      <footer className="bg-[#080503] border-t border-[#C4922A]/10">
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
                <li>
                  <a
                    href="/admin"
                    className="link-underline text-sm text-gray-500 hover:text-[#C4922A] transition-colors duration-200"
                  >
                    {lang === 'en' ? 'Admin Portal' : 'بوابة الإدارة'}
                  </a>
                </li>
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

      {/* WhatsApp floating button */}
      <m.a
        href="https://wa.me/971501234567"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="WhatsApp"
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 300, damping: 20, delay: 1.5 }}
        whileHover={{ scale: 1.12 }}
        whileTap={{ scale: 0.92 }}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full flex items-center justify-center shadow-2xl shadow-[#25D366]/30 bg-[#25D366] hover:bg-[#20bd5a] transition-colors duration-300"
      >
        <svg className="w-7 h-7 text-white" viewBox="0 0 24 24" fill="currentColor">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
        </svg>
      </m.a>
    </>
  )
}
