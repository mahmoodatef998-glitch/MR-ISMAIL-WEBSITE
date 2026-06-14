'use client'

import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { RoundedBox } from '@react-three/drei'
import * as THREE from 'three'

// iPhone 15 Pro proportions: 70.6 × 146.6 × 8.25mm → scaled to 0.36 wide
const W = 0.360
const H = 0.748
const D = 0.042

interface Props { progressRef: React.MutableRefObject<number> }

export function PhoneBody({ progressRef }: Props) {
  const groupRef = useRef<THREE.Group>(null)

  useFrame(() => {
    const p = progressRef.current
    if (!groupRef.current) return

    // Phone was always in the dark — the rim light reveals it
    // Scale 0 during Scene 1 so it doesn't silhouette against the star
    groupRef.current.scale.setScalar(p > 0.12 ? 1 : 0)

    // Scene 2 transition: pivot to 3/4 angle (money shot)
    // Negative Y = right edge pivots toward camera, showing rim-lit rail + face simultaneously
    const pivotT = p < 0.24 ? 0 : Math.min(1, (p - 0.24) / 0.04)
    // ease-in-out
    const easedPivot = pivotT < 0.5
      ? 2 * pivotT * pivotT
      : -1 + (4 - 2 * pivotT) * pivotT
    groupRef.current.rotation.y = -easedPivot * (Math.PI / 12) // 15°
  })

  return (
    <group ref={groupRef}>
      <RoundedBox args={[W, H, D]} radius={0.020} smoothness={4}>
        {/*
          High metalness, very smooth — reflects the rim light as a sharp
          specular line along the titanium rail. No envmap = only direct
          lights visible. The phone appears only when lit.
        */}
        <meshStandardMaterial
          color="#070707"
          metalness={0.90}
          roughness={0.08}
          envMapIntensity={0.04}
        />
      </RoundedBox>
    </group>
  )
}
