/** Exact, unpaired label permutation test on |difference in means|; all C(20,10) allocations,
 * inclusive ties. Medians describe each sample. Seed-matched terrain is retained but the test requested
 * here is unpaired. Exploratory p values include Holm correction within the stated comparison families;
 * families are not jointly corrected, and a large p does not establish equivalence.
 */
import { readdir, readFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { pathToFileURL } from 'node:url';
import { measureRecording } from './measures.ts';
import type { Recording } from './types.ts';

export function median(values: number[]): number {
  if (!values.length) throw new Error('Median needs observations');
  const sorted = [...values].sort((a, b) => a - b);
  return (
    ((sorted[Math.floor((sorted.length - 1) / 2)] as number) +
      (sorted[Math.floor(sorted.length / 2)] as number)) /
    2
  );
}
export function exactPermutation(a: number[], b: number[]): number {
  if (!a.length || !b.length || [...a, ...b].some((v) => !Number.isFinite(v)))
    throw new Error('Finite nonempty samples required');
  const values = [...a, ...b];
  const sumA = a.reduce((s, v) => s + v, 0);
  const sum = values.reduce((s, v) => s + v, 0);
  const statistic = (s: number) => Math.abs(s / a.length - (sum - s) / b.length);
  const observed = statistic(sumA);
  let extreme = 0;
  let total = 0;
  function enumerate(start: number, remaining: number, subtotal: number): void {
    if (remaining === 0) {
      total++;
      if (statistic(subtotal) >= observed - 1e-12 * Math.max(1, observed)) extreme++;
      return;
    }
    for (let i = start; i <= values.length - remaining; i++)
      enumerate(i + 1, remaining - 1, subtotal + (values[i] as number));
  }
  enumerate(0, a.length, 0);
  return extreme / total;
}

/** Holm step-down adjusted p values, returned in the original hypothesis order. */
export function holmAdjust(pValues: number[]): number[] {
  if (pValues.some((p) => !Number.isFinite(p) || p < 0 || p > 1))
    throw new Error('Finite p values between zero and one required');
  const ordered = pValues.map((p, index) => ({ p, index })).sort((a, b) => a.p - b.p);
  const adjusted: number[] = Array(pValues.length);
  let previous = 0;
  ordered.forEach(({ p, index }, rank) => {
    previous = Math.min(1, Math.max(previous, (pValues.length - rank) * p));
    adjusted[index] = previous;
  });
  return adjusted;
}

export async function compare(directory = 'viewer/runs'): Promise<string> {
  if ((await readdir(directory)).includes('hf5-1.json')) return compareHF5(directory);
  const candidates = ['hf4', 'hf4-no-curiosity', 'hf4-no-planning'];
  const names = [
    'hf',
    'random',
    'hf2',
    'hf2-no-boredom',
    'hf2-no-memory',
    'hf2-no-goals',
    'hf3',
    ...candidates,
  ];
  const recordings: Recording[] = [];
  const samples = new Map<string, Record<string, number>[]>();
  for (const name of names) {
    const records = [];
    for (let seed = 1; seed <= 10; seed++) {
      const r = JSON.parse(await readFile(resolve(directory, `${name}-${seed}.json`), 'utf8')) as Recording;
      if (
        r.seed !== seed ||
        r.mind !== name ||
        !(candidates.includes(name) ? ['2.11.0', '2.12.0'].includes(r.hf) : r.hf === '2.9.0') ||
        r.frames.length !== 240 ||
        r.config.freeEpisodes !== 3 ||
        r.config.stepsPerEpisode !== 60 ||
        r.config.taskSteps !== 60
      )
        throw new Error(`Unexpected run ${name}-${seed}`);
      records.push(measureRecording(r));
      recordings.push(r);
    }
    samples.set(name, records);
  }
  const rows = [
    'Exact unpaired permutation tests of absolute mean differences, including ties. Medians describe samples. Holm correction uses one eight-test family per arm vs random (seven free-time metrics plus task score), one singleton family per task-score comparison vs hf or hf2, and one two-test family per hf2 ablation comparison. Families are exploratory and are not jointly corrected; large p values do not establish equivalence. The hf baseline has no task comparison with itself.',
    '',
    '| Comparison | Measure | Median A | Median B | Exact p | Holm p |',
    '|---|---|---:|---:|---:|---:|',
  ];
  const metrics: [string, string][] = [
    ['cellsVisited', 'Cells visited'],
    ['kindEntropy', 'Kind entropy'],
    ['manipulationShare', 'Manipulation share'],
    ['idleShare', 'Idle share'],
    ['freeSpireObjects', 'Spire objects'],
    ['freeMaxStack', 'Tallest stack'],
    ['repeatedPursuit', 'Repeated pursuit'],
  ];
  function append(a: string, b: string, fields: [string, string][]) {
    const results = fields.map(([key, label]) => {
      const av = (samples.get(a) ?? []).map((m) => m[key] as number);
      const bv = (samples.get(b) ?? []).map((m) => m[key] as number);
      return { label, medianA: median(av), medianB: median(bv), p: exactPermutation(av, bv) };
    });
    const adjusted = holmAdjust(results.map(({ p }) => p));
    results.forEach(({ label, medianA, medianB, p }, index) => {
      rows.push(
        `| ${a} vs ${b} | ${label} | ${medianA.toFixed(4)} | ${medianB.toFixed(4)} | ${p.toFixed(6)} | ${(adjusted[index] as number).toFixed(6)} |`,
      );
    });
  }
  for (const arm of ['hf', 'hf2', 'hf2-no-memory', 'hf2-no-boredom', 'hf3', ...candidates])
    append(arm, 'random', [...metrics, ['taskScore', 'Task score']]);
  for (const arm of ['hf2', 'hf2-no-memory', 'hf2-no-boredom', 'hf3', ...candidates])
    append(arm, 'hf', [['taskScore', 'Task score']]);
  append('hf3', 'hf2', [['taskScore', 'Task score']]);
  append('hf4', 'hf2', [['taskScore', 'Task score']]);
  for (const arm of ['hf2-no-boredom', 'hf2-no-memory', 'hf2-no-goals'])
    append('hf2', arm, [
      ['taskScore', 'Task score'],
      ['rememberedTargetMoves', 'Remembered-target moves (all)'],
    ]);
  // Descriptive coverage includes every saved HF arm, including the three-seed pilot ablation.
  for (const file of (await readdir(directory)).sort()) {
    if (!/^hf.*-\d+\.json$/.test(file)) continue;
    const run = JSON.parse(await readFile(resolve(directory, file), 'utf8')) as Recording;
    if (!names.includes(run.mind)) recordings.push(run);
  }
  rows.push(
    '',
    'Per-seed values (vectors follow the listed seed order). Spire objects, tallest stack and repeated pursuit use free time; task score is final task cubes on the Spire.',
    '',
    '| Arm | Seeds | Spire objects | Tallest stack | Repeated pursuit | Task score |',
    '|---|---|---|---|---|---|',
  );
  const arms = [...new Set(recordings.map((r) => r.mind))].sort();
  for (const arm of arms) {
    const runs = recordings.filter((r) => r.mind === arm).sort((a, b) => a.seed - b.seed);
    const measures = runs.map((r) => measureRecording(r));
    rows.push(
      `| ${arm} | ${runs.map((r) => r.seed).join(', ')} | ${['freeSpireObjects', 'freeMaxStack', 'repeatedPursuit', 'taskScore'].map((key) => measures.map((m) => m[key]).join(', ')).join(' | ')} |`,
    );
  }
  rows.push(
    '',
    'Per-seed free-time metrics (one row per run; shares and entropy rounded to four decimals).',
    '',
    `| Arm | Seed | ${metrics.map(([, label]) => label).join(' | ')} |`,
    '|---|---:|---:|---:|---:|---:|---:|---:|---:|',
  );
  for (const arm of arms) {
    for (const run of recordings.filter((r) => r.mind === arm).sort((a, b) => a.seed - b.seed)) {
      const measures = measureRecording(run);
      rows.push(
        `| ${arm} | ${run.seed} | ${metrics.map(([key]) => (measures[key] as number).toFixed(4)).join(' | ')} |`,
      );
    }
  }
  rows.push(
    '',
    'Free-time action-kind composition (pooled action shares; jump is the input verb, recorded as climb in the entropy metric).',
    '',
    '| Arm | move | jump | look | rest | pick | place | throw |',
    '|---|---:|---:|---:|---:|---:|---:|---:|',
  );
  for (const arm of arms) {
    const frames = recordings
      .filter((r) => r.mind === arm)
      .flatMap((r) => r.frames.filter((f) => f.e < r.config.freeEpisodes));
    rows.push(
      `| ${arm} | ${['move', 'jump', 'look', 'rest', 'pick', 'place', 'throw'].map((kind) => (frames.filter((f) => f.action.split(' ')[0] === kind).length / frames.length).toFixed(4)).join(' | ')} |`,
    );
  }
  return rows.join('\n');
}

export const HF5_ARMS = ['hf5', 'hf5-no-projects', 'hf5-no-persistence', 'random', 'hf4'] as const;
export const FREE_METRICS: [string, string][] = [
  ['cellsVisited', 'Cells visited'],
  ['kindEntropy', 'Kind entropy'],
  ['manipulationShare', 'Manipulation share'],
  ['idleShare', 'Idle share'],
  ['freeSpireObjects', 'Spire objects'],
  ['freeMaxStack', 'Tallest stack'],
  ['repeatedPursuit', 'Repeated pursuit'],
];
const PROJECT_METRICS: [string, string][] = [
  ['projectsAdopted', 'Projects adopted'],
  ['projectPlacements', 'Project placements'],
  ['completedCarryChains', 'Completed carry chains'],
  ['netDeliveries', 'Net deliveries'],
  ['replacements', 'Replacements'],
];

/** Same-runtime HF5 comparison set; no historical files are substituted for missing controls. */
export async function compareHF5(directory = 'viewer/runs/hf5-candidate'): Promise<string> {
  const samples = new Map<string, Record<string, number>[]>();
  let runtime: string | undefined;
  for (const arm of HF5_ARMS) {
    const observations = [];
    for (let seed = 1; seed <= 10; seed++) {
      const run = JSON.parse(await readFile(resolve(directory, `${arm}-${seed}.json`), 'utf8')) as Recording;
      if (
        run.mind !== arm ||
        run.seed !== seed ||
        run.frames.length !== 240 ||
        run.config.freeEpisodes !== 3 ||
        run.config.stepsPerEpisode !== 60 ||
        run.config.taskSteps !== 60
      )
        throw new Error(`Unexpected run ${arm}-${seed}`);
      if (arm !== 'random') {
        runtime ??= run.hf;
        if (run.hf !== runtime) throw new Error(`Mixed runtime versions in ${arm}-${seed}`);
      }
      observations.push(measureRecording(run));
    }
    samples.set(arm, observations);
  }
  const rows = [
    `HF5 comparison set; HF runtime stamp ${runtime}. Random retains its legacy recording stamp.`,
    'Exact unpaired permutation tests of absolute mean differences, including ties. Medians describe samples. Holm correction uses one eight-test family per arm vs random (seven free-time metrics plus task score), and one two-test family for hf5 vs hf4 (free Spire objects plus task score). Project metrics are descriptive only and do not enlarge these families. Families are exploratory and are not jointly corrected; large p values do not establish equivalence.',
    '',
    '| Comparison | Measure | Median A | Median B | Exact p | Holm p |',
    '|---|---|---:|---:|---:|---:|',
  ];
  const values = (arm: string, key: string) =>
    (samples.get(arm) ?? []).map(
      (m) => m[key] ?? (PROJECT_METRICS.some(([field]) => field === key) ? 0 : Number.NaN),
    );
  const append = (a: string, b: string, fields: [string, string][]) => {
    const raw = fields.map(([key]) => exactPermutation(values(a, key), values(b, key)));
    const adjusted = holmAdjust(raw);
    fields.forEach(([key, label], i) => {
      rows.push(
        `| ${a} vs ${b} | ${label} | ${median(values(a, key)).toFixed(4)} | ${median(values(b, key)).toFixed(4)} | ${raw[i]?.toFixed(6)} | ${adjusted[i]?.toFixed(6)} |`,
      );
    });
  };
  for (const arm of HF5_ARMS.filter((arm) => arm !== 'random'))
    append(arm, 'random', [...FREE_METRICS, ['taskScore', 'Task score']]);
  append('hf5', 'hf4', [
    ['freeSpireObjects', 'Spire objects'],
    ['taskScore', 'Task score'],
  ]);
  const fields: [string, string][] = [
    ['freeSpireObjects', 'Free Spire objects'],
    ['finalFreeSpireObjects', 'Final free Spire objects'],
    ...PROJECT_METRICS,
    ['taskScore', 'Task cubes'],
  ];
  rows.push(
    '',
    'Per-seed values. All project measures use free time only. Project placements require a successful place at the pre-action active project destination. Completed carry chains require pick then place of the same object within one episode without an intervening throw or loss. No movement minimum; replacing the same object counts again. Net deliveries and replacements classify the preceding successful pick by its recorded source relative to the active destination at placement; unknown pick sources are excluded. Final free Spire objects is the maximum endpoint pile across free episodes, alongside the maximum in any free frame.',
    '',
    `| Arm | Seed | ${fields.map(([, label]) => label).join(' | ')} |`,
    `|---|---:|${fields.map(() => '---:|').join('')}`,
  );
  for (const arm of HF5_ARMS)
    for (let seed = 1; seed <= 10; seed++)
      rows.push(`| ${arm} | ${seed} | ${fields.map(([key]) => values(arm, key)[seed - 1]).join(' | ')} |`);
  const medians: [string, string][] = [
    ...FREE_METRICS.flatMap(([key, label]): [string, string][] =>
      key === 'freeSpireObjects'
        ? [
            [key, label],
            ['finalFreeSpireObjects', 'Final free Spire objects'],
          ]
        : [[key, label]],
    ),
    ...PROJECT_METRICS,
    ['taskScore', 'Task cubes'],
  ];
  rows.push(
    '',
    'Medians (project metrics descriptive only).',
    '',
    `| Arm | ${medians.map(([, label]) => label).join(' | ')} |`,
    `|---|${medians.map(() => '---:|').join('')}`,
  );
  for (const arm of HF5_ARMS)
    rows.push(`| ${arm} | ${medians.map(([key]) => median(values(arm, key)).toFixed(4)).join(' | ')} |`);
  return rows.join('\n');
}
if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) {
  console.log(await compare(process.argv[2]));
}
