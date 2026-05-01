# Convert Difference Arrays Lesson Plan to Site: Implementation Planning Prompt

Use this prompt after the 1D-focused Difference Arrays lesson plan has been refreshed.

The goal is to produce a careful site implementation plan, and only implement code when the user explicitly asks for an implementation pass.

## Current prompt-update pass scope

For the prompt-refresh pass that produced this file, only files under `prompts/` may be edited. Do not edit `data/`, `components/`, `app/`, `pages/`, CSS, package files, or tests during the prompt-refresh pass.

## Future site conversion goal

Convert the updated four-item 1D lesson into the existing app structure.

The required lesson sequence is:

1. Generate a 1D diff array, then regenerate the original array using prefix sum.
2. LeetCode 1854, Maximum Population Year — CoderPad **try**.
3. CCC 2026 S2, Beams of Light — CoderPad **solve**.
4. LeetCode Meeting Rooms II — CoderPad **try**.

Cindy's `docs/cindy.md` `# 1D Problems` section is the source of truth when older files disagree.

## Required references

Inspect these files before proposing or making site changes:

- `data/lessonFlow.ts`
- `data/problems.ts`
- `components/LessonFlowDeck.tsx`
- `components/ProblemCard.tsx`
- `components/CodeBlock.tsx`
- the refreshed `prompts/difference-arrays-lesson-plan.md`
- the refreshed lesson-plan content, if a separate generated lesson plan exists

## Existing contracts to preserve

Preserve existing component and data contracts unless there is a clear, small, justified reason to change them.

Important shapes from the current app:

- `DifferenceArraysProblem` in `data/problems.ts`
  - `id`
  - `title`
  - `difficulty`
  - `conceptFocus`
  - `slug`
  - optional `codepadLinks`
  - `description`
  - `conceptBeforeProblem`
  - `realWorldContext`
  - `beginnerHint`
  - `applyConcept`
  - `inputSpec`
  - `outputSpec`
  - `sampleInput`
  - `sampleOutput`
  - `pythonSolution`
  - `javaSolution`
  - `explanation`
  - `traceAscii`
  - `timeComplexity`
  - `spaceComplexity`
  - optional `commonMistakes`
- `LessonStep`, `ProblemWorkshop`, and `LessonFlowSummary` in `data/lessonFlow.ts`
- `ProblemCard` renders problem metadata, sample I/O, complexity, and optional CoderPad links.
- `CodeBlock` supports `java` and `python` highlighting.
- `LessonFlowDeck` should continue to consume the existing lesson-flow and problem structures.

## Planning output requirements

Before any implementation, produce a plan that includes:

- files to update
- fields or sections to update in each file
- whether schema changes are needed
- how each of the four lesson items maps to `problems.ts`
- how the lesson sequence maps to `lessonFlow.ts`
- how CoderPad try/solve expectations will be represented
- any component changes, only if necessary
- a short risk list and validation checklist

## Expected data mapping

### `data/problems.ts`

Replace the old required trio with four 1D-focused problem cards:

1. `1d-difference-build-restore`
   - concept foundation
   - no CoderPad requirement unless a link is supplied
2. `maximum-population-year`
   - LeetCode 1854
   - CoderPad try
3. `beams-of-light`
   - CCC 2026 S2
   - CoderPad solve
4. `meeting-rooms-ii`
   - LeetCode Meeting Rooms II
   - CoderPad try

Keep Java as the primary teaching solution. Keep Python solution strings if the existing data interface requires them.

Do not invent CoderPad URLs. If links are unavailable, either omit `codepadLinks` or use a clearly marked TODO only if the project convention supports TODO placeholders.

### `data/lessonFlow.ts`

Update the flow so it supports the same four-item sequence:

- concept-first intro to diff arrays
- boundary marks and prefix rebuild
- Maximum Population Year try workshop
- Beams of Light solve workshop
- Meeting Rooms II try workshop
- wrap-up comparing the same mental model across all problems

Ensure `problemWorkshops` references the new slugs in order.

### Components

Do not change components unless the current UI cannot represent the new lesson requirements.

If a component change is justified, keep it targeted. Examples of acceptable small changes:

- display a CoderPad label such as `Try` or `Solve` if the data model is extended
- render an extra problem card without layout breakage
- support a short practice-type tag

Avoid broad redesigns.

## Problem fact anchors to preserve in the site content

### 1D foundation

- `diff[0] = nums[0]`
- `diff[i] = nums[i] - nums[i - 1]`
- prefix sum restores values
- range add uses `diff[l] += value` and `diff[r + 1] -= value`

### Maximum Population Year

- birth adds `+1`
- death adds `-1`
- death year is excluded
- earliest year wins ties
- scan years in increasing order

### Beams of Light

- spots are `1..N`
- clipped interval is `[max(P - S, 1), min(P + S, N)]`
- each light adds one to coverage across that interval
- query result is `Y` when coverage is greater than zero, else `N`
- use `O(N + L + Q)` prefix preprocessing

### Meeting Rooms II

- room count equals peak active meetings
- start adds demand
- end removes demand
- end at time `t` frees a room for start at time `t`
- if using sorted events, process end before start on equal times
- if using a delta map, `delta[start] += 1` and `delta[end] -= 1` naturally handles same-time reuse when summed at each time

## Validation checklist

After implementation, verify:

- the app shows exactly four problems in Cindy's order
- no required 2D difference problem remains
- no fixed generic line-sweep max-overlap problem remains as Problem 3
- Java code is present and emphasized
- code blocks still render correctly
- CoderPad links are not invented
- samples and outputs match the named problem statements
- `workshopOrder` and problem slugs agree
- TypeScript builds without schema/type errors

## Non-goals

- Do not implement during a prompt-only pass.
- Do not add extra problems.
- Do not introduce advanced data structures as required content.
- Do not rewrite the app architecture.
- Do not remove Python fields unless the data contract is intentionally changed and justified.
