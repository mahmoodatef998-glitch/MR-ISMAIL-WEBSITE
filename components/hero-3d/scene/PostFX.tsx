'use client'

import { EffectComposer, Bloom, Vignette, ChromaticAberration } from '@react-three/postprocessing'
import { BlendFunction } from 'postprocessing'
import { Vector2 } from 'three'

export function PostFX() {
  return (
    <EffectComposer>
      <Bloom
        intensity={2.2}
        luminanceThreshold={0.65}
        luminanceSmoothing={0.85}
        radius={0.9}
        mipmapBlur
      />
      <ChromaticAberration
        blendFunction={BlendFunction.NORMAL}
        offset={new Vector2(0.00035, 0.00035)}
        radialModulation={false}
        modulationOffset={0}
      />
      <Vignette offset={0.42} darkness={0.75} eskil={false} />
    </EffectComposer>
  )
}
