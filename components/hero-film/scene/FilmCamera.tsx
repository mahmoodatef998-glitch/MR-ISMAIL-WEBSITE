'use client'

import { useFrame, useThree } from '@react-three/fiber'

function lerp(a: number, b: number, t: number) { return a + (b - a) * t }
function easeInOut(t: number) { return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t }

interface Props { progressRef: React.MutableRefObject<number> }

export function FilmCamera({ progressRef }: Props) {
  const { camera } = useThree()

  useFrame(() => {
    const p = progressRef.current
    let targetZ: number

    if (p <= 0.10) {
      // Scene 1: perfectly still — the stillness is the statement
      targetZ = 5.0
    } else if (p <= 0.14) {
      // Transition: camera rushes IN as the star expands and the phone is born
      targetZ = lerp(5.0, 3.0, easeInOut((p - 0.10) / 0.04))
    } else if (p <= 0.28) {
      // Scene 2: slow pull-back — stepping away from a sculpture to see it whole
      targetZ = lerp(3.0, 6.5, easeInOut((p - 0.14) / 0.14))
    } else {
      targetZ = 6.5
    }

    // 6% damping — heavy cinema glass, not a GoPro
    camera.position.z += (targetZ - camera.position.z) * 0.06
  })

  return null
}
