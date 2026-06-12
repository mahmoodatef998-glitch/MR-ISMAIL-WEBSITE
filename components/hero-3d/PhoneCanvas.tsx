'use client'

import { Suspense } from 'react'
import { Canvas } from '@react-three/fiber'
import { Environment, AdaptiveDpr, AdaptiveEvents, PerformanceMonitor } from '@react-three/drei'
import * as THREE from 'three'
import { PhoneModel }       from './scene/PhoneModel'
import { CameraRig }        from './scene/CameraRig'
import { StudioLights }     from './scene/StudioLights'
import { FloatingParticles } from './scene/FloatingParticles'
import { PostFX }           from './scene/PostFX'
import { ScreenWorld }      from './scene/ScreenWorld'

interface Props { scrollProgress: number }

export function PhoneCanvas({ scrollProgress }: Props) {
  return (
    <Canvas
      camera={{ position: [0, 0, 6], fov: 45, near: 0.1, far: 100 }}
      dpr={[1, 2]}
      shadows
      gl={{
        antialias: true,
        alpha: false,
        powerPreference: 'high-performance',
        toneMapping: THREE.ACESFilmicToneMapping,
        toneMappingExposure: 1.6,
      }}
      className="!bg-transparent"
    >
      <color attach="background" args={['#000005']} />
      <fog attach="fog" args={['#000005', 12, 35]} />

      <AdaptiveDpr pixelated />
      <AdaptiveEvents />

      <PerformanceMonitor
        onDecline={() => {/* could lower quality here */}}
      />

      <Suspense fallback={null}>
        <Environment preset="city" />

        <StudioLights />
        <FloatingParticles />
        <PhoneModel scrollProgress={scrollProgress} />
        <ScreenWorld scrollProgress={scrollProgress} />

        <PostFX />
      </Suspense>

      {/* Camera rig is outside Suspense so it always runs */}
      <CameraRig scrollProgress={scrollProgress} />
    </Canvas>
  )
}
