'use client'

import { useRef, useEffect, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import { RoundedBox } from '@react-three/drei'
import * as THREE from 'three'
import { mapRange, lerp, easeInOutCubic, easeOutExpo } from '../utils'

// ─── Phone Dimensions ────────────────────────────────────────────────────────
const W  = 0.77   // width
const H  = 1.59   // height
const D  = 0.078  // thickness
const CR = 0.056  // corner radius

// ─── Helpers ─────────────────────────────────────────────────────────────────

function getExplode(p: number) {
  if (p < 0.20) return 0
  if (p < 0.50) return easeInOutCubic(mapRange(p, 0.20, 0.50, 0, 1))
  if (p < 0.72) return 1
  if (p < 0.90) return 1 - easeInOutCubic(mapRange(p, 0.72, 0.90, 0, 1))
  return 0
}

function getScreenGlow(p: number) {
  return easeOutExpo(mapRange(p, 0.88, 1.0, 0, 1))
}

function getPhoneOpacity(p: number) {
  if (p < 0.92) return 1
  return 1 - mapRange(p, 0.92, 0.98, 0, 1)
}

// Build screen canvas texture once
function buildScreenTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas')
  canvas.width = 512; canvas.height = 1024
  const ctx = canvas.getContext('2d')!

  // Deep space OLED background
  ctx.fillStyle = '#000008'; ctx.fillRect(0, 0, 512, 1024)

  // Central nebula glow
  const neb = ctx.createRadialGradient(256, 512, 0, 256, 512, 280)
  neb.addColorStop(0, 'rgba(80, 100, 255, 0.45)')
  neb.addColorStop(0.5, 'rgba(40, 60, 200, 0.2)')
  neb.addColorStop(1, 'transparent')
  ctx.fillStyle = neb; ctx.fillRect(0, 0, 512, 1024)

  // Top glow (camera area)
  const top = ctx.createRadialGradient(256, 100, 0, 256, 100, 150)
  top.addColorStop(0, 'rgba(200, 169, 110, 0.3)')
  top.addColorStop(1, 'transparent')
  ctx.fillStyle = top; ctx.fillRect(0, 0, 512, 1024)

  // Subtle grid
  ctx.strokeStyle = 'rgba(200, 169, 110, 0.12)'; ctx.lineWidth = 0.5
  for (let y = 0; y < 1024; y += 36) {
    ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(512, y); ctx.stroke()
  }
  for (let x = 0; x < 512; x += 36) {
    ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, 1024); ctx.stroke()
  }

  // Gold accent bars
  ctx.strokeStyle = 'rgba(200, 169, 110, 0.55)'; ctx.lineWidth = 1.2
  ctx.beginPath(); ctx.moveTo(80, 190); ctx.lineTo(432, 190); ctx.stroke()
  ctx.beginPath(); ctx.moveTo(80, 834); ctx.lineTo(432, 834); ctx.stroke()

  // Center circle
  const cc = ctx.createRadialGradient(256, 512, 0, 256, 512, 100)
  cc.addColorStop(0, 'rgba(200, 169, 110, 0.45)')
  cc.addColorStop(1, 'transparent')
  ctx.fillStyle = cc; ctx.fillRect(0, 0, 512, 1024)

  // Small dots / UI hits
  ctx.fillStyle = 'rgba(200, 169, 110, 0.7)'
  for (let i = 0; i < 12; i++) {
    const x = 80 + (i % 6) * 72; const y = 350 + Math.floor(i / 6) * 60
    ctx.beginPath(); ctx.arc(x, y, 2, 0, Math.PI * 2); ctx.fill()
  }

  return new THREE.CanvasTexture(canvas)
}

// ─── Component ───────────────────────────────────────────────────────────────
interface Props { scrollProgress: number }

export function PhoneModel({ scrollProgress }: Props) {
  const rootRef   = useRef<THREE.Group>(null)
  const progressRef = useRef(scrollProgress)
  useEffect(() => { progressRef.current = scrollProgress }, [scrollProgress])

  // Part refs
  const frontGlassRef    = useRef<THREE.Mesh>(null)
  const screenRef        = useRef<THREE.Mesh>(null)
  const rearGlassRef     = useRef<THREE.Mesh>(null)
  const camModuleRef     = useRef<THREE.Group>(null)
  const batteryRef       = useRef<THREE.Group>(null)
  const mbRef            = useRef<THREE.Group>(null)
  const btnPowerRef      = useRef<THREE.Mesh>(null)
  const btnVolUpRef      = useRef<THREE.Mesh>(null)
  const btnVolDownRef    = useRef<THREE.Mesh>(null)
  const btnSilentRef     = useRef<THREE.Mesh>(null)
  const islandRef        = useRef<THREE.Group>(null)
  const screenLightRef   = useRef<THREE.PointLight>(null)

  // Materials (stable references)
  const titanium = useMemo(() => new THREE.MeshPhysicalMaterial({
    color: '#232332', metalness: 0.96, roughness: 0.04, envMapIntensity: 3,
  }), [])

  const frontGlassMat = useMemo(() => new THREE.MeshPhysicalMaterial({
    color: '#ffffff', transmission: 0.94, roughness: 0, metalness: 0.08,
    ior: 1.5, thickness: 0.5, transparent: true, opacity: 0.22, envMapIntensity: 2,
  }), [])

  const rearGlassMat = useMemo(() => new THREE.MeshPhysicalMaterial({
    color: '#0a0a18', metalness: 0.18, roughness: 0.035,
    transparent: true, opacity: 1, envMapIntensity: 3,
  }), [])

  const screenMat = useMemo(() => {
    const tex = buildScreenTexture()
    return new THREE.MeshStandardMaterial({
      map: tex, emissive: new THREE.Color('#1a33cc'),
      emissiveMap: tex, emissiveIntensity: 0.35, roughness: 0, metalness: 0,
    })
  }, [])

  // Rest & exploded positions
  const POS = useMemo(() => ({
    frontGlass: { r: new THREE.Vector3(0, 0, D/2+.002),       e: new THREE.Vector3(0, 0, 2.8) },
    screen:     { r: new THREE.Vector3(0, 0, D/2-.006),       e: new THREE.Vector3(0, 0, 2.0) },
    rearGlass:  { r: new THREE.Vector3(0, 0, -D/2-.002),      e: new THREE.Vector3(0, 0, -2.8) },
    camModule:  { r: new THREE.Vector3(-.16, .61, -D/2-.014), e: new THREE.Vector3(-1.6, 2.6, 1.0) },
    battery:    { r: new THREE.Vector3(.04, -.30, 0),          e: new THREE.Vector3(2.6, -.5, .4) },
    mb:         { r: new THREE.Vector3(0, .30, 0),             e: new THREE.Vector3(-2.6, .5, .4) },
    btnPower:   { r: new THREE.Vector3(W/2+.006, .15, 0),     e: new THREE.Vector3(3.4, .15, 0) },
    btnVolUp:   { r: new THREE.Vector3(-W/2-.006, .28, 0),    e: new THREE.Vector3(-3.4, .28, 0) },
    btnVolDown: { r: new THREE.Vector3(-W/2-.006, .05, 0),    e: new THREE.Vector3(-3.4, .05, 0) },
    btnSilent:  { r: new THREE.Vector3(-W/2-.006, .50, 0),    e: new THREE.Vector3(-3.4, .50, 0) },
    island:     { r: new THREE.Vector3(0, H/2-.11, D/2+.004), e: new THREE.Vector3(0, 3.2, 1.4) },
  }), [])

  useFrame(({ clock }) => {
    const p   = progressRef.current
    const t   = clock.elapsedTime
    const ex  = getExplode(p)
    const sg  = getScreenGlow(p)
    const op  = getPhoneOpacity(p)

    if (!rootRef.current) return

    // Root: slow orbit in phase 1, float throughout assembled phases
    const orbitStrength = 1 - Math.min(1, p / 0.18)
    rootRef.current.rotation.y = t * 0.28 * orbitStrength + Math.sin(t * 0.18) * 0.12 * (1 - ex)
    rootRef.current.position.y = Math.sin(t * 0.48) * 0.042 * (1 - ex)

    // Lerp parts to exploded/rest positions
    const lp = (
      r: React.RefObject<THREE.Object3D | null>,
      data: { r: THREE.Vector3; e: THREE.Vector3 },
      exp = ex,
    ) => r.current?.position.lerpVectors(data.r, data.e, exp)

    lp(frontGlassRef, POS.frontGlass)
    lp(screenRef, POS.screen)
    lp(rearGlassRef, POS.rearGlass)
    lp(camModuleRef as React.RefObject<THREE.Object3D | null>, POS.camModule)
    lp(batteryRef as React.RefObject<THREE.Object3D | null>, POS.battery)
    lp(mbRef as React.RefObject<THREE.Object3D | null>, POS.mb)
    lp(btnPowerRef, POS.btnPower)
    lp(btnVolUpRef, POS.btnVolUp)
    lp(btnVolDownRef, POS.btnVolDown)
    lp(btnSilentRef, POS.btnSilent)
    lp(islandRef as React.RefObject<THREE.Object3D | null>, POS.island)

    // Subtle drift rotation when exploded
    if (camModuleRef.current) {
      camModuleRef.current.rotation.y = ex * Math.sin(t * .45) * .35
      camModuleRef.current.rotation.x = ex * Math.cos(t * .38) * .2
    }
    if (batteryRef.current) {
      batteryRef.current.rotation.z = ex * Math.sin(t * .37) * .18
      batteryRef.current.rotation.x = ex * Math.cos(t * .30) * .12
    }
    if (mbRef.current) {
      mbRef.current.rotation.y = ex * Math.sin(t * .33 + 1) * .32
      mbRef.current.rotation.z = ex * Math.cos(t * .42) * .1
    }

    // Screen glow + light
    screenMat.emissiveIntensity = lerp(.35, 4.5, sg)
    if (screenLightRef.current) {
      screenLightRef.current.intensity = sg * 12
      screenLightRef.current.color.setHSL(lerp(0.62, 0.60, sg), 1, 0.6)
    }

    // Fade phone out when camera enters screen (phase 5)
    const allMats = [titanium, frontGlassMat, rearGlassMat, screenMat] as THREE.Material[]
    allMats.forEach(m => {
      if (!m.transparent) m.transparent = true
      m.opacity = op
    })
  })

  // Chip positions (deterministic)
  const chipPos: [number, number][] = [[-0.16, 0.14],[0.10, 0.13],[-0.16,-0.10],[0.06,-0.16],[0.18,-0.03]]

  return (
    <group ref={rootRef}>
      {/* Screen glow point light */}
      <pointLight ref={screenLightRef} color="#4466ff" intensity={0} distance={4} position={[0, 0, .3]} />

      {/* FRAME (stays at origin — reference skeleton) */}
      <RoundedBox args={[W, H, D]} radius={CR} smoothness={8} castShadow receiveShadow>
        <primitive object={titanium} />
      </RoundedBox>

      {/* OLED SCREEN */}
      <mesh ref={screenRef} castShadow>
        <planeGeometry args={[W * .87, H * .88]} />
        <primitive object={screenMat} />
      </mesh>

      {/* FRONT GLASS */}
      <mesh ref={frontGlassRef}>
        <planeGeometry args={[W * .994, H * .994]} />
        <primitive object={frontGlassMat} />
      </mesh>

      {/* DYNAMIC ISLAND */}
      <group ref={islandRef}>
        <RoundedBox args={[.24, .044, .007]} radius={.018} smoothness={4}>
          <meshStandardMaterial color="#000003" roughness={0} metalness={0} />
        </RoundedBox>
      </group>

      {/* CAMERA MODULE */}
      <group ref={camModuleRef}>
        <RoundedBox args={[.34, .34, .030]} radius={.068} smoothness={8}>
          <meshPhysicalMaterial color="#18182a" metalness={.92} roughness={.07} envMapIntensity={2} />
        </RoundedBox>
        {/* Lens 1 — main wide */}
        <LensUnit pos={[-.09, .08, .017]} outer={.058} inner={.044} />
        {/* Lens 2 — ultra wide */}
        <LensUnit pos={[ .08, .08, .017]} outer={.055} inner={.042} />
        {/* Lens 3 — tele */}
        <LensUnit pos={[-.005,-.077,.017]} outer={.050} inner={.037} />
        {/* Flash */}
        <mesh position={[.105,-.055,.016]}>
          <circleGeometry args={[.014, 16]} />
          <meshStandardMaterial color="#fffbf0" emissive="#ffe8a0" emissiveIntensity={.25} />
        </mesh>
      </group>

      {/* BATTERY */}
      <group ref={batteryRef}>
        <mesh>
          <boxGeometry args={[.55, .90, .013]} />
          <meshStandardMaterial color="#1a3c5c" metalness={.3} roughness={.7} />
        </mesh>
        {[-0.13, 0.13].map((x, i) => (
          <mesh key={i} position={[x, 0, .009]}>
            <boxGeometry args={[.19, .83, .007]} />
            <meshStandardMaterial color="#2a4e7a" emissive="#001144" emissiveIntensity={.18} />
          </mesh>
        ))}
      </group>

      {/* MOTHERBOARD */}
      <group ref={mbRef}>
        <mesh>
          <boxGeometry args={[.56, .66, .011]} />
          <meshStandardMaterial color="#0b2b0b" roughness={.88} />
        </mesh>
        {chipPos.map(([cx, cy], i) => (
          <mesh key={i} position={[cx, cy, .009]}>
            <boxGeometry args={[.10, .085, .006]} />
            <meshStandardMaterial color="#11112a" metalness={.7} roughness={.2} />
          </mesh>
        ))}
        {/* SoC */}
        <mesh position={[0, .22, .011]}>
          <boxGeometry args={[.22, .22, .010]} />
          <meshStandardMaterial color="#1a1a3e" metalness={.85} roughness={.1} emissive="#0000bb" emissiveIntensity={.08} />
        </mesh>
      </group>

      {/* SIDE BUTTONS */}
      <mesh ref={btnPowerRef}>
        <boxGeometry args={[.013, .16, .026]} />
        <primitive object={titanium} />
      </mesh>
      <mesh ref={btnVolUpRef}>
        <boxGeometry args={[.013, .13, .026]} />
        <primitive object={titanium} />
      </mesh>
      <mesh ref={btnVolDownRef}>
        <boxGeometry args={[.013, .13, .026]} />
        <primitive object={titanium} />
      </mesh>
      <mesh ref={btnSilentRef}>
        <boxGeometry args={[.013, .09, .022]} />
        <primitive object={titanium} />
      </mesh>

      {/* REAR GLASS */}
      <mesh ref={rearGlassRef} rotation={[0, Math.PI, 0]}>
        <planeGeometry args={[W * .994, H * .994]} />
        <primitive object={rearGlassMat} />
      </mesh>
    </group>
  )
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function LensUnit({ pos, outer, inner }: {
  pos: [number, number, number]; outer: number; inner: number
}) {
  return (
    <group position={pos}>
      {/* Outer ring */}
      <mesh>
        <ringGeometry args={[inner, outer, 48]} />
        <meshPhysicalMaterial color="#3a3a4c" metalness={.92} roughness={.05} />
      </mesh>
      {/* Lens glass */}
      <mesh position={[0, 0, .001]}>
        <circleGeometry args={[inner * .98, 48]} />
        <meshPhysicalMaterial
          color="#020215" transmission={.12} roughness={0} ior={1.72}
          thickness={.08} envMapIntensity={5}
        />
      </mesh>
      {/* Specular hot-spot */}
      <mesh position={[inner * -.3, inner * .3, .002]}>
        <circleGeometry args={[inner * .25, 16]} />
        <meshBasicMaterial color="#5577cc" transparent opacity={.18} />
      </mesh>
    </group>
  )
}
