'use client'

import { useState, useEffect } from 'react'
import { useLanguage } from '@/hooks/use-language'
import { Menu, X, Globe } from 'lucide-react'
import { m, AnimatePresence } from 'framer-motion'

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
      setScrolled(window.scrollY > 60)
      const ids = ['contact', 'testimonials', 'process', 'about', 'features', 'products', 'home']
      for (const id of ids) {
        const el = document.getElementById(id)
        if (el && el.getBoundingClientRect().top <= 100) { setActive(id); break }
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
    <>
      {/* ── Floating pill navbar ── */}
      <m.nav
        className="fixed top-4 left-1/2 -translate-x-1/2 z-50 w-[calc(100%-2rem)] max-w-4xl"
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 280, damping: 28, delay: 0.2 }}
      >
        <div className={`
          relative rounded-2xl transition-all duration-500 px-4 sm:px-5
          ${scrolled
            ? 'bg-[#0A0705]/85 backdrop-blur-2xl border border-[#C4922A]/15 shadow-2xl shadow-black/60'
            : 'bg-[#0A0705]/60 backdrop-blur-xl border border-white/[0.06]'
          }
        `}>
          <div className="flex items-center justify-between h-14">

            {/* Logo */}
            <a
              href="#home"
              onClick={(e) => handleClick(e, 'home')}
              className="flex items-center gap-3 group cursor-pointer"
            >
              {/* Bronze coin mark */}
              <div className="relative w-9 h-9 shrink-0">
                <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-[#D4A840] via-[#C4922A] to-[#8B6015] shadow-lg shadow-[#C4922A]/30 group-hover:shadow-[#C4922A]/50 transition-shadow duration-300" />
                <div className="absolute inset-[1.5px] rounded-[10px] bg-gradient-to-br from-[#C4922A] to-[#4E3308] flex items-center justify-center">
                  <span className="text-[#D4A840] font-black text-xs tracking-tight" style={{ fontFamily: 'var(--font-display)' }}>MI</span>
                </div>
              </div>
              <div className="hidden sm:block">
                <div className="text-white font-semibold text-sm leading-tight tracking-wide">Mr. Ismail Trading</div>
                <div className="text-[#C4922A]/70 text-[10px] tracking-[0.2em] uppercase leading-tight">Dubai · UAE</div>
              </div>
            </a>

            {/* Desktop nav links */}
            <div className="hidden md:flex items-center gap-0.5">
              {NAV_LINKS.map((link) => (
                <a
                  key={link.id}
                  href={`#${link.id}`}
                  onClick={(e) => handleClick(e, link.id)}
                  className={`
                    relative px-4 py-2 text-[13px] font-medium rounded-xl transition-all duration-200 cursor-pointer
                    ${active === link.id
                      ? 'text-[#D4A840]'
                      : 'text-gray-400 hover:text-white hover:bg-white/[0.04]'
                    }
                  `}
                >
                  {lang === 'ar' ? link.ar : link.en}
                  {active === link.id && (
                    <m.span
                      layoutId="nav-pill"
                      className="absolute inset-0 rounded-xl bg-[#C4922A]/10 border border-[#C4922A]/20"
                      transition={{ type: 'spring', stiffness: 350, damping: 30 }}
                    />
                  )}
                </a>
              ))}
            </div>

            {/* Right controls */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => setLang(lang === 'en' ? 'ar' : 'en')}
                className="hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 text-[11px] font-semibold text-gray-500 hover:text-[#C4922A] rounded-lg hover:bg-[#C4922A]/6 transition-all duration-200 cursor-pointer"
              >
                <Globe className="w-3 h-3" />
                {lang === 'en' ? 'عربي' : 'EN'}
              </button>
              <a
                href="#contact"
                onClick={(e) => handleClick(e, 'contact')}
                className="hidden md:inline-flex items-center gap-1.5 px-4 py-2 text-[13px] font-bold rounded-xl btn-bronze cursor-pointer"
              >
                {lang === 'en' ? 'Get a Quote' : 'اطلب عرض سعر'}
              </a>
              <button
                className="md:hidden p-2 rounded-lg text-gray-400 hover:text-white hover:bg-white/[0.06] transition-all cursor-pointer"
                onClick={() => setMobileOpen(!mobileOpen)}
                aria-label="Toggle menu"
              >
                <AnimatePresence mode="wait" initial={false}>
                  <m.span
                    key={mobileOpen ? 'x' : 'menu'}
                    initial={{ rotate: -45, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: 45, opacity: 0 }}
                    transition={{ duration: 0.15 }}
                    className="block"
                  >
                    {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                  </m.span>
                </AnimatePresence>
              </button>
            </div>
          </div>
        </div>

        {/* Mobile drawer */}
        <AnimatePresence>
          {mobileOpen && (
            <m.div
              initial={{ opacity: 0, y: -8, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -8, scale: 0.97 }}
              transition={{ type: 'spring', stiffness: 400, damping: 32 }}
              className="mt-2 rounded-2xl bg-[#0A0705]/95 backdrop-blur-2xl border border-[#C4922A]/12 shadow-2xl shadow-black/60 overflow-hidden"
            >
              <div className="p-3 space-y-1">
                {NAV_LINKS.map((link) => (
                  <a
                    key={link.id}
                    href={`#${link.id}`}
                    onClick={(e) => handleClick(e, link.id)}
                    className={`flex items-center px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 cursor-pointer ${
                      active === link.id
                        ? 'bg-[#C4922A]/10 text-[#D4A840] border border-[#C4922A]/20'
                        : 'text-gray-400 hover:text-white hover:bg-white/[0.04]'
                    }`}
                  >
                    {lang === 'ar' ? link.ar : link.en}
                  </a>
                ))}
                <div className="flex gap-2 pt-2">
                  <button
                    onClick={() => { setLang(lang === 'en' ? 'ar' : 'en'); setMobileOpen(false) }}
                    className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl border border-white/8 text-sm text-gray-400 hover:text-white hover:bg-white/[0.04] transition-all cursor-pointer"
                  >
                    <Globe className="w-3.5 h-3.5" />
                    {lang === 'en' ? 'العربية' : 'English'}
                  </button>
                  <a
                    href="#contact"
                    onClick={(e) => handleClick(e, 'contact')}
                    className="flex-1 flex items-center justify-center py-2.5 rounded-xl btn-bronze text-sm font-bold text-center cursor-pointer"
                  >
                    {lang === 'en' ? 'Get a Quote' : 'اطلب عرض سعر'}
                  </a>
                </div>
              </div>
            </m.div>
          )}
        </AnimatePresence>
      </m.nav>
    </>
  )
}
