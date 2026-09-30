import { describe, expect, it } from 'vitest';

import { resolveStep, stepHash } from './steps';

const locked = { count: 6, gate: 1, unlocked: false };
const unlocked = { ...locked, unlocked: true };

describe('stepHash', () => {
  it('is 1-based', () => {
    expect(stepHash(0)).toBe('#step-1');
    expect(stepHash(5)).toBe('#step-6');
  });
});

describe('resolveStep', () => {
  it('starts at the first step with no hash', () => {
    expect(resolveStep('', unlocked)).toBe(0);
  });

  it('reads a valid hash', () => {
    expect(resolveStep('#step-4', unlocked)).toBe(3);
  });

  it('round-trips with stepHash', () => {
    expect(resolveStep(stepHash(5), unlocked)).toBe(5);
  });

  it.each([
    '#step-0',
    '#step-7',
    '#step-99',
    '#step-',
    '#step-abc',
    '#privacy',
    '#step-2x',
  ])('falls back to the first step for %s', (hash) => {
    expect(resolveStep(hash, unlocked)).toBe(0);
  });

  it('holds a locked visitor at the gate', () => {
    expect(resolveStep('#step-4', locked)).toBe(1);
  });

  it('lets a locked visitor reach the gate and everything before it', () => {
    expect(resolveStep('#step-1', locked)).toBe(0);
    expect(resolveStep('#step-2', locked)).toBe(1);
  });

  it('does not clamp when there is no gate', () => {
    expect(
      resolveStep('#step-4', { count: 6, gate: -1, unlocked: false }),
    ).toBe(3);
  });
});
