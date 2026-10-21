**Does HF play or build in free time? No.** These runs do not demonstrate sustained play or building on the existing measures.

**Does it complete the carry task? No.** HF4 delivers partial results: seven nonzero scores, three zeros, and at most two final cubes. The task asks for “as many as you can” without a binary threshold; final physical cube counts are the outcome, not the adapter’s achieved flag.

| Arm | Version | Cells | Entropy | Manipulation | Idle | Free Spire | Stack | Pursuit | Task |
|---|---|---:|---:|---:|---:|---:|---:|---:|---:|
| hf4 | tarball 2.11.0 | 27.5000 | 2.2522 | 0.1056 | 0.2278 | 0.0000 | 1.0000 | 0.0000 | 0.5000 |
| hf4 | published 2.12.0 | 29.5000 | 2.2541 | 0.1167 | 0.2278 | 0.0000 | 1.0000 | 0.0000 | 1.0000 |
| hf4-no-curiosity | tarball 2.11.0 | 34.0000 | 2.0537 | 0.0639 | 0.3139 | 0.0000 | 1.0000 | 0.0000 | 0.5000 |
| hf4-no-curiosity | published 2.12.0 | 34.0000 | 2.0537 | 0.0639 | 0.3139 | 0.0000 | 1.0000 | 0.0000 | 0.5000 |
| hf4-no-planning | tarball 2.11.0 | 27.5000 | 2.2522 | 0.1056 | 0.2278 | 0.0000 | 1.0000 | 0.0000 | 0.0000 |
| hf4-no-planning | published 2.12.0 | 29.5000 | 2.2541 | 0.1167 | 0.2278 | 0.0000 | 1.0000 | 0.0000 | 0.0000 |

Medians across seeds 1–10; shares are fractions. Cells through pursuit describe the three free episodes. Task is final cubes on the Spire. Stack includes existing objects.

| Arm | Tarball task cubes, seeds 1–10 | 2.12.0 task cubes, seeds 1–10 |
|---|---|---|
| hf4 | 1, 0, 2, 0, 1, 0, 1, 0, 1, 0 | 1, 0, 2, 0, 1, 0, 1, 2, 1, 1 |
| hf4-no-curiosity | 2, 0, 2, 2, 0, 0, 0, 1, 0, 4 | 2, 0, 2, 2, 0, 0, 0, 1, 0, 4 |
| hf4-no-planning | 0, 0, 0, 0, 1, 0, 0, 0, 0, 0 | 0, 0, 0, 0, 1, 0, 0, 0, 0, 0 |

HF4 gains two cubes in seed 8 (0 → 2) and one in seed 10 (0 → 1). Both curiosity-enabled arms change free-time actions only in seeds 8 and 10. The no-curiosity arm keeps every action and all eight measured outcomes. Planning-on/off free-time actions remain identical within each version. No free goal appears in any of the 30 new runs; HF4 has zero free Spire objects and zero repeated pursuit in every seed.

| Arm | Tarball nonempty task routes, seeds 1–10 | 2.12.0 nonempty task routes, seeds 1–10 |
|---|---|---|
| hf4 | 31, 44, 38, 33, 44, 51, 42, 52, 51, 39 | 31, 44, 38, 33, 44, 51, 42, 42, 51, 47 |
| hf4-no-curiosity | 33, 54, 31, 37, 39, 36, 45, 48, 37, 44 | 33, 54, 31, 37, 39, 36, 45, 48, 37, 44 |
| hf4-no-planning | 0, 0, 0, 0, 8, 0, 0, 0, 0, 0 | 0, 0, 0, 0, 8, 0, 0, 2, 0, 0 |

Counts are out of 60 selected-offer readouts, not executed plans. Both planning arms still reach three successor steps in every seed. The planning ablation retains one-hop route readouts (maximum one successor), as before. Every free-time route is empty in all arms.

Curiosity terms (`unknown`, `progress`, `vary`) remain present with a positive term in all 1,800 free decisions and all 600 task decisions per curiosity-enabled arm. The no-curiosity arm has no curiosity terms. These are score terms; the reward fix changes satisfaction after an action, not the presence of these terms.

| Arm | Measure order: cells, entropy, manipulation, idle, free Spire, stack, pursuit, task |
|---|---|
| hf4 tarball | 0.114703, 0.003464, 0.010457, 1.000000, 1.000000, 1.000000, 1.000000, 0.162539 |
| hf4 2.12.0 | 0.136017, 0.004157, 0.011063, 1.000000, 1.000000, 1.000000, 1.000000, 0.018576 |
| hf4-no-curiosity tarball | 0.585464, 0.683334, 1.000000, 0.001732, 1.000000, 1.000000, 1.000000, 0.227554 |
| hf4-no-curiosity 2.12.0 | 0.585464, 0.683334, 1.000000, 0.001732, 1.000000, 1.000000, 1.000000, 0.227554 |
| hf4-no-planning tarball | 0.114703, 0.003464, 0.010457, 1.000000, 1.000000, 1.000000, 1.000000, 1.000000 |
| hf4-no-planning 2.12.0 | 0.163221, 0.004157, 0.011063, 1.000000, 1.000000, 1.000000, 1.000000, 1.000000 |

The preceding table gives Holm-adjusted p values versus random. The same exact unpaired permutation tests enumerate all 184,756 allocations, use absolute mean differences and inclusive ties, and correct eight outcomes per arm. Families are exploratory and not jointly corrected. Full raw p values and per-seed measures are in [the comparison audit](viewer/audits/hf4-2.12.0-comparison.md).

HF4 task significance changes: raw p .032508 → .003096; Holm p .162539 → .018576. Entropy and manipulation remain significant in both curiosity arms. No-curiosity retains only its idle-share difference. Statistical separation from random does not establish task completion or play.

Why: installed 2.12.0 rewards only positive learning progress, capped by rewardMax; the tarball also rewarded unknown outcomes. Its route search rejects links whose triggers an earlier simulated action already performed. Both fixes were verified in the installed code. The changed free-time traces require no planning and are consistent with the curiosity fix. These two package versions do not isolate each fix’s task effect; the no-curiosity control shows no action or route-count change. No adapter, persona, temperature, task goal or analysis code changed.

The inherited goal still counts repeated placements and does not subtract a cube picked back up. An achieved flag therefore does not mean distinct cubes remain delivered. Symbolic Manhattan route estimates still omit terrain and do not execute a plan. Ten seeds and these behavioral measures limit the conclusion to this experiment.

Installed with `PATH=/opt/homebrew/bin:$PATH npm install --no-save --package-lock=false @adam0white/human-framework@2.12.0`; runtime `ENGINE_VERSION` is 2.12.0. package.json and package-lock.json match their original SHA-256 hashes and committed bytes. Their pin remains 2.9.0.

Preserved all 113 original recordings, including all 30 tarball HF4 runs. Added the published runs in [viewer/runs/2.12.0/](viewer/runs/2.12.0/). All 73 prior non-LLM runs reran byte-identically. HF4 seeds 1–3 each match two independent reruns and the saved bytes. Physical replay and viewer validation pass for all 113 recordings in the comparison set (83 prior plus 30 published). `npm run check` passes 117 tests; this repo has no check:lane script.

Hashes, exact tests, route/curiosity/goal audits and determinism receipts: [viewer/audits/hf4-2.12.0.json](viewer/audits/hf4-2.12.0.json). The original HF4 report remains HF4.md; the supplied island-report.md was found in shared scratch.

Reproduce one run: `node src/run.ts --mind hf4 --seed 1 --out /Users/abdul/code/.lab-scratch/hf-play/island/212/example.json`. Substitute either ablation. Batch and audit scripts: `/Users/abdul/code/.lab-scratch/hf-play/island/{generate212,audit212,summarize212}.ts`. Full analysis: call `compare` from src/compare.ts with `/Users/abdul/code/.lab-scratch/hf-play/island/212/comparison`. Done means the requested reruns, audits, this report and a signed local commit on hf4; the requester accepts the evidence. No push.
