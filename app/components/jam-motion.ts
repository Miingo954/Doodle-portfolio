export type Point = { x: number; y: number };
export type Bounds = { minX: number; maxX: number; minY: number; maxY: number };

export function jamBounds(width: number, height: number, viewportWidth: number, viewportHeight: number): Bounds {
  return { minX: 8, minY: 8, maxX: Math.max(8, viewportWidth - width - 8), maxY: Math.max(8, viewportHeight - height - 8) };
}

export function constrainJam(position: Point, bounds: Bounds): Point {
  return { x: Math.max(bounds.minX, Math.min(bounds.maxX, position.x)), y: Math.max(bounds.minY, Math.min(bounds.maxY, position.y)) };
}

export function advanceJam(position: Point, velocity: Point, bounds: Bounds, elapsed: number) {
  const next = constrainJam(position, bounds);
  const speed = { ...velocity };
  // Small time steps preserve edge overshoot and keep throws consistent at
  // 30, 60, and 120 Hz, without tunnelling through a wall after a slow frame.
  const steps = Math.max(1, Math.ceil(elapsed * 120));
  const dt = elapsed / steps;
  const decay = Math.exp(-0.6 * dt);
  for (let step = 0; step < steps; step++) {
    for (const axis of ["x", "y"] as const) {
      const min = axis === "x" ? bounds.minX : bounds.minY;
      const max = axis === "x" ? bounds.maxX : bounds.maxY;
      next[axis] += speed[axis] * (1 - decay) / 0.6;
      speed[axis] *= decay;
      if (min === max) { next[axis] = min; speed[axis] = 0; continue; }
      while (next[axis] < min || next[axis] > max) {
        next[axis] = next[axis] < min ? 2 * min - next[axis] : 2 * max - next[axis];
        speed[axis] *= -0.96;
      }
    }
  }
  return { position: next, velocity: speed };
}
