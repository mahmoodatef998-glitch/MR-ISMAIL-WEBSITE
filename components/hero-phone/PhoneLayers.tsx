'use client'

import { motion, MotionValue, useTransform } from 'framer-motion'

interface Props { progress: MotionValue<number> }

// ── Layer visual components ─────────────────────────────────────────────────

function DisplayLayer() {
  return (
    <div className="absolute inset-0">
      {/* Screen base */}
      <div className="absolute inset-0" style={{
        background: 'linear-gradient(155deg, #070910 0%, #0C1022 45%, #08091A 75%, #060810 100%)',
      }} />
      {/* Wallpaper warm glow — bottom-right corner */}
      <div className="absolute inset-0" style={{
        background: 'radial-gradient(ellipse 60% 70% at 68% 108%, rgba(196,146,42,0.10) 0%, transparent 100%)',
      }} />
      {/* Glass sheen */}
      <div className="absolute inset-0" style={{
        background: 'linear-gradient(150deg, rgba(255,255,255,0.028) 0%, transparent 42%)',
      }} />
      {/* Dynamic island */}
      <div
        className="absolute bg-black rounded-full"
        style={{ width: 86, height: 22, top: 14, left: '50%', transform: 'translateX(-50%)' }}
      />
      {/* Status bar icons */}
      <div className="absolute top-4 right-5 flex items-center gap-1.5" style={{ opacity: 0.32 }}>
        <svg width="14" height="10" viewBox="0 0 14 10" fill="white">
          <rect x="0" y="6" width="2.5" height="4" rx="0.5" />
          <rect x="3.5" y="4" width="2.5" height="6" rx="0.5" />
          <rect x="7" y="2" width="2.5" height="8" rx="0.5" />
          <rect x="10.5" y="0" width="2.5" height="10" rx="0.5" />
        </svg>
        <svg width="13" height="10" viewBox="0 0 13 10" fill="none" stroke="white" strokeWidth="1.4">
          <circle cx="6.5" cy="8.5" r="1" fill="white" stroke="none" />
          <path d="M3.5 5.6a4.2 4.2 0 015.9 0" />
          <path d="M1.2 3a8 8 0 0110.6 0" />
        </svg>
        <div className="flex items-center gap-0.5">
          <div style={{ width: 22, height: 10, border: '1px solid rgba(255,255,255,0.55)', borderRadius: 3, padding: 1.5 }}>
            <div style={{ width: '80%', height: '100%', background: 'rgba(255,255,255,0.8)', borderRadius: 1.5 }} />
          </div>
          <div style={{ width: 1.5, height: 5, background: 'rgba(255,255,255,0.5)', borderRadius: 1 }} />
        </div>
      </div>
    </div>
  )
}

function TitaniumFrameLayer() {
  return (
    <div className="absolute inset-0" style={{
      background: 'linear-gradient(180deg, #606062 0%, #979799 15%, #717173 32%, #ABABAC 52%, #7C7C7E 68%, #8E8E90 85%, #646466 100%)',
    }}>
      {/* Top specular edge */}
      <div className="absolute top-0 inset-x-0 h-px" style={{ background: 'rgba(255,255,255,0.32)' }} />
      {/* Bottom shadow edge */}
      <div className="absolute bottom-0 inset-x-0 h-px" style={{ background: 'rgba(0,0,0,0.4)' }} />
      {/* Brushed grain */}
      <div className="absolute inset-0" style={{
        backgroundImage: 'repeating-linear-gradient(90deg, transparent, transparent 3px, rgba(255,255,255,0.018) 3px, rgba(255,255,255,0.018) 4px)',
      }} />
      {/* Volume left */}
      <div className="absolute left-0 inset-y-0 flex flex-col justify-center gap-1.5 -translate-x-0.5">
        <div style={{ width: 2, height: 22, background: 'linear-gradient(180deg,#484848,#686868)', borderRadius: 1 }} />
        <div style={{ width: 2, height: 22, background: 'linear-gradient(180deg,#484848,#686868)', borderRadius: 1 }} />
      </div>
      {/* Power right */}
      <div className="absolute right-0 inset-y-0 flex items-center translate-x-0.5">
        <div style={{ width: 2, height: 30, background: 'linear-gradient(180deg,#484848,#686868)', borderRadius: 1 }} />
      </div>
    </div>
  )
}

function LogicBoardLayer() {
  return (
    <div className="absolute inset-0">
      <div className="absolute inset-0" style={{
        background: 'linear-gradient(140deg, #0D1C0C 0%, #182D16 38%, #121F10 68%, #0D1A0C 100%)',
      }} />
      {/* PCB grid */}
      <div className="absolute inset-0" style={{
        backgroundImage: `
          linear-gradient(90deg, rgba(72,152,62,0.065) 1px, transparent 1px),
          linear-gradient(0deg, rgba(72,152,62,0.065) 1px, transparent 1px)
        `,
        backgroundSize: '18px 18px',
      }} />
      {/* Diagonal traces */}
      <svg className="absolute inset-0 w-full h-full" style={{ opacity: 0.13 }}>
        <line x1="5%" y1="0%" x2="24%" y2="100%" stroke="#58A050" strokeWidth="0.8" />
        <line x1="19%" y1="100%" x2="40%" y2="0%" stroke="#58A050" strokeWidth="0.8" />
        <line x1="61%" y1="0%" x2="79%" y2="100%" stroke="#58A050" strokeWidth="0.8" />
        <line x1="82%" y1="100%" x2="97%" y2="0%" stroke="#58A050" strokeWidth="0.8" />
        <rect x="2%" y="25%" width="4%" height="50%" fill="#2A3C28" />
        <rect x="94%" y="25%" width="4%" height="50%" fill="#2A3C28" />
      </svg>
      {/* A19 Pro chip */}
      <div className="absolute flex items-center justify-center" style={{
        right: '23%', top: '50%', transform: 'translateY(-50%)',
        width: 66, height: 66,
        background: 'linear-gradient(145deg, #1C1C1C 0%, #272727 100%)',
        border: '1px solid rgba(255,255,255,0.075)',
        boxShadow: '0 4px 18px rgba(0,0,0,0.85), inset 0 1px 0 rgba(255,255,255,0.045)',
      }}>
        <div className="text-center">
          <div style={{ color: 'rgba(255,255,255,0.36)', fontSize: 7, fontFamily: 'var(--font-sans)', letterSpacing: '0.14em' }}>A19</div>
          <div style={{ color: 'rgba(255,255,255,0.18)', fontSize: 5.5, fontFamily: 'var(--font-sans)', letterSpacing: '0.12em' }}>PRO</div>
        </div>
      </div>
      {/* Secondary chips */}
      {[[9,18,24,40],[9,66,20,28],[52,68,16,22],[40,16,14,22]].map(([l,t,w,h],i) => (
        <div key={i} className="absolute" style={{
          left: `${l}%`, top: `${t}%`, width: w, height: h,
          background: '#141814', border: '1px solid rgba(255,255,255,0.04)',
        }} />
      ))}
    </div>
  )
}

function BatteryCameraLayer() {
  return (
    <div className="absolute inset-0" style={{ background: '#090909' }}>
      {/* Battery */}
      <div className="absolute flex flex-col justify-between" style={{
        left: '4%', top: '10%', width: '53%', height: '80%',
        background: 'linear-gradient(155deg, #181818, #111111)',
        border: '1px solid rgba(255,255,255,0.05)', borderRadius: 5,
        padding: '10px 12px',
      }}>
        <div className="flex gap-1">
          {Array.from({ length: 7 }).map((_, i) => (
            <div key={i} style={{
              width: 3, height: 14, borderRadius: 2,
              background: i < 5 ? 'rgba(196,146,42,0.28)' : 'rgba(255,255,255,0.05)',
            }} />
          ))}
        </div>
        <span style={{
          color: 'rgba(255,255,255,0.09)', fontSize: 7, letterSpacing: '0.2em',
          fontFamily: 'var(--font-sans)',
        }}>
          5000 mAh · High-Density
        </span>
      </div>
      {/* Camera island */}
      <div className="absolute flex flex-wrap content-center justify-center gap-2.5 p-3" style={{
        right: '3%', top: '6%', width: '34%', height: '88%',
        background: 'linear-gradient(145deg, #0C0C0C, #0E0E0E)',
        border: '1px solid rgba(255,255,255,0.065)',
        borderRadius: 16,
      }}>
        {/* Main lens (wide) */}
        <div className="flex items-center justify-center rounded-full" style={{
          width: 42, height: 42,
          background: 'radial-gradient(circle at 33% 33%, #19192A, #07070E)',
          border: '2.5px solid rgba(196,146,42,0.42)',
          boxShadow: '0 0 14px rgba(196,146,42,0.13), inset 0 0 10px rgba(0,0,0,0.8)',
        }}>
          <div className="rounded-full" style={{
            width: 24, height: 24,
            background: 'radial-gradient(circle at 33% 33%, #0A0A16, #030308)',
          }}>
            <div style={{ width: 6, height: 6, borderRadius: '50%', background: 'rgba(255,255,255,0.22)', margin: '4px auto 0' }} />
          </div>
        </div>
        {/* Tele lens */}
        <div className="flex items-center justify-center rounded-full" style={{
          width: 33, height: 33,
          background: 'radial-gradient(circle at 33% 33%, #19192A, #07070E)',
          border: '2px solid rgba(196,146,42,0.28)',
        }}>
          <div className="rounded-full" style={{ width: 18, height: 18, background: 'radial-gradient(circle at 33% 33%, #0A0A16, #030308)' }} />
        </div>
        {/* Ultra-wide */}
        <div className="flex items-center justify-center rounded-full" style={{
          width: 26, height: 26,
          background: 'radial-gradient(circle at 33% 33%, #19192A, #07070E)',
          border: '1.5px solid rgba(196,146,42,0.20)',
        }}>
          <div className="rounded-full" style={{ width: 13, height: 13, background: 'radial-gradient(circle at 33% 33%, #0A0A16, #030308)' }} />
        </div>
        {/* Flash / LiDAR */}
        <div className="rounded-full" style={{
          width: 13, height: 13,
          background: '#181810',
          border: '1px solid rgba(255,220,80,0.28)',
          boxShadow: '0 0 5px rgba(255,200,0,0.08)',
        }} />
      </div>
    </div>
  )
}

// ── Data ──────────────────────────────────────────────────────────────────────

const LAYERS = [
  { id: '01', name: 'DISPLAY & GLASS',  specs: ['Super Retina XDR', 'Ceramic Shield 2'], startY: -220, height: '22vh' },
  { id: '02', name: 'TITANIUM FRAME',   specs: ['Aerospace-grade', 'Grade 5'],           startY: -82,  height: '5vh'  },
  { id: '03', name: 'LOGIC BOARD',      specs: ['A19 Pro Chip', 'Neural Engine'],        startY:  72,  height: '13vh' },
  { id: '04', name: 'BATTERY & CAMERA', specs: ['5000 mAh', 'Pro Camera System'],       startY:  220, height: '20vh' },
]

const LayerViews = [DisplayLayer, TitaniumFrameLayer, LogicBoardLayer, BatteryCameraLayer]
const RADII = ['2rem 2rem 0 0', '0', '0', '0 0 2rem 2rem']

// ── Component ─────────────────────────────────────────────────────────────────

export function PhoneLayers({ progress }: Props) {
  // Assembly: p 0.08 → 0.50
  const asmT    = useTransform(progress, [0.08, 0.50], [0, 1])
  const labelOp = useTransform(asmT, [0, 0.55, 1], [1, 0.4, 0])
  const titleOp = useTransform(asmT, [0, 0.62, 1], [1, 0.5, 0])
  const fadeIn  = useTransform(progress, [0, 0.06], [0, 1])

  // Camera island zoom: p 0.66 → 0.82, reset p 0.90 → 0.92
  const zoomScale = useTransform(progress, [0.66, 0.82, 0.90, 0.92], [1, 2.6, 2.6, 1])
  const zoomX     = useTransform(progress, [0.66, 0.82, 0.90, 0.92], ['0%', '-22%', '-22%', '0%'])
  const zoomY     = useTransform(progress, [0.66, 0.82, 0.90, 0.92], ['0%',  '16%',  '16%', '0%'])

  // Per-layer Y (no hooks inside loops)
  const y0 = useTransform(asmT, [0, 1], [LAYERS[0].startY, 0])
  const y1 = useTransform(asmT, [0, 1], [LAYERS[1].startY, 0])
  const y2 = useTransform(asmT, [0, 1], [LAYERS[2].startY, 0])
  const y3 = useTransform(asmT, [0, 1], [LAYERS[3].startY, 0])
  const yVals = [y0, y1, y2, y3]

  return (
    <motion.div
      className="absolute inset-0 flex flex-col items-center justify-center"
      style={{ opacity: fadeIn }}
    >
      {/* Title */}
      <motion.div
        className="absolute top-[8%] left-0 right-0 text-center"
        style={{ opacity: titleOp }}
      >
        <p
          className="text-white/88 text-xl md:text-2xl"
          style={{ fontFamily: 'var(--font-display)', fontStyle: 'italic', letterSpacing: '0.03em' }}
        >
          iPhone 17 Pro Max
        </p>
        <p
          className="mt-2 text-[9px] uppercase tracking-[0.62em]"
          style={{ fontFamily: 'var(--font-sans)', color: 'rgba(255,255,255,0.18)' }}
        >
          4 · Layer Architecture
        </p>
      </motion.div>

      {/* Phone stack — camera island at 80% X, 83% Y of container */}
      <motion.div
        style={{
          scale: zoomScale,
          x: zoomX,
          y: zoomY,
          width: 'min(78vw, 820px)',
          transformOrigin: '80% 83%',
        }}
      >
        {LAYERS.map((layer, i) => {
          const View = LayerViews[i]
          return (
            <motion.div key={layer.id} className="relative" style={{ y: yVals[i] }}>

              {/* Layer slice */}
              <div
                className="relative overflow-hidden"
                style={{
                  height: layer.height,
                  borderRadius: RADII[i],
                  borderTop: i > 0 ? '1px solid rgba(255,255,255,0.036)' : 'none',
                  boxShadow:
                    i === 0 ? '0 -16px 48px rgba(0,0,0,0.75), inset 0 1px 0 rgba(255,255,255,0.055)' :
                    i === 3 ? '0 20px 52px rgba(0,0,0,0.85)' :
                              '0 2px 10px rgba(0,0,0,0.55)',
                }}
              >
                <View />
              </div>

              {/* Right label — desktop only */}
              <motion.div
                className="absolute top-1/2 -translate-y-1/2 hidden md:flex items-center gap-2.5"
                style={{ opacity: labelOp, left: 'calc(100% + 1.5rem)' }}
              >
                <div style={{ width: 28, height: 1, background: 'rgba(255,255,255,0.12)' }} />
                <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#C4922A', flexShrink: 0 }} />
                <div>
                  <p style={{
                    fontFamily: 'var(--font-sans)', fontWeight: 300,
                    fontSize: 9, letterSpacing: '0.22em', textTransform: 'uppercase',
                    color: 'rgba(255,255,255,0.44)', whiteSpace: 'nowrap',
                  }}>
                    {layer.id}. {layer.name}
                  </p>
                  <p style={{
                    fontFamily: 'var(--font-sans)', fontSize: 8, marginTop: 3,
                    color: 'rgba(196,146,42,0.32)', whiteSpace: 'nowrap',
                  }}>
                    {layer.specs[0]} · {layer.specs[1]}
                  </p>
                </div>
              </motion.div>

            </motion.div>
          )
        })}
      </motion.div>
    </motion.div>
  )
}
