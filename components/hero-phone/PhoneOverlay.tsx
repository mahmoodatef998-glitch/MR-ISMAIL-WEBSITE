'use client'

import { motion, MotionValue, useTransform } from 'framer-motion'

interface Props { progress: MotionValue<number> }

export function PhoneOverlay({ progress }: Props) {

  // Scene 1 (hand): brand label at bottom — p 0.04→0.16
  const s1Op = useTransform(progress, [0.04, 0.10, 0.14, 0.18], [0, 1, 1, 0])
  const s1Y  = useTransform(progress, [0.04, 0.10], [12, 0])

  // Scene 2 (macro): camera headline + specs at bottom — p 0.25→0.38
  const s2Op = useTransform(progress, [0.25, 0.31, 0.36, 0.40], [0, 1, 1, 0])

  // Scene 3 (orange back): Arabic headline at bottom — p 0.45→0.58
  const s3Op    = useTransform(progress, [0.45, 0.51, 0.56, 0.60], [0, 1, 1, 0])
  const s3Y     = useTransform(progress, [0.45, 0.51], [28, 0])
  const s3SubOp = useTransform(progress, [0.47, 0.53, 0.56, 0.60], [0, 1, 1, 0])

  // Scene 4 (full reveal): color label top — p 0.65→0.76
  const s4Op = useTransform(progress, [0.65, 0.71, 0.76, 0.80], [0, 1, 1, 0])

  // Scene 5 (architecture): CTA at bottom — p 0.88→1.0
  const s5Op    = useTransform(progress, [0.88, 0.94, 1.0], [0, 1, 1])
  const s5Y     = useTransform(progress, [0.88, 0.94], [20, 0])
  const s5CtaOp = useTransform(progress, [0.91, 0.97, 1.0], [0, 1, 1])

  const SPECS = [
    { val: '48 MP', label: 'Main Camera' },
    { val: '8×',   label: 'Optical Zoom' },
    { val: 'ƒ/1.6', label: 'Aperture' },
  ]

  return (
    <div className="absolute inset-0 z-10 pointer-events-none select-none">

      {/* ── Scene 1: brand label ─────────────────────────────────── */}
      <motion.div
        className="absolute bottom-10 left-0 right-0 flex flex-col items-center gap-2"
        style={{ opacity: s1Op, y: s1Y }}
      >
        <p
          className="text-[9px] uppercase tracking-[0.42em]"
          style={{ fontFamily: 'var(--font-sans)', color: 'rgba(196,146,42,0.65)' }}
        >
          Mr. Ismail Trading LLC — Dubai
        </p>
        <p
          className="text-white/55 text-xs tracking-[0.22em] uppercase"
          style={{ fontFamily: 'var(--font-sans)', fontWeight: 300 }}
        >
          iPhone 17 Pro Max
        </p>
      </motion.div>

      {/* ── Scene 2: camera specs ────────────────────────────────── */}
      <motion.div
        className="absolute bottom-12 left-0 right-0 text-center"
        style={{ opacity: s2Op }}
      >
        <p
          className="text-white/78 text-2xl md:text-3xl"
          style={{ fontFamily: 'var(--font-sans)', fontWeight: 200, letterSpacing: '-0.022em' }}
        >
          Pro Camera System
        </p>
        <div className="flex justify-center gap-10 md:gap-14 mt-5">
          {SPECS.map(({ val, label }) => (
            <div key={label} className="flex flex-col items-center gap-1">
              <span
                className="text-white text-2xl md:text-3xl font-light"
                style={{ fontFamily: 'var(--font-sans)', letterSpacing: '-0.022em' }}
              >
                {val}
              </span>
              <span
                className="text-[9px] uppercase tracking-[0.22em]"
                style={{ color: 'rgba(255,255,255,0.28)', fontFamily: 'var(--font-sans)' }}
              >
                {label}
              </span>
            </div>
          ))}
        </div>
      </motion.div>

      {/* ── Scene 3: بلا حدود ────────────────────────────────────── */}
      <motion.div
        className="absolute bottom-12 left-0 right-0 flex flex-col items-center gap-3"
        style={{ opacity: s3Op, y: s3Y }}
      >
        <h1
          className="font-display text-6xl md:text-8xl gold-text text-center"
          style={{ letterSpacing: '-0.02em' }}
        >
          بلا حدود
        </h1>
        <motion.p
          className="text-white/38 text-sm tracking-[0.16em] uppercase text-center"
          style={{ fontFamily: 'var(--font-sans)', fontWeight: 300, opacity: s3SubOp }}
        >
          The flagship for those who lead.
        </motion.p>
      </motion.div>

      {/* ── Scene 4: color label ─────────────────────────────────── */}
      <motion.div
        className="absolute top-[9%] left-0 right-0 text-center"
        style={{ opacity: s4Op }}
      >
        <p
          className="text-[9px] uppercase tracking-[0.52em]"
          style={{ fontFamily: 'var(--font-sans)', color: 'rgba(196,146,42,0.55)' }}
        >
          New
        </p>
        <p
          className="text-white/65 text-base md:text-lg tracking-[0.14em] uppercase mt-1.5"
          style={{ fontFamily: 'var(--font-sans)', fontWeight: 300 }}
        >
          Desert Titanium
        </p>
      </motion.div>

      {/* ── Scene 5: CTA ─────────────────────────────────────────── */}
      <motion.div
        className="absolute bottom-10 left-0 right-0 flex flex-col items-center gap-3"
        style={{ opacity: s5Op, y: s5Y }}
      >
        <h2
          className="font-display text-3xl md:text-4xl text-white/88 text-center"
          style={{ letterSpacing: '-0.015em' }}
        >
          اكتشف المجموعة
        </h2>
        <p
          className="text-white/32 text-sm text-center"
          style={{ fontFamily: 'var(--font-sans)', fontWeight: 300 }}
        >
          Flagship devices · B2B wholesale · 40+ countries
        </p>
        <motion.a
          href="#collection"
          className="btn-bronze px-10 py-3.5 text-sm tracking-[0.12em] uppercase pointer-events-auto mt-2"
          style={{ fontFamily: 'var(--font-sans)', fontWeight: 500, opacity: s5CtaOp }}
        >
          View Collection →
        </motion.a>
      </motion.div>

    </div>
  )
}
