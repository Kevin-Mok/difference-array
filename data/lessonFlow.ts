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
  classTitle: "Difference Arrays: Mark Change, Then Rebuild",
  totalMinutes: 90,
  precheck: [
    "Students know arrays/lists, loops, zero-based indexes, and prefix sums.",
    "Students know basic Big-O vocabulary.",
    "No advanced data structures are required.",
  ],
  closings: [
    "Diff stores change, not final values.",
    "Boundary marks and event deltas are delayed work.",
    "Prefix sums/sweeps rebuild the actual values when needed.",
  ],
  classAgenda: [
    { kind: "lesson", lessonStepId: "opening-theory" },
    { kind: "problem", problemSlug: "1d-difference-restore" },
    { kind: "lesson", lessonStepId: "two-dimensional-difference" },
    { kind: "problem", problemSlug: "2d-difference-restore" },
    { kind: "lesson", lessonStepId: "line-sweep" },
    { kind: "problem", problemSlug: "line-sweep-max-overlap-intro" },
    { kind: "lesson", lessonStepId: "closing-checklist" },
  ],
  lessonSteps: [
    {
      id: "opening-theory",
      title: "Store changes first, then reconstruct",
      titleTag: "0-18 min",
      durationMinutes: 18,
      objective:
        "Define difference array, delta, boundary marks, and reverse reconstruction with a running total.",
      studentContext: [
        "A difference array stores the local change from one index to the next.",
        "For 1D: diff[0] is the anchor value; diff[i] is the change from nums[i-1] to nums[i].",
        "To rebuild, keep a running sum while scanning from left to right.",
        "The same idea extends to 2D with cells around each coordinate.",
      ],
      referenceTable: {
        title: "Core identity",
        columns: ["Operation", "Meaning", "Formula"],
        rows: [
          [
            "1D build",
            "Local change",
            "diff[0]=a[0], diff[i]=a[i]-a[i-1]",
          ],
          [
            "1D restore",
            "Running total",
            "running += diff[i]; restored[i]=running",
          ],
          ["2D boundary", "Store local corner diff", "above-left inclusion-exclusion"] ,
        ],
      },
      teacherNotes: [
        "Ask students to classify each array as `change` vs `final` before showing formulas.",
        "Use one concrete row each: [4, 7, 7, 10] and [1, 3, 6].",
        "Keep formulas short and repeat the phrase: diff stores changes, restore stores values.",
      ],
      studentMoves: [
        "Say what `diff[2] = 0` means in words.",
        "Name the anchor at index 0 in every restore.",
        "Explain why `active += delta` is the same pattern across 1D/2D/line sweep.",
      ],
      checks: [
        "Does diff store final values or changes?",
        "When would a cell with 0 change still matter?",
        "Why is the running total needed?",
      ],
      presenterTalkingPointGroups: [
        {
          heading: "Terminology reset",
          points: [
            {
              bullet: "Difference array",
              expansion: [
                "This is the store of changes between neighboring values.",
                "Students can recover values with a reverse scan operation.",
              ],
            },
            {
              bullet: "Boundary mark",
              expansion: [
                "A boundary means where a change becomes active or inactive.",
                "In 1D and line sweep, that is implemented as +delta and -delta events.",
              ],
            },
          ],
        },
      ],
    },
    {
      id: "two-dimensional-difference",
      title: "2D restore with above/left/diagonal",
      titleTag: "18-45 min",
      durationMinutes: 27,
      objective:
        "Show the 2D inclusion-exclusion reverse formula and the four boundary cases.",
      studentContext: [
        "Each cell’s restore uses a local neighborhood: above, left, and diagonal.",
        "The diagonal is included twice when adding above and left, so subtract it once.",
        "You need separate handling for (0,0), first row, and first column.",
      ],
      teacherNotes: [
        "Draw the 2x2 cell block whenever discussing diagonal double-counting.",
        "Ask students to identify which neighbor terms exist at each boundary case.",
        "Keep the same visual language as the 1D running total.",
      ],
      studentMoves: [
        "Predict the boundary case for each target cell.",
        "State why diagonal is subtracted in inner cells.",
        "Restore a small 2x2 grid before scaling up.",
      ],
      checks: [
        "Which boundary case is (0,3)?",
        "Where does the diagonal term come from?",
        "What happens if we forget to handle first row separately?",
      ],
      failurePatterns: [
        "Applying the inner-cell formula on first row/first column.",
        "Forgetting to keep (0,0) as a special case.",
      ],
    },
    {
      id: "line-sweep",
      title: "Closed-interval sweep as active-event counting",
      titleTag: "45-72 min",
      durationMinutes: 27,
      objective:
        "Map range overlap to sorted start/stop events and compute max active count correctly with tie order.",
      studentContext: [
        "Every interval creates an event where overlap increases and where it decreases.",
        "Closed intervals share the endpoint, so start and end on same coordinate should process in that order.",
        "The maximum overlap is the peak active count during the sweep.",
      ],
      teacherNotes: [
        "Make tie-order explicit with a tiny table: start=+1 first, then end=-1.",
        "Use only one scan after creating 2n events.",
      ],
      studentMoves: [
        "Build event list by hand from 2-3 intervals.",
        "Sort events by coordinate then tie rule.",
        "Track active count and max together.",
      ],
      checks: [
        "What would change for half-open intervals?",
        "Why does same-coordinate ordering change the answer for closed ranges?",
        "What is the `O(n log n)` source of complexity?",
      ],
      presenterTalkingPointGroups: [
        {
          heading: "Tie rule sanity",
          points: [
            {
              bullet: "Closed interval rule",
              expansion: [
                "Start must be processed first at same coordinate.",
                "That ensures the shared endpoint counts for both intervals.",
              ],
            },
          ],
        },
      ],
    },
    {
      id: "closing-checklist",
      title: "Unify the pattern",
      titleTag: "72-90 min",
      durationMinutes: 18,
      objective:
        "Reinforce the invariant that change events delay final writes and restore/sweep performs the reconstruction.",
      studentContext: [
        "Across all three problems, active state comes from local changes.",
        "The final answer is always the result of a reconstruction pass.",
        "Boundary handling and tie rules are the core sources of correctness bugs.",
      ],
      teacherNotes: [
        "Ask students to summarize all three problems with one sentence.",
        "Link 2D and line sweep as 1D-same-idea variants in higher dimension or different event space.",
      ],
      studentMoves: [
        "Write `mark`, `sort`, `rebuild`, `check max` in order.",
        "Compare one bug from each problem.",
      ],
      checks: [
        "Can students name what diff stores across all 3 problems?",
        "Can they state the line-sweep tie rule in one line?",
      ],
      sanityChecks: [
        "If students forget `end + 1` in 1D updates, what breaks?",
        "If students process end before start in Problem 3, what does max change to?",
      ],
      invariant: "Reconstruction is the common recovery step from compact change representation.",
      successCriteria:
        "Students can solve all three sample items and explain the same running-state pattern behind each.",
    },
  ],
  problemWorkshops: [
    {
      problemSlug: "1d-difference-restore",
      coachScript:
        "Use the sample diff, then ask how each running total appears before writing final output.",
      studentGoal:
        "Restore the original 1D array from the provided difference array using a prefix sum.",
      precontextPrompts: [
        "What does the first diff entry represent?",
        "How is a diff entry different from a final value?",
        "Why is a cumulative pass needed?",
      ],
      studentWorkPrompts: [
        "Ask students to compute a running total sequence.",
        "Remind them to write each running value as the restored cell.",
        "Skip direct return of diff as final answer.",
      ],
      explanationPrompts: [
        "Walk through running total transitions slowly.",
        "Show the check: buildDifference(restored) == input diff.",
        "Point to 0-change entries and explain they preserve previous value.",
      ],
      prompts: [
        "Explain this as applying local changes",
        "Use sample [4, 3, 0, 3] and the resulting prefix totals",
      ],
      checkpoints: [
        "running starts at 0",
        "copying running total into restored",
        "final array equals expected restored output",
      ],
      commonBugs: [
        "Returning `diff`",
        "Forgetting the anchor and boundary behavior",
        "Applying subtraction during restore",
      ],
      stretchQuestion:
        "If diff had one more leading zero, what output change?",
      successCriteria:
        "Students complete 1D restore and can explain why each step preserves cumulative interpretation.",
      workPhaseTimings: {
        precontextMinutes: 4,
        workMinutes: 9,
        explanationMinutes: 7,
      },
    },
    {
      problemSlug: "2d-difference-restore",
      coachScript:
        "Focus on neighbor availability first, then apply the one matching boundary formula.",
      studentGoal:
        "Restore a 2D matrix from a 2D difference matrix using above/left/diagonal cases.",
      precontextPrompts: [
        "Why do we need four boundary cases?",
        "What happens at (0,0)?",
        "How is diagonal counted by above and left?",
      ],
      studentWorkPrompts: [
        "Map each target cell to above/left/diagonal existence.",
        "Calculate first row and first column separately before inner cells.",
        "Compare one inner formula cell with the sample matrix.",
      ],
      explanationPrompts: [
        "Show formulas on-screen before code.",
        "Trace one inner cell and one boundary cell.",
        "Reinforce the round-trip check with buildDifference.",
      ],
      prompts: [
        "Use above + left - diagonal in inner cells",
        "Handle first row/column as boundary variants",
      ],
      checkpoints: [
        "(0,0), first row, first column, inner formula used in correct places",
        "Diagonal contribution is subtracted once in inner cells",
        "Restored matrix matches sample output",
      ],
      commonBugs: [
        "Using inner-cell formula on first row/column",
        "Forgetting to subtract diagonal",
        "Swapping row/column in neighbor lookups",
      ],
      stretchQuestion:
        "How would complexity change if sparse storage was required for very large matrices?",
      successCriteria:
        "Students can rebuild full sample matrix from the diff sample and defend each boundary case.",
      workPhaseTimings: {
        precontextMinutes: 5,
        workMinutes: 10,
        explanationMinutes: 8,
      },
    },
    {
      problemSlug: "line-sweep-max-overlap-intro",
      coachScript:
        "Turn each interval into events and keep to one sorted pass with active counting.",
      studentGoal: "Compute max overlap from closed intervals with correct tie handling.",
      precontextPrompts: [
        "What is an event in this context?",
        "Why must start and end deltas be on separate records?",
        "Why are closed intervals special about same-coordinate ordering?",
      ],
      studentWorkPrompts: [
        "Build the event list and sort by (point, delta).",
        "Mark active and max at each step.",
        "Check off tie cases where three starts and one end share a coordinate.",
      ],
      explanationPrompts: [
        "Explain why `events.sort((x,y)=>x[0]-y[0] || y[1]-x[1])` works.",
        "Emphasize active update before max check.",
        "Verify with the provided interval sample gives 4.",
      ],
      prompts: [
        "Start events should be processed first at equal coordinates",
        "Track active count and max overlap",
      ],
      checkpoints: [
        "two events added per interval",
        "sorted coordinate then tie order",
        "maxOverlap becomes 4 on sample",
      ],
      commonBugs: [
        "End-before-start at same coordinate",
        "Missing max update after delta application",
        "Dropping one event from each interval",
      ],
      stretchQuestion:
        "How would this change if intervals were half-open [start, end)?",
      successCriteria:
        "Students can explain the event model and compute the sample max overlap.",
      workPhaseTimings: {
        precontextMinutes: 5,
        workMinutes: 10,
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
