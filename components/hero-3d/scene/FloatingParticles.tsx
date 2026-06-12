'use client'

import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

// Box-Muller for gaussian-distributed particle density (denser near centre)
function gaussian() {
  let u = 0, v = 0
  while (u === 0) u = Math.random()
  while (v === 0) v = Math.random()
  return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v)
}

// ── Fine dust — tight cluster around phone ────────────────────────────────────
// Simulates lit studio dust — the particles closest to the phone.
function DustParticles() {
  const ref = useRef<THREE.Points>(null)

  const { pos, col } = useMemo(() => {
    const COUNT = 1100
    const pos = new Float32Array(COUNT * 3)
    const col = new Float32Array(COUNT * 3)

    for (let i = 0; i < COUNT; i++) {
      // Gaussian cluster centred on phone, σ ≈ 2 units
      pos[i * 3]     = gaussian() * 2.2
      pos[i * 3 + 1] = gaussian() * 1.8
      pos[i * 3 + 2] = gaussian() * 1.8 - 0.5  // slight bias backward

      const rnd = Math.random()
      if (rnd < 0.62) {
        // Gold — brand colour
        col[i * 3]     = 0.76 + Math.random() * 0.14
        col[i * 3 + 1] = 0.62 + Math.random() * 0.10
        col[i * 3 + 2] = 0.38 + Math.random() * 0.10
      } else if (rnd < 0.82) {
        // Warm white
        const w = 0.70 + Math.random() * 0.30
        col[i * 3] = w; col[i * 3 + 1] = w; col[i * 3 + 2] = w * 0.9
      } else {
        // Electric blue accent
        col[i * 3]     = 0.20 + Math.random() * 0.15
        col[i * 3 + 1] = 0.42 + Math.random() * 0.20
        col[i * 3 + 2] = 1.0
      }
    }
    return { pos, col }
  }, [])

  useFrame(({ clock }) => {
    if (!ref.current) return
    const t = clock.elapsedTime
    // Slow tumble — gives the impression of particles drifting
    ref.current.rotation.y = t * 0.016
    ref.current.rotation.x = Math.sin(t * 0.009) * 0.10
    ref.current.rotation.z = Math.cos(t * 0.007) * 0.04
  })

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[pos, 3]} />
        <bufferAttribute attach="attributes-color"    args={[col, 3]} />
      </bufferGeometry>
      <pointsMaterial
        size={0.016}
        vertexColors
        transparent
        opacity={0.58}
        sizeAttenuation
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </points>
  )
}

// ── Bokeh layer — far background ──────────────────────────────────────────────
// Large, very dim circles that simulate out-of-focus light sources behind the scene.
// They are intentionally over-sized: with DepthOfField, the far ones blur further.
function BokehParticles() {
  const ref = useRef<THREE.Points>(null)

  const { pos, col } = useMemo(() => {
    const COUNT = 130
    const pos = new Float32Array(COUNT * 3)
    const col = new Float32Array(COUNT * 3)

    for (let i = 0; i < COUNT; i++) {
      pos[i * 3]     = (Math.random() - 0.5) * 16
      pos[i * 3 + 1] = (Math.random() - 0.5) * 10
      pos[i * 3 + 2] = -5 - Math.random() * 12  // deep background only

      if (Math.random() > 0.45) {
        // Gold bokeh
        col[i * 3] = 0.78; col[i * 3 + 1] = 0.60; col[i * 3 + 2] = 0.22
      } else {
        // Blue bokeh
        col[i * 3] = 0.22; col[i * 3 + 1] = 0.44; col[i * 3 + 2] = 1.0
      }
    }
    return { pos, col }
  }, [])

  useFrame(({ clock }) => {
    if (!ref.current) return
    const t = clock.elapsedTime
    // Very slow drift — creates a parallax against the dust layer
    ref.current.rotation.y = t * 0.005
    ref.current.rotation.z = t * 0.003
  })

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[pos, 3]} />
        <bufferAttribute attach="attributes-color"    args={[col, 3]} />
      </bufferGeometry>
      <pointsMaterial
        size={0.10}
        vertexColors
        transparent
        opacity={0.18}
        sizeAttenuation
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </points>
  )
}

export function FloatingParticles() {
  return (
    <>
      <DustParticles />
      <BokehParticles />
    </>
  )
}
