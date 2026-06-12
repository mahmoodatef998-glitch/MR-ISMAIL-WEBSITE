'use client'

import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { lerp, mapRange, easeOutExpo } from '../utils'

// Box-Muller for gaussian-distributed particle density (denser near centre)
function gaussian() {
  let u = 0, v = 0
  while (u === 0) u = Math.random()
  while (v === 0) v = Math.random()
  return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v)
}

type ParticleProps = { progressRef?: React.MutableRefObject<number> }

// ── Fine dust — tight cluster around phone ────────────────────────────────────
function DustParticles({ progressRef }: ParticleProps) {
  const ref = useRef<THREE.Points>(null)

  const { pos, col } = useMemo(() => {
    const COUNT = 1100
    const pos = new Float32Array(COUNT * 3)
    const col = new Float32Array(COUNT * 3)

    for (let i = 0; i < COUNT; i++) {
      pos[i * 3]     = gaussian() * 2.2
      pos[i * 3 + 1] = gaussian() * 1.8
      pos[i * 3 + 2] = gaussian() * 1.8 - 0.5
      const rnd = Math.random()
      if (rnd < 0.62) {
        col[i * 3]     = 0.76 + Math.random() * 0.14
        col[i * 3 + 1] = 0.62 + Math.random() * 0.10
        col[i * 3 + 2] = 0.38 + Math.random() * 0.10
      } else if (rnd < 0.82) {
        const w = 0.70 + Math.random() * 0.30
        col[i * 3] = w; col[i * 3 + 1] = w; col[i * 3 + 2] = w * 0.9
      } else {
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

    // Multi-harmonic rotation — three axes at irrational frequency ratios.
    // No two cycles align, so the cloud has "slosh" rather than mechanical spin.
    ref.current.rotation.y = t * 0.016 + Math.sin(t * 0.241) * 0.034
    ref.current.rotation.x = Math.sin(t * 0.009) * 0.10 + Math.cos(t * 0.137) * 0.018
    ref.current.rotation.z = Math.cos(t * 0.007) * 0.04 + Math.sin(t * 0.191) * 0.013

    // Fade to near-invisible during screen reveal — remove visual noise at climax
    if (progressRef) {
      const p    = progressRef.current
      const fade = easeOutExpo(mapRange(p, 0.87, 0.97, 0, 1))
      ;(ref.current.material as THREE.PointsMaterial).opacity = lerp(0.58, 0.03, fade)
    }
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
function BokehParticles({ progressRef }: ParticleProps) {
  const ref = useRef<THREE.Points>(null)

  const { pos, col } = useMemo(() => {
    const COUNT = 130
    const pos = new Float32Array(COUNT * 3)
    const col = new Float32Array(COUNT * 3)

    for (let i = 0; i < COUNT; i++) {
      pos[i * 3]     = (Math.random() - 0.5) * 16
      pos[i * 3 + 1] = (Math.random() - 0.5) * 10
      pos[i * 3 + 2] = -5 - Math.random() * 12
      if (Math.random() > 0.45) {
        col[i * 3] = 0.78; col[i * 3 + 1] = 0.60; col[i * 3 + 2] = 0.22
      } else {
        col[i * 3] = 0.22; col[i * 3 + 1] = 0.44; col[i * 3 + 2] = 1.0
      }
    }
    return { pos, col }
  }, [])

  useFrame(({ clock }) => {
    if (!ref.current) return
    const t = clock.elapsedTime

    // Slow oscillating drift — Z wobble adds depth-parallax breathing
    ref.current.rotation.y = t * 0.005 + Math.sin(t * 0.113) * 0.021
    ref.current.rotation.z = t * 0.003 + Math.cos(t * 0.079) * 0.016

    // Bokeh silences before dust — background clears first, foreground lingers
    if (progressRef) {
      const p    = progressRef.current
      const fade = easeOutExpo(mapRange(p, 0.85, 0.95, 0, 1))
      ;(ref.current.material as THREE.PointsMaterial).opacity = lerp(0.18, 0.01, fade)
    }
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

interface Props { progressRef?: React.MutableRefObject<number> }

export function FloatingParticles({ progressRef }: Props) {
  return (
    <>
      <DustParticles  progressRef={progressRef} />
      <BokehParticles progressRef={progressRef} />
    </>
  )
}
