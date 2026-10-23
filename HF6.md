# Published HF 2.17.0 island rerun (2026-10-23)

Done means seven matched ten-seed arms on published HF 2.17.0, physical replay and viewer validation, focused checks, three deterministic reruns, exact legacy continuation, this report, and a signed island commit. The owner reviews the result afterwards.

**Does HF build in free time? Yes, with more retained objects in this sample. Does it complete the carry task? No.** Protection changes free-time activity from 15 deliveries and 69 replacements to 38 deliveries and 17 replacements across ten seeds. The largest pile retained at the end of any free episode has median 2.5 objects, against 0.5 for unchanged HF5. Replacements remain; the feature does not eliminate undoing. No full-arm run brings more than one cube to the Spire during the task.

The install used the official published tarball `https://registry.npmjs.org/@adam0white/human-framework/-/human-framework-2.17.0.tgz`. Installed package and engine both report 2.17.0. Its SHA-512 matches published metadata: `I/4uFQpSV3kenT0Qh+Hs4UxZ3lfb1obXvqnHhSXita6sztetGTD8g7TsdXh4vMZ/p9hv2sor9UcCqy0Kxitb9w==`. Published source: `156f3da768edb54394b6ee26615dd8bb3eff78bf`. No local candidate contributes to these results. Repository manifests retain their original bytes. No LLM calls or spend.

`Hf6Mind` extends unchanged HF5. For a pickup, the adapter declares `diminishes` for each prospect at the object's observed or recalled source, including adjacent pickup and seeded pickup successors. It does not read task text to make those links. It opts in to `protectProgress`. At task opening, it calls `adoptProjectTask` only for the matching active Spire project; a ring project uses ordinary task adoption. Temperament, rewards, effort, temperature, planning depth and world budget stay unchanged. This is explicit host semantics, not HF discovering a physical law.

All arms use the same published runtime and seeds 1–10. `hf6-no-protection` keeps task handoff but omits protection; `hf6-no-handoff` keeps protection but uses separate host task goals; `hf6-learned` enables protection and handoff but omits declared removal links. HF5, HF4 and random are unchanged controls.

| Arm | Peak free pile, median | Retained free pile, median | Deliveries, total | Replacements, total | Task cubes, seeds 1–10 | Task median |
|---|---:|---:|---:|---:|---|---:|
| hf6 | 2.5 | 2.5 | 38 | 17 | 0, 0, 0, 0, 0, 1, 0, 0, 1, 0 | 0 |
| hf6-no-protection | 2 | 0.5 | 15 | 69 | 0, 0, 1, 0, 1, 0, 0, 0, 0, 0 | 0 |
| hf6-no-handoff | 2.5 | 2.5 | 38 | 17 | 0, 0, 2, 2, 0, 1, 1, 0, 1, 0 | 0.5 |
| hf6-learned | 2 | 1 | 17 | 60 | 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 | 0 |
| hf5 | 2 | 0.5 | 15 | 69 | 1, 1, 0, 3, 2, 0, 0, 0, 0, 3 | 0.5 |
| hf4 | 0 | 0 | 0 | 0 | 1, 0, 2, 0, 1, 0, 1, 2, 1, 1 | 1 |
| random | 0 | 0 | 0 | 0 | 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 | 0 |

The full arm's retained free Spire piles by seed are **2, 2, 3, 4, 4, 0, 5, 0, 0, 6**. Its 55 classified free project chains comprise 38 deliveries and 17 replacements; unchanged HF5's 84 chains comprise 15 and 69. Deliveries are placement events whose preceding pickup occurred elsewhere, not distinct objects or guaranteed retention. Project measures may include the ring. Peak and retained Spire counts include all objects, not only cubes; retained means the largest episode-end pile across the three free episodes.

Full versus HF5 replacement Holm p is **.050391**, deliveries .168785, and peak pile .376161. These exploratory comparisons do not establish those differences at .05. Peak free pile exceeds HF4 and random (Holm p .006192). The learned-only arm still has 60 replacements, so observed-drop learning alone makes a smaller descriptive change here. No-handoff has identical free-time numbers, as expected before a task exists.

**The task result is negative.** Full-arm cubes are **0, 0, 0, 0, 0, 1, 0, 0, 1, 0**. The helper reuses a Spire project identity on eight seeds; seeds 6 and 9 have ring projects and use separate task goals. Reuse is exercised, but does not improve the physical outcome. No-handoff has median .5; full-versus-no-handoff task Holm p .982972 does not establish a difference. Full does worse than HF4's median 1 in the exploratory family (Holm p .042986); it does not beat random (p .473684). No arm collects all ten initial cubes.

An important limit is the island's reset: the task begins on a rebuilt island while Person state, including a project's high-water history, persists from free episodes. Identity preservation therefore carries history about a pile that the reset removed. This is a plausible contributor to the task outcome, not an isolated causal finding. No reset-aware retuning was added after seeing the results. Other limits: ten seeds, one persona, one adapter; approximate Manhattan routes; incomplete place knowledge; no movement minimum in the chain count; exploratory unpaired tests despite matched terrain. Each contrast uses a separate five-measure Holm family, not one correction across every contrast. Controls without a project audit have zero project chain measures by definition, which says nothing about other transport.

Verification: Biome, TypeScript and 133 tests pass. All 70 recordings pass the viewer parser and replay every physical frame against the deterministic world. HF6 seeds 1–3 each match a fresh run byte for byte. All 30 legacy HF5/HF4/random recordings have frames and notes identical to their published-2.14.1 counterparts; only the framework version stamp changes for HF controls. Historical recordings and both manifests retain committed bytes. The committed audit contains hashes, replay receipts, per-seed values and medians.

Reproduce after installing the published tarball, with Node >=24 and Biome 2.5.15:

```sh
node src/generate6.ts <empty-output-directory>
node src/audit6.ts <same-output-directory>
npm run check
```

Raw final recordings, install receipt, comparisons and audit are retained in `/Users/abdul/code/.lab-scratch/sweep/island-2.17.0`. The committed audit is `viewer/audits/hf6-2.17.0.json`. The earlier candidate directory is incomplete and is not evidence for this result. No public viewer integration was changed.

Independent coordinator review: passed after reading the adapter, task hook, generator, audit and tests. It checked observed/remembered source coordinates, task-free free-time links, unchanged default adoption, successor wiring and concrete replay/legacy comparisons. No blocker remained. The report keeps pickup-source deliveries, borderline replacement p values and the world-reset confound explicit.
