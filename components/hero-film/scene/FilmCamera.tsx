'use client'

import { useRef } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'

function lerp(a: number, b: number, t: number) { return a + (b - a) * t }
function easeInOut(t: number) { return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t }

const _lookAt = new THREE.Vector3(0, 0, 0)

interface Props { progressRef: React.MutableRefObject<number> }

export function FilmCamera({ progressRef }: Props) {
  const { camera } = useThree()
  const prevFov = useRef(45)

  useFrame(() => {
    const p   = progressRef.current
    const cam = camera as THREE.PerspectiveCamera
    let fov   = prevFov.current

    // ── Scene 1: perfectly still ──────────────────────────────────
    if (p <= 0.10) {
      camera.position.set(0, 0, 5.0)

    // ── Star rush-in ──────────────────────────────────────────────
    } else if (p <= 0.14) {
      camera.position.set(0, 0, lerp(5.0, 3.0, easeInOut((p - 0.10) / 0.04)))

    // ── Scene 2: slow pull-back reveal ────────────────────────────
    } else if (p <= 0.28) {
      camera.position.set(0, 0, lerp(3.0, 6.5, easeInOut((p - 0.14) / 0.14)))

    // ── Scene 3 entry: rush to macro ──────────────────────────────
    } else if (p <= 0.32) {
      const t = easeInOut((p - 0.28) / 0.04)
      camera.position.set(lerp(0, -0.40, t), 0, lerp(6.5, 0.52, t))
      fov = lerp(45, 28, t)

    // ── Scene 3: horizontal dolly ─────────────────────────────────
    } else if (p <= 0.42) {
      const t = easeInOut((p - 0.32) / 0.10)
      camera.position.set(lerp(-0.40, 0.30, t), lerp(0, 0.12, t), 0.52)
      fov = 28

    // ── Scene 3 end: settle on camera island ──────────────────────
    } else if (p <= 0.43) {
      const t = easeInOut((p - 0.42) / 0.01)
      camera.position.set(lerp(0.30, 0.09, t), lerp(0.12, 0.22, t), lerp(0.52, 0.44, t))
      fov = 28

    // ── Scene 4 entry: pull back to court portrait ────────────────
    } else if (p <= 0.47) {
      const t = easeInOut((p - 0.43) / 0.04)
      camera.position.set(lerp(0.09, 0, t), lerp(0.22, 0, t), lerp(0.44, 2.8, t))
      fov = lerp(28, 45, t)

    // ── Scene 4: court portrait ───────────────────────────────────
    } else if (p <= 0.57) {
      camera.position.set(0, 0, 2.8)
      fov = 45

    // ── Scene 5: 180° orbit — front to back ───────────────────────
    // Camera traces a semicircle in the XZ plane at radius 2.8
    // Goes right (positive X) so it passes the rim-lit edge — that's where
    // the lens flare catch-light appears. Orbit is linear (scrub provides the lag).
    } else if (p <= 0.71) {
      const angle = ((p - 0.57) / 0.14) * Math.PI  // 0 → π
      camera.position.set(Math.sin(angle) * 2.8, 0, Math.cos(angle) * 2.8)
      fov = 45

    // ── Scene 6 entry: ease back to reveal screen ────────────────
    } else if (p <= 0.75) {
      const t = easeInOut((p - 0.71) / 0.04)
      camera.position.set(0, 0, lerp(-2.8, -3.8, t))
      fov = 45

    // ── Scene 6: THE PROMISE — hold ──────────────────────────────
    } else if (p <= 0.85) {
      camera.position.set(0, 0, -3.8)
      fov = 45

    // ── Scene 7: THE INVITATION — zoom in, FOV tightens ──────────
    } else if (p <= 0.93) {
      const t = easeInOut((p - 0.85) / 0.08)
      camera.position.set(0, 0, lerp(-3.8, -2.0, t))
      fov = lerp(45, 28, t)

    } else {
      camera.position.set(0, 0, -2.0)
      fov = 28
    }

    // Universal lookAt — camera ALWAYS points at the phone center
    camera.lookAt(_lookAt)

    if (cam.fov !== fov) {
      cam.fov = fov
      cam.updateProjectionMatrix()
      prevFov.current = fov
    }
  })

  return null
}
