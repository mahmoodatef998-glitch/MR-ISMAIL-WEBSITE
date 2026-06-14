'use client'

import { useRef } from 'react'
import { useLanguage } from '@/hooks/use-language'
import { ArrowRight, Shield, Zap, Globe, PhoneCall, Sparkles } from 'lucide-react'
import { m, useScroll, useTransform, MotionValue } from 'framer-motion'
import { CountUp } from '@/components/ui/count-up'
import { fadeUp, stagger, revealHeavy, snapIn } from '@/lib/motion'

// ── Bronze palette (matches logo) ──────────────────────────────
const BL  = '#D4A840'  // light highlight
const BM  = '#C4922A'  // main bronze
const BD  = '#8B6015'  // shadow
const BDD = '#4E3308'  // deep shadow

function scrollTo(id: string) {
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
}

// ── Animated Camel SVG ────────────────────────────────────────
function AnimatedCamel({ progress }: { progress: MotionValue<number> }) {
  const N = 5 // walk cycles over full scroll

  // Leg pairs - diagonal gait (FL+BR together, FR+BL together)
  const flAngle   = useTransform(progress, (v) => Math.sin(v * Math.PI * 2 * N)           * 24)
  const frAngle   = useTransform(progress, (v) => Math.sin(v * Math.PI * 2 * N + Math.PI) * 24)
  const blAngle   = useTransform(progress, (v) => Math.sin(v * Math.PI * 2 * N + Math.PI) * 20)
  const brAngle   = useTransform(progress, (v) => Math.sin(v * Math.PI * 2 * N)           * 20)
  const bodyBob   = useTransform(progress, (v) => Math.sin(v * Math.PI * 2 * N * 2)       *  4)
  const headNod   = useTransform(progress, (v) => Math.sin(v * Math.PI * 2 * N * 0.9)     *  6)
  const tailSwing = useTransform(progress, (v) => Math.sin(v * Math.PI * 2 * N * 0.7)     * 16)
  // Walk forward: camel enters from right edge and settles into frame
  const walkX     = useTransform(progress, [0, 0.35, 1], [60, 0, -18])

  return (
    <m.svg
      viewBox="0 0 560 410"
      className="w-full h-full"
      style={{ y: bodyBob, x: walkX }}
      aria-hidden="true"
    >
      <defs>
        {/* Body gradient — warm bronze, lit from top-left */}
        <linearGradient id="gBody" x1="20%" y1="0%" x2="80%" y2="100%">
          <stop offset="0%"   stopColor={BM}  />
          <stop offset="50%"  stopColor={BD}  />
          <stop offset="100%" stopColor={BDD} />
        </linearGradient>
        {/* Top surfaces — brighter */}
        <linearGradient id="gTop" x1="0%" y1="0%" x2="60%" y2="100%">
          <stop offset="0%"   stopColor={BL} />
          <stop offset="100%" stopColor={BM} />
        </linearGradient>
        {/* Legs */}
        <linearGradient id="gLeg" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%"   stopColor={BM}  />
          <stop offset="100%" stopColor={BDD} />
        </linearGradient>
        {/* Ground glow */}
        <radialGradient id="gGlow" cx="50%" cy="50%" r="50%">
          <stop offset="0%"   stopColor={BM}  stopOpacity="0.35" />
          <stop offset="100%" stopColor={BM}  stopOpacity="0"    />
        </radialGradient>
        {/* Bronze drop shadow */}
        <filter id="fShadow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="10" stdDeviation="14"
            floodColor={BM} floodOpacity="0.22" />
        </filter>
      </defs>

      {/* Ground shadow */}
      <ellipse cx="258" cy="396" rx="198" ry="16" fill="url(#gGlow)" />

      {/* ══ BACK LEGS — rendered BEHIND body ══ */}

      {/* Back-far leg (slightly behind, deep shadow) */}
      <m.g style={{ rotate: brAngle, transformOrigin: '174px 298px' }}>
        <rect x="166" y="298" width="16" height="84" rx="8" fill={BDD} />
        <ellipse cx="174" cy="384" rx="14" ry="5.5" fill={BDD} />
      </m.g>

      {/* Back-near leg (front, lighter) */}
      <m.g style={{ rotate: blAngle, transformOrigin: '150px 295px' }}>
        <rect x="142" y="295" width="16" height="88" rx="8" fill={BD} />
        <ellipse cx="150" cy="385" rx="15" ry="6" fill={BDD} />
      </m.g>

      {/* ══ BODY ══ */}
      <g filter="url(#fShadow)">
        {/* Main body ellipse */}
        <ellipse cx="232" cy="232" rx="152" ry="68" fill="url(#gBody)" />

        {/* Hump — dromedary single hump, rises from back portion */}
        <path
          d="M 144 164
             Q 168 108 205 82
             Q 232 62  258 82
             Q 292 106 312 164
             Z"
          fill="url(#gTop)"
        />
        {/* Hump→body filler (removes gap between hump base and body ellipse top) */}
        <path
          d="M 144 164 Q 228 158 312 164 Q 310 172 232 172 Q 152 172 144 164 Z"
          fill="url(#gBody)"
        />
        {/* Hump ridge highlight */}
        <path
          d="M 172 158 Q 198 105 232 78 Q 262 60 290 82"
          fill="none" stroke={BL} strokeWidth="2.5"
          strokeLinecap="round" opacity="0.55"
        />

        {/* ── NECK ── */}
        <path
          d="M 348 172
             Q 368 148 382 118
             Q 394 96  386 78
             Q 374 90  364 114
             Q 352 144 338 168
             Z"
          fill="url(#gTop)"
        />
        {/* Neck highlight */}
        <path
          d="M 356 168 Q 374 140 384 114 Q 393 96 386 80"
          fill="none" stroke={BL} strokeWidth="2"
          strokeLinecap="round" opacity="0.4"
        />

        {/* Belly shading */}
        <ellipse cx="232" cy="292" rx="118" ry="18" fill={BDD} opacity="0.45" />
        {/* Body specular highlight */}
        <ellipse cx="205" cy="192" rx="84" ry="32"
          fill={BL} opacity="0.1" transform="rotate(-8 205 192)" />
      </g>

      {/* ══ HEAD ══ */}
      <m.g style={{ rotate: headNod, transformOrigin: '390px 80px' }}>
        {/* Main head */}
        <ellipse cx="410" cy="70" rx="32" ry="26" fill="url(#gTop)" />

        {/* Snout protrusion */}
        <path
          d="M 438 74 Q 454 78 452 93 Q 450 105 438 106 Q 428 108 424 99"
          fill={BM}
        />
        {/* Lower jaw */}
        <path
          d="M 412 86 Q 438 92 452 96 Q 445 108 430 107 Q 414 105 412 95 Z"
          fill={BD} opacity="0.6"
        />

        {/* Nostril */}
        <ellipse cx="448" cy="95" rx="5.5" ry="3.5" fill={BDD} opacity="0.8" />

        {/* Eye (expressive) */}
        <circle cx="418" cy="59" r="7.5" fill="#180A02" />
        <circle cx="418" cy="59" r="5.5" fill="#261005" />
        <circle cx="419.5" cy="57.5" r="2.2" fill="white" opacity="0.9" />

        {/* Eyelid crease */}
        <path d="M 411 55 Q 418 50 425 55"
          fill="none" stroke={BD} strokeWidth="2"
          strokeLinecap="round" />
        {/* Eyelash */}
        <path d="M 412 54 Q 417 47 424 53"
          fill="none" stroke={BDD} strokeWidth="1.5"
          strokeLinecap="round" />

        {/* Ear */}
        <path d="M 393 48 Q 388 34 400 37 Q 408 39 402 50"
          fill={BM} />
        <path d="M 394 47 Q 391 38 399 40 Q 405 41 401 49"
          fill={BL} opacity="0.4" />

        {/* Head specular */}
        <ellipse cx="403" cy="60" rx="13" ry="9"
          fill={BL} opacity="0.18" transform="rotate(-15 403 60)" />

        {/* Chin tuft */}
        <path d="M 424 106 Q 428 116 422 118 Q 416 120 418 112"
          fill={BD} opacity="0.6" />
      </m.g>

      {/* ══ TAIL ══ */}
      <m.g style={{ rotate: tailSwing, transformOrigin: '82px 212px' }}>
        <path
          d="M 82 212 Q 60 190 62 166 Q 63 150 72 152 Q 66 166 66 180 Q 65 196 84 212"
          fill="none" stroke={BM} strokeWidth="10" strokeLinecap="round"
        />
        <circle cx="64" cy="150" r="6" fill={BD} />
      </m.g>

      {/* ══ FRONT LEGS — rendered IN FRONT of body ══ */}

      {/* Front-far leg (behind in Z, darker) */}
      <m.g style={{ rotate: frAngle, transformOrigin: '330px 290px' }}>
        <rect x="322" y="290" width="16" height="84" rx="8" fill={BD} />
        <ellipse cx="330" cy="376" rx="14" ry="5.5" fill={BDD} />
      </m.g>

      {/* Front-near leg (in front, main bronze) */}
      <m.g style={{ rotate: flAngle, transformOrigin: '308px 286px' }}>
        <rect x="300" y="286" width="16" height="88" rx="8" fill="url(#gLeg)" />
        <ellipse cx="308" cy="376" rx="15" ry="6" fill={BDD} />
      </m.g>

      {/* ══ COIN RING (logo-inspired decorative circle) ══ */}
      <circle
        cx="232" cy="195"
        r="195"
        fill="none"
        stroke={BM}
        strokeWidth="1.5"
        strokeDasharray="6 14"
        opacity="0.12"
      />
    </m.svg>
  )
}

// ── Stats ──────────────────────────────────────────────────────
const STATS = [
  { value: 15,   suffix: '+', en: 'Years',     ar: 'سنة'   },
  { value: 2500, suffix: '+', en: 'Products',  ar: 'منتج'  },
  { value: 500,  suffix: '+', en: 'Clients',   ar: 'عميل'  },
  { value: 30,   suffix: '+', en: 'Countries', ar: 'دولة'  },
]

const TRUST = [
  { icon: Shield,    en: 'Genuine Products', ar: 'منتجات أصلية' },
  { icon: Zap,       en: 'Fast Shipping',    ar: 'شحن سريع'     },
  { icon: Globe,     en: '30+ Countries',    ar: '+30 دولة'     },
  { icon: PhoneCall, en: '24/7 Support',     ar: 'دعم مستمر'    },
]

// ── Hero Section ───────────────────────────────────────────────
export function HeroSection() {
  const { lang } = useLanguage()
  const ref = useRef<HTMLElement>(null)

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end start'],
  })

  return (
    <section
      id="home"
      ref={ref}
      className="relative min-h-screen flex items-center overflow-hidden"
      style={{ background: '#0A0705' }}
    >
      {/* ── Atmospheric background ── */}
      <div className="absolute inset-0 pointer-events-none select-none">
        {/* Warm bronze grid */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(196,146,42,0.028)_1px,transparent_1px),linear-gradient(to_right,rgba(196,146,42,0.028)_1px,transparent_1px)] bg-[size:72px_72px]" />

        {/* Left amber bloom */}
        <div className="animate-float-slow absolute top-1/4 -left-48 w-[700px] h-[700px] rounded-full bg-[#C4922A] blur-[160px] opacity-[0.09]" />
        {/* Right deep amber */}
        <div className="animate-float-slower absolute bottom-1/3 -right-40 w-[500px] h-[500px] rounded-full bg-[#D4A840] blur-[140px] opacity-[0.06]" />
        {/* Vignette */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_25%,#0A0705_82%)]" />

        {/* Desert horizon glow (bottom) */}
        <div className="absolute bottom-0 inset-x-0 h-32 bg-gradient-to-t from-[#C4922A]/5 to-transparent" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 pt-20 pb-16 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-center min-h-[calc(100vh-80px)]">

          {/* ══ LEFT — Text content ══ */}
          <m.div
            variants={stagger(0, 0.14)}
            initial="hidden"
            animate="show"
            className="flex flex-col justify-center order-2 lg:order-1"
          >
            {/* Badge */}
            <m.div
              variants={snapIn}
              className="inline-flex items-center gap-2 px-5 py-2 rounded-full text-xs font-semibold mb-6 w-fit"
              style={{
                background: 'rgba(196,146,42,0.10)',
                border: '1px solid rgba(196,146,42,0.28)',
                color: '#C4922A',
              }}
            >
              <Sparkles className="w-3.5 h-3.5" />
              {lang === 'en'
                ? "UAE's Premier B2B Mobile Trading"
                : 'الشركة الأولى في الإمارات لتجارة الجملة'}
            </m.div>

            {/* Headline — enlarged for impact */}
            <m.h1
              variants={revealHeavy}
              className="text-[3rem] sm:text-[3.8rem] lg:text-[4.6rem] font-black text-white leading-[1.03] tracking-tight mb-5"
            >
              {lang === 'en' ? (
                <>
                  Your Trusted Source
                  <br />
                  for{' '}
                  <span style={{
                    background: 'linear-gradient(135deg, #D4A840 0%, #C4922A 45%, #8B6015 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text',
                  }}>
                    Wholesale
                  </span>
                  <br />Mobile Devices
                </>
              ) : (
                <>
                  مصدرك الموثوق
                  <br />
                  <span style={{
                    background: 'linear-gradient(135deg, #D4A840 0%, #C4922A 45%, #8B6015 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text',
                  }}>
                    لجملة
                  </span>
                  {' '}الأجهزة المحمولة
                </>
              )}
            </m.h1>

            {/* Subtitle */}
            <m.p
              variants={fadeUp}
              className="text-sm sm:text-base text-gray-400 max-w-lg mb-8 leading-relaxed"
            >
              {lang === 'en'
                ? 'Supplying genuine smartphones, accessories & spare parts across the GCC. Competitive wholesale pricing, flexible MOQ, and fast delivery from Dubai.'
                : 'نوفر هواتف وإكسسوارات وقطع غيار أصلية عبر دول الخليج. أسعار جملة تنافسية، كميات مرنة، وتوصيل سريع من دبي.'}
            </m.p>

            {/* CTAs */}
            <m.div
              variants={fadeUp}
              className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 mb-10"
            >
              <m.button
                whileHover={{ scale: 1.03, y: -2 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => scrollTo('contact')}
                className="group w-full sm:w-auto flex items-center justify-center gap-2.5 px-8 py-4 font-bold text-base rounded-xl transition-shadow duration-300 cursor-pointer"
                style={{
                  background: 'linear-gradient(135deg, #D4A840 0%, #C4922A 100%)',
                  color: '#0A0705',
                  boxShadow: '0 6px 28px rgba(196,146,42,0.28)',
                }}
              >
                {lang === 'en' ? 'Request a Quote' : 'طلب عرض سعر'}
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </m.button>

              <m.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => scrollTo('products')}
                className="w-full sm:w-auto flex items-center justify-center gap-2.5 px-8 py-4 bg-white/[0.04] backdrop-blur-sm border border-white/10 text-white font-semibold text-base rounded-xl hover:bg-white/[0.08] hover:border-white/20 transition-all duration-300 cursor-pointer"
              >
                {lang === 'en' ? 'Browse Catalog' : 'تصفح الكتالوج'}
              </m.button>
            </m.div>

            {/* Trust row — compact single line */}
            <m.div
              variants={fadeUp}
              className="flex flex-wrap items-center gap-x-5 gap-y-2 mb-8"
            >
              {TRUST.map(({ icon: Icon, en, ar }, i) => (
                <div key={en} className="flex items-center gap-1.5 text-xs text-gray-500">
                  {i > 0 && <span className="text-gray-700 select-none">·</span>}
                  <Icon className="w-3 h-3 text-[#C4922A]" />
                  {lang === 'en' ? en : ar}
                </div>
              ))}
            </m.div>

            {/* Stats grid */}
            <m.div
              variants={fadeUp}
              className="grid grid-cols-4 gap-px rounded-2xl overflow-hidden"
              style={{
                background: 'rgba(196,146,42,0.10)',
                border: '1px solid rgba(196,146,42,0.14)',
              }}
            >
              {STATS.map(({ value, suffix, en, ar }) => (
                <div
                  key={en}
                  className="px-3 py-4 text-center transition-colors duration-200"
                  style={{ background: '#0A0705' }}
                >
                  <div
                    className="text-xl sm:text-2xl font-black mb-0.5"
                    style={{
                      background: 'linear-gradient(135deg, #D4A840, #C4922A)',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      backgroundClip: 'text',
                    }}
                  >
                    <CountUp end={value} suffix={suffix} duration={2} />
                  </div>
                  <div className="text-[10px] text-gray-600">
                    {lang === 'en' ? en : ar}
                  </div>
                </div>
              ))}
            </m.div>
          </m.div>

          {/* ══ RIGHT — Animated Camel ══ */}
          <m.div
            className="relative flex items-center justify-center h-[50vw] max-h-[520px] min-h-[280px] order-1 lg:order-2"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.9, delay: 0.25, ease: [0.25, 0.46, 0.45, 0.94] }}
          >
            {/* Ambient glow behind camel */}
            <div
              className="absolute inset-8 rounded-full pointer-events-none"
              style={{
                background: 'radial-gradient(ellipse, rgba(196,146,42,0.18) 0%, transparent 70%)',
                filter: 'blur(32px)',
              }}
            />

            {/* Scroll hint */}
            <m.div
              className="absolute top-0 right-0 flex items-center gap-2 text-[9px] font-bold uppercase tracking-[0.2em] select-none"
              style={{ color: '#C4922A' }}
              animate={{ opacity: [0.35, 0.9, 0.35] }}
              transition={{ duration: 2.8, repeat: Infinity, ease: 'easeInOut' }}
            >
              <span
                className="w-px h-8 block"
                style={{ background: 'linear-gradient(to bottom, transparent, #C4922A, transparent)' }}
              />
              {lang === 'en' ? 'Scroll to walk' : 'اسحب للمشي'}
            </m.div>

            {/* THE CAMEL */}
            <AnimatedCamel progress={scrollYProgress} />
          </m.div>
        </div>
      </div>

      {/* Scroll indicator (bottom center) */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-pulse">
        <div
          className="w-px h-10"
          style={{ background: 'linear-gradient(to bottom, transparent, rgba(196,146,42,0.7), transparent)' }}
        />
      </div>
    </section>
  )
}
