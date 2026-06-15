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

export function PhoneLayers({ progress }: Props) {
  // Opacity: each scene fades in then out; scene 1 starts visible, scene 5 stays visible
  const op0 = useTransform(progress, [0, 0.18, 0.22],          [1, 1, 0])
  const op1 = useTransform(progress, [0.18, 0.22, 0.38, 0.42], [0, 1, 1, 0])
  const op2 = useTransform(progress, [0.38, 0.42, 0.58, 0.62], [0, 1, 1, 0])
  const op3 = useTransform(progress, [0.58, 0.62, 0.78, 0.82], [0, 1, 1, 0])
  const op4 = useTransform(progress, [0.78, 0.82, 1.0],        [0, 1, 1])

  // Subtle Ken Burns: each scene slowly zooms (1.04→1.0 entry, 1.0→1.04 hold)
  const sc0 = useTransform(progress, [0, 0.18],    [1.05, 1.0])
  const sc1 = useTransform(progress, [0.22, 0.38], [1.0, 1.05])
  const sc2 = useTransform(progress, [0.42, 0.58], [1.0, 1.05])
  const sc3 = useTransform(progress, [0.62, 0.78], [1.0, 1.05])
  const sc4 = useTransform(progress, [0.82, 1.0],  [1.0, 1.04])

  const ops    = [op0, op1, op2, op3, op4]
  const scales = [sc0, sc1, sc2, sc3, sc4]

  // Bottom vignette opacity: visible when text sits over bottom of images
  const vigOp = useTransform(
    progress,
    [0, 0.60, 0.65, 0.78, 0.82, 1.0],
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

      {/* Vignette — ensures text legibility at bottom */}
      <motion.div
        className="absolute inset-x-0 bottom-0 pointer-events-none"
        style={{
          height: '40%',
          background: 'linear-gradient(to top, rgba(0,0,0,0.72) 0%, rgba(0,0,0,0.18) 60%, transparent 100%)',
          opacity: vigOp,
        }}
      />
    </div>
  )
}
