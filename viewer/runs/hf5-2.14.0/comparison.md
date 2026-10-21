HF5 comparison set; HF runtime stamp 2.14.0. Random retains its legacy recording stamp.
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
| hf5 vs random | Task score | 1.5000 | 0.0000 | 0.010836 | 0.043344 |
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
| hf5 vs hf4 | Task score | 1.5000 | 1.0000 | 0.517461 | 0.517461 |

Per-seed values. All project measures use free time only. Project placements require a successful place at the pre-action active project destination. Completed carry chains require pick then place of the same object within one episode without an intervening throw or loss. No movement minimum; replacing the same object counts again. Net deliveries and replacements classify the preceding successful pick by its recorded source relative to the active destination at placement; unknown pick sources are excluded. Final free Spire objects is the maximum endpoint pile across free episodes, alongside the maximum in any free frame.

| Arm | Seed | Free Spire objects | Final free Spire objects | Projects adopted | Project placements | Completed carry chains | Net deliveries | Replacements | Task cubes |
|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| hf5 | 1 | 2 | 1 | 1 | 21 | 21 | 4 | 17 | 2 |
| hf5 | 2 | 2 | 1 | 1 | 27 | 27 | 3 | 24 | 1 |
| hf5 | 3 | 2 | 2 | 1 | 22 | 22 | 4 | 18 | 2 |
| hf5 | 4 | 3 | 2 | 1 | 16 | 16 | 5 | 11 | 3 |
| hf5 | 5 | 2 | 2 | 1 | 34 | 34 | 5 | 29 | 0 |
| hf5 | 6 | 0 | 0 | 1 | 0 | 0 | 0 | 0 | 0 |
| hf5 | 7 | 4 | 3 | 1 | 28 | 28 | 8 | 20 | 0 |
| hf5 | 8 | 2 | 2 | 1 | 23 | 23 | 4 | 19 | 2 |
| hf5 | 9 | 0 | 0 | 1 | 1 | 1 | 0 | 1 | 0 |
| hf5 | 10 | 3 | 3 | 1 | 21 | 21 | 5 | 16 | 3 |
| hf5-no-projects | 1 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 1 |
| hf5-no-projects | 2 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 1 |
| hf5-no-projects | 3 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 2 |
| hf5-no-projects | 4 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 |
| hf5-no-projects | 5 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 |
| hf5-no-projects | 6 | 1 | 0 | 0 | 0 | 0 | 0 | 0 | 1 |
| hf5-no-projects | 7 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 1 |
| hf5-no-projects | 8 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 1 |
| hf5-no-projects | 9 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 1 |
| hf5-no-projects | 10 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 |
| hf5-no-persistence | 1 | 1 | 0 | 1 | 3 | 3 | 1 | 2 | 0 |
| hf5-no-persistence | 2 | 0 | 0 | 1 | 0 | 0 | 0 | 0 | 0 |
| hf5-no-persistence | 3 | 0 | 0 | 1 | 0 | 0 | 0 | 0 | 0 |
| hf5-no-persistence | 4 | 1 | 0 | 1 | 3 | 3 | 1 | 2 | 0 |
| hf5-no-persistence | 5 | 0 | 0 | 1 | 0 | 0 | 0 | 0 | 1 |
| hf5-no-persistence | 6 | 0 | 0 | 1 | 0 | 0 | 0 | 0 | 1 |
| hf5-no-persistence | 7 | 0 | 0 | 1 | 0 | 0 | 0 | 0 | 2 |
| hf5-no-persistence | 8 | 0 | 0 | 1 | 0 | 0 | 0 | 0 | 1 |
| hf5-no-persistence | 9 | 0 | 0 | 1 | 1 | 1 | 0 | 1 | 1 |
| hf5-no-persistence | 10 | 0 | 0 | 1 | 0 | 0 | 0 | 0 | 1 |
| random | 1 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 |
| random | 2 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 |
| random | 3 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 |
| random | 4 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 |
| random | 5 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 |
| random | 6 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 |
| random | 7 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 |
| random | 8 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 |
| random | 9 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 |
| random | 10 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 |
| hf4 | 1 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 1 |
| hf4 | 2 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 |
| hf4 | 3 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 2 |
| hf4 | 4 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 |
| hf4 | 5 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 1 |
| hf4 | 6 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 |
| hf4 | 7 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 1 |
| hf4 | 8 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 2 |
| hf4 | 9 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 1 |
| hf4 | 10 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 1 |

Medians (project metrics descriptive only).

| Arm | Cells visited | Kind entropy | Manipulation share | Idle share | Spire objects | Final free Spire objects | Tallest stack | Repeated pursuit | Projects adopted | Project placements | Completed carry chains | Net deliveries | Replacements | Task cubes |
|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| hf5 | 40.5000 | 1.8104 | 0.2472 | 0.0056 | 2.0000 | 2.0000 | 2.0000 | 4.0000 | 1.0000 | 21.5000 | 21.5000 | 4.0000 | 17.5000 | 1.5000 |
| hf5-no-projects | 36.0000 | 2.2991 | 0.1500 | 0.1972 | 0.0000 | 0.0000 | 1.0000 | 0.0000 | 0.0000 | 0.0000 | 0.0000 | 0.0000 | 0.0000 | 1.0000 |
| hf5-no-persistence | 29.0000 | 2.2192 | 0.1444 | 0.1806 | 0.0000 | 0.0000 | 1.0000 | 0.0000 | 1.0000 | 0.0000 | 0.0000 | 0.0000 | 0.0000 | 1.0000 |
| random | 41.5000 | 1.9857 | 0.0389 | 0.2167 | 0.0000 | 0.0000 | 1.0000 | 0.0000 | 0.0000 | 0.0000 | 0.0000 | 0.0000 | 0.0000 | 0.0000 |
| hf4 | 29.5000 | 2.2541 | 0.1167 | 0.2278 | 0.0000 | 0.0000 | 1.0000 | 0.0000 | 0.0000 | 0.0000 | 0.0000 | 0.0000 | 0.0000 | 1.0000 |
