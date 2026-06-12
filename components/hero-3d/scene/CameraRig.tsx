'use client'

import { useRef } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'
import { mapRange, lerp, easeInOutCubic, easeOutExpo, easeInOutSine } from '../utils'

// ── Unified phase map ─────────────────────────────────────────────────────────
// Matches PhoneModel, StudioLights, HeroOverlay exactly.
//   0.00 – 0.25  orbit          (first reveal)
//   0.25 – 0.44  dolly zoom in
//   0.44 – 0.48  anticipation hold  ← inhale before explosion
//   0.48 – 0.60  explosion pull-back
//   0.60 – 0.73  sweep across components
//   0.73 – 0.87  reassembly
//   0.87 – 1.00  screen reveal

interface Props { progressRef: React.MutableRefObject<number> }

export function CameraRig({ progressRef }: Props) {
  const targetPos   = useRef(new THREE.Vector3(0, 0, 6))
  const targetLook  = useRef(new THREE.Vector3(0, 0, 0))
  const currentLook = useRef(new THREE.Vector3(0, 0, 0))
  const targetFov   = useRef(50)
  const { camera }  = useThree()

  useFrame(({ clock }, delta) => {
    const p = progressRef.current
    const t = clock.elapsedTime

    let px = 0, py = 0, pz = 5.8
    let lx = 0, ly = 0, fov = 50

    // ── Coordinated breathe ──────────────────────────────────────────────────
    // Full life in quiet phases, suppressed during the explosion so chaos
    // dominates, then fades completely in the sacred screen reveal.
    const breatheAmt =
      p < 0.44 ? 1.0 :                                         // full life
      p < 0.48 ? lerp(1.0, 0.4, mapRange(p, 0.44, 0.48, 0, 1)) : // exhale into hold
      p < 0.73 ? 0.12 :                                        // barely alive during explosion
      p < 0.87 ? lerp(0.12, 0.85, mapRange(p, 0.73, 0.87, 0, 1)) : // breathe returns
      lerp(0.85, 0.0, easeOutExpo(mapRange(p, 0.87, 1.0, 0, 1)))    // silent for reveal

    const breathe = (Math.sin(t * 0.85) * 0.007 + Math.cos(t * 0.65) * 0.005) * breatheAmt

    // ── Phase 1 (0 – 0.25): Luxury turntable ────────────────────────────────
    // Narrow, stately orbit. Feels like a product on a high-end display stand.
    if (p < 0.25) {
      const pp    = easeInOutSine(mapRange(p, 0, 0.25, 0, 1))
      const angle = t * 0.13                          // slow, deliberate rotation
      const rad   = lerp(1.4, 0.4, pp)               // tightens as phase ends

      px  = Math.sin(angle) * rad
      py  = lerp(0.08, 0.28, pp) + Math.sin(t * 0.12) * 0.06 + breathe
      pz  = lerp(6.4, 5.8, pp) - Math.cos(angle * 0.55) * 0.18
      fov = 50

    // ── Phase 2 (0.25 – 0.44): Slow telephoto zoom ──────────────────────────
    // FOV narrows as camera closes in — telephoto compression makes the phone
    // look monumental. Orbit motion fades to dead-still by 0.44.
    } else if (p < 0.44) {
      const pp    = easeInOutCubic(mapRange(p, 0.25, 0.44, 0, 1))
      const angle = t * 0.13
      const fade  = 1 - pp                           // orbit dissolves as we zoom

      px  = Math.sin(angle) * 0.4 * fade
      py  = lerp(0.28, 0, pp) + breathe
      pz  = lerp(5.8, 3.4, pp)
      fov = lerp(50, 35, pp)                          // telephoto compression

    // ── Anticipation hold (0.44 – 0.48): Inhale before the explosion ────────
    // Camera barely moves. The scene grows still. GSAP scrub + breatheAmt=0.4
    // create a weighted silence. Lighting changes handle the tension.
    } else if (p < 0.48) {
      const pp = mapRange(p, 0.44, 0.48, 0, 1)

      px  = 0
      py  = lerp(0, 0.05, pp) + breathe              // tiny Y lift — the inhale
      pz  = lerp(3.4, 3.55, pp)                      // almost nothing
      fov = 35

    // ── Phase 3a (0.48 – 0.60): Explosive pull-back ─────────────────────────
    // Camera yanks hard left-back as phone shatters. easeOutExpo on the phase
    // progress means the camera SNAPS immediately then decelerates — matching
    // how the explosion easing works on the phone parts.
    } else if (p < 0.60) {
      const pp = easeOutExpo(mapRange(p, 0.48, 0.60, 0, 1))

      px  = lerp(0, -2.8, pp)
      py  = lerp(0.05, 1.4, pp) + breathe
      pz  = lerp(3.55, 8.5, pp)                      // massive pull-back
      lx  = lerp(0, -0.12, pp)
      ly  = lerp(0,  0.14, pp)
      fov = lerp(35, 60, pp)                          // blast open

    // ── Phase 3b (0.60 – 0.73): Slow sweep across components ────────────────
    // easeInOutSine: gentle start, gentle end — feels like a camera dolly on
    // rails slowly revealing each floating component.
    } else if (p < 0.73) {
      const pp = easeInOutSine(mapRange(p, 0.60, 0.73, 0, 1))

      px  = lerp(-2.8,  3.0, pp)
      py  = lerp( 1.4, -1.0, pp) + breathe
      pz  = lerp( 8.5,  8.2, pp)
      lx  = lerp(-0.12, 0.12, pp)
      ly  = lerp( 0.14,-0.10, pp)
      fov = lerp(60, 57, pp)

    // ── Phase 4 (0.73 – 0.87): Reassembly — camera comes home ───────────────
    // Reassembly and camera return happen together. easeInOutCubic so both
    // the parts and the camera have the same "slow start then rush" feel,
    // building to a synchronized arrival at the reassembled phone.
    } else if (p < 0.87) {
      const pp = easeInOutCubic(mapRange(p, 0.73, 0.87, 0, 1))

      px  = lerp(3.0, 0, pp)
      py  = lerp(-1.0, 0, pp) + breathe
      pz  = lerp(8.2, 4.2, pp)
      lx  = lerp(0.12, 0, pp)
      ly  = lerp(-0.10, 0, pp)
      fov = lerp(57, 42, pp)

    // ── Phase 5 (0.87 – 1.00): Screen reveal ────────────────────────────────
    // easeOutExpo: rushes toward the screen, then dramatically decelerates —
    // creating the sensation of "arriving" at the screen rather than crashing.
    // FOV narrows to 26° for intense telephoto compression at the end.
    } else {
      const pp = easeOutExpo(mapRange(p, 0.87, 1.0, 0, 1))

      px  = 0
      py  = lerp(0, 0.22, pp) + breathe
      pz  = lerp(4.2, 1.85, pp)
      ly  = lerp(0, 0.18, pp)
      fov = lerp(42, 26, pp)
    }

    targetPos.current.set(px, py, pz)
    targetLook.current.set(lx, ly, 0)
    targetFov.current = fov

    // Frame-rate independent damping
    const posSmooth = 1 - Math.pow(0.07, delta)
    const fovSmooth = 1 - Math.pow(0.18, delta)

    camera.position.lerp(targetPos.current, posSmooth)
    currentLook.current.lerp(targetLook.current, posSmooth)
    camera.lookAt(currentLook.current)

    const cam     = camera as THREE.PerspectiveCamera
    const nextFov = lerp(cam.fov, targetFov.current, fovSmooth)
    if (Math.abs(nextFov - cam.fov) > 0.01) {
      cam.fov = nextFov
      cam.updateProjectionMatrix()
    }
  })

  return null
}
