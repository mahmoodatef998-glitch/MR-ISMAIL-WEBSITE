'use client'

import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { RoundedBox } from '@react-three/drei'
import * as THREE from 'three'

// iPhone 15 Pro proportions: 70.6 × 146.6 × 8.25mm → 0.36 wide
const W = 0.360
const H = 0.748
const D = 0.042

// Camera island platform
const IS_W = 0.175
const IS_H = 0.162
const IS_D = 0.007

function lerp(a: number, b: number, t: number) { return a + (b - a) * t }
function easeInOut(t: number) { return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t }

interface Props { progressRef: React.MutableRefObject<number> }

export function PhoneBody({ progressRef }: Props) {
  const groupRef = useRef<THREE.Group>(null)

  useFrame(() => {
    const p = progressRef.current
    if (!groupRef.current) return

    // Scale 0 in Scene 1 — phone was always in the dark, the light reveals it
    groupRef.current.scale.setScalar(p > 0.12 ? 1 : 0)

    // ── Y rotation choreography ────────────────────────────────────
    let yRot: number
    if (p < 0.24) {
      yRot = 0
    } else if (p < 0.28) {
      // Scene 2 money shot: 0 → -15° (right edge toward camera)
      yRot = -easeInOut((p - 0.24) / 0.04) * (Math.PI / 12)
    } else if (p < 0.32) {
      // Scene 3 entry: -15° → 180° (flip to reveal back)
      yRot = lerp(-Math.PI / 12, Math.PI, easeInOut((p - 0.28) / 0.04))
    } else if (p < 0.43) {
      yRot = Math.PI
    } else if (p < 0.47) {
      // Scene 4 entry: 180° → 0° (flip back to front, screen will activate)
      yRot = lerp(Math.PI, 0, easeInOut((p - 0.43) / 0.04))
    } else {
      yRot = 0
    }

    groupRef.current.rotation.y = yRot

    // ── X rotation: Scene 4 end — screen tilts toward user ────────
    // Negative X = top of phone tilts toward camera = eye contact
    let xRot = 0
    if (p > 0.54 && p <= 0.57) {
      xRot = -easeInOut((p - 0.54) / 0.03) * (5 * Math.PI / 180)
    } else if (p > 0.57) {
      xRot = -(5 * Math.PI / 180)
    }
    groupRef.current.rotation.x = xRot
  })

  return (
    <group ref={groupRef}>

      {/* ── Frame: titanium metallic ─────────────────────────────── */}
      <RoundedBox args={[W, H, D]} radius={0.020} smoothness={4}>
        <meshStandardMaterial
          color="#070707"
          metalness={0.90}
          roughness={0.08}
          envMapIntensity={0.04}
        />
      </RoundedBox>

      {/*
        ── Back glass ──────────────────────────────────────────────
        Normal points -Z in local space (rotation={[Math.PI,0,0]}).
        After group Y=180° (Scene 3): local -Z → world +Z = toward camera. ✓
        After group Y=0° (Scene 4): faces away from camera. ✓
      */}
      <mesh position={[0, 0, -(D / 2 + 0.001)]} rotation={[Math.PI, 0, 0]}>
        <planeGeometry args={[W - 0.018, H - 0.018]} />
        <meshPhysicalMaterial
          color="#080808"
          roughness={0.18}
          metalness={0.0}
          clearcoat={0.08}
          clearcoatRoughness={0.5}
        />
      </mesh>

      {/*
        ── Camera island: upper-left in local space ────────────────
        Local (-0.088, 0.218, -D/2-0.003) → after Y=180°: world right side ✓
      */}
      <group position={[-0.088, 0.218, -(D / 2 + 0.003)]}>
        <mesh>
          <boxGeometry args={[IS_W, IS_H, IS_D]} />
          <meshStandardMaterial color="#050505" metalness={0.88} roughness={0.10} />
        </mesh>

        {/* Lens circles — rotation={[Math.PI,0,0]}: normal faces -Z (back direction) */}
        <mesh position={[-0.038,  0.042, -(IS_D / 2 + 0.001)]} rotation={[Math.PI, 0, 0]}>
          <circleGeometry args={[0.022, 40]} />
          <meshPhysicalMaterial color="#02020A" roughness={0.02} metalness={0.08} />
        </mesh>
        <mesh position={[-0.038, -0.042, -(IS_D / 2 + 0.001)]} rotation={[Math.PI, 0, 0]}>
          <circleGeometry args={[0.019, 40]} />
          <meshPhysicalMaterial color="#02020A" roughness={0.02} metalness={0.08} />
        </mesh>
        <mesh position={[ 0.042,  0.000, -(IS_D / 2 + 0.001)]} rotation={[Math.PI, 0, 0]}>
          <circleGeometry args={[0.016, 40]} />
          <meshPhysicalMaterial color="#02020A" roughness={0.02} metalness={0.08} />
        </mesh>
      </group>

    </group>
  )
}
