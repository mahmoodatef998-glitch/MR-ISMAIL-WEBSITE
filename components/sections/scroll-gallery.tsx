'use client'

import { useRef, useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import {
  motion,
  useScroll,
  useTransform,
  useSpring,
  useMotionValueEvent,
  AnimatePresence,
} from 'framer-motion'
import { ChevronLeft, ChevronRight, MessageCircle, ExternalLink } from 'lucide-react'
import { Product } from '@/types'

// ── Constants ────────────────────────────────────────────────────────────────
const CARD_W = 340
const CARD_H = 520
const SPACING = 190
const STEP_Y = 70
const MAX_VISIBLE = 5

// ── GalleryCard ───────────────────────────────────────────────────────────────
interface GalleryCardProps {
  product: Product
  index: number
  activeIndex: ReturnType<typeof useSpring>
  activeIdx: number
}

function GalleryCard({ product, index, activeIndex, activeIdx }: GalleryCardProps) {
  const router = useRouter()
  const [hovered, setHovered] = useState(false)

  // Per-card derived motion values — hooks called at component top level
  const offset = useTransform(activeIndex, (v) => index - v)
  const x = useTransform(offset, (v) => v * SPACING)
  const y = useTransform(offset, (v) => -v * STEP_Y)
  const z = useTransform(offset, (v) => -Math.abs(v) * 140)
  const rotateY = useTransform(offset, (v) => v * -9)
  const opacity = useTransform(offset, (v) =>
    Math.abs(v) > MAX_VISIBLE + 0.5 ? 0 : Math.max(0, 1 - Math.abs(v) * 0.18)
  )
  const scale = useTransform(offset, (v) => Math.max(0.65, 1 - Math.abs(v) * 0.07))

  const zIndex = Math.max(0, 50 - Math.abs(activeIdx - index) * 5)
  const isActive = activeIdx === index

  const waUrl = `https://wa.me/${
    process.env.NEXT_PUBLIC_WHATSAPP_NUMBER?.replace(/\+/g, '') ?? '971501234567'
  }?text=${encodeURIComponent(
    `Hi, I'm interested in ${product.name} (MOQ: ${product.moq} units). Please send me a quote.`
  )}`

  return (
    <motion.div
      style={{
        x,
        y,
        z,
        rotateY,
        opacity,
        scale,
        position: 'absolute',
        left: '50%',
        top: '50%',
        marginLeft: -CARD_W / 2,
        marginTop: -CARD_H / 2,
        width: CARD_W,
        height: CARD_H,
        transformStyle: 'preserve-3d',
        cursor: 'pointer',
        zIndex,
      }}
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
      onClick={() => router.push(`/products/${product.slug}`)}
    >
      {/* Card shell */}
      <div
        className="relative w-full h-full rounded-3xl overflow-hidden"
        style={{ background: '#0c0805' }}
      >
        {/* Active glow ring */}
        {isActive && (
          <motion.div
            className="absolute inset-0 rounded-3xl ring-2 ring-[#C4922A]/40 pointer-events-none z-50"
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          />
        )}

        {/* Inner ring */}
        <div className="absolute inset-0 rounded-3xl ring-1 ring-inset ring-white/[0.06] pointer-events-none z-40" />

        {/* Image layer */}
        {product.images[0] ? (
          <>
            <img
              src={product.images[0]}
              alt=""
              aria-hidden
              className="absolute inset-0 w-full h-full object-cover scale-125 blur-2xl opacity-30 pointer-events-none"
            />
            <img
              src={product.images[0]}
              alt={product.name}
              className="absolute inset-0 w-full h-full object-contain p-6"
            />
          </>
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-[80px]">
            📦
          </div>
        )}

        {/* Default overlay (fades on hover) */}
        <motion.div
          className="absolute inset-0 flex flex-col justify-end pointer-events-none"
          animate={{ opacity: hovered ? 0 : 1 }}
          transition={{ duration: 0.22 }}
        >
          {/* Gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />

          <div className="relative z-10 p-5 pb-6">
            <p className="text-[#C4922A] text-[10px] font-bold uppercase tracking-[0.18em] mb-1">
              {product.brand}
            </p>
            <h3 className="text-white font-semibold text-base leading-snug line-clamp-2 mb-2">
              {product.name}
            </h3>
            <p className="text-white/50 text-xs mb-3">
              MOQ: {product.moq} units
            </p>
            <div className="flex items-center justify-between">
              {product.featured && (
                <span className="px-2.5 py-1 bg-gradient-to-r from-[#C4922A] to-[#D4A840] text-[#080503] text-[9px] font-black rounded-full uppercase tracking-wider">
                  Featured
                </span>
              )}
              <span className="ml-auto px-2.5 py-1 bg-black/40 backdrop-blur-sm border border-white/10 text-gray-400 text-[10px] font-medium rounded-full">
                {product.category}
              </span>
            </div>
          </div>
        </motion.div>

        {/* Hover overlay */}
        <motion.div
          className="absolute inset-0 flex flex-col p-5 z-30"
          animate={{ opacity: hovered ? 1 : 0 }}
          style={{
            background: 'rgba(0,0,0,0.76)',
            backdropFilter: hovered ? 'blur(22px) saturate(180%)' : 'none',
            pointerEvents: hovered ? 'auto' : 'none',
          }}
          transition={{ duration: 0.22 }}
        >
          {/* Gold top line */}
          <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[#C4922A]/60 to-transparent" />

          <div className="flex items-center justify-between mb-3">
            <p className="text-[#C4922A] text-[10px] font-bold uppercase tracking-[0.18em]">
              {product.brand}
            </p>
            <span className="px-2.5 py-1 bg-[#C4922A]/15 border border-[#C4922A]/30 text-[#C4922A] text-[9px] font-bold rounded-full uppercase tracking-wide">
              {product.category}
            </span>
          </div>

          <h3 className="text-white font-bold text-base leading-snug mb-2">
            {product.name}
          </h3>

          <p className="text-white/50 text-xs leading-relaxed line-clamp-3 mb-3">
            {product.description}
          </p>

          {/* Specs */}
          {product.specs.slice(0, 3).length > 0 && (
            <div className="flex flex-col gap-1.5 mb-4">
              {product.specs.slice(0, 3).map((spec, i) => (
                <motion.div
                  key={spec.key}
                  className="flex items-center gap-2 text-xs text-white/60"
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: hovered ? 1 : 0, x: hovered ? 0 : -8 }}
                  transition={{ delay: hovered ? i * 0.06 + 0.1 : 0, duration: 0.2 }}
                >
                  <span className="w-1 h-1 rounded-full bg-[#C4922A]/60 flex-shrink-0" />
                  <span className="text-white/40">{spec.key}:</span>
                  <span className="text-white/70 font-medium">{spec.value}</span>
                </motion.div>
              ))}
            </div>
          )}

          {/* MOQ box */}
          <div className="flex items-center justify-center px-4 py-3 bg-[#C4922A]/10 border border-[#C4922A]/20 rounded-xl mb-4">
            <div className="text-center">
              <span className="text-[#C4922A] font-black text-lg">{product.moq}</span>
              <span className="text-white/40 text-xs ml-1">units minimum</span>
            </div>
          </div>

          {/* Button row */}
          <div className="flex gap-2 mt-auto">
            <a
              href={waUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-[#25D366] text-white text-xs font-bold transition-opacity hover:opacity-90"
            >
              <MessageCircle className="w-4 h-4" />
              WhatsApp
            </a>
            <Link
              href={`/products/${product.slug}`}
              onClick={(e) => e.stopPropagation()}
              className="w-11 flex items-center justify-center rounded-xl bg-white/[0.08] border border-white/10 text-white/70 hover:text-white hover:bg-white/[0.12] transition-colors"
            >
              <ExternalLink className="w-4 h-4" />
            </Link>
          </div>
        </motion.div>
      </div>
    </motion.div>
  )
}

// ── ScrollGallery ─────────────────────────────────────────────────────────────
interface ScrollGalleryProps {
  products: Product[]
}

export function ScrollGallery({ products }: ScrollGalleryProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [activeIdx, setActiveIdx] = useState(0)
  const total = products.length

  const { scrollYProgress } = useScroll({ target: containerRef })
  const rawIndex = useTransform(scrollYProgress, [0, 1], [0, Math.max(0, total - 1)])
  const activeIndex = useSpring(rawIndex, { stiffness: 280, damping: 38, restDelta: 0.01 })

  useMotionValueEvent(activeIndex, 'change', (v) => {
    setActiveIdx(Math.round(v))
  })

  const scrollTo = (idx: number) => {
    if (!containerRef.current) return
    const el = containerRef.current
    const rect = el.getBoundingClientRect()
    const scrollTop = window.scrollY + rect.top
    const scrollRange = el.offsetHeight - window.innerHeight
    const target = scrollTop + (idx / Math.max(1, total - 1)) * scrollRange
    window.scrollTo({ top: target, behavior: 'smooth' })
  }

  // Keyboard navigation
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
        e.preventDefault()
        const next = Math.max(0, activeIdx - 1)
        scrollTo(next)
      } else if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
        e.preventDefault()
        const next = Math.min(total - 1, activeIdx + 1)
        scrollTo(next)
      }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [activeIdx, total])

  if (total === 0) return null

  const containerHeight = `${total * 25}vh`

  return (
    <div ref={containerRef} style={{ height: containerHeight }} className="relative">
      {/* Sticky viewport panel */}
      <div
        className="sticky top-0 h-screen overflow-hidden"
        style={{ perspective: '1500px' }}
      >
        {/* 3D cards container */}
        <div
          className="absolute inset-0 flex items-center justify-center"
          style={{ transformStyle: 'preserve-3d' }}
        >
          {products.map((product, index) => (
            <GalleryCard
              key={product.id}
              product={product}
              index={index}
              activeIndex={activeIndex}
              activeIdx={activeIdx}
            />
          ))}
        </div>

        {/* Counter — top right */}
        <div className="absolute top-8 right-8 z-50 font-mono text-sm text-[#C4922A] tabular-nums select-none">
          {String(activeIdx + 1).padStart(2, '0')}{' '}
          <span className="text-white/20">/</span>{' '}
          {String(total).padStart(2, '0')}
        </div>

        {/* Prev/Next — bottom left */}
        <div className="absolute bottom-10 left-8 z-50 flex gap-3">
          <button
            onClick={() => scrollTo(Math.max(0, activeIdx - 1))}
            disabled={activeIdx === 0}
            className="w-10 h-10 rounded-full bg-white/[0.06] border border-white/10 flex items-center justify-center text-white/60 hover:text-white hover:bg-white/[0.1] disabled:opacity-20 disabled:cursor-not-allowed transition-all"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={() => scrollTo(Math.min(total - 1, activeIdx + 1))}
            disabled={activeIdx === total - 1}
            className="w-10 h-10 rounded-full bg-white/[0.06] border border-white/10 flex items-center justify-center text-white/60 hover:text-white hover:bg-white/[0.1] disabled:opacity-20 disabled:cursor-not-allowed transition-all"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>

        {/* Dot indicators — bottom center */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2">
          {products.map((_, i) => (
            <button
              key={i}
              onClick={() => scrollTo(i)}
              className="transition-all duration-300 rounded-full bg-[#C4922A] focus:outline-none"
              style={{
                width: i === activeIdx ? 24 : 6,
                height: 6,
                opacity: i === activeIdx ? 1 : 0.25,
              }}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
