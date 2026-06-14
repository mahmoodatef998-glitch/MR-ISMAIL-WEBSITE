'use client'

import { useEffect, useRef, useState } from 'react'
import dynamic from 'next/dynamic'
import { FilmOverlay } from './FilmOverlay'

const FilmCanvas = dynamic(
  () => import('./FilmCanvas').then(m => ({ default: m.FilmCanvas })),
  {
    ssr: false,
    // Loading state IS Scene 1 — a single breathing dot matches the void aesthetic
    loading: () => (
      <div className="w-full h-screen bg-black flex items-center justify-center">
        <div
          className="w-[3px] h-[3px] rounded-full bg-white/70 animate-pulse"
          style={{ boxShadow: '0 0 12px 4px rgba(255,255,255,0.4)' }}
        />
      </div>
    ),
  }
)

export function HeroFilm() {
  const containerRef = useRef<HTMLDivElement>(null)
  const progressRef  = useRef(0)
  const [overlayProgress, setOverlayProgress] = useState(0)

  useEffect(() => {
    let destroyed  = false
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let lenisInst:  any = null
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let gsapInst:   any = null
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let tl:         any = null
    let lenisRaf:   ((t: number) => void) | null = null
    let tickFn:     (() => void) | null = null

    async function init() {
      const Lenis             = (await import('lenis')).default
      const gsap              = (await import('gsap')).default
      const { ScrollTrigger } = await import('gsap/ScrollTrigger')
      if (destroyed) return

      gsapInst = gsap
      gsap.registerPlugin(ScrollTrigger)

      // Slightly slower easing than the previous hero — more cinematic
      lenisInst = new Lenis({
        duration: 1.6,
        easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        smoothWheel: true,
      })
      lenisRaf = (time: number) => { lenisInst.raf(time * 1000) }
      lenisInst.on('scroll', ScrollTrigger.update)
      gsap.ticker.add(lenisRaf)
      gsap.ticker.lagSmoothing(0)

      const proxy = { progress: 0 }
      let lastOverlayUpdate = 0

      tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top top',
          end:   'bottom bottom',
          scrub: 1.2,
        },
      }).to(proxy, { progress: 1, ease: 'none', duration: 1 })

      tickFn = () => {
        progressRef.current = proxy.progress

        // Throttle React state updates to ~30fps — canvas reads progressRef directly
        const now = performance.now()
        if (now - lastOverlayUpdate > 33) {
          lastOverlayUpdate = now
          setOverlayProgress(proxy.progress)
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
      {/* cursor: none enforces cinematic mode — the storyboard calls for it */}
      <div
        className="sticky top-0 h-screen w-full overflow-hidden bg-black"
        style={{ cursor: 'none' }}
      >
        <div className="absolute inset-0">
          <FilmCanvas progressRef={progressRef} />
        </div>
        <FilmOverlay scrollProgress={overlayProgress} />
      </div>
    </div>
  )
}
