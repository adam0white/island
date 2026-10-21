/** Reproduce the five-arm HF5 experiment: node src/generate5.ts [new-output-directory].
 * No LLM arms. Refuses to overwrite recordings. Historical runs are never loaded or changed.
 */

import { mkdir, readdir, readFile, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { pathToFileURL } from 'node:url';
import { ENGINE_VERSION } from '@adam0white/human-framework';
import { compareHF5, HF5_ARMS } from './compare.ts';
import { runIsland } from './run.ts';
import { type MindFactory, PERSONA } from './types.ts';

export async function generate5(directory = 'viewer/runs/hf5-candidate'): Promise<void> {
  const installed = JSON.parse(
    await readFile(new URL(import.meta.resolve('@adam0white/human-framework/package.json')), 'utf8'),
  ) as { version: string };
  console.log(`Installed @adam0white/human-framework package version: ${installed.version}`);
  console.log(`Runtime ENGINE_VERSION: ${ENGINE_VERSION}`);
  const output = resolve(directory);
  await mkdir(output, { recursive: true });
  if ((await readdir(output)).length) throw new Error(`Output directory must be empty: ${output}`);
  const index = [];
  for (const arm of HF5_ARMS) {
    const module = (await import(`./minds/${arm.startsWith('hf5') ? 'hf5' : arm}.ts`)) as {
      default: MindFactory;
    };
    for (let seed = 1; seed <= 10; seed++) {
      const mind = module.default({ seed, persona: PERSONA, arm });
      const recording = await runIsland(mind, seed);
      const file = `${arm}-${seed}.json`;
      await writeFile(resolve(output, file), `${JSON.stringify(recording, null, 2)}\n`, { flag: 'wx' });
      index.push({ file, mind: recording.mind, seed, measures: recording.measures });
      console.log(`Saved ${arm} seed ${seed}`);
    }
  }
  await writeFile(resolve(output, 'index.json'), `${JSON.stringify(index, null, 2)}\n`, { flag: 'wx' });
  const report = await compareHF5(output);
  await writeFile(resolve(output, 'comparison.md'), `${report}\n`, { flag: 'wx' });
  await writeFile(
    resolve(output, 'runtime.json'),
    `${JSON.stringify({ packageVersion: installed.version, ENGINE_VERSION }, null, 2)}\n`,
    { flag: 'wx' },
  );
  console.log(report);
  console.log(`Recordings and comparison: ${output}`);
}

if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) {
  generate5(process.argv[2]).catch((error: unknown) => {
    console.error(error instanceof Error ? error.message : String(error));
    process.exitCode = 1;
  });
}
