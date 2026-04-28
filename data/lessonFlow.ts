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
  classTitle: "Difference Arrays: mark boundaries, then rebuild",
  totalMinutes: 120,
  precheck: [
    "Students know arrays or lists, loops, zero-based indexes, and simple prefix sums.",
    "Students can trace a running total from left to right.",
    "Students do not need any advanced data structures for this lesson.",
  ],
  closings: [
    "Mark where the change starts.",
    "Mark where the change stops.",
    "Prefix-sum once to rebuild.",
  ],
  classAgenda: [
    { kind: "lesson", lessonStepId: "opening-theory" },
    { kind: "problem", problemSlug: "build-the-change-list" },
    { kind: "lesson", lessonStepId: "boundary-mark-formula" },
    { kind: "problem", problemSlug: "one-range-update-with-boundary-marks" },
    { kind: "lesson", lessonStepId: "many-updates-one-rebuild" },
    { kind: "problem", problemSlug: "multiple-range-updates-one-rebuild" },
    { kind: "lesson", lessonStepId: "closing-checklist" },
  ],
  lessonSteps: [
    {
      id: "opening-theory",
      title: "Store changes, not final values",
      titleTag: "0-10 min",
      durationMinutes: 10,
      objective:
        "Define range update, difference array, delta, boundary mark, and prefix sum before students solve.",
      studentContext: [
        "A range update means: add or subtract this amount across one continuous block of indexes. Example: on [0, 0, 0, 0, 0], adding +3 from index 1 through 3 gives [0, 3, 3, 3, 0].",
        "The direct approach visits every index in the range. That is fine once, but many wide updates can become O(n * m). Example: 100 updates across 1,000 indexes can mean up to 100,000 index visits if each update loops through its whole range.",
        "Difference arrays delay the expensive part: record changes first, then rebuild final values later. Example: for add +3 from index 1 through 3, record a start mark at index 1 and a stop mark at index 4, then rebuild later.",
        "A difference array stores changes between neighboring positions instead of storing final values directly. Example: nums = [4, 7, 7, 10] becomes diff = [4, 3, 0, 3] because the values start at 4, rise by 3, stay the same, then rise by 3.",
        "For a concrete array: diff[0] = first value, and diff[i] = current value - previous value. Example: for nums = [4, 7, 7, 10], diff[1] = 7 - 4 = 3 and diff[2] = 7 - 7 = 0.",
        "A delta is the amount of change being added or subtracted. Example: in the update [1, 3, +3], the delta is +3; in [2, 4, -2], the delta is -2.",
        "A prefix sum is the rebuild step: scan left to right, keep a running total, and write that running total as the final value at each index. It turns stored changes back into usable values. Example: for diff = [4, 3, 0, 3], start running = 0. At index 0, add 4 -> running 4, write 4. At index 1, add 3 -> running 7, write 7. At index 2, add 0 -> running stays 7, write 7. At index 3, add 3 -> running 10, write 10.",
        "Today the recurring question is: where does a change start, where does it stop, and what does the running total mean now?",
      ],
      teacherNotes: [
        "Start with nums = [4, 7, 7, 10] and ask what changed at each step.",
        "Keep the word changes visible; students should not call diff the final array.",
        "Use a vocabulary ladder: final values -> changes -> running total -> rebuilt values.",
        "After each definition, ask for a student paraphrase before adding the next term.",
        "Do not introduce advanced data structures; the lesson target is the basic boundary-mark pattern.",
      ],
      studentMoves: [
        "Say whether diff stores final values or changes.",
        "Compute one neighbor difference out loud.",
        "Explain why one running total can rebuild the values.",
      ],
      checks: [
        "What does diff store: final values or changes? Expected answer: changes.",
        "Why can repeated direct range updates become slow?",
        "What does the running total represent during rebuild?",
      ],
      invariant:
        "A prefix sum of the difference array rebuilds the values it represents.",
      successCriteria:
        "Students can explain why [4, 3, 0, 3] rebuilds [4, 7, 7, 10].",
      failurePatterns: [
        "Students describe diff as a compressed copy of nums instead of a list of changes.",
        "Students skip diff[0] and then have no starting point for rebuild.",
      ],
      sanityChecks: [
        "Every new term has been used with the same small numeric example.",
        "Students can say the direction of reconstruction: diff -> prefix sum -> final values.",
      ],
      presenterTalkingPointGroups: [
        {
          heading: "Definitions before code",
          points: [
            {
              bullet: "Name each term before students need it.",
              expansion: [
                "Range update: one continuous index block receives the same delta.",
                "Difference array: stores changes between neighboring positions.",
                "Prefix sum: running total that rebuilds values from changes.",
              ],
            },
            {
              bullet: "Connect speed to delayed work.",
              expansion: [
                "Direct updates spend work immediately across the whole range.",
                "Difference arrays spend constant work per update boundary.",
                "The final prefix rebuild is one left-to-right pass.",
              ],
            },
            {
              bullet: "Keep the first problem concrete.",
              expansion: [
                "Use numbers before symbols.",
                "Ask what changed from the previous index at every row.",
                "If students say 'it is just another array,' ask what each position means.",
              ],
            },
          ],
        },
        {
          heading: "Recovery prompts",
          points: [
            {
              bullet: "If students mix up final values and changes, rebuild one row.",
              expansion: [
                "Point to diff[1] = 3 and ask: is index 1 equal to 3 or did it change by 3?",
                "Run 4 + 3 = 7 on the board.",
                "Then ask what diff[2] = 0 means in words.",
              ],
            },
          ],
        },
      ],
    },
    {
      id: "boundary-mark-formula",
      title: "Turn a range on, then off",
      titleTag: "34-44 min",
      durationMinutes: 10,
      objective:
        "Introduce the two boundary marks that make one range update cheap.",
      studentContext: [
        "An update is a three-number instruction: `[start, end, delta]`. `start` is the first index to change, `end` is the last index to change, and `delta` is the amount to add. Example: with `n = 5`, `update = [1, 3, 3]` means `start = 1`, `end = 3`, and `delta = +3`.",
        "The goal for `update = [1, 3, 3]`: indexes 1, 2, and 3 receive +3. Starting from `[0, 0, 0, 0, 0]`, the final result should be `[0, 3, 3, 3, 0]`.",
        "Direct update version: add +3 at index 1, add +3 at index 2, and add +3 at index 3. This example touches 3 cells. If the range had 100 cells, direct update would touch 100 cells.",
        "Boundary mark version: record only where the +3 starts and where it stops. For `update = [1, 3, 3]`, `start = 1` and `end = 3`, so index 3 is the last index that should still get +3. Add `+3` to `diff[1]` to turn the update on. Add `-3` to `diff[4]` because `end + 1 = 4`, the first index after the range. That is always 2 changes: one start mark and one stop mark.",
        "Why this is more efficient: direct update work grows with the range length, but boundary mark work stays at 2 changes for one update. A range of 3 cells needs 2 marks. A range of 100 cells still needs 2 marks. The later prefix scan spreads those marks into the final values.",
        "After marking: `diff[1] += 3` and `diff[4] -= 3`, so `diff = [0, 3, 0, 0, -3]`. This is not the final answer. It is a set of instructions for a left-to-right scan.",
        "Scan the diff array:\n\nindex | position        | mark | active +3? | final value\n0     | before start    | 0    | no         | 0\n1     | start           | +3   | yes        | 3\n2     | inside range    | 0    | yes        | 3\n3     | end             | 0    | yes        | 3\n4     | end + 1         | -3   | no         | 0",
        "Key idea: a boundary mark does not say `this index equals this value`. It says `starting here, change what is active while we scan`.",
      ],
      teacherNotes: [
        "Say `start = 1`, `end = 3`, and `delta = +3` before every trace.",
        "Ask where +3 turns on before showing `diff[1] += 3`.",
        "Ask where +3 should stop being active before showing `diff[4] -= 3`.",
        "Keep students on the switch model before naming the formula.",
      ],
      studentMoves: [
        "Identify start, end, and delta from update = [1, 3, 3].",
        "Place the +3 start mark and the -3 stop mark.",
        "Predict which indexes will have running total 3 before rebuilding.",
      ],
      checks: [
        "Why is index 3 still active?",
        "Why does the stop mark go at 4 instead of 3?",
        "Is `diff = [0, 3, 0, 0, -3]` the final answer?",
      ],
      invariant:
        "The running total includes a delta exactly between its start mark and its stop mark.",
      successCriteria:
        "Students can rebuild [0, 3, 3, 3, 0] from [0, 3, 0, 0, -3].",
      failurePatterns: [
        "Subtracting at end instead of end + 1.",
        "Returning raw diff before prefix-sum rebuild.",
      ],
      sanityChecks: [
        "Stop mark is skipped only when end + 1 is outside the array.",
      ],
      presenterTalkingPointGroups: [
        {
          heading: "Boundary mark mental model",
          points: [
            {
              bullet: "Teach start and stop as a switch.",
              expansion: [
                "At start, the delta turns on.",
                "At end + 1, the delta turns off.",
                "Every index between those points sees the active running total.",
              ],
            },
            {
              bullet: "Make off-by-one visible.",
              expansion: [
                "Circle index 3 as still inside the update.",
                "Put the stop mark at 4 and ask why 3 is not the stop.",
                "If a student says end, test the rebuilt array immediately.",
              ],
            },
          ],
        },
      ],
    },
    {
      id: "many-updates-one-rebuild",
      title: "Pile up marks, rebuild once",
      titleTag: "71-81 min",
      durationMinutes: 10,
      objective:
        "Show that multiple updates share one diff array and one final prefix rebuild.",
      studentContext: [
        "The boundary rule stays the same for every update.",
        "Do not rebuild after every update. Keep all marks in the same diff array.",
        "Overlaps combine because the running total carries every active delta.",
        "Negative delta uses the same formula; do not flip the rule by hand.",
        "The diff array is like a ledger of starts and stops. The prefix pass is when the ledger becomes final values.",
        "If two updates start or stop at the same index, their boundary marks simply add together.",
      ],
      teacherNotes: [
        "Ask whether old boundary marks disappear when the next update arrives. Expected answer: no.",
        "Use the running total column to show overlap instead of explaining it abstractly.",
        "Make students say 'same diff array' before each new update.",
        "When delta is negative, slow down and apply the exact same formula in front of the class.",
      ],
      studentMoves: [
        "Apply each update as two possible marks.",
        "Skip the stop mark when end + 1 equals n.",
        "Run one prefix-sum rebuild after all marks are present.",
        "Explain one overlapping index using active deltas.",
      ],
      checks: [
        "Do we rebuild after each update or once at the end? Expected answer: once at the end.",
        "Do earlier boundary marks disappear when a later update is processed?",
        "Why does negative delta not need a special rule?",
      ],
      invariant:
        "Before rebuild, diff stores all start and stop marks. During rebuild, running is the sum of active marks.",
      successCriteria:
        "Students can explain why the sample rebuilds to [2, 5, 4, 2, -1].",
      failurePatterns: [
        "Clearing diff between updates.",
        "Treating negative delta as a special case.",
      ],
      sanityChecks: [
        "Every update changed diff in O(1) except for the final rebuild.",
        "Students can identify the one skipped stop mark in the sample.",
      ],
      presenterTalkingPointGroups: [
        {
          heading: "Multiple update pacing",
          points: [
            {
              bullet: "Repeat the same two-line rule for every row.",
              expansion: [
                "Do not let students invent a new rule for the second or third update.",
                "Read start, end, delta, then place start and stop marks.",
                "Only after all marks exist should the prefix rebuild begin.",
              ],
            },
            {
              bullet: "Use overlap as the payoff.",
              expansion: [
                "At index 2, ask which updates are active.",
                "Compare that answer with the running total 4.",
                "This is where the structure becomes more than an optimization trick.",
              ],
            },
          ],
        },
      ],
    },
    {
      id: "closing-checklist",
      title: "Three-line memory phrase",
      titleTag: "112-120 min",
      durationMinutes: 8,
      objective:
        "Lock in the reusable difference-array pattern.",
      studentContext: [
        "Mark where the change starts.",
        "Mark where the change stops.",
        "Prefix-sum once to rebuild.",
        "Range update -> two boundary marks. All updates -> one prefix rebuild.",
        "A difference array stores changes, not final values.",
      ],
      teacherNotes: [
        "Have students repeat the memory phrase before they leave.",
        "Ask for one common mistake and one guardrail from each group.",
        "End by having students classify a new prompt verbally, without solving it.",
        "If time remains, ask students to describe a bug using the words start mark, stop mark, and rebuild.",
      ],
      studentMoves: [
        "Recite the three-line pattern.",
        "Explain the turn-on / turn-off mental model.",
        "Name the most likely off-by-one bug.",
      ],
      checks: [
        "Can students state the formula and when to skip the stop mark?",
        "Can students explain why rebuild happens once after all marks?",
      ],
      successCriteria:
        "Students can solve a basic range-update final-array problem with boundary marks and one rebuild.",
      failurePatterns: [
        "Students remember the formula but cannot explain why end + 1 is used.",
        "Students rebuild too early and lose the many-update advantage.",
      ],
    },
  ],
  problemWorkshops: [
    {
      problemSlug: "build-the-change-list",
      deliveryScope: "class",
      coachScript:
        "Use nums=[4,7,7,10] and ask students what changed from the previous index before showing code.",
      studentGoal:
        "Build a difference array from final values and explain what each change means.",
      workPhaseTimings: {
        precontextMinutes: 5,
        workMinutes: 8,
        explanationMinutes: 11,
      },
      precontextPrompts: [
        "What concept are we learning right now? A difference array stores changes between neighboring positions.",
        "Why does this matter? Later, range updates will become boundary changes instead of full scans.",
        "Which value must diff[0] keep so prefix rebuild has a starting point?",
        "Before any code, describe diff[1] in words: is it a value or a change?",
        "Ask students to predict whether equal neighboring values create a positive change, negative change, or zero.",
      ],
      studentWorkPrompts: [
        "Hint 1: do not copy nums into diff; compare current value with previous value.",
        "Hint 2: after index 0, every row answers: how much did the value change?",
        "Trace each index and say whether it starts, rises, stays, or rises again.",
        "After writing diff, rebuild it with a running total to check your answer.",
        "If your diff has four values, explain each value in one short sentence.",
      ],
      explanationPrompts: [
        "Show diff[0] = 4, then neighbor changes 3, 0, 3.",
        "Rebuild with a running total to prove diff stores enough information.",
        "Call out the common mistake of returning final values instead of changes.",
        "Ask why diff[2] is 0 even though nums[2] is 7.",
        "Connect this problem to the next one: if changes can rebuild values, boundary changes can rebuild range updates.",
      ],
      prompts: [
        "Build the change list from nums=[4,7,7,10].",
        "Explain what diff[2] = 0 means.",
      ],
      checkpoints: [
        "diff[0] keeps nums[0].",
        "Each later diff value is nums[index] - nums[index - 1].",
        "Prefix rebuild returns the original numbers.",
        "A zero in diff means no change from the previous value.",
      ],
      commonBugs: [
        "Copying nums instead of computing neighbor changes.",
        "Starting the loop at index 0 and reading before the array begins.",
        "Calling diff the final values.",
        "Forgetting to use the previous original value when computing each change.",
      ],
      stretchQuestion:
        "Given diff=[4,3,0,3], can you rebuild nums without looking at the original array?",
      successCriteria:
        "Students can describe each entry of [4, 3, 0, 3] in plain language.",
      presenterTalkingPointGroups: [
        {
          heading: "Problem 1 teaching rhythm",
          points: [
            {
              bullet: "Make every diff entry verbal.",
              expansion: [
                "diff[0] says where the running total starts.",
                "diff[1] says the value rises by 3.",
                "diff[2] says the value stays the same.",
                "diff[3] says the value rises by 3 again.",
              ],
            },
            {
              bullet: "Use rebuild as the proof.",
              expansion: [
                "Do not just assert that diff is correct.",
                "Run the prefix sum and recover [4, 7, 7, 10].",
                "That proof is the bridge to boundary marks.",
              ],
            },
          ],
        },
      ],
    },
    {
      problemSlug: "one-range-update-with-boundary-marks",
      deliveryScope: "class",
      coachScript:
        "Use update=[1,3,3] and make students say where +3 turns on and where it turns off.",
      studentGoal:
        "Apply one boundary-mark range update and rebuild the final array with prefix sums.",
      workPhaseTimings: {
        precontextMinutes: 6,
        workMinutes: 9,
        explanationMinutes: 12,
      },
      precontextPrompts: [
        "What concept are we learning right now? One range update can be recorded with two boundary marks.",
        "Why does this matter? We avoid touching every index inside the range immediately.",
        "Name start, end, and delta from update=[1,3,3].",
        "Ask where the update is active before any prefix rebuild happens.",
        "Ask why index 3 should still receive +3 even though the stop mark is at index 4.",
      ],
      studentWorkPrompts: [
        "Hint 1: mark the start with diff[1] += 3.",
        "Hint 2: because the range is inclusive, stop just after the end with diff[4] -= 3.",
        "Before returning, prefix-sum the diff array into final values.",
        "Trace the running total at every index and say whether the +3 is active.",
        "If your answer is [0,3,3,0,0], check whether you stopped the range too early.",
      ],
      explanationPrompts: [
        "Show the two marks [0,3,0,0,-3].",
        "Trace running totals 0, 3, 3, 3, 0 and connect them to active delta.",
        "Review why returning raw diff would be wrong.",
        "Compare the direct update version against the boundary mark version and count touched indexes.",
        "Ask students to explain the bounds check: when end + 1 equals n, there is no in-array place to turn the delta off.",
      ],
      prompts: [
        "Where does +3 turn on?",
        "Where does +3 turn off?",
        "What does the running total mean at index 2?",
      ],
      checkpoints: [
        "Start mark is diff[start] += delta.",
        "Stop mark is diff[end + 1] -= delta only when end + 1 is in bounds.",
        "Final answer comes from prefix-sum rebuild.",
        "The inclusive end still receives the delta.",
        "Raw diff and rebuilt result are different arrays with different meanings.",
      ],
      commonBugs: [
        "Subtracting at end instead of end + 1.",
        "Forgetting the bounds check.",
        "Returning diff instead of rebuilt result.",
        "Doing a direct loop over indexes 1 through 3 and missing the boundary-mark idea.",
        "Updating result before the prefix running total has consumed diff[index].",
      ],
      stretchQuestion:
        "What changes if the update is [0, 4, 3] and end + 1 is outside the array?",
      successCriteria:
        "Students can explain why index 4 returns to 0 after the stop mark.",
      presenterTalkingPointGroups: [
        {
          heading: "Problem 2 teaching rhythm",
          points: [
            {
              bullet: "Separate marking from rebuilding.",
              expansion: [
                "First phase: diff is only marks.",
                "Second phase: running total turns those marks into values.",
                "If students return diff, they skipped the second phase.",
              ],
            },
            {
              bullet: "Use the wrong stop mark as a live bug.",
              expansion: [
                "Pretend to subtract at index 3.",
                "Rebuild and show index 3 becomes 0 too early.",
                "Then move the stop to index 4 and rebuild correctly.",
              ],
            },
          ],
        },
      ],
    },
    {
      problemSlug: "multiple-range-updates-one-rebuild",
      deliveryScope: "class",
      coachScript:
        "Use the three updates and ask whether earlier marks stay in diff when the next update arrives.",
      studentGoal:
        "Combine several boundary marks in one diff array and reconstruct once.",
      workPhaseTimings: {
        precontextMinutes: 6,
        workMinutes: 11,
        explanationMinutes: 14,
      },
      precontextPrompts: [
        "What concept are we learning right now? Many updates can share one diff array.",
        "Why does this matter? Work becomes one O(1) mark pair per update plus one rebuild.",
        "What should we watch while tracing? Overlaps add through the running total.",
        "Ask students to predict which update will skip a stop mark before calculating it.",
        "Ask whether negative delta changes the formula or only the arithmetic.",
      ],
      studentWorkPrompts: [
        "Hint 1: handle each update with the same two boundary rules.",
        "Hint 2: do not clear diff between updates.",
        "Hint 3: negative delta uses the same formula; do not reverse the rule manually.",
        "Skip only the stop mark for [2,4,-1] because end + 1 is 5.",
        "After each update, read the whole diff array out loud before moving on.",
        "During rebuild, explain index 2 by naming all active updates.",
      ],
      explanationPrompts: [
        "Show diff after each update: [0,3,0,0,-3], then [2,3,0,-2,-3], then [2,3,-1,-2,-3].",
        "Run one prefix rebuild and read running totals 2, 5, 4, 2, -1.",
        "Review why rebuilding after every update wastes the main advantage.",
        "Explain the negative update: adding -1 starts a subtraction, and the stop mark would subtract -1 if in bounds.",
        "Compare O(n * m) direct updates with O(n + m) boundary marking plus rebuild.",
        "Ask students to identify the exact point where overlapping updates combine.",
      ],
      prompts: [
        "Apply each update as boundary marks.",
        "Explain what happens when updates overlap.",
        "Run one final prefix sum.",
      ],
      checkpoints: [
        "All updates add into the same diff array.",
        "The last update skips the stop mark because end + 1 is outside the array.",
        "Only one rebuild happens after all updates are marked.",
        "Overlapping updates combine through the running total, not through special overlap code.",
        "Negative delta follows the same start/stop rule.",
      ],
      commonBugs: [
        "Rebuilding after every update.",
        "Clearing diff between updates.",
        "Special-casing negative delta incorrectly.",
        "Subtracting at end instead of end + 1.",
        "Forgetting that two boundary marks can land on the same index and should add together.",
        "Skipping the final prefix rebuild because diff already looks meaningful.",
      ],
      stretchQuestion:
        "If a fourth update overlaps all previous updates, what part of the algorithm changes?",
      successCriteria:
        "Students can defend the final output [2, 5, 4, 2, -1] from the trace.",
      presenterTalkingPointGroups: [
        {
          heading: "Problem 3 teaching rhythm",
          points: [
            {
              bullet: "Keep the invariant visible.",
              expansion: [
                "Before rebuild, diff stores marks only.",
                "During rebuild, running stores active accumulated change.",
                "After rebuild, result stores final values.",
              ],
            },
            {
              bullet: "Use index 2 as the overlap checkpoint.",
              expansion: [
                "Ask which updates affect index 2.",
                "Add +3, +2, and -1 to get 4.",
                "Then match that to the prefix running total.",
              ],
            },
            {
              bullet: "Close with complexity.",
              expansion: [
                "Each update marks at most two positions.",
                "The rebuild scans n positions once.",
                "That is why the total is O(n + m).",
              ],
            },
          ],
        },
      ],
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
