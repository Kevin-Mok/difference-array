# Prompt: Convert the Difference Arrays Lesson Plan Into Site Content

Convert the generated Difference Arrays lesson plan into this algorithm teaching site’s format.

This prompt assumes the lesson plan already exists at:

`difference-arrays-lesson-plan.md`

## Context

Use `/home/kevin/coding/sliding-window` as the canonical reference site.

That site teaches algorithms through a lesson deck and problem-driven interface. Its structure uses:

- typed lesson-flow data
- typed problem data
- theory and teacher notes
- problem cards
- code blocks
- ASCII visualizer traces
- beginner-facing explanations

Use the sliding-window site as the format reference. Do not invent a new layout or new teaching structure unless a direct dependency requires it.

## Reference Site

Reference this site for structure, rhythm, component contracts, and visual style:

```text
/home/kevin/coding/sliding-window
```

Mimic the reference site’s lesson deck, cards, code blocks, trace display, and presenter/student teaching rhythm. Modify the copied structure only when it makes the Difference Arrays lesson clearer or more helpful for beginners.

Do not blindly preserve sliding-window-specific names or wording. Rename topic-specific types, labels, slugs, metadata, and copy when they should describe Difference Arrays instead.

## Required Context Files

When using this prompt, include or read these files before editing:

1. `difference-arrays-lesson-plan.md`
   - Source of truth for the new Difference Arrays lesson content.
2. `/home/kevin/coding/sliding-window/data/lessonFlow.ts`
   - Existing lesson-flow schema, deck rhythm, theory sections, teacher notes, checks, and problem workshop structure.
3. `/home/kevin/coding/sliding-window/data/problems.ts`
   - Existing problem schema, fields, code examples, explanations, traces, complexity notes, and common mistakes.
4. `/home/kevin/coding/sliding-window/components/LessonFlowDeck.tsx`
   - Rendering contract for lesson steps, problem workshops, code areas, traces, and summary sections.
5. `/home/kevin/coding/sliding-window/components/ProblemCard.tsx`
   - Rendering contract for cards generated from typed problem data.
6. `/home/kevin/coding/sliding-window/components/CodeBlock.tsx`
   - Rendering contract for primary Java code and additional Python code.
7. `/home/kevin/coding/sliding-window/components/Visualizer.tsx`
   - Rendering contract for ASCII trace content.
8. `/home/kevin/coding/sliding-window/app/page.tsx`
   - Page entrypoint that shows which top-level component drives the site.
9. `/home/kevin/coding/sliding-window/app/layout.tsx`
   - Metadata and layout context, especially if the topic title or description needs to change.
10. `/home/kevin/coding/sliding-window/app/globals.css`
   - Existing visual tokens and styles; preserve them unless a small topic-specific copy change requires CSS support.

## Goal

Create a Difference Arrays version of the site content by converting the Markdown lesson plan into the same teaching format as `/home/kevin/coding/sliding-window`.

The output should feel like the sliding-window site format, but with Difference Arrays content instead of Sliding Window content. Preserve the lesson plan’s beginner pacing: first make `diff` concrete, then teach one boundary-mark update, then combine many updates with one rebuild.

## First Step

Read the required context files above and use them to understand the reference content model and rendering expectations before making edits.

## Required Content Behavior

Preserve exactly the three basic Difference Arrays problems from the lesson plan, in this order:

1. `Build the Change List`
   - concept focus: understand what a difference array stores
2. `One Range Update With Boundary Marks`
   - concept focus: apply one range update and rebuild with prefix sums
3. `Multiple Range Updates, One Rebuild`
   - concept focus: combine several boundary marks and reconstruct once

Use these lesson-plan titles unless an existing UI label has a hard length constraint. If shortening is necessary, keep the original title in the detail view or teacher notes.

For each problem, preserve:

- title
- difficulty
- concept focus
- concept explanation before the problem
- real-world context
- beginner hint
- applied concept explanation
- sample input
- sample output
- Java solution as the primary teaching language
- Python solution as an additional language
- step-by-step explanation
- ASCII trace
- time complexity
- space complexity
- common mistakes

Keep the theory visible near the relevant problem. Do not move all theory into one disconnected introduction.

## Site Format Requirements

Mirror the sliding-window site structure and rhythm:

- opening lesson theory
- problem-driven learning sequence
- cards generated from typed problem data
- detail sections with code and traces
- concise closing checklist or summary
- teacher checks or instructor notes where the current lesson-flow model supports them

Use mapped data rather than hardcoded repeated JSX wherever the current site does so.

## Data Modeling Requirements

Update or create typed data in the same style as the reference site’s `data/problems.ts` and `data/lessonFlow.ts`.

If you copy the reference model, rename topic-specific public types and exports where appropriate. For example, a copied `SlidingWindowProblem` type should become a Difference Arrays type name instead of retaining the old algorithm name.

The problem data must support the existing display needs:

- `id`
- `title`
- `difficulty`
- `conceptFocus`
- `slug`
- `description`
- `inputSpec`
- `outputSpec`
- `sampleInput`
- `sampleOutput`
- `javaSolution` as the primary/default solution
- `pythonSolution` as an additional language solution
- `explanation`
- `traceAscii`
- `timeComplexity`
- `spaceComplexity`
- `commonMistakes`

The lesson-flow data must support beginner teaching around:

- what a difference array stores
- direct range updates versus boundary marks
- prefix-sum reconstruction
- how each problem applies the theory
- the memory phrase: mark where the change starts, mark where the change stops, prefix-sum once to rebuild

If the existing typed data model does not have dedicated fields for `conceptBeforeProblem`, `realWorldContext`, `beginnerHint`, or `applyConcept`, extend the model minimally instead of flattening those sections into one long description.

## Content Requirements

Use beginner-friendly titles and concepts.

Use the lesson plan’s exact problem progression:

1. `Build the Change List`
   - sample input: `nums = [4, 7, 7, 10]`
   - sample output: `[4, 3, 0, 3]`
2. `One Range Update With Boundary Marks`
   - sample input: `n = 5`, `update = [1, 3, 3]`
   - sample output: `[0, 3, 3, 3, 0]`
3. `Multiple Range Updates, One Rebuild`
   - sample input: `n = 5`, `updates = [[1, 3, 3], [0, 2, 2], [2, 4, -1]]`
   - sample output: `[2, 5, 4, 2, -1]`

Do not change the number of problems. Do not replace these samples with new ones.

## Lesson Plan Mapping Notes

The opening theory should introduce these definitions before the problem sequence leans on them:

- `range update`: add or subtract an amount across one continuous index range
- `difference array`: an array that stores changes between neighboring positions
- `delta`: the amount of change being added
- `boundary mark`: a change recorded at the start of a range or just after the end of a range
- `prefix sum`: a running total used to rebuild final values from stored changes

The central formula must appear exactly in beginner-facing copy or code-adjacent explanation:

```text
diff[start] += delta
if end + 1 < n:
    diff[end + 1] -= delta
```

The mental model should stay visible throughout the lesson:

```text
+delta turns the change on.
-delta turns the change off.
The running total shows which changes are active at each index.
```

The closing summary should reinforce:

```text
Mark where the change starts.
Mark where the change stops.
Prefix-sum once to rebuild.
```

## Teaching Copy Requirements

For every problem, include language that answers:

- What concept are we learning right now?
- Why does this concept matter?
- What hint helps the student start?
- How does the concept map to this exact input?
- What should the student watch for while tracing?

Define technical terms before using them heavily:

- `difference array`
- `range update`
- `delta`
- `boundary mark`
- `prefix sum`

Do not introduce advanced structures like Fenwick trees, segment trees, sweep line, or coordinate compression.

## Implementation Constraints

- Keep the site frontend-only.
- Keep the reference component architecture unless a small extension is necessary.
- Prefer minimal, surgical changes.
- Preserve responsive behavior and accessibility.
- Do not rewrite unrelated visual design.
- Do not change unrelated algorithms or old lesson content unless the site is intentionally being converted fully to Difference Arrays.
- If replacing Sliding Window content entirely, keep the same rendering structure and only swap the lesson/problem content.
- Display Java as the primary/default solution language in the site copy, even if copied reference components default to Python.
- Include Python as an additional language, not the primary teaching language.
- Do not create a duplicate `docs/difference-arrays-lesson-plan.md` just to satisfy an old prompt path. Use `difference-arrays-lesson-plan.md` unless the file is intentionally relocated.
- Modify component copy, labels, or tiny data-model seams when that improves beginner clarity for Difference Arrays.

## Acceptance Criteria

The conversion is successful if:

- the site presents a Difference Arrays lesson instead of the original topic
- exactly three problems appear with the lesson-plan titles listed above
- each problem includes theory, context, hint, primary Java solution, additional Python solution, explanation, trace, complexity, and common mistakes
- problem cards and detail sections are generated from typed data
- the theory is interwoven with the problems instead of isolated at the top
- the page still uses the sliding-window site’s lesson deck, card, code block, and visualizer style
- no external APIs or runtime configuration are introduced
- the sample inputs, sample outputs, Java solutions, Python solutions, and ASCII traces agree with the lesson plan
- topic-specific names and metadata refer to Difference Arrays, not Sliding Window

## Verification

After implementation, verify:

1. The page renders all three Difference Arrays problems.
2. The lesson flow introduces the concept before asking students to solve.
3. Each problem has its own beginner theory and hint.
4. The Java code, additional Python code, and ASCII trace agree with each problem’s sample output from `difference-arrays-lesson-plan.md`.
5. The site keeps the same format and visual structure as `/home/kevin/coding/sliding-window`.
6. The page does not mention advanced structures such as Fenwick trees, segment trees, sweep line, or coordinate compression.
7. Java is the primary/default displayed solution, with Python available as an additional reference implementation.
