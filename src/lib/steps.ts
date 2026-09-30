export const stepHash = (index: number) => `#step-${index + 1}`;

export function resolveStep(hash: string, count: number): number {
  const match = /^#step-(\d+)$/.exec(hash);
  const index = match ? Number(match[1]) - 1 : 0;
  return index >= 0 && index < count ? index : 0;
}

/* Clamped rather than resolved from a raw hash: a hash past the end resolves
   to the first step, which would send a double tap on Next back to the start. */
export const moveStep = (from: number, delta: number, count: number) =>
  Math.min(Math.max(from + delta, 0), count - 1);
