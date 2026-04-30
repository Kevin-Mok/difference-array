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
    title: "1D Difference + Restore",
    difficulty: "Easy",
    conceptFocus: "Understand that a difference array stores changes, then rebuild originals with a prefix sum",
    slug: "1d-difference-restore",
    description:
      "Given a non-empty 1D difference array `diff`, return the restored original array.",
    conceptBeforeProblem: [
      "A difference array stores changes between positions, not final values.",
      "For an original array `nums`: `diff[0] = nums[0]`, `diff[i] = nums[i] - nums[i - 1]`.",
      "To recover values, use a running total: start at 0 and add each `diff[i]` from left to right.",
      "The same lesson source shows a check: build -> diff, then restore -> original.",
    ],
    realWorldContext: [
      "Imagine a daily step total log: [1200, 1300, 1300, 1500].",
      "You can store this as changes: start at 1200, then +100, then +0, then +200.",
      "That change list is the difference array; it is shorter conceptually because each entry is local change.",
    ],
    beginnerHint: [
      "At each index, ask: what is the running total after adding this change?",
      "Do not return `diff` itself.",
      "`diff` stores changes and the restored array stores concrete values.",
      "Use this sample: running starts at 0, then add 4, +3, +0, +3.",
    ],
    applyConcept: [
      "Input diff: [4, 3, 0, 3]",
      "Start running = 0.",
      "Index 0: running = 0 + 4 = 4.",
      "Index 1: running = 4 + 3 = 7.",
      "Index 2: running = 7 + 0 = 7.",
      "Index 3: running = 7 + 3 = 10.",
      "Result: [4, 7, 7, 10]",
    ],
    inputSpec: "diff: int[]",
    outputSpec: "int[] restored",
    sampleInput: "diff = [4, 3, 0, 3]",
    sampleOutput: "[4, 7, 7, 10]",
    javaSolution: `public static int[] restoreFromDifference(int[] diff) {
        int[] restored = new int[diff.length];
        int running = 0;

        for (int index = 0; index < diff.length; index++) {
            // Each diff entry is the change at this index.
            running += diff[index];

            // Running total is the restored value.
            restored[index] = running;
        }

        return restored;
    }

    public static int[] buildDifference(int[] nums) {
        int[] diff = new int[nums.length];
        diff[0] = nums[0];

        for (int index = 1; index < nums.length; index++) {
            // Each later entry captures the local change from the previous value.
            diff[index] = nums[index] - nums[index - 1];
        }

        return diff;
    }

    public static boolean roundTripCheck(int[] nums) {
        int[] diff = buildDifference(nums);
        int[] restored = restoreFromDifference(diff);
        return java.util.Arrays.equals(nums, restored);
    }`,
    pythonSolution: `def restore_from_difference(diff: list[int]) -> list[int]:
    restored = [0] * len(diff)
    running = 0

    for i, change in enumerate(diff):
        # Add the local change.
        running += change

        # Running total is the restored value.
        restored[i] = running

    return restored


def build_difference(nums: list[int]) -> list[int]:
    diff = [0] * len(nums)
    diff[0] = nums[0]

    for i in range(1, len(nums)):
        # Each position stores the change from previous index.
        diff[i] = nums[i] - nums[i - 1]

    return diff


def round_trip_check(nums: list[int]) -> bool:
    return restore_from_difference(build_difference(nums)) == nums`,
    explanation: [
      "Create `restored` with the same length as `diff`.",
      "Track a `running` total that starts at 0.",
      "Scan `diff` from left to right.",
      "At each index, add `diff[i]` into `running`.",
      "Write `running` into `restored[i]`.",
      "Return `restored`.",
      "Optional consistency check: build a new diff from `restored` and compare to input.",
    ],
    traceAscii: [
      "$ diff = [4, 3, 0, 3]",
      "running = 0",
      "index 0: running = 0 + 4 = 4 -> restored = [4, _, _, _]",
      "index 1: running = 4 + 3 = 7 -> restored = [4, 7, _, _]",
      "index 2: running = 7 + 0 = 7 -> restored = [4, 7, 7, _]",
      "index 3: running = 7 + 3 = 10 -> restored = [4, 7, 7, 10]",
      "answer = [4, 7, 7, 10]",
    ],
    timeComplexity: "O(n)",
    spaceComplexity: "O(n)",
    commonMistakes: [
      "Returning `diff` instead of `restored`.",
      "Forgetting `diff[0]` is the starting anchor.",
      "Starting `running` at `diff[0]` and then also adding `diff[0]` in the loop.",
      "Treating restore as subtraction instead of addition.",
    ],
  },
  {
    id: 2,
    title: "2D Difference + Restore",
    difficulty: "Easy",
    conceptFocus: "Use above, left, and diagonal cells to reverse a 2D difference matrix",
    slug: "2d-difference-restore",
    description:
      "Given a non-empty 2D difference matrix `diff`, return the restored original matrix `A`.",
    conceptBeforeProblem: [
      "The 2D difference build formula is:",
      "diff[r][c] = A[r][c] - A[r-1][c] - A[r][c-1] + A[r-1][c-1]",
      "The reverse formula is:",
      "A[r][c] = diff[r][c] + A[r-1][c] + A[r][c-1] - A[r-1][c-1]",
      "Boundary cases are explicit: (0,0), first row, first column, then inner cells.",
      "Diagonal is subtracted because it is counted in both above and left during the reverse scan.",
    ],
    realWorldContext: [
      "Think of a city-grid heatmap.",
      "A reconstructed cell is the total accumulated activity up to that grid coordinate.",
      "The difference matrix stores only local changes, while restore spreads them into totals.",
    ],
    beginnerHint: [
      "Process cells row by row.",
      "Ask whether left, above, and diagonal neighbors exist before applying the formula.",
      "Use the right boundary case for each position.",
      "For inner cells: add above + left, then subtract diagonal once.",
    ],
    applyConcept: [
      "Original A:",
      "[[1, 3, 6], [2, 6, 10], [5, 12, 20]]",
      "Build diff: [[1, 2, 3], [1, 2, 1], [3, 3, 4]]",
      "Restore check:",
      "(0,0) -> 1",
      "first row: 1+2=3, 3+3=6",
      "first column: 1+1=2, 2+3=5",
      "inner: 2+3+2-1=6, 1+6+6-3=10, 3+6+10-6=20",
      "Answer: [[1, 3, 6], [2, 6, 10], [5, 12, 20]]",
    ],
    inputSpec: "diff: int[][]",
    outputSpec: "int[][] restored",
    sampleInput: `diff = [[1, 2, 3],
 [1, 2, 1],
 [3, 3, 4]]`,
    sampleOutput: `[[1, 3, 6],
 [2, 6, 10],
 [5, 12, 20]]`,
    javaSolution: `public static int[][] restoreFromDifference(int[][] diff) {
        int rows = diff.length;
        int cols = diff[0].length;
        int[][] restored = new int[rows][cols];

        for (int row = 0; row < rows; row++) {
            for (int col = 0; col < cols; col++) {
                if (row == 0 && col == 0) {
                    // (0,0): no above, no left, no diagonal.
                    restored[row][col] = diff[row][col];
                } else if (row == 0) {
                    // First row: only the left restored value exists.
                    restored[row][col] = diff[row][col] + restored[row][col - 1];
                } else if (col == 0) {
                    // First column: only the above restored value exists.
                    restored[row][col] = diff[row][col] + restored[row - 1][col];
                } else {
                    // Inner cell: add above + left, then subtract diagonal once.
                    restored[row][col] =
                            diff[row][col] + restored[row - 1][col] + restored[row][col - 1] - restored[row - 1][col - 1];
                }
            }
        }

        return restored;
    }

    public static int[][] buildDifference(int[][] original) {
        int rows = original.length;
        int cols = original[0].length;
        int[][] diff = new int[rows][cols];

        for (int row = 0; row < rows; row++) {
            for (int col = 0; col < cols; col++) {
                if (row == 0 && col == 0) {
                    // (0,0): first value is the anchor.
                    diff[row][col] = original[row][col];
                } else if (row == 0) {
                    // First row: subtract left.
                    diff[row][col] = original[row][col] - original[row][col - 1];
                } else if (col == 0) {
                    // First column: subtract above.
                    diff[row][col] = original[row][col] - original[row - 1][col];
                } else {
                    // Inner: remove above and left; add diagonal back once.
                    diff[row][col] =
                            original[row][col] - original[row - 1][col] - original[row][col - 1] + original[row - 1][col - 1];
                }
            }
        }

        return diff;
    }

    public static boolean roundTripCheck(int[][] original) {
        int[][] diff = buildDifference(original);
        int[][] restored = restoreFromDifference(diff);
        return java.util.Arrays.deepEquals(original, restored);
    }`,
    pythonSolution: `def restore_from_difference(diff: list[list[int]]) -> list[list[int]]:
    rows, cols = len(diff), len(diff[0])
    restored = [[0] * cols for _ in range(rows)]

    for row in range(rows):
        for col in range(cols):
            if row == 0 and col == 0:
                restored[row][col] = diff[row][col]
            elif row == 0:
                restored[row][col] = diff[row][col] + restored[row][col - 1]
            elif col == 0:
                restored[row][col] = diff[row][col] + restored[row - 1][col]
            else:
                # Inner cells add above and left, subtract diagonal once.
                restored[row][col] = (
                    diff[row][col]
                    + restored[row - 1][col]
                    + restored[row][col - 1]
                    - restored[row - 1][col - 1]
                )

    return restored


def build_difference(original: list[list[int]]) -> list[list[int]]:
    rows, cols = len(original), len(original[0])
    diff = [[0] * cols for _ in range(rows)]

    for row in range(rows):
        for col in range(cols):
            if row == 0 and col == 0:
                diff[row][col] = original[row][col]
            elif row == 0:
                diff[row][col] = original[row][col] - original[row][col - 1]
            elif col == 0:
                diff[row][col] = original[row][col] - original[row - 1][col]
            else:
                diff[row][col] = (
                    original[row][col]
                    - original[row - 1][col]
                    - original[row][col - 1]
                    + original[row - 1][col - 1]
                )

    return diff


def round_trip_check(original: list[list[int]]) -> bool:
    return restore_from_difference(build_difference(original)) == original`,
    explanation: [
      "Create `restored` with same dimensions as `diff`.",
      "Scan rows left-to-right, top-to-bottom.",
      "(0,0): copy `diff[0][0]`.",
      "First row: restore from left neighbor only.",
      "First column: restore from above neighbor only.",
      "Inner cell: `diff[r][c] + above + left - diagonal`.",
      "Return `restored`.",
      "Optional check: run `buildDifference` on restored and compare to input `diff`.",
    ],
    traceAscii: [
      "$ diff =",
      "  [[1, 2, 3],",
      "   [1, 2, 1],",
      "   [3, 3, 4]]",
      "(0,0): A[0][0] = 1",
      "first row: A[0][1] = 2 + 1 = 3; A[0][2] = 3 + 3 = 6",
      "first col: A[1][0] = 1 + 1 = 2; A[2][0] = 3 + 2 = 5",
      "inner: A[1][1] = 2 + 3 + 2 - 1 = 6",
      "inner: A[1][2] = 1 + 6 + 6 - 3 = 10",
      "inner: A[2][1] = 3 + 6 + 5 - 2 = 12",
      "inner: A[2][2] = 4 + 10 + 12 - 6 = 20",
      "answer = [[1, 3, 6], [2, 6, 10], [5, 12, 20]]",
    ],
    timeComplexity: "O(r * c)",
    spaceComplexity: "O(r * c)",
    commonMistakes: [
      "Applying the inner formula on the first row or first column.",
      "Forgetting that diagonal is added twice by above and left.",
      "Using addition instead of subtraction for diagonal in inner restore.",
      "Swapping row/column indexes.",
    ],
  },
  {
    id: 3,
    title: "Line Sweep Max-Overlap Intro",
    difficulty: "Easy",
    conceptFocus: "Use event sorting and active delta counts to find maximum overlap",
    slug: "line-sweep-max-overlap-intro",
    description:
      "Given a list of inclusive intervals [start, end], return the maximum number of overlapping intervals.",
    conceptBeforeProblem: [
      "A line sweep processes only the positions where state changes.",
      "Each interval becomes two events: (start, +1) and (end, -1).",
      "For closed intervals, process starts before ends at the same coordinate so overlap at that exact point is counted.",
      "Sweep by sorted coordinate, then apply each event's `delta` to an active counter.",
    ],
    realWorldContext: [
      "Think of customers in a cafe with inclusive arrival/departure windows.",
      "At a time point, +1 means a new customer enters and -1 means one leaves after that time point.",
      "The maximum active count during the sweep is the answer.",
    ],
    beginnerHint: [
      "Create both start and end events for each interval.",
      "Sort by coordinate ascending, and for ties place +1 before -1.",
      "Walk the events in order, updating `active` and `maxActive`.",
    ],
    applyConcept: [
      "Intervals: [[1,4], [2,6], [4,7], [4,5], [5,8]]",
      "Events: (1,+1), (4,-1), (2,+1), (6,-1), (4,+1), (7,-1), (4,+1), (5,-1), (5,+1), (8,-1)",
      "Sorted with tie rule: (1,+1), (2,+1), (4,+1), (4,+1), (4,-1), (5,+1), (5,-1), (6,-1), (7,-1), (8,-1)",
      "active sequence: 1, 2, 3, 4, 3, 4, 3, 2, 1, 0",
      "maxActive = 4",
    ],
    inputSpec: "intervals: int[][]",
    outputSpec: "int maximumOverlap",
    sampleInput: `intervals = [[1,4], [2,6], [4,7], [4,5], [5,8]]`,
    sampleOutput: "4",
    javaSolution: `import java.util.ArrayList;
import java.util.List;

public static int maxOverlap(int[][] intervals) {
    List<int[]> events = new ArrayList<>();

    for (int[] interval : intervals) {
        // Start event: this interval becomes active.
        events.add(new int[]{interval[0], 1});

        // End event: this interval stops after this coordinate for closed intervals.
        events.add(new int[]{interval[1], -1});
    }

    // Sort by coordinate; for a tie, start (+1) comes before stop (-1).
    events.sort((a, b) -> {
        if (a[0] != b[0]) {
            return Integer.compare(a[0], b[0]);
        }
        return Integer.compare(b[1], a[1]);
    });

    int active = 0;
    int maxActive = 0;

    for (int[] event : events) {
        active += event[1];
        maxActive = Math.max(maxActive, active);
    }

    return maxActive;
}`,
    pythonSolution: `def max_overlap(intervals: list[list[int]]) -> int:
    events = []

    for start, end in intervals:
        # Start event at interval start.
        events.append((start, 1))
        # End event at the inclusive end.
        events.append((end, -1))

    # Sort by coordinate; start (+1) before stop (-1) at same coordinate.
    events.sort(key=lambda event: (event[0], -event[1]))

    active = 0
    max_active = 0

    for _coord, delta in events:
        active += delta
        max_active = max(max_active, active)

    return max_active`,
    explanation: [
      "Create an empty event list.",
      "For each interval, add `(start, +1)` and `(end, -1)`.",
      "Sort events by position, then by delta descending so +1 comes first.",
      "Sweep through events, updating running active count.",
      "Track the maximum active count after each event.",
      "Return `maxActive`.",
    ],
    traceAscii: [
      "sorted events:",
      "(1,+1), (2,+1), (4,+1), (4,+1), (4,-1), (5,+1), (5,-1), (6,-1), (7,-1), (8,-1)",
      "active starts at 0",
      "(1,+1) -> active 1, max = 1",
      "(2,+1) -> active 2, max = 2",
      "(4,+1) -> active 3, max = 3",
      "(4,+1) -> active 4, max = 4",
      "(4,-1) -> active 3, max = 4",
      "(5,+1) -> active 4, max = 4",
      "(5,-1) -> active 3, max = 4",
      "(6,-1) -> active 2, max = 4",
      "(7,-1) -> active 1, max = 4",
      "(8,-1) -> active 0, max = 4",
      "answer = 4",
    ],
    timeComplexity: "O(n log n)",
    spaceComplexity: "O(n)",
    commonMistakes: [
      "Processing end events before start events at equal coordinates for closed intervals.",
      "Forgetting to define interval closure (open vs closed) before answering.",
      "Updating max before applying the event delta.",
      "Dropping the second event for any interval.",
    ],
  },
];
