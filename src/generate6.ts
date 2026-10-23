/** Matched roadmap sweep. Historical HF5 is unchanged; all arms use one installed runtime. */
import { mkdir, readdir, readFile, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { ENGINE_VERSION } from '@adam0white/human-framework';
import { Hf4Mind } from './minds/hf4.ts';
import { Hf5Mind } from './minds/hf5.ts';
import { Hf6Mind } from './minds/hf6.ts';
import random from './minds/random.ts';
import { runIsland } from './run.ts';
import { PERSONA } from './types.ts';

export const ARMS = [
  'hf6',
  'hf6-no-protection',
  'hf6-no-handoff',
  'hf6-learned',
  'hf5',
  'hf4',
  'random',
] as const;
const output = resolve(process.argv[2] ?? 'viewer/runs/hf6-candidate');
await mkdir(output, { recursive: true });
if ((await readdir(output)).length) throw new Error(`Output directory must be empty: ${output}`);
const installed = JSON.parse(
  await readFile(new URL(import.meta.resolve('@adam0white/human-framework/package.json')), 'utf8'),
) as { version: string };
await writeFile(
  resolve(output, 'runtime.json'),
  `${JSON.stringify({ packageVersion: installed.version, ENGINE_VERSION }, null, 2)}\n`,
);
const localLock = JSON.parse(await readFile('node_modules/.package-lock.json', 'utf8')) as {
  packages: Record<string, { version?: string; resolved?: string; integrity?: string }>;
};
const dependency = localLock.packages['node_modules/@adam0white/human-framework'];
await writeFile(
  resolve(output, 'published-install.json'),
  `${JSON.stringify(
    {
      installedVersion: installed.version,
      url: dependency?.resolved,
      integrity: dependency?.integrity,
      source: 'npm installed dependency receipt; verify registry provenance separately',
    },
    null,
    2,
  )}\n`,
);
const index = [];
for (const arm of ARMS) {
  for (let seed = 1; seed <= 10; seed++) {
    const options = { seed, persona: PERSONA, arm };
    const mind = arm.startsWith('hf6')
      ? new Hf6Mind(options)
      : arm === 'hf5'
        ? new Hf5Mind(options)
        : arm === 'hf4'
          ? new Hf4Mind(options)
          : random(options);
    const recording = await runIsland(mind, seed);
    const file = `${arm}-${seed}.json`;
    await writeFile(resolve(output, file), `${JSON.stringify(recording, null, 2)}\n`, { flag: 'wx' });
    index.push({ file, mind: recording.mind, seed, measures: recording.measures });
    console.log(
      `${arm} ${seed}: task ${recording.measures.taskScore}, net ${recording.measures.netDeliveries}, replacements ${recording.measures.replacements}`,
    );
  }
}
await writeFile(resolve(output, 'index.json'), `${JSON.stringify(index, null, 2)}\n`, { flag: 'wx' });
