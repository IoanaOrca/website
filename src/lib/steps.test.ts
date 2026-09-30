import { describe, expect, it } from 'vitest';

import { moveStep, resolveStep, stepHash } from './steps';

const COUNT = 5;

describe('resolveStep', () => {
  it('starts at the first step with no hash', () => {
    expect(resolveStep('', COUNT)).toBe(0);
  });

  it('reads a valid hash', () => {
    expect(resolveStep('#step-4', COUNT)).toBe(3);
  });

  it('round-trips with stepHash', () => {
    expect(resolveStep(stepHash(4), COUNT)).toBe(4);
  });

  it.each(['#step-0', '#step-6', '#step-abc', '#privacy'])(
    'falls back to the first step for %s',
    (hash) => {
      expect(resolveStep(hash, COUNT)).toBe(0);
    },
  );
});

describe('moveStep', () => {
  it('moves one step forward and back', () => {
    expect(moveStep(2, 1, COUNT)).toBe(3);
    expect(moveStep(2, -1, COUNT)).toBe(1);
  });

  it('stays on the last step instead of wrapping to the first', () => {
    expect(moveStep(4, 1, COUNT)).toBe(4);
  });

  it('stays on the first step going back', () => {
    expect(moveStep(0, -1, COUNT)).toBe(0);
  });
});
