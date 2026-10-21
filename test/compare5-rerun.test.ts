import { expect, it } from 'vitest';
import { exactPermutation, holmAdjust } from '../src/compare.ts';
import { RERUN_METRICS, rerunContrast } from '../src/compare5-rerun.ts';

it('adjusts all five requested outcomes together in each rerun contrast', () => {
  const a = Array.from({ length: 4 }, (_, i) =>
    Object.fromEntries(RERUN_METRICS.map(([key], j) => [key, i + j])),
  );
  const b = Array.from({ length: 4 }, (_, i) =>
    Object.fromEntries(RERUN_METRICS.map(([key], j) => [key, i * j])),
  );
  const expected = holmAdjust(
    RERUN_METRICS.map(([key]) =>
      exactPermutation(
        a.map((m) => m[key] as number),
        b.map((m) => m[key] as number),
      ),
    ),
  );
  const rows = rerunContrast(a, b);
  expect(rows).toHaveLength(5);
  rows.forEach((row, i) => {
    expect(Number(row.split('|')[4]?.trim())).toBeCloseTo(expected[i] as number, 6);
  });
});
