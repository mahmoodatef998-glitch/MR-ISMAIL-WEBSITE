'use client'

import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

function lerp(a: number, b: number, t: number) { return a + (b - a) * t }

interface Props { progressRef: React.MutableRefObject<number> }

export function FilmLights({ progressRef }: Props) {
  const rimRef     = useRef<THREE.DirectionalLight>(null)
  const fillRef    = useRef<THREE.DirectionalLight>(null)
  const rakingRef  = useRef<THREE.PointLight>(null)
  const ambientRef = useRef<THREE.AmbientLight>(null)
  const frontRef   = useRef<THREE.DirectionalLight>(null)

  useFrame(() => {
    const p = progressRef.current

    // ── Scene 2: right rim catch-light ─────────────────────────────
    if (rimRef.current) {
      rimRef.current.intensity =
        p < 0.14 ? 0 :
        p < 0.24 ? Math.min(1, (p - 0.14) / 0.10) * 3.5 :
        p < 0.30 ? 3.5 :
                   Math.max(0, 1 - (p - 0.30) / 0.04) * 3.5

      const warmth = p < 0.14 ? 1 : Math.max(0, 1 - (p - 0.14) / 0.14)
      rimRef.current.color.setRGB(1.0, 0.88 + warmth * 0.12, 0.58 + warmth * 0.42)
    }

    // ── Scene 2: ghost fill ─────────────────────────────────────────
    if (fillRef.current) {
      fillRef.current.intensity =
        p < 0.14 ? 0 :
        p < 0.24 ? Math.min(1, (p - 0.14) / 0.10) * 0.07 :
        p < 0.30 ? 0.07 :
                   Math.max(0, 1 - (p - 0.30) / 0.04) * 0.07
    }

    // ── Scene 3: raking point light — tracks camera X, grazes surface ──
    if (rakingRef.current) {
      const active = p >= 0.29 && p <= 0.43
      if (active) {
        const camX =
          p < 0.32 ? lerp(0,    -0.40, (p - 0.28) / 0.04) :
          p < 0.42 ? lerp(-0.40, 0.30, (p - 0.32) / 0.10) :
                     0.30

        rakingRef.current.position.set(camX + 0.6, 0.04, 0.14)
        const fadeIn  = p < 0.31 ? Math.min(1, (p - 0.29) / 0.02) : 1
        const fadeOut = p > 0.42 ? Math.max(0, 1 - (p - 0.42) / 0.01) : 1
        rakingRef.current.intensity = fadeIn * fadeOut * 6.0
      } else {
        rakingRef.current.intensity = 0
      }
    }

    // ── Scene 4: ambient lifts + front fill activates ──────────────
    // Phone face is now lit for the first time — the full device revealed
    if (ambientRef.current) {
      ambientRef.current.intensity =
        p < 0.47 ? 0 :
        p < 0.54 ? Math.min(1, (p - 0.47) / 0.07) * 0.22 :
                   0.22
    }

    if (frontRef.current) {
      frontRef.current.intensity =
        p < 0.47 ? 0 :
        p < 0.54 ? Math.min(1, (p - 0.47) / 0.07) * 0.32 :
                   0.32
    }
  })

  return (
    <>
      {/* Scene 2 ── right rim */}
      <directionalLight ref={rimRef}  position={[3.0,  0.6,  1.5]} intensity={0} />

      {/* Scene 2 ── ghost fill */}
      <directionalLight ref={fillRef} position={[-1.2, 1.0, 4.0]} intensity={0} color="#f0f4ff" />

      {/* Scene 3 ── raking point light (warm, grazes the back surface at ~12°) */}
      <pointLight ref={rakingRef} intensity={0} distance={2.5} decay={2} color="#ffe4b0" />

      {/* Scene 4 ── ambient lift — the void becomes a stage */}
      <ambientLight ref={ambientRef} intensity={0} color="#fff8f0" />

      {/* Scene 4 ── front key light — court portrait illumination */}
      <directionalLight ref={frontRef} position={[0.5, 1.0, 5.0]} intensity={0} color="#fff4e8" />
    </>
  )
}
