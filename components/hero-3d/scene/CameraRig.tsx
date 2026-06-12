'use client'

import { useRef, useEffect } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'
import { mapRange, lerp, easeInOutCubic, easeOutExpo } from '../utils'

interface Props { scrollProgress: number }

export function CameraRig({ scrollProgress }: Props) {
  const progressRef = useRef(scrollProgress)
  useEffect(() => { progressRef.current = scrollProgress }, [scrollProgress])

  const targetPos   = useRef(new THREE.Vector3(0, 0, 6))
  const targetLook  = useRef(new THREE.Vector3(0, 0, 0))
  const { camera }  = useThree()

  useFrame(({ clock }) => {
    const p  = progressRef.current
    const t  = clock.elapsedTime

    let px = 0, py = 0, pz = 6
    let lx = 0, ly = 0

    if (p < 0.20) {
      // ── Phase 1: cinematic orbit ────────────────────────────────────────
      const angle = t * 0.22
      px = Math.sin(angle) * 1.2
      py = 0.25 + Math.sin(t * 0.14) * 0.15
      pz = 6 - Math.sin(angle * 0.5) * 0.4
      ly = 0

    } else if (p < 0.40) {
      // ── Phase 2: dolly zoom in, layers start separating ─────────────────
      const pp = easeInOutCubic(mapRange(p, 0.20, 0.40, 0, 1))
      px = lerp(Math.sin(t * 0.22) * 1.2, 0, pp)
      py = lerp(0.25, 0, pp)
      pz = lerp(6, 4.0, pp)

    } else if (p < 0.55) {
      // ── Phase 3a: pull back, look at exploded view ───────────────────────
      const pp = easeInOutCubic(mapRange(p, 0.40, 0.55, 0, 1))
      px = lerp(0, -1.6, pp)
      py = lerp(0, 0.6, pp)
      pz = lerp(4.0, 5.8, pp)
      lx = lerp(0, -0.2, pp)
      ly = lerp(0, 0.1, pp)

    } else if (p < 0.70) {
      // ── Phase 3b: sweep around exploded components ───────────────────────
      const pp = easeInOutCubic(mapRange(p, 0.55, 0.70, 0, 1))
      px = lerp(-1.6, 1.8, pp)
      py = lerp(0.6, -0.4, pp)
      pz = lerp(5.8, 5.4, pp)
      lx = lerp(-0.2, 0.2, pp)
      ly = lerp(0.1, -0.1, pp)

    } else if (p < 0.90) {
      // ── Phase 4: reassembly — return to front ────────────────────────────
      const pp = easeInOutCubic(mapRange(p, 0.70, 0.90, 0, 1))
      px = lerp(1.8, 0, pp)
      py = lerp(-0.4, 0, pp)
      pz = lerp(5.4, 4.0, pp)
      lx = lerp(0.2, 0, pp)
      ly = lerp(-0.1, 0, pp)

    } else {
      // ── Phase 5: dramatic close-up + enter screen ────────────────────────
      const pp = easeOutExpo(mapRange(p, 0.90, 1.0, 0, 1))
      px = 0
      py = lerp(0, 0.18, pp)
      pz = lerp(4.0, 2.0, pp)   // camera approaches the screen
      ly = lerp(0, 0.18, pp)
    }

    targetPos.current.set(px, py, pz)
    targetLook.current.set(lx, ly, 0)

    // Smooth lerp — snappy but cinematic
    camera.position.lerp(targetPos.current, 0.04)

    const currentLook = new THREE.Vector3()
    currentLook.lerpVectors(
      new THREE.Vector3().setFromMatrixPosition(camera.matrixWorld),
      targetLook.current,
      0.04,
    )
    camera.lookAt(targetLook.current)
  })

  return null
}
