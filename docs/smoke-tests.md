# Smoke Tests

## Lesson Deck Reveal Controls

- **Action:** Open the lesson deck, navigate to any teaching slide with hidden teaching points, and select `Reveal all`.
  **Expected:** All teaching points for the current slide appear and the progress count matches the total.
- **Action:** Open a problem phase with prompt reveals visible and select `Reveal all`.
  **Expected:** All prompts for the current problem phase appear without changing the active slide or phase.

## Problem 1 CoderPad Links

- **Action:** Open the lesson site, find Problem 1: Build the Change List, and select `Try in CoderPad`.
  **Expected:** The browser opens `https://app.coderpad.io/442X6337` in a new tab for the student practice pad.
- **Action:** Open the lesson site, find Problem 1: Build the Change List, and select `Solution CoderPad`.
  **Expected:** The browser opens `https://app.coderpad.io/G3EJX4JF` in a new tab for the solution pad.
- **Action:** In the lesson deck, navigate to any Problem 1 phase and select `Open student pad` and `Open solution pad`.
  **Expected:** The same student and solution CoderPad URLs open in new tabs.
