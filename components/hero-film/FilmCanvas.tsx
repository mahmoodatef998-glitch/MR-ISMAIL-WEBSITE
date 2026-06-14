'use client'

import { Suspense } from 'react'
import { Canvas } from '@react-three/fiber'
import { AdaptiveDpr, AdaptiveEvents, PerformanceMonitor } from '@react-three/drei'
import { EffectComposer, Bloom, Vignette } from '@react-three/postprocessing'
import * as THREE from 'three'
import { VoidCore }    from './scene/VoidCore'
import { PhoneBody }   from './scene/PhoneBody'
import { FilmLights }  from './scene/FilmLights'
import { FilmCamera }  from './scene/FilmCamera'

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
      <color attach="background" args={['#000000']} />

      <AdaptiveDpr pixelated />
      <AdaptiveEvents />
      <PerformanceMonitor onDecline={() => {}} />

      <Suspense fallback={null}>
        {/* Scene 1: the void star — expands then collapses as phone is born */}
        <VoidCore progressRef={progressRef} />

        {/* Scene 2+: phone body + lighting system */}
        <PhoneBody  progressRef={progressRef} />
        <FilmLights progressRef={progressRef} />
      </Suspense>

      {/* Camera outside Suspense — always animating */}
      <FilmCamera progressRef={progressRef} />

      {/* Post-processing */}
      <EffectComposer>
        {/* Low threshold catches both the HDR star and the rim-lit titanium edge */}
        <Bloom
          intensity={4.0}
          luminanceThreshold={0.08}
          luminanceSmoothing={0.4}
          height={512}
        />
        {/* Vignette frames the void and the phone — draws eye to center */}
        <Vignette offset={0.25} darkness={0.65} />
      </EffectComposer>
    </Canvas>
  )
}
