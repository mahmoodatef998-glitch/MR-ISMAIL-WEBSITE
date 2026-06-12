'use client'

import { useRef } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'
import { mapRange, lerp, easeInOutCubic, easeOutExpo, easeInOutSine } from '../utils'

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

    // Subtle organic breathe — gives the scene a living quality in every phase
    const breathe = Math.sin(t * 0.85) * 0.007 + Math.cos(t * 0.65) * 0.005

    if (p < 0.20) {
      // ── Phase 1: Cinematic orbit ─────────────────────────────────────────────
      // Camera moves on a wide arc, spiraling gently inward as scroll advances.
      // This is the "product reveal" — phone is assembled, we circle it slowly.
      const pp    = easeInOutSine(mapRange(p, 0, 0.20, 0, 1))
      const angle = t * 0.20                       // slow, majestic orbit speed
      const rad   = lerp(2.2, 0.8, pp)             // spiral inward with scroll

      px  = Math.sin(angle) * rad
      py  = lerp(0.10, 0.28, pp) + Math.sin(t * 0.12) * 0.08 + breathe
      pz  = lerp(6.4, 5.8, pp) - Math.cos(angle * 0.55) * 0.22
      fov = 50

    } else if (p < 0.40) {
      // ── Phase 2: Dolly zoom in ──────────────────────────────────────────────
      // Camera approaches while FOV narrows — telephoto compression creates
      // the illusion the phone is huge. Orbit fades out cleanly.
      const pp    = easeInOutCubic(mapRange(p, 0.20, 0.40, 0, 1))
      const angle = t * 0.20
      const fade  = 1 - pp                         // orbit dissolves as we zoom

      px  = Math.sin(angle) * 0.8 * fade
      py  = lerp(0.28, 0, pp) + breathe
      pz  = lerp(5.8, 3.5, pp)                     // deep zoom in
      fov = lerp(50, 36, pp)                        // narrow → telephoto compression

    } else if (p < 0.55) {
      // ── Phase 3a: Explosive pull-back + arc left ─────────────────────────────
      // Camera yanks back dramatically while the phone explodes.
      // The wide FOV makes the spread feel enormous.
      const pp = easeInOutCubic(mapRange(p, 0.40, 0.55, 0, 1))

      px  = lerp(0, -2.8, pp)
      py  = lerp(0, 1.4, pp) + breathe
      pz  = lerp(3.5, 7.4, pp)                     // dramatic pull-back
      lx  = lerp(0, -0.12, pp)
      ly  = lerp(0,  0.14, pp)
      fov = lerp(36, 56, pp)                        // blast open — embrace the explosion

    } else if (p < 0.70) {
      // ── Phase 3b: Sweeping arc across floating components ───────────────────
      // A long, slow sweep from left to right gives viewers time to appreciate
      // each floating component (camera, battery, motherboard, buttons).
      const pp = easeInOutSine(mapRange(p, 0.55, 0.70, 0, 1))

      px  = lerp(-2.8,  2.8, pp)
      py  = lerp( 1.4, -0.8, pp) + breathe
      pz  = lerp( 7.4,  7.0, pp)
      lx  = lerp(-0.12, 0.12, pp)
      ly  = lerp( 0.14,-0.10, pp)
      fov = lerp(56, 54, pp)

    } else if (p < 0.90) {
      // ── Phase 4: Reassembly — camera glides home ────────────────────────────
      // As parts reassemble, camera returns to centered front view.
      // FOV narrows back, building anticipation for the final reveal.
      const pp = easeInOutCubic(mapRange(p, 0.70, 0.90, 0, 1))

      px  = lerp(2.8, 0, pp)
      py  = lerp(-0.8, 0, pp) + breathe
      pz  = lerp(7.0, 4.2, pp)
      lx  = lerp(0.12, 0, pp)
      ly  = lerp(-0.10, 0, pp)
      fov = lerp(54, 42, pp)

    } else {
      // ── Phase 5: Screen reveal — super-telephoto close-up ───────────────────
      // Camera plunges forward while FOV shrinks to 28°, creating an intense
      // depth-compression and the illusion of entering the screen.
      const pp = easeOutExpo(mapRange(p, 0.90, 1.0, 0, 1))

      px  = 0
      py  = lerp(0, 0.22, pp) + breathe * (1 - pp) // breathe fades at extreme close
      pz  = lerp(4.2, 1.9, pp)
      ly  = lerp(0,   0.18, pp)
      fov = lerp(42,  28,   pp)                     // 28° = dramatic telephoto close-up
    }

    targetPos.current.set(px, py, pz)
    targetLook.current.set(lx, ly, 0)
    targetFov.current = fov

    // Frame-rate independent damping — same feel at 30fps, 60fps, 120fps
    const posSmooth = 1 - Math.pow(0.07, delta)   // position: responsive
    const fovSmooth = 1 - Math.pow(0.18, delta)   // FOV: slightly more inertia

    camera.position.lerp(targetPos.current, posSmooth)
    currentLook.current.lerp(targetLook.current, posSmooth)
    camera.lookAt(currentLook.current)

    // FOV — only upload to GPU when it actually changes
    const cam = camera as THREE.PerspectiveCamera
    const nextFov = lerp(cam.fov, targetFov.current, fovSmooth)
    if (Math.abs(nextFov - cam.fov) > 0.01) {
      cam.fov = nextFov
      cam.updateProjectionMatrix()
    }
  })

  return null
}
