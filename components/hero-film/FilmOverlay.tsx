'use client'

interface Props {
  scrollProgress: number
}

export function FilmOverlay({ scrollProgress: p }: Props) {
  // Scene 1 (0–0.14): intentional silence — no text, no UI
  // Scene 2 (0.22–0.30): whisper label fades in then out — barely visible
  const scene2Whisper =
    p > 0.22 && p < 0.26
      ? ((p - 0.22) / 0.04) * 0.2
      : p >= 0.26 && p < 0.30
        ? Math.max(0, 1 - (p - 0.26) / 0.04) * 0.2
        : 0

  return (
    <div className="absolute inset-0 z-10 pointer-events-none select-none">
      {/* Scene 2 whisper — Cairo, 10px, 20% max opacity. Barely there. */}
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
    </div>
  )
}
