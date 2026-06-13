import { Variants } from 'framer-motion'

const ease = [0.25, 0.46, 0.45, 0.94] as const

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

export const stagger = (delayChildren = 0.05, staggerChildren = 0.07): Variants => ({
  hidden: {},
  show:   { transition: { delayChildren, staggerChildren } },
})

export const cardHover = {
  rest:  { scale: 1, y: 0 },
  hover: { scale: 1.02, y: -4, transition: { duration: 0.25, ease: 'easeOut' } },
}

export const viewportOnce = { once: true, margin: '-50px' }
