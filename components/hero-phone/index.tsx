'use client'

import { useRef, useEffect } from 'react'
import { useScroll, useSpring } from 'framer-motion'
import Lenis from 'lenis'
import { PhoneLayers } from './PhoneLayers'
import { PhoneOverlay } from './PhoneOverlay'

export function HeroPhone() {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const lenis = new Lenis({ duration: 1.6 })
    const raf = (t: number) => { lenis.raf(t); requestAnimationFrame(raf) }
    const id = requestAnimationFrame(raf)
    return () => { lenis.destroy(); cancelAnimationFrame(id) }
  }, [])

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  })

  const progress = useSpring(scrollYProgress, {
    stiffness: 80,
    damping: 25,
    restDelta: 0.001,
  })

  return (
    <div ref={containerRef} id="home" className="relative" style={{ height: '560vh' }}>
      <div className="sticky top-0 h-screen w-full overflow-hidden bg-black" style={{ cursor: 'none' }}>
        <PhoneLayers progress={progress} />
        <PhoneOverlay progress={progress} />
      </div>
    </div>
  )
}
