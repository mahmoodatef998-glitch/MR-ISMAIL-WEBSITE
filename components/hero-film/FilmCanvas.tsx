'use client'

import { Suspense } from 'react'
import { Canvas } from '@react-three/fiber'
import { AdaptiveDpr, AdaptiveEvents, PerformanceMonitor } from '@react-three/drei'
import { EffectComposer, Bloom, Vignette } from '@react-three/postprocessing'
import * as THREE from 'three'
import { VoidCore }         from './scene/VoidCore'
import { PhoneBody }        from './scene/PhoneBody'
import { PhoneScreen }      from './scene/PhoneScreen'
import { LensFlare }        from './scene/LensFlare'
import { FilmLights }       from './scene/FilmLights'
import { FilmCamera }       from './scene/FilmCamera'
import { SceneBackground }  from './scene/SceneBackground'

interface Props {
  progressRef: React.MutableRefObject<number>
}

export function FilmCanvas({ progressRef }: Props) {
  return (
    <Canvas
      camera={{ position: [0, 0, 5], fov: 45, near: 0.1, far: 100 }}
      dpr={[1, 2]}
      gl={{
        antialias: true,
        alpha: false,
        powerPreference: 'high-performance',
        toneMapping: THREE.ACESFilmicToneMapping,
        toneMappingExposure: 1.0,
      }}
    >
      {/* Background managed by SceneBackground — starts black, warms in Scene 5 */}

      <AdaptiveDpr pixelated />
      <AdaptiveEvents />
      <PerformanceMonitor onDecline={() => {}} />

      <Suspense fallback={null}>
        {/* Scene 1: void star */}
        <VoidCore progressRef={progressRef} />

        {/* Scene 2+: phone geometry */}
        <PhoneBody   progressRef={progressRef} />
        <PhoneScreen progressRef={progressRef} />

        {/* Scene 5: bronze catch-light at main lens */}
        <LensFlare progressRef={progressRef} />

        {/* Lighting — all scenes */}
        <FilmLights progressRef={progressRef} />
      </Suspense>

      {/* These run outside Suspense — always ticking */}
      <FilmCamera         progressRef={progressRef} />
      <SceneBackground    progressRef={progressRef} />

      <EffectComposer>
        {/* Bloom: star, rim highlight, screen glow, lens catch-light */}
        <Bloom
          intensity={4.0}
          luminanceThreshold={0.08}
          luminanceSmoothing={0.4}
          height={512}
        />
        {/* Vignette: draws eye to the phone at all times */}
        <Vignette offset={0.25} darkness={0.65} />
      </EffectComposer>
    </Canvas>
  )
}
