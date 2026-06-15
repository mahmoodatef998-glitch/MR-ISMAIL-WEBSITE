'use client'

import { useRef, useMemo, useEffect } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

const D     = 0.042
const W_SCR = 0.328
const H_SCR = 0.682

function buildScreenTexture(): THREE.CanvasTexture {
  const cvs = document.createElement('canvas')
  cvs.width  = 390
  cvs.height = 844
  const ctx = cvs.getContext('2d')!

  // Bronze sunrise — mirrors the site palette (#0A0705 → #C4922A)
  const bg = ctx.createLinearGradient(0, 0, 0, cvs.height)
  bg.addColorStop(0.00, '#050302')
  bg.addColorStop(0.35, '#130B03')
  bg.addColorStop(0.65, '#4E3308')
  bg.addColorStop(0.88, '#8B6015')
  bg.addColorStop(1.00, '#C4922A')
  ctx.fillStyle = bg
  ctx.fillRect(0, 0, cvs.width, cvs.height)

  // Horizon glow — warm gold rising from below
  const glow = ctx.createRadialGradient(195, 900, 0, 195, 900, 380)
  glow.addColorStop(0, 'rgba(212, 168, 64, 0.42)')
  glow.addColorStop(1, 'rgba(212, 168, 64, 0)')
  ctx.fillStyle = glow
  ctx.fillRect(0, 0, cvs.width, cvs.height)

  // Time: 9:41 — Apple's tradition (the moment everything is revealed)
  ctx.fillStyle = 'rgba(255, 255, 255, 0.93)'
  ctx.font = 'bold 104px -apple-system, "SF Pro Display", "Helvetica Neue", sans-serif'
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  ctx.fillText('9:41', cvs.width / 2, 380)

  // Date in Arabic
  ctx.fillStyle = 'rgba(255, 255, 255, 0.42)'
  ctx.font = '400 26px -apple-system, "SF Pro Text", sans-serif'
  ctx.fillText('الإثنين، ١٤ يونيو', cvs.width / 2, 468)

  // Home indicator line
  ctx.fillStyle = 'rgba(255, 255, 255, 0.28)'
  ctx.beginPath()
  ctx.roundRect(cvs.width / 2 - 60, 810, 120, 4, 2)
  ctx.fill()

  return new THREE.CanvasTexture(cvs)
}

interface Props { progressRef: React.MutableRefObject<number> }

export function PhoneScreen({ progressRef }: Props) {
  const screenMatRef = useRef<THREE.MeshBasicMaterial>(null)
  const dotRef       = useRef<THREE.Mesh>(null)

  const texture = useMemo(() => {
    if (typeof document === 'undefined') return null
    return buildScreenTexture()
  }, [])

  useEffect(() => () => { texture?.dispose() }, [texture])

  useFrame(() => {
    const p = progressRef.current

    // Screen activates as phone returns to front face (p=0.47-0.52)
    if (screenMatRef.current) {
      screenMatRef.current.opacity = p < 0.47 ? 0 : Math.min(1, (p - 0.47) / 0.05)
    }

    // Notification dot pulses once at Scene 4 end (p=0.53-0.57)
    if (dotRef.current) {
      const mat = dotRef.current.material as THREE.MeshBasicMaterial
      if (p > 0.53 && p < 0.57) {
        const pulse = Math.sin(((p - 0.53) / 0.04) * Math.PI)
        mat.opacity = 0.25 + pulse * 0.75
        dotRef.current.scale.setScalar(1 + pulse * 0.6)
      } else {
        mat.opacity = 0
      }
    }
  })

  return (
    <>
      {/* Screen — on front face: local z = +D/2 + 0.001 */}
      <mesh position={[0, 0, D / 2 + 0.001]}>
        <planeGeometry args={[W_SCR, H_SCR]} />
        <meshBasicMaterial
          ref={screenMatRef}
          map={texture ?? undefined}
          transparent
          opacity={0}
        />
      </mesh>

      {/* Notification dot — bronze, pulses once as scene closes */}
      <mesh ref={dotRef} position={[0, -(H_SCR / 2 - 0.022), D / 2 + 0.002]}>
        <circleGeometry args={[0.006, 24]} />
        <meshBasicMaterial color="#C4922A" transparent opacity={0} />
      </mesh>
    </>
  )
}
