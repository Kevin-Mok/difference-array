# Difference Arrays Live Lesson

Difference Arrays Live Lesson is a frontend-only teaching deck for helping students move from direct range updates to boundary marks and one prefix-sum rebuild. It is built for instructors, interview-prep mentors, and curriculum reviewers who want to see a clear algorithm lesson expressed as typed content, guided classroom pacing, runnable examples, and presenter/student views instead of a static worksheet.

The repo is worth reviewing because it turns a beginner algorithm topic into an interactive, 2.5-hour teaching flow with Java-first reference solutions, Python comparison code, ASCII traces, problem cards, and teacher notes. The implementation shows how structured content data can drive a polished learning experience without requiring a backend, external APIs, or runtime configuration.

## Tech Stack And Why Chosen

- **Next.js App Router**: provides a small frontend app structure with metadata, layout, and page entrypoints while keeping deployment simple.
- **React**: powers the interactive lesson deck, reveal controls, presenter/student modes, language toggles, trace stepping, and live notes.
- **TypeScript**: keeps lesson steps, problem data, and component contracts explicit so content changes are safer than hardcoded JSX edits.
- **Tailwind CSS pipeline with custom CSS**: gives the project a familiar build path while preserving a focused hand-authored visual system in `app/globals.css`.
- **npm lockfile**: pins the dependency graph for reproducible local installs and builds.
- **Markdown source materials**: preserve the original lesson plan and conversion prompt as content provenance for future curriculum updates.

## What The Site Teaches

The lesson follows Cindy's four-part 1D sequence throughout the app:

1. **1D Difference Build + Restore**: build a change list from final values, then rebuild the original with prefix sums.
2. **Maximum Population Year**: treat births and deaths as year-by-year deltas and keep the earliest max year.
3. **Beams of Light**: use clipped inclusive range updates to answer parking-spot illumination queries.
4. **Meeting Rooms II**: use sparse event deltas to find peak active meeting demand.

The central memory phrase is:

```text
Store changes first.
Rebuild values later.
```

## Install From Source

Prerequisites:

- Node.js compatible with Next.js 14.
- npm.

Install dependencies:

```bash
npm install
```

## Day-to-Day Usage

Run the local development server:

```bash
npm run dev
```

Open the app at the URL printed by Next.js, usually:

```text
http://localhost:3000
```

Create a production build:

```bash
npm run build
```

Run the built app:

```bash
npm run start
```

Run the configured lint command:

```bash
npm run lint
```

## Command Options And Flags

The npm scripts in this repo do not define custom project-specific flags. Any flags after `--` are passed through to the underlying Next.js CLI, so use that only when you intentionally need a Next option such as choosing a different dev-server port.

Example:

```bash
npm run dev -- -p 3001
```

## Smoke Test

1. Run `npm install` if dependencies are not installed.
2. Run `npm run dev`.
3. Open the local URL printed by Next.js.
4. Confirm the hero says `Difference Arrays 1D: Store Changes, Rebuild Values`.
5. Confirm exactly four problem cards appear in Cindy's order: Build + Restore, Maximum Population Year, Beams of Light, Meeting Rooms II.
6. Confirm the cards show Teach/Try/Solve practice chips and source links for the LeetCode/DMOJ problems.
7. In presenter view, step through each problem's explanation phase.
8. Confirm Java is the primary solution and Python is available as a reference.
9. Confirm the Beams of Light trace includes the sample query answers `Y`, `N`, `N`, `Y`.

## Repository Map

- `app/`: Next.js layout, page entrypoint, and global styles.
- `components/`: lesson deck, problem card, code block, and visualizer components.
- `data/`: typed lesson flow and problem content used by the UI.
- `docs/codepad-java-exercises.md`: legacy paste-ready Java CoderPad exercises for the earlier range-update practice set.
- `docs/smoke-tests.md`: manual verification checks for student-facing lesson interactions.
- `prompts/difference-arrays-lesson-plan.md`: original curriculum source.
- `prompts/convert-difference-arrays-lesson-plan-to-site.md`: conversion prompt that guided the site structure.
- `prompts/refresh-cindy-1d-updated-files/`: generated refresh archive contents preserved for comparison and future regeneration.
- `docs/line-sweep-transcript.md`: generated transcript for line-sweep walkthrough content.
