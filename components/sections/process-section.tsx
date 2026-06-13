'use client'

import { useLanguage } from '@/hooks/use-language'
import { MessageSquare, ClipboardList, Truck } from 'lucide-react'
import { motion } from 'framer-motion'
import { fadeUp, stagger, scaleIn, viewportOnce } from '@/lib/motion'

const STEPS = [
  {
    icon: MessageSquare,
    en: { title: 'Send Your Inquiry', desc: 'Fill out our quick quote form or reach us on WhatsApp. Tell us what you need — product, quantity, and destination.' },
    ar: { title: 'أرسل استفسارك', desc: 'أكمل نموذج طلب السعر السريع أو تواصل معنا عبر واتساب. أخبرنا بما تحتاجه — المنتج والكمية والوجهة.' },
  },
  {
    icon: ClipboardList,
    en: { title: 'Get a Custom Quote', desc: 'Our team reviews your request and sends a detailed, competitive price offer within 2–4 business hours.' },
    ar: { title: 'احصل على عرض مخصص', desc: 'يراجع فريقنا طلبك ويرسل عرض سعر تنافسيًا ومفصلًا خلال 2–4 ساعات عمل.' },
  },
  {
    icon: Truck,
    en: { title: 'Confirm & Ship', desc: 'Approve the order, complete payment via bank transfer or escrow, and we ship directly to your warehouse or port.' },
    ar: { title: 'تأكيد وشحن', desc: 'وافق على الطلب، وأتمّ الدفع عبر التحويل البنكي أو الضمان، ونشحن مباشرةً إلى مستودعك أو ميناء الوصول.' },
  },
]

export function ProcessSection() {
  const { lang } = useLanguage()

  return (
    <section id="process" className="py-24 bg-[#050b18] overflow-hidden">
      <div className="section-divider mb-0" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-24">

        {/* Header */}
        <motion.div
          className="text-center max-w-xl mx-auto mb-16"
          variants={stagger(0, 0.12)}
          initial="hidden"
          whileInView="show"
          viewport={viewportOnce}
        >
          <motion.p variants={fadeUp} className="text-[#c8a96e] text-xs font-bold uppercase tracking-[0.2em] mb-3 section-label">
            {lang === 'en' ? 'How It Works' : 'كيف نعمل'}
          </motion.p>
          <motion.h2 variants={fadeUp} className="text-3xl sm:text-4xl lg:text-5xl font-black text-white leading-tight">
            {lang === 'en' ? (
              <>Order in<br /><span className="gold-text">3 Simple Steps</span></>
            ) : (
              <>اطلب في<br /><span className="gold-text">3 خطوات بسيطة</span></>
            )}
          </motion.h2>
        </motion.div>

        {/* Steps */}
        <div className="relative">
          {/* Animated connector line — desktop */}
          <motion.div
            className="hidden lg:block absolute top-16 left-[calc(16.67%+2rem)] right-[calc(16.67%+2rem)] h-px origin-left"
            style={{ background: 'linear-gradient(to right, transparent, rgba(200,169,110,0.35), transparent)' }}
            initial={{ scaleX: 0, opacity: 0 }}
            whileInView={{ scaleX: 1, opacity: 1 }}
            viewport={viewportOnce}
            transition={{ duration: 1.2, ease: [0.25, 0.46, 0.45, 0.94], delay: 0.4 }}
          />

          <motion.div
            className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-6"
            variants={stagger(0.15, 0.2)}
            initial="hidden"
            whileInView="show"
            viewport={viewportOnce}
          >
            {STEPS.map(({ icon: Icon, en, ar }, i) => {
              const content = lang === 'ar' ? ar : en
              return (
                <motion.div
                  key={i}
                  variants={scaleIn}
                  className="relative text-center group"
                >
                  {/* Step number + icon */}
                  <div className="relative inline-flex mb-8">
                    <motion.div
                      whileHover={{ rotate: [0, -10, 10, -5, 0], transition: { duration: 0.5 } }}
                      className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#c8a96e]/15 to-[#c8a96e]/5 border border-[#c8a96e]/20 flex items-center justify-center group-hover:border-[#c8a96e]/50 group-hover:from-[#c8a96e]/20 group-hover:to-[#c8a96e]/10 transition-all duration-300"
                    >
                      <Icon className="w-7 h-7 text-[#c8a96e]" />
                    </motion.div>
                    <motion.span
                      initial={{ scale: 0 }}
                      whileInView={{ scale: 1 }}
                      viewport={viewportOnce}
                      transition={{ type: 'spring', stiffness: 500, damping: 20, delay: 0.3 + i * 0.15 }}
                      className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-gradient-to-br from-[#c8a96e] to-[#e8c97a] text-[#050b18] text-[10px] font-black flex items-center justify-center"
                    >
                      {i + 1}
                    </motion.span>
                  </div>

                  <div className="px-4">
                    <h3 className="text-white font-bold text-lg mb-3 group-hover:text-[#c8a96e] transition-colors duration-200">
                      {content.title}
                    </h3>
                    <p className="text-gray-500 text-sm leading-relaxed max-w-xs mx-auto">
                      {content.desc}
                    </p>
                  </div>
                </motion.div>
              )
            })}
          </motion.div>
        </div>

        {/* Bottom CTA strip */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="show"
          viewport={viewportOnce}
          className="mt-16 rounded-2xl bg-gradient-to-r from-[#0a1628] via-[#0d1e36] to-[#0a1628] border border-[#c8a96e]/10 p-8 flex flex-col sm:flex-row items-center justify-between gap-6"
        >
          <div>
            <p className="text-white font-bold text-lg mb-1">
              {lang === 'en' ? 'Ready to place your first order?' : 'مستعد لتقديم طلبك الأول؟'}
            </p>
            <p className="text-gray-500 text-sm">
              {lang === 'en'
                ? 'Most quotes are returned within 2–4 hours during business hours.'
                : 'تُردّ معظم عروض الأسعار خلال 2–4 ساعات خلال ساعات العمل.'}
            </p>
          </div>
          <motion.a
            whileHover={{ scale: 1.04, y: -2 }}
            whileTap={{ scale: 0.97 }}
            href="#contact"
            onClick={(e) => { e.preventDefault(); document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' }) }}
            className="shrink-0 inline-flex items-center gap-2 px-8 py-3.5 bg-gradient-to-r from-[#c8a96e] to-[#e8c97a] text-[#050b18] font-bold text-sm rounded-xl hover:shadow-xl hover:shadow-[#c8a96e]/20 transition-all duration-300"
          >
            {lang === 'en' ? 'Request a Quote' : 'طلب عرض سعر'}
          </motion.a>
        </motion.div>

      </div>
    </section>
  )
}
