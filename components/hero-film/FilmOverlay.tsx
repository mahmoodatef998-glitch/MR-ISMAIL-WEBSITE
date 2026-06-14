'use client'

interface Props {
  scrollProgress: number
}

export function FilmOverlay({ scrollProgress: p }: Props) {

  // Scene 2 (0.22–0.30): whisper label — barely visible, then fades
  const scene2Whisper =
    p > 0.22 && p < 0.26 ? ((p - 0.22) / 0.04) * 0.2 :
    p >= 0.26 && p < 0.30 ? Math.max(0, 1 - (p - 0.26) / 0.04) * 0.2 :
    0

  // Scene 3 (0.33–0.42): engineering annotation appears as dolly begins
  const scene3Opacity =
    p > 0.33 && p < 0.37 ? Math.min(1, (p - 0.33) / 0.04) :
    p >= 0.37 && p < 0.42 ? 1 :
    p >= 0.42 && p < 0.43 ? Math.max(0, 1 - (p - 0.42) / 0.01) :
    0

  return (
    <div className="absolute inset-0 z-10 pointer-events-none select-none">

      {/* ── Scene 2: whisper ─────────────────────────────────── */}
      <div
        className="absolute bottom-8 left-8"
        style={{ opacity: scene2Whisper }}
      >
        <span
          className="text-white text-[10px] uppercase tracking-[0.35em]"
          style={{ fontFamily: "'Cairo', sans-serif" }}
        >
          المجد التجاري — Dubai
        </span>
      </div>

      {/* ── Scene 3: engineering annotation ─────────────────── */}
      {/* Styled like a technical drawing callout — Jost Light, no decoration */}
      <div
        className="absolute bottom-10 left-10"
        style={{ opacity: scene3Opacity }}
      >
        <div className="flex items-start gap-3">
          {/* Callout line — bronze, engineering drawing feel */}
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
              className="text-[#C4922A]/55 text-[9px] tracking-[0.05em]"
              style={{ fontFamily: "'Cairo', sans-serif" }}
            >
              المزيج الدقيق
            </span>
          </div>
        </div>
      </div>

    </div>
  )
}
