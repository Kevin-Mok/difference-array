# Difference Arrays: 1D Lesson Plan Refresh Prompt

Use this prompt to generate or refresh the **complete lesson plan markdown** for the Difference Arrays lesson.

This prompt is intentionally 1D-focused. Cindy's `docs/cindy.md` `# 1D Problems` section is the source of truth for the problem sequence.

## Scope for this prompt

Create or revise the lesson-plan content only. Do **not** implement the site in this pass.

The lesson plan should be ready to later convert into the existing app data/components, but this prompt should not ask GPT to edit TypeScript, CSS, routing, package files, or tests.

## Required reference files

Use these references when available:

1. `docs/cindy.md`
2. `prompts/difference-arrays-lesson-plan.md`
3. `prompts/convert-difference-arrays-lesson-plan-to-site.md`
4. `prompts/difference-arrays-lesson-mega-prompt.md`
5. `data/lessonFlow.ts`
6. `data/problems.ts`
7. `components/LessonFlowDeck.tsx`
8. `components/ProblemCard.tsx`
9. `components/CodeBlock.tsx`

## Source of truth

Use Cindy's `# 1D Problems` list as the required lesson order:

1. Generate a 1D diff array, then regenerate the original array using prefix sum.
   - Teach this first as the concept foundation.
2. LeetCode 1854, Maximum Population Year.
   - Use this as a CoderPad **try** problem.
3. CCC 2026 S2, Beams of Light.
   - Use this as a CoderPad **solve** problem.
4. LeetCode Meeting Rooms II.
   - Use this as a CoderPad **try** problem.

When Cindy's notes and older prompt files disagree, Cindy's four-item 1D list wins.

## Research requirements

Use online research to clarify beginner-friendly explanations and verify problem facts. Synthesize in your own words; do not copy long passages.

Recommended starting sources:

- LeetCode 1854, Maximum Population Year: `https://leetcode.com/problems/maximum-population-year/`
- Beginner explanation for 1854: `https://algo.monster/liteproblems/1854`
- DMOJ CCC 2026 S2, Beams of Light: `https://dmoj.ca/problem/ccc26s2`
- DMOJ Beams editorial: `https://dmoj.ca/problem/ccc26s2/editorial`
- Prefix sums foundation: `https://usaco.guide/silver/prefix-sums`
- Difference array / range update foundation: `https://usaco.guide/problems/cses-1651-range-update-queries/solution`
- LeetCode Meeting Rooms II: `https://leetcode.com/problems/meeting-rooms-ii/`
- Meeting Rooms II explanations: `https://neetcode.io/solutions/meeting-rooms-ii` and `https://algo.monster/liteproblems/253`

Preserve these verified facts:

- A 1D difference array stores **changes**, not final values.
- Prefix sum / running total rebuilds the actual values from stored changes.
- A range add can be represented by two boundary marks: `diff[l] += value` and `diff[r + 1] -= value`, when `r + 1` is inside the sentinel-sized diff array.
- In LeetCode 1854, a person is counted from `birth` through `death - 1`; the death year is excluded; ties return the earliest year.
- In Beams of Light, a light at position `P` with spread `S` illuminates the clipped interval `[max(P - S, 1), min(P + S, N)]`; each illuminated interval adds one beam of coverage; each query asks whether coverage at that spot is greater than zero.
- In Meeting Rooms II, the answer is the maximum number of active meetings / rooms in use; a meeting ending at time `t` frees a room for a meeting starting at time `t`.

## Tone and teaching style

Keep the lesson beginner-friendly and card-friendly:

- short blocks
- simple vocabulary
- clear variable names
- small hand-traceable examples
- direct mental models before code
- Java as the primary teaching language
- inline comments on important Java steps
- optional Python as a secondary solution only where useful for app compatibility or learner comparison

Avoid advanced data structures unless they are used only as a brief contrast. The lesson should focus on arrays, boundary marks, prefix sums, and simple sweep/event thinking.

## Required lesson-plan structure

The final lesson plan must include:

- Title
- Audience and prerequisites
- Learning goals
- Opening concept section
- Problem 1: 1D Difference Build + Restore
- Problem 2: LeetCode 1854, Maximum Population Year
- Problem 3: CCC 2026 S2, Beams of Light
- Problem 4: LeetCode Meeting Rooms II
- Closing summary
- Instructor notes

## Opening concept section requirements

Teach the foundation before the named practice problems:

- What a diff array stores.
- How to build a diff array from an original array:

```text
diff[0] = nums[0]
diff[i] = nums[i] - nums[i - 1]
```

- How to regenerate the original array with a running total:

```text
running += diff[i]
nums[i] = running
```

- Why boundary marks represent a whole range update:

```text
diff[l] += value
diff[r + 1] -= value
```

- How all later problems use the same idea:
  - population changes
  - beam coverage changes
  - meeting room demand changes

## Required fields for each problem section

Each of the four problem sections must include:

- title
- difficulty
- concept focus
- concept-before
- real-world context
- problem statement
- beginner hint
- apply concept
- input
- output
- sample input
- sample output
- step-by-step walkthrough
- Java solution with inline comments
- Python solution if helpful for app compatibility
- ASCII trace or table trace
- time complexity
- space complexity
- edge cases
- common mistakes
- CoderPad expectation, where applicable

## Problem-specific requirements

### Problem 1: 1D Difference Build + Restore

Purpose: teach the foundation.

Must include:

- A small original array, such as `[4, 7, 7, 10]`.
- Forward build:

```text
[4, 7, 7, 10] -> [4, 3, 0, 3]
```

- Reverse restore using prefix sum:

```text
[4, 3, 0, 3] -> [4, 7, 7, 10]
```

- A range-update mini-example using boundary marks.
- A round-trip check: `original -> diff -> restored original`.
- Clear warning that `diff[0]` is the starting anchor.

### Problem 2: LeetCode 1854, Maximum Population Year

CoderPad expectation: **try**.

Teach it as a direct diff-array application:

```text
birth year -> +1
death year -> -1
prefix sum -> current population
```

Must preserve:

- Person alive interval is `[birth, death - 1]`.
- Death year is not counted.
- Return the earliest year when multiple years tie for maximum population.
- Year range is small enough for an offset array, usually `year - 1950`.
- Example to include: `logs = [[1993,1999],[2000,2010]] -> 1993`.
- Another useful trace: `[[1950,1961],[1960,1971],[1970,1981]] -> 1960`.

Suggested Java focus:

- `int[] diff = new int[102]` or equivalent sentinel-safe size.
- `diff[birth - 1950]++`.
- `diff[death - 1950]--`.
- Scan years in increasing order and update answer only when `current > best`, not when equal.

### Problem 3: CCC 2026 S2, Beams of Light

CoderPad expectation: **solve**.

Teach it as range coverage with clipped intervals.

Must preserve the parking-garage model:

- Parking spots are numbered `1` to `N`.
- A light at position `P` with spread `S` illuminates:

```text
left = max(P - S, 1)
right = min(P + S, N)
```

- Add one beam of coverage to every spot in `[left, right]`.
- Use boundary marks:

```text
diff[left] += 1
diff[right + 1] -= 1
```

- Prefix sum creates `coverage[spot]`.
- Each query prints `Y` if `coverage[spot] > 0`, otherwise `N`.

Must include the DMOJ sample:

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

Expected output:

```text
Y
N
N
Y
```

Suggested Java focus:

- Use 1-indexing.
- Allocate `diff` and `coverage` with length `N + 2`.
- Read input efficiently.
- Build coverage once, then answer all queries in `O(1)` each.
- Time complexity: `O(N + L + Q)`.

### Problem 4: LeetCode Meeting Rooms II

CoderPad expectation: **try**.

Teach it as meeting-room demand changes over time.

Must preserve:

- The answer is the minimum number of rooms required.
- That is equal to the maximum number of active overlapping meetings.
- A meeting starting at time `t` adds demand.
- A meeting ending at time `t` removes demand.
- A meeting ending at time `t` frees a room for another meeting starting at `t`.

Acceptable approaches:

1. Event sweep with sorted events:
   - `(start, +1)`
   - `(end, -1)`
   - For ties at the same time, process end events before start events.
2. Difference-map / ordered-map sweep:
   - `delta[start] += 1`
   - `delta[end] -= 1`
   - scan sorted times and track peak active meetings.

Use Java as the main solution. Prefer an approach that works when times are large or sparse, such as a `TreeMap<Integer, Integer>` or sorted event list.

Must include examples:

```text
[[0,30], [5,10], [15,20]] -> 2
[[7,10], [2,4]] -> 1
```

## CoderPad expectations

For practice problems:

- LeetCode 1854: CoderPad **try** problem.
- Beams of Light: CoderPad **solve** problem.
- Meeting Rooms II: CoderPad **try** problem.

Do not invent CoderPad URLs. Use supplied links if available. If no link is provided, include starter/solution code content and mark URLs as TODO or omit URL fields in the future data pass.

## Non-goals

- Do not keep the old required three-problem sequence.
- Do not include 2D difference + restore as a required problem.
- Do not require a generic fixed line-sweep max-overlap intro as Problem 3.
- Do not add extra problems beyond Cindy's four items.
- Do not require segment trees, Fenwick trees, or other advanced range structures.
- Do not rewrite away from the existing app's card-friendly lesson style.

## Success criteria

A successful lesson plan:

- follows Cindy's four-item 1D sequence exactly
- teaches diff arrays as stored changes and prefix sums as restoration
- explains two boundary marks for range updates clearly
- uses Java as the primary teaching language
- includes CoderPad expectations for the three practice problems
- preserves the key facts for Maximum Population Year, Beams of Light, and Meeting Rooms II
- stays compatible with the future app conversion into `data/problems.ts` and `data/lessonFlow.ts`
