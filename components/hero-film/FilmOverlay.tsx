'use client'

interface Props { scrollProgress: number }

function fadeRange(p: number, inStart: number, inEnd: number, outStart: number, outEnd: number) {
  if (p < inStart)  return 0
  if (p < inEnd)    return (p - inStart) / (inEnd - inStart)
  if (p < outStart) return 1
  if (p < outEnd)   return 1 - (p - outStart) / (outEnd - outStart)
  return 0
}

export function FilmOverlay({ scrollProgress: p }: Props) {

  // ── Scene 2: whisper ─────────────────────────────────────────────
  const scene2Whisper = fadeRange(p, 0.22, 0.26, 0.26, 0.30) * 0.2

  // ── Scene 3: engineering annotation ──────────────────────────────
  const scene3Opacity = fadeRange(p, 0.33, 0.37, 0.42, 0.43)

  // ── Scene 4: hero text ───────────────────────────────────────────
  const headingOpacity = fadeRange(p, 0.49, 0.52, 0.55, 0.57)
  const taglineOpacity = fadeRange(p, 0.51, 0.54, 0.55, 0.57)

  // ── Scene 5: spec numbers appear in sequence ──────────────────────
  const spec1 = fadeRange(p, 0.61, 0.63, 0.69, 0.71) // 200 MP
  const spec2 = fadeRange(p, 0.63, 0.65, 0.69, 0.71) // 4K
  const spec3 = fadeRange(p, 0.65, 0.67, 0.69, 0.71) // ƒ/1.8
  const specAr = fadeRange(p, 0.67, 0.69, 0.69, 0.71) // Arabic tagline

  // ── Scene 5: warm haze — HTML overlay ────────────────────────────
  const hazeOpacity = fadeRange(p, 0.57, 0.65, 0.99, 1.0)

  return (
    <div className="absolute inset-0 z-10 pointer-events-none select-none">

      {/* ── Scene 5: void warms — radial amber haze ─────────────── */}
      <div
        className="absolute inset-0"
        style={{
          background: 'radial-gradient(ellipse 90% 55% at 50% 65%, rgba(78,51,8,0.3) 0%, transparent 100%)',
          opacity: hazeOpacity,
        }}
      />

      {/* ── Scene 2: whisper ─────────────────────────────────────── */}
      <div className="absolute bottom-8 left-8" style={{ opacity: scene2Whisper }}>
        <span
          className="text-white text-[10px] uppercase tracking-[0.35em]"
          style={{ fontFamily: "'Cairo', sans-serif" }}
        >
          المجد التجاري — Dubai
        </span>
      </div>

      {/* ── Scene 3: engineering annotation ─────────────────────── */}
      <div className="absolute bottom-10 left-10" style={{ opacity: scene3Opacity }}>
        <div className="flex items-start gap-3">
          <div className="flex flex-col items-center mt-[7px]">
            <div className="w-5 h-px bg-[#C4922A]/35" />
            <div className="w-px h-8 bg-[#C4922A]/18" />
          </div>
          <div className="flex flex-col gap-[5px]">
            <span
              className="text-white/75 text-[11px] uppercase tracking-[0.18em]"
              style={{ fontFamily: "var(--font-sans, 'Jost', sans-serif)", fontWeight: 300 }}
            >
              Grade 5 Titanium — 6Al-4V
            </span>
            <span
              className="text-[#C4922A]/55 text-[9px]"
              style={{ fontFamily: "'Cairo', sans-serif" }}
            >
              المزيج الدقيق
            </span>
          </div>
        </div>
      </div>

      {/* ── Scene 4: hero text ───────────────────────────────────── */}
      <div className="absolute top-[10%] left-0 right-0 flex flex-col items-center gap-3">
        <div style={{ opacity: headingOpacity, transform: `translateY(${(1 - headingOpacity) * 16}px)` }}>
          <h2
            className="font-display text-5xl md:text-6xl gold-text text-center"
            style={{ letterSpacing: '-0.02em' }}
          >
            بلا حدود
          </h2>
        </div>
        <div style={{ opacity: taglineOpacity, transform: `translateY(${(1 - taglineOpacity) * 12}px)` }}>
          <p
            className="text-white/50 text-sm md:text-base text-center tracking-[0.12em] uppercase"
            style={{ fontFamily: "var(--font-sans, 'Jost', sans-serif)", fontWeight: 400 }}
          >
            The flagship for those who lead.
          </p>
        </div>
      </div>

      {/* ── Scene 5: camera specs — appear in sequence ───────────── */}
      {/* Positioned lower-left — camera orbits phone center, specs are the sidebar */}
      <div className="absolute bottom-12 left-10 flex flex-col gap-2">
        <div className="flex items-end gap-8">

          <div style={{ opacity: spec1, transform: `translateY(${(1 - spec1) * 10}px)` }}>
            <div className="flex flex-col gap-[2px]">
              <span
                className="text-white text-2xl font-light tracking-[-0.02em]"
                style={{ fontFamily: "var(--font-sans, 'Jost', sans-serif)" }}
              >
                200 MP
              </span>
              <span className="text-white/35 text-[9px] uppercase tracking-[0.2em]"
                style={{ fontFamily: "var(--font-sans, 'Jost', sans-serif)" }}
              >Main</span>
            </div>
          </div>

          <div style={{ opacity: spec2, transform: `translateY(${(1 - spec2) * 10}px)` }}>
            <div className="flex flex-col gap-[2px]">
              <span
                className="text-white text-2xl font-light tracking-[-0.02em]"
                style={{ fontFamily: "var(--font-sans, 'Jost', sans-serif)" }}
              >
                4K
              </span>
              <span className="text-white/35 text-[9px] uppercase tracking-[0.2em]"
                style={{ fontFamily: "var(--font-sans, 'Jost', sans-serif)" }}
              >Video</span>
            </div>
          </div>

          <div style={{ opacity: spec3, transform: `translateY(${(1 - spec3) * 10}px)` }}>
            <div className="flex flex-col gap-[2px]">
              <span
                className="text-white text-2xl font-light tracking-[-0.02em] ltr-only"
                style={{ fontFamily: "var(--font-sans, 'Jost', sans-serif)" }}
              >
                ƒ/1.8
              </span>
              <span className="text-white/35 text-[9px] uppercase tracking-[0.2em]"
                style={{ fontFamily: "var(--font-sans, 'Jost', sans-serif)" }}
              >Aperture</span>
            </div>
          </div>

        </div>

        <div style={{ opacity: specAr }}>
          <span
            className="text-[#C4922A]/60 text-[10px] tracking-[0.08em]"
            style={{ fontFamily: "'Cairo', sans-serif" }}
          >
            كل شيء يستحق التوثيق
          </span>
        </div>
      </div>

    </div>
  )
}
