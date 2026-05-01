# Difference Arrays: Mega GPT Revision Prompt

Use this as the single prompt payload for GPT when refreshing the prompt files around `docs/cindy.md` `# 1D Problems`.

## Scope

Update all prompt files in `prompts/`, and only files in `prompts/`.

Allowed paths:

- `prompts/difference-arrays-lesson-plan.md`
- `prompts/convert-difference-arrays-lesson-plan-to-site.md`
- `prompts/difference-arrays-lesson-mega-prompt.md`
- any other Markdown prompt file already under `prompts/`

Do not edit files under `docs/`, `data/`, `components/`, `app/`, `pages/`, CSS, package files, tests, or any other non-`prompts/` path.

## Required attachments

Attach this mega prompt plus exactly these 9 reference files:

1. `docs/cindy.md`
2. `prompts/difference-arrays-lesson-plan.md`
3. `prompts/convert-difference-arrays-lesson-plan-to-site.md`
4. `prompts/difference-arrays-lesson-mega-prompt.md`
5. `data/lessonFlow.ts`
6. `data/problems.ts`
7. `components/LessonFlowDeck.tsx`
8. `components/ProblemCard.tsx`
9. `components/CodeBlock.tsx`

Do not attach a 10th reference file. This mega prompt counts as the 10th file in the max-10 upload set.

## Source of truth

Use `docs/cindy.md` `# 1D Problems` as the source of truth for the refreshed lesson prompt sequence.

The required sequence is:

1. Generate a 1D diff array, then regenerate the original array using prefix sum.
   - Teach this first as the concept foundation.
2. LeetCode 1854, Maximum Population Year.
   - Use this as a CoderPad **try** problem.
3. CCC 2026 S2, Beams of Light.
   - Use this as a CoderPad **solve** problem.
4. LeetCode Meeting Rooms II.
   - Use this as a CoderPad **try** problem.

When Cindy's notes and older prompt files disagree, Cindy's `# 1D Problems` list wins.

## Research guidance

Use helpful online resources and search results to make the explanations clearer, simpler, and more beginner-friendly. Synthesize in your own words and avoid copying long passages.

Look for plain-language ways to explain:

- what a difference array stores
- why two boundary marks can represent a whole range update
- how prefix sum rebuilds the final values
- how 1D diff-array thinking connects to population counts, beam coverage, and meeting-room overlap

For problem-specific research, verify these named problems and preserve the listed facts:

### LeetCode 1854, Maximum Population Year

Sources to check:

- `https://leetcode.com/problems/maximum-population-year/`
- `https://algo.monster/liteproblems/1854`

Facts to preserve:

- each birth year is `+1`
- each death year is `-1`
- a person is alive in `[birth, death - 1]`
- the death year is excluded
- ties return the earliest year

### CCC 2026 S2, Beams of Light

Sources to check:

- `https://dmoj.ca/problem/ccc26s2`
- `https://dmoj.ca/problem/ccc26s2/editorial`
- `https://usaco.guide/silver/prefix-sums`

Facts to preserve:

- parking spots are numbered `1..N`
- each light at position `P` with spread `S` illuminates `[max(P - S, 1), min(P + S, N)]`
- each illuminated interval adds one beam of coverage
- each query asks whether coverage at that spot is greater than zero
- output `Y` for illuminated and `N` for not illuminated

### LeetCode Meeting Rooms II

Sources to check:

- `https://leetcode.com/problems/meeting-rooms-ii/`
- `https://neetcode.io/solutions/meeting-rooms-ii`
- `https://algo.monster/liteproblems/253`

Facts to preserve:

- the room count equals the maximum number of active meetings
- meeting starts add demand
- meeting ends remove demand
- a meeting ending at time `t` frees a room for one starting at `t`
- if using sorted events, end events should be processed before start events on equal times

### Foundational support

Sources to check when helpful:

- `https://usaco.guide/problems/cses-1651-range-update-queries/solution`
- `https://usaco.guide/silver/prefix-sums`

Facts to preserve:

- `diff[i] = arr[i] - arr[i - 1]`
- prefix sums rebuild values from differences
- range update marks can be represented with `diff[l] += value` and `diff[r + 1] -= value`

## Required rewrite

Refresh the prompt files so they ask for a 1D-focused lesson and future site update built around Cindy's four items.

The updated prompts should:

- keep the beginner-friendly explanation style from the existing lesson assets
- use research guidance for simple explanatory language around difference arrays
- require verification of problem-specific facts for Maximum Population Year, Beams of Light, and Meeting Rooms II
- preserve the mental model that diff arrays store changes and prefix sums rebuild values
- use Java as the primary teaching language unless a prompt file explicitly says it is language-neutral
- include CoderPad expectations for the three practice problems
- keep future implementation instructions compatible with the existing data and component shapes in the attached TypeScript files
- make clear that a future implementation pass may update `data/`, `components/`, and app files, but this prompt-refresh pass must update prompt files only

## Explicit replacement of old requirements

Remove the old required three-problem sequence:

1. 1D difference + restore
2. 2D difference + restore
3. Line Sweep max-overlap intro

Do not keep 2D difference + restore as a required lesson problem.
Do not require a fixed line-sweep max-overlap intro as Problem 3.
Line sweep and event counting may still appear where they naturally support Maximum Population Year, Beams of Light, or Meeting Rooms II, but the lesson order must come from Cindy's four `# 1D Problems` items.

## File-specific expectations

### `prompts/difference-arrays-lesson-plan.md`

Rewrite this prompt so it asks for the complete updated lesson plan centered on the four 1D problems from Cindy's notes.

The plan prompt should request:

- audience and prerequisites
- learning goals
- a concept-first teaching section for 1D diff build and prefix restoration
- one section per Cindy problem, in the exact order listed above
- CoderPad starter/solution expectations where Cindy marks `Codepad to try` or `Codepad to solve`
- sample inputs, sample outputs, walkthroughs, Java solutions, complexity notes, edge cases, common mistakes, and instructor notes
- optional Python solutions only where useful for app compatibility or learner comparison

### `prompts/convert-difference-arrays-lesson-plan-to-site.md`

Rewrite this prompt so it asks for a site implementation plan that converts the new four-item lesson plan into the existing app structure.

The conversion prompt should reference:

- `data/lessonFlow.ts`
- `data/problems.ts`
- `components/LessonFlowDeck.tsx`
- `components/ProblemCard.tsx`
- `components/CodeBlock.tsx`

It should require the future implementation to preserve existing component contracts unless the prompt explicitly justifies a small, targeted schema change.

It should clearly distinguish:

- this prompt-refresh pass, which edits prompt files only
- a future implementation pass, which may update `data/`, `components/`, and app files if explicitly requested

### `prompts/difference-arrays-lesson-mega-prompt.md`

Rewrite the older mega prompt so it no longer requires the old 1D/2D/line-sweep trio.

Its attachment list, source-of-truth rules, research guidance, file-specific expectations, non-goals, and success criteria should align with the new 1D-focused sequence.

### Other prompt files under `prompts/`

If any other Markdown prompt files exist under `prompts/`, update them only when they contradict Cindy's new `# 1D Problems` sequence or still require the old trio.

## Non-goals

- Do not implement the lesson site in this pass.
- Do not edit `docs/cindy.md`.
- Do not edit TypeScript, CSS, routing, package, or test files.
- Do not keep stale instructions that force the old three-problem lesson sequence.
- Do not invent extra problems beyond Cindy's four items.
- Do not invent CoderPad URLs.
- Do not require advanced data structures.

## Success criteria

- Every prompt file in `prompts/` is consistent with Cindy's four `# 1D Problems` items.
- The exact 9-reference-file list above is preserved, with this mega prompt counted as file 10.
- The old required 1D/2D/line-sweep trio is removed as a requirement.
- The prompts clearly say that this GPT pass updates prompt files only.
- Future implementation guidance remains compatible with the attached lesson data and component files.
- The lesson-plan prompt asks for Java-first teaching and CoderPad expectations for Maximum Population Year, Beams of Light, and Meeting Rooms II.
