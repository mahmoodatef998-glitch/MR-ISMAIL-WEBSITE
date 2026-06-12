'use client'

import { useEffect, useRef, useState } from 'react'
import dynamic from 'next/dynamic'
import { HeroOverlay } from './HeroOverlay'

const PhoneCanvas = dynamic(
  () => import('./PhoneCanvas').then(m => ({ default: m.PhoneCanvas })),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-screen bg-[#000005] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-8 h-8 rounded-full border-2 border-[#c8a96e]/30 border-t-[#c8a96e] animate-spin" />
          <span className="text-[#c8a96e]/60 text-[10px] uppercase tracking-[0.35em]">
            Initializing
          </span>
        </div>
      </div>
    ),
  }
)

export function Hero3D() {
  const containerRef = useRef<HTMLDivElement>(null)
  // Raw ref for canvas — updated every scroll tick with zero React overhead
  const progressRef  = useRef(0)
  // Throttled state for HTML overlay only (~30fps)
  const [overlayProgress, setOverlayProgress] = useState(0)
  // Direct DOM ref for flash — no state needed
  const flashRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    let lenis: import('lenis').default | null = null
    let st: import('gsap/ScrollTrigger').ScrollTrigger | null = null
    let lastOverlayUpdate = 0

    async function init() {
      const Lenis        = (await import('lenis')).default
      const gsap         = (await import('gsap')).default
      const { ScrollTrigger } = await import('gsap/ScrollTrigger')
      gsap.registerPlugin(ScrollTrigger)

      lenis = new Lenis({
        duration: 1.4,
        easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        smoothWheel: true,
      })

      lenis.on('scroll', ScrollTrigger.update)
      gsap.ticker.add((time: number) => { lenis!.raf(time * 1000) })
      gsap.ticker.lagSmoothing(0)

      st = ScrollTrigger.create({
        trigger: containerRef.current,
        start: 'top top',
        end: 'bottom bottom',
        onUpdate: (self) => {
          const p = self.progress

          // Canvas always gets the latest value — no React re-render
          progressRef.current = p

          // Flash: direct DOM mutation — zero React overhead
          if (flashRef.current) {
            if (p > 0.93 && p < 0.97) {
              const intensity = Math.sin(((p - 0.93) / 0.04) * Math.PI) * 0.7
              flashRef.current.style.background = `rgba(40,60,255,${(intensity * 0.4).toFixed(3)})`
              flashRef.current.style.display = 'block'
            } else {
              flashRef.current.style.display = 'none'
            }
          }

          // Throttle HTML overlay updates to ~30fps
          const now = performance.now()
          if (now - lastOverlayUpdate > 33) {
            lastOverlayUpdate = now
            setOverlayProgress(p)
          }
        },
      })
    }

    init()
    return () => { lenis?.destroy(); st?.kill() }
  }, [])

  return (
    <div id="home" ref={containerRef} className="relative" style={{ height: '600vh' }}>
      <div className="sticky top-0 h-screen w-full overflow-hidden bg-[#000005]">
        <div className="absolute inset-0">
          <PhoneCanvas progressRef={progressRef} />
        </div>

        <HeroOverlay scrollProgress={overlayProgress} />

        {/* Flash overlay: direct DOM, no React state */}
        <div
          ref={flashRef}
          className="absolute inset-0 z-20 pointer-events-none"
          style={{ display: 'none' }}
        />
      </div>
    </div>
  )
}
