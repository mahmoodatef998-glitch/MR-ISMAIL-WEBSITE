'use client'

import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import { RoundedBox } from '@react-three/drei'
import * as THREE from 'three'
import { mapRange, lerp, easeOutExpo } from '../utils'

// ─── Phone Dimensions ────────────────────────────────────────────────────────
const W  = 0.77
const H  = 1.59
const D  = 0.078
const CR = 0.056

// ─── Helpers ─────────────────────────────────────────────────────────────────

// Stagger offsets — tightened to fit the sharper 0.48–0.60 explosion window.
// Front layers lead, internals follow, rear glass is last.
// Max stagger 0.024 keeps the whole cascade within the window.
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
  // Matches unified phase map:
  //   0.48–0.60  explosion (easeOutExpo: snaps immediately, decelerates)
  //   0.60–0.73  hold while camera sweeps
  //   0.73–0.87  reassembly (easeInExpo: slow start then rushes home)
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

function buildScreenTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas')
  canvas.width = 512; canvas.height = 1024
  const ctx = canvas.getContext('2d')!

  ctx.fillStyle = '#000008'; ctx.fillRect(0, 0, 512, 1024)

  const neb = ctx.createRadialGradient(256, 512, 0, 256, 512, 280)
  neb.addColorStop(0, 'rgba(80, 100, 255, 0.45)')
  neb.addColorStop(0.5, 'rgba(40, 60, 200, 0.2)')
  neb.addColorStop(1, 'transparent')
  ctx.fillStyle = neb; ctx.fillRect(0, 0, 512, 1024)

  const top = ctx.createRadialGradient(256, 100, 0, 256, 100, 150)
  top.addColorStop(0, 'rgba(200, 169, 110, 0.3)')
  top.addColorStop(1, 'transparent')
  ctx.fillStyle = top; ctx.fillRect(0, 0, 512, 1024)

  ctx.strokeStyle = 'rgba(200, 169, 110, 0.12)'; ctx.lineWidth = 0.5
  for (let y = 0; y < 1024; y += 36) {
    ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(512, y); ctx.stroke()
  }
  for (let x = 0; x < 512; x += 36) {
    ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, 1024); ctx.stroke()
  }

  ctx.strokeStyle = 'rgba(200, 169, 110, 0.55)'; ctx.lineWidth = 1.2
  ctx.beginPath(); ctx.moveTo(80, 190); ctx.lineTo(432, 190); ctx.stroke()
  ctx.beginPath(); ctx.moveTo(80, 834); ctx.lineTo(432, 834); ctx.stroke()

  const cc = ctx.createRadialGradient(256, 512, 0, 256, 512, 100)
  cc.addColorStop(0, 'rgba(200, 169, 110, 0.45)')
  cc.addColorStop(1, 'transparent')
  ctx.fillStyle = cc; ctx.fillRect(0, 0, 512, 1024)

  ctx.fillStyle = 'rgba(200, 169, 110, 0.7)'
  for (let i = 0; i < 12; i++) {
    const x = 80 + (i % 6) * 72; const y = 350 + Math.floor(i / 6) * 60
    ctx.beginPath(); ctx.arc(x, y, 2, 0, Math.PI * 2); ctx.fill()
  }

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

  // Materials: pre-init transparent so we never toggle it per-frame.
  // clearcoat adds the double-layer sheen seen on real titanium phones and ceramic glass.
  const titanium = useMemo(() => new THREE.MeshPhysicalMaterial({
    color: '#1e1e2e',
    metalness: 0.96,
    roughness: 0.035,
    envMapIntensity: 4.0,
    clearcoat: 0.14,          // subtle titanium sheen
    clearcoatRoughness: 0.08,
    transparent: true,
    opacity: 1,
  }), [])

  const frontGlassMat = useMemo(() => new THREE.MeshPhysicalMaterial({
    color: '#ffffff',
    transmission: 0.94,
    roughness: 0,
    metalness: 0.06,
    ior: 1.52,
    thickness: 0.5,
    transparent: true,
    opacity: 0.22,
    envMapIntensity: 4.0,
    clearcoat: 1.0,           // ceramic shield glass: perfect coating
    clearcoatRoughness: 0.0,  // mirror-smooth
  }), [])

  const rearGlassMat = useMemo(() => new THREE.MeshPhysicalMaterial({
    color: '#070718',
    metalness: 0.20,
    roughness: 0.022,
    transparent: true,
    opacity: 1,
    envMapIntensity: 4.0,
    clearcoat: 0.40,          // rear ceramic/glass has strong coating
    clearcoatRoughness: 0.02,
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

  const POS = useMemo(() => ({
    // Rest positions (assembled) → Exploded positions
    // Exploded: heavier Z-depth spread makes the explosion feel truly 3D.
    // Front layers fly toward camera (+Z), rear layers recede (-Z),
    // internals scatter laterally with Z variation for parallax.
    frontGlass: { r: new THREE.Vector3(0, 0, D/2+.002),       e: new THREE.Vector3(0,      0,     4.2)  },
    screen:     { r: new THREE.Vector3(0, 0, D/2-.006),       e: new THREE.Vector3(0.15,   0.1,   3.2)  },
    rearGlass:  { r: new THREE.Vector3(0, 0, -D/2-.002),      e: new THREE.Vector3(0,      0,    -4.2)  },
    camModule:  { r: new THREE.Vector3(-.16, .61, -D/2-.014), e: new THREE.Vector3(-2.4,   3.8,   2.0)  },
    battery:    { r: new THREE.Vector3(.04, -.30, 0),          e: new THREE.Vector3( 3.6,  -1.2,   1.0)  },
    mb:         { r: new THREE.Vector3(0, .30, 0),             e: new THREE.Vector3(-3.6,   1.2,   0.8)  },
    btnPower:   { r: new THREE.Vector3(W/2+.006, .15, 0),     e: new THREE.Vector3( 4.6,   0.15,  0.2)  },
    btnVolUp:   { r: new THREE.Vector3(-W/2-.006, .28, 0),    e: new THREE.Vector3(-4.6,   0.28,  0.2)  },
    btnVolDown: { r: new THREE.Vector3(-W/2-.006, .05, 0),    e: new THREE.Vector3(-4.6,   0.05,  0.2)  },
    btnSilent:  { r: new THREE.Vector3(-W/2-.006, .50, 0),    e: new THREE.Vector3(-4.6,   0.50,  0.2)  },
    island:     { r: new THREE.Vector3(0, H/2-.11, D/2+.004), e: new THREE.Vector3(0,      4.6,   2.4)  },
  }), [])

  useFrame(({ clock }) => {
    const p  = progressRef.current
    const t  = clock.elapsedTime

    // Lead explode factor (for parts that don't drift rotate)
    const ex = getExplodeStaggered(p, STAGGER.frontGlass)

    if (!rootRef.current) return

    // Gentle sway — fades during explosion and near the screen close-up
    const phase5Damp = 1 - easeOutExpo(mapRange(p, 0.87, 1.0, 0, 1))
    const swayScale  = (1 - ex) * phase5Damp
    rootRef.current.rotation.y = Math.sin(t * 0.18) * 0.08 * swayScale
    rootRef.current.position.y = Math.sin(t * 0.48) * 0.042 * swayScale

    // Helper: lerp a part to its exploded/rest position using its own stagger
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

    // Micro floating — only during the hold phase (parts fully exploded, 0.60–0.73).
    // Each part oscillates at a unique irrational frequency: they never move in sync,
    // creating the sensation of zero-gravity rather than a synchronized rig.
    // Amplitude: ±0.010–0.014 units — imperceptible as animation, felt as life.
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
      if (islandRef.current) {
        islandRef.current.position.y += Math.sin(t * 0.61 + 2.1) * 0.014 * floatAmt
      }
      if (btnPowerRef.current)   btnPowerRef.current.position.y   += Math.sin(t * 0.64 + 2.1) * 0.013 * floatAmt
      if (btnVolUpRef.current)   btnVolUpRef.current.position.y   += Math.sin(t * 0.58 + 0.9) * 0.011 * floatAmt
      if (btnVolDownRef.current) btnVolDownRef.current.position.y += Math.sin(t * 0.72 + 1.7) * 0.012 * floatAmt
      if (btnSilentRef.current)  btnSilentRef.current.position.y  += Math.sin(t * 0.55 + 3.1) * 0.010 * floatAmt
    }

    // Screen glow — pulses with a living breath once fully revealed
    // √3 frequency: irrational, never feels mechanical
    const sg    = getScreenGlow(p)
    const pulse = sg > 0.4 ? Math.sin(t * 1.732) * 0.10 * ((sg - 0.4) / 0.6) : 0
    screenMat.emissiveIntensity = lerp(.35, 5.2, sg) * (1 + pulse)
    if (screenLightRef.current) {
      screenLightRef.current.intensity = sg * 18 * (1 + pulse * 0.5)
      screenLightRef.current.color.setHSL(lerp(0.62, 0.60, sg), 1, 0.6)
    }

    // Screen reveal focus: non-screen elements subtly recede so the screen dominates.
    // Perceptually this shifts attention without any visible "fade" — just focus.
    const revealFocus = easeOutExpo(mapRange(p, 0.87, 0.94, 0, 1))
    const focusDim    = lerp(1.0, 0.78, revealFocus)

    const op = getPhoneOpacity(p)
    if (op < 0.999 || revealFocus > 0) {
      titanium.opacity      = op * focusDim
      frontGlassMat.opacity = Math.min(0.22, 0.22 * op * focusDim)
      rearGlassMat.opacity  = op * focusDim
      screenMat.opacity     = op                 // screen always at full opacity
    } else {
      titanium.opacity      = 1
      frontGlassMat.opacity = 0.22
      rearGlassMat.opacity  = 1
      screenMat.opacity     = 1
    }
  })

  const chipPos: [number, number][] = [
    [-0.16, 0.14], [0.10, 0.13], [-0.16, -0.10], [0.06, -0.16], [0.18, -0.03],
  ]

  return (
    <group ref={rootRef}>
      <pointLight ref={screenLightRef} color="#4466ff" intensity={0} distance={4} position={[0, 0, .3]} />

      {/* FRAME */}
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
        <LensUnit pos={[-.09, .08, .017]} outer={.058} inner={.044} />
        <LensUnit pos={[ .08, .08, .017]} outer={.055} inner={.042} />
        <LensUnit pos={[-.005,-.077,.017]} outer={.050} inner={.037} />
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
      <mesh>
        <ringGeometry args={[inner, outer, 48]} />
        <meshPhysicalMaterial color="#3a3a4c" metalness={.92} roughness={.05} />
      </mesh>
      <mesh position={[0, 0, .001]}>
        <circleGeometry args={[inner * .98, 48]} />
        <meshPhysicalMaterial
          color="#020215" transmission={.12} roughness={0} ior={1.72}
          thickness={.08} envMapIntensity={5}
        />
      </mesh>
      <mesh position={[inner * -.3, inner * .3, .002]}>
        <circleGeometry args={[inner * .25, 16]} />
        <meshBasicMaterial color="#5577cc" transparent opacity={.18} />
      </mesh>
    </group>
  )
}
