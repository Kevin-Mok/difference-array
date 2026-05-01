import { type DifferenceArraysProblem, problems } from "./problems";

export interface LessonStep {
  id: string;
  title: string;
  titleTag?: string;
  durationMinutes: number;
  objective: string;
  studentContext: string[];
  referenceTable?: LessonReferenceTable;
  teacherNotes: string[];
  presenterTalkingPointGroups?: PresenterTalkingPointGroup[];
  studentMoves: string[];
  checks: string[];
  invariant?: string;
  successCriteria?: string;
  failurePatterns?: string[];
  commonFailurePatterns?: string[];
  edgeCasePrompts?: string[];
  sanityChecks?: string[];
}

export interface ProblemWorkshop {
  problemSlug: string;
  deliveryScope?: "class" | "homework";
  coachScript: string;
  presenterTalkingPointGroups?: PresenterTalkingPointGroup[];
  studentGoal: string;
  precontextPrompts?: string[];
  studentWorkPrompts?: string[];
  explanationPrompts?: string[];
  workPhaseTimings?: {
    precontextMinutes?: number;
    workMinutes?: number;
    explanationMinutes?: number;
  };
  prompts: string[];
  checkpoints: string[];
  commonBugs: string[];
  stretchQuestion: string;
  commonFailurePatterns?: string[];
  sanityChecks?: string[];
  edgeCasePrompts?: string[];
  successCriteria?: string;
}

export interface LessonFlowSummary {
  classTitle: string;
  totalMinutes: number;
  precheck: string[];
  closings: string[];
  classAgenda: LessonDeckAgendaItem[];
  lessonSteps: LessonStep[];
  problemWorkshops: ProblemWorkshop[];
}

export interface LessonDeckAgendaItem {
  kind: "lesson" | "problem";
  lessonStepId?: string;
  problemSlug?: string;
}

type PresenterExpansion = {
  bullet: string;
  expansion: string[];
};

type PresenterTalkingPointGroup = {
  heading: string;
  points: PresenterExpansion[];
};

export type LessonReferenceTable = {
  title: string;
  caption?: string;
  columns: string[];
  rows: string[][];
};

export const lessonFlow: LessonFlowSummary = {
  classTitle: "Difference Arrays 1D: Store Changes, Rebuild Values",
  totalMinutes: 150,
  precheck: [
    "Students can read and write Java arrays, loops, and simple helper methods.",
    "Students have seen prefix sums as a running total; for example, `[2, 5, 1]` has running totals `2, 7, 8`.",
    "Students can describe an interval using `start`, `end`, and whether the end is included.",
    "No 2D difference arrays, segment trees, or Fenwick trees are required for this lesson.",
  ],
  closings: [
    "A normal array stores final values; a difference array stores changes.",
    "A range update shaped like `[start, end, delta]` becomes two marks: `diff[start] += delta` and `diff[end + 1] -= delta`, where `end` is the last included index.",
    "A prefix-sum rebuild turns stored changes back into actual values.",
    "Population years, beam coverage, and meeting rooms all reuse the same artifact: a change list scanned from left to right.",
  ],
  classAgenda: [
    { kind: "lesson", lessonStepId: "foundation-diff-stores-changes" },
    { kind: "problem", problemSlug: "1d-difference-build-restore" },
    { kind: "lesson", lessonStepId: "bridge-to-population-years" },
    { kind: "problem", problemSlug: "maximum-population-year" },
    { kind: "lesson", lessonStepId: "bridge-to-beam-coverage" },
    { kind: "problem", problemSlug: "beams-of-light" },
    { kind: "lesson", lessonStepId: "bridge-to-meeting-demand" },
    { kind: "problem", problemSlug: "meeting-rooms-ii" },
    { kind: "lesson", lessonStepId: "closing-comparison" },
  ],
  lessonSteps: [
    {
      id: "foundation-diff-stores-changes",
      title: "Foundation: diff stores changes, prefix sum restores values",
      titleTag: "0-18 min",
      durationMinutes: 18,
      objective:
        "Teach the mental model that a difference array stores changes first, then a prefix sum rebuilds final values later.",
      studentContext: [
        "A normal array stores final values. Example: in `nums = [4, 7, 7, 10]`, index 1 directly stores the final value 7.",
        "A difference array stores changes between neighbors. Example: `diff[1] = 7 - 4 = 3`, so index 1 stores a `+3` change, not the final value 7.",
        "Build formula: `diff[0] = nums[0]` and `diff[i] = nums[i] - nums[i - 1]`. Example: `[4, 7, 7, 10]` builds to `[4, 3, 0, 3]`.",
        "Restore formula: `running += diff[i]` and `nums[i] = running`. Example: running totals over `[4, 3, 0, 3]` are `4, 7, 7, 10`.",
        "Range update shape first: `[start, end, delta]`. Example: `[1, 3, +3]` has `start = 1`, `end = 3`, `delta = +3`.",
        "Boundary marks: add `+3` to `diff[1]`, then add `-3` to `diff[4]`. The second mark means stop applying `+3` after index 3, where `end = 3` is the last included index.",
        "Operation count comparison: directly adding `+3` to indices 1 through 3 touches 3 cells; boundary marking touches 2 cells. For a million-cell range, direct work is huge while boundary marking is still 2 marks.",
      ],
      referenceTable: {
        title: "1D difference-array identities",
        caption: "Use this as the anchor table for every later problem.",
        columns: ["Idea", "Concrete example", "Operation"],
        rows: [
          ["Build anchor", "`nums[0] = 4`", "`diff[0] = 4`"],
          ["Build change", "`nums[1] - nums[0] = 7 - 4`", "`diff[1] = 3`"],
          ["Restore", "running goes `0 -> 4 -> 7`", "`running += diff[i]`"],
          ["Range starts", "update `[1, 3, +3]`", "`diff[1] += 3`"],
          ["Range stops", "index 3 is last included", "`diff[4] -= 3`"],
        ],
      },
      teacherNotes: [
        "Have students say out loud whether each item is a final value or a change. Example: `7` in `nums` is final; `3` in `diff` is change.",
        "Keep the operation language exact: say `add +3 to diff[1]`, not vague words like write or mark.",
        "Use the same `[4, 7, 7, 10]` row repeatedly so the formulas feel concrete before the named problems start.",
      ],
      presenterTalkingPointGroups: [
        {
          heading: "Mental model",
          points: [
            {
              bullet: "Diff arrays delay work.",
              expansion: [
                "Instead of immediately changing every cell in a range, store where the change begins and where it stops.",
                "The restore pass pays the cost once by scanning left to right.",
              ],
            },
            {
              bullet: "The anchor matters.",
              expansion: [
                "`diff[0]` is not a change from a previous index; it is the starting value.",
                "Students who double-count `diff[0]` usually started `running` at `diff[0]` and also added it again.",
              ],
            },
          ],
        },
      ],
      studentMoves: [
        "Build `[4, 7, 7, 10] -> [4, 3, 0, 3]` by naming each subtraction.",
        "Restore `[4, 3, 0, 3] -> [4, 7, 7, 10]` by naming each running total.",
        "For `[1, 3, +3]`, state `start`, `end`, and `delta` before placing boundary marks.",
      ],
      checks: [
        "Does `diff[2] = 0` mean the final value is 0, or the value did not change from the previous index?",
        "Why does `diff[end + 1] -= delta` stop after `end` instead of at `end`?",
        "How many operations are needed for one direct update over 100 cells compared with diff boundary marks?",
      ],
      invariant:
        "After restoring through index `i`, `running` equals the true value at index `i`.",
      successCriteria:
        "Students can explain `diff[0]`, build formula, restore formula, and two boundary marks using one concrete array.",
      failurePatterns: [
        "Treating the difference array as final answers.",
        "Skipping the anchor and starting build at index 1 only.",
        "Using `end` instead of `end + 1` for the stop mark in an inclusive range.",
      ],
      sanityChecks: [
        "Restoring a built diff should return the original array exactly.",
        "The sum of all sentinel-sized boundary marks for one range update should return to 0 after the stop mark.",
      ],
    },
    {
      id: "bridge-to-population-years",
      title: "Bridge: array indexes become years",
      titleTag: "41-47 min",
      durationMinutes: 6,
      objective:
        "Connect build/restore mechanics to LeetCode 1854, where births and deaths are population changes over time.",
      studentContext: [
        "What stays the same: we still store changes first and rebuild actual values with a running total. Example: `+1` at 1960 means population starts increasing there.",
        "What changes: indexes are years instead of array positions. Example: year 1960 maps to index `1960 - 1950 = 10`.",
        "Artifact that carries forward: the change list. Example: `diff[10] += 1` is the same kind of boundary mark as `diff[start] += delta`.",
        "Interval convention changes the stop mark: a person is alive through `death - 1`, so add `-1` at `death`, not at `death + 1`.",
      ],
      referenceTable: {
        title: "Population-year mapping",
        columns: ["Problem word", "Diff action", "Concrete example"],
        rows: [
          ["birth", "population starts", "`diff[1960 - 1950] += 1`"],
          ["death", "population stops before this year", "`diff[1971 - 1950] -= 1`"],
          ["scan years", "prefix sum", "current population in 1960"],
          ["tie", "keep earliest", "update only on `current > best`"],
        ],
      },
      teacherNotes: [
        "Emphasize that death year is excluded before writing any code.",
        "Use the phrase `birth starts the +1; death stops the +1`.",
      ],
      studentMoves: [
        "Convert birth year 1960 to index 10 using offset 1950.",
        "Explain why `[1950, 1961]` includes 1960 but excludes 1961.",
      ],
      checks: [
        "Where is the `-1` placed for `[1960, 1971]`?",
        "Why does scanning years upward help with earliest-year ties?",
      ],
      successCriteria:
        "Students can translate one `[birth, death]` row into two diff operations and explain the death-year exclusion.",
    },
    {
      id: "bridge-to-beam-coverage",
      title: "Bridge: one light becomes one clipped range update",
      titleTag: "70-76 min",
      durationMinutes: 6,
      objective:
        "Move from year deltas to parking-spot coverage ranges, keeping the same two-boundary update model.",
      studentContext: [
        "What stays the same: every item creates a start change and a stop change. Example: a light over spots `[2, 6]` adds `+1` at 2 and `-1` at 7.",
        "What changes: each light covers many parking spots, so first compute the clipped interval. Example: `P = 1`, `S = 1`, `N = 10` clips to `[1, 2]`.",
        "Artifact that carries forward: prefix-sum coverage. Example: after scanning, `coverage[4] > 0` means spot 4 is illuminated.",
        "The interval is inclusive: `right` is the last included spot, so the stop mark is at `right + 1`.",
      ],
      referenceTable: {
        title: "Beam update mapping",
        columns: ["Step", "Formula", "Example"],
        rows: [
          ["left edge", "`max(P - S, 1)`", "`max(4 - 2, 1) = 2`"],
          ["right edge", "`min(P + S, N)`", "`min(4 + 2, 10) = 6`"],
          ["start coverage", "`diff[left] += 1`", "`diff[2] += 1`"],
          ["stop coverage", "`diff[right + 1] -= 1`", "`diff[7] -= 1`"],
        ],
      },
      teacherNotes: [
        "Make students say `right is included` before they write `right + 1`.",
        "Point out that the problem is still 1D because spots are arranged along one wall.",
      ],
      studentMoves: [
        "Clip `P = 4`, `S = 2`, `N = 10` to `[2, 6]`.",
        "Place exactly two boundary marks for that interval.",
      ],
      checks: [
        "Why do we allocate `N + 2` instead of `N + 1`?",
        "What should a query return when coverage equals 0?",
      ],
      successCriteria:
        "Students can convert each light into a clipped inclusive interval and two boundary marks.",
    },
    {
      id: "bridge-to-meeting-demand",
      title: "Bridge: dense arrays become sparse event maps",
      titleTag: "108-114 min",
      durationMinutes: 6,
      objective:
        "Show that Meeting Rooms II is the same running-total pattern over sorted time events, but a sparse map is cleaner than a huge array.",
      studentContext: [
        "What stays the same: starts add demand and stops remove demand. Example: meeting `[5, 10]` adds `+1` at 5 and `-1` at 10.",
        "What changes: time values may be large or sparse, so a `TreeMap` stores only times where something changes.",
        "Artifact that carries forward: the running total. Example: active meetings go `1, 2, 1`; the peak is the room count.",
        "Tie convention changes: a meeting ending at time `t` frees a room for another meeting starting at `t`, so end and start at the same time can reuse one room.",
      ],
      referenceTable: {
        title: "Meeting demand mapping",
        columns: ["Event", "Diff-map action", "Concrete example"],
        rows: [
          ["meeting starts", "`delta[start] += 1`", "`delta[5] += 1`"],
          ["meeting ends", "`delta[end] -= 1`", "`delta[10] -= 1`"],
          ["same time reuse", "combine deltas", "`delta[4] = -1 + 1 = 0`"],
          ["answer", "peak active", "max rooms used at once"],
        ],
      },
      teacherNotes: [
        "Call the `TreeMap` a sparse difference array so students see continuity, not a brand-new topic.",
        "Use `[2,4]` and `[4,7]` to show same-time room reuse before showing the main sample.",
      ],
      studentMoves: [
        "List deltas for `[[0,30], [5,10], [15,20]]`.",
        "Explain why final active count is not the answer; peak active count is the answer.",
      ],
      checks: [
        "What happens when one meeting ends and another starts at the same time?",
        "Why is a sorted map better than a huge array for sparse times?",
      ],
      successCriteria:
        "Students can explain start/end deltas, same-time reuse, and peak active count.",
    },
    {
      id: "closing-comparison",
      title: "Closing comparison: four faces of the same pattern",
      titleTag: "140-150 min",
      durationMinutes: 10,
      objective:
        "Review how all four lesson problems use stored changes plus a rebuild or sweep, and name the interval convention for each one.",
      studentContext: [
        "Problem 1: values become changes, and changes become values. Example: `[4, 7, 7, 10]` and `[4, 3, 0, 3]` are two views of the same data.",
        "Problem 2: births and deaths are changes. Example: birth `+1`, death `-1`, scan years for max population.",
        "Problem 3: lights are clipped range updates. Example: `[left, right]` uses `diff[left] += 1` and `diff[right + 1] -= 1`.",
        "Problem 4: meetings are sparse event deltas. Example: start `+1`, end `-1`, scan sorted times for peak active meetings.",
        "The big habit: before writing code, define the update shape and interval convention. Example: `[start, end, delta]` with `end` included needs `end + 1`; `[birth, death)` stops at `death`.",
      ],
      referenceTable: {
        title: "What carries forward?",
        columns: ["Problem", "What stays the same", "What changes"],
        rows: [
          ["Build + Restore", "change list + prefix sum", "we build diff from a known original"],
          ["Maximum Population", "start/stop deltas + scan", "indexes are years and death is excluded"],
          ["Beams of Light", "range start/stop marks + scan", "intervals must be clipped to `[1, N]`"],
          ["Meeting Rooms II", "event deltas + scan", "use sparse sorted times and track peak active"],
        ],
      },
      teacherNotes: [
        "Ask each student to name one bug they are now watching for.",
        "End with the repeated phrase: store changes first, rebuild values later.",
      ],
      studentMoves: [
        "Match each problem to its two marks or event deltas.",
        "Name the interval convention for population, beams, and meetings.",
        "Predict which common bug would change the sample output.",
      ],
      checks: [
        "Which problem uses an offset, and why?",
        "Which problem needs clipping, and why?",
        "Which problem uses a sparse map, and why?",
      ],
      successCriteria:
        "Students can solve or explain all four problems using one shared mental model.",
    },
  ],
  problemWorkshops: [
    {
      problemSlug: "1d-difference-build-restore",
      deliveryScope: "class",
      coachScript:
        "Teach this as the foundation: build the change list, restore with a running total, then show one inclusive range update using two boundary marks.",
      studentGoal:
        "Build `[4, 7, 7, 10] -> [4, 3, 0, 3]`, restore it back, and explain `diff[1] += 3`, `diff[4] -= 3` for update `[1, 3, +3]`.",
      precontextPrompts: [
        "What does a normal array store? Example: in `[4, 7, 7, 10]`, index 1 stores final value 7.",
        "What does a diff array store? Example: `diff[1] = 3` stores the change from 4 to 7.",
        "Why is `diff[0] = 4` called an anchor?",
        "For update `[1, 3, +3]`, name `start`, `end`, and `delta` before touching `diff`.",
      ],
      studentWorkPrompts: [
        "Fill in every diff entry for `[4, 7, 7, 10]` using subtraction from the previous value.",
        "Restore `[4, 3, 0, 3]` with a running total table.",
        "Place the two boundary marks for `n = 5`, update `[1, 3, +3]`.",
        "Compare direct update operations with diff operations for range length 3 and range length 1,000,000.",
      ],
      explanationPrompts: [
        "Walk through build: `4`, `7 - 4`, `7 - 7`, `10 - 7`.",
        "Walk through restore: `running` becomes `4`, `7`, `7`, `10`.",
        "Explain that `end + 1 = 4` means stop after index 3, where index 3 is the last included index.",
        "Run `roundTripCheck` and connect correctness to the build/restore formulas.",
      ],
      prompts: [
        "Build diff from original values.",
        "Restore original values from diff.",
        "Explain the range update `[start, end, delta]` with two boundary marks.",
      ],
      checkpoints: [
        "diff is `[4, 3, 0, 3]`",
        "restored is `[4, 7, 7, 10]`",
        "range update `[1, 3, +3]` uses `diff[1] += 3` and `diff[4] -= 3`",
        "student can say `diff` stores changes, not final values",
      ],
      commonBugs: [
        "Returning `diff` as if it were the restored array.",
        "Double-counting `diff[0]` during restore.",
        "Using subtraction instead of addition in the prefix-sum rebuild.",
        "Forgetting that `end` is the last included index before using `end + 1`.",
      ],
      stretchQuestion:
        "If the update were `[0, 4, -2]` on `n = 5`, where would the stop mark go and why does the sentinel slot matter?",
      successCriteria:
        "Students can build, restore, and explain the boundary mark mini-example without looking at the solution.",
      workPhaseTimings: {
        precontextMinutes: 5,
        workMinutes: 10,
        explanationMinutes: 8,
      },
    },
    {
      problemSlug: "maximum-population-year",
      deliveryScope: "class",
      coachScript:
        "Let students try the problem after the bridge. Keep redirecting them from recounting all people every year toward marking births and deaths once.",
      studentGoal:
        "Use an offset difference array to return the earliest year with maximum population.",
      precontextPrompts: [
        "What is the index for year 1950 if the offset is 1950?",
        "For `[birth, death] = [1960, 1971]`, what year is the last included year?",
        "What diff operation happens at birth? What diff operation happens at death?",
        "Why should the answer update on `current > best`, not `current >= best`?",
      ],
      studentWorkPrompts: [
        "Create a sentinel-safe `int[] diff` for the year range.",
        "For each log, add `+1` at `birth - 1950` and `-1` at `death - 1950`.",
        "Scan from 1950 upward and maintain `current`, `best`, and `answer`.",
        "Trace `[[1950,1961],[1960,1971],[1970,1981]]` and verify the answer is 1960.",
      ],
      explanationPrompts: [
        "Show that death is excluded with one concrete person: `[1950,1961]` is alive through 1960 only.",
        "Show why strict `>` preserves earliest ties using 1960 and 1970 in the second example.",
        "Compare operation counts: per-year recounting versus two marks per person plus one scan.",
      ],
      prompts: [
        "Birth adds `+1`.",
        "Death adds `-1` because death year is excluded.",
        "Scan years upward and keep earliest tie.",
      ],
      checkpoints: [
        "uses `year - 1950` offset",
        "marks `diff[birth - 1950] += 1`",
        "marks `diff[death - 1950] -= 1`",
        "answer updates only on strict greater population",
        "sample `[[1993,1999],[2000,2010]]` returns 1993",
      ],
      commonBugs: [
        "Counting the death year as alive.",
        "Using `death + 1` for the stop mark.",
        "Replacing earliest answer on equal population.",
        "Forgetting the 1950 offset.",
      ],
      stretchQuestion:
        "How would the approach change if years were not limited to 1950 through 2050?",
      successCriteria:
        "Students can implement the array solution and defend the earliest-year tie behavior.",
      workPhaseTimings: {
        precontextMinutes: 5,
        workMinutes: 10,
        explanationMinutes: 8,
      },
    },
    {
      problemSlug: "beams-of-light",
      deliveryScope: "class",
      coachScript:
        "Treat this as the main solve problem. Slow down on input parsing, clipping, 1-indexing, and the O(1) query payoff after preprocessing.",
      studentGoal:
        "Solve Beams of Light with clipped intervals, boundary marks, one coverage rebuild, and O(1) query answers.",
      precontextPrompts: [
        "Why are parking spots easier to store with 1-indexing in this problem?",
        "For `P = 4`, `S = 2`, `N = 10`, what are `left` and `right`?",
        "For `P = 1`, `S = 1`, why is `left` clipped to 1?",
        "If `right = N`, why does `diff` need length `N + 2`?",
      ],
      studentWorkPrompts: [
        "Read `N`, `L`, and `Q` in the order from the statement.",
        "For every light, compute `left = max(P - S, 1)` and `right = min(P + S, N)`.",
        "Add `+1` to `diff[left]` and `-1` to `diff[right + 1]`.",
        "Build `coverage[spot]` once with a prefix sum from 1 to `N`.",
        "Answer each query with `Y` if `coverage[spot] > 0`, otherwise `N`.",
      ],
      explanationPrompts: [
        "Trace the sample lights: `8 0 -> [8,8]`, `1 1 -> [1,2]`, `4 2 -> [2,6]`.",
        "Show why query 4 is `Y`, query 10 is `N`, query 7 is `N`, and query 1 is `Y`.",
        "Emphasize `O(N + L + Q)`: two marks per light, one rebuild, one lookup per query.",
      ],
      prompts: [
        "Clip every light interval before marking diff.",
        "Use 1-indexing and a sentinel slot.",
        "Precompute coverage once, then answer queries directly.",
      ],
      checkpoints: [
        "sample output is exactly `Y`, `N`, `N`, `Y`",
        "arrays have length `N + 2` or otherwise safely handle `right + 1`",
        "coverage is built once before processing queries",
        "query logic is `coverage[spot] > 0`",
        "time complexity stated as `O(N + L + Q)`",
      ],
      commonBugs: [
        "Reading the input order incorrectly: `N`, then `L`, then `Q`.",
        "Not clipping intervals at the garage edges.",
        "Using `right` instead of `right + 1` for the stop mark.",
        "Using 0-indexed spot numbers by accident.",
        "Recomputing coverage for every query.",
      ],
      stretchQuestion:
        "How would memory and time change if the garage had 5 billion possible spots but only a few lights and queries?",
      successCriteria:
        "Students can solve the sample and explain every boundary mark in the Java solution.",
      workPhaseTimings: {
        precontextMinutes: 6,
        workMinutes: 16,
        explanationMinutes: 10,
      },
    },
    {
      problemSlug: "meeting-rooms-ii",
      deliveryScope: "class",
      coachScript:
        "Let students try the sparse event-delta version. Keep the focus on start/end demand changes and same-time room reuse, not heap tricks.",
      studentGoal:
        "Use a `TreeMap<Integer, Integer>` as a sparse difference map to compute the peak active meeting count.",
      precontextPrompts: [
        "What does a meeting start do to room demand? Give an example with `[5, 10]`.",
        "What does a meeting end do to room demand?",
        "Why can `[2, 4]` and `[4, 7]` reuse one room?",
        "Why might a sparse map be better than an array indexed by every possible time?",
      ],
      studentWorkPrompts: [
        "Create a `TreeMap<Integer, Integer>` named `delta`.",
        "For each meeting, add `+1` at start and `-1` at end.",
        "Scan sorted entries and update `active` with each combined delta.",
        "Track `maxRooms` after each time.",
        "Test both required examples: `[[0,30],[5,10],[15,20]] -> 2` and `[[7,10],[2,4]] -> 1`.",
      ],
      explanationPrompts: [
        "Walk the main sample: active becomes 1, 2, 1, 2, 1, 0.",
        "Show same-time reuse: at time 4, one `-1` and one `+1` combine to 0.",
        "Explain why the answer is peak active meetings, not total meetings or final active meetings.",
      ],
      prompts: [
        "Start adds demand.",
        "End removes demand.",
        "Sorted scan finds peak active demand.",
      ],
      checkpoints: [
        "uses `TreeMap<Integer, Integer>` or another sorted event structure",
        "marks `delta[start] += 1` and `delta[end] -= 1`",
        "tracks `active` and `maxRooms` separately",
        "explains same-time end/start reuse correctly",
        "required examples return 2 and 1",
      ],
      commonBugs: [
        "Treating an end time equal to a start time as an overlap.",
        "Forgetting to aggregate deltas at the same time.",
        "Returning `active` at the end instead of `maxRooms`.",
        "Using a huge dense array when event times are sparse.",
      ],
      stretchQuestion:
        "How would a sorted event-list solution need to order end events and start events at the same time?",
      successCriteria:
        "Students can implement the sparse difference-map solution and explain why same-time reuse works.",
      workPhaseTimings: {
        precontextMinutes: 5,
        workMinutes: 12,
        explanationMinutes: 9,
      },
    },
  ],
};

export const getProblemBySlug = (
  slug: string,
): DifferenceArraysProblem | undefined => {
  return problems.find((problem) => problem.slug === slug);
};

export const workshopOrder = lessonFlow.problemWorkshops.map(
  (workshop) => workshop.problemSlug,
);
