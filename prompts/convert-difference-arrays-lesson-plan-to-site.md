# Difference Arrays: Mega GPT Revision Prompt

Use this as the single prompt payload for GPT whenever you request a full lesson refresh.

### Scope

Update only these two files:

- `difference-arrays-lesson-plan.md`
- `convert-difference-arrays-lesson-plan-to-site.md`

Do not edit data files, components, or app routing.

### Required attachments (max 10 files)

- `docs/cindy.md`
- `docs/line-sweep-transcript.md`
- `docs/line-sweep-notes.pdf`
- `data/lessonFlow.ts`
- `data/problems.ts`
- `components/LessonFlowDeck.tsx`
- `components/ProblemCard.tsx`
- `components/CodeBlock.tsx`
- `difference-arrays-lesson-plan.md`
- `convert-difference-arrays-lesson-plan-to-site.md`

If the PDF has poor OCR, use transcript text as the operational source for Problem 3.

### Final required format

- Keep exactly these three problems in order:
  1. 1D difference + restore
  2. 2D difference + restore
  3. Line Sweep max-overlap intro
- Keep Java as primary solution language with inline comments on important steps.
- Keep Python as a secondary solution.
- Keep the lesson in card-friendly, short-block format.

### File contract for `difference-arrays-lesson-plan.md`

Must include:

- Title
- Audience
- Learning Goals
- Problem 1
- Problem 2
- Problem 3
- Closing Summary
- Instructor Notes

Each problem section must include:

- concept-before
- real-world context
- problem statement
- beginner hint
- apply concept
- input
- output
- sample input
- sample output
- step-by-step explanation
- Java solution
- Python solution
- ASCII trace
- time complexity
- space complexity
- common mistakes

### Problem constraints

- Problem 1: reverse operation is explicit (recover original from diff) and includes pre-intro showing how original -> diff is built.
- Problem 2: reverse operation for 2D with explicit boundary cases:
  - `(0,0)`
  - first row
  - first column
  - inner matrix cells
- Problem 2 must explain above/left/diagonal with visuals/text and provide both formulas:
  - `diff[r][c] = A[r][c] - A[r-1][c] - A[r][c-1] + A[r-1][c-1]`
  - `A[r][c] = diff[r][c] + A[r-1][c] + A[r][c-1] - A[r-1][c-1]`
- Problem 3: event model for line sweep, start and end events, sorted order, start-before-end tie handling at same coordinate.

### Non-goals

- no 4th problem
- no advanced-range structures
- no rewrite away from existing flow conventions

### Success

- Problem 1 and 2 are internally consistent examples: build-to-reverse and reverse-to-build checks.
- Problem 3 uses interval events and returns the correct max overlap.
- Prompt and lesson files match and do not contradict each other.
