'use client'

import { EffectComposer, Bloom, Vignette } from '@react-three/postprocessing'

export function PostFX() {
  return (
    <EffectComposer>
      {/* Bloom: lower threshold catches metallic highlights + screen edge glow */}
      <Bloom
        intensity={1.4}
        luminanceThreshold={0.35}
        luminanceSmoothing={0.85}
        height={400}
      />
      {/* Vignette was 0.90 — basically black. 0.52 is cinematic without crushing. */}
      <Vignette offset={0.30} darkness={0.52} />
    </EffectComposer>
  )
}
