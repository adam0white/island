import { readdirSync, readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import type { Frame, Recording } from '../src/types.ts';
import '../viewer/viewer.js';

const { buildTimeline, frameAt, indexPaths, sparklinePoints, trailAt, fixture, validateRecording } =
  Reflect.get(globalThis, 'IslandReplay') as {
    validateRecording: (run: Recording) => Recording;
    fixture: (mind: string) => Recording;
    buildTimeline: (runs: Recording[]) => { e: number; s: number }[];
    frameAt: (run: Recording, point: { e: number; s: number }) => Frame | null;
    trailAt: (run: Recording, point: { e: number; s: number }) => { x: number; y: number }[];
    indexPaths: (value: unknown) => string[];
    sparklinePoints: (values: (number | undefined)[], width: number, height: number) => string[];
  };

const frame = (e: number, s: number, x = 1): Frame => ({
  e,
  s,
  me: { x, y: 1 },
  carrying: null,
  objects: [],
  action: 'rest',
  events: [],
});
const run = (frames: Frame[]) => ({ frames }) as Recording;

describe('replay alignment', () => {
  it('aligns by episode and step, including unequal and incomplete recordings', () => {
    const left = run([frame(0, 1), frame(0, 2), frame(1, 1)]);
    const right = run([frame(0, 1), frame(1, 1), frame(1, 2)]);
    expect(buildTimeline([left, right])).toEqual([
      { e: 0, s: 1 },
      { e: 0, s: 2 },
      { e: 1, s: 1 },
      { e: 1, s: 2 },
    ]);
    expect(frameAt(right, { e: 0, s: 2 })).toBeNull();
    expect(frameAt(left, { e: 1, s: 1 })).toEqual(left.frames[2]);
  });
  it('does not carry the trail across an episode reset or into the future', () => {
    const recording = run([frame(0, 1, 8), ...Array.from({ length: 25 }, (_, i) => frame(1, i, i))]);
    const trail = trailAt(recording, { e: 1, s: 22 });
    expect(trail).toHaveLength(20);
    expect(trail[0]).toEqual({ x: 3, y: 1 });
    expect(trail[19]).toEqual({ x: 22, y: 1 });
    expect(trailAt(recording, { e: 2, s: 1 })).toEqual([]);
  });
});

describe('recording loading and charts', () => {
  const structuredInner = () => ({
    boredom: 0.5,
    route: {
      steps: [
        {
          successor: {
            action: 'place',
            targetId: 'cube-1',
            placeId: 'spire',
            duration: 1.5,
            effort: 0.2,
            focus: 0.8,
            materialCost: 0,
          },
          start: 2.5,
          end: 4,
          access: 0.9,
        },
      ],
      goals: { build: 0.4 },
    },
    curiosityTerms: [{ source: 'curiosity:information', value: -0.25, ref: 'cube-1' }],
  });

  it('accepts structured HF4 route estimates and curiosity terms, including empty readouts', () => {
    const recording = fixture('hf4');
    const first = recording.frames[0] as Frame;
    first.inner = structuredInner();
    expect(validateRecording(recording)).toBe(recording);
    first.inner = { route: { steps: [], goals: {} }, curiosityTerms: [] };
    expect(validateRecording(recording)).toBe(recording);
    const minimal = structuredInner();
    Reflect.deleteProperty(minimal.route.steps[0]?.successor as object, 'focus');
    Reflect.deleteProperty(minimal.route.steps[0]?.successor as object, 'materialCost');
    Reflect.deleteProperty(minimal.curiosityTerms[0] as object, 'ref');
    first.inner = minimal;
    expect(validateRecording(recording)).toBe(recording);
  });

  it('rejects malformed nested HF4 routes and curiosity terms', () => {
    const malformed: [string, unknown][] = [
      ['route', null],
      ['route.steps', {}],
      ['route.steps.0', null],
      ['route.steps.0.successor', []],
      ['route.steps.0.successor.action', 3],
      ['route.steps.0.successor.targetId', 3],
      ['route.steps.0.successor.placeId', null],
      ['route.steps.0.successor.duration', -1],
      ['route.steps.0.successor.effort', 1.1],
      ['route.steps.0.successor.focus', Number.NaN],
      ['route.steps.0.successor.materialCost', -1],
      ['route.steps.0.start', Number.POSITIVE_INFINITY],
      ['route.steps.0.end', 1],
      ['route.steps.0.access', -0.1],
      ['route.goals', []],
      ['route.goals.build', 'high'],
      ['curiosityTerms', {}],
      ['curiosityTerms.0', null],
      ['curiosityTerms.0.source', 1],
      ['curiosityTerms.0.value', Number.NaN],
      ['curiosityTerms.0.ref', 1],
    ];
    for (const [path, value] of malformed) {
      const recording = fixture('hf4');
      const inner = structuredInner();
      const keys = path.split('.');
      const key = keys.pop() as string;
      const parent = keys.reduce((object, part) => Reflect.get(object, part), inner as object);
      Reflect.set(parent, key, value);
      (recording.frames[0] as Frame).inner = inner;
      expect(() => validateRecording(recording), path).toThrow('island-recording@1');
    }
  });

  it('accepts every generated recording, including structured HF2 goal audits', () => {
    const validate = Reflect.get(globalThis, 'IslandReplay').validateRecording;
    for (const file of readdirSync('viewer/runs').filter((f) => f.endsWith('.json') && f !== 'index.json')) {
      const run = JSON.parse(readFileSync(`viewer/runs/${file}`, 'utf8'));
      expect(() => validate(run), file).not.toThrow();
    }
    const run = JSON.parse(readFileSync('viewer/runs/hf2-1.json', 'utf8'));
    run.frames[0].inner.goals = [{ label: 'malformed' }];
    expect(() => validate(run)).toThrow();
  });

  it('reads simple and metadata indexes without accepting unrelated entries', () => {
    expect(indexPaths(['hf-1.json', 'llm-1.json'])).toEqual(['hf-1.json', 'llm-1.json']);
    expect(indexPaths([{ file: 'hf-1.json', mind: 'hf', seed: 1 }])).toEqual(['hf-1.json']);
    expect(indexPaths({ recordings: [{ file: 'hf-1.json', mind: 'hf' }, { path: 'llm-1.json' }] })).toEqual([
      'hf-1.json',
      'llm-1.json',
    ]);
    expect(() => indexPaths({ recordings: [{ mind: 'hf' }] })).toThrow();
    expect(() => indexPaths(['https://example.com/run.json'])).toThrow();
    expect(() => indexPaths(['%2e%2e/private.json'])).toThrow();
    expect(() => indexPaths(['nested/%2E%2e/%2e%2e/private.json'])).toThrow();
  });
  it('keeps chart gaps for absent readings and clamps readings to the chart', () => {
    expect(sparklinePoints([0, 0.5, undefined, 2], 100, 20)).toEqual(['0,20 33.33,10', '100,0']);
    expect(sparklinePoints([], 100, 20)).toEqual([]);
    expect(sparklinePoints([0.5], 100, 20)).toEqual(['0,10']);
  });
});
