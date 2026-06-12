'use client'

import { useEffect, useRef, useState, useCallback } from 'react'
import dynamic from 'next/dynamic'
import { HeroOverlay } from './HeroOverlay'

// Dynamic import — no SSR for WebGL canvas
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
  const containerRef   = useRef<HTMLDivElement>(null)
  const [progress, setProgress] = useState(0)
  // Flash overlay for screen transition
  const [flash, setFlash] = useState(0)

  useEffect(() => {
    let lenis: import('lenis').default | null = null
    let st: import('gsap/ScrollTrigger').ScrollTrigger | null = null

    async function init() {
      const Lenis        = (await import('lenis')).default
      const gsap         = (await import('gsap')).default
      const { ScrollTrigger } = await import('gsap/ScrollTrigger')
      gsap.registerPlugin(ScrollTrigger)

      // Lenis smooth scroll
      lenis = new Lenis({
        duration: 1.4,
        easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        smoothWheel: true,
      })

      // Connect Lenis → GSAP ticker (important for sync!)
      lenis.on('scroll', ScrollTrigger.update)
      gsap.ticker.add((time: number) => { lenis!.raf(time * 1000) })
      gsap.ticker.lagSmoothing(0)

      // Track scroll progress
      st = ScrollTrigger.create({
        trigger: containerRef.current,
        start: 'top top',
        end: 'bottom bottom',
        onUpdate: (self) => {
          setProgress(self.progress)
          // Flash white at screen-enter transition (p ≈ 0.95)
          const p = self.progress
          if (p > 0.93 && p < 0.97) {
            const intensity = Math.sin(((p - 0.93) / 0.04) * Math.PI)
            setFlash(intensity * 0.7)
          } else {
            setFlash(0)
          }
        },
      })
    }

    init()

    return () => {
      lenis?.destroy()
      st?.kill()
    }
  }, [])

  return (
    <div id="home" ref={containerRef} className="relative" style={{ height: '600vh' }}>
      {/* Sticky viewport */}
      <div className="sticky top-0 h-screen w-full overflow-hidden bg-[#000005]">
        {/* 3D Canvas */}
        <div className="absolute inset-0">
          <PhoneCanvas scrollProgress={progress} />
        </div>

        {/* HTML Overlay */}
        <HeroOverlay scrollProgress={progress} />

        {/* Screen-enter flash */}
        {flash > 0 && (
          <div
            className="absolute inset-0 z-20 pointer-events-none"
            style={{ background: `rgba(40, 60, 255, ${flash * 0.4})` }}
          />
        )}
      </div>
    </div>
  )
}
