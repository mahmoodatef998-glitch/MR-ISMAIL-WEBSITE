'use client'

import { useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import {
  motion,
  AnimatePresence,
  useMotionValue,
  useTransform,
  animate,
} from 'framer-motion'
import { MessageCircle, ExternalLink } from 'lucide-react'
import { Product } from '@/types'

// ── MobileCard ────────────────────────────────────────────────────────────────
interface MobileCardProps {
  product: Product
  onNext: () => void
  onPrev: () => void
  direction: number
}

function MobileCard({ product, onNext, onPrev, direction }: MobileCardProps) {
  const router = useRouter()
  const x = useMotionValue(0)
  const rotate = useTransform(x, [-200, 0, 200], [-12, 0, 12])
  const tapZoneRef = useRef<'left' | 'center' | 'right' | null>(null)

  const waUrl = `https://wa.me/${
    process.env.NEXT_PUBLIC_WHATSAPP_NUMBER?.replace(/\+/g, '') ?? '971501234567'
  }?text=${encodeURIComponent(
    `Hi, I'm interested in ${product.name} (MOQ: ${product.moq} units). Please send me a quote.`
  )}`

  const handleDragEnd = (_: unknown, info: { offset: { x: number }; velocity: { x: number } }) => {
    const { offset, velocity } = info
    const swipedFar = Math.abs(offset.x) > 50
    const swipedFast = Math.abs(velocity.x) > 300
    const tapped = Math.abs(offset.x) < 5

    if (tapped) {
      const zone = tapZoneRef.current
      if (zone === 'left') {
        onPrev()
      } else if (zone === 'right') {
        onNext()
      } else if (zone === 'center') {
        router.push(`/products/${product.slug}`)
      }
      tapZoneRef.current = null
      return
    }

    if (swipedFar || swipedFast) {
      if (offset.x < 0) {
        onNext()
      } else {
        onPrev()
      }
    } else {
      animate(x, 0, { type: 'spring', stiffness: 300, damping: 30 })
    }
    tapZoneRef.current = null
  }

  const variants = {
    enter: (dir: number) => ({
      x: dir > 0 ? 320 : -320,
      opacity: 0,
      scale: 0.9,
    }),
    center: {
      x: 0,
      opacity: 1,
      scale: 1,
      transition: { type: 'spring' as const, stiffness: 300, damping: 30 },
    },
    exit: (dir: number) => ({
      x: dir < 0 ? 320 : -320,
      opacity: 0,
      scale: 0.9,
      transition: { duration: 0.22 },
    }),
  }

  return (
    <motion.div
      drag="x"
      dragMomentum={false}
      dragElastic={0.1}
      dragConstraints={{ left: 0, right: 0 }}
      style={{
        x,
        rotate,
        userSelect: 'none',
        touchAction: 'pan-y',
      }}
      custom={direction}
      variants={variants}
      initial="enter"
      animate="center"
      exit="exit"
      onDragEnd={handleDragEnd}
      className="relative rounded-3xl overflow-hidden"
      css-card-width="true"
    >
      <div
        className="relative rounded-3xl overflow-hidden"
        style={{
          width: '90vw',
          maxWidth: 400,
          height: '62vh',
          maxHeight: 520,
          background: '#0c0805',
        }}
      >
        {/* Blurred bg image */}
        {product.images[0] && (
          <img
            src={product.images[0]}
            alt=""
            aria-hidden
            className="absolute inset-0 w-full h-full object-cover scale-125 blur-2xl opacity-25 pointer-events-none"
          />
        )}

        {/* Main image */}
        {product.images[0] ? (
          <img
            src={product.images[0]}
            alt={product.name}
            className="absolute inset-0 w-full h-full object-contain p-8"
            draggable={false}
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-[80px]">
            📦
          </div>
        )}

        {/* Inner ring */}
        <div className="absolute inset-0 rounded-3xl ring-1 ring-inset ring-white/[0.06] pointer-events-none" />

        {/* Bottom gradient + info */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-5">
          <p className="text-[#C4922A] text-[10px] font-bold uppercase tracking-[0.18em] mb-1">
            {product.brand}
          </p>
          <h3 className="text-white font-semibold text-base leading-snug line-clamp-2 mb-2">
            {product.name}
          </h3>
          <p className="text-white/50 text-xs">MOQ: {product.moq} units</p>
        </div>

        {/* Category badge */}
        <div className="absolute top-4 left-4">
          <span className="px-2.5 py-1 bg-black/50 backdrop-blur-sm border border-white/10 text-gray-400 text-[10px] font-medium rounded-full">
            {product.category}
          </span>
        </div>

        {/* Featured badge */}
        {product.featured && (
          <div className="absolute top-4 right-4">
            <span className="px-2.5 py-1 bg-gradient-to-r from-[#C4922A] to-[#D4A840] text-[#080503] text-[9px] font-black rounded-full uppercase tracking-wider">
              Featured
            </span>
          </div>
        )}

        {/* Instagram-style tap zones */}
        <div className="absolute inset-0 flex z-30 pointer-events-none">
          <div
            className="w-[30%] h-full pointer-events-auto"
            onPointerDown={() => { tapZoneRef.current = 'left' }}
          />
          <div
            className="flex-1 h-full pointer-events-auto"
            onPointerDown={() => { tapZoneRef.current = 'center' }}
          />
          <div
            className="w-[30%] h-full pointer-events-auto"
            onPointerDown={() => { tapZoneRef.current = 'right' }}
          />
        </div>
      </div>

      {/* CTA buttons below card */}
      <div className="flex gap-2 mt-3" style={{ width: '90vw', maxWidth: 400 }}>
        <a
          href={waUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-[#25D366] text-white text-sm font-bold"
          onClick={(e) => e.stopPropagation()}
        >
          <MessageCircle className="w-4 h-4" />
          WhatsApp
        </a>
        <Link
          href={`/products/${product.slug}`}
          className="w-12 flex items-center justify-center rounded-xl bg-white/10 border border-white/[0.08] text-white/70 hover:text-white hover:bg-white/[0.15] transition-colors"
          onClick={(e) => e.stopPropagation()}
        >
          <ExternalLink className="w-4 h-4" />
        </Link>
      </div>
    </motion.div>
  )
}

// ── MobileGallery ─────────────────────────────────────────────────────────────
interface MobileGalleryProps {
  products: Product[]
}

export function MobileGallery({ products }: MobileGalleryProps) {
  const [currentIdx, setCurrentIdx] = useState(0)
  const [dir, setDir] = useState(1)

  if (products.length === 0) return null

  const goTo = (delta: number) => {
    const next = currentIdx + delta
    if (next < 0 || next >= products.length) return
    setDir(delta)
    setCurrentIdx(next)
  }

  const product = products[currentIdx]
  const peekProduct = products[currentIdx + 1] ?? null

  return (
    <div className="flex flex-col items-center gap-4 py-6 select-none">
      <div className="relative" style={{ width: '90vw', maxWidth: 400 }}>
        {/* Peek card behind */}
        {peekProduct && (
          <div
            className="absolute left-0 right-0 bottom-12 mx-auto rounded-3xl overflow-hidden pointer-events-none"
            style={{
              width: '90vw',
              maxWidth: 400,
              height: '72vh',
              maxHeight: 580,
              background: '#111',
              transform: 'scale(0.94) translateY(10px)',
              opacity: 0.25,
              zIndex: 0,
            }}
          />
        )}

        {/* Current card */}
        <div className="relative z-10">
          <AnimatePresence custom={dir} mode="popLayout">
            <MobileCard
              key={product.id}
              product={product}
              direction={dir}
              onNext={() => goTo(1)}
              onPrev={() => goTo(-1)}
            />
          </AnimatePresence>
        </div>
      </div>

      {/* Progress dots */}
      <div className="flex items-center gap-2 mt-2">
        {products.map((_, i) => (
          <button
            key={i}
            onClick={() => {
              setDir(i > currentIdx ? 1 : -1)
              setCurrentIdx(i)
            }}
            className="rounded-full bg-[#C4922A] transition-all duration-300 focus:outline-none"
            style={{
              width: i === currentIdx ? 24 : 6,
              height: 6,
              opacity: i === currentIdx ? 1 : 0.25,
            }}
          />
        ))}
      </div>
    </div>
  )
}
