'use client'

import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { RoundedBox } from '@react-three/drei'
import * as THREE from 'three'

// iPhone 15 Pro proportions: 70.6 × 146.6 × 8.25mm → 0.36 wide
const W = 0.360
const H = 0.748
const D = 0.042

// Camera island platform size
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

    // Phone was always in the dark — scale 0 hides it during Scene 1's void
    groupRef.current.scale.setScalar(p > 0.12 ? 1 : 0)

    // Y rotation choreography across scenes
    let yRot: number
    if (p < 0.24) {
      // Face-on, front toward camera
      yRot = 0
    } else if (p < 0.28) {
      // Scene 2 money shot: pivot to -15° for 3/4 angle
      yRot = -easeInOut((p - 0.24) / 0.04) * (Math.PI / 12)
    } else if (p < 0.32) {
      // Scene 3 entry: -15° → 180° (flip to reveal the back)
      const t = easeInOut((p - 0.28) / 0.04)
      yRot = lerp(-Math.PI / 12, Math.PI, t)
    } else {
      // Scene 3+: back face toward camera
      yRot = Math.PI
    }

    groupRef.current.rotation.y = yRot
  })

  return (
    <group ref={groupRef}>
      {/* ── Frame: titanium metallic ────────────────────────────── */}
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
        In local space (Y=0°): z = -D/2 is the back face.
        rotation={[Math.PI, 0, 0]} flips the plane normal to face -Z (local back).
        After group.rotation.y = Math.PI (Scene 3): local -Z → world +Z = toward camera. ✓
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
        ── Camera island ────────────────────────────────────────────
        Local position: upper-left of back face (local space, Y=0°).
        After Y=180°: appears at world upper-right, visible from +Z camera.
      */}
      <group position={[-0.088, 0.218, -(D / 2 + 0.003)]}>
        {/* Island platform */}
        <mesh>
          <boxGeometry args={[IS_W, IS_H, IS_D]} />
          <meshStandardMaterial color="#050505" metalness={0.88} roughness={0.10} />
        </mesh>

        {/* Lens circles — rotation={[Math.PI,0,0]} makes normal point -Z (toward camera after Y=180°) */}
        {/* Main lens — top left */}
        <mesh position={[-0.038, 0.042, -(IS_D / 2 + 0.001)]} rotation={[Math.PI, 0, 0]}>
          <circleGeometry args={[0.022, 40]} />
          <meshPhysicalMaterial color="#02020A" roughness={0.02} metalness={0.08} />
        </mesh>

        {/* Wide lens — bottom left */}
        <mesh position={[-0.038, -0.042, -(IS_D / 2 + 0.001)]} rotation={[Math.PI, 0, 0]}>
          <circleGeometry args={[0.019, 40]} />
          <meshPhysicalMaterial color="#02020A" roughness={0.02} metalness={0.08} />
        </mesh>

        {/* Ultra-wide — right side */}
        <mesh position={[0.042, 0.000, -(IS_D / 2 + 0.001)]} rotation={[Math.PI, 0, 0]}>
          <circleGeometry args={[0.016, 40]} />
          <meshPhysicalMaterial color="#02020A" roughness={0.02} metalness={0.08} />
        </mesh>
      </group>
    </group>
  )
}
