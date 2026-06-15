'use client'

interface Props {
  scrollProgress: number
}

export function FilmOverlay({ scrollProgress: p }: Props) {

  // Scene 2 (0.22–0.30): whisper label
  const scene2Whisper =
    p > 0.22 && p < 0.26 ? ((p - 0.22) / 0.04) * 0.2 :
    p >= 0.26 && p < 0.30 ? Math.max(0, 1 - (p - 0.26) / 0.04) * 0.2 :
    0

  // Scene 3 (0.33–0.43): engineering annotation
  const scene3Opacity =
    p > 0.33 && p < 0.37 ? Math.min(1, (p - 0.33) / 0.04) :
    p >= 0.37 && p < 0.42 ? 1 :
    p >= 0.42 && p < 0.43 ? Math.max(0, 1 - (p - 0.42) / 0.01) :
    0

  // Scene 4 (0.49–0.57): hero text above the phone
  const headingOpacity =
    p > 0.49 && p < 0.52 ? Math.min(1, (p - 0.49) / 0.03) :
    p >= 0.52 && p < 0.55 ? 1 :
    p >= 0.55 && p < 0.57 ? Math.max(0, 1 - (p - 0.55) / 0.02) :
    0

  // Tagline: 0.015 progress stagger behind heading
  const taglineOpacity =
    p > 0.51 && p < 0.54 ? Math.min(1, (p - 0.51) / 0.03) :
    p >= 0.54 && p < 0.55 ? 1 :
    p >= 0.55 && p < 0.57 ? Math.max(0, 1 - (p - 0.55) / 0.02) :
    0

  return (
    <div className="absolute inset-0 z-10 pointer-events-none select-none">

      {/* ── Scene 2: whisper ─────────────────────────────────── */}
      <div className="absolute bottom-8 left-8" style={{ opacity: scene2Whisper }}>
        <span
          className="text-white text-[10px] uppercase tracking-[0.35em]"
          style={{ fontFamily: "'Cairo', sans-serif" }}
        >
          المجد التجاري — Dubai
        </span>
      </div>

      {/* ── Scene 3: engineering annotation ─────────────────── */}
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

      {/* ── Scene 4: hero text — above the phone ────────────── */}
      {/* Positioned at top 10-22% — phone occupies ~34-66% of viewport */}
      <div className="absolute top-[10%] left-0 right-0 flex flex-col items-center gap-3">
        {/* Arabic heading — Bodoni Moda, gold gradient */}
        <div
          style={{ opacity: headingOpacity, transform: `translateY(${(1 - headingOpacity) * 16}px)` }}
        >
          <h2
            className="font-display text-5xl md:text-6xl gold-text text-center"
            style={{ letterSpacing: '-0.02em' }}
          >
            بلا حدود
          </h2>
        </div>

        {/* English tagline — Jost Regular, muted */}
        <div
          style={{ opacity: taglineOpacity, transform: `translateY(${(1 - taglineOpacity) * 12}px)` }}
        >
          <p
            className="text-white/50 text-sm md:text-base text-center tracking-[0.12em] uppercase"
            style={{ fontFamily: "var(--font-sans, 'Jost', sans-serif)", fontWeight: 400 }}
          >
            The flagship for those who lead.
          </p>
        </div>
      </div>

    </div>
  )
}
