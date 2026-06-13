'use client'

import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import { RoundedBox } from '@react-three/drei'
import * as THREE from 'three'
import { mapRange, lerp, easeOutExpo } from '../utils'

// ─── iPhone 17 Pro Max proportions ───────────────────────────────────────────
const W  = 0.77
const H  = 1.59
const D  = 0.078
const CR = 0.056

// ─── Helpers ─────────────────────────────────────────────────────────────────

const STAGGER = {
  frontGlass: 0,
  island:     0.004,
  screen:     0.008,
  camModule:  0.012,
  mb:         0.016,
  battery:    0.018,
  btnPower:   0.020,
  btnVolUp:   0.021,
  btnVolDown: 0.022,
  btnSilent:  0.023,
  rearGlass:  0.024,
} as const

function getExplode(p: number): number {
  if (p < 0.48) return 0
  if (p < 0.60) return easeOutExpo(mapRange(p, 0.48, 0.60, 0, 1))
  if (p < 0.73) return 1
  if (p < 0.87) return 1 - (Math.pow(2, 10 * mapRange(p, 0.73, 0.87, 0, 1) - 10))
  return 0
}

function getExplodeStaggered(p: number, stagger: number): number {
  return getExplode(Math.max(0, p - stagger))
}

function getScreenGlow(p: number): number {
  return easeOutExpo(mapRange(p, 0.87, 1.0, 0, 1))
}

function getPhoneOpacity(p: number): number {
  if (p < 0.91) return 1
  return 1 - mapRange(p, 0.91, 0.98, 0, 1)
}

function rr(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
  ctx.beginPath()
  ctx.moveTo(x + r, y)
  ctx.arcTo(x + w, y, x + w, y + h, r)
  ctx.arcTo(x + w, y + h, x, y + h, r)
  ctx.arcTo(x, y + h, x, y, r)
  ctx.arcTo(x, y, x + w, y, r)
  ctx.closePath()
}

function buildScreenTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas')
  canvas.width = 512; canvas.height = 1024
  const ctx = canvas.getContext('2d')!

  const bg = ctx.createLinearGradient(0, 0, 0, 1024)
  bg.addColorStop(0,   '#060820')
  bg.addColorStop(0.5, '#050718')
  bg.addColorStop(1,   '#020310')
  ctx.fillStyle = bg; ctx.fillRect(0, 0, 512, 1024)

  const neb = ctx.createRadialGradient(256, 530, 0, 256, 530, 310)
  neb.addColorStop(0,   'rgba(50, 80, 240, 0.55)')
  neb.addColorStop(0.4, 'rgba(28, 50, 180, 0.28)')
  neb.addColorStop(1,   'transparent')
  ctx.fillStyle = neb; ctx.fillRect(0, 0, 512, 1024)

  const topGlow = ctx.createRadialGradient(256, 60, 0, 256, 60, 180)
  topGlow.addColorStop(0, 'rgba(200, 169, 110, 0.20)')
  topGlow.addColorStop(1, 'transparent')
  ctx.fillStyle = topGlow; ctx.fillRect(0, 0, 512, 1024)

  ctx.fillStyle = 'rgba(255,255,255,0.06)'; ctx.fillRect(0, 0, 512, 54)
  ctx.fillStyle = 'rgba(255,255,255,0.88)'
  ctx.font = 'bold 86px -apple-system, "SF Pro Display", Arial, sans-serif'
  ctx.textAlign = 'center'
  ctx.fillText('9:41', 256, 258)

  ctx.fillStyle = 'rgba(255,255,255,0.42)'
  ctx.font = '28px -apple-system, "SF Pro Display", Arial, sans-serif'
  ctx.fillText('Friday, 13 June', 256, 306)

  rr(ctx, 44, 340, 424, 145, 22)
  ctx.fillStyle = 'rgba(12, 18, 55, 0.55)'; ctx.fill()
  rr(ctx, 44, 340, 424, 145, 22)
  ctx.strokeStyle = 'rgba(200, 169, 110, 0.18)'; ctx.lineWidth = 1; ctx.stroke()
  ctx.fillStyle = 'rgba(255,255,255,0.22)'
  rr(ctx, 72, 364, 200, 14, 7); ctx.fill()
  rr(ctx, 72, 390, 140, 10, 5); ctx.fill()

  const iconColors = [
    'rgba(55,110,255,0.42)', 'rgba(200,169,110,0.38)', 'rgba(40,190,170,0.36)', 'rgba(170,55,255,0.38)',
    'rgba(50,200,90,0.34)',  'rgba(255,100,55,0.34)',  'rgba(255,55,110,0.34)', 'rgba(55,180,255,0.34)',
  ]
  const iconW = 88, iconH = 88, iconR = 22, gapX = 18
  const x0 = (512 - (4 * iconW + 3 * gapX)) / 2
  for (let row = 0; row < 2; row++) {
    for (let col = 0; col < 4; col++) {
      const x = x0 + col * (iconW + gapX), y = 530 + row * (iconH + 18)
      rr(ctx, x, y, iconW, iconH, iconR)
      ctx.fillStyle = iconColors[row * 4 + col]; ctx.fill()
      const glow = ctx.createRadialGradient(x + iconW/2, y + 18, 0, x + iconW/2, y + 18, iconH * 0.7)
      glow.addColorStop(0, 'rgba(255,255,255,0.14)'); glow.addColorStop(1, 'transparent')
      rr(ctx, x, y, iconW, iconH, iconR); ctx.fillStyle = glow; ctx.fill()
    }
  }

  rr(ctx, 206, 966, 100, 6, 3)
  ctx.fillStyle = 'rgba(255,255,255,0.30)'; ctx.fill()

  return new THREE.CanvasTexture(canvas)
}

// ─── Component ───────────────────────────────────────────────────────────────
interface Props { progressRef: React.MutableRefObject<number> }

export function PhoneModel({ progressRef }: Props) {
  const rootRef        = useRef<THREE.Group>(null)
  const frontGlassRef  = useRef<THREE.Mesh>(null)
  const screenRef      = useRef<THREE.Mesh>(null)
  const rearGlassRef   = useRef<THREE.Mesh>(null)
  const camModuleRef   = useRef<THREE.Group>(null)
  const batteryRef     = useRef<THREE.Group>(null)
  const mbRef          = useRef<THREE.Group>(null)
  const btnPowerRef    = useRef<THREE.Mesh>(null)
  const btnVolUpRef    = useRef<THREE.Mesh>(null)
  const btnVolDownRef  = useRef<THREE.Mesh>(null)
  const btnSilentRef   = useRef<THREE.Mesh>(null)
  const islandRef      = useRef<THREE.Group>(null)
  const screenLightRef = useRef<THREE.PointLight>(null)

  // Space Black titanium frame
  const titanium = useMemo(() => new THREE.MeshPhysicalMaterial({
    color: '#1c1b26',
    metalness: 0.97,
    roughness: 0.028,
    envMapIntensity: 4.5,
    clearcoat: 0.18,
    clearcoatRoughness: 0.06,
    transparent: true,
    opacity: 1,
  }), [])

  // Ceramic Shield front glass — reflective, NOT transmission-based.
  // transmission:0.94 was the culprit showing ugly internals through the glass.
  // Now it's a real glass: high reflection, just enough opacity to read as glass.
  const frontGlassMat = useMemo(() => new THREE.MeshPhysicalMaterial({
    color: '#dce8ff',
    metalness: 0.04,
    roughness: 0,
    envMapIntensity: 9.0,
    clearcoat: 1.0,
    clearcoatRoughness: 0.0,
    transparent: true,
    opacity: 0.58,
  }), [])

  // Deep space black rear glass
  const rearGlassMat = useMemo(() => new THREE.MeshPhysicalMaterial({
    color: '#08081a',
    metalness: 0.14,
    roughness: 0.012,
    transparent: true,
    opacity: 1,
    envMapIntensity: 5.5,
    clearcoat: 0.55,
    clearcoatRoughness: 0.01,
  }), [])

  const screenMat = useMemo(() => {
    const tex = buildScreenTexture()
    return new THREE.MeshStandardMaterial({
      map: tex, emissive: new THREE.Color('#1a33cc'),
      emissiveMap: tex, emissiveIntensity: 0.35,
      roughness: 0, metalness: 0,
      transparent: true, opacity: 1,
    })
  }, [])

  // Battery — graphite slate. Starts at opacity 0: INVISIBLE when assembled.
  // Fades in only when the explosion begins, so you never see it through the glass.
  const batteryMat = useMemo(() => new THREE.MeshStandardMaterial({
    color: '#1e1e30',
    metalness: 0.52,
    roughness: 0.42,
    transparent: true,
    opacity: 0,
  }), [])

  // Motherboard — dark silicon PCB. Also starts invisible.
  const mbMat = useMemo(() => new THREE.MeshStandardMaterial({
    color: '#101820',
    metalness: 0.22,
    roughness: 0.78,
    transparent: true,
    opacity: 0,
  }), [])

  // Chips on MB — slightly lighter so they read against the board
  const chipMat = useMemo(() => new THREE.MeshStandardMaterial({
    color: '#1a1a35',
    metalness: 0.80,
    roughness: 0.14,
    transparent: true,
    opacity: 0,
  }), [])

  // ── HORIZONTAL explosion positions ────────────────────────────────────────
  // Parts spread primarily in the X-Y plane (lateral/horizontal), not Z-axis.
  // The viewer faces the phone front-on, so this creates a clear flat diagram
  // where every flying part is immediately readable.
  const POS = useMemo(() => ({
    // Front glass: peels up-forward (slight Z, dominant Y)
    frontGlass: { r: new THREE.Vector3(0, 0, D/2+.002),       e: new THREE.Vector3(0,      0.30,  0.65) },
    // Screen: minimal movement, stays near center
    screen:     { r: new THREE.Vector3(0, 0, D/2-.006),       e: new THREE.Vector3(0.06,   0.10,  0.38) },
    // Rear glass: peels down-backward (mirrors front glass)
    rearGlass:  { r: new THREE.Vector3(0, 0, -D/2-.002),      e: new THREE.Vector3(0,     -0.30, -0.65) },
    // Camera module: flies upper-left + slight back (where it lives on the real phone)
    camModule:  { r: new THREE.Vector3(-.16, .61, -D/2-.014), e: new THREE.Vector3(-1.8,   2.8,  -0.45) },
    // Battery: slides down-right (bottom half of phone)
    battery:    { r: new THREE.Vector3(.04, -.30, 0),          e: new THREE.Vector3( 1.6,  -2.4,  -0.25) },
    // Motherboard: flies up-left (upper half)
    mb:         { r: new THREE.Vector3(0, .30, 0),             e: new THREE.Vector3(-1.6,   2.2,  -0.25) },
    // Buttons: purely horizontal to their respective sides
    btnPower:   { r: new THREE.Vector3(W/2+.006, .15, 0),     e: new THREE.Vector3( 2.8,   0.15,  0.08) },
    btnVolUp:   { r: new THREE.Vector3(-W/2-.006, .28, 0),    e: new THREE.Vector3(-2.8,   0.28,  0.08) },
    btnVolDown: { r: new THREE.Vector3(-W/2-.006, .05, 0),    e: new THREE.Vector3(-2.8,   0.05,  0.08) },
    btnSilent:  { r: new THREE.Vector3(-W/2-.006, .50, 0),    e: new THREE.Vector3(-2.8,   0.50,  0.08) },
    // Dynamic Island: rises straight up + slight forward
    island:     { r: new THREE.Vector3(0, H/2-.11, D/2+.004), e: new THREE.Vector3(0,      3.0,   0.50) },
  }), [])

  useFrame(({ clock }) => {
    const p = progressRef.current
    const t = clock.elapsedTime

    const ex = getExplodeStaggered(p, STAGGER.frontGlass)
    if (!rootRef.current) return

    const phase5Damp = 1 - easeOutExpo(mapRange(p, 0.87, 1.0, 0, 1))
    const swayScale  = (1 - ex) * phase5Damp
    rootRef.current.rotation.y = Math.sin(t * 0.181) * 0.08 * swayScale
    rootRef.current.position.y = Math.sin(t * 0.479) * 0.042 * swayScale

    const lp = (
      r: React.RefObject<THREE.Object3D | null>,
      data: { r: THREE.Vector3; e: THREE.Vector3 },
      stagger: number,
    ) => {
      if (!r.current) return
      r.current.position.lerpVectors(data.r, data.e, getExplodeStaggered(p, stagger))
    }

    lp(frontGlassRef, POS.frontGlass, STAGGER.frontGlass)
    lp(screenRef,     POS.screen,     STAGGER.screen)
    lp(rearGlassRef,  POS.rearGlass,  STAGGER.rearGlass)
    lp(camModuleRef as React.RefObject<THREE.Object3D | null>,  POS.camModule,  STAGGER.camModule)
    lp(batteryRef   as React.RefObject<THREE.Object3D | null>,  POS.battery,    STAGGER.battery)
    lp(mbRef        as React.RefObject<THREE.Object3D | null>,  POS.mb,         STAGGER.mb)
    lp(btnPowerRef,   POS.btnPower,   STAGGER.btnPower)
    lp(btnVolUpRef,   POS.btnVolUp,   STAGGER.btnVolUp)
    lp(btnVolDownRef, POS.btnVolDown, STAGGER.btnVolDown)
    lp(btnSilentRef,  POS.btnSilent,  STAGGER.btnSilent)
    lp(islandRef    as React.RefObject<THREE.Object3D | null>,  POS.island,     STAGGER.island)

    // Drift rotation for floating internals
    if (camModuleRef.current) {
      camModuleRef.current.rotation.y = ex * Math.sin(t * .45) * .22
      camModuleRef.current.rotation.x = ex * Math.cos(t * .38) * .14
    }
    if (batteryRef.current) {
      batteryRef.current.rotation.z = ex * Math.sin(t * .37) * .12
      batteryRef.current.rotation.x = ex * Math.cos(t * .30) * .08
    }
    if (mbRef.current) {
      mbRef.current.rotation.y = ex * Math.sin(t * .33 + 1) * .18
      mbRef.current.rotation.z = ex * Math.cos(t * .42) * .08
    }

    // ── Internal visibility ───────────────────────────────────────────────────
    // Battery and MB are fully invisible when assembled. They fade in the moment
    // the explosion starts — you never see them through the front glass.
    const internalVis      = Math.min(1, Math.max(0, ex * 3.0))
    batteryMat.opacity     = internalVis
    mbMat.opacity          = internalVis
    chipMat.opacity        = internalVis * 0.85

    // ── Micro floating during hold ────────────────────────────────────────────
    const floatAmt = p > 0.60 ? ex * (1 - easeOutExpo(mapRange(p, 0.73, 0.80, 0, 1))) : 0
    if (floatAmt > 0.005) {
      if (frontGlassRef.current) {
        frontGlassRef.current.position.y += Math.sin(t * 0.53 + 0.3) * 0.011 * floatAmt
        frontGlassRef.current.position.x += Math.cos(t * 0.37)       * 0.007 * floatAmt
      }
      if (rearGlassRef.current) {
        rearGlassRef.current.position.y += Math.sin(t * 0.47 + 1.4) * 0.009 * floatAmt
        rearGlassRef.current.position.x += Math.cos(t * 0.41 + 0.8) * 0.006 * floatAmt
      }
      if (islandRef.current)     islandRef.current.position.y     += Math.sin(t * 0.61 + 2.1) * 0.014 * floatAmt
      if (btnPowerRef.current)   btnPowerRef.current.position.y   += Math.sin(t * 0.64 + 2.1) * 0.013 * floatAmt
      if (btnVolUpRef.current)   btnVolUpRef.current.position.y   += Math.sin(t * 0.58 + 0.9) * 0.011 * floatAmt
      if (btnVolDownRef.current) btnVolDownRef.current.position.y += Math.sin(t * 0.72 + 1.7) * 0.012 * floatAmt
      if (btnSilentRef.current)  btnSilentRef.current.position.y  += Math.sin(t * 0.55 + 3.1) * 0.010 * floatAmt
    }

    // ── Screen glow — √3 Hz living pulse ─────────────────────────────────────
    const sg    = getScreenGlow(p)
    const pulse = sg > 0.4 ? Math.sin(t * 1.732) * 0.10 * ((sg - 0.4) / 0.6) : 0
    screenMat.emissiveIntensity = lerp(.35, 5.2, sg) * (1 + pulse)
    if (screenLightRef.current) {
      screenLightRef.current.intensity = sg * 18 * (1 + pulse * 0.5)
      screenLightRef.current.color.setHSL(lerp(0.62, 0.60, sg), 1, 0.6)
    }

    // ── Screen reveal focus ───────────────────────────────────────────────────
    const revealFocus = easeOutExpo(mapRange(p, 0.87, 0.94, 0, 1))
    const focusDim    = lerp(1.0, 0.78, revealFocus)
    const op          = getPhoneOpacity(p)
    if (op < 0.999 || revealFocus > 0) {
      titanium.opacity      = op * focusDim
      frontGlassMat.opacity = Math.min(0.58, 0.58 * op * focusDim)
      rearGlassMat.opacity  = op * focusDim
      screenMat.opacity     = op
    } else {
      titanium.opacity      = 1
      frontGlassMat.opacity = 0.58
      rearGlassMat.opacity  = 1
      screenMat.opacity     = 1
    }
  })

  const chipPos: [number, number][] = [
    [-0.15, 0.13], [0.10, 0.12], [-0.15, -0.09], [0.06, -0.15], [0.17, -0.02],
  ]

  return (
    <group ref={rootRef}>
      <pointLight ref={screenLightRef} color="#4466ff" intensity={0} distance={4} position={[0, 0, .3]} />

      {/* ── TITANIUM FRAME ── */}
      <RoundedBox args={[W, H, D]} radius={CR} smoothness={8} castShadow receiveShadow>
        <primitive object={titanium} />
      </RoundedBox>

      {/* ── OLED SCREEN ── */}
      <mesh ref={screenRef} castShadow>
        <planeGeometry args={[W * .87, H * .88]} />
        <primitive object={screenMat} />
      </mesh>

      {/* ── CERAMIC SHIELD FRONT GLASS ── */}
      <mesh ref={frontGlassRef}>
        <planeGeometry args={[W * .994, H * .994]} />
        <primitive object={frontGlassMat} />
      </mesh>

      {/* ── DYNAMIC ISLAND ── */}
      <group ref={islandRef}>
        <RoundedBox args={[.26, .048, .006]} radius={.020} smoothness={4}>
          <meshStandardMaterial color="#000002" roughness={0.04} metalness={0.1} />
        </RoundedBox>
      </group>

      {/* ── CAMERA MODULE — iPhone 17 Pro Max triangular array ── */}
      <group ref={camModuleRef}>
        <RoundedBox args={[.36, .36, .032]} radius={.072} smoothness={8}>
          <meshPhysicalMaterial color="#131320" metalness={.95} roughness={.055} envMapIntensity={3} clearcoat={0.35} />
        </RoundedBox>
        {/* Triangular lens arrangement */}
        <LensUnit pos={[-.09,  .09, .018]} outer={.064} inner={.048} />
        <LensUnit pos={[ .09,  .09, .018]} outer={.060} inner={.044} />
        <LensUnit pos={[-.005,-.085,.018]} outer={.055} inner={.040} />
        {/* LiDAR */}
        <mesh position={[.105, -.060, .017]}>
          <circleGeometry args={[.015, 16]} />
          <meshStandardMaterial color="#e8e8f0" emissive="#dde0ff" emissiveIntensity={.20} roughness={0.15} />
        </mesh>
        {/* Flash */}
        <mesh position={[.105, .062, .017]}>
          <circleGeometry args={[.012, 16]} />
          <meshStandardMaterial color="#fffdf2" emissive="#fff0c0" emissiveIntensity={.18} />
        </mesh>
      </group>

      {/* ── BATTERY — graphite, invisible until explosion ── */}
      <group ref={batteryRef}>
        <mesh>
          <boxGeometry args={[.56, .88, .011]} />
          <primitive object={batteryMat} />
        </mesh>
        {/* Battery terminal top */}
        <mesh position={[0, .46, .008]}>
          <boxGeometry args={[.18, .018, .006]} />
          <primitive object={batteryMat} />
        </mesh>
      </group>

      {/* ── MOTHERBOARD — dark PCB, invisible until explosion ── */}
      <group ref={mbRef}>
        <mesh>
          <boxGeometry args={[.56, .64, .010]} />
          <primitive object={mbMat} />
        </mesh>
        {/* Chips — same opacity controlled via chipMat */}
        {chipPos.map(([cx, cy], i) => (
          <mesh key={i} position={[cx, cy, .009]}>
            <boxGeometry args={[.094, .082, .005]} />
            <primitive object={chipMat} />
          </mesh>
        ))}
        {/* Main SoC — A18 Pro chip, center-upper area */}
        <mesh position={[0, .20, .011]}>
          <boxGeometry args={[.21, .21, .008]} />
          <primitive object={chipMat} />
        </mesh>
      </group>

      {/* ── SIDE BUTTONS ── */}
      <mesh ref={btnPowerRef}>
        <boxGeometry args={[.012, .165, .028]} />
        <primitive object={titanium} />
      </mesh>
      <mesh ref={btnVolUpRef}>
        <boxGeometry args={[.012, .135, .028]} />
        <primitive object={titanium} />
      </mesh>
      <mesh ref={btnVolDownRef}>
        <boxGeometry args={[.012, .135, .028]} />
        <primitive object={titanium} />
      </mesh>
      <mesh ref={btnSilentRef}>
        <boxGeometry args={[.012, .092, .024]} />
        <primitive object={titanium} />
      </mesh>

      {/* ── REAR GLASS ── */}
      <mesh ref={rearGlassRef} rotation={[0, Math.PI, 0]}>
        <planeGeometry args={[W * .994, H * .994]} />
        <primitive object={rearGlassMat} />
      </mesh>
    </group>
  )
}

// ─── LensUnit ─────────────────────────────────────────────────────────────────

function LensUnit({ pos, outer, inner }: {
  pos: [number, number, number]; outer: number; inner: number
}) {
  return (
    <group position={pos}>
      <mesh>
        <ringGeometry args={[inner, outer, 64]} />
        <meshPhysicalMaterial color="#28283a" metalness={.96} roughness={.038} clearcoat={0.9} />
      </mesh>
      <mesh position={[0, 0, .001]}>
        <circleGeometry args={[inner * .98, 64]} />
        <meshPhysicalMaterial
          color="#010210" transmission={.15} roughness={0} ior={1.76}
          thickness={.10} envMapIntensity={6}
        />
      </mesh>
      <mesh position={[inner * -.28, inner * .28, .002]}>
        <circleGeometry args={[inner * .22, 16]} />
        <meshBasicMaterial color="#5566cc" transparent opacity={.15} />
      </mesh>
    </group>
  )
}
