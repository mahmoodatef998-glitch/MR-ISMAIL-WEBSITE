'use client'

import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { mapRange, lerp } from '../utils'

interface Props { progressRef: React.MutableRefObject<number> }

export function StudioLights({ progressRef }: Props) {
  const keyRef         = useRef<THREE.SpotLight>(null)
  const rimRef         = useRef<THREE.SpotLight>(null)
  const screenFillRef  = useRef<THREE.PointLight>(null)

  useFrame(({ clock }) => {
    const p = progressRef.current
    const t = clock.elapsedTime

    // Phase progress values — matched to unified phase map
    const tHold = mapRange(p, 0.44, 0.48, 0, 1)  // anticipation hold (inhale)
    const t3    = mapRange(p, 0.48, 0.73, 0, 1)  // explosion + sweep
    const t4    = mapRange(p, 0.73, 0.87, 0, 1)  // reassembly
    const t5    = mapRange(p, 0.87, 1.00, 0, 1)  // screen reveal

    // ── Key light ────────────────────────────────────────────────────────────
    // Hold: dims 10% (scene exhales), explosion: slashes down, reveal: surges
    if (keyRef.current) {
      let ki = 130
      if (tHold > 0) ki = lerp(130, 117, tHold)  // subtle dim — the inhale
      if (t3    > 0) ki = lerp(117,  45, t3)      // dims during explosion
      if (t4    > 0) ki = lerp( 45, 165, t4)      // recovers during reassembly
      if (t5    > 0) ki = lerp(165, 230, t5)      // surges for final reveal
      // Soft breathing at rest — silences as chaos takes over, absent during reveal
      const breathe = Math.max(0, 1 - t3 * 4 - t5 * 3) * Math.sin(t * 0.41) * 5
      keyRef.current.intensity = ki + breathe
    }

    // ── Rim light ────────────────────────────────────────────────────────────
    // Hold: brightens slightly (tension building), then electric blue at explosion
    if (rimRef.current) {
      if (t3 <= 0 && tHold <= 0) {
        // Phases 1–2: signature violet
        rimRef.current.color.setHSL(0.77, 0.88, 0.54)
        rimRef.current.intensity = 85
      } else if (t3 <= 0) {
        // Anticipation hold: violet brightens — tension
        rimRef.current.color.setHSL(lerp(0.77, 0.72, tHold), 0.90, lerp(0.54, 0.62, tHold))
        rimRef.current.intensity = lerp(85, 105, tHold)
      } else if (t3 < 0.5) {
        // Phase 3 first half: violet → electric blue
        const f = t3 * 2
        rimRef.current.color.setHSL(lerp(0.72, 0.62, f), lerp(0.90, 0.95, f), 0.58)
        rimRef.current.intensity = lerp(105, 140, f)
      } else if (t3 < 1) {
        // Phase 3 second half: hold electric blue at full intensity
        rimRef.current.color.setHSL(0.62, 0.95, 0.58)
        rimRef.current.intensity = 140
      } else if (t4 > 0) {
        // Phase 4 reassembly: blue → warm gold (brand color)
        rimRef.current.color.setHSL(lerp(0.62, 0.10, t4), lerp(0.95, 0.78, t4), lerp(0.58, 0.58, t4))
        rimRef.current.intensity = lerp(140, 90, t4)
      } else {
        // Phase 5: rim fades almost to silence — screen becomes the sole source.
        // This is the cinematic darkness before the screen light dominates.
        rimRef.current.color.setHSL(0.10, 0.78, 0.58)
        rimRef.current.intensity = lerp(90, 6, t5)
      }
    }

    // ── Screen reveal fill ───────────────────────────────────────────────────
    // Pulses at √3 Hz — same irrational frequency as the screen glow in PhoneModel,
    // so both pulse in organic sync (non-mechanical, never perfectly aligned).
    if (screenFillRef.current) {
      const pulse = t5 > 0.2 ? Math.sin(t * 1.732) * 2.5 * Math.min(t5, 1) : 0
      screenFillRef.current.intensity = lerp(0, 46, t5) + pulse
    }
  })

  return (
    <>
      {/* Near-black ambient with deep indigo tint — prevents pitch-black undersides */}
      <ambientLight intensity={0.06} color="#0a0f22" />

      {/* Key — warm white, top-left-front (primary source) */}
      <spotLight
        ref={keyRef}
        position={[-4.5, 8.5, 5.5]}
        intensity={130}
        color="#fff2e4"
        angle={0.26}
        penumbra={0.80}
        castShadow
        shadow-mapSize={[2048, 2048]}
        shadow-bias={-0.0002}
        shadow-normalBias={0.04}
      />

      {/* Rim — violet, directly back-top (edge separation / hair light) */}
      <spotLight
        ref={rimRef}
        position={[0.5, 6.5, -9]}
        intensity={85}
        color="#9933ff"
        angle={0.38}
        penumbra={1.0}
      />

      {/* Fill — cool electric blue, right side (studio bounce) */}
      <pointLight position={[5.5, 2.5, 2.5]} intensity={20} color="#3355ff" distance={14} decay={2} />

      {/* Gold accent — low front-right (brand warm fill) */}
      <pointLight position={[2.0, -2.5, 3.5]} intensity={14} color="#c8a96e" distance={9} decay={2} />

      {/* Ground bounce — barely visible cool tone */}
      <pointLight position={[0, -6, 1.5]} intensity={4} color="#101830" distance={12} decay={2} />

      {/* Screen reveal helper — activates in phase 5 */}
      <pointLight
        ref={screenFillRef}
        position={[0, 0.1, 2.4]}
        intensity={0}
        color="#4466ff"
        distance={6}
        decay={2}
      />
    </>
  )
}
