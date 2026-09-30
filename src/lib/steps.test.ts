import { describe, expect, it } from 'vitest';

import { moveStep, resolveStep, stepHash } from './steps';

const locked = { count: 6, gate: 1, isUnlocked: false };
const unlocked = { ...locked, isUnlocked: true };

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
      resolveStep('#step-4', { count: 6, gate: -1, isUnlocked: false }),
    ).toBe(3);
  });
});

describe('moveStep', () => {
  it('moves one step forward and back', () => {
    expect(moveStep(2, 1, unlocked)).toBe(3);
    expect(moveStep(2, -1, unlocked)).toBe(1);
  });

  it('stays at the gate while locked', () => {
    expect(moveStep(1, 1, locked)).toBe(1);
  });

  it('passes the gate once unlocked', () => {
    expect(moveStep(1, 1, unlocked)).toBe(2);
  });

  it('stays on the last step instead of wrapping to the first', () => {
    expect(moveStep(5, 1, unlocked)).toBe(5);
  });

  it('stays on the first step going back', () => {
    expect(moveStep(0, -1, unlocked)).toBe(0);
  });
});
