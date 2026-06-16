'use client'

import { useRef, useEffect, useState } from 'react'
import {
  motion,
  useScroll,
  useSpring,
  useTransform,
  useMotionValueEvent,
} from 'framer-motion'
import Lenis from 'lenis'
import Image from 'next/image'

// ── Scene data ────────────────────────────────────────────────────────────────

const SCENES = [
  {
    src:      '/storyboard/scene-04.jpg.png',
    alt:      'iPhone 17 Pro Max Desert Titanium floating',
    eyebrow:  'Mr. Ismail Trading LLC — Dubai',
    title:    'iPhone 17 Pro Max',
    subtitle: 'Desert Titanium',
    body:     'الجهاز الأكثر تطوراً في تاريخ Apple',
    arabic:   false,
    cta:      null,
    navLabel: 'Hero',
  },
  {
    src:      '/storyboard/scene-01.jpg.jpg',
    alt:      'iPhone 17 Pro Max Pro Camera System close-up',
    eyebrow:  'Pro Camera System',
    title:    '48 MP · 5× · ƒ/1.6',
    subtitle: 'The Camera. Redefined.',
    body:     null,
    arabic:   false,
    cta:      null,
    navLabel: 'Camera',
  },
  {
    src:      '/storyboard/scene-02.jpg.jpg',
    alt:      'iPhone 17 Pro Max front and back reveal',
    eyebrow:  'Desert Titanium — حصري في الخليج',
    title:    'بلا حدود',
    subtitle: 'The flagship for those who lead.',
    body:     null,
    arabic:   true,
    cta:      null,
    navLabel: 'Design',
  },
  {
    src:      '/storyboard/scene-03.jpg.png',
    alt:      'iPhone 17 Pro Max 4-Layer Architecture',
    eyebrow:  null,
    title:    null,
    subtitle: null,
    body:     null,
    arabic:   false,
    cta:      'اكتشف المجموعة →',
    navLabel: 'Build',
  },
] as const

// ── Component ─────────────────────────────────────────────────────────────────

export function HeroCinematic() {
  const containerRef = useRef<HTMLDivElement>(null)
  const [activeScene, setActiveScene] = useState(0)

  useEffect(() => {
    const lenis = new Lenis({ duration: 1.6 })
    const raf = (t: number) => { lenis.raf(t); requestAnimationFrame(raf) }
    const id = requestAnimationFrame(raf)
    return () => { lenis.destroy(); cancelAnimationFrame(id) }
  }, [])

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  })

  const progress = useSpring(scrollYProgress, {
    stiffness: 55,
    damping: 30,
    restDelta: 0.001,
  })

  // ── Per-scene opacity (fade in → hold → fade out) ──────────────────────────
  const op0 = useTransform(progress, [0.00, 0.06, 0.20, 0.27], [0, 1, 1, 0])
  const op1 = useTransform(progress, [0.22, 0.30, 0.46, 0.53], [0, 1, 1, 0])
  const op2 = useTransform(progress, [0.47, 0.55, 0.71, 0.78], [0, 1, 1, 0])
  const op3 = useTransform(progress, [0.73, 0.81, 0.96, 1.00], [0, 1, 1, 1])

  // ── Ken Burns scale (slow zoom while holding) ──────────────────────────────
  const sc0 = useTransform(progress, [0.00, 0.28], [1.00, 1.08])
  const sc1 = useTransform(progress, [0.22, 0.54], [1.00, 1.08])
  const sc2 = useTransform(progress, [0.47, 0.79], [1.00, 1.08])
  const sc3 = useTransform(progress, [0.73, 1.00], [1.00, 1.06])

  // ── Parallax Y ──────────────────────────────────────────────────────────────
  const y0 = useTransform(progress, [0.00, 0.28], [0,   -60])
  const y1 = useTransform(progress, [0.22, 0.54], [50,  -60])
  const y2 = useTransform(progress, [0.47, 0.79], [50,  -60])
  const y3 = useTransform(progress, [0.73, 1.00], [50,  -40])

  // ── Text slide-up per scene ────────────────────────────────────────────────
  const ty0 = useTransform(progress, [0.00, 0.09], [28, 0])
  const ty1 = useTransform(progress, [0.22, 0.33], [28, 0])
  const ty2 = useTransform(progress, [0.47, 0.58], [28, 0])
  const ty3 = useTransform(progress, [0.73, 0.84], [28, 0])

  // ── Story bar fills ────────────────────────────────────────────────────────
  const f0 = useTransform(progress, [0.00, 0.25], [0, 1])
  const f1 = useTransform(progress, [0.25, 0.50], [0, 1])
  const f2 = useTransform(progress, [0.50, 0.75], [0, 1])
  const f3 = useTransform(progress, [0.75, 1.00], [0, 1])

  // ── Scroll hint opacity ────────────────────────────────────────────────────
  const scrollHintOp = useTransform(progress, [0, 0.07], [1, 0])

  // ── Active scene ──────────────────────────────────────────────────────────
  useMotionValueEvent(progress, 'change', (v) => {
    setActiveScene(v < 0.25 ? 0 : v < 0.50 ? 1 : v < 0.75 ? 2 : 3)
  })

  const opacities  = [op0, op1, op2, op3]
  const scales     = [sc0, sc1, sc2, sc3]
  const parallaxYs = [y0,  y1,  y2,  y3]
  const textYs     = [ty0, ty1, ty2, ty3]
  const fills      = [f0,  f1,  f2,  f3]

  return (
    <div ref={containerRef} id="home" className="relative" style={{ height: '500vh' }}>
      <div className="sticky top-0 h-screen w-full overflow-hidden bg-black">

        {/* ── Image layers ─────────────────────────────────────── */}
        {SCENES.map((scene, i) => (
          <motion.div
            key={i}
            className="absolute inset-0"
            style={{ opacity: opacities[i], zIndex: i }}
          >
            {/* Image + Ken Burns + Parallax */}
            <motion.div
              className="absolute inset-0 will-change-transform"
              style={{ scale: scales[i], y: parallaxYs[i] }}
            >
              <Image
                src={scene.src}
                alt={scene.alt}
                fill
                className="object-cover"
                priority={i === 0}
                sizes="100vw"
              />
            </motion.div>

            {/* Gradient vignette */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-black/25 pointer-events-none" />

            {/* ── Text overlay ─────────────────────────────────── */}
            <motion.div
              className="absolute inset-x-0 bottom-14 flex flex-col items-center gap-2.5 px-6 text-center pointer-events-none"
              style={{ y: textYs[i] }}
            >
              {scene.eyebrow && (
                <p
                  className="text-[9px] uppercase tracking-[0.44em]"
                  style={{ fontFamily: 'var(--font-sans)', color: 'rgba(196,146,42,0.75)' }}
                >
                  {scene.eyebrow}
                </p>
              )}

              {scene.title && (
                scene.arabic ? (
                  <h1 className="font-display text-6xl md:text-8xl gold-text leading-none">
                    {scene.title}
                  </h1>
                ) : (
                  <h1
                    className="text-white text-4xl md:text-6xl font-light tracking-tight leading-none"
                    style={{ fontFamily: 'var(--font-sans)' }}
                  >
                    {scene.title}
                  </h1>
                )
              )}

              {scene.subtitle && (
                <p
                  className="text-white/52 text-sm md:text-base tracking-[0.18em] uppercase"
                  style={{ fontFamily: 'var(--font-sans)', fontWeight: 300 }}
                >
                  {scene.subtitle}
                </p>
              )}

              {scene.body && (
                <p
                  className="text-white/30 text-xs"
                  style={{ fontFamily: 'var(--font-sans)' }}
                >
                  {scene.body}
                </p>
              )}

              {scene.cta && (
                <a
                  href="#collection"
                  className="btn-bronze px-10 py-3.5 text-sm tracking-[0.12em] uppercase pointer-events-auto mt-4"
                  style={{ fontFamily: 'var(--font-sans)', fontWeight: 500 }}
                >
                  {scene.cta}
                </a>
              )}
            </motion.div>
          </motion.div>
        ))}

        {/* ── Story bar — top ───────────────────────────────────── */}
        <div className="absolute top-0 inset-x-0 z-50 flex gap-1 p-2.5 pointer-events-none">
          {fills.map((fill, i) => (
            <div
              key={i}
              className="relative flex-1 h-[2px] rounded-full overflow-hidden"
              style={{ background: 'rgba(255,255,255,0.10)' }}
            >
              <motion.div
                className="absolute inset-0 origin-left rounded-full"
                style={{
                  scaleX: fill,
                  background:
                    i === activeScene
                      ? 'linear-gradient(to right, rgba(196,146,42,0.9), rgba(212,168,64,0.7))'
                      : 'rgba(255,255,255,0.50)',
                }}
              />
            </div>
          ))}
        </div>

        {/* ── Story nav — right side ────────────────────────────── */}
        <div className="absolute right-5 inset-y-0 z-50 flex items-center pointer-events-none select-none">
          <div className="relative flex flex-col items-end" style={{ gap: '2rem' }}>
            {/* Track line background */}
            <div
              className="absolute"
              style={{ right: 2, top: 4, bottom: 4, width: 1, background: 'rgba(255,255,255,0.07)' }}
            />
            {/* Track line fill */}
            <motion.div
              className="absolute origin-top"
              style={{
                right: 2, top: 4, bottom: 4, width: 1,
                background: 'linear-gradient(to bottom, rgba(196,146,42,0.7), rgba(196,146,42,0.25))',
                scaleY: progress,
              }}
            />
            {/* Dots + labels */}
            {SCENES.map((scene, i) => {
              const isActive = activeScene === i
              const isPast   = activeScene > i
              return (
                <div key={i} className="relative flex items-center gap-2.5 z-10">
                  <span
                    className="text-[8px] uppercase tracking-[0.24em] whitespace-nowrap transition-all duration-500"
                    style={{
                      fontFamily: 'var(--font-sans)',
                      color: isActive ? 'rgba(196,146,42,0.80)' : 'transparent',
                      transform: isActive ? 'translateX(0)' : 'translateX(6px)',
                    }}
                  >
                    {scene.navLabel}
                  </span>
                  <div
                    className="transition-all duration-500"
                    style={{
                      width: isActive ? 10 : 0,
                      height: 1,
                      background: 'rgba(196,146,42,0.35)',
                      overflow: 'hidden',
                    }}
                  />
                  <div
                    className="rounded-full transition-all duration-500"
                    style={{
                      width:  isActive ? 6 : isPast ? 4 : 3,
                      height: isActive ? 6 : isPast ? 4 : 3,
                      background: isActive
                        ? '#C4922A'
                        : isPast
                        ? 'rgba(196,146,42,0.35)'
                        : 'rgba(255,255,255,0.12)',
                      boxShadow: isActive ? '0 0 8px rgba(196,146,42,0.6)' : 'none',
                    }}
                  />
                </div>
              )
            })}
          </div>
        </div>

        {/* ── Scroll hint ──────────────────────────────────────── */}
        <motion.div
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 z-50 pointer-events-none"
          style={{ opacity: scrollHintOp }}
        >
          <span
            className="text-[9px] uppercase tracking-[0.38em]"
            style={{ fontFamily: 'var(--font-sans)', color: 'rgba(255,255,255,0.30)' }}
          >
            Scroll
          </span>
          <div className="w-px h-10 bg-gradient-to-b from-[#C4922A]/50 to-transparent" />
        </motion.div>

      </div>
    </div>
  )
}
