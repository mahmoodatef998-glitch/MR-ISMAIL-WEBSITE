'use client'

import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

// HDR white — values > 1.0 are preserved in the float render target
// the Bloom effect reads this and creates a star halo
const STAR_COLOR = new THREE.Color(6, 6, 6)

interface Props {
  progressRef: React.MutableRefObject<number>
}

export function VoidCore({ progressRef }: Props) {
  const meshRef = useRef<THREE.Mesh>(null)

  useFrame(({ clock }) => {
    if (!meshRef.current) return

    const p = progressRef.current
    const t = clock.getElapsedTime()

    // Organic breathing — 3 irrational frequencies feel biological, not mechanical
    const breathe = 1 + Math.sin(t * 0.83) * 0.12 + Math.sin(t * 1.31) * 0.04

    let baseScale: number
    if (p < 0.10) {
      // Scene 1: tiny star point, breathing only
      baseScale = 0.012
    } else if (p < 0.20) {
      // Expansion: star is being born (0.012 → 0.562)
      baseScale = 0.012 + ((p - 0.10) / 0.10) * 0.55
    } else if (p < 0.26) {
      // Nova collapse: star gave its light to the phone (0.562 → 0)
      baseScale = (1 - (p - 0.20) / 0.06) * 0.562
    } else {
      // Star is gone — phone carries the light forward
      baseScale = 0
    }

    meshRef.current.scale.setScalar(baseScale * breathe)
  })

  return (
    <mesh ref={meshRef} position={[0, 0, 0]}>
      <sphereGeometry args={[1, 24, 24]} />
      <meshBasicMaterial color={STAR_COLOR} />
    </mesh>
  )
}
