'use client'

import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

/*
  Main lens world position when phone is at Y=0° (Scene 5):
  Island local:  (-0.088, 0.218, -(D/2+0.003)) = (-0.088, 0.218, -0.024)
  Lens in island: (-0.038, 0.042, -(IS_D/2+0.001)) relative to island group
  World:         (-0.126, 0.260, -0.0285)
*/
const POS: [number, number, number] = [-0.126, 0.260, -0.029]

// HDR bronze — triggers Bloom as a catch-light in the lens glass
const CATCH_COLOR = new THREE.Color(5.0, 2.8, 0.6)

interface Props { progressRef: React.MutableRefObject<number> }

export function LensFlare({ progressRef }: Props) {
  const meshRef = useRef<THREE.Mesh>(null)
  const matRef  = useRef<THREE.MeshBasicMaterial>(null)

  useFrame(() => {
    const p = progressRef.current
    if (!meshRef.current || !matRef.current) return

    if (p >= 0.57 && p <= 0.71) {
      // Orbit 0→1 as p goes 0.57→0.71
      const orbitT = (p - 0.57) / 0.14

      // Catch-light visible mainly when camera approaches the back (orbit > 50%)
      // Peak brightness when orbit is ~75% (camera almost fully behind)
      const brightness = Math.sin(orbitT * Math.PI) * 0.6 + Math.max(0, orbitT - 0.5) * 0.8
      const clamped    = Math.min(1, brightness)

      matRef.current.opacity      = clamped
      meshRef.current.scale.setScalar(0.5 + clamped * 0.8)
    } else {
      matRef.current.opacity      = 0
      meshRef.current.scale.setScalar(0)
    }
  })

  return (
    <mesh ref={meshRef} position={POS}>
      <sphereGeometry args={[0.007, 8, 8]} />
      <meshBasicMaterial
        ref={matRef}
        color={CATCH_COLOR}
        transparent
        opacity={0}
      />
    </mesh>
  )
}
