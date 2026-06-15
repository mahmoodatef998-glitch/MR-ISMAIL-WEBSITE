'use client'

import { useRef } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'

interface Props { progressRef: React.MutableRefObject<number> }

export function SceneBackground({ progressRef }: Props) {
  const { scene } = useThree()
  const bg = useRef(new THREE.Color(0, 0, 0))

  useFrame(() => {
    const p = progressRef.current

    if (p > 0.57) {
      // Scene 5: void warms to faint amber haze — barely perceptible
      const t = Math.min(1, (p - 0.57) / 0.10)
      bg.current.setRGB(t * 0.048, t * 0.026, t * 0.007)
    } else {
      bg.current.setRGB(0, 0, 0)
    }

    scene.background = bg.current
  })

  return null
}
