export type Difficulty =
  | "Easy"
  | "Easy-to-Medium"
  | "Medium"
  | "Medium-to-Medium-Hard";

export interface DifferenceArraysProblem {
  id: number;
  title: string;
  difficulty: Difficulty;
  conceptFocus: string;
  slug: string;
  codepadLinks?: {
    starterUrl: string;
    solutionUrl: string;
  };
  description: string;
  conceptBeforeProblem: string[];
  realWorldContext: string[];
  beginnerHint: string[];
  applyConcept: string[];
  inputSpec: string;
  outputSpec: string;
  sampleInput: string;
  sampleOutput: string;
  pythonSolution: string;
  javaSolution: string;
  explanation: string[];
  traceAscii: string[];
  timeComplexity: string;
  spaceComplexity: string;
  commonMistakes?: string[];
}

export const problems: DifferenceArraysProblem[] = [
  {
    id: 1,
    title: "Build the Change List",
    difficulty: "Easy",
    conceptFocus: "Understand what a difference array stores",
    slug: "build-the-change-list",
    codepadLinks: {
      starterUrl: "https://app.coderpad.io/442X6337",
      solutionUrl: "https://app.coderpad.io/G3EJX4JF",
    },
    description:
      "Given an integer array `nums`, return its difference array `diff`. Assume `nums` is non-empty.",
    conceptBeforeProblem: [
      "Before using difference arrays for fast range updates, first understand what the array stores.",
      "A difference array does not store final values directly. It stores how much each value changed compared with the previous position.",
      "For this beginner version:\ndiff[0] = nums[0]\ndiff[i] = nums[i] - nums[i - 1]",
      "The first value is kept because the prefix rebuild needs a starting point.",
      "This is the same idea as describing a trip by turns and distance changes instead of naming every location again.",
      "If two neighboring values are equal, the change is 0. That zero is meaningful: it tells the running total to keep going unchanged.",
    ],
    realWorldContext: [
      "Imagine a short temperature log: [4, 7, 7, 10].",
      "Instead of saying every temperature again, you can say: start at 4, go up 3, stay the same, go up 3.",
      "That change list is the difference array.",
    ],
    beginnerHint: [
      "Do not copy the values into `diff`.",
      "At every index after 0, ask: how much did the value change from the previous index?",
      "Use the original `nums` values for subtraction. Do not subtract from values you already wrote into `diff`.",
      "After building `diff`, prefix-sum it back as a self-check.",
    ],
    applyConcept: [
      "For nums = [4, 7, 7, 10], keep the first value: diff[0] = 4.",
      "Then compare neighbors: diff[1] = 7 - 4 = 3, diff[2] = 7 - 7 = 0, diff[3] = 10 - 7 = 3.",
      "So diff = [4, 3, 0, 3]. A running total rebuilds the original values: 4, 7, 7, 10.",
      "Watch the trace for the moment where the value stays 7. That is exactly why diff[2] is 0.",
      "This concrete change list is the foundation for the boundary marks in the next two problems.",
    ],
    inputSpec: "nums: int[]",
    outputSpec: "int[] diff",
    sampleInput: "nums = [4, 7, 7, 10]",
    sampleOutput: "[4, 3, 0, 3]",
    javaSolution: `public static int[] buildDifferenceArray(int[] nums) {
    int[] diff = new int[nums.length];

    // The first value gives the prefix rebuild a starting point.
    diff[0] = nums[0];

    for (int index = 1; index < nums.length; index++) {
        diff[index] = nums[index] - nums[index - 1];
    }

    return diff;
}`,
    pythonSolution: `def build_difference_array(nums: list[int]) -> list[int]:
    diff = [0] * len(nums)

    # The first value gives the prefix rebuild a starting point.
    diff[0] = nums[0]

    for index in range(1, len(nums)):
        diff[index] = nums[index] - nums[index - 1]

    return diff`,
    explanation: [
      "Create `diff` with the same length as `nums`.",
      "Store the first value: `diff[0] = nums[0]`.",
      "For each later index, subtract the previous value from the current value.",
      "Return `diff`.",
      "Remember: `diff` stores changes, not final values.",
      "A quick correctness check is to prefix-sum `diff` and confirm it rebuilds `nums`.",
      "The important habit is reading each diff entry as a sentence: start here, rise by 3, stay flat, rise by 3.",
    ],
    traceAscii: [
      "$ nums = [4, 7, 7, 10]",
      "> diff[0] = nums[0]",
      "  diff = [4, 0, 0, 0]",
      "> diff[1] = nums[1] - nums[0] = 7 - 4 = 3",
      "  diff = [4, 3, 0, 0]",
      "> diff[2] = nums[2] - nums[1] = 7 - 7 = 0",
      "  diff = [4, 3, 0, 0]",
      "> diff[3] = nums[3] - nums[2] = 10 - 7 = 3",
      "  diff = [4, 3, 0, 3]",
      ">= difference array [4, 3, 0, 3]",
    ],
    timeComplexity: "O(n)",
    spaceComplexity: "O(n)",
    commonMistakes: [
      "Storing `nums[i]` instead of `nums[i] - nums[i - 1]`.",
      "Forgetting that `diff[0]` is the starting value.",
      "Starting the loop at index 0 and reading before the array begins.",
      "Thinking `diff` is the final answer values instead of the change values.",
    ],
  },
  {
    id: 2,
    title: "One Range Update With Boundary Marks",
    difficulty: "Easy",
    conceptFocus: "Apply one range update and rebuild with prefix sums",
    slug: "one-range-update-with-boundary-marks",
    description:
      "Given n = 5 and update = [1, 3, 3], return the final zero-filled array after adding 3 from index 1 through index 3, inclusive.",
    conceptBeforeProblem: [
      "Now that `diff` stores changes, use it to record a range update cheaply.",
      "A range update adds or subtracts a delta across one continuous block of indexes.",
      "The direct way changes every index inside the range. The difference-array way records only two boundary marks.",
      "diff[start] += delta\nif end + 1 < n:\n    diff[end + 1] -= delta",
      "+delta turns the change on.\n-delta turns the change off.\nThe running total shows which changes are active at each index.",
      "The range end is inclusive, so the update must still be active at `end`. That is why the stop mark belongs at `end + 1`.",
      "The bounds check matters because a range that reaches the final index has no later position inside the array where the change can turn off.",
    ],
    realWorldContext: [
      "Imagine five players start with 0 points: [0, 0, 0, 0, 0].",
      "A bonus gives +3 points to players at indexes 1 through 3.",
      "Instead of editing indexes 1, 2, and 3 one at a time, mark where the bonus starts and where it stops.",
    ],
    beginnerHint: [
      "Read the update as start = 1, end = 3, delta = 3.",
      "Mark the start first with `diff[1] += 3`.",
      "Then mark just after the end with `diff[4] -= 3`.",
      "Finally rebuild with a running total.",
      "Do not return the boundary marks. They are instructions for rebuilding, not the final values.",
      "At each index, ask whether +3 is currently active before writing the result value.",
    ],
    applyConcept: [
      "Start with diff = [0, 0, 0, 0, 0].",
      "Apply boundary marks: diff[1] += 3 gives [0, 3, 0, 0, 0], then diff[4] -= 3 gives [0, 3, 0, 0, -3].",
      "Prefix rebuild produces running values 0, 3, 3, 3, 0.",
      "Final array: [0, 3, 3, 3, 0].",
      "Indexes 1, 2, and 3 share the same active +3 because no stop mark has been reached yet.",
      "Index 4 returns to 0 because the -3 cancels the active +3.",
    ],
    inputSpec: "n: int; update: int[] in the form [start, end, delta]",
    outputSpec: "int[] final values after the update",
    sampleInput: "n = 5\nupdate = [1, 3, 3]",
    sampleOutput: "[0, 3, 3, 3, 0]",
    javaSolution: `public static int[] applyOneRangeUpdate(int n, int[] update) {
    int[] diff = new int[n];

    int start = update[0];
    int end = update[1];
    int delta = update[2];

    // Start adding delta at the left boundary.
    diff[start] += delta;

    // Stop adding delta just after the right boundary.
    if (end + 1 < n) {
        diff[end + 1] -= delta;
    }

    int[] result = new int[n];
    int running = 0;

    for (int index = 0; index < n; index++) {
        running += diff[index];
        result[index] = running;
    }

    return result;
}`,
    pythonSolution: `def apply_one_range_update(n: int, update: list[int]) -> list[int]:
    diff = [0] * n

    start = update[0]
    end = update[1]
    delta = update[2]

    # Start adding delta at the left boundary.
    diff[start] += delta

    # Stop adding delta just after the right boundary.
    if end + 1 < n:
        diff[end + 1] -= delta

    result = [0] * n
    running = 0

    for index in range(n):
        running += diff[index]
        result[index] = running

    return result`,
    explanation: [
      "Create a zero-filled `diff` array of length `n`.",
      "Read `start`, `end`, and `delta` from the update.",
      "Mark where the update starts: `diff[start] += delta`.",
      "If `end + 1` is inside the array, mark where the update stops: `diff[end + 1] -= delta`.",
      "Rebuild the final array with a prefix-sum pass.",
      "Return the rebuilt array, not the raw `diff` array.",
      "The boundary update is O(1); the rebuild is the single O(n) pass that turns marks into values.",
      "A useful trace question is: what is active right now, and what mark changed that?",
    ],
    traceAscii: [
      "$ n = 5, update = [1, 3, 3]",
      "> start with zero difference array",
      "  diff = [0, 0, 0, 0, 0]",
      "> mark start: diff[1] += 3",
      "  diff = [0, 3, 0, 0, 0]",
      "> mark stop: diff[4] -= 3",
      "  diff = [0, 3, 0, 0, -3]",
      "> prefix rebuild with running total",
      "  running values = 0, 3, 3, 3, 0",
      ">= final array [0, 3, 3, 3, 0]",
    ],
    timeComplexity: "O(n)",
    spaceComplexity: "O(n)",
    commonMistakes: [
      "Subtracting at `end` instead of `end + 1`.",
      "Forgetting the bounds check before using `diff[end + 1]`.",
      "Returning the raw `diff` array instead of rebuilding the final array.",
      "Directly updating every value in the range instead of using boundary marks.",
      "Thinking `diff[4] = -3` means the final answer at index 4 should be -3.",
      "Updating `result[index]` before adding `diff[index]` to the running total.",
    ],
  },
  {
    id: 3,
    title: "Multiple Range Updates, One Rebuild",
    difficulty: "Easy",
    conceptFocus: "Combine several boundary marks and reconstruct once",
    slug: "multiple-range-updates-one-rebuild",
    description:
      "Given n = 5 and several updates, return the final zero-filled array after applying all range updates.",
    conceptBeforeProblem: [
      "The real power of difference arrays appears when there are multiple range updates.",
      "The rule does not change: keep adding boundary marks into the same `diff` array.",
      "diff[start] += delta\nif end + 1 < n:\n    diff[end + 1] -= delta",
      "Do not rebuild after every update. Mark all update boundaries, then run one prefix-sum pass at the end.",
      "The running total automatically combines overlapping updates.",
      "If several updates touch the same boundary index, their marks accumulate in the same `diff` cell.",
      "A negative delta is still just a delta. The formula does not change; only the arithmetic signs change.",
    ],
    realWorldContext: [
      "Imagine a five-day scoreboard starts at zero: [0, 0, 0, 0, 0].",
      "Several events add or subtract points across day ranges: +3 from day 1 through day 3, +2 from day 0 through day 2, and -1 from day 2 through day 4.",
      "Some days are affected by more than one event. Difference arrays let those overlaps combine naturally during the prefix rebuild.",
    ],
    beginnerHint: [
      "Handle each update using the same two boundary rules.",
      "Do not special-case negative `delta`; the same rule still works.",
      "For delta = -1, `diff[start] += -1` starts the negative change and `diff[end + 1] -= -1` would stop it if that index exists.",
      "In this sample, the last update ends at index 4, so end + 1 is outside the array and the stop mark is skipped.",
      "Do not erase old marks before applying the next update.",
      "Wait until all updates are marked before doing the prefix rebuild.",
    ],
    applyConcept: [
      "Start with diff = [0, 0, 0, 0, 0].",
      "After [1, 3, 3]: [0, 3, 0, 0, -3].",
      "After [0, 2, 2]: [2, 3, 0, -2, -3].",
      "After [2, 4, -1]: [2, 3, -1, -2, -3].",
      "Prefix rebuild gives [2, 5, 4, 2, -1].",
      "Index 2 is a good overlap check: +3 and +2 are active, then -1 also starts there, so the final value is 4.",
      "The final -1 at index 4 happens because the +3 update stops there, the +2 update has already stopped, and the -1 update is still active.",
    ],
    inputSpec: "n: int; updates: int[][] where each update is [start, end, delta]",
    outputSpec: "int[] final values after all updates",
    sampleInput: `n = 5
updates = [
    [1, 3, 3],
    [0, 2, 2],
    [2, 4, -1],
]`,
    sampleOutput: "[2, 5, 4, 2, -1]",
    javaSolution: `public static int[] applyRangeUpdates(int n, int[][] updates) {
    int[] diff = new int[n];

    for (int[] update : updates) {
        int start = update[0];
        int end = update[1];
        int delta = update[2];

        // Start this update's effect.
        diff[start] += delta;

        // Stop this update's effect after the inclusive range.
        if (end + 1 < n) {
            diff[end + 1] -= delta;
        }
    }

    int[] result = new int[n];
    int running = 0;

    for (int index = 0; index < n; index++) {
        running += diff[index];
        result[index] = running;
    }

    return result;
}`,
    pythonSolution: `def apply_range_updates(n: int, updates: list[list[int]]) -> list[int]:
    diff = [0] * n

    for update in updates:
        start = update[0]
        end = update[1]
        delta = update[2]

        # Start this update's effect.
        diff[start] += delta

        # Stop this update's effect after the inclusive range.
        if end + 1 < n:
            diff[end + 1] -= delta

    result = [0] * n
    running = 0

    for index in range(n):
        running += diff[index]
        result[index] = running

    return result`,
    explanation: [
      "Create a zero-filled `diff` array of length `n`.",
      "For each update, read `start`, `end`, and `delta`.",
      "Add `delta` at `start`.",
      "Subtract `delta` at `end + 1` only if that index is inside the array.",
      "After all updates are marked, run one prefix-sum pass.",
      "Store each running total in the final result array.",
      "Return the result.",
      "The total work is O(m) for marking updates plus O(n) for rebuilding the final array.",
      "Overlaps need no separate branch because the running total is already the sum of all active deltas.",
    ],
    traceAscii: [
      "$ n = 5, updates = [[1,3,3], [0,2,2], [2,4,-1]]",
      "> start diff",
      "  [0, 0, 0, 0, 0]",
      "> update [1,3,3]: diff[1] += 3, diff[4] -= 3",
      "  [0, 3, 0, 0, -3]",
      "> update [0,2,2]: diff[0] += 2, diff[3] -= 2",
      "  [2, 3, 0, -2, -3]",
      "> update [2,4,-1]: diff[2] += -1, end+1 = 5 so skip stop mark",
      "  [2, 3, -1, -2, -3]",
      "> prefix rebuild",
      "  running values = 2, 5, 4, 2, -1",
      ">= final array [2, 5, 4, 2, -1]",
    ],
    timeComplexity: "O(n + m)",
    spaceComplexity: "O(n)",
    commonMistakes: [
      "Rebuilding the final array after every update instead of once at the end.",
      "Clearing `diff` between updates.",
      "Forgetting that overlapping ranges should add together.",
      "Changing the rule for negative `delta`; the same boundary formula still applies.",
      "Subtracting at `end` instead of `end + 1`.",
      "Skipping a start mark when the delta is negative.",
      "Forgetting that `diff[end + 1] -= -1` would add 1 if the stop mark were in bounds.",
    ],
  },
];
