'use client'

import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { mapRange, lerp, easeOutExpo } from '../utils'

interface Props { progressRef: React.MutableRefObject<number> }

// Glowing orb — soft ambient light node, no sci-fi UI
function GlowOrb({ position, color, intensity }: {
  position: [number, number, number]
  color: string
  intensity: number
}) {
  const lightRef = useRef<THREE.PointLight>(null)
  const phase    = useRef(Math.random() * Math.PI * 2)

  useFrame(({ clock }) => {
    if (!lightRef.current) return
    // Gentle living pulse
    lightRef.current.intensity = intensity * (0.82 + Math.sin(clock.elapsedTime * 0.73 + phase.current) * 0.18)
  })

  return (
    <>
      <mesh position={position}>
        <sphereGeometry args={[0.055, 16, 16]} />
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={10} toneMapped={false} />
      </mesh>
      <pointLight ref={lightRef} position={position} color={color} intensity={intensity} distance={9} decay={2} />
    </>
  )
}

// Premium glass panel — clean, translucent, no holographic noise
function GlassPanel({ position, rotation, width, height, delay }: {
  position: [number, number, number]
  rotation: [number, number, number]
  width: number; height: number; delay: number
}) {
  const ref = useRef<THREE.Group>(null)

  useFrame(({ clock }) => {
    if (!ref.current) return
    ref.current.position.y = position[1] + Math.sin(clock.elapsedTime * 0.31 + delay) * 0.045
  })

  return (
    <group ref={ref} position={position} rotation={rotation}>
      {/* Dark glass fill */}
      <mesh>
        <planeGeometry args={[width, height]} />
        <meshPhysicalMaterial
          color="#0a1535"
          transmission={0.88}
          roughness={0.04}
          metalness={0}
          ior={1.48}
          thickness={0.06}
          transparent
          opacity={0.15}
          side={THREE.DoubleSide}
        />
      </mesh>
      {/* Single edge highlight — clean border, no grid */}
      <lineSegments>
        <edgesGeometry args={[new THREE.PlaneGeometry(width, height)]} />
        <lineBasicMaterial color="#3366cc" transparent opacity={0.22} />
      </lineSegments>
    </group>
  )
}

// Deep space stars — subtle, just enough to suggest infinite depth
function DepthStars() {
  const ref = useRef<THREE.Points>(null)

  const { positions, colors } = useMemo(() => {
    const COUNT     = 900
    const positions = new Float32Array(COUNT * 3)
    const colors    = new Float32Array(COUNT * 3)

    for (let i = 0; i < COUNT; i++) {
      positions[i * 3]     = (Math.random() - 0.5) * 30
      positions[i * 3 + 1] = (Math.random() - 0.5) * 18
      positions[i * 3 + 2] = -5 - Math.random() * 20

      const b = 0.45 + Math.random() * 0.55
      if (Math.random() > 0.28) {
        // Blue-white star
        colors[i * 3]     = b * 0.70
        colors[i * 3 + 1] = b * 0.82
        colors[i * 3 + 2] = b
      } else {
        // Warm gold star
        colors[i * 3]     = b * 0.92
        colors[i * 3 + 1] = b * 0.76
        colors[i * 3 + 2] = b * 0.38
      }
    }
    return { positions, colors }
  }, [])

  useFrame(({ clock }) => {
    if (!ref.current) return
    ref.current.rotation.y = clock.elapsedTime * 0.007
    ref.current.rotation.x = Math.sin(clock.elapsedTime * 0.003) * 0.04
  })

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-color"    args={[colors, 3]} />
      </bufferGeometry>
      <pointsMaterial
        size={0.016}
        vertexColors
        transparent
        opacity={0.50}
        sizeAttenuation
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </points>
  )
}

// Soft volumetric glow behind the panels — atmospheric depth
function BackgroundGlow() {
  return (
    <mesh position={[0, 0, -7]}>
      <planeGeometry args={[22, 14]} />
      <meshBasicMaterial
        color="#0a1840"
        transparent
        opacity={0.28}
        side={THREE.DoubleSide}
      />
    </mesh>
  )
}

export function ScreenWorld({ progressRef }: Props) {
  const groupRef = useRef<THREE.Group>(null)

  const panels = useMemo(() => [
    { position: [-2.1,  0.3, -3.2] as [number,number,number], rotation: [0,  0.28, 0] as [number,number,number], width: 1.7, height: 1.0, delay: 0   },
    { position: [ 1.9,  0.1, -3.8] as [number,number,number], rotation: [0, -0.26, 0] as [number,number,number], width: 1.5, height: 1.2, delay: 0.7 },
    { position: [-0.5,  1.5, -5.8] as [number,number,number], rotation: [0,  0.10, 0] as [number,number,number], width: 2.6, height: 0.8, delay: 1.2 },
    { position: [ 0.9, -1.1, -4.8] as [number,number,number], rotation: [0, -0.14, 0] as [number,number,number], width: 1.1, height: 1.5, delay: 1.9 },
  ], [])

  useFrame(({ clock }) => {
    if (!groupRef.current) return
    const p      = progressRef.current
    const reveal = easeOutExpo(mapRange(p, 0.90, 1.0, 0, 1))

    groupRef.current.visible = p > 0.87
    groupRef.current.scale.setScalar(lerp(0.88, 1.0, reveal))
    // Barely perceptible slow rotation — feels like infinite space, not a spinning stage
    groupRef.current.rotation.y = clock.elapsedTime * 0.010
  })

  return (
    <group ref={groupRef} visible={false} position={[0, 0, -0.5]}>
      {/* Atmospheric background */}
      <BackgroundGlow />
      <DepthStars />

      {/* Ambient light nodes — brand palette */}
      <GlowOrb position={[ 0,   0,  -4]}  color="#3355ee" intensity={5} />
      <GlowOrb position={[-3,   2,  -7]}  color="#c8a96e" intensity={3} />
      <GlowOrb position={[ 2.6,-1,  -5.5]} color="#4422cc" intensity={3} />

      {/* Clean glass panels — minimal, no holographic noise */}
      {panels.map((p, i) => <GlassPanel key={i} {...p} />)}
    </group>
  )
}
