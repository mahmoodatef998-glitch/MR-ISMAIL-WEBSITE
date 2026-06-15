'use client'

import { useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'

function lerp(a: number, b: number, t: number) { return a + (b - a) * t }
function easeInOut(t: number) { return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t }

interface Props { progressRef: React.MutableRefObject<number> }

export function FilmCamera({ progressRef }: Props) {
  const { camera } = useThree()

  useFrame(() => {
    const p = progressRef.current
    const cam = camera as THREE.PerspectiveCamera
    let fov = cam.fov
    let updateProjection = false

    // ── Scene 1: void ────────────────────────────────────────────
    if (p <= 0.10) {
      camera.position.set(0, 0, 5.0)

    // ── Star rush-in ─────────────────────────────────────────────
    } else if (p <= 0.14) {
      const t = easeInOut((p - 0.10) / 0.04)
      camera.position.set(0, 0, lerp(5.0, 3.0, t))

    // ── Scene 2: pull-back reveal ─────────────────────────────────
    } else if (p <= 0.28) {
      const t = easeInOut((p - 0.14) / 0.14)
      camera.position.set(0, 0, lerp(3.0, 6.5, t))

    // ── Scene 3 entry: rush to macro ──────────────────────────────
    } else if (p <= 0.32) {
      const t = easeInOut((p - 0.28) / 0.04)
      camera.position.set(lerp(0, -0.40, t), 0, lerp(6.5, 0.52, t))
      fov = lerp(45, 28, t)
      updateProjection = true

    // ── Scene 3: horizontal dolly along back surface ───────────────
    } else if (p <= 0.42) {
      const t = easeInOut((p - 0.32) / 0.10)
      camera.position.set(lerp(-0.40, 0.30, t), lerp(0, 0.12, t), 0.52)
      fov = 28
      updateProjection = true

    // ── Scene 3 end: settle on camera island ──────────────────────
    } else if (p <= 0.43) {
      const t = easeInOut((p - 0.42) / 0.01)
      camera.position.set(lerp(0.30, 0.09, t), lerp(0.12, 0.22, t), lerp(0.52, 0.44, t))
      fov = 28
      updateProjection = true

    // ── Scene 4 entry: pull back to court portrait ────────────────
    } else if (p <= 0.47) {
      const t = easeInOut((p - 0.43) / 0.04)
      camera.position.set(lerp(0.09, 0, t), lerp(0.22, 0, t), lerp(0.44, 2.8, t))
      fov = lerp(28, 45, t)
      updateProjection = true

    // ── Scene 4: court portrait — phone presented face-on ─────────
    } else {
      camera.position.set(0, 0, 2.8)
      if (fov !== 45) { fov = 45; updateProjection = true }
    }

    if (updateProjection) {
      cam.fov = fov
      cam.updateProjectionMatrix()
    }
  })

  return null
}
