'use client'

import Link from 'next/link'
import { useState } from 'react'
import { useLanguage } from '@/hooks/use-language'
import { Button } from '@/components/ui/button'
import { Menu, X, Globe } from 'lucide-react'

export function Navbar() {
  const { t, lang, setLang, isRTL } = useLanguage()
  const [isOpen, setIsOpen] = useState(false)

  const navLinks = [
    { href: '/', label: t.nav.home },
    { href: '/products', label: t.nav.products },
    { href: '/about', label: t.nav.about },
    { href: '/contact', label: t.nav.contact },
  ]

  return (
    <header className="sticky top-0 z-50 w-full">
      {/* Top bar */}
      <div className="bg-[#c8a96e] text-[#0d1b2a] py-1.5 px-4 text-xs text-center font-medium">
        {lang === 'en'
          ? '📞 Wholesale Inquiries: +971 50 123 4567 | ✉ info@mr-ismail-trading.ae'
          : '📞 استفسارات الجملة: +971 50 123 4567 | ✉ info@mr-ismail-trading.ae'}
      </div>

      {/* Main navbar */}
      <nav className="bg-[#0d1b2a] border-b border-[#1a2f45]">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-3">
              <div className="w-10 h-10 bg-[#c8a96e] rounded-lg flex items-center justify-center text-[#0d1b2a] font-bold text-lg">
                MI
              </div>
              <div className="hidden sm:block">
                <div className="text-white font-bold text-sm leading-tight">
                  {lang === 'ar' ? 'السيد إسماعيل للتجارة' : 'Mr. Ismail Trading'}
                </div>
                <div className="text-[#c8a96e] text-xs">
                  {lang === 'ar' ? 'دبي، الإمارات' : 'Dubai, UAE'}
                </div>
              </div>
            </Link>

            {/* Desktop Nav */}
            <div className={`hidden md:flex items-center gap-6 ${isRTL ? 'flex-row-reverse' : ''}`}>
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-gray-300 hover:text-[#c8a96e] transition-colors text-sm font-medium"
                >
                  {link.label}
                </Link>
              ))}
            </div>

            {/* Right side actions */}
            <div className={`hidden md:flex items-center gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
              {/* Language Toggle */}
              <button
                onClick={() => setLang(lang === 'en' ? 'ar' : 'en')}
                className="flex items-center gap-1.5 text-gray-300 hover:text-[#c8a96e] transition-colors text-sm"
              >
                <Globe className="w-4 h-4" />
                <span>{lang === 'en' ? 'العربية' : 'English'}</span>
              </button>

              <Link href="/request-quote">
                <Button size="sm" className="bg-[#c8a96e] text-[#0d1b2a] hover:bg-[#b8975e] font-semibold">
                  {t.nav.requestQuote}
                </Button>
              </Link>
            </div>

            {/* Mobile menu button */}
            <button
              className="md:hidden text-white p-2"
              onClick={() => setIsOpen(!isOpen)}
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {isOpen && (
          <div className="md:hidden bg-[#0d1b2a] border-t border-[#1a2f45] pb-4">
            <div className="container mx-auto px-4 pt-2 space-y-1">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="block py-2 text-gray-300 hover:text-[#c8a96e] transition-colors text-sm"
                  onClick={() => setIsOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
              <div className="pt-3 border-t border-[#1a2f45] flex items-center justify-between">
                <button
                  onClick={() => setLang(lang === 'en' ? 'ar' : 'en')}
                  className="flex items-center gap-1.5 text-gray-300 hover:text-[#c8a96e] text-sm"
                >
                  <Globe className="w-4 h-4" />
                  {lang === 'en' ? 'العربية' : 'English'}
                </button>
                <Link href="/request-quote" onClick={() => setIsOpen(false)}>
                  <Button size="sm">
                    {t.nav.requestQuote}
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        )}
      </nav>
    </header>
  )
}
