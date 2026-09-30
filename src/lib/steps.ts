export const stepHash = (index: number) => `#step-${index + 1}`;

export function resolveStep(
  hash: string,
  { count, gate, unlocked }: { count: number; gate: number; unlocked: boolean },
): number {
  const match = /^#step-(\d+)$/.exec(hash);
  const index = match ? Number(match[1]) - 1 : 0;
  if (index < 0 || index >= count) return 0;
  if (!unlocked && gate >= 0 && index > gate) return gate;
  return index;
}
