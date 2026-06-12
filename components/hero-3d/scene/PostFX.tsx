'use client'

import { EffectComposer, Bloom, Vignette, DepthOfField } from '@react-three/postprocessing'

export function PostFX() {
  return (
    <EffectComposer>
      {/* Depth of field — background stays soft, phone stays sharp */}
      <DepthOfField
        focusDistance={0.046}   // normalised: phone ~4.5 units from camera; far=100
        focalLength={0.012}     // subtle — only far objects (ScreenWorld panels) blur
        bokehScale={1.6}
        height={480}
      />

      {/* Cinematic bloom — only very bright emissives glow (screen, particles) */}
      <Bloom
        intensity={0.85}
        luminanceThreshold={0.52}
        luminanceSmoothing={0.95}
        height={300}
      />

      {/* Deep vignette — IMAX-style cinematic framing */}
      <Vignette offset={0.28} darkness={0.90} />
    </EffectComposer>
  )
}
