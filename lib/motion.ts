import { Variants } from 'framer-motion'

const ease = [0.25, 0.46, 0.45, 0.94] as const

// ── Base variants ──────────────────────────────────────────────
export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  show:   { opacity: 1, y: 0, transition: { duration: 0.5, ease } },
}

export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  show:   { opacity: 1, transition: { duration: 0.4, ease: 'easeOut' } },
}

export const fadeLeft: Variants = {
  hidden: { opacity: 0, x: -32 },
  show:   { opacity: 1, x: 0, transition: { duration: 0.55, ease } },
}

export const fadeRight: Variants = {
  hidden: { opacity: 0, x: 32 },
  show:   { opacity: 1, x: 0, transition: { duration: 0.55, ease } },
}

export const scaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.9 },
  show:   { opacity: 1, scale: 1, transition: { duration: 0.4, ease } },
}

// ── Premium spring variants (Apple-grade physics) ──────────────
// Slow dramatic reveal — for hero headlines and section anchors
export const revealHeavy: Variants = {
  hidden: { opacity: 0, y: 40, filter: 'blur(6px)' },
  show:   {
    opacity: 1, y: 0, filter: 'blur(0px)',
    transition: { duration: 0.9, ease: [0.16, 1, 0.3, 1] },
  },
}

// Fast punchy spring — for badges, pills, CTAs
export const snapIn: Variants = {
  hidden: { opacity: 0, scale: 0.85, y: 12 },
  show:   {
    opacity: 1, scale: 1, y: 0,
    transition: { type: 'spring', stiffness: 380, damping: 24 },
  },
}

// Slide from left with spring — for section labels and data rows
export const slideInLeft: Variants = {
  hidden: { opacity: 0, x: -48 },
  show:   {
    opacity: 1, x: 0,
    transition: { type: 'spring', stiffness: 300, damping: 28 },
  },
}

// Draw-in for cards and featured blocks
export const riseIn: Variants = {
  hidden: { opacity: 0, y: 32, scale: 0.97 },
  show:   {
    opacity: 1, y: 0, scale: 1,
    transition: { type: 'spring', stiffness: 260, damping: 22 },
  },
}

// ── Stagger + viewport ─────────────────────────────────────────
export const stagger = (delayChildren = 0.05, staggerChildren = 0.07): Variants => ({
  hidden: {},
  show:   { transition: { delayChildren, staggerChildren } },
})

export const cardHover = {
  rest:  { scale: 1, y: 0 },
  hover: { scale: 1.02, y: -4, transition: { duration: 0.25, ease: 'easeOut' } },
}

// Trigger animation when element is 100px below the viewport bottom edge
// (so animation completes before the eye fully arrives)
export const viewportOnce = { once: true, margin: '-80px' }
