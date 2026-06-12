'use client'

import { Suspense } from 'react'
import { Canvas } from '@react-three/fiber'
import {
  Environment,
  AdaptiveDpr,
  AdaptiveEvents,
  PerformanceMonitor,
  ContactShadows,
} from '@react-three/drei'
import * as THREE from 'three'
import { PhoneModel }        from './scene/PhoneModel'
import { CameraRig }         from './scene/CameraRig'
import { StudioLights }      from './scene/StudioLights'
import { FloatingParticles } from './scene/FloatingParticles'
import { PostFX }            from './scene/PostFX'
import { ScreenWorld }       from './scene/ScreenWorld'

interface Props { progressRef: React.MutableRefObject<number> }

export function PhoneCanvas({ progressRef }: Props) {
  return (
    <Canvas
      camera={{ position: [0, 0, 6], fov: 45, near: 0.1, far: 100 }}
      dpr={[1, 2]}
      shadows
      gl={{
        antialias:          true,
        alpha:              false,
        powerPreference:    'high-performance',
        toneMapping:        THREE.ACESFilmicToneMapping,
        toneMappingExposure: 1.5,
      }}
      className="!bg-transparent"
    >
      <color attach="background" args={['#000005']} />
      <fog attach="fog" args={['#020510', 14, 40]} />

      <AdaptiveDpr pixelated />
      <AdaptiveEvents />
      <PerformanceMonitor onDecline={() => {}} />

      <Suspense fallback={null}>
        {/* Studio preset: clean white/gray reflections — ideal for metallic product renders */}
        <Environment preset="studio" background={false} />

        <StudioLights progressRef={progressRef} />
        <FloatingParticles progressRef={progressRef} />
        <PhoneModel progressRef={progressRef} />
        <ScreenWorld progressRef={progressRef} />

        {/* Soft ground shadow — Apple-style product photography look */}
        <ContactShadows
          position={[0, -0.90, 0]}
          opacity={0.38}
          width={2.8}
          height={2.8}
          blur={2.8}
          far={1.4}
          color="#020510"
        />

        <PostFX />
      </Suspense>

      {/* CameraRig outside Suspense so it always runs */}
      <CameraRig progressRef={progressRef} />
    </Canvas>
  )
}
