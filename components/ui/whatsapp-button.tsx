'use client'

import { useState, useEffect } from 'react'
import { m, AnimatePresence } from 'framer-motion'
import { X } from 'lucide-react'
import { useLanguage } from '@/hooks/use-language'

const WHATSAPP_NUMBER = '971501234567'

const QUICK_MSGS = {
  en: [
    'Hi, I\'m interested in bulk pricing for smartphones.',
    'I need a quote for iPhone wholesale.',
    'Can I get pricing for Samsung Galaxy bulk order?',
  ],
  ar: [
    'مرحبًا، أرغب في معرفة أسعار الجملة للهواتف الذكية.',
    'أحتاج إلى عرض سعر لـ iPhone بالجملة.',
    'هل يمكنني الحصول على أسعار طلب جملة Samsung Galaxy؟',
  ],
}

function WhatsAppIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
  )
}

export function WhatsAppButton() {
  const { lang } = useLanguage()
  const [open, setOpen] = useState(false)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 2500)
    return () => clearTimeout(t)
  }, [])

  const sendMessage = (msg: string) => {
    const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`
    window.open(url, '_blank', 'noopener,noreferrer')
    setOpen(false)
  }

  const msgs = lang === 'ar' ? QUICK_MSGS.ar : QUICK_MSGS.en

  return (
    <AnimatePresence>
      {visible && (
        <div
          className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3"
          dir="ltr"
        >
          {/* Quick message panel */}
          <AnimatePresence>
            {open && (
              <m.div
                initial={{ opacity: 0, y: 12, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 12, scale: 0.95 }}
                transition={{ duration: 0.2, ease: [0.25, 0.46, 0.45, 0.94] }}
                className="bg-[#0d1e36] border border-[#c8a96e]/20 rounded-2xl p-4 w-72 shadow-2xl shadow-black/50"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-[#25D366] flex items-center justify-center">
                      <WhatsAppIcon className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <p className="text-white text-xs font-bold">Mr. Ismail Trading</p>
                      <p className="text-green-400 text-[10px] flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-green-400 inline-block animate-pulse" />
                        {lang === 'en' ? 'Online now' : 'متصل الآن'}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => setOpen(false)}
                    className="w-6 h-6 rounded-full bg-white/[0.06] hover:bg-white/10 flex items-center justify-center text-gray-400 hover:text-white transition-colors cursor-pointer"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>

                <p className="text-gray-500 text-[11px] mb-3">
                  {lang === 'en' ? 'Choose a quick message or type your own:' : 'اختر رسالة سريعة أو اكتب رسالتك:'}
                </p>

                <div className="space-y-2 mb-3">
                  {msgs.map((msg, i) => (
                    <button
                      key={i}
                      onClick={() => sendMessage(msg)}
                      className="w-full text-left text-xs text-gray-300 bg-white/[0.04] hover:bg-[#c8a96e]/10 hover:text-[#c8a96e] border border-white/[0.06] hover:border-[#c8a96e]/25 rounded-xl px-3 py-2.5 transition-all duration-200 cursor-pointer"
                    >
                      {msg}
                    </button>
                  ))}
                </div>

                <button
                  onClick={() => sendMessage(lang === 'en' ? 'Hello, I have a wholesale inquiry.' : 'مرحبًا، لدي استفسار عن الجملة.')}
                  className="w-full flex items-center justify-center gap-2 py-2.5 bg-[#25D366] hover:bg-[#1db954] text-white text-xs font-bold rounded-xl transition-colors duration-200 cursor-pointer"
                >
                  <WhatsAppIcon className="w-3.5 h-3.5" />
                  {lang === 'en' ? 'Open WhatsApp' : 'فتح واتساب'}
                </button>
              </m.div>
            )}
          </AnimatePresence>

          {/* Main button */}
          <m.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: 'spring', stiffness: 400, damping: 20 }}
          >
            <m.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.92 }}
              onClick={() => setOpen(!open)}
              className="relative w-14 h-14 rounded-full bg-[#25D366] shadow-lg shadow-[#25D366]/30 hover:shadow-[#25D366]/50 flex items-center justify-center text-white transition-shadow duration-300 cursor-pointer"
              aria-label="Chat on WhatsApp"
            >
              <AnimatePresence mode="wait">
                {open ? (
                  <m.span
                    key="close"
                    initial={{ rotate: -90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: 90, opacity: 0 }}
                    transition={{ duration: 0.15 }}
                  >
                    <X className="w-6 h-6" />
                  </m.span>
                ) : (
                  <m.span
                    key="wa"
                    initial={{ rotate: 90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: -90, opacity: 0 }}
                    transition={{ duration: 0.15 }}
                  >
                    <WhatsAppIcon className="w-7 h-7" />
                  </m.span>
                )}
              </AnimatePresence>

              {/* Pulse ring */}
              {!open && (
                <span className="absolute inset-0 rounded-full bg-[#25D366] animate-ping opacity-25 pointer-events-none" />
              )}

              {/* Notification dot */}
              {!open && (
                <span className="absolute -top-0.5 -right-0.5 w-3.5 h-3.5 rounded-full bg-[#c8a96e] border-2 border-[#050b18]" />
              )}
            </m.button>
          </m.div>
        </div>
      )}
    </AnimatePresence>
  )
}
