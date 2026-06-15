'use client'

import { motion, MotionValue, useTransform } from 'framer-motion'

interface Props { progress: MotionValue<number> }

export function PhoneOverlay({ progress }: Props) {

  // Scene 2: assembled headline (p=0.50-0.62 hold, 0.62-0.66 fade)
  const heroOp    = useTransform(progress, [0.50, 0.56, 0.62, 0.66], [0, 1, 1, 0])
  const heroY     = useTransform(progress, [0.50, 0.56], [20, 0])
  const taglineOp = useTransform(progress, [0.52, 0.58, 0.62, 0.66], [0, 1, 1, 0])

  // Scene 3: camera close-up specs (p=0.82-0.90 show, 0.90-0.92 fade with phone reset)
  const camTitleOp = useTransform(progress, [0.82, 0.87, 0.91, 0.93], [0, 1, 1, 0])
  const spec1Op    = useTransform(progress, [0.83, 0.87, 0.91, 0.93], [0, 1, 1, 0])
  const spec2Op    = useTransform(progress, [0.85, 0.89, 0.91, 0.93], [0, 1, 1, 0])
  const spec3Op    = useTransform(progress, [0.87, 0.91, 0.91, 0.93], [0, 1, 1, 0])
  const spec1Y     = useTransform(progress, [0.83, 0.87], [14, 0])
  const spec2Y     = useTransform(progress, [0.85, 0.89], [14, 0])
  const spec3Y     = useTransform(progress, [0.87, 0.91], [14, 0])

  // Scene 4: CTA (p=0.93-1.0)
  const ctaOp      = useTransform(progress, [0.93, 0.97, 0.99, 1.0], [0, 1, 1, 0])
  const ctaLabelOp = useTransform(progress, [0.94, 0.98, 0.99, 1.0], [0, 1, 1, 0])

  const SPECS = [
    { val: '48 MP', label: 'Main Camera', op: spec1Op, y: spec1Y },
    { val: '8×',   label: 'Optical Zoom', op: spec2Op, y: spec2Y },
    { val: 'ƒ/1.6',label: 'Aperture',    op: spec3Op, y: spec3Y },
  ]

  return (
    <div className="absolute inset-0 z-10 pointer-events-none select-none">

      {/* ── Scene 2: assembled headline ───────────────────────────── */}
      <motion.div
        className="absolute top-[10%] left-0 right-0 flex flex-col items-center gap-3"
        style={{ opacity: heroOp }}
      >
        <motion.h1
          className="font-display text-5xl md:text-7xl gold-text text-center"
          style={{ letterSpacing: '-0.02em', y: heroY }}
        >
          بلا حدود
        </motion.h1>
        <motion.p
          className="text-white/38 text-sm tracking-[0.14em] uppercase text-center"
          style={{ fontFamily: "var(--font-sans)", fontWeight: 300, opacity: taglineOp }}
        >
          The flagship for those who lead.
        </motion.p>
      </motion.div>

      {/* ── Scene 3: camera specs ─────────────────────────────────── */}
      <motion.div
        className="absolute top-[10%] left-0 right-0 text-center"
        style={{ opacity: camTitleOp }}
      >
        <p
          className="text-white/85 text-3xl md:text-4xl"
          style={{ fontFamily: 'var(--font-sans)', fontWeight: 200, letterSpacing: '-0.025em' }}
        >
          A big zoom forward.
        </p>
        <p
          className="mt-2 text-[10px] uppercase tracking-[0.28em]"
          style={{ fontFamily: 'var(--font-sans)', color: 'rgba(196,146,42,0.5)' }}
        >
          Pro Camera System
        </p>
      </motion.div>

      <div className="absolute bottom-14 left-0 right-0 flex justify-center gap-10 md:gap-16">
        {SPECS.map(({ val, label, op, y }) => (
          <motion.div
            key={label}
            className="flex flex-col items-center gap-1"
            style={{ opacity: op, y }}
          >
            <span
              className="text-white text-3xl md:text-4xl font-light"
              style={{ fontFamily: 'var(--font-sans)', letterSpacing: '-0.025em' }}
            >
              {val}
            </span>
            <span
              className="text-[9px] uppercase tracking-[0.22em]"
              style={{ fontFamily: 'var(--font-sans)', color: 'rgba(255,255,255,0.28)' }}
            >
              {label}
            </span>
          </motion.div>
        ))}
      </div>

      {/* ── Scene 4: CTA ──────────────────────────────────────────── */}
      <motion.div
        className="absolute inset-0 flex flex-col items-center justify-center gap-5"
        style={{ opacity: ctaOp }}
      >
        <motion.p
          className="text-[10px] uppercase tracking-[0.38em]"
          style={{ fontFamily: 'var(--font-sans)', color: 'rgba(196,146,42,0.48)', opacity: ctaLabelOp }}
        >
          Mr. Ismail Trading LLC — Dubai
        </motion.p>
        <h2
          className="font-display text-4xl md:text-5xl text-white/88 text-center"
          style={{ letterSpacing: '-0.015em' }}
        >
          اكتشف المجموعة
        </h2>
        <p
          className="text-white/35 text-sm text-center"
          style={{ fontFamily: 'var(--font-sans)', fontWeight: 300 }}
        >
          Flagship devices · B2B wholesale · 40+ countries
        </p>
        <a
          href="#collection"
          className="btn-bronze px-10 py-3.5 text-sm tracking-[0.12em] uppercase pointer-events-auto mt-3"
          style={{ fontFamily: 'var(--font-sans)', fontWeight: 500 }}
        >
          View Collection →
        </a>
      </motion.div>

    </div>
  )
}
