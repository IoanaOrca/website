interface StepState {
  count: number;
  gate: number;
  unlocked: boolean;
}

export const stepHash = (index: number) => `#step-${index + 1}`;

export function resolveStep(
  hash: string,
  { count, gate, unlocked }: StepState,
): number {
  const match = /^#step-(\d+)$/.exec(hash);
  const index = match ? Number(match[1]) - 1 : 0;
  if (index < 0 || index >= count) return 0;
  if (!unlocked && gate >= 0 && index > gate) return gate;
  return index;
}

/* Clamped rather than resolved from a raw hash: a hash past the end resolves
   to the first step, which would send a double tap on Next back to the start. */
export function moveStep(
  from: number,
  delta: number,
  state: StepState,
): number {
  const to = Math.min(Math.max(from + delta, 0), state.count - 1);
  return resolveStep(stepHash(to), state);
}
