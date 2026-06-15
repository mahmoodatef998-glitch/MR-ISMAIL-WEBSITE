'use client'

import { useRef, useMemo, useEffect } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

const D     = 0.042
const W_SCR = 0.328
const H_SCR = 0.682

// ── Canvas texture builders ──────────────────────────────────────────

function buildHomeTexture(): THREE.CanvasTexture {
  const cvs = document.createElement('canvas')
  cvs.width = 390; cvs.height = 844
  const ctx = cvs.getContext('2d')!

  const bg = ctx.createLinearGradient(0, 0, 0, cvs.height)
  bg.addColorStop(0.00, '#050302')
  bg.addColorStop(0.35, '#130B03')
  bg.addColorStop(0.65, '#4E3308')
  bg.addColorStop(0.88, '#8B6015')
  bg.addColorStop(1.00, '#C4922A')
  ctx.fillStyle = bg
  ctx.fillRect(0, 0, cvs.width, cvs.height)

  const glow = ctx.createRadialGradient(195, 900, 0, 195, 900, 380)
  glow.addColorStop(0, 'rgba(212,168,64,0.42)')
  glow.addColorStop(1, 'rgba(212,168,64,0)')
  ctx.fillStyle = glow
  ctx.fillRect(0, 0, cvs.width, cvs.height)

  ctx.fillStyle = 'rgba(255,255,255,0.93)'
  ctx.font = 'bold 104px -apple-system, "Helvetica Neue", sans-serif'
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  ctx.fillText('9:41', cvs.width / 2, 380)

  ctx.fillStyle = 'rgba(255,255,255,0.42)'
  ctx.font = '400 26px -apple-system, sans-serif'
  ctx.fillText('الإثنين، ١٤ يونيو', cvs.width / 2, 468)

  ctx.fillStyle = 'rgba(255,255,255,0.28)'
  ctx.beginPath()
  ctx.roundRect(cvs.width / 2 - 60, 810, 120, 4, 2)
  ctx.fill()
  return new THREE.CanvasTexture(cvs)
}

function buildCallTexture(): THREE.CanvasTexture {
  const cvs = document.createElement('canvas')
  cvs.width = 390; cvs.height = 844
  const ctx = cvs.getContext('2d')!

  ctx.fillStyle = '#040201'
  ctx.fillRect(0, 0, cvs.width, cvs.height)

  // Subtle warm vignette — suggests intimacy of a call
  const vignette = ctx.createRadialGradient(195, 422, 60, 195, 422, 420)
  vignette.addColorStop(0, 'rgba(20,12,3,0)')
  vignette.addColorStop(1, 'rgba(5,2,0,0.7)')
  ctx.fillStyle = vignette
  ctx.fillRect(0, 0, cvs.width, cvs.height)

  // Caller avatar — bronze ring
  ctx.strokeStyle = 'rgba(196,146,42,0.4)'
  ctx.lineWidth = 2
  ctx.beginPath()
  ctx.arc(195, 280, 54, 0, Math.PI * 2)
  ctx.stroke()
  ctx.fillStyle = 'rgba(196,146,42,0.08)'
  ctx.fill()

  // Caller initial
  ctx.fillStyle = 'rgba(196,146,42,0.7)'
  ctx.font = 'bold 48px -apple-system, serif'
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  ctx.fillText('م', 195, 280)

  // Caller name
  ctx.fillStyle = 'rgba(255,255,255,0.90)'
  ctx.font = 'bold 42px -apple-system, "SF Arabic", sans-serif'
  ctx.fillText('مصطفى', cvs.width / 2, 390)

  // Location
  ctx.fillStyle = 'rgba(255,255,255,0.40)'
  ctx.font = '400 24px -apple-system, sans-serif'
  ctx.fillText('القاهرة', cvs.width / 2, 448)

  // Call status
  ctx.fillStyle = 'rgba(255,255,255,0.25)'
  ctx.font = '300 18px -apple-system, sans-serif'
  ctx.letterSpacing = '0.1em'
  ctx.fillText('جارٍ الاتصال...', cvs.width / 2, 498)

  // End call button
  ctx.fillStyle = 'rgba(220,53,53,0.85)'
  ctx.beginPath()
  ctx.arc(195, 720, 34, 0, Math.PI * 2)
  ctx.fill()

  ctx.fillStyle = '#fff'
  ctx.font = '18px -apple-system, sans-serif'
  ctx.fillText('✕', 195, 721)

  return new THREE.CanvasTexture(cvs)
}

function buildDiscoveryTexture(): THREE.CanvasTexture {
  const cvs = document.createElement('canvas')
  cvs.width = 390; cvs.height = 844
  const ctx = cvs.getContext('2d')!

  ctx.fillStyle = '#030201'
  ctx.fillRect(0, 0, cvs.width, cvs.height)

  // Bronze bottom gradient — the invitation glows from below
  const bronze = ctx.createLinearGradient(0, 500, 0, cvs.height)
  bronze.addColorStop(0, 'rgba(196,146,42,0)')
  bronze.addColorStop(1, 'rgba(196,146,42,0.22)')
  ctx.fillStyle = bronze
  ctx.fillRect(0, 0, cvs.width, cvs.height)

  // Main word
  ctx.fillStyle = 'rgba(255,255,255,0.92)'
  ctx.font = 'bold 84px -apple-system, "SF Arabic", serif'
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  ctx.fillText('اكتشف', cvs.width / 2, 340)

  // Sub-word
  ctx.fillStyle = 'rgba(196,146,42,0.75)'
  ctx.font = '400 36px -apple-system, "SF Arabic", sans-serif'
  ctx.fillText('المجموعة', cvs.width / 2, 420)

  // Subtle divider
  ctx.strokeStyle = 'rgba(196,146,42,0.20)'
  ctx.lineWidth = 1
  ctx.beginPath()
  ctx.moveTo(cvs.width / 2 - 40, 464)
  ctx.lineTo(cvs.width / 2 + 40, 464)
  ctx.stroke()

  // CTA arrow
  ctx.fillStyle = 'rgba(196,146,42,0.5)'
  ctx.font = '300 22px -apple-system, sans-serif'
  ctx.fillText('←', cvs.width / 2, 496)

  ctx.fillStyle = 'rgba(255,255,255,0.28)'
  ctx.beginPath()
  ctx.roundRect(cvs.width / 2 - 60, 810, 120, 4, 2)
  ctx.fill()

  return new THREE.CanvasTexture(cvs)
}

// ── Component ────────────────────────────────────────────────────────

interface Props { progressRef: React.MutableRefObject<number> }

export function PhoneScreen({ progressRef }: Props) {
  const screenMatRef = useRef<THREE.MeshBasicMaterial>(null)
  const dotRef       = useRef<THREE.Mesh>(null)

  const textures = useMemo(() => {
    if (typeof document === 'undefined') return null
    return {
      home:      buildHomeTexture(),
      call:      buildCallTexture(),
      discovery: buildDiscoveryTexture(),
    }
  }, [])

  useEffect(() => () => {
    textures?.home.dispose()
    textures?.call.dispose()
    textures?.discovery.dispose()
  }, [textures])

  useFrame(() => {
    const p   = progressRef.current
    const mat = screenMatRef.current
    if (!mat || !textures) return

    // ── Scene 4: home screen activates ──────────────────────────
    if (p < 0.47) {
      mat.map     = textures.home
      mat.opacity = 0
    } else if (p < 0.52) {
      mat.map     = textures.home
      mat.opacity = (p - 0.47) / 0.05
    } else if (p < 0.71) {
      mat.map     = textures.home
      mat.opacity = 1

    // ── Scene 6 entry: cross-fade to call screen ─────────────────
    } else if (p < 0.75) {
      mat.map     = textures.call
      mat.opacity = Math.min(1, (p - 0.71) / 0.03)

    // ── Scene 6: call in progress ────────────────────────────────
    } else if (p < 0.83) {
      mat.map     = textures.call
      mat.opacity = 1

    // ── Scene 6→7: screen goes dark — intentional pause ──────────
    } else if (p < 0.86) {
      mat.map     = textures.call
      mat.opacity = Math.max(0, 1 - (p - 0.83) / 0.02)

    // ── Scene 7: discovery screen ────────────────────────────────
    } else if (p < 0.89) {
      mat.map     = textures.discovery
      mat.opacity = (p - 0.86) / 0.03

    } else {
      mat.map     = textures.discovery
      mat.opacity = 1
    }

    mat.needsUpdate = true

    // Notification dot (Scene 4 end)
    if (dotRef.current) {
      const dm = dotRef.current.material as THREE.MeshBasicMaterial
      if (p > 0.53 && p < 0.57) {
        const pulse = Math.sin(((p - 0.53) / 0.04) * Math.PI)
        dm.opacity = 0.25 + pulse * 0.75
        dotRef.current.scale.setScalar(1 + pulse * 0.6)
      } else {
        dm.opacity = 0
      }
    }
  })

  return (
    <>
      <mesh position={[0, 0, D / 2 + 0.001]}>
        <planeGeometry args={[W_SCR, H_SCR]} />
        <meshBasicMaterial
          ref={screenMatRef}
          transparent
          opacity={0}
        />
      </mesh>

      <mesh ref={dotRef} position={[0, -(H_SCR / 2 - 0.022), D / 2 + 0.002]}>
        <circleGeometry args={[0.006, 24]} />
        <meshBasicMaterial color="#C4922A" transparent opacity={0} />
      </mesh>
    </>
  )
}
