# Island HF5: projects and persistence (HF 2.14 candidate)

Done means: the three HF5 arms and same-runtime random/HF4 controls on seeds 1–10, prospect/pursuit audits, focused tests, HF5 seeds 1–3 run twice with SHA-256 comparison, physical replay and viewer validation, passing `npm run check`, this report, and a signed local commit on hf5. The requester accepts the implementation and evidence. No push or publication. The lead owns the later published-2.14.0 rerun; it is not claimed here.

**On this candidate, does HF build in free time? Yes, on the requested physical measures.** HF5 adopts one project in every seed. It reaches positive free Spire object counts on eight of ten seeds, with median 2 (range 0–4). It completes pick→place chains at its project's place in nine seeds, with median 21.5. These are repeated placement events, including picking up and replacing the same cube, not 21.5 distinct delivered objects. The Spire is the project in eight seeds; seeds 6 and 9 adopt the ring. Seed 6 makes no project placement. Seed 9 makes one ring placement and has no free Spire objects. This demonstrates bounded arranging behavior here, not a general claim about play or inner experience.

**Does it complete the carry task? No demonstrated full collection.** Final HF5 cubes on the Spire for seeds 1–10 are **2, 1, 2, 3, 0, 0, 1, 2, 0, 3**. Median 1.5; seven nonzero results, three zeros. The task asks for as many cubes as possible and supplies no binary threshold. Those final counts are the outcome. No run collects all ten initial cubes. The candidate HF4 control has median 1; the HF5/HF4 task difference is not significant in the specified family (Holm p .371539). HF5 does differ from random on task cubes (Holm p .012384), which does not establish completion.

Construction preserves the HF4 person, temperament, .03 softmax temperature, curiosity defaults, planning depth 4, task handling, and seeded consequence generator. `hf5` enables default projects and persistence; `hf5-no-projects` enables persistence only in addition to curiosity/planning; `hf5-no-persistence` enables projects only in addition to curiosity/planning. HF4 gains a protected identity hook for successor decoration and exposes its existing known-object helper to the subclass. Its default hook returns the original successor unchanged. No framework repository files changed. All HF calls use public package exports.

Adapter assumption: each step offers a `saw` percept with salience .5, matching HF2 object salience, for each currently seen or HF-recalled Spire/ring place. The Spire prospect is `arrange`, labelled "a pile on the Spire"; the ring is `arrange`, labelled "fill the ring". IDs include the landmark and its dead-reckoned cell. `materialIds` contains every distinct known cube ID, including the currently carried cube. Progress is visible objects at that place divided by all known cubes, capped at 1; with no known cubes it is 0. The ring itself is excluded from its own contents. An object such as the ring placed on the Spire counts as an object there. Progress is omitted when the place is out of sight, even if recalled. These are host mapping choices, not HF discoveries. Neither prospects nor consequence generation reads `obs.task`, hidden terrain or world state. The inherited task adopter still reads the task as before.

Only placement offers at a prospect's cell add its prospect ID to `advances`. Only placement successors at that cell receive the same link; pickup and carrying successors do not. HF2's generic competence/leisure goal links are filtered for project goals, so unrelated actions cannot inherit project credit from those needs. All nonproject goal links and the task's concrete `island:place:cube@Spire` amount .1 rule remain unchanged. There are no intermediate rewards. The same endpoint semantics are supplied to every HF5 arm, including projects-off. Long seeded chains still point to the Spire as HF4 did; ring links occur on the inherited immediate placement successors. No new long-distance ring route generator or executor was added.

Every HF5 frame records `inner.activeProject` (goal/prospect IDs, place, progress, status, or null), `inner.projects` (goal audit), `inner.pursuit` (`pursuitOf(person)` or null), and the chosen score's `pursuit:*` terms. These are copied before begin/tick, like `inner.route`; they describe the scored choice's context, not a post-action pursuit. The next frame receives the action's observed effects. Project/place coordinates are relative to each episode's reset origin. Measures translate them to world coordinates inferred from the first post-action frame. No hidden coordinates enter the mind.

Project measures use only free episodes. Projects adopted counts distinct observed project goal IDs across resets. A project placement requires a successful `place` of the previously carried payload at the active project's place. A completed chain additionally requires a successful pick of that same payload within the episode, with no throw, loss or other drop in between. No minimum walking distance is required. Repeated pick/replacement counts again. The existing free Spire measure remains the maximum object count in any free frame, not the final retained pile. Task score remains final physical cubes on the Spire. All existing measures and the eight-outcome Holm families versus random are retained. Project measures are descriptive; HF5 versus HF4 has one two-outcome family (free Spire objects and task cubes).

HF5 free Spire objects exceed HF4 (Holm p .001429) and random (.004287). The no-projects arm has median free Spire 0, no project adoptions and no project chains. The no-persistence arm adopts one project per seed but has median free Spire 0 and median chains 0. These ablations support the combination's role within this adapter; no inferential HF5-versus-ablation test was specified. The active-project audit appears on 1,790/1,800 free decisions in each projects-enabled arm (the first tick adopts). HF5 has pursuit and nonzero pursuit terms on 1,532 free decisions and a nonempty route on 1,245. Projects-off has none of these free-time readouts; persistence-off has 998 nonempty free routes but no pursuit state or terms. Faculty activation alone is not physical success.

Candidate limits: installed package version and `ENGINE_VERSION` both report **2.13.0**, despite containing the forthcoming projects/persistence APIs. The candidate rejects an entire prospect when `materialIds` exceeds eight, although the island has ten initial cubes. A nine-visible-cube integration probe reproduced an empty retained prospect list. This adapter passes all known IDs as instructed; it does not truncate them to evade that limit. Rejected later readings can leave an existing project's progress stale. The focused test pins the all-IDs adapter contract rather than requiring future releases to retain that rejection. The full published 2.14.0 batch remains to be run by the lead.

Other limits remain from HF4: Manhattan travel estimates ignore terrain, carry successors summarize several actions, finite retained claims may omit chains, and route valuation executes nothing. Persistence biases choices but does not execute a plan. Projects survive episode resets with Person memory and may compete with the stated task. The inherited task goal counts repeated placements and does not subtract a cube picked back up; an achieved goal flag is not proof of delivered distinct cubes. Project ratios also depend on incomplete/stale knowledge. We did not tune thresholds, persona, effort, temperature, rewards or task links after seeing results. Ten seeds, one persona and this adapter bound the conclusions.

Verification: `npm run check` passes 126 tests (Biome, TypeScript, Vitest). Focused tests cover task-free prospect inputs with a throwing `task` getter, omission of unseen progress, exact faculty enablement, placement-only links, preserved task action/importance/time course, all known material IDs, measures and comparison-family structure, and nested viewer audits. All 50 new recordings pass physical replay against the world engine and viewer validation. HF5 seeds 1–3 each match two independent reruns and the saved recording by SHA-256. All 144 previously tracked files under viewer/runs (143 recordings plus the index) retain their committed bytes. package.json and package-lock.json retain committed bytes. The audit with hashes and per-run readout counts is [viewer/audits/hf5-candidate.json](viewer/audits/hf5-candidate.json). Two independent subagent reviews checked adapter boundaries and proof/measure semantics; the task-link assertion and batch-wide viewer/replay proof gaps were fixed. The material-ID rejection is reported above as a framework limit rather than hidden with adapter tuning. No credentials, LLM arms, external review CLIs or remote actions were used.

Reproduce after installing a candidate with `npm install --no-save --package-lock=false <tarball-or-spec>`: run **`node src/generate5.ts <empty-output-directory>`**. The default is viewer/runs/hf5-candidate; it refuses a nonempty directory, protecting existing recordings. For the lead's published rerun use `node src/generate5.ts viewer/runs/hf5-2.14.0`. The command runs all five arms, prints installed package version and runtime engine, saves the recordings/index/runtime receipt, and prints and saves every table below. `node src/compare.ts viewer/runs/hf5-candidate` regenerates the comparison text. A single arm is available through `node src/run.ts --mind hf5 --seed 1 --out <scratch-path>`, with either ablation name supported. Determinism/replay script: /Users/abdul/code/.lab-scratch/hf-projects/island/audit5.ts. Scratch log: /Users/abdul/code/.lab-scratch/hf-projects/island.log. The requested scratch report is /Users/abdul/code/.lab-scratch/hf-projects/island-report.md.

The candidate batch tables follow verbatim.

HF5 comparison set; HF runtime stamp 2.13.0. Random retains its legacy recording stamp.
Exact unpaired permutation tests of absolute mean differences, including ties. Medians describe samples. Holm correction uses one eight-test family per arm vs random (seven free-time metrics plus task score), and one two-test family for hf5 vs hf4 (free Spire objects plus task score). Project metrics are descriptive only and do not enlarge these families. Families are exploratory and are not jointly corrected; large p values do not establish equivalence.

| Comparison | Measure | Median A | Median B | Exact p | Holm p |
|---|---|---:|---:|---:|---:|
| hf5 vs random | Cells visited | 40.5000 | 41.5000 | 0.790459 | 0.790459 |
| hf5 vs random | Kind entropy | 1.8104 | 1.9857 | 0.165126 | 0.330252 |
| hf5 vs random | Manipulation share | 0.2472 | 0.0389 | 0.000022 | 0.000173 |
| hf5 vs random | Idle share | 0.0056 | 0.2167 | 0.000336 | 0.002349 |
| hf5 vs random | Spire objects | 2.0000 | 0.0000 | 0.000714 | 0.004287 |
| hf5 vs random | Tallest stack | 2.0000 | 1.0000 | 0.026229 | 0.078688 |
| hf5 vs random | Repeated pursuit | 4.0000 | 0.0000 | 0.000714 | 0.004287 |
| hf5 vs random | Task score | 1.5000 | 0.0000 | 0.003096 | 0.012384 |
| hf5-no-projects vs random | Cells visited | 36.0000 | 41.5000 | 0.456700 | 1.000000 |
| hf5-no-projects vs random | Kind entropy | 2.2991 | 1.9857 | 0.000087 | 0.000693 |
| hf5-no-projects vs random | Manipulation share | 0.1500 | 0.0389 | 0.000195 | 0.001364 |
| hf5-no-projects vs random | Idle share | 0.1972 | 0.2167 | 0.287601 | 1.000000 |
| hf5-no-projects vs random | Spire objects | 0.0000 | 0.0000 | 1.000000 | 1.000000 |
| hf5-no-projects vs random | Tallest stack | 1.0000 | 1.0000 | 1.000000 | 1.000000 |
| hf5-no-projects vs random | Repeated pursuit | 0.0000 | 0.0000 | 1.000000 | 1.000000 |
| hf5-no-projects vs random | Task score | 1.0000 | 0.0000 | 0.003096 | 0.018576 |
| hf5-no-persistence vs random | Cells visited | 29.0000 | 41.5000 | 0.020059 | 0.080236 |
| hf5-no-persistence vs random | Kind entropy | 2.2192 | 1.9857 | 0.000498 | 0.003486 |
| hf5-no-persistence vs random | Manipulation share | 0.1444 | 0.0389 | 0.000054 | 0.000433 |
| hf5-no-persistence vs random | Idle share | 0.1806 | 0.2167 | 0.010251 | 0.061508 |
| hf5-no-persistence vs random | Spire objects | 0.0000 | 0.0000 | 0.473684 | 1.000000 |
| hf5-no-persistence vs random | Tallest stack | 1.0000 | 1.0000 | 1.000000 | 1.000000 |
| hf5-no-persistence vs random | Repeated pursuit | 0.0000 | 0.0000 | 0.458204 | 1.000000 |
| hf5-no-persistence vs random | Task score | 1.0000 | 0.0000 | 0.010836 | 0.061508 |
| hf4 vs random | Cells visited | 29.5000 | 41.5000 | 0.027203 | 0.136017 |
| hf4 vs random | Kind entropy | 2.2541 | 1.9857 | 0.000520 | 0.004157 |
| hf4 vs random | Manipulation share | 0.1167 | 0.0389 | 0.001580 | 0.011063 |
| hf4 vs random | Idle share | 0.2278 | 0.2167 | 0.753924 | 1.000000 |
| hf4 vs random | Spire objects | 0.0000 | 0.0000 | 1.000000 | 1.000000 |
| hf4 vs random | Tallest stack | 1.0000 | 1.0000 | 1.000000 | 1.000000 |
| hf4 vs random | Repeated pursuit | 0.0000 | 0.0000 | 1.000000 | 1.000000 |
| hf4 vs random | Task score | 1.0000 | 0.0000 | 0.003096 | 0.018576 |
| hf5 vs hf4 | Spire objects | 2.0000 | 0.0000 | 0.000714 | 0.001429 |
| hf5 vs hf4 | Task score | 1.5000 | 1.0000 | 0.371539 | 0.371539 |

Per-seed values. All project measures use free time only. Project placements require a successful place at the pre-action active project destination. Completed carry chains require pick then place of the same object within one episode without an intervening throw or loss. No movement minimum; replacing the same object counts again.

| Arm | Seed | Free Spire objects | Projects adopted | Project placements | Completed carry chains | Task cubes |
|---|---:|---:|---:|---:|---:|---:|
| hf5 | 1 | 2 | 1 | 21 | 21 | 2 |
| hf5 | 2 | 2 | 1 | 27 | 27 | 1 |
| hf5 | 3 | 2 | 1 | 22 | 22 | 2 |
| hf5 | 4 | 3 | 1 | 16 | 16 | 3 |
| hf5 | 5 | 2 | 1 | 34 | 34 | 0 |
| hf5 | 6 | 0 | 1 | 0 | 0 | 0 |
| hf5 | 7 | 4 | 1 | 28 | 28 | 1 |
| hf5 | 8 | 2 | 1 | 23 | 23 | 2 |
| hf5 | 9 | 0 | 1 | 1 | 1 | 0 |
| hf5 | 10 | 3 | 1 | 21 | 21 | 3 |
| hf5-no-projects | 1 | 0 | 0 | 0 | 0 | 1 |
| hf5-no-projects | 2 | 0 | 0 | 0 | 0 | 1 |
| hf5-no-projects | 3 | 0 | 0 | 0 | 0 | 2 |
| hf5-no-projects | 4 | 0 | 0 | 0 | 0 | 0 |
| hf5-no-projects | 5 | 0 | 0 | 0 | 0 | 0 |
| hf5-no-projects | 6 | 1 | 0 | 0 | 0 | 1 |
| hf5-no-projects | 7 | 0 | 0 | 0 | 0 | 1 |
| hf5-no-projects | 8 | 0 | 0 | 0 | 0 | 1 |
| hf5-no-projects | 9 | 0 | 0 | 0 | 0 | 1 |
| hf5-no-projects | 10 | 0 | 0 | 0 | 0 | 0 |
| hf5-no-persistence | 1 | 1 | 1 | 3 | 3 | 0 |
| hf5-no-persistence | 2 | 0 | 1 | 0 | 0 | 0 |
| hf5-no-persistence | 3 | 0 | 1 | 0 | 0 | 0 |
| hf5-no-persistence | 4 | 1 | 1 | 3 | 3 | 0 |
| hf5-no-persistence | 5 | 0 | 1 | 0 | 0 | 1 |
| hf5-no-persistence | 6 | 0 | 1 | 0 | 0 | 1 |
| hf5-no-persistence | 7 | 0 | 1 | 0 | 0 | 2 |
| hf5-no-persistence | 8 | 0 | 1 | 0 | 0 | 1 |
| hf5-no-persistence | 9 | 0 | 1 | 1 | 1 | 1 |
| hf5-no-persistence | 10 | 0 | 1 | 0 | 0 | 1 |
| random | 1 | 0 | 0 | 0 | 0 | 0 |
| random | 2 | 0 | 0 | 0 | 0 | 0 |
| random | 3 | 0 | 0 | 0 | 0 | 0 |
| random | 4 | 0 | 0 | 0 | 0 | 0 |
| random | 5 | 0 | 0 | 0 | 0 | 0 |
| random | 6 | 0 | 0 | 0 | 0 | 0 |
| random | 7 | 0 | 0 | 0 | 0 | 0 |
| random | 8 | 0 | 0 | 0 | 0 | 0 |
| random | 9 | 0 | 0 | 0 | 0 | 0 |
| random | 10 | 0 | 0 | 0 | 0 | 0 |
| hf4 | 1 | 0 | 0 | 0 | 0 | 1 |
| hf4 | 2 | 0 | 0 | 0 | 0 | 0 |
| hf4 | 3 | 0 | 0 | 0 | 0 | 2 |
| hf4 | 4 | 0 | 0 | 0 | 0 | 0 |
| hf4 | 5 | 0 | 0 | 0 | 0 | 1 |
| hf4 | 6 | 0 | 0 | 0 | 0 | 0 |
| hf4 | 7 | 0 | 0 | 0 | 0 | 1 |
| hf4 | 8 | 0 | 0 | 0 | 0 | 2 |
| hf4 | 9 | 0 | 0 | 0 | 0 | 1 |
| hf4 | 10 | 0 | 0 | 0 | 0 | 1 |

Medians (project metrics descriptive only).

| Arm | Cells visited | Kind entropy | Manipulation share | Idle share | Spire objects | Tallest stack | Repeated pursuit | Projects adopted | Project placements | Completed carry chains | Task cubes |
|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| hf5 | 40.5000 | 1.8104 | 0.2472 | 0.0056 | 2.0000 | 2.0000 | 4.0000 | 1.0000 | 21.5000 | 21.5000 | 1.5000 |
| hf5-no-projects | 36.0000 | 2.2991 | 0.1500 | 0.1972 | 0.0000 | 1.0000 | 0.0000 | 0.0000 | 0.0000 | 0.0000 | 1.0000 |
| hf5-no-persistence | 29.0000 | 2.2192 | 0.1444 | 0.1806 | 0.0000 | 1.0000 | 0.0000 | 1.0000 | 0.0000 | 0.0000 | 1.0000 |
| random | 41.5000 | 1.9857 | 0.0389 | 0.2167 | 0.0000 | 1.0000 | 0.0000 | 0.0000 | 0.0000 | 0.0000 | 0.0000 |
| hf4 | 29.5000 | 2.2541 | 0.1167 | 0.2278 | 0.0000 | 1.0000 | 0.0000 | 0.0000 | 0.0000 | 0.0000 | 1.0000 |
