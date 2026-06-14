'use client'

import { useEffect, useRef, useState } from 'react'
import { m, useScroll, useSpring } from 'framer-motion'

const SECTIONS = ['home', 'products', 'features', 'about', 'process', 'testimonials', 'contact']

export function ScrollProgress() {
  const { scrollYProgress } = useScroll()
  const scaleY = useSpring(scrollYProgress, { stiffness: 140, damping: 30 })
  const [active, setActive] = useState(0)

  useEffect(() => {
    const observers: IntersectionObserver[] = []

    SECTIONS.forEach((id, i) => {
      const el = document.getElementById(id)
      if (!el) return
      const observer = new IntersectionObserver(
        ([entry]) => { if (entry.isIntersecting) setActive(i) },
        { threshold: 0.3 }
      )
      observer.observe(el)
      observers.push(observer)
    })

    return () => observers.forEach((o) => o.disconnect())
  }, [])

  return (
    <div className="fixed left-5 top-1/2 -translate-y-1/2 z-40 hidden lg:flex flex-col items-center gap-0 select-none pointer-events-none">
      {/* Track line */}
      <div className="relative w-px h-40 bg-white/[0.06] rounded-full overflow-hidden">
        <m.div
          className="absolute top-0 left-0 right-0 origin-top rounded-full"
          style={{
            scaleY,
            background: 'linear-gradient(to bottom, #D4A840, #C4922A)',
          }}
        />
      </div>

      {/* Section dots */}
      <div className="absolute flex flex-col justify-between h-40 py-0">
        {SECTIONS.map((_, i) => (
          <div
            key={i}
            className="w-1.5 h-1.5 rounded-full transition-all duration-300"
            style={{
              background: i === active ? '#C4922A' : 'rgba(255,255,255,0.12)',
              boxShadow: i === active ? '0 0 6px #C4922A' : 'none',
              transform: i === active ? 'scale(1.5)' : 'scale(1)',
            }}
          />
        ))}
      </div>
    </div>
  )
}
