import { mkdir, mkdtemp, rm, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';
import { compare, compareHF5, exactPermutation, HF5_ARMS, holmAdjust, median } from '../src/compare.ts';
import type { Recording } from '../src/types.ts';

describe('exact two-sided permutation of mean difference', () => {
  it('includes observed allocation, opposite allocation and ties', () => {
    expect(exactPermutation([1, 2], [3, 4])).toBeCloseTo(2 / 6);
    expect(exactPermutation([0, 0], [0, 0])).toBe(1);
    expect(exactPermutation(Array(10).fill(0), Array(10).fill(1))).toBeCloseTo(2 / 184756);
    expect(median([4, 1, 3, 2])).toBe(2.5);
  });
});

describe('Holm adjustment', () => {
  it('adjusts a known vector and restores input order', () => {
    const input = [0.03, 0.001, 0.02, 0.2];
    expect(holmAdjust(input)).toEqual([0.06, 0.004, 0.06, 0.2]);
    expect(input).toEqual([0.03, 0.001, 0.02, 0.2]);
  });

  it('caps at one and keeps adjusted values monotone in sorted raw p', () => {
    expect(holmAdjust([0.9, 0.8, 0.7])).toEqual([1, 1, 1]);
    expect(holmAdjust([0.01, 0.011, 0.012, 0.2])).toEqual([0.04, 0.04, 0.04, 0.2]);
    expect(holmAdjust([0, 0.02, 0.02, 1])).toEqual([0, 0.06, 0.06, 1]);
    expect(holmAdjust([])).toEqual([]);
    expect(holmAdjust([0.4])).toEqual([0.4]);
  });

  it('rejects invalid p values', () => {
    for (const value of [-0.1, 1.1, Number.NaN, Number.POSITIVE_INFINITY])
      expect(() => holmAdjust([value])).toThrow('Finite p values');
  });
});

describe('comparison report', () => {
  it('keeps HF5 project metrics descriptive and HF5 versus HF4 in one two-test family', async () => {
    const scratch = '/Users/abdul/code/.lab-scratch/hf-projects/island';
    await mkdir(scratch, { recursive: true });
    const directory = await mkdtemp(resolve(scratch, 'compare5-test-'));
    try {
      for (const arm of HF5_ARMS)
        for (let seed = 1; seed <= 10; seed++) {
          const run: Recording = {
            format: 'island-recording@1',
            mind: arm,
            seed,
            hf: arm === 'random' ? '2.9.0' : '2.13.0',
            world: { size: 5, height: [], spire: { x: 3, y: 3 } },
            config: { freeEpisodes: 3, stepsPerEpisode: 60, taskSteps: 60, task: 'Build.' },
            frames: Array.from({ length: 240 }, (_, i) => ({
              e: Math.floor(i / 60),
              s: i % 60,
              action: 'rest',
              me: { x: 1, y: 1 },
              carrying: null,
              objects: [],
              events: [],
            })),
            notes: [],
            selfReports: [],
            measures: {},
            cost: { calls: 0, inputTokens: 0, outputTokens: 0, usd: 0 },
          };
          await writeFile(resolve(directory, `${arm}-${seed}.json`), JSON.stringify(run));
        }
      const report = await compareHF5(directory);
      const rows =
        report
          .split('Per-seed values')[0]
          ?.split('\n')
          .filter((line) => line.startsWith('| hf')) ?? [];
      expect(rows).toHaveLength(34);
      for (const arm of HF5_ARMS.filter((arm) => arm !== 'random'))
        expect(rows.filter((line) => line.startsWith(`| ${arm} vs random |`))).toHaveLength(8);
      expect(
        rows.filter((line) => line.startsWith('| hf5 vs hf4 |')).map((line) => line.split('|')[2]?.trim()),
      ).toEqual(['Spire objects', 'Task score']);
      expect(
        rows.every(
          (line) =>
            !line.includes('Projects adopted') &&
            !line.includes('Project placements') &&
            !line.includes('Completed carry chains'),
        ),
      ).toBe(true);
      expect(report).toContain('Project metrics are descriptive only');
      expect(report).toContain(
        '| Arm | Seed | Free Spire objects | Projects adopted | Project placements | Completed carry chains | Task cubes |',
      );
    } finally {
      await rm(directory, { recursive: true, force: true });
    }
  });

  it('covers all requested blocks and adjusts each random comparison as one eight-test family', async () => {
    const report = await compare();
    const rows = (report.split('\n\nPer-seed')[0] ?? '')
      .split('\n')
      .filter((line) => line.startsWith('| ') && !line.startsWith('| Comparison'))
      .map((line) =>
        line
          .split('|')
          .slice(1, -1)
          .map((cell) => cell.trim()),
      );
    const freeLabels = [
      'Cells visited',
      'Kind entropy',
      'Manipulation share',
      'Idle share',
      'Spire objects',
      'Tallest stack',
      'Repeated pursuit',
    ];
    const candidates = ['hf4', 'hf4-no-curiosity', 'hf4-no-planning'];
    for (const arm of ['hf', 'hf2', 'hf2-no-memory', 'hf2-no-boredom', 'hf3', ...candidates]) {
      const block = rows.filter(([comparison]) => comparison === `${arm} vs random`);
      expect(block.map((row) => row[1])).toEqual([...freeLabels, 'Task score']);
      const expected = holmAdjust(block.map((row) => Number(row[4])));
      block.forEach((row, index) => {
        // Printed raw p values have six decimals; adjustment can multiply rounding by eight.
        expect(Number(row[5])).toBeCloseTo(expected[index] as number, 4);
      });
    }
    for (const arm of ['hf2', 'hf2-no-memory', 'hf2-no-boredom', 'hf3', ...candidates]) {
      const block = rows.filter(([comparison]) => comparison === `${arm} vs hf`);
      expect(block).toHaveLength(1);
      expect(block[0]?.[1]).toBe('Task score');
      expect(block[0]?.[5]).toBe(block[0]?.[4]);
    }
    for (const arm of ['hf2-no-boredom', 'hf2-no-memory', 'hf2-no-goals']) {
      const block = rows.filter(([comparison]) => comparison === `hf2 vs ${arm}`);
      expect(block.map((row) => row[1])).toEqual(['Task score', 'Remembered-target moves (all)']);
      const expected = holmAdjust(block.map((row) => Number(row[4])));
      block.forEach((row, index) => {
        expect(Number(row[5])).toBeCloseTo(expected[index] as number, 4);
      });
    }
    expect(rows.filter(([c]) => c === 'hf3 vs hf2').map((r) => r[1])).toEqual(['Task score']);
    expect(rows.filter(([c]) => c === 'hf4 vs hf2').map((r) => r[1])).toEqual(['Task score']);
    expect(rows).toHaveLength(79);
    expect(report).toContain('Per-seed values');
    expect(report).toContain('| hf-no-boredom |');
    expect(report).toContain('| Arm | move | jump | look | rest | pick | place | throw |');
    expect(report).toContain(`| Arm | Seed | ${freeLabels.join(' | ')} |`);
    for (const arm of candidates) {
      expect(report).toContain(`| ${arm} | 1, 2, 3, 4, 5, 6, 7, 8, 9, 10 |`);
      const freeRows = report
        .split('Per-seed free-time metrics')[1]
        ?.split('Free-time action-kind composition')[0]
        ?.split('\n')
        .filter((line) => line.startsWith(`| ${arm} | `));
      expect(freeRows).toHaveLength(10);
    }
    expect(report).toContain('one eight-test family per arm vs random');
    expect(report).toContain('one singleton family per task-score comparison vs hf or hf2');
    expect(report).toContain('one two-test family per hf2 ablation comparison');
    expect(report).toContain('| Exact p | Holm p |');
  });
});
