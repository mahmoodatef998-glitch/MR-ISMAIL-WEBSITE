'use client'

import { motion, MotionValue, useTransform, useMotionValueEvent } from 'framer-motion'
import { useState } from 'react'

interface Props { progress: MotionValue<number> }

const LABELS = [
  { en: 'In Hand',      ar: '١' },
  { en: 'Camera',       ar: '٢' },
  { en: 'Titanium',     ar: '٣' },
  { en: 'Full Reveal',  ar: '٤' },
  { en: 'Architecture', ar: '٥' },
]

// Progress value at which each scene becomes dominant
const SCENE_CUTS = [0.0, 0.20, 0.40, 0.60, 0.80]

export function StoryNav({ progress }: Props) {
  const [activeIdx, setActiveIdx] = useState(0)

  useMotionValueEvent(progress, 'change', (v) => {
    let idx = 0
    SCENE_CUTS.forEach((cut, i) => { if (v >= cut) idx = i })
    setActiveIdx(idx)
  })

  // ── Top story bar fills ──────────────────────────────────────────
  // Each segment covers its 1/5 of the scroll range
  const f0 = useTransform(progress, [0.00, 0.20], [0, 1])
  const f1 = useTransform(progress, [0.20, 0.40], [0, 1])
  const f2 = useTransform(progress, [0.40, 0.60], [0, 1])
  const f3 = useTransform(progress, [0.60, 0.80], [0, 1])
  const f4 = useTransform(progress, [0.80, 1.00], [0, 1])
  const fills = [f0, f1, f2, f3, f4]

  return (
    <>
      {/* ── Story bar — top of hero ────────────────────────────── */}
      <div className="absolute top-0 inset-x-0 z-30 flex gap-1 p-2.5 pointer-events-none">
        {fills.map((fill, i) => (
          <div key={i} className="relative flex-1 h-[2px] rounded-full overflow-hidden"
            style={{ background: 'rgba(255,255,255,0.10)' }}>
            <motion.div
              className="absolute inset-0 origin-left rounded-full"
              style={{
                scaleX: fill,
                background: i === activeIdx
                  ? 'linear-gradient(to right, rgba(196,146,42,0.9), rgba(212,168,64,0.7))'
                  : 'rgba(255,255,255,0.55)',
              }}
            />
          </div>
        ))}
      </div>

      {/* ── Right-side story thread ────────────────────────────── */}
      <div className="absolute right-5 inset-y-0 z-20 flex items-center pointer-events-none select-none">
        <div className="relative flex flex-col items-end" style={{ gap: '2rem' }}>

          {/* Vertical line — background */}
          <div
            className="absolute"
            style={{
              right: 2,
              top: 4,
              bottom: 4,
              width: 1,
              background: 'rgba(255,255,255,0.07)',
            }}
          />

          {/* Vertical line — filled (gold) */}
          <motion.div
            className="absolute origin-top"
            style={{
              right: 2,
              top: 4,
              bottom: 4,
              width: 1,
              background: 'linear-gradient(to bottom, rgba(196,146,42,0.7), rgba(196,146,42,0.25))',
              scaleY: progress,
            }}
          />

          {/* Scene dots + labels */}
          {LABELS.map((lbl, i) => {
            const isActive = activeIdx === i
            const isPast   = activeIdx > i
            return (
              <div key={i} className="relative flex items-center gap-2.5 z-10">
                {/* Scene label — slides in for active */}
                <span
                  className="text-[8px] uppercase tracking-[0.24em] whitespace-nowrap transition-all duration-500"
                  style={{
                    fontFamily: 'var(--font-sans)',
                    color: isActive ? 'rgba(196,146,42,0.80)' : 'transparent',
                    transform: isActive ? 'translateX(0)' : 'translateX(6px)',
                  }}
                >
                  {lbl.en}
                </span>

                {/* Tick line from label to dot */}
                <div
                  className="transition-all duration-500"
                  style={{
                    width: isActive ? 10 : 0,
                    height: 1,
                    background: 'rgba(196,146,42,0.35)',
                    overflow: 'hidden',
                  }}
                />

                {/* Dot */}
                <div
                  className="rounded-full transition-all duration-500"
                  style={{
                    width: isActive ? 6 : isPast ? 4 : 3,
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
    </>
  )
}
