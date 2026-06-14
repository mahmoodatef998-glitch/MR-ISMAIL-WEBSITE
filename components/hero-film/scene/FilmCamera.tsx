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

    if (p <= 0.10) {
      // Scene 1: perfectly still — the stillness is the statement
      camera.position.set(0, 0, 5.0)

    } else if (p <= 0.14) {
      // Rush in as the star expands and the phone is born
      const t = easeInOut((p - 0.10) / 0.04)
      camera.position.set(0, 0, lerp(5.0, 3.0, t))

    } else if (p <= 0.28) {
      // Scene 2: slow pull-back — stepping away from a sculpture
      const t = easeInOut((p - 0.14) / 0.14)
      camera.position.set(0, 0, lerp(3.0, 6.5, t))

    } else if (p <= 0.32) {
      // Scene 3 entry: rush close to the back surface, FOV narrows to telephoto
      const t = easeInOut((p - 0.28) / 0.04)
      camera.position.set(lerp(0, -0.40, t), 0, lerp(6.5, 0.52, t))
      fov = lerp(45, 28, t)
      updateProjection = true

    } else if (p <= 0.42) {
      // Scene 3 dolly: horizontal macro pass — left to right along the back
      const t = easeInOut((p - 0.32) / 0.10)
      camera.position.set(lerp(-0.40, 0.30, t), lerp(0, 0.12, t), 0.52)
      fov = 28
      updateProjection = true

    } else if (p <= 0.43) {
      // Scene 3 end: camera lands on the camera island — 3 lenses fill the frame
      const t = easeInOut((p - 0.42) / 0.01)
      camera.position.set(lerp(0.30, 0.09, t), lerp(0.12, 0.22, t), lerp(0.52, 0.44, t))
      fov = 28
      updateProjection = true

    } else {
      // Hold at camera island for Scene 4 entry
      camera.position.set(0.09, 0.22, 0.44)
      fov = 28
      updateProjection = true
    }

    if (updateProjection && cam.fov !== fov) {
      cam.fov = fov
      cam.updateProjectionMatrix()
    }
  })

  return null
}
