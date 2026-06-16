import { Variants } from 'framer-motion'

// Cinematic easing — Apple/Linear grade
const ease = [0.16, 1, 0.3, 1] as const

// ── Cinematic reveal variants ──────────────────────────────────────────────────
// Every element passes through blur — nothing appears instantly

// Primary reveal — headlines, cards, blocks
export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 36, filter: 'blur(12px)', scale: 0.97 },
  show: {
    opacity: 1, y: 0, filter: 'blur(0px)', scale: 1,
    transition: { duration: 0.8, ease },
  },
}

// Pure fade with blur — overlays, backgrounds
export const fadeIn: Variants = {
  hidden: { opacity: 0, filter: 'blur(10px)' },
  show: {
    opacity: 1, filter: 'blur(0px)',
    transition: { duration: 0.65, ease },
  },
}

// Slide from left with depth — labels, text blocks
export const fadeLeft: Variants = {
  hidden: { opacity: 0, x: -40, filter: 'blur(8px)' },
  show: {
    opacity: 1, x: 0, filter: 'blur(0px)',
    transition: { duration: 0.75, ease },
  },
}

// Slide from right with depth
export const fadeRight: Variants = {
  hidden: { opacity: 0, x: 40, filter: 'blur(8px)' },
  show: {
    opacity: 1, x: 0, filter: 'blur(0px)',
    transition: { duration: 0.75, ease },
  },
}

// Scale up from slightly small + blur — pills, icons, badges
export const scaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.90, filter: 'blur(10px)' },
  show: {
    opacity: 1, scale: 1, filter: 'blur(0px)',
    transition: { duration: 0.65, ease },
  },
}

// ── Premium spring variants ────────────────────────────────────────────────────

// Heavy cinematic reveal — section anchors, hero titles
export const revealHeavy: Variants = {
  hidden: { opacity: 0, y: 52, filter: 'blur(22px)', scale: 0.95 },
  show: {
    opacity: 1, y: 0, filter: 'blur(0px)', scale: 1,
    transition: { duration: 1.15, ease: [0.16, 1, 0.3, 1] },
  },
}

// Fast punchy spring — CTAs, small interactive elements (no blur)
export const snapIn: Variants = {
  hidden: { opacity: 0, scale: 0.84, y: 12 },
  show: {
    opacity: 1, scale: 1, y: 0,
    transition: { type: 'spring', stiffness: 400, damping: 26 },
  },
}

// Slide from left with spring — section labels, data rows
export const slideInLeft: Variants = {
  hidden: { opacity: 0, x: -52, filter: 'blur(8px)' },
  show: {
    opacity: 1, x: 0, filter: 'blur(0px)',
    transition: { type: 'spring', stiffness: 280, damping: 30 },
  },
}

// Rise in for cards — scale + blur + y
export const riseIn: Variants = {
  hidden: { opacity: 0, y: 30, scale: 0.95, filter: 'blur(10px)' },
  show: {
    opacity: 1, y: 0, scale: 1, filter: 'blur(0px)',
    transition: { type: 'spring', stiffness: 240, damping: 26 },
  },
}

// ── Stagger + viewport ─────────────────────────────────────────────────────────

export const stagger = (delayChildren = 0.05, staggerChildren = 0.10): Variants => ({
  hidden: {},
  show: { transition: { delayChildren, staggerChildren } },
})

export const cardHover = {
  rest:  { scale: 1, y: 0 },
  hover: { scale: 1.02, y: -5, transition: { duration: 0.3, ease: [0.16, 1, 0.3, 1] } },
}

// once: false → animation re-triggers on scroll up AND down
// margin: '-60px' → starts when element is entering viewport
export const viewportOnce = { once: false, margin: '-60px' }
