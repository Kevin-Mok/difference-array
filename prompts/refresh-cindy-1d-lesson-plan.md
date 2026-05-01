# Refresh Cindy 1D Difference Arrays Lesson Plan

Use this prompt with GPT to create a complete, beginner-friendly lesson plan for Cindy's four 1D difference-array problems.

This is a lesson-plan refresh only. Do not update the site, TypeScript data, React components, CSS, tests, package files, routing, or app code in this pass. The finished lesson plan should be detailed enough that it can be handed back to Codex later for a separate site-conversion pass.

## Allowed Output File

Update only:

- `prompts/difference-arrays-lesson-plan.md`

Do not edit any other file. If you think another file needs changes, mention it in final notes instead of changing it.

## Reference Files

Attach this prompt plus these reference files when possible:

1. `docs/cindy.md`
2. `prompts/difference-arrays-lesson-plan.md`
3. `prompts/convert-difference-arrays-lesson-plan-to-site.md`
4. `data/problems.ts`
5. `data/lessonFlow.ts`
6. `components/LessonFlowDeck.tsx`
7. `components/ProblemCard.tsx`
8. `components/CodeBlock.tsx`

Use the app/data/component files only to keep the lesson plan easy to convert into the existing site later. Do not implement the conversion in this pass.

## Research And Beginner Resource Requirements

Before rewriting the lesson plan, look up helpful beginner-friendly resources that explain the same ideas in simple language.

Use outside resources to improve explanations, examples, and mental models, but synthesize the lesson in original words. Do not copy long passages, code, or editorial text.

Look for resources that help explain:

- difference arrays as "store changes first, rebuild values later"
- prefix sums as a running total
- range updates with two boundary marks
- LeetCode 1854 as birth/death year deltas
- Beams of Light as clipped range coverage
- Meeting Rooms II as active meeting demand over time

Useful starting points:

- LeetCode 1854, Maximum Population Year: `https://leetcode.com/problems/maximum-population-year/description/`
- Beginner 1854 explanations: `https://algo.monster/liteproblems/1854`
- CCC 2026 S2, Beams of Light: `https://dmoj.ca/problem/ccc26s2`
- Beams editorial: `https://dmoj.ca/problem/ccc26s2/editorial`
- Prefix sums foundation: `https://usaco.guide/silver/prefix-sums`
- Range-update foundation: `https://usaco.guide/problems/cses-1651-range-update-queries/solution`
- LeetCode Meeting Rooms II: `https://leetcode.com/problems/meeting-rooms-ii/`
- Beginner Meeting Rooms II explanations: `https://neetcode.io/solutions/meeting-rooms-ii` and `https://algo.monster/liteproblems/253`

If a source disagrees with Cindy's `# 1D Problems` sequence, Cindy's sequence wins. If a source uses a different interval convention, explicitly adapt it to the problem being taught.

## Source Of Truth

Use `docs/cindy.md` `# 1D Problems` as the source of truth.

The required lesson sequence is exactly:

1. Generate a 1D diff array, then regenerate the original array using prefix sum.
   - Teach as the foundation.
2. LeetCode 1854, Maximum Population Year.
   - CoderPad expectation: try.
3. CCC 2026 S2, Beams of Light.
   - CoderPad expectation: solve.
4. LeetCode Meeting Rooms II.
   - CoderPad expectation: try.

Remove the old required 2D restore problem and the old generic max-overlap line-sweep problem from the lesson plan. Line sweep may appear only where it naturally supports Meeting Rooms II.

## Lesson Duration

Plan the lesson for at least 2 hours of instruction.

If the four-problem sequence needs more breathing room for beginner explanations, hand traces, CoderPad practice, or review, extend the lesson duration rather than compressing the content. Prefer a clear 2-hour to 2.5-hour lesson over a rushed 90-minute version.

Include a suggested timing breakdown with:

- opening concept teaching
- Problem 1 teach walkthrough
- Problem 2 CoderPad try segment
- Problem 3 CoderPad solve segment
- Problem 4 CoderPad try segment
- closing synthesis and review

## Lesson Plan Deliverable

Rewrite `prompts/difference-arrays-lesson-plan.md` as a complete human-readable lesson plan, not as a prompt about a future lesson.

The lesson plan must include:

- title
- audience and prerequisites
- total duration and timing breakdown
- learning goals
- instructor setup notes
- opening background section
- one full section for each of Cindy's four items
- explicit bridges between problems
- CoderPad expectations for the three practice problems
- closing summary
- instructor notes
- final conversion notes for the later site-update pass

## Teaching Requirements

The lesson must be beginner-friendly, concrete, and Java-first.

Use these teaching rules throughout:

- Explain that a difference array stores changes, not final values.
- Use exact operation language such as "add `+3` to `diff[1]`" instead of vague verbs like "write."
- Every conceptual bullet should include a concrete example.
- When introducing an update, define its shape first: `[start, end, delta]`.
- When showing a range update, state `start`, `end`, and `delta` before boundary marks.
- Whenever using `end + 1`, explicitly say that `end` is the last included index.
- Include operation-count comparisons between direct updates and diff-array updates.
- Between problems, explicitly state:
  - what idea stays the same
  - what changes
  - what artifact or mental model carries forward
- Java solutions must be primary and must include explanatory inline comments on important steps.
- Python may be included only where useful for later app compatibility or learner comparison.

## Opening Background Section

The lesson plan must explain:

- A normal array stores final values.
- A difference array stores changes between neighboring positions.
- Build formula:

```text
diff[0] = nums[0]
diff[i] = nums[i] - nums[i - 1]
```

- Restore formula:

```text
running += diff[i]
nums[i] = running
```

- Range-add boundary marks:

```text
diff[start] += delta
diff[end + 1] -= delta
```

- The second mark means "stop applying this delta after `end`, where `end` is the last included index."
- Prefix sum rebuilds the actual values after all boundary marks are placed.

Use this foundation example:

```text
original = [4, 7, 7, 10]
diff = [4, 3, 0, 3]
restored = [4, 7, 7, 10]
```

Also include a small range-update example:

```text
n = 5
update = [1, 3, +3]
start = 1, end = 3, delta = +3
diff[1] += 3
diff[4] -= 3
```

Explain that direct updating indexes 1, 2, and 3 does 3 value updates, while the difference-array method does 2 boundary marks and one later rebuild pass.

## Required Fields For Each Problem Section

Each of the four problem sections must include:

- title
- lesson role: Teach, Try, or Solve
- estimated time
- difficulty
- concept focus
- source link, where applicable
- concept-before section
- real-world context
- problem statement
- beginner hint
- apply-concept walkthrough
- input format
- output format
- sample input
- sample output
- step-by-step explanation
- Java solution with explanatory inline comments
- optional Python solution only if useful
- ASCII trace or table trace
- time complexity
- space complexity
- edge cases
- common mistakes
- instructor prompts/checkpoints

## Problem 1: 1D Difference Build + Restore

Purpose: teach the foundation.

Required content:

- Title: `1D Difference Build + Restore`
- Lesson role: `Teach`
- Build walkthrough from `[4, 7, 7, 10]` to `[4, 3, 0, 3]`.
- Restore walkthrough from `[4, 3, 0, 3]` to `[4, 7, 7, 10]`.
- Boundary-mark mini-example for range updates.
- Round-trip check: original -> diff -> restored original.
- Java solution with:
  - `buildDifference`
  - `restoreFromDifference`
  - a simple range-update helper or demonstration
  - `roundTripCheck`
- Common mistakes:
  - returning `diff` as the final answer
  - forgetting `diff[0]` is the anchor
  - double-counting `diff[0]`
  - using subtraction during restore

## Problem 2: LeetCode 1854, Maximum Population Year

Purpose: show diff arrays as year-by-year population changes.

Required facts:

- Source URL: `https://leetcode.com/problems/maximum-population-year/description/`
- Lesson role: `Try`
- CoderPad expectation: try.
- A person is alive from `birth` through `death - 1`.
- The death year is excluded.
- Birth adds `+1`.
- Death adds `-1`.
- Prefix sum gives current population.
- Return the earliest year when multiple years tie.
- Scan years in increasing order and update answer only when `current > best`.

Required examples:

```text
logs = [[1993,1999],[2000,2010]]
answer = 1993
```

```text
logs = [[1950,1961],[1960,1971],[1970,1981]]
answer = 1960
```

Java solution requirements:

- Use an offset such as `year - 1950`.
- Use a sentinel-safe diff array.
- Mark `diff[birth - 1950] += 1`.
- Mark `diff[death - 1950] -= 1`.
- Scan from 1950 upward.
- Preserve earliest-year tie behavior by not replacing the answer on equal population.

## Problem 3: CCC 2026 S2, Beams Of Light

Purpose: show 1D range coverage with clipped intervals.

Required facts:

- Source URL: `https://dmoj.ca/problem/ccc26s2`
- Lesson role: `Solve`
- CoderPad expectation: solve.
- Parking spots are numbered `1` through `N`.
- Each light has position `P` and spread `S`.
- The illuminated interval is clipped:

```text
left = max(P - S, 1)
right = min(P + S, N)
```

- Each light adds one beam of coverage over `[left, right]`.
- Use boundary marks:

```text
diff[left] += 1
diff[right + 1] -= 1
```

- `right` is the last included parking spot.
- Prefix sum creates `coverage[spot]`.
- A query prints `Y` if `coverage[spot] > 0`, otherwise `N`.
- Use `O(N + L + Q)` preprocessing and query handling.

Required sample input:

```text
10
3
4
8 0
1 1
4 2
4
10
7
1
```

Required sample output:

```text
Y
N
N
Y
```

Java solution requirements:

- Use 1-indexing.
- Allocate arrays with length `N + 2`.
- Read input efficiently.
- Use `StringBuilder` for output.
- Build coverage once.
- Answer each query in `O(1)`.

## Problem 4: LeetCode Meeting Rooms II

Purpose: show sparse 1D event deltas for active meeting demand.

Required facts:

- Source URL: `https://leetcode.com/problems/meeting-rooms-ii/`
- Lesson role: `Try`
- CoderPad expectation: try.
- The answer is the minimum number of conference rooms required.
- This equals the peak number of active meetings.
- A meeting start adds demand.
- A meeting end removes demand.
- A meeting ending at time `t` frees a room for a meeting starting at time `t`.

Required examples:

```text
intervals = [[0,30], [5,10], [15,20]]
answer = 2
```

```text
intervals = [[7,10], [2,4]]
answer = 1
```

Preferred Java solution:

- Use `TreeMap<Integer, Integer>` as a sparse difference map.
- For each meeting `[start, end]`:
  - `delta[start] += 1`
  - `delta[end] -= 1`
- Scan times in sorted order.
- Track `active` and `maxRooms`.
- Explain why aggregating deltas at the same time handles end/start reuse.

Acceptable alternative:

- Sorted event list.
- End events must be processed before start events at the same time.

## Conversion Notes For Later Site Pass

At the end of `prompts/difference-arrays-lesson-plan.md`, include a short section titled `Site Conversion Notes`.

This section should help the later site update, but must not implement it. Include:

- suggested problem slugs:
  1. `1d-difference-build-restore`
  2. `maximum-population-year`
  3. `beams-of-light`
  4. `meeting-rooms-ii`
- suggested practice labels: Teach, Try, Solve, Try
- whether source links are problem-source links, not CoderPad links
- reminder not to invent CoderPad URLs
- reminder that the old `2d-difference-restore` and `line-sweep-max-overlap-intro` problems should be removed from the future site flow
- reminder that Java should remain the primary solution language in the site

## Non-Goals

- Do not update the site in this pass.
- Do not edit `data/problems.ts`.
- Do not edit `data/lessonFlow.ts`.
- Do not edit React components.
- Do not edit CSS.
- Do not edit tests or package files.
- Do not add a 2D difference problem.
- Do not add a generic line-sweep max-overlap problem.
- Do not invent CoderPad URLs.
- Do not require Fenwick trees, segment trees, or other advanced structures.

## Validation

After rewriting `prompts/difference-arrays-lesson-plan.md`, verify by reading the file and checking:

- it is a complete lesson plan, not a prompt
- it is at least 2 hours long, or longer if justified
- it follows Cindy's four-item order exactly
- it includes beginner-friendly background research guidance synthesized into clear explanations
- it includes all four problem walkthroughs
- it includes explanatory Java solutions for all four problems
- it includes CoderPad role labels for try/solve problems
- it includes bridges between problems
- it does not require the old 2D restore or generic line-sweep problem
- it includes the `Site Conversion Notes` section for the later site pass

## Final Response Format

When finished, report:

- file changed
- lesson duration chosen
- beginner resources consulted
- major lesson sections added
- verification performed
- any remaining risks or assumptions
