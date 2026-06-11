'use client'

import Link from 'next/link'
import { useLanguage } from '@/hooks/use-language'
import { Phone, Mail, MapPin, MessageCircle } from 'lucide-react'

export function Footer() {
  const { t, lang } = useLanguage()

  return (
    <footer className="bg-[#0d1b2a] text-gray-300 mt-auto">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-[#c8a96e] rounded-lg flex items-center justify-center text-[#0d1b2a] font-bold">
                MI
              </div>
              <div>
                <div className="text-white font-bold">
                  {lang === 'ar' ? 'السيد إسماعيل للتجارة' : 'Mr. Ismail Trading LLC'}
                </div>
                <div className="text-[#c8a96e] text-xs">
                  {lang === 'ar' ? 'دبي، الإمارات العربية المتحدة' : 'Dubai, UAE'}
                </div>
              </div>
            </div>
            <p className="text-sm text-gray-400 leading-relaxed max-w-sm">
              {t.footer.description}
            </p>
            <div className="mt-4 space-y-2 text-sm">
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-[#c8a96e] shrink-0" />
                <span>+971 50 123 4567</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-[#c8a96e] shrink-0" />
                <span>info@mr-ismail-trading.ae</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-[#c8a96e] shrink-0" />
                <span>
                  {lang === 'ar'
                    ? 'شارع الشيخ زايد، دبي، الإمارات'
                    : 'Sheikh Zayed Road, Dubai, UAE'}
                </span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">
              {t.footer.quickLinks}
            </h4>
            <ul className="space-y-2 text-sm">
              {[
                { href: '/', label: t.nav.home },
                { href: '/products', label: t.nav.products },
                { href: '/about', label: t.nav.about },
                { href: '/contact', label: t.nav.contact },
                { href: '/request-quote', label: t.nav.requestQuote },
              ].map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-gray-400 hover:text-[#c8a96e] transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h4 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">
              {t.footer.categories}
            </h4>
            <ul className="space-y-2 text-sm">
              {[
                { href: '/products?category=Smartphones', label: t.categories.smartphones },
                { href: '/products?category=Accessories', label: t.categories.accessories },
                { href: '/products?category=Spare+Parts', label: t.categories.spareParts },
              ].map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-gray-400 hover:text-[#c8a96e] transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-[#1a2f45] flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-gray-500">
          <p>
            © {new Date().getFullYear()} Mr. Ismail Trading LLC.{' '}
            {t.footer.rights}
          </p>
          <p className="text-xs">
            {lang === 'ar' ? 'مرخص من دائرة التنمية الاقتصادية - دبي' : 'Licensed by DED - Dubai'}
          </p>
        </div>
      </div>

      {/* WhatsApp Floating Button */}
      <a
        href={`https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_NUMBER?.replace(/\+/g, '') || '971501234567'}`}
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 z-50 w-14 h-14 bg-green-500 hover:bg-green-600 text-white rounded-full flex items-center justify-center shadow-lg transition-transform hover:scale-110"
        aria-label="WhatsApp"
      >
        <MessageCircle className="w-7 h-7" />
      </a>
    </footer>
  )
}
