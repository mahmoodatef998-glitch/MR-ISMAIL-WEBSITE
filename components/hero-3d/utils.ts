export function mapRange(
  value: number,
  inMin: number,
  inMax: number,
  outMin = 0,
  outMax = 1,
): number {
  if (inMax === inMin) return outMin
  const t = Math.max(0, Math.min(1, (value - inMin) / (inMax - inMin)))
  return outMin + (outMax - outMin) * t
}

export function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t
}

export function easeInOutCubic(t: number): number {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2
}

export function easeOutExpo(t: number): number {
  return t === 1 ? 1 : 1 - Math.pow(2, -10 * t)
}

export function easeInOutSine(t: number): number {
  return -(Math.cos(Math.PI * t) - 1) / 2
}

export function damp(current: number, target: number, factor: number, dt: number): number {
  return lerp(current, target, 1 - Math.pow(factor, dt))
}
