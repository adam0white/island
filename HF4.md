# Island HF4: curiosity and bounded planning

Done means: three HF4 arms, ten seeds each, route and curiosity audits, deterministic HF4 seeds 1–3, preserved prior recordings, exact comparisons, passing checks, this report and a signed local commit on hf4. The requester accepts the code and evidence. No push or publication.

**Does HF4 now play or build in free time? No demonstrated sustained play or building on the existing measures.** It does more varied object manipulation: median manipulation share is 10.56% versus random's 3.89%, and action-kind entropy is higher. That is evidence of exploration, not enough to establish self-directed play or a building project. “No” here is a behavioral conclusion under these measures, not a claim about an inner experience. No free-time goal is proposed in any new run. HF4 has zero free Spire objects and zero repeated pursuit in all ten seeds. Some stacks reach two, as they do in random. Planning-on and planning-off free-time action traces are identical for every seed.

**Does it complete the carry task? No.** HF4 finishes with 1, 0, 2, 0, 1, 0, 1, 0, 1, 0 cubes for seeds 1–10: five partial results and five zeros. It does not accumulate the initial ten cubes on the Spire. The task text asks for as many cubes as possible, so it supplies no binary success threshold; final cube counts are the primary outcome. The inherited placement-count goal is marked achieved in HF4 seeds 1, 3, 4 and 7, despite final scores of 1, 2, 0 and 1. It counts repeated placement of the same cube and does not undo progress when a cube is picked back up. This goal status is not task completion. No new task score differs from random after Holm correction. Removing curiosity has descriptively higher task scores; these runs do not establish that curiosity harms task performance.

## Construction and adapter rules

HF4 subclasses the HF2/HF3 adapter. Person, temperament, softmax temperature .03, per-minute activities, learning, memory, engagement, boredom, task importance .5, temporal half-life 60 minutes, and actual-placement progress .1 stay the same. hf4 enables default curiosity plus planning depth 4; hf4-no-curiosity enables planning only; hf4-no-planning enables curiosity only. No free goal, task-specific intermediate advance or task interpreter is added. Only real completed placement advances the task.

Installed with npm install --no-save --package-lock=false /Users/abdul/code/.lab-scratch/hf-play/pack/adam0white-human-framework-2.11.0.tgz. This candidate contains both faculties; runtime engine and package version are 2.11.0. package.json and package-lock.json remain pinned to the original 2.9.0 bytes. New arms record the runtime engine stamp. A lead can install published 2.12.0 and rerun; compare accepts either candidate 2.11.0 or published 2.12.0 for new arms. Old recording stamps remain 2.9.0.

Claims use seedConsequences(person, 'island', claims), with channel known, bypassing attention and source trust as permitted by the brief. The HF4 generator replaces HF3's attended testimony and also preserves its immediate pick/move-to-placement semantics for cubes, rock and ring as seeded facts. All three new arms receive the same generator in free and task time. It never reads obs.task or the agenda. HF3 remains unchanged as historical context, not a clean faculty-only control.

Object locations come from current observations and public HF recall, newest exact target identity first. Body position uses inherited dead reckoning. There is no world import, hidden map, terrain search, route execution or taskAdvances. Unknown or stale terrain is not resolved from the runner's world. Each movement still has one offer per legal input.

For each known cube, each current legal move/jump reducing Manhattan distance can trigger a future pickup at that cube's cell. Its exact action/targetId/placeId comes from the actual offer. availableFrom is now + Manhattan walking distance; pickup duration is 1. This describes arrival all the way at the cube, though actual pickups are also legal from an adjacent cell. Actual available pickups get additional chains from the current body position. Pickup permits a carry successor whose duration is max(1, Manhattan distance from pickup body to Spire); carry permits one-minute cube placement on the Spire. Short successor windows end one minute after the estimated successor completion. Immediate observed steps have chance 1; unknown multi-step travel and speculative carry links use chance .7, confidence 1. Manhattan timings are lower-bound estimates, not path guarantees.

Carrying moves reducing distance to a known Spire use targetId = carried object, placeId = Spire cell. This HF4 identity refinement distinguishes cubes, prevents chains from switching payloads, and matches the synthetic carrying successor exactly. The input, effort, reward, advertised needs and goal links are unchanged. fromMemory records whether that destination was recalled. Other movement representatives and all inputs follow HF3. This is another adapter difference from historical HF3.

Claims use chain-00 through chain-63, revision = current minute. Unused old slots are superseded by infeasible, immediately expiring placeholders before current claims are seeded. This prevents a prior body/reset context from keeping a long-distance claim. Four-entry batches are valid with and without planning. The generator admits at most 64 claims; HF retains 64 with planning and 16 without planning. This retention change is part of the API's planning package, so its ablation does not isolate search depth from retention. Finite capacity can omit later cubes or immediate claims.

Each frame records inner.route (public planRoute for the selected offer, read before begin/tick) and inner.curiosityTerms (the chosen score's curiosity:unknown, curiosity:progress, curiosity:vary terms). Empty route means no route improved the scored baseline, not no physical path. A regression test verifies a real movement identity receives pick → carry → place, without granting goal progress. The viewer validates both nested audit fields.

## Results

Medians across ten seeds. Cells, entropy, manipulation, idle, Spire objects, stack and pursuit are the existing free-time measures. Task is final cubes on the Spire. Shares are fractions. Tallest stack includes existing objects; pursuit requires two carrying moves toward an observed eventual destination and does not by itself prove intention.

| Arm | Cells | Entropy | Manipulation | Idle | Free Spire | Stack | Pursuit | Task |
|---|---:|---:|---:|---:|---:|---:|---:|---:|
| random | 41.5000 | 1.9857 | 0.0389 | 0.2167 | 0.0000 | 1.0000 | 0.0000 | 0.0000 |
| hf3 | 35.0000 | 2.0537 | 0.0639 | 0.3111 | 0.0000 | 1.0000 | 0.0000 | 0.0000 |
| hf4 | 27.5000 | 2.2522 | 0.1056 | 0.2278 | 0.0000 | 1.0000 | 0.0000 | 0.5000 |
| hf4-no-curiosity | 34.0000 | 2.0537 | 0.0639 | 0.3139 | 0.0000 | 1.0000 | 0.0000 | 0.5000 |
| hf4-no-planning | 27.5000 | 2.2522 | 0.1056 | 0.2278 | 0.0000 | 1.0000 | 0.0000 | 0.0000 |

| Arm | Task cubes for seeds 1–10 |
|---|---|
| random | 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 |
| hf3 | 1, 0, 0, 1, 0, 1, 0, 0, 0, 0 |
| hf4 | 1, 0, 2, 0, 1, 0, 1, 0, 1, 0 |
| hf4-no-curiosity | 2, 0, 2, 2, 0, 0, 0, 1, 0, 4 |
| hf4-no-planning | 0, 0, 0, 0, 1, 0, 0, 0, 0, 0 |

For HF4 versus random, Holm p is .003464 for entropy and .010457 for manipulation. All other corrected p values exceed .05; task raw p = .032508, Holm p = .162539. hf4-no-planning has the same free-time measures and p values. hf4-no-curiosity differs only in idle share (Holm .001732); its raw task p .032508 becomes .227554 after correction. Each arm-versus-random family contains seven free-time metrics plus task score. Tests enumerate all C(20,10)=184756 allocations, use absolute mean differences and inclusive ties. Matched seeds are retained, but tests are unpaired. Families are exploratory and not jointly corrected. Large p values do not establish equivalence.

HF4 selected offers have nonempty task route readouts on 31, 44, 38, 33, 44, 51, 42, 52, 51, 39 of 60 frames for seeds 1–10. Every seed includes a three-successor route. Curiosity has a positive term in all 1,800 HF4 free-time decisions. Yet no repeated-pursuit bout appears. Route valuation and exploration therefore activate; their presence alone does not establish task completion or sustained play.

## Framework limits, with evidence

The candidate's dist/prospection/prospection.js:receivedGoalRoute returns before search unless there is an active temporal goal. Thus planning has no free-time route value in these runs. The free-time traces match planning-off byte-for-byte in actions. Curiosity affects exploration directly, but it does not itself author a goal. In these runs HF's unchanged hourly proposer produces no free-time goal (all 30 new goal audits have none).

Planning searches retained action-identity chains with depth 4 and a 64-node budget. It selects value for one current affordance; it does not execute, commit to or monitor a multi-action plan. HF4 records long routes while still ending at zero task cubes in five seeds. This is evidence that route valuation is insufficient here, not proof that no HF configuration could complete the task.

The planner models gaps by max(previousEnd, availableFrom), without intermediate body transitions or waiting-opportunity cost. Future successor costs are evaluated as one affordance; duration does not multiply effort/focus cost. Our aggregate carry duration therefore affects time discount and feasibility, but does not account for cumulative walking effort. These are observable API/model bounds; they limit the realism of long routes.

## Adapter and experiment limits

The adapter supplies symbolic pick/carry/place semantics and Manhattan estimates. The walk-to-pick gap represents additional walking without presenting each action as a retained node. The carry successor summarizes several future one-cell actions with the same identity. No executor follows this summary, and .7 is an engineering prior, not a terrain-derived probability. The body may pick from a different adjacent cell, face obstacles, lose sight, or choose another action. We do not claim this is a fully physical plan.

The inherited endpoint goal counts placement events, not distinct cubes retained on the Spire. HF4 seed 1 repeatedly picks and replaces cube-3 on the Spire, reaches achieved after the eleventh placement (floating-point increments), and finishes with one cube. Removing an object never reduces goal progress. This is an adapter goal-definition failure, not evidence that HF completed the carry task. We retain it for comparability and score physical final cubes independently.

Spire identities and known rather than attended claims change the adapter relative to HF3. Planning also changes retained capacity. These prevent attributing HF3→HF4 differences solely to the two faculties. Within HF4, curiosity-on/off share planning capacity and knowledge rules; planning-on/off includes the API's retention change. Ten seeds and weak existing behavioral measures cannot settle a general claim about play. We did not fit persona, curiosity scales, goal importance, temperature or task links to improve scores.

## Verification and reproduction

All 83 prior recordings match starting byte hashes. All 73 saved non-LLM prior arms rerun byte-identically under the candidate, including hf, hf2 variants, hf3 and random: no engine-only difference was observed. Old recordings were never rewritten. All 113 recordings pass physical replay against the world engine and viewer validation. HF4 seeds 1–3 were independently run twice and both results match the saved recording byte-for-byte. Scratch determinism4.json contains all three SHA-256 hashes per seed; legacy-hashes4.json and compatibility4.json contain preservation/compatibility evidence. audit4.json contains route counts, goal statuses and replay coverage.

npm run check passes 117 tests. The runner and mocked-backend tests now write scratch outside the human-framework repository; no real LLM call was made. No human-framework source was touched. Independent adapter and results reviews checked chain identities, claim expiry, statistics and saved frame evidence; the carrying-away claim error was fixed and all runs regenerated before reporting. No credentials or remote operations were used.

Generate a run: node src/run.ts --mind hf4 --seed 1 --out /Users/abdul/code/.lab-scratch/hf-play/island/example-hf4-1.json. Substitute either ablation name. Recordings to retain go under viewer/runs/. Run node src/compare.ts for the full tables below. The executed batch generator, replay audit and report generator are in /Users/abdul/code/.lab-scratch/hf-play/island/generate4.ts, audit4.ts and report4.ts. Their outputs are scratch evidence, not commits.

## Full exact comparison and per-seed values

Exact unpaired permutation tests of absolute mean differences, including ties. Medians describe samples. Holm correction uses one eight-test family per arm vs random (seven free-time metrics plus task score), one singleton family per task-score comparison vs hf or hf2, and one two-test family per hf2 ablation comparison. Families are exploratory and are not jointly corrected; large p values do not establish equivalence. The hf baseline has no task comparison with itself.

| Comparison | Measure | Median A | Median B | Exact p | Holm p |
|---|---|---:|---:|---:|---:|
| hf vs random | Cells visited | 21.5000 | 41.5000 | 0.000368 | 0.002576 |
| hf vs random | Kind entropy | 2.2745 | 1.9857 | 0.000076 | 0.000606 |
| hf vs random | Manipulation share | 0.0889 | 0.0389 | 0.003009 | 0.018056 |
| hf vs random | Idle share | 0.2750 | 0.2167 | 0.022949 | 0.114746 |
| hf vs random | Spire objects | 0.0000 | 0.0000 | 1.000000 | 1.000000 |
| hf vs random | Tallest stack | 1.0000 | 1.0000 | 0.582043 | 1.000000 |
| hf vs random | Repeated pursuit | 0.0000 | 0.0000 | 1.000000 | 1.000000 |
| hf vs random | Task score | 0.0000 | 0.0000 | 0.210526 | 0.842105 |
| hf2 vs random | Cells visited | 36.0000 | 41.5000 | 0.160146 | 1.000000 |
| hf2 vs random | Kind entropy | 2.0537 | 1.9857 | 0.160255 | 1.000000 |
| hf2 vs random | Manipulation share | 0.0639 | 0.0389 | 0.217314 | 1.000000 |
| hf2 vs random | Idle share | 0.3111 | 0.2167 | 0.000314 | 0.002511 |
| hf2 vs random | Spire objects | 0.0000 | 0.0000 | 1.000000 | 1.000000 |
| hf2 vs random | Tallest stack | 1.0000 | 1.0000 | 1.000000 | 1.000000 |
| hf2 vs random | Repeated pursuit | 0.0000 | 0.0000 | 1.000000 | 1.000000 |
| hf2 vs random | Task score | 0.0000 | 0.0000 | 1.000000 | 1.000000 |
| hf2-no-memory vs random | Cells visited | 37.0000 | 41.5000 | 0.320791 | 1.000000 |
| hf2-no-memory vs random | Kind entropy | 2.2009 | 1.9857 | 0.000650 | 0.005196 |
| hf2-no-memory vs random | Manipulation share | 0.1000 | 0.0389 | 0.002078 | 0.012471 |
| hf2-no-memory vs random | Idle share | 0.3028 | 0.2167 | 0.001028 | 0.007199 |
| hf2-no-memory vs random | Spire objects | 0.0000 | 0.0000 | 1.000000 | 1.000000 |
| hf2-no-memory vs random | Tallest stack | 1.0000 | 1.0000 | 1.000000 | 1.000000 |
| hf2-no-memory vs random | Repeated pursuit | 0.0000 | 0.0000 | 1.000000 | 1.000000 |
| hf2-no-memory vs random | Task score | 0.0000 | 0.0000 | 1.000000 | 1.000000 |
| hf2-no-boredom vs random | Cells visited | 41.0000 | 41.5000 | 0.616251 | 1.000000 |
| hf2-no-boredom vs random | Kind entropy | 2.0482 | 1.9857 | 0.196540 | 1.000000 |
| hf2-no-boredom vs random | Manipulation share | 0.0667 | 0.0389 | 0.098974 | 0.692816 |
| hf2-no-boredom vs random | Idle share | 0.3083 | 0.2167 | 0.000455 | 0.003637 |
| hf2-no-boredom vs random | Spire objects | 0.0000 | 0.0000 | 1.000000 | 1.000000 |
| hf2-no-boredom vs random | Tallest stack | 1.0000 | 1.0000 | 1.000000 | 1.000000 |
| hf2-no-boredom vs random | Repeated pursuit | 0.0000 | 0.0000 | 0.303406 | 1.000000 |
| hf2-no-boredom vs random | Task score | 0.0000 | 0.0000 | 1.000000 | 1.000000 |
| hf3 vs random | Cells visited | 35.0000 | 41.5000 | 0.166782 | 1.000000 |
| hf3 vs random | Kind entropy | 2.0537 | 1.9857 | 0.282178 | 1.000000 |
| hf3 vs random | Manipulation share | 0.0639 | 0.0389 | 0.313560 | 1.000000 |
| hf3 vs random | Idle share | 0.3111 | 0.2167 | 0.000271 | 0.002165 |
| hf3 vs random | Spire objects | 0.0000 | 0.0000 | 0.473684 | 1.000000 |
| hf3 vs random | Tallest stack | 1.0000 | 1.0000 | 1.000000 | 1.000000 |
| hf3 vs random | Repeated pursuit | 0.0000 | 0.0000 | 1.000000 | 1.000000 |
| hf3 vs random | Task score | 0.0000 | 0.0000 | 0.210526 | 1.000000 |
| hf4 vs random | Cells visited | 27.5000 | 41.5000 | 0.019117 | 0.114703 |
| hf4 vs random | Kind entropy | 2.2522 | 1.9857 | 0.000433 | 0.003464 |
| hf4 vs random | Manipulation share | 0.1056 | 0.0389 | 0.001494 | 0.010457 |
| hf4 vs random | Idle share | 0.2278 | 0.2167 | 0.543982 | 1.000000 |
| hf4 vs random | Spire objects | 0.0000 | 0.0000 | 1.000000 | 1.000000 |
| hf4 vs random | Tallest stack | 1.0000 | 1.0000 | 1.000000 | 1.000000 |
| hf4 vs random | Repeated pursuit | 0.0000 | 0.0000 | 1.000000 | 1.000000 |
| hf4 vs random | Task score | 0.5000 | 0.0000 | 0.032508 | 0.162539 |
| hf4-no-curiosity vs random | Cells visited | 34.0000 | 41.5000 | 0.097577 | 0.585464 |
| hf4-no-curiosity vs random | Kind entropy | 2.0537 | 1.9857 | 0.136667 | 0.683334 |
| hf4-no-curiosity vs random | Manipulation share | 0.0639 | 0.0389 | 0.253047 | 1.000000 |
| hf4-no-curiosity vs random | Idle share | 0.3139 | 0.2167 | 0.000217 | 0.001732 |
| hf4-no-curiosity vs random | Spire objects | 0.0000 | 0.0000 | 0.473684 | 1.000000 |
| hf4-no-curiosity vs random | Tallest stack | 1.0000 | 1.0000 | 1.000000 | 1.000000 |
| hf4-no-curiosity vs random | Repeated pursuit | 0.0000 | 0.0000 | 1.000000 | 1.000000 |
| hf4-no-curiosity vs random | Task score | 0.5000 | 0.0000 | 0.032508 | 0.227554 |
| hf4-no-planning vs random | Cells visited | 27.5000 | 41.5000 | 0.019117 | 0.114703 |
| hf4-no-planning vs random | Kind entropy | 2.2522 | 1.9857 | 0.000433 | 0.003464 |
| hf4-no-planning vs random | Manipulation share | 0.1056 | 0.0389 | 0.001494 | 0.010457 |
| hf4-no-planning vs random | Idle share | 0.2278 | 0.2167 | 0.543982 | 1.000000 |
| hf4-no-planning vs random | Spire objects | 0.0000 | 0.0000 | 1.000000 | 1.000000 |
| hf4-no-planning vs random | Tallest stack | 1.0000 | 1.0000 | 1.000000 | 1.000000 |
| hf4-no-planning vs random | Repeated pursuit | 0.0000 | 0.0000 | 1.000000 | 1.000000 |
| hf4-no-planning vs random | Task score | 0.0000 | 0.0000 | 1.000000 | 1.000000 |
| hf2 vs hf | Task score | 0.0000 | 0.0000 | 0.210526 | 0.210526 |
| hf2-no-memory vs hf | Task score | 0.0000 | 0.0000 | 0.210526 | 0.210526 |
| hf2-no-boredom vs hf | Task score | 0.0000 | 0.0000 | 0.210526 | 0.210526 |
| hf3 vs hf | Task score | 0.0000 | 0.0000 | 0.568111 | 0.568111 |
| hf4 vs hf | Task score | 0.5000 | 0.0000 | 1.000000 | 1.000000 |
| hf4-no-curiosity vs hf | Task score | 0.5000 | 0.0000 | 0.469874 | 0.469874 |
| hf4-no-planning vs hf | Task score | 0.0000 | 0.0000 | 0.210526 | 0.210526 |
| hf3 vs hf2 | Task score | 0.0000 | 0.0000 | 0.210526 | 0.210526 |
| hf4 vs hf2 | Task score | 0.5000 | 0.0000 | 0.032508 | 0.032508 |
| hf2 vs hf2-no-boredom | Task score | 0.0000 | 0.0000 | 1.000000 | 1.000000 |
| hf2 vs hf2-no-boredom | Remembered-target moves (all) | 7.0000 | 9.0000 | 0.760300 | 1.000000 |
| hf2 vs hf2-no-memory | Task score | 0.0000 | 0.0000 | 1.000000 | 1.000000 |
| hf2 vs hf2-no-memory | Remembered-target moves (all) | 7.0000 | 0.0000 | 0.000011 | 0.000022 |
| hf2 vs hf2-no-goals | Task score | 0.0000 | 0.0000 | 1.000000 | 1.000000 |
| hf2 vs hf2-no-goals | Remembered-target moves (all) | 7.0000 | 7.0000 | 1.000000 | 1.000000 |

Per-seed values (vectors follow the listed seed order). Spire objects, tallest stack and repeated pursuit use free time; task score is final task cubes on the Spire.

| Arm | Seeds | Spire objects | Tallest stack | Repeated pursuit | Task score |
|---|---|---|---|---|---|
| hf | 1, 2, 3, 4, 5, 6, 7, 8, 9, 10 | 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 | 1, 1, 1, 1, 1, 2, 1, 1, 1, 1 | 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 | 2, 0, 2, 0, 0, 0, 0, 2, 0, 0 |
| hf-no-boredom | 1, 2, 3 | 0, 0, 0 | 1, 1, 1 | 0, 0, 0 | 2, 1, 3 |
| hf2 | 1, 2, 3, 4, 5, 6, 7, 8, 9, 10 | 0, 0, 0, 1, 0, 0, 0, 0, 0, 0 | 1, 1, 1, 2, 1, 1, 2, 1, 2, 1 | 0, 0, 0, 0, 0, 0, 0, 0, 0, 1 | 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 |
| hf2-no-boredom | 1, 2, 3, 4, 5, 6, 7, 8, 9, 10 | 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 | 1, 1, 1, 2, 1, 2, 1, 1, 1, 2 | 1, 0, 1, 0, 0, 1, 0, 0, 0, 1 | 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 |
| hf2-no-goals | 1, 2, 3, 4, 5, 6, 7, 8, 9, 10 | 0, 0, 0, 1, 0, 0, 0, 0, 0, 0 | 1, 1, 1, 2, 1, 1, 2, 1, 2, 1 | 0, 0, 0, 0, 0, 0, 0, 0, 0, 1 | 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 |
| hf2-no-memory | 1, 2, 3, 4, 5, 6, 7, 8, 9, 10 | 1, 0, 0, 0, 0, 0, 0, 0, 0, 0 | 1, 1, 1, 3, 1, 1, 1, 1, 1, 1 | 0, 0, 0, 0, 0, 0, 0, 0, 0, 1 | 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 |
| hf3 | 1, 2, 3, 4, 5, 6, 7, 8, 9, 10 | 0, 0, 0, 1, 0, 0, 1, 0, 0, 0 | 1, 1, 1, 2, 1, 1, 2, 1, 2, 1 | 0, 0, 0, 0, 0, 0, 0, 0, 0, 1 | 1, 0, 0, 1, 0, 1, 0, 0, 0, 0 |
| hf4 | 1, 2, 3, 4, 5, 6, 7, 8, 9, 10 | 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 | 1, 1, 1, 1, 2, 2, 1, 1, 2, 1 | 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 | 1, 0, 2, 0, 1, 0, 1, 0, 1, 0 |
| hf4-no-curiosity | 1, 2, 3, 4, 5, 6, 7, 8, 9, 10 | 0, 0, 0, 1, 0, 0, 1, 0, 0, 0 | 1, 1, 1, 2, 1, 1, 2, 1, 2, 1 | 0, 0, 0, 0, 0, 0, 0, 0, 0, 1 | 2, 0, 2, 2, 0, 0, 0, 1, 0, 4 |
| hf4-no-planning | 1, 2, 3, 4, 5, 6, 7, 8, 9, 10 | 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 | 1, 1, 1, 1, 2, 2, 1, 1, 2, 1 | 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 | 0, 0, 0, 0, 1, 0, 0, 0, 0, 0 |
| random | 1, 2, 3, 4, 5, 6, 7, 8, 9, 10 | 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 | 1, 1, 1, 2, 1, 1, 2, 1, 2, 1 | 0, 0, 0, 1, 0, 0, 0, 0, 0, 0 | 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 |

Per-seed free-time metrics (one row per run; shares and entropy rounded to four decimals).

| Arm | Seed | Cells visited | Kind entropy | Manipulation share | Idle share | Spire objects | Tallest stack | Repeated pursuit |
|---|---:|---:|---:|---:|---:|---:|---:|---:|
| hf | 1 | 20.0000 | 2.1305 | 0.0556 | 0.2722 | 0.0000 | 1.0000 | 0.0000 |
| hf | 2 | 16.0000 | 2.1958 | 0.0667 | 0.2889 | 0.0000 | 1.0000 | 0.0000 |
| hf | 3 | 22.0000 | 2.2632 | 0.0722 | 0.3444 | 0.0000 | 1.0000 | 0.0000 |
| hf | 4 | 27.0000 | 2.4068 | 0.1889 | 0.1944 | 0.0000 | 1.0000 | 0.0000 |
| hf | 5 | 20.0000 | 2.2857 | 0.0889 | 0.3000 | 0.0000 | 1.0000 | 0.0000 |
| hf | 6 | 21.0000 | 2.3501 | 0.1556 | 0.2111 | 0.0000 | 2.0000 | 0.0000 |
| hf | 7 | 24.0000 | 2.2228 | 0.0778 | 0.2778 | 0.0000 | 1.0000 | 0.0000 |
| hf | 8 | 31.0000 | 2.1715 | 0.0889 | 0.2278 | 0.0000 | 1.0000 | 0.0000 |
| hf | 9 | 12.0000 | 2.5029 | 0.1556 | 0.3222 | 0.0000 | 1.0000 | 0.0000 |
| hf | 10 | 34.0000 | 2.4381 | 0.2000 | 0.2000 | 0.0000 | 1.0000 | 0.0000 |
| hf-no-boredom | 1 | 35.0000 | 2.2304 | 0.0667 | 0.3778 | 0.0000 | 1.0000 | 0.0000 |
| hf-no-boredom | 2 | 23.0000 | 2.1597 | 0.0444 | 0.4278 | 0.0000 | 1.0000 | 0.0000 |
| hf-no-boredom | 3 | 20.0000 | 2.1414 | 0.0556 | 0.4000 | 0.0000 | 1.0000 | 0.0000 |
| hf2 | 1 | 44.0000 | 1.9798 | 0.0278 | 0.3056 | 0.0000 | 1.0000 | 0.0000 |
| hf2 | 2 | 27.0000 | 2.0216 | 0.0333 | 0.3611 | 0.0000 | 1.0000 | 0.0000 |
| hf2 | 3 | 25.0000 | 2.0109 | 0.0444 | 0.3278 | 0.0000 | 1.0000 | 0.0000 |
| hf2 | 4 | 41.0000 | 2.0520 | 0.0667 | 0.3111 | 1.0000 | 2.0000 | 0.0000 |
| hf2 | 5 | 36.0000 | 2.0958 | 0.0667 | 0.3167 | 0.0000 | 1.0000 | 0.0000 |
| hf2 | 6 | 33.0000 | 2.0993 | 0.1389 | 0.1944 | 0.0000 | 1.0000 | 0.0000 |
| hf2 | 7 | 36.0000 | 2.1893 | 0.1000 | 0.2722 | 0.0000 | 2.0000 | 0.0000 |
| hf2 | 8 | 40.0000 | 2.0283 | 0.0556 | 0.2833 | 0.0000 | 1.0000 | 0.0000 |
| hf2 | 9 | 30.0000 | 2.0554 | 0.0611 | 0.3333 | 0.0000 | 2.0000 | 0.0000 |
| hf2 | 10 | 43.0000 | 2.0839 | 0.0667 | 0.3111 | 0.0000 | 1.0000 | 1.0000 |
| hf2-no-boredom | 1 | 41.0000 | 2.0681 | 0.0500 | 0.3167 | 0.0000 | 1.0000 | 1.0000 |
| hf2-no-boredom | 2 | 45.0000 | 2.2433 | 0.0889 | 0.3500 | 0.0000 | 1.0000 | 0.0000 |
| hf2-no-boredom | 3 | 29.0000 | 2.0065 | 0.0556 | 0.3000 | 0.0000 | 1.0000 | 1.0000 |
| hf2-no-boredom | 4 | 36.0000 | 2.1051 | 0.0778 | 0.3278 | 0.0000 | 2.0000 | 0.0000 |
| hf2-no-boredom | 5 | 41.0000 | 1.9926 | 0.0444 | 0.3222 | 0.0000 | 1.0000 | 0.0000 |
| hf2-no-boredom | 6 | 34.0000 | 2.0368 | 0.1222 | 0.2000 | 0.0000 | 2.0000 | 1.0000 |
| hf2-no-boredom | 7 | 49.0000 | 2.0930 | 0.0889 | 0.2667 | 0.0000 | 1.0000 | 0.0000 |
| hf2-no-boredom | 8 | 45.0000 | 2.0125 | 0.0556 | 0.2833 | 0.0000 | 1.0000 | 0.0000 |
| hf2-no-boredom | 9 | 22.0000 | 1.9835 | 0.0389 | 0.3500 | 0.0000 | 1.0000 | 0.0000 |
| hf2-no-boredom | 10 | 52.0000 | 2.0597 | 0.0778 | 0.2611 | 0.0000 | 2.0000 | 1.0000 |
| hf2-no-goals | 1 | 44.0000 | 1.9798 | 0.0278 | 0.3056 | 0.0000 | 1.0000 | 0.0000 |
| hf2-no-goals | 2 | 27.0000 | 2.0216 | 0.0333 | 0.3611 | 0.0000 | 1.0000 | 0.0000 |
| hf2-no-goals | 3 | 25.0000 | 2.0109 | 0.0444 | 0.3278 | 0.0000 | 1.0000 | 0.0000 |
| hf2-no-goals | 4 | 41.0000 | 2.0520 | 0.0667 | 0.3111 | 1.0000 | 2.0000 | 0.0000 |
| hf2-no-goals | 5 | 36.0000 | 2.0958 | 0.0667 | 0.3167 | 0.0000 | 1.0000 | 0.0000 |
| hf2-no-goals | 6 | 33.0000 | 2.0993 | 0.1389 | 0.1944 | 0.0000 | 1.0000 | 0.0000 |
| hf2-no-goals | 7 | 36.0000 | 2.1893 | 0.1000 | 0.2722 | 0.0000 | 2.0000 | 0.0000 |
| hf2-no-goals | 8 | 40.0000 | 2.0283 | 0.0556 | 0.2833 | 0.0000 | 1.0000 | 0.0000 |
| hf2-no-goals | 9 | 30.0000 | 2.0554 | 0.0611 | 0.3333 | 0.0000 | 2.0000 | 0.0000 |
| hf2-no-goals | 10 | 43.0000 | 2.0839 | 0.0667 | 0.3111 | 0.0000 | 1.0000 | 1.0000 |
| hf2-no-memory | 1 | 46.0000 | 2.2540 | 0.1111 | 0.2944 | 1.0000 | 1.0000 | 0.0000 |
| hf2-no-memory | 2 | 34.0000 | 2.1868 | 0.0556 | 0.3667 | 0.0000 | 1.0000 | 0.0000 |
| hf2-no-memory | 3 | 25.0000 | 2.1442 | 0.1000 | 0.2667 | 0.0000 | 1.0000 | 0.0000 |
| hf2-no-memory | 4 | 50.0000 | 2.4397 | 0.2167 | 0.2222 | 0.0000 | 3.0000 | 0.0000 |
| hf2-no-memory | 5 | 37.0000 | 2.1437 | 0.0889 | 0.3222 | 0.0000 | 1.0000 | 0.0000 |
| hf2-no-memory | 6 | 37.0000 | 2.2149 | 0.1444 | 0.2556 | 0.0000 | 1.0000 | 0.0000 |
| hf2-no-memory | 7 | 37.0000 | 2.2162 | 0.0889 | 0.3111 | 0.0000 | 1.0000 | 0.0000 |
| hf2-no-memory | 8 | 28.0000 | 2.0470 | 0.0556 | 0.3222 | 0.0000 | 1.0000 | 0.0000 |
| hf2-no-memory | 9 | 41.0000 | 2.2374 | 0.1000 | 0.3333 | 0.0000 | 1.0000 | 0.0000 |
| hf2-no-memory | 10 | 38.0000 | 2.1608 | 0.1222 | 0.2167 | 0.0000 | 1.0000 | 1.0000 |
| hf3 | 1 | 44.0000 | 1.9798 | 0.0278 | 0.3056 | 0.0000 | 1.0000 | 0.0000 |
| hf3 | 2 | 31.0000 | 1.9289 | 0.0222 | 0.3333 | 0.0000 | 1.0000 | 0.0000 |
| hf3 | 3 | 25.0000 | 2.0109 | 0.0444 | 0.3278 | 0.0000 | 1.0000 | 0.0000 |
| hf3 | 4 | 41.0000 | 2.0520 | 0.0667 | 0.3111 | 1.0000 | 2.0000 | 0.0000 |
| hf3 | 5 | 36.0000 | 2.0958 | 0.0667 | 0.3167 | 0.0000 | 1.0000 | 0.0000 |
| hf3 | 6 | 33.0000 | 2.0993 | 0.1389 | 0.1944 | 0.0000 | 1.0000 | 0.0000 |
| hf3 | 7 | 34.0000 | 2.1358 | 0.0778 | 0.2889 | 1.0000 | 2.0000 | 0.0000 |
| hf3 | 8 | 40.0000 | 2.0283 | 0.0556 | 0.2833 | 0.0000 | 1.0000 | 0.0000 |
| hf3 | 9 | 30.0000 | 2.0554 | 0.0611 | 0.3333 | 0.0000 | 2.0000 | 0.0000 |
| hf3 | 10 | 43.0000 | 2.0839 | 0.0667 | 0.3111 | 0.0000 | 1.0000 | 1.0000 |
| hf4 | 1 | 30.0000 | 2.0846 | 0.0556 | 0.2278 | 0.0000 | 1.0000 | 0.0000 |
| hf4 | 2 | 42.0000 | 2.1234 | 0.0667 | 0.2278 | 0.0000 | 1.0000 | 0.0000 |
| hf4 | 3 | 22.0000 | 2.2119 | 0.0889 | 0.2278 | 0.0000 | 1.0000 | 0.0000 |
| hf4 | 4 | 29.0000 | 2.3778 | 0.1611 | 0.2167 | 0.0000 | 1.0000 | 0.0000 |
| hf4 | 5 | 26.0000 | 2.4533 | 0.1889 | 0.2333 | 0.0000 | 2.0000 | 0.0000 |
| hf4 | 6 | 19.0000 | 2.3747 | 0.1444 | 0.2278 | 0.0000 | 2.0000 | 0.0000 |
| hf4 | 7 | 43.0000 | 2.2442 | 0.1222 | 0.1944 | 0.0000 | 1.0000 | 0.0000 |
| hf4 | 8 | 25.0000 | 2.2603 | 0.1000 | 0.2444 | 0.0000 | 1.0000 | 0.0000 |
| hf4 | 9 | 26.0000 | 2.2639 | 0.1111 | 0.2389 | 0.0000 | 2.0000 | 0.0000 |
| hf4 | 10 | 37.0000 | 2.0806 | 0.0778 | 0.1889 | 0.0000 | 1.0000 | 0.0000 |
| hf4-no-curiosity | 1 | 44.0000 | 2.0027 | 0.0333 | 0.3000 | 0.0000 | 1.0000 | 0.0000 |
| hf4-no-curiosity | 2 | 27.0000 | 2.0216 | 0.0333 | 0.3611 | 0.0000 | 1.0000 | 0.0000 |
| hf4-no-curiosity | 3 | 25.0000 | 2.0109 | 0.0444 | 0.3278 | 0.0000 | 1.0000 | 0.0000 |
| hf4-no-curiosity | 4 | 41.0000 | 2.0520 | 0.0667 | 0.3111 | 1.0000 | 2.0000 | 0.0000 |
| hf4-no-curiosity | 5 | 36.0000 | 2.0958 | 0.0667 | 0.3167 | 0.0000 | 1.0000 | 0.0000 |
| hf4-no-curiosity | 6 | 33.0000 | 2.0993 | 0.1389 | 0.1944 | 0.0000 | 1.0000 | 0.0000 |
| hf4-no-curiosity | 7 | 34.0000 | 2.1358 | 0.0778 | 0.2889 | 1.0000 | 2.0000 | 0.0000 |
| hf4-no-curiosity | 8 | 40.0000 | 2.0436 | 0.0556 | 0.2944 | 0.0000 | 1.0000 | 0.0000 |
| hf4-no-curiosity | 9 | 30.0000 | 2.0554 | 0.0611 | 0.3333 | 0.0000 | 2.0000 | 0.0000 |
| hf4-no-curiosity | 10 | 34.0000 | 2.1127 | 0.0667 | 0.3167 | 0.0000 | 1.0000 | 1.0000 |
| hf4-no-planning | 1 | 30.0000 | 2.0846 | 0.0556 | 0.2278 | 0.0000 | 1.0000 | 0.0000 |
| hf4-no-planning | 2 | 42.0000 | 2.1234 | 0.0667 | 0.2278 | 0.0000 | 1.0000 | 0.0000 |
| hf4-no-planning | 3 | 22.0000 | 2.2119 | 0.0889 | 0.2278 | 0.0000 | 1.0000 | 0.0000 |
| hf4-no-planning | 4 | 29.0000 | 2.3778 | 0.1611 | 0.2167 | 0.0000 | 1.0000 | 0.0000 |
| hf4-no-planning | 5 | 26.0000 | 2.4533 | 0.1889 | 0.2333 | 0.0000 | 2.0000 | 0.0000 |
| hf4-no-planning | 6 | 19.0000 | 2.3747 | 0.1444 | 0.2278 | 0.0000 | 2.0000 | 0.0000 |
| hf4-no-planning | 7 | 43.0000 | 2.2442 | 0.1222 | 0.1944 | 0.0000 | 1.0000 | 0.0000 |
| hf4-no-planning | 8 | 25.0000 | 2.2603 | 0.1000 | 0.2444 | 0.0000 | 1.0000 | 0.0000 |
| hf4-no-planning | 9 | 26.0000 | 2.2639 | 0.1111 | 0.2389 | 0.0000 | 2.0000 | 0.0000 |
| hf4-no-planning | 10 | 37.0000 | 2.0806 | 0.0778 | 0.1889 | 0.0000 | 1.0000 | 0.0000 |
| random | 1 | 37.0000 | 1.9298 | 0.0333 | 0.2000 | 0.0000 | 1.0000 | 0.0000 |
| random | 2 | 24.0000 | 1.8941 | 0.0111 | 0.2556 | 0.0000 | 1.0000 | 0.0000 |
| random | 3 | 42.0000 | 2.0371 | 0.0556 | 0.2111 | 0.0000 | 1.0000 | 0.0000 |
| random | 4 | 34.0000 | 2.2426 | 0.1222 | 0.1889 | 0.0000 | 2.0000 | 1.0000 |
| random | 5 | 43.0000 | 1.8024 | 0.0222 | 0.1667 | 0.0000 | 1.0000 | 0.0000 |
| random | 6 | 28.0000 | 2.0111 | 0.0333 | 0.2611 | 0.0000 | 1.0000 | 0.0000 |
| random | 7 | 58.0000 | 2.1049 | 0.0611 | 0.2278 | 0.0000 | 2.0000 | 0.0000 |
| random | 8 | 57.0000 | 1.9592 | 0.0444 | 0.2000 | 0.0000 | 1.0000 | 0.0000 |
| random | 9 | 41.0000 | 1.9602 | 0.0333 | 0.2222 | 0.0000 | 2.0000 | 0.0000 |
| random | 10 | 55.0000 | 2.0474 | 0.0556 | 0.2222 | 0.0000 | 1.0000 | 0.0000 |

Free-time action-kind composition (pooled action shares; jump is the input verb, recorded as climb in the entropy metric).

| Arm | move | jump | look | rest | pick | place | throw |
|---|---:|---:|---:|---:|---:|---:|---:|
| hf | 0.3761 | 0.2450 | 0.1350 | 0.1289 | 0.0578 | 0.0367 | 0.0206 |
| hf-no-boredom | 0.3889 | 0.1537 | 0.1944 | 0.2074 | 0.0278 | 0.0167 | 0.0111 |
| hf2 | 0.4872 | 0.1450 | 0.1528 | 0.1489 | 0.0339 | 0.0222 | 0.0100 |
| hf2-no-boredom | 0.4944 | 0.1378 | 0.1494 | 0.1483 | 0.0356 | 0.0228 | 0.0117 |
| hf2-no-goals | 0.4872 | 0.1450 | 0.1528 | 0.1489 | 0.0339 | 0.0222 | 0.0100 |
| hf2-no-memory | 0.4578 | 0.1428 | 0.1400 | 0.1511 | 0.0544 | 0.0300 | 0.0239 |
| hf3 | 0.4911 | 0.1456 | 0.1511 | 0.1494 | 0.0322 | 0.0206 | 0.0100 |
| hf4 | 0.3817 | 0.2839 | 0.1200 | 0.1028 | 0.0561 | 0.0378 | 0.0178 |
| hf4-no-curiosity | 0.4850 | 0.1461 | 0.1528 | 0.1517 | 0.0328 | 0.0211 | 0.0106 |
| hf4-no-planning | 0.3817 | 0.2839 | 0.1200 | 0.1028 | 0.0561 | 0.0378 | 0.0178 |
| random | 0.3711 | 0.3661 | 0.1194 | 0.0961 | 0.0239 | 0.0083 | 0.0150 |
