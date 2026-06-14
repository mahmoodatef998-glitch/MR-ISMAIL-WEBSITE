'use client'

import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

function lerp(a: number, b: number, t: number) { return a + (b - a) * t }

interface Props { progressRef: React.MutableRefObject<number> }

export function FilmLights({ progressRef }: Props) {
  const rimRef    = useRef<THREE.DirectionalLight>(null)
  const fillRef   = useRef<THREE.DirectionalLight>(null)
  const rakingRef = useRef<THREE.PointLight>(null)

  useFrame(() => {
    const p = progressRef.current

    // ── Scene 2: rim catch-light + ghost fill ────────────────────
    if (rimRef.current) {
      rimRef.current.intensity =
        p < 0.14  ? 0 :
        p < 0.24  ? Math.min(1, (p - 0.14) / 0.10) * 3.5 :
        p < 0.30  ? 3.5 :
                    Math.max(0, 1 - (p - 0.30) / 0.04) * 3.5 // fade as Scene 3 begins

      // Color temperature: warm amber (2700K) → neutral (4500K)
      const warmth = p < 0.14 ? 1 : Math.max(0, 1 - (p - 0.14) / 0.14)
      rimRef.current.color.setRGB(1.0, 0.88 + warmth * 0.12, 0.58 + warmth * 0.42)
    }

    if (fillRef.current) {
      fillRef.current.intensity =
        p < 0.14 ? 0 :
        p < 0.24 ? Math.min(1, (p - 0.14) / 0.10) * 0.07 :
        p < 0.30 ? 0.07 :
                   Math.max(0, 1 - (p - 0.30) / 0.04) * 0.07
    }

    // ── Scene 3: raking point light — grazes the back surface to reveal grain
    // Positioned at ~12° above horizontal: very close to surface, far to the side
    // Tracks camera X so the illuminated hotspot always leads the dolly
    if (rakingRef.current) {
      const active = p >= 0.29 && p <= 0.43
      if (active) {
        // Mirror the camera X position (dolly path)
        const camX =
          p < 0.32 ? lerp(0,    -0.40, (p - 0.28) / 0.04) :
          p < 0.42 ? lerp(-0.40, 0.30, (p - 0.32) / 0.10) :
                     0.30

        // Light is 0.6 units ahead of camera in X, very close to back surface (z=0.14)
        rakingRef.current.position.set(camX + 0.6, 0.04, 0.14)

        const fadeIn  = p < 0.31 ? Math.min(1, (p - 0.29) / 0.02) : 1
        const fadeOut = p > 0.42 ? Math.max(0, 1 - (p - 0.42) / 0.01) : 1
        rakingRef.current.intensity = fadeIn * fadeOut * 6.0
      } else {
        rakingRef.current.intensity = 0
      }
    }
  })

  return (
    <>
      {/* Scene 2: right-side rim — creates the titanium rail catch-light */}
      <directionalLight ref={rimRef} position={[3.0, 0.6, 1.5]} intensity={0} />

      {/* Scene 2: ghost fill — reveals form, preserves drama */}
      <directionalLight
        ref={fillRef}
        position={[-1.2, 1.0, 4.0]}
        intensity={0}
        color="#f0f4ff"
      />

      {/* Scene 3: raking point light — warm, grazes surface at ~12° to reveal micro-texture */}
      <pointLight
        ref={rakingRef}
        intensity={0}
        distance={2.5}
        decay={2}
        color="#ffe4b0"
      />
    </>
  )
}
