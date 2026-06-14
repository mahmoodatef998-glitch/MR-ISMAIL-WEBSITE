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

    // Scene 1 (0–0.10): star point only, breathing
    // Transition (0.10–0.28): expansion begins — star is "being born"
    const expand = p < 0.10 ? 0 : Math.min(1, (p - 0.10) / 0.18)
    const scale = (0.012 + expand * 0.55) * breathe

    meshRef.current.scale.setScalar(scale)
  })

  return (
    <mesh ref={meshRef} position={[0, 0, 0]}>
      <sphereGeometry args={[1, 24, 24]} />
      <meshBasicMaterial color={STAR_COLOR} />
    </mesh>
  )
}
