'use client'

import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

interface Props { progressRef: React.MutableRefObject<number> }

export function FilmLights({ progressRef }: Props) {
  const rimRef  = useRef<THREE.DirectionalLight>(null)
  const fillRef = useRef<THREE.DirectionalLight>(null)

  useFrame(() => {
    const p = progressRef.current

    if (rimRef.current) {
      // Right-side rim — appears as phone materializes out of the star
      rimRef.current.intensity = p < 0.14
        ? 0
        : Math.min(1, (p - 0.14) / 0.10) * 3.5

      // Color temperature: warm amber (2700K) → neutral (4500K)
      const warmth = p < 0.14 ? 1 : Math.max(0, 1 - (p - 0.14) / 0.14)
      rimRef.current.color.setRGB(1.0, 0.88 + warmth * 0.12, 0.58 + warmth * 0.42)
    }

    if (fillRef.current) {
      // Ghost fill — just enough to show the phone's mass, never washes out the drama
      fillRef.current.intensity = p < 0.14
        ? 0
        : Math.min(1, (p - 0.14) / 0.10) * 0.07
    }
  })

  return (
    <>
      {/* Rim from the right — creates the titanium rail catch-light */}
      <directionalLight ref={rimRef} position={[3.0, 0.6, 1.5]} intensity={0} />

      {/* Ghost fill from front-left — reveals form without drama loss */}
      <directionalLight
        ref={fillRef}
        position={[-1.2, 1.0, 4.0]}
        intensity={0}
        color="#f0f4ff"
      />
    </>
  )
}
