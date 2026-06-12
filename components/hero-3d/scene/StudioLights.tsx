'use client'

export function StudioLights() {
  return (
    <>
      <ambientLight intensity={0.12} color="#1a1a44" />

      {/* Key light — warm white, top-left-front */}
      <spotLight
        position={[-5, 9, 6]}
        intensity={120}
        color="#ffe8cc"
        angle={0.32}
        penumbra={0.6}
        castShadow
        shadow-mapSize={[2048, 2048]}
        shadow-bias={-0.0001}
      />

      {/* Fill — cool electric blue, right */}
      <pointLight position={[6, 3, 3]} intensity={30} color="#3366ff" />

      {/* Rim / hair light — violet, back */}
      <spotLight
        position={[0.5, 5, -7]}
        intensity={90}
        color="#aa44ff"
        angle={0.45}
        penumbra={0.9}
      />

      {/* Gold accent — bottom-right */}
      <pointLight position={[3, -3, 3]} intensity={20} color="#c8a96e" />

      {/* Ground bounce */}
      <pointLight position={[0, -6, 2]} intensity={6} color="#0a1a33" />
    </>
  )
}
