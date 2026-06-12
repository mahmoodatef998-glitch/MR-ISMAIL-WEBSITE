'use client'

import { mapRange, easeInOutCubic, easeOutExpo } from './utils'

interface Props { scrollProgress: number }

function fade(p: number, start: number, end: number) {
  return easeInOutCubic(mapRange(p, start, end, 0, 1))
}

export function HeroOverlay({ scrollProgress: p }: Props) {
  // Phase opacities
  const showPhase1   = 1 - fade(p, 0.12, 0.22)
  const showPhase3   = fade(p, 0.38, 0.52) * (1 - fade(p, 0.66, 0.74))
  const showPhase4   = fade(p, 0.72, 0.84) * (1 - fade(p, 0.86, 0.92))
  const showPhase5   = easeOutExpo(mapRange(p, 0.90, 1.0, 0, 1))
  const showScroll   = 1 - fade(p, 0, 0.05)

  return (
    <div className="absolute inset-0 z-10 pointer-events-none select-none overflow-hidden">

      {/* ── PHASE 1 — Hero title ─────────────────────────────────────────── */}
      <div
        className="absolute top-1/2 left-8 xl:left-20 -translate-y-1/2 max-w-lg"
        style={{ opacity: showPhase1, transform: `translateY(calc(-50% + ${(1 - showPhase1) * 20}px))`, transition: 'none' }}
      >
        <p className="text-[#c8a96e] text-[11px] font-black uppercase tracking-[0.35em] mb-5">
          Next Generation · 2025
        </p>
        <h1 className="text-[4.5rem] xl:text-[6rem] font-black text-white leading-[0.96] tracking-tight mb-6">
          Beyond<br />
          <span className="gold-text">Every<br />Limit.</span>
        </h1>
        <p className="text-gray-400 text-base xl:text-lg max-w-xs leading-relaxed mb-8">
          Engineered from the inside out. Titanium precision meets cinematic vision.
        </p>
        <div className="flex items-center gap-6 text-xs text-gray-500 uppercase tracking-wider">
          {['Titanium Frame', 'ProCamera System', 'All-Day Power'].map(f => (
            <span key={f} className="flex items-center gap-1.5">
              <span className="w-1 h-1 rounded-full bg-[#c8a96e] inline-block" />
              {f}
            </span>
          ))}
        </div>
      </div>

      {/* ── PHASE 3 — Explode callout ────────────────────────────────────── */}
      <div
        className="absolute top-10 inset-x-0 text-center"
        style={{ opacity: showPhase3, transform: `translateY(${(1 - showPhase3) * -15}px)`, transition: 'none' }}
      >
        <p className="text-[#c8a96e] text-[11px] font-black uppercase tracking-[0.35em] mb-3">
          Every Component. Perfected.
        </p>
        <h2 className="text-4xl xl:text-5xl font-black text-white leading-tight">
          Engineered to the<br />
          <span className="gold-text">Last Detail</span>
        </h2>
      </div>

      {/* Side labels for exploded components */}
      {showPhase3 > 0.1 && (
        <>
          <ComponentLabel x="left-6 xl:left-20" y="top-[38%]" label="A18 Pro SoC" sub="3nm Process" opacity={showPhase3} />
          <ComponentLabel x="right-6 xl:right-20" y="top-[55%]" label="ProVision Battery" sub="4,685 mAh" opacity={showPhase3} align="right" />
          <ComponentLabel x="left-6 xl:left-20" y="top-[20%]" label="ProCamera Array" sub="48MP · 12MP · 12MP" opacity={showPhase3} />
          <ComponentLabel x="right-6 xl:right-20" y="top-[30%]" label="Front Glass" sub="Ceramic Shield" opacity={showPhase3} align="right" />
        </>
      )}

      {/* ── PHASE 4 — Reassembly ─────────────────────────────────────────── */}
      <div
        className="absolute bottom-[28%] inset-x-0 text-center"
        style={{ opacity: showPhase4, transition: 'none' }}
      >
        <h2 className="text-3xl xl:text-4xl font-black text-white">
          Rebuilt from the<br /><span className="gold-text">Ground Up</span>
        </h2>
      </div>

      {/* ── PHASE 5 — Final reveal ───────────────────────────────────────── */}
      <div
        className="absolute bottom-[18%] inset-x-0 text-center"
        style={{ opacity: showPhase5, transform: `translateY(${(1 - showPhase5) * 30}px)`, transition: 'none' }}
      >
        <p className="text-[#c8a96e] text-[11px] font-black uppercase tracking-[0.4em] mb-4">
          Welcome to Tomorrow
        </p>
        <h2 className="text-5xl xl:text-7xl font-black text-white mb-8 leading-none">
          Enter the<br />
          <span className="gold-text">Future.</span>
        </h2>
        <button
          className="pointer-events-auto px-10 py-4 bg-gradient-to-r from-[#c8a96e] to-[#e8c97a] text-[#050b18] font-black text-sm rounded-xl hover:scale-105 hover:shadow-2xl hover:shadow-[#c8a96e]/30 transition-all duration-300 uppercase tracking-widest"
          onClick={() => document.getElementById('products')?.scrollIntoView({ behavior: 'smooth' })}
        >
          Explore Now
        </button>
      </div>

      {/* ── Scroll hint ──────────────────────────────────────────────────── */}
      <div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3"
        style={{ opacity: showScroll }}
      >
        <span className="text-[10px] text-gray-600 uppercase tracking-[0.35em]">Scroll to Explore</span>
        <div className="w-px h-14 bg-gradient-to-b from-[#c8a96e]/50 to-transparent animate-pulse" />
      </div>

      {/* ── Progress bar ─────────────────────────────────────────────────── */}
      <div className="absolute right-6 top-1/2 -translate-y-1/2 flex flex-col gap-3 items-center">
        {['01', '02', '03', '04', '05'].map((n, i) => {
          const sectionProgress = i / 4
          const isActive = p >= sectionProgress - 0.05 && p < sectionProgress + 0.25
          return (
            <div key={n} className="flex items-center gap-2">
              <span className={`text-[9px] font-bold transition-colors duration-300 ${isActive ? 'text-[#c8a96e]' : 'text-gray-700'}`}>
                {n}
              </span>
              <div className={`w-0.5 transition-all duration-300 rounded-full ${isActive ? 'h-6 bg-[#c8a96e]' : 'h-3 bg-gray-800'}`} />
            </div>
          )
        })}
      </div>
    </div>
  )
}

function ComponentLabel({ x, y, label, sub, opacity, align = 'left' }: {
  x: string; y: string; label: string; sub: string; opacity: number; align?: 'left' | 'right'
}) {
  return (
    <div
      className={`absolute ${x} ${y} ${align === 'right' ? 'text-right' : 'text-left'}`}
      style={{ opacity, transition: 'none' }}
    >
      <div className="flex items-center gap-2 mb-1" style={{ justifyContent: align === 'right' ? 'flex-end' : 'flex-start' }}>
        <span className="w-8 h-px bg-[#c8a96e]/50 inline-block" />
        <span className="text-[11px] font-black text-white uppercase tracking-wider">{label}</span>
      </div>
      <p className="text-[10px] text-gray-500 pl-10">{sub}</p>
    </div>
  )
}
