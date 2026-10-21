/** Published rerun: retain legacy comparison families and report a separate five-test family per contrast. */
import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { pathToFileURL } from 'node:url';
import { exactPermutation, holmAdjust, median } from './compare.ts';
import { measureRecording } from './measures.ts';
import type { Recording } from './types.ts';

export const RERUN_METRICS: [string, string][] = [
  ['freeSpireObjects', 'Free Spire objects (max any frame)'],
  ['netDeliveries', 'Net deliveries'],
  ['replacements', 'Replacements'],
  ['completedCarryChains', 'Completed chains'],
  ['taskScore', 'Task cubes'],
];

export function rerunContrast(a: Record<string, number>[], b: Record<string, number>[]): string[] {
  const values = (sample: Record<string, number>[], key: string) => sample.map((m) => m[key] ?? 0);
  const raw = RERUN_METRICS.map(([key]) => exactPermutation(values(a, key), values(b, key)));
  const adjusted = holmAdjust(raw);
  return RERUN_METRICS.map(
    ([key, label], i) =>
      `${label} | ${median(values(a, key)).toFixed(4)} | ${median(values(b, key)).toFixed(4)} | ${raw[i]?.toFixed(6)} | ${adjusted[i]?.toFixed(6)} |`,
  );
}

export async function compareRerun(
  current = 'viewer/runs/hf5-2.14.1',
  prior = 'viewer/runs/hf5-2.14.0',
): Promise<string> {
  const load = async (directory: string, arm: string, version: string) => {
    const sample = [];
    for (let seed = 1; seed <= 10; seed++) {
      const run = JSON.parse(await readFile(resolve(directory, `${arm}-${seed}.json`), 'utf8')) as Recording;
      if (
        run.seed !== seed ||
        run.mind !== arm ||
        (arm !== 'random' && run.hf !== version) ||
        run.frames.length !== 240 ||
        run.config.freeEpisodes !== 3 ||
        run.config.stepsPerEpisode !== 60 ||
        run.config.taskSteps !== 60
      )
        throw new Error(`Unexpected rerun input ${directory}/${arm}-${seed}`);
      sample.push(measureRecording(run));
    }
    return sample;
  };
  const a = await load(current, 'hf5', '2.14.1');
  const rows = [
    'Exact unpaired permutation tests of absolute mean differences, inclusive ties; medians describe samples. Each contrast is a separate five-test Holm family (free Spire objects, net deliveries, replacements, completed chains, task cubes). Families are exploratory and not jointly corrected. Seeds share terrain, but these tests are unpaired as in the existing machinery. Random/HF4 have no active-project audit, so their project-delivery/replacement/chain measures are zero by definition; these contrasts cannot establish less physical transport by controls. Large p values do not establish equivalence.',
    '',
    '| Comparison | Measure | Median A | Median B | Exact p | Holm p |',
    '|---|---|---:|---:|---:|---:|',
  ];
  for (const [directory, arm, version] of [
    [prior, 'hf5', '2.14.0'],
    [current, 'random', '2.14.1'],
    [current, 'hf4', '2.14.1'],
  ]) {
    const label = `hf5 2.14.1 vs ${arm} ${arm === 'random' ? '2.14.1 batch' : version}`;
    const b = await load(directory as string, arm as string, version as string);
    rows.push(...rerunContrast(a, b).map((row) => `| ${label} | ${row}`));
  }
  return rows.join('\n');
}

if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href)
  console.log(await compareRerun(process.argv[2], process.argv[3]));
