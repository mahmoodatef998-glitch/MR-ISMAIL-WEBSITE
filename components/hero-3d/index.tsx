'use client'

import { useEffect, useRef, useState } from 'react'
import dynamic from 'next/dynamic'
import { HeroOverlay } from './HeroOverlay'

const PhoneCanvas = dynamic(
  () => import('./PhoneCanvas').then(m => ({ default: m.PhoneCanvas })),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-screen bg-[#0A0705] flex items-center justify-center">
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
  // Canvas reads this every useFrame — never triggers React re-render
  const progressRef  = useRef(0)
  // Throttled (~30fps) for HTML overlay only
  const [overlayProgress, setOverlayProgress] = useState(0)
  // Flash overlay — direct DOM mutation, zero React overhead
  const flashRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    let destroyed  = false
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let lenisInst: any = null
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let gsapInst:  any = null
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let tl:        any = null
    let lenisRaf:  ((t: number) => void) | null = null
    let tickFn:    (() => void) | null = null

    async function init() {
      const Lenis             = (await import('lenis')).default
      const gsap              = (await import('gsap')).default
      const { ScrollTrigger } = await import('gsap/ScrollTrigger')
      if (destroyed) return

      gsapInst = gsap
      gsap.registerPlugin(ScrollTrigger)

      // Lenis — smooth scroll physics
      lenisInst = new Lenis({
        duration: 1.4,
        easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        smoothWheel: true,
      })
      lenisRaf = (time: number) => { lenisInst.raf(time * 1000) }
      lenisInst.on('scroll', ScrollTrigger.update)
      gsap.ticker.add(lenisRaf)
      gsap.ticker.lagSmoothing(0)

      // GSAP proxy: scrollTrigger scrub smoothly animates this 0 → 1.
      // scrub:1 = 1-second cinema lag — eliminates jitter from fast scroll.
      const proxy = { progress: 0 }
      let   lastOverlayUpdate = 0

      tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top top',
          end:   'bottom bottom',
          scrub: 1.2,
        },
      }).to(proxy, { progress: 1, ease: 'none', duration: 1 })

      // Push smoothed value to canvas ref every GSAP tick (after proxy updates)
      tickFn = () => {
        const p = proxy.progress
        progressRef.current = p

        // Flash — direct DOM, no useState
        if (flashRef.current) {
          if (p > 0.93 && p < 0.97) {
            const t = (p - 0.93) / 0.04
            const intensity = Math.sin(t * Math.PI) * 0.7
            flashRef.current.style.background =
              `rgba(196,146,42,${(intensity * 0.4).toFixed(3)})`
            flashRef.current.style.display = 'block'
          } else {
            flashRef.current.style.display = 'none'
          }
        }

        // Throttle React state to ~30fps for the HTML overlay
        const now = performance.now()
        if (now - lastOverlayUpdate > 33) {
          lastOverlayUpdate = now
          setOverlayProgress(p)
        }
      }
      gsap.ticker.add(tickFn)
    }

    init()

    return () => {
      destroyed = true
      lenisInst?.destroy()
      if (gsapInst) {
        if (lenisRaf) gsapInst.ticker.remove(lenisRaf)
        if (tickFn)   gsapInst.ticker.remove(tickFn)
      }
      tl?.scrollTrigger?.kill()
      tl?.kill()
    }
  }, [])

  return (
    <div id="home" ref={containerRef} className="relative" style={{ height: '750vh' }}>
      <div className="sticky top-0 h-screen w-full overflow-hidden bg-[#0A0705]">
        <div className="absolute inset-0">
          <PhoneCanvas progressRef={progressRef} />
        </div>

        <HeroOverlay scrollProgress={overlayProgress} />

        {/* Flash: direct DOM, no React state */}
        <div
          ref={flashRef}
          className="absolute inset-0 z-20 pointer-events-none"
          style={{ display: 'none' }}
        />
      </div>
    </div>
  )
}
