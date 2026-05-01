export type Difficulty =
  | "Easy"
  | "Easy-to-Medium"
  | "Medium"
  | "Medium-to-Medium-Hard";

export type PracticeType = "Teach" | "Try" | "Solve";

export interface DifferenceArraysProblem {
  id: number;
  title: string;
  difficulty: Difficulty;
  practiceType?: PracticeType;
  source?: {
    label: string;
    url: string;
  };
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
    title: "1D Difference Build + Restore",
    difficulty: "Easy",
    practiceType: "Teach",
    conceptFocus:
      "Build a 1D difference array from final values, then restore the final values with a prefix-sum running total.",
    slug: "1d-difference-build-restore",
    description:
      "Given an original array, build its difference array. Then use the difference array to restore the original array and prove the round trip works.",
    conceptBeforeProblem: [
      "A normal array stores final values. Example: `nums[1] = 7` means the value at index 1 is exactly 7.",
      "A difference array stores changes between neighboring positions. Example: from `[4, 7, 7, 10]`, `diff[1] = 7 - 4 = 3` stores the change from index 0 to index 1.",
      "The anchor is `diff[0] = nums[0]`. Example: `diff[0] = 4` tells the restore pass where to start.",
      "To restore, keep a running total. Example: with `diff = [4, 3, 0, 3]`, the running totals are `4, 7, 7, 10`.",
      "For a range update shaped like `[start, end, delta]`, add `delta` where the range starts and subtract it right after the range ends.",
    ],
    realWorldContext: [
      "Think about an elevator's floor after each stop. The final floors might be `[4, 7, 7, 10]`, but the changes are `start at 4`, then `+3`, then `+0`, then `+3`.",
      "The diff list is useful because many problems care about when a value starts changing and when it stops changing.",
      "A range update like `[1, 3, +3]` means indices 1, 2, and 3 each gain 3. Instead of touching three cells directly, we place two boundary marks.",
    ],
    beginnerHint: [
      "Build: compare each value with the value just before it. Example: `10 - 7 = 3`, so the last diff entry is 3.",
      "Restore: never subtract while rebuilding. Example: `running = 7 + 0 = 7` keeps the same value at index 2.",
      "Range marks: first define `start = 1`, `end = 3`, `delta = +3`; then do `diff[1] += 3` and `diff[4] -= 3` because index 3 is the last included index.",
      "Operation count check: direct update `[1, 3, +3]` touches 3 cells, while the diff update uses 2 boundary marks no matter how long the range is.",
    ],
    applyConcept: [
      "Build from original `[4, 7, 7, 10]`.",
      "Add `4` to `diff[0]` because the first original value is the anchor.",
      "Add `7 - 4 = 3` to `diff[1]` because index 1 increased by 3 from index 0.",
      "Add `7 - 7 = 0` to `diff[2]` because index 2 stayed the same as index 1.",
      "Add `10 - 7 = 3` to `diff[3]` because index 3 increased by 3 from index 2.",
      "Restore by scanning `diff = [4, 3, 0, 3]`: `running += diff[i]`, then `restored[i] = running`.",
      "Boundary mini-example: `n = 5`, update `[1, 3, +3]`, so `start = 1`, `end = 3`, `delta = +3`; add `+3` to `diff[1]` and add `-3` to `diff[4]` to stop after index 3.",
    ],
    inputSpec: "nums: int[] original values, such as [4, 7, 7, 10]",
    outputSpec: "int[] diff and int[] restored",
    sampleInput: "nums = [4, 7, 7, 10]",
    sampleOutput: "diff = [4, 3, 0, 3]\nrestored = [4, 7, 7, 10]",
    javaSolution: String.raw`import java.util.Arrays;

public class DifferenceArrayBasics {
    public static int[] buildDifference(int[] nums) {
        // diff stores changes between adjacent values instead of copying every final value.
        int[] diff = new int[nums.length];

        // diff[0] is the anchor: the first final value.
        diff[0] = nums[0];

        for (int index = 1; index < nums.length; index++) {
            // Store the change from the previous final value.
            diff[index] = nums[index] - nums[index - 1];
        }

        return diff;
    }

    public static int[] restoreFromDifference(int[] diff) {
        int[] restored = new int[diff.length];
        int running = 0;

        for (int index = 0; index < diff.length; index++) {
            // Prefix sum: add the stored change into the running total.
            running += diff[index];

            // The running total is the actual restored value at this index.
            restored[index] = running;
        }

        return restored;
    }

    public static int[] applySingleRangeAdd(int n, int start, int end, int delta) {
        // One extra slot lets us safely mark end + 1 when end is the last included index.
        int[] diff = new int[n + 1];

        // The update shape is [start, end, delta].
        // Add delta at start so the running total begins applying it there.
        diff[start] += delta;

        // Subtract delta at end + 1 to stop applying it after end.
        diff[end + 1] -= delta;

        int[] values = new int[n];
        int running = 0;

        for (int index = 0; index < n; index++) {
            // Prefix sum turns the boundary marks into each final value.
            running += diff[index];
            values[index] = running;
        }

        return values;
    }

    public static boolean roundTripCheck(int[] nums) {
        // If the diff array is correct, build then restore returns the original array.
        int[] diff = buildDifference(nums);
        int[] restored = restoreFromDifference(diff);
        return Arrays.equals(nums, restored);
    }

    public static void main(String[] args) {
        int[] original = {4, 7, 7, 10};
        int[] diff = buildDifference(original);
        int[] restored = restoreFromDifference(diff);
        int[] rangeResult = applySingleRangeAdd(5, 1, 3, 3);

        System.out.println(Arrays.toString(diff));        // [4, 3, 0, 3]
        System.out.println(Arrays.toString(restored));    // [4, 7, 7, 10]
        System.out.println(Arrays.toString(rangeResult)); // [0, 3, 3, 3, 0]
        System.out.println(roundTripCheck(original));     // true
    }
}`,
    pythonSolution: String.raw`def build_difference(nums: list[int]) -> list[int]:
    # diff stores changes between adjacent values instead of copying every final value.
    diff = [0] * len(nums)

    # diff[0] is the anchor: the first final value.
    diff[0] = nums[0]

    for index in range(1, len(nums)):
        # Store the change from the previous final value.
        diff[index] = nums[index] - nums[index - 1]

    return diff


def restore_from_difference(diff: list[int]) -> list[int]:
    restored = [0] * len(diff)
    running = 0

    for index, change in enumerate(diff):
        # Prefix sum: add the stored change into the running total.
        running += change

        # The running total is the actual restored value at this index.
        restored[index] = running

    return restored


def apply_single_range_add(n: int, start: int, end: int, delta: int) -> list[int]:
    # One extra slot lets us safely mark end + 1 when end is the last included index.
    diff = [0] * (n + 1)

    # The update shape is [start, end, delta].
    # Add delta at start so the running total begins applying it there.
    diff[start] += delta

    # Subtract delta at end + 1 to stop applying it after end.
    diff[end + 1] -= delta

    values = [0] * n
    running = 0
    for index in range(n):
        # Prefix sum turns the boundary marks into each final value.
        running += diff[index]
        values[index] = running

    return values


def round_trip_check(nums: list[int]) -> bool:
    # If the diff array is correct, build then restore returns the original list.
    return restore_from_difference(build_difference(nums)) == nums`,
    explanation: [
      "Build step: set `diff[0] = nums[0]`; for `[4, 7, 7, 10]`, add `4` to `diff[0]`.",
      "Build step: for each later index, subtract the previous value; for index 1, `7 - 4 = 3`.",
      "Restore step: start `running = 0`, then add each diff entry from left to right.",
      "Restore step: write the running total into the restored array; after adding `4`, write `4` at index 0.",
      "Round trip: `original -> diff -> restored` should return the same original array.",
      "Range-update preview: for `[start, end, delta] = [1, 3, +3]`, two boundary marks rebuild `[0, 3, 3, 3, 0]` after prefix sum.",
    ],
    traceAscii: [
      "original = [4, 7, 7, 10]",
      "diff[0] = 4",
      "diff[1] = 7 - 4 = 3",
      "diff[2] = 7 - 7 = 0",
      "diff[3] = 10 - 7 = 3",
      "diff = [4, 3, 0, 3]",
      "restore running starts at 0",
      "index 0: running += 4  -> 4  -> restored[0] = 4",
      "index 1: running += 3  -> 7  -> restored[1] = 7",
      "index 2: running += 0  -> 7  -> restored[2] = 7",
      "index 3: running += 3  -> 10 -> restored[3] = 10",
      "round trip passes: [4, 7, 7, 10] -> [4, 3, 0, 3] -> [4, 7, 7, 10]",
      "range update [1, 3, +3]: diff[1] += 3 and diff[4] -= 3, so the +3 stops after index 3",
    ],
    timeComplexity: "O(n)",
    spaceComplexity: "O(n)",
    commonMistakes: [
      "Returning `diff` as the final answer even though it stores changes, not values.",
      "Forgetting `diff[0]` is the anchor value.",
      "Starting `running` at `diff[0]` and also adding `diff[0]` inside the loop, which double-counts the anchor.",
      "Using subtraction during restore instead of prefix-sum addition.",
      "Forgetting that `end` is the last included index before using `end + 1`.",
    ],
  },
  {
    id: 2,
    title: "LeetCode 1854: Maximum Population Year",
    difficulty: "Easy",
    practiceType: "Try",
    source: {
      label: "LeetCode 1854",
      url: "https://leetcode.com/problems/maximum-population-year/description/",
    },
    conceptFocus:
      "Treat births and deaths as year-by-year population deltas, then scan years in increasing order.",
    slug: "maximum-population-year",
    description:
      "Given birth/death logs, return the earliest year with the maximum living population.",
    conceptBeforeProblem: [
      "This is the same change-list idea, but the indexes are years. LeetCode gives the constraint `1950 <= birth < death <= 2050`, so these are problem bounds, not arbitrary constants.",
      "Example: index `0` can represent year 1950.",
      "A birth year adds `+1` because one more person becomes alive. Example: birth `1960` means add `+1` to `diff[1960 - 1950]`.",
      "A death year adds `-1` because the death year is excluded. Example: death `1971` means add `-1` to `diff[1971 - 1950]`.",
      "The alive interval is `[birth, death - 1]`. Example: `[1950, 1961]` counts 1950 through 1960, not 1961.",
      "Prefix sum gives current population. Example: if running reaches 2 in 1960, two people are alive in 1960.",
    ],
    realWorldContext: [
      "Imagine a town record book. Instead of recounting everyone alive in every year, mark when population changes.",
      "A birth is a start mark, and a death is a stop mark.",
      "Scanning years from 1950 upward naturally preserves the earliest year when ties happen.",
    ],
    beginnerHint: [
      "Use an offset from LeetCode's minimum allowed year: `index = year - 1950`. Example: year 1950 maps to index 0 and year 1960 maps to index 10.",
      "Mark birth with `+1`; mark death with `-1`. Do not use `death + 1`, because the death year is already excluded.",
      "Update the answer only when `current > best`. Example: if 1970 ties 1960, keep 1960.",
      "Operation count check: checking every person for every year is about `101 * logs.length`; marking each person twice plus one year scan is about `2 * logs.length + 101`.",
    ],
    applyConcept: [
      "For `logs = [[1950,1961],[1960,1971],[1970,1981]]`, first define each interval as `[birth, death - 1]`.",
      "Person 1: `birth = 1950`, `death = 1961`; add `+1` to `diff[0]` and add `-1` to `diff[11]`.",
      "Person 2: `birth = 1960`, `death = 1971`; add `+1` to `diff[10]` and add `-1` to `diff[21]`.",
      "Person 3: `birth = 1970`, `death = 1981`; add `+1` to `diff[20]` and add `-1` to `diff[31]`.",
      "Scan years upward. Population reaches 2 in 1960 and reaches 2 again in 1970, but 1960 is earlier.",
    ],
    inputSpec: "logs: int[][] where each row is [birth, death]",
    outputSpec: "int earliest year with the maximum population",
    sampleInput: "logs = [[1993,1999],[2000,2010]]",
    sampleOutput: "1993",
    javaSolution: String.raw`class Solution {
    public int maximumPopulation(int[][] logs) {
        // LeetCode gives this fixed year range, so years can be offset into a small array.
        int startYear = 1950;
        int endYear = 2050;

        // Difference array idea: store population changes, not full population counts yet.
        // +2 gives a safe sentinel slot for the death mark at 2050.
        int[] diff = new int[endYear - startYear + 2];

        for (int[] log : logs) {
            int birth = log[0];
            int death = log[1];

            // Birth year is included, so population starts increasing here.
            diff[birth - startYear] += 1;

            // Death year is excluded, so population stops at death.
            diff[death - startYear] -= 1;
        }

        int current = 0;
        int best = -1;
        int answer = startYear;

        for (int year = startYear; year <= endYear; year++) {
            // Prefix sum rebuilds the actual population for this year.
            current += diff[year - startYear];

            // Strictly greater preserves the earliest year during ties.
            if (current > best) {
                best = current;
                answer = year;
            }
        }

        return answer;
    }
}`,
    pythonSolution: String.raw`class Solution:
    def maximumPopulation(self, logs: list[list[int]]) -> int:
        # LeetCode gives this fixed year range, so years can be offset into a small array.
        start_year = 1950
        end_year = 2050

        # Difference array idea: store population changes, not full population counts yet.
        # +2 gives a safe sentinel slot for the death mark at 2050.
        diff = [0] * (end_year - start_year + 2)

        for birth, death in logs:
            # Birth year is included.
            diff[birth - start_year] += 1

            # Death year is excluded, so subtract at death, not death + 1.
            diff[death - start_year] -= 1

        current = 0
        best = -1
        answer = start_year

        for year in range(start_year, end_year + 1):
            # Prefix sum rebuilds the actual population for this year.
            current += diff[year - start_year]

            # Strict > keeps the earliest year when populations tie.
            if current > best:
                best = current
                answer = year

        return answer`,
    explanation: [
      "Create a sentinel-safe difference array for LeetCode's given year range, 1950 through 2050.",
      "For each log `[birth, death]`, add `+1` at `birth - 1950`.",
      "For each log `[birth, death]`, add `-1` at `death - 1950` because the death year is not counted.",
      "Scan from 1950 upward while maintaining `current` population.",
      "When `current > best`, update the best population and answer year.",
      "When `current == best`, do nothing so the earlier answer remains.",
    ],
    traceAscii: [
      "logs = [[1950,1961],[1960,1971],[1970,1981]]",
      "[1950,1961]: diff[0] += 1, diff[11] -= 1",
      "[1960,1971]: diff[10] += 1, diff[21] -= 1",
      "[1970,1981]: diff[20] += 1, diff[31] -= 1",
      "1950: current = 1, best = 1, answer = 1950",
      "1960: current = 2, best = 2, answer = 1960",
      "1961: current = 1 because the first person is no longer counted",
      "1970: current = 2, ties best, keep answer = 1960",
      "answer = 1960",
    ],
    timeComplexity: "O(n + 101)",
    spaceComplexity: "O(101)",
    commonMistakes: [
      "Counting a person in their death year even though the alive interval ends at `death - 1`.",
      "Subtracting at `death + 1`, which is the wrong interval convention for this problem.",
      "Using `>=` or `<=` in the best-year check and accidentally returning the latest tied year.",
      "Forgetting the `year - 1950` offset.",
    ],
  },
  {
    id: 3,
    title: "CCC 2026 S2: Beams of Light",
    difficulty: "Easy-to-Medium",
    practiceType: "Solve",
    source: {
      label: "DMOJ CCC '26 S2",
      url: "https://dmoj.ca/problem/ccc26s2",
    },
    conceptFocus:
      "Use clipped 1D range updates to mark which parking spots receive at least one light beam.",
    slug: "beams-of-light",
    description:
      "Given parking spots, lights, and query spots, print Y when a queried spot is illuminated by at least one light and N otherwise.",
    conceptBeforeProblem: [
      "Parking spots are numbered `1` through `N`, so this problem is easiest with 1-indexed arrays.",
      "Each light has shape `[P, S]`: position `P`, spread `S`. Example: `P = 4`, `S = 2` wants to cover spots 2 through 6.",
      "Clip the interval to the garage: `left = max(P - S, 1)` and `right = min(P + S, N)`.",
      "Each light adds one beam of coverage over `[left, right]`. Example: `[2, 6]` adds `+1` to spots 2, 3, 4, 5, and 6.",
      "Boundary marks are `diff[left] += 1` and `diff[right + 1] -= 1`; `right` is the last included parking spot.",
      "A prefix sum rebuilds `coverage[spot]`, and a query is `Y` exactly when `coverage[spot] > 0`.",
    ],
    realWorldContext: [
      "Imagine standing in a long garage and asking whether each parking spot is lit.",
      "A direct method would walk every spot under every light, which can be too slow when `N`, `L`, and `Q` are large.",
      "The difference-array method marks only where each light starts and stops contributing, then rebuilds coverage once.",
    ],
    beginnerHint: [
      "Always define the interval first. Example: for `P = 1`, `S = 1`, `N = 10`, `left = 1` and `right = 2`.",
      "After clipping, add `+1` to `diff[left]` and `-1` to `diff[right + 1]`.",
      "Allocate `N + 2` slots so `right + 1` is safe even when `right = N`.",
      "Operation count check: a light with spread 200000 could touch 400001 spots directly, but diff uses only 2 boundary marks.",
    ],
    applyConcept: [
      "Sample light `8 0`: `P = 8`, `S = 0`, so `left = 8`, `right = 8`; add `+1` to `diff[8]` and `-1` to `diff[9]`.",
      "Sample light `1 1`: `P = 1`, `S = 1`, so `left = max(0, 1) = 1`, `right = min(2, 10) = 2`; add `+1` to `diff[1]` and `-1` to `diff[3]`.",
      "Sample light `4 2`: `P = 4`, `S = 2`, so `left = 2`, `right = 6`; add `+1` to `diff[2]` and `-1` to `diff[7]`.",
      "After prefix sum, spots 1, 2, 3, 4, 5, 6, and 8 have coverage above 0; spots 7, 9, and 10 do not.",
    ],
    inputSpec:
      "N, then L, then Q, followed by L lines of `P S`, followed by Q queried parking spots",
    outputSpec: "One line per query: `Y` if illuminated, otherwise `N`",
    sampleInput: "10\n3\n4\n8 0\n1 1\n4 2\n4\n10\n7\n1",
    sampleOutput: "Y\nN\nN\nY",
    javaSolution: String.raw`import java.io.BufferedInputStream;
import java.io.IOException;

public class Main {
    // Fast input keeps the focus on the O(N + L + Q) difference-array solution.
    private static class FastScanner {
        private final BufferedInputStream input = new BufferedInputStream(System.in);
        private final byte[] buffer = new byte[1 << 16];
        private int pointer = 0;
        private int length = 0;

        private int read() throws IOException {
            if (pointer >= length) {
                length = input.read(buffer);
                pointer = 0;
                if (length <= 0) {
                    return -1;
                }
            }
            return buffer[pointer++];
        }

        int nextInt() throws IOException {
            int character;
            do {
                character = read();
            } while (character <= ' ' && character != -1);

            int sign = 1;
            if (character == '-') {
                sign = -1;
                character = read();
            }

            int value = 0;
            while (character > ' ') {
                value = value * 10 + (character - '0');
                character = read();
            }
            return value * sign;
        }
    }

    public static void main(String[] args) throws Exception {
        FastScanner scanner = new FastScanner();

        int n = scanner.nextInt();
        int lights = scanner.nextInt();
        int questions = scanner.nextInt();

        // diff stores coverage changes, not final coverage for every spot yet.
        // 1-indexed spots plus one sentinel slot for right + 1.
        int[] diff = new int[n + 2];

        for (int i = 0; i < lights; i++) {
            int position = scanner.nextInt();
            int spread = scanner.nextInt();

            // Clip the light's reach so the interval stays inside parking spots 1..n.
            int left = Math.max(position - spread, 1);
            int right = Math.min(position + spread, n);

            // The light covers [left, right], where right is the last included spot.
            // Add at left to start this light's coverage.
            diff[left] += 1;

            // Subtract after right to stop this light's coverage.
            diff[right + 1] -= 1;
        }

        int[] coverage = new int[n + 1];
        int running = 0;

        for (int spot = 1; spot <= n; spot++) {
            // Prefix sum rebuilds the actual number of lights covering this spot.
            running += diff[spot];
            coverage[spot] = running;
        }

        StringBuilder output = new StringBuilder();
        for (int i = 0; i < questions; i++) {
            int spot = scanner.nextInt();

            // Any positive coverage means at least one light reaches the queried spot.
            output.append(coverage[spot] > 0 ? 'Y' : 'N').append('\n');
        }

        System.out.print(output.toString());
    }
}`,
    pythonSolution: String.raw`import sys

def solve() -> None:
    # Read all integers once so input handling stays O(total input size).
    data = list(map(int, sys.stdin.buffer.read().split()))
    index = 0

    n = data[index]
    index += 1
    lights = data[index]
    index += 1
    questions = data[index]
    index += 1

    # diff stores coverage changes, not final coverage for every spot yet.
    # n + 2 supports 1-indexed spots and the right + 1 sentinel.
    diff = [0] * (n + 2)

    for _ in range(lights):
        position = data[index]
        spread = data[index + 1]
        index += 2

        # Clip the light's reach so the interval stays inside parking spots 1..n.
        left = max(position - spread, 1)
        right = min(position + spread, n)

        # Add at left to start coverage, then subtract after right to stop it.
        diff[left] += 1
        diff[right + 1] -= 1

    coverage = [0] * (n + 1)
    running = 0
    for spot in range(1, n + 1):
        # Prefix sum rebuilds the actual number of lights covering this spot.
        running += diff[spot]
        coverage[spot] = running

    answers = []
    for _ in range(questions):
        spot = data[index]
        index += 1

        # Any positive coverage means at least one light reaches the queried spot.
        answers.append("Y" if coverage[spot] > 0 else "N")

    print("\n".join(answers))

if __name__ == "__main__":
    solve()`,
    explanation: [
      "Read `N`, `L`, and `Q`.",
      "Create `diff` with length `N + 2` because spot numbers are 1-indexed and `right + 1` needs a sentinel.",
      "For each light, compute the clipped interval `[left, right]`.",
      "Add `+1` to `diff[left]` and `-1` to `diff[right + 1]`.",
      "Run a prefix sum from spot 1 through spot `N` to build `coverage`.",
      "For each query, print `Y` when `coverage[spot] > 0`; otherwise print `N`.",
    ],
    traceAscii: [
      "N = 10",
      "light 8 0 -> left = 8, right = 8 -> diff[8] += 1, diff[9] -= 1",
      "light 1 1 -> left = 1, right = 2 -> diff[1] += 1, diff[3] -= 1",
      "light 4 2 -> left = 2, right = 6 -> diff[2] += 1, diff[7] -= 1",
      "prefix coverage by spot: 1:Y, 2:Y, 3:Y, 4:Y, 5:Y, 6:Y, 7:N, 8:Y, 9:N, 10:N",
      "query 4 -> Y",
      "query 10 -> N",
      "query 7 -> N",
      "query 1 -> Y",
    ],
    timeComplexity: "O(N + L + Q)",
    spaceComplexity: "O(N)",
    commonMistakes: [
      "Forgetting to clip `left` to at least 1 or `right` to at most `N`.",
      "Using 0-indexed arrays accidentally even though the parking spots are numbered 1 through `N`.",
      "Forgetting that `right` is the last included spot before marking `right + 1`.",
      "Answering each query by scanning lights again instead of building coverage once.",
      "Printing lowercase letters or extra text instead of exactly `Y` or `N` per query.",
    ],
  },
  {
    id: 4,
    title: "LeetCode Meeting Rooms II",
    difficulty: "Medium",
    practiceType: "Try",
    source: {
      label: "LeetCode Meeting Rooms II",
      url: "https://leetcode.com/problems/meeting-rooms-ii/",
    },
    conceptFocus:
      "Use sparse event deltas to find the peak number of active meetings, which is the room count.",
    slug: "meeting-rooms-ii",
    description:
      "Given meeting intervals, return the minimum number of conference rooms needed so all meetings can happen without conflict.",
    conceptBeforeProblem: [
      "This is still a difference-array idea, but time values can be large or sparse, so a `TreeMap` stores only the times where demand changes.",
      "A meeting start adds demand. Example: `[5, 10]` adds `+1` at time 5.",
      "A meeting end removes demand. Example: `[5, 10]` adds `-1` at time 10.",
      "The answer is the peak active meeting count. Example: if active reaches 2, at least 2 rooms are needed.",
      "A meeting ending at time `t` frees a room for a meeting starting at time `t`; aggregating deltas at the same time handles that reuse.",
    ],
    realWorldContext: [
      "Think of a front desk assigning rooms. Every meeting start asks for one room; every meeting end returns one room.",
      "We do not need a full array with every minute of the day if meetings only start or end at a few times.",
      "A sorted map is a sparse difference array: it keeps only the change points.",
    ],
    beginnerHint: [
      "For each interval `[start, end]`, add `+1` to `delta[start]` and `-1` to `delta[end]`.",
      "Scan the `TreeMap` values in sorted key order, just like a prefix sum over time.",
      "When two meetings touch, like `[2, 4]` and `[4, 7]`, the `-1` and `+1` at time 4 combine to 0, so no extra room is needed.",
      "Operation count check: comparing all pairs can be `O(n^2)`; event deltas need `2n` map updates and one sorted scan.",
    ],
    applyConcept: [
      "For `[[0,30], [5,10], [15,20]]`, mark `delta[0] += 1`, `delta[30] -= 1`.",
      "Mark `delta[5] += 1`, `delta[10] -= 1` for the second meeting.",
      "Mark `delta[15] += 1`, `delta[20] -= 1` for the third meeting.",
      "Scan sorted times: active becomes 1 at 0, 2 at 5, 1 at 10, 2 at 15, 1 at 20, 0 at 30.",
      "The peak active count is 2, so the answer is 2 rooms.",
    ],
    inputSpec: "intervals: int[][] where each row is [start, end]",
    outputSpec: "int minimum number of conference rooms",
    sampleInput: "intervals = [[0,30], [5,10], [15,20]]",
    sampleOutput: "2",
    javaSolution: String.raw`import java.util.Map;
import java.util.TreeMap;

class Solution {
    public int minMeetingRooms(int[][] intervals) {
        // Sparse difference array: only store times where room demand changes.
        TreeMap<Integer, Integer> delta = new TreeMap<>();

        for (int[] meeting : intervals) {
            int start = meeting[0];
            int end = meeting[1];

            // A meeting start needs one more room.
            delta.put(start, delta.getOrDefault(start, 0) + 1);

            // A meeting end frees one room at this exact time.
            delta.put(end, delta.getOrDefault(end, 0) - 1);
        }

        int active = 0;
        int maxRooms = 0;

        for (Map.Entry<Integer, Integer> event : delta.entrySet()) {
            // Sorted prefix sum over event times gives active meetings after each change.
            active += event.getValue();

            // The peak active count is the minimum number of rooms needed.
            maxRooms = Math.max(maxRooms, active);
        }

        return maxRooms;
    }
}`,
    pythonSolution: String.raw`from collections import defaultdict

def min_meeting_rooms(intervals: list[list[int]]) -> int:
    # Sparse difference array: only store times where room demand changes.
    delta = defaultdict(int)

    for start, end in intervals:
        # A meeting start needs one more room.
        delta[start] += 1

        # A meeting end frees one room at this exact time.
        delta[end] -= 1

    active = 0
    max_rooms = 0

    for time in sorted(delta):
        # Sorted prefix sum over event times gives active meetings after each change.
        active += delta[time]

        # The peak active count is the minimum number of rooms needed.
        max_rooms = max(max_rooms, active)

    return max_rooms`,
    explanation: [
      "Create a `TreeMap<Integer, Integer>` where keys are times and values are demand changes.",
      "For each meeting `[start, end]`, add `+1` at `start` and `-1` at `end`.",
      "The map automatically combines deltas at the same time.",
      "Scan entries in sorted time order, adding each change into `active`.",
      "Track `maxRooms`, the largest value `active` ever reaches.",
      "Return `maxRooms` because the peak active meeting count is the minimum number of rooms needed.",
    ],
    traceAscii: [
      "intervals = [[0,30], [5,10], [15,20]]",
      "delta[0] += 1, delta[30] -= 1",
      "delta[5] += 1, delta[10] -= 1",
      "delta[15] += 1, delta[20] -= 1",
      "time 0: active = 1, maxRooms = 1",
      "time 5: active = 2, maxRooms = 2",
      "time 10: active = 1, maxRooms = 2",
      "time 15: active = 2, maxRooms = 2",
      "time 20: active = 1, maxRooms = 2",
      "time 30: active = 0, maxRooms = 2",
      "answer = 2",
      "same-time reuse example: [2,4] and [4,7] give delta[4] = -1 + 1 = 0, so one room is enough",
    ],
    timeComplexity: "O(n log n)",
    spaceComplexity: "O(n)",
    commonMistakes: [
      "Treating a meeting ending at time `t` as conflicting with a meeting starting at time `t`.",
      "Using a dense array when times are sparse or very large, instead of a sorted map or sorted events.",
      "Forgetting to combine multiple deltas at the same time.",
      "Returning the final active count instead of the maximum active count.",
    ],
  },
];
