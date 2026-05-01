# Difference Arrays: Mega GPT Revision Prompt 2

Use this as the single prompt payload for GPT when refreshing the prompt files around
`docs/cindy.md` `# 1D Problems`.

## Scope

Update all prompt files in `prompts/`, and only files in `prompts/`.

Allowed paths:

- `prompts/difference-arrays-lesson-plan.md`
- `prompts/convert-difference-arrays-lesson-plan-to-site.md`
- `prompts/difference-arrays-lesson-mega-prompt.md`
- any other Markdown prompt file already under `prompts/`

Do not edit files under `docs/`, `data/`, `components/`, `app/`, `pages/`, or any
other non-`prompts/` path.

## Required attachments (9 reference files, plus this prompt = max 10 files)

Attach this prompt file plus exactly these reference files:

1. `docs/cindy.md`
2. `prompts/difference-arrays-lesson-plan.md`
3. `prompts/convert-difference-arrays-lesson-plan-to-site.md`
4. `prompts/difference-arrays-lesson-mega-prompt.md`
5. `data/lessonFlow.ts`
6. `data/problems.ts`
7. `components/LessonFlowDeck.tsx`
8. `components/ProblemCard.tsx`
9. `components/CodeBlock.tsx`

Do not attach a 10th reference file. This mega prompt counts as the 10th file in
the max-10 upload set.

# Source of truth

Use `docs/cindy.md` `# 1D Problems` as the source of truth for the refreshed
lesson prompt sequence.

The new sequence is:

1. Generate a 1D diff array, then regenerate the original array using prefix sum.
   Teach this first as the concept foundation.
2. LeetCode 1854, Maximum Population Year.
   Use this as a CoderPad "try" problem.
3. CCC 2026 S2, Beams of Light.
   Use this as a CoderPad "solve" problem.
4. LeetCode Meeting Rooms II.
   Use this as a CoderPad "try" problem.

When Cindy's notes and older prompt files disagree, Cindy's `# 1D Problems` list
wins.

## Research guidance

Use helpful online resources and search results to make the difference-array
explanations clearer, simpler, and more beginner-friendly. Look for plain-language
ways to explain:

- what a difference array stores
- why two boundary marks can represent a whole range update
- how prefix sum rebuilds the final values
- how 1D diff-array thinking connects to population counts, beam coverage, and
  meeting-room overlap

Synthesize the explanation in your own words. Do not copy long passages. Cindy's
problem order and the attached repo files still define the required lesson shape.

For problem-specific research, look for helpful, simple explanations of the
named online problems and relevant background:

- For LeetCode 1854, Maximum Population Year, look up the problem statement and
  beginner-friendly explanations that frame each birth year as `+1`, each death
  year as `-1`, and the prefix sum as the current population. Preserve the key
  details that death year is excluded and ties return the earliest year.
- For CCC 2026 S2, Beams of Light, look up the DMOJ problem, DMOJ editorial, and
  any clear community explanations. Preserve the parking-garage model: each
  light at position `P` with spread `S` illuminates the clipped interval
  `[max(P - S, 1), min(P + S, N)]`, each interval adds one beam of coverage, and
  each query asks whether coverage at that spot is greater than zero.
- For LeetCode Meeting Rooms II, look up the problem statement and simple
  sweep-line / overlap explanations. Connect the room count to maximum active
  meetings, and call out that a meeting ending at time `t` frees a room for one
  starting at `t`.
- For foundational support, use simple prefix-sum and difference-array resources
  when they help explain the rebuild step or why boundary marks are enough.

Useful online starting points:

- LeetCode 1854 problem page:
  `https://leetcode.com/problems/maximum-population-year/`
- Beginner-friendly 1854 explanation:
  `https://algo.monster/liteproblems/1854`
- LeetCode Meeting Rooms II problem page:
  `https://leetcode.com/problems/meeting-rooms-ii/`
- Beginner-friendly Meeting Rooms II explanations:
  `https://neetcode.io/solutions/meeting-rooms-ii`
  and `https://algo.monster/liteproblems/253`
- DMOJ Beams of Light problem and editorial:
  `https://dmoj.ca/problem/ccc26s2`
  and `https://dmoj.ca/problem/ccc26s2/editorial`
- Prefix-sum foundation linked from the DMOJ editorial:
  `https://usaco.guide/silver/prefix-sums`

## Required rewrite

Refresh the prompt files so they ask for a 1D-focused lesson and site update built
around the four items above.

The updated prompts should:

- keep the beginner-friendly explanation style from the existing lesson assets
- use helpful online resources/search for simple explanatory language around
  difference arrays
- search for problem-specific explanations and relevant facts for Maximum
  Population Year, Beams of Light, and Meeting Rooms II
- preserve the mental model that diff arrays store changes and prefix sums rebuild
  values
- use Java as the primary teaching language unless a prompt file explicitly says it
  is language-neutral
- include CoderPad expectations for the three practice problems
- keep future implementation instructions compatible with the existing data and
  component shapes in the attached TypeScript files
- make clear that a future implementation pass may update `data/`, `components/`,
  and app files, but this GPT pass must update prompt files only

## Explicit replacement of old requirements

Remove the old required three-problem sequence:

1. 1D difference + restore
2. 2D difference + restore
3. Line Sweep max-overlap intro

Do not keep 2D difference + restore as a required lesson problem.
Do not require a fixed line-sweep max-overlap intro as Problem 3.
Line sweep and event counting may still appear where they naturally support
Maximum Population Year, Beams of Light, or Meeting Rooms II, but the lesson order
must come from Cindy's four `# 1D Problems` items.

## File-specific expectations

### `prompts/difference-arrays-lesson-plan.md`

Rewrite this prompt so it asks for the complete updated lesson plan centered on the
four 1D problems from Cindy's notes.

The plan prompt should request:

- audience and prerequisites
- learning goals
- a concept-first teaching section for 1D diff build and prefix restoration
- one section per Cindy problem, in the exact order listed above
- Codepad starter/solution expectations where Cindy marks "Codepad to try" or
  "Codepad to solve"
- sample inputs, sample outputs, walkthroughs, Java solutions, complexity notes,
  edge cases, common mistakes, and instructor notes

### `prompts/convert-difference-arrays-lesson-plan-to-site.md`

Rewrite this prompt so it asks for a site implementation plan that converts the
new four-item lesson plan into the existing app structure.

The conversion prompt should reference:

- `data/lessonFlow.ts`
- `data/problems.ts`
- `components/LessonFlowDeck.tsx`
- `components/ProblemCard.tsx`
- `components/CodeBlock.tsx`

It should require the future implementation to preserve the existing component
contracts unless a prompt explicitly justifies a small, targeted schema change.

### `prompts/difference-arrays-lesson-mega-prompt.md`

Rewrite the older mega prompt so it no longer requires the old 1D/2D/line-sweep
trio. Its attachment list and success criteria should align with this new
1D-focused sequence.

### Other prompt files under `prompts/`

If any other prompt files exist, update them only when they contradict the new
Cindy `# 1D Problems` sequence or still require the old trio.

## Non-goals

- Do not implement the lesson site in this pass.
- Do not edit `docs/cindy.md`.
- Do not edit TypeScript, CSS, routing, package, or test files.
- Do not keep stale instructions that force the old three-problem lesson sequence.
- Do not invent extra problems beyond the four Cindy items.

## Success criteria

- Every prompt file in `prompts/` is consistent with Cindy's four `# 1D Problems`
  items.
- The exact 9-reference-file list above is preserved, with this mega prompt
  counted as file 10.
- The old required 1D/2D/line-sweep trio is removed as a requirement.
- The prompts clearly say that this GPT pass updates prompt files only.
- Future implementation guidance remains compatible with the attached lesson data
  and component files.
