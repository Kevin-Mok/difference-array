# Smoke Tests

## Lesson Deck Reveal Controls

- **Action:** Open the lesson deck, navigate to any teaching slide with hidden teaching points, and select `Reveal all`.
  **Expected:** All teaching points for the current slide appear and the progress count matches the total.
- **Action:** Open a problem phase with prompt reveals visible and select `Reveal all`.
  **Expected:** All prompts for the current problem phase appear without changing the active slide or phase.

## Cindy 1D Lesson Flow

- **Action:** Open the lesson site and scan the problem path.
  **Expected:** Exactly four cards appear in order: `1D Difference Build + Restore`, `LeetCode 1854: Maximum Population Year`, `CCC 2026 S2: Beams of Light`, and `LeetCode Meeting Rooms II`.
- **Action:** Open the lesson site and inspect the problem-card chips and links.
  **Expected:** Problem 1 shows `Teach`; Problems 2 and 4 show `Try`; Problem 3 shows `Solve`; source links appear only for the LeetCode and DMOJ-backed problems.
- **Action:** In presenter view, navigate through the explanation phases for all four problems.
  **Expected:** Java is selected by default, Python remains available as a comparison, and no required 2D restore or generic max-overlap problem appears in the active lesson path.
- **Action:** Navigate to the Beams of Light explanation phase and reveal the trace.
  **Expected:** The sample query answers are shown as `Y`, `N`, `N`, `Y`.
