'use client'

import { motion, MotionValue, useTransform } from 'framer-motion'
import Image from 'next/image'

interface Props { progress: MotionValue<number> }

// Narrative order: hand → macro → orange back → full reveal → architecture
const SCENES = [
  { src: '/storyboard/scene-05.jpg.png', alt: 'iPhone 17 Pro Max' },
  { src: '/storyboard/scene-04.jpg.png', alt: 'Pro Camera System' },
  { src: '/storyboard/scene-01.jpg.jpg', alt: 'Desert Titanium — camera detail' },
  { src: '/storyboard/scene-02.jpg.jpg', alt: 'iPhone 17 Pro Max — full reveal' },
  { src: '/storyboard/scene-03.jpg.png', alt: '4-Layer Architecture' },
]

// Scene windows (hold + 10% wide crossfade on each side):
// S1: 0.00 → 0.25   S2: 0.15→0.45   S3: 0.35→0.65   S4: 0.55→0.85   S5: 0.75→1.0

export function PhoneLayers({ progress }: Props) {

  // ── Opacity crossfades (wide 10% windows) ────────────────────────
  const op0 = useTransform(progress, [0,    0.15, 0.25],       [1, 1, 0])
  const op1 = useTransform(progress, [0.15, 0.25, 0.35, 0.45], [0, 1, 1, 0])
  const op2 = useTransform(progress, [0.35, 0.45, 0.55, 0.65], [0, 1, 1, 0])
  const op3 = useTransform(progress, [0.55, 0.65, 0.75, 0.85], [0, 1, 1, 0])
  const op4 = useTransform(progress, [0.75, 0.85, 1.0],        [0, 1, 1])

  // ── Scale: Ken Burns hold + zoom-in on exit (cinematic push) ─────
  // Each scene enters slightly zoomed in, pulls back during hold, then pushes back in as it exits
  const sc0 = useTransform(progress, [0,    0.15, 0.25], [1.06, 1.0,  1.08])
  const sc1 = useTransform(progress, [0.15, 0.25, 0.35, 0.45], [1.03, 1.0, 1.0, 1.07])
  const sc2 = useTransform(progress, [0.35, 0.45, 0.55, 0.65], [1.03, 1.0, 1.0, 1.07])
  const sc3 = useTransform(progress, [0.55, 0.65, 0.75, 0.85], [1.03, 1.0, 1.0, 1.07])
  const sc4 = useTransform(progress, [0.75, 0.85, 1.0],        [1.03, 1.0, 1.03])

  const ops    = [op0, op1, op2, op3, op4]
  const scales = [sc0, sc1, sc2, sc3, sc4]

  // Bottom vignette — active when text lives at bottom
  const vigOp = useTransform(
    progress,
    [0, 0.62, 0.67, 0.78, 0.82, 1.0],
    [1,  1,    0,    0,    1,    1],
  )

  return (
    <div className="absolute inset-0 bg-black">
      {SCENES.map((scene, i) => (
        <motion.div
          key={scene.src}
          className="absolute inset-0"
          style={{ opacity: ops[i] }}
        >
          <motion.div className="absolute inset-0" style={{ scale: scales[i] }}>
            <Image
              src={scene.src}
              alt={scene.alt}
              fill
              priority={i < 2}
              className="object-cover object-center"
            />
          </motion.div>
        </motion.div>
      ))}

      {/* Vignette for bottom text readability */}
      <motion.div
        className="absolute inset-x-0 bottom-0 pointer-events-none"
        style={{
          height: '45%',
          background: 'linear-gradient(to top, rgba(0,0,0,0.75) 0%, rgba(0,0,0,0.22) 55%, transparent 100%)',
          opacity: vigOp,
        }}
      />
    </div>
  )
}
