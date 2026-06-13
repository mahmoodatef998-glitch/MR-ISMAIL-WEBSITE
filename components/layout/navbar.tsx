'use client'

import { useState, useEffect } from 'react'
import { useLanguage } from '@/hooks/use-language'
import { Menu, X, Globe, LayoutDashboard } from 'lucide-react'

const NAV_LINKS = [
  { id: 'home',     en: 'Home',     ar: 'الرئيسية' },
  { id: 'products', en: 'Products', ar: 'المنتجات' },
  { id: 'about',    en: 'About',    ar: 'من نحن'   },
  { id: 'contact',  en: 'Contact',  ar: 'تواصل'    },
]

function scrollTo(id: string) {
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
}

export function Navbar() {
  const { lang, setLang } = useLanguage()
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [active, setActive] = useState('home')

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 30)
      const ids = ['contact', 'about', 'products', 'home']
      for (const id of ids) {
        const el = document.getElementById(id)
        if (el && el.getBoundingClientRect().top <= 120) { setActive(id); break }
      }
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const handleClick = (e: React.MouseEvent, id: string) => {
    e.preventDefault()
    scrollTo(id)
    setMobileOpen(false)
  }

  return (
    <nav className={`fixed top-0 inset-x-0 z-50 transition-all duration-500 ${
      scrolled
        ? 'bg-[#050b18]/90 backdrop-blur-2xl border-b border-[#c8a96e]/10 shadow-2xl shadow-black/40'
        : 'bg-transparent'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">

          {/* Logo */}
          <a href="#home" onClick={(e) => handleClick(e, 'home')} className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#c8a96e] to-[#e8c97a] flex items-center justify-center shadow-lg shadow-[#c8a96e]/20 group-hover:shadow-[#c8a96e]/40 transition-shadow">
              <span className="text-[#050b18] font-black text-sm tracking-tighter">MI</span>
            </div>
            <div className="hidden sm:block leading-tight">
              <div className="text-white font-bold text-sm">Mr. Ismail Trading</div>
              <div className="text-[#c8a96e] text-[10px] font-medium tracking-widest uppercase">Wholesale Mobile Devices</div>
            </div>
          </a>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-1">
            {NAV_LINKS.map((link) => (
              <a
                key={link.id}
                href={`#${link.id}`}
                onClick={(e) => handleClick(e, link.id)}
                className={`relative px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
                  active === link.id ? 'text-[#c8a96e]' : 'text-gray-400 hover:text-white'
                }`}
              >
                {lang === 'ar' ? link.ar : link.en}
                {active === link.id && (
                  <span className="absolute inset-x-2 -bottom-px h-0.5 bg-gradient-to-r from-[#c8a96e] to-[#e8c97a] rounded-full" />
                )}
              </a>
            ))}
          </div>

          {/* Right */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setLang(lang === 'en' ? 'ar' : 'en')}
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-gray-400 hover:text-white rounded-lg hover:bg-white/5 transition-all"
            >
              <Globe className="w-3.5 h-3.5" />
              {lang === 'en' ? 'عربي' : 'EN'}
            </button>
            <a
              href="/admin/login"
              title="Admin"
              className="hidden sm:flex items-center justify-center w-8 h-8 rounded-lg text-gray-500 hover:text-[#c8a96e] hover:bg-[#c8a96e]/10 transition-all duration-200"
            >
              <LayoutDashboard className="w-4 h-4" />
            </a>
            <a
              href="#contact"
              onClick={(e) => handleClick(e, 'contact')}
              className="hidden md:inline-flex items-center gap-1.5 px-5 py-2 bg-gradient-to-r from-[#c8a96e] to-[#e8c97a] text-[#050b18] text-sm font-bold rounded-xl hover:shadow-lg hover:shadow-[#c8a96e]/25 hover:-translate-y-px transition-all duration-200"
            >
              {lang === 'en' ? 'Get a Quote' : 'اطلب عرض سعر'}
            </a>
            <button
              className="md:hidden p-2 rounded-lg text-gray-400 hover:text-white hover:bg-white/5"
              onClick={() => setMobileOpen(!mobileOpen)}
            >
              {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <div className={`md:hidden transition-all duration-300 overflow-hidden ${mobileOpen ? 'max-h-96' : 'max-h-0'}`}>
        <div className="bg-[#050b18]/98 backdrop-blur-2xl border-t border-[#c8a96e]/10 px-4 py-4 space-y-1">
          {NAV_LINKS.map((link) => (
            <a
              key={link.id}
              href={`#${link.id}`}
              onClick={(e) => handleClick(e, link.id)}
              className={`flex items-center px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                active === link.id
                  ? 'bg-[#c8a96e]/10 text-[#c8a96e] border border-[#c8a96e]/20'
                  : 'text-gray-400 hover:text-white hover:bg-white/5'
              }`}
            >
              {lang === 'ar' ? link.ar : link.en}
            </a>
          ))}
          <div className="flex gap-2 pt-2">
            <button
              onClick={() => { setLang(lang === 'en' ? 'ar' : 'en'); setMobileOpen(false) }}
              className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl border border-white/10 text-sm text-gray-400 hover:text-white"
            >
              <Globe className="w-3.5 h-3.5" />
              {lang === 'en' ? 'العربية' : 'English'}
            </button>
            <a
              href="/admin/login"
              className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-[#c8a96e]/20 text-[#c8a96e] text-sm font-medium hover:bg-[#c8a96e]/10 transition-all"
            >
              <LayoutDashboard className="w-3.5 h-3.5" />
              Admin
            </a>
            <a
              href="#contact"
              onClick={(e) => handleClick(e, 'contact')}
              className="flex-1 flex items-center justify-center py-2.5 rounded-xl bg-gradient-to-r from-[#c8a96e] to-[#e8c97a] text-[#050b18] text-sm font-bold text-center"
            >
              {lang === 'en' ? 'Get a Quote' : 'اطلب عرض سعر'}
            </a>
          </div>
        </div>
      </div>
    </nav>
  )
}
