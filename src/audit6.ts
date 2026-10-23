/** Validate published roadmap recordings, matched legacy continuation, and deterministic reruns. */

import { execFileSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { readFile, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { isDeepStrictEqual } from 'node:util';
import { ENGINE_VERSION } from '@adam0white/human-framework';
import { median } from './compare.ts';
import { rerunContrast } from './compare5-rerun.ts';
import { measureRecording } from './measures.ts';
import { Hf6Mind } from './minds/hf6.ts';
import { runIsland } from './run.ts';
import { PERSONA, type Recording } from './types.ts';
import { apply, createWorld, reset } from './world.ts';
import '../viewer/viewer.js';

const directory = resolve(process.argv[2] ?? 'viewer/runs/hf6-2.17.0');
const prior = resolve('viewer/runs/hf5-2.14.1');
const arms = ['hf6', 'hf6-no-protection', 'hf6-no-handoff', 'hf6-learned', 'hf5', 'hf4', 'random'];
const runtime = JSON.parse(await readFile(resolve(directory, 'runtime.json'), 'utf8')) as {
  packageVersion: string;
  ENGINE_VERSION: string;
};
if (runtime.packageVersion !== ENGINE_VERSION || runtime.ENGINE_VERSION !== ENGINE_VERSION)
  throw new Error('Runtime mismatch');
const records = new Map<string, Recording[]>();
const receipts: object[] = [];
for (const arm of arms) {
  const sample: Recording[] = [];
  for (let seed = 1; seed <= 10; seed++) {
    const filename = `${arm}-${seed}.json`;
    const bytes = await readFile(resolve(directory, filename), 'utf8');
    const recording = JSON.parse(bytes) as Recording;
    if (
      recording.mind !== arm ||
      recording.seed !== seed ||
      (arm !== 'random' && recording.hf !== ENGINE_VERSION) ||
      recording.frames.length !== 240
    )
      throw new Error(`Unexpected input: ${filename}`);
    const viewer = Reflect.get(globalThis, 'IslandReplay') as {
      validateRecording: (r: Recording) => unknown;
    };
    viewer.validateRecording(recording);
    let world = createWorld(seed);
    let episode = 0;
    for (const frame of recording.frames) {
      if (frame.e !== episode) {
        world = reset(world);
        episode = frame.e;
      }
      const result = apply(world, frame.action);
      world = result.state;
      const objects = world.objects.flatMap((o) =>
        o.at ? [{ id: o.id, x: o.at.x, y: o.at.y, level: o.level }] : [],
      );
      if (
        !isDeepStrictEqual(
          [world.me, world.carrying, objects, result.events],
          [frame.me, frame.carrying, frame.objects, frame.events],
        )
      )
        throw new Error(`Replay mismatch ${filename} ${frame.e}/${frame.s}`);
    }
    let legacy: boolean | undefined;
    if (['hf5', 'hf4', 'random'].includes(arm)) {
      const old = JSON.parse(await readFile(resolve(prior, filename), 'utf8')) as Recording;
      legacy = isDeepStrictEqual([recording.frames, recording.notes], [old.frames, old.notes]);
      if (!legacy) throw new Error(`Legacy continuation changed: ${filename}`);
    }
    let deterministic: boolean | undefined;
    if (arm === 'hf6' && seed <= 3) {
      const repeat = await runIsland(new Hf6Mind({ seed, persona: PERSONA, arm }), seed);
      deterministic = bytes === `${JSON.stringify(repeat, null, 2)}\n`;
      if (!deterministic) throw new Error(`Determinism mismatch: ${filename}`);
    }
    recording.measures = measureRecording(recording);
    sample.push(recording);
    const priorProjectIds = new Set(
      recording.frames
        .filter((f) => f.e < recording.config.freeEpisodes)
        .flatMap((f) => f.inner?.projects?.map((g) => g.goalId) ?? []),
    );
    const taskOpening = recording.frames.find((f) => f.e === recording.config.freeEpisodes);
    const reusedTaskProject =
      taskOpening?.inner?.goals?.some((g) => g.source === 'task' && priorProjectIds.has(g.id)) ?? false;
    receipts.push({
      reusedTaskProject,
      filename,
      sha256: createHash('sha256').update(bytes).digest('hex'),
      replay: true,
      viewer: true,
      legacy,
      deterministic,
    });
  }
  records.set(arm, sample);
}
const values = (arm: string) => (records.get(arm) ?? []).map((r) => r.measures);
const keys = [
  'freeSpireObjects',
  'finalFreeSpireObjects',
  'netDeliveries',
  'replacements',
  'completedCarryChains',
  'taskScore',
];
const summary = Object.fromEntries(
  arms.map((arm) => [
    arm,
    Object.fromEntries(
      keys.map((key) => [
        key,
        {
          values: values(arm).map((m) => m[key] ?? 0),
          median: median(values(arm).map((m) => m[key] ?? 0)),
          sum: values(arm).reduce((n, m) => n + (m[key] ?? 0), 0),
        },
      ]),
    ),
  ]),
);
const rows = [
  'Exploratory exact unpaired permutation tests, inclusive ties. One five-test Holm family per contrast (free peak Spire pile, project deliveries, replacements, chains, task cubes). Terrain is seed matched but this retains the historical unpaired procedure. Families are not jointly corrected. Legacy controls have zero project measures by definition; those contrasts do not establish absence of physical transport.',
  '',
  '| Comparison | Measure | Median A | Median B | Exact p | Holm p |',
  '|---|---|---:|---:|---:|---:|',
];
for (const arm of arms.filter((arm) => arm !== 'hf6'))
  rows.push(...rerunContrast(values('hf6'), values(arm)).map((row) => `| hf6 vs ${arm} | ${row}`));
const preservation = [];
for (const file of [
  'package.json',
  'package-lock.json',
  ...execFileSync('git', ['ls-files', 'viewer/runs'], { encoding: 'utf8' }).trim().split('\n'),
]) {
  const current = await readFile(file);
  const committed = execFileSync('git', ['show', `HEAD:${file}`], { maxBuffer: 100 * 1024 * 1024 });
  if (!current.equals(committed)) throw new Error(`Prior bytes changed: ${file}`);
  preservation.push({ file, sha256: createHash('sha256').update(current).digest('hex') });
}
const publishedInstall = JSON.parse(
  await readFile(resolve(directory, 'published-install.json'), 'utf8'),
) as unknown;
await writeFile(
  resolve(directory, 'audit.json'),
  `${JSON.stringify({ runtime, publishedInstall, preservation, receipts, summary }, null, 2)}\n`,
);
await writeFile(resolve(directory, 'comparison.md'), `${rows.join('\n')}\n`);
console.log(JSON.stringify({ runtime, validated: receipts.length, summary }, null, 2));
