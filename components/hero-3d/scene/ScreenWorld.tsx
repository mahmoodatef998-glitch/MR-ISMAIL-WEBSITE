'use client'

import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { mapRange, easeOutExpo } from '../utils'

interface Props { progressRef: React.MutableRefObject<number> }

function HoloPanel({ position, rotation, width, height, delay }: {
  position: [number, number, number]
  rotation: [number, number, number]
  width: number; height: number; delay: number
}) {
  const ref = useRef<THREE.Group>(null)

  useFrame(({ clock }) => {
    if (!ref.current) return
    const t = clock.elapsedTime + delay
    ref.current.position.y = position[1] + Math.sin(t * 0.4) * 0.06
    ref.current.rotation.y = rotation[1] + Math.sin(t * 0.25) * 0.04
  })

  return (
    <group ref={ref} position={position} rotation={rotation}>
      <mesh>
        <planeGeometry args={[width, height]} />
        <meshPhysicalMaterial
          color="#1a2a5a" transmission={0.7} roughness={0.05}
          metalness={0.1} ior={1.4} thickness={0.1}
          transparent opacity={0.35} emissive="#3355ff" emissiveIntensity={0.3}
          side={THREE.DoubleSide}
        />
      </mesh>
      <lineSegments>
        <edgesGeometry args={[new THREE.PlaneGeometry(width, height)]} />
        <lineBasicMaterial color="#4488ff" transparent opacity={0.8} />
      </lineSegments>
      {Array.from({ length: Math.floor(height / 0.08) }, (_, i) => (
        <mesh key={i} position={[0, -height / 2 + i * 0.08 + 0.04, 0.001]}>
          <planeGeometry args={[width * 0.9, 0.006]} />
          <meshBasicMaterial color="#2255aa" transparent opacity={0.2} />
        </mesh>
      ))}
    </group>
  )
}

function DataStream({ start, end, color }: {
  start: [number, number, number]
  end: [number, number, number]
  color: string
}) {
  const lineObj = useMemo(() => {
    const pts = [new THREE.Vector3(...start), new THREE.Vector3(...end)]
    const geo  = new THREE.BufferGeometry().setFromPoints(pts)
    const mat  = new THREE.LineBasicMaterial({ color, transparent: true, opacity: 0.5 })
    return new THREE.Line(geo, mat)
  }, [start, end, color]) // eslint-disable-line react-hooks/exhaustive-deps

  const offsetRef = useRef(Math.random())

  useFrame(({ clock }) => {
    const t = (clock.elapsedTime * 0.3 + offsetRef.current) % 1
    ;(lineObj.material as THREE.LineBasicMaterial).opacity = Math.sin(t * Math.PI) * 0.7
  })

  return <primitive object={lineObj} />
}

function HoloGrid() {
  const grid = useMemo(() => {
    return new THREE.GridHelper(12, 20, '#1a3a7a', '#1a2a55')
  }, [])

  const ref = useRef<THREE.GridHelper>(null)
  useFrame(({ clock }) => {
    if (!ref.current) return
    ref.current.position.z = ((clock.elapsedTime * 0.3) % 0.6) - 0.3
  })

  return <primitive ref={ref} object={grid} position={[0, -2.5, -4]} />
}

function UniverseStars() {
  const ref = useRef<THREE.Points>(null)

  const { positions, colors } = useMemo(() => {
    const COUNT = 1200
    const positions = new Float32Array(COUNT * 3)
    const colors    = new Float32Array(COUNT * 3)

    for (let i = 0; i < COUNT; i++) {
      positions[i * 3]     = (Math.random() - 0.5) * 20
      positions[i * 3 + 1] = (Math.random() - 0.5) * 12
      positions[i * 3 + 2] = -2 - Math.random() * 15

      if (Math.random() > 0.5) {
        colors[i * 3] = 0.3 + Math.random() * 0.2
        colors[i * 3 + 1] = 0.5 + Math.random() * 0.3
        colors[i * 3 + 2] = 1
      } else {
        colors[i * 3] = 0.78; colors[i * 3 + 1] = 0.66; colors[i * 3 + 2] = 0.43
      }
    }
    return { positions, colors }
  }, [])

  useFrame(({ clock }) => {
    if (!ref.current) return
    ref.current.rotation.z = clock.elapsedTime * 0.02
  })

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-color"    args={[colors, 3]} />
      </bufferGeometry>
      <pointsMaterial size={0.025} vertexColors transparent opacity={0.7}
        sizeAttenuation blending={THREE.AdditiveBlending} depthWrite={false} />
    </points>
  )
}

export function ScreenWorld({ progressRef }: Props) {
  const groupRef = useRef<THREE.Group>(null)

  const panels = useMemo(() => [
    { position: [-2.2, 0.4, -3]  as [number,number,number], rotation: [0, 0.3, 0]  as [number,number,number], width: 1.4, height: 0.9, delay: 0   },
    { position: [ 2.0, 0.2, -3.5] as [number,number,number], rotation: [0,-0.3, 0] as [number,number,number], width: 1.2, height: 1.1, delay: 0.5 },
    { position: [-1.0, 1.5, -5]  as [number,number,number], rotation: [0, 0.15,0]  as [number,number,number], width: 1.8, height: 0.7, delay: 1.0  },
    { position: [ 1.2,-1.2, -4]  as [number,number,number], rotation: [0,-0.2, 0]  as [number,number,number], width: 1.0, height: 1.2, delay: 1.5  },
    { position: [ 0,   0.8, -6]  as [number,number,number], rotation: [0, 0,   0]  as [number,number,number], width: 2.2, height: 1.0, delay: 0.8  },
  ], [])

  const streams = useMemo(() => [
    { start: [-3,  1.5, -4]   as [number,number,number], end: [-1,  0.4, -3]   as [number,number,number], color: '#4488ff' },
    { start: [ 3,  0.5, -3.5] as [number,number,number], end: [ 0.8,-0.8,-3.8] as [number,number,number], color: '#c8a96e' },
    { start: [-2, -1,   -5]   as [number,number,number], end: [ 1.5, 1.2,-4.5] as [number,number,number], color: '#aa44ff' },
    { start: [ 0,  2,   -6]   as [number,number,number], end: [-1,  1.5, -5]   as [number,number,number], color: '#44ffaa' },
  ], [])

  useFrame(({ clock }) => {
    if (!groupRef.current) return
    const p = progressRef.current
    const reveal = easeOutExpo(mapRange(p, 0.90, 1.0, 0, 1))

    groupRef.current.visible = p > 0.87
    groupRef.current.scale.setScalar(reveal)
    groupRef.current.rotation.y = clock.elapsedTime * 0.04
  })

  return (
    <group ref={groupRef} visible={false} position={[0, 0, -1]}>
      <pointLight position={[0, 0, -3]}  color="#3366ff" intensity={6} distance={10} />
      <pointLight position={[-3, 2, -5]} color="#c8a96e" intensity={4} distance={8}  />
      <pointLight position={[3, -1, -4]} color="#aa44ff" intensity={4} distance={8}  />

      <UniverseStars />
      <HoloGrid />

      {panels.map((p, i)  => <HoloPanel key={i} {...p} />)}
      {streams.map((s, i) => <DataStream key={i} {...s} />)}

      <mesh position={[0, 0, -4]}>
        <sphereGeometry args={[0.12, 32, 32]} />
        <meshStandardMaterial color="#4488ff" emissive="#2244ff" emissiveIntensity={5} />
      </mesh>
      <pointLight position={[0, 0, -4]} color="#4488ff" intensity={20} distance={6} />
    </group>
  )
}
