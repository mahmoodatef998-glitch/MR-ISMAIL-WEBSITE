'use client'

import { EffectComposer, Bloom, Vignette } from '@react-three/postprocessing'

export function PostFX() {
  return (
    <EffectComposer>
      <Bloom
        intensity={1.8}
        luminanceThreshold={0.7}
        luminanceSmoothing={0.85}
        height={300}
      />
      <Vignette offset={0.42} darkness={0.75} />
    </EffectComposer>
  )
}
