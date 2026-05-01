# Difference Arrays 1D: Store Changes, Rebuild Values

## Audience and prerequisites

This lesson is for beginner-to-intermediate Java students who can already use arrays, `for` loops, helper methods, and simple input/output. Students should have seen prefix sums as a running total, but they do not need 2D difference arrays, segment trees, or Fenwick trees.

Planned duration: **150 minutes**. The lesson is intentionally paced as a 2.5-hour lesson so the four-problem sequence has time for concept setup, hand traces, CoderPad practice, and review.

## Learning goals

By the end, students should be able to:

1. Explain that a normal array stores final values, while a difference array stores changes.
2. Build a 1D difference array with:

   ```text
   diff[0] = nums[0]
   diff[i] = nums[i] - nums[i - 1]
   ```

3. Restore final values with a prefix-sum running total:

   ```text
   running += diff[i]
   nums[i] = running
   ```

4. Apply an inclusive range update shaped like `[start, end, delta]` with two boundary marks:

   ```text
   diff[start] += delta
   diff[end + 1] -= delta
   ```

   The second mark means “stop applying this delta after `end`,” where `end` is the last included index.

5. Transfer the same idea to population years, parking-spot light coverage, and meeting-room demand.

## Sources used for the refresh

These sources were used to verify facts and improve beginner explanations, but the lesson text and code are original.

- LeetCode 1854, Maximum Population Year: <https://leetcode.com/problems/maximum-population-year/description/>
- AlgoMonster 1854 explanation: <https://algo.monster/liteproblems/1854>
- CCC 2026 S2, Beams of Light: <https://dmoj.ca/problem/ccc26s2>
- DMOJ Beams editorial: <https://dmoj.ca/problem/ccc26s2/editorial>
- USACO Guide prefix sums: <https://usaco.guide/silver/prefix-sums>
- USACO Guide range-update explanation: <https://usaco.guide/problems/cses-1651-range-update-queries/solution>
- LeetCode Meeting Rooms II: <https://leetcode.com/problems/meeting-rooms-ii/>
- NeetCode Meeting Rooms II explanation: <https://neetcode.io/solutions/meeting-rooms-ii>
- AlgoMonster Meeting Rooms II explanation: <https://algo.monster/liteproblems/253>

## Lesson timeline

| Time | Segment | Goal |
|---:|---|---|
| 0-18 min | Opening concept | Difference arrays store changes; prefix sums rebuild values. |
| 18-41 min | Problem 1: Teach | Build and restore a 1D difference array. |
| 41-47 min | Bridge | Array indexes become years. |
| 47-70 min | Problem 2: Try | LeetCode 1854 population deltas. |
| 70-76 min | Bridge | One light becomes one clipped range update. |
| 76-108 min | Problem 3: Solve | CCC Beams of Light coverage. |
| 108-114 min | Bridge | Dense arrays become sparse event maps. |
| 114-140 min | Problem 4: Try | Meeting Rooms II active-demand deltas. |
| 140-150 min | Closing review | Compare all four versions of the pattern. |

## Opening concept section

### Mental model

A normal array stores final values.

```text
nums = [4, 7, 7, 10]
```

This means index 0 is actually 4, index 1 is actually 7, index 2 is actually 7, and index 3 is actually 10.

A difference array stores changes between neighboring positions.

```text
original = [4, 7, 7, 10]
diff     = [4, 3, 0, 3]
```

Read it like this:

- `diff[0] = 4`: start at 4. This is the anchor.
- `diff[1] = 3`: add 3 to move from 4 to 7.
- `diff[2] = 0`: add 0, so the value stays 7.
- `diff[3] = 3`: add 3 to move from 7 to 10.

### Build formula

```text
diff[0] = nums[0]
diff[i] = nums[i] - nums[i - 1]
```

Concrete build:

```text
nums[0] = 4           -> diff[0] = 4
nums[1] - nums[0] = 7 - 4   -> diff[1] = 3
nums[2] - nums[1] = 7 - 7   -> diff[2] = 0
nums[3] - nums[2] = 10 - 7  -> diff[3] = 3
```

So:

```text
[4, 7, 7, 10] -> [4, 3, 0, 3]
```

### Restore formula

```text
running += diff[i]
nums[i] = running
```

Concrete restore:

```text
running = 0
index 0: running = 0 + 4  = 4
index 1: running = 4 + 3  = 7
index 2: running = 7 + 0  = 7
index 3: running = 7 + 3  = 10
```

So:

```text
[4, 3, 0, 3] -> [4, 7, 7, 10]
```

### Boundary marks for range updates

Always define the update shape first:

```text
update = [start, end, delta]
```

Example:

```text
n = 5
update = [1, 3, +3]
start = 1, end = 3, delta = +3
```

Direct update would add 3 to index 1, index 2, and index 3. That is 3 cell updates.

Difference-array update uses two boundary marks:

```text
diff[1] += 3
diff[4] -= 3
```

`end = 3` is the last included index. The mark at `end + 1 = 4` means “stop applying +3 after index 3.”

After a prefix-sum rebuild, the update becomes:

```text
[0, 3, 3, 3, 0]
```

Operation-count comparison:

| Range length | Direct updates | Diff boundary marks |
|---:|---:|---:|
| 3 cells | 3 writes | 2 marks |
| 100 cells | 100 writes | 2 marks |
| 1,000,000 cells | 1,000,000 writes | 2 marks |

The cost moves to one rebuild pass after all marks are placed.

---

# Problem 1: 1D Difference Build + Restore

## Metadata

- Practice type: **Teach**
- Difficulty: Easy
- Concept focus: build a 1D difference array, then restore it with prefix sum.
- CoderPad expectation: instructor-led teaching problem.

## Problem statement

Given an original 1D array, build its difference array. Then regenerate the original array using a prefix-sum running total. Include a round-trip check:

```text
original -> diff -> restored original
```

## Input

```text
nums: int[]
```

Example:

```text
nums = [4, 7, 7, 10]
```

## Output

```text
diff: int[]
restored: int[]
```

Expected:

```text
diff = [4, 3, 0, 3]
restored = [4, 7, 7, 10]
```

## Concept before problem

- A normal array stores final values. Example: `nums[1] = 7` means the value at index 1 is actually 7.
- A diff array stores changes. Example: `diff[1] = 3` means add 3 compared with the previous value.
- `diff[0]` is the anchor. Example: `diff[0] = 4` gives the restore pass its starting value.
- Prefix sum restores values. Example: running totals over `[4, 3, 0, 3]` are `[4, 7, 7, 10]`.

## Real-world context

Imagine a game character’s score after each round:

```text
score = [4, 7, 7, 10]
```

The diff version stores how the score changed:

```text
start at 4, then +3, then +0, then +3
```

This is useful because later problems often care more about when a change starts and stops than about immediately writing every final value.

## Beginner hint

For build, compare each value to the previous value. For restore, use addition only:

```text
running += diff[i]
```

Do not return the diff array as the final restored answer. It stores changes, not final values.

## Apply concept

Build walkthrough:

| Index | Original value | Operation | Diff value |
|---:|---:|---|---:|
| 0 | 4 | `diff[0] = nums[0]` | 4 |
| 1 | 7 | `7 - 4` | 3 |
| 2 | 7 | `7 - 7` | 0 |
| 3 | 10 | `10 - 7` | 3 |

Restore walkthrough:

| Index | Diff value | Running total | Restored value |
|---:|---:|---:|---:|
| 0 | 4 | 4 | 4 |
| 1 | 3 | 7 | 7 |
| 2 | 0 | 7 | 7 |
| 3 | 3 | 10 | 10 |

Boundary-mark mini-example:

```text
n = 5
update = [1, 3, +3]
start = 1, end = 3, delta = +3
diff[1] += 3
diff[4] -= 3
```

Because `end = 3` is the last included index, `diff[4] -= 3` stops the `+3` after index 3.

## Java solution

```java
import java.util.Arrays;

public class DifferenceArrayBasics {
    public static int[] buildDifference(int[] nums) {
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
        // One extra slot lets us safely mark end + 1.
        int[] diff = new int[n + 1];

        // The update shape is [start, end, delta].
        diff[start] += delta;
        diff[end + 1] -= delta; // stop after end, where end is last included

        int[] values = new int[n];
        int running = 0;

        for (int index = 0; index < n; index++) {
            running += diff[index];
            values[index] = running;
        }

        return values;
    }

    public static boolean roundTripCheck(int[] nums) {
        int[] diff = buildDifference(nums);
        int[] restored = restoreFromDifference(diff);
        return Arrays.equals(nums, restored);
    }
}
```

## Python comparison

```python
def build_difference(nums: list[int]) -> list[int]:
    diff = [0] * len(nums)
    diff[0] = nums[0]

    for index in range(1, len(nums)):
        diff[index] = nums[index] - nums[index - 1]

    return diff


def restore_from_difference(diff: list[int]) -> list[int]:
    restored = [0] * len(diff)
    running = 0

    for index, change in enumerate(diff):
        running += change
        restored[index] = running

    return restored
```

## ASCII trace

```text
original = [4, 7, 7, 10]
diff[0] = 4
diff[1] = 7 - 4 = 3
diff[2] = 7 - 7 = 0
diff[3] = 10 - 7 = 3
diff = [4, 3, 0, 3]
restore: 0 -> 4 -> 7 -> 7 -> 10
restored = [4, 7, 7, 10]
```

## Complexity

- Time: `O(n)` to build and `O(n)` to restore.
- Space: `O(n)` for the diff or restored array.

## Edge cases

- Single element: `[5] -> diff [5] -> restored [5]`.
- No change between neighbors: `[7, 7] -> diff [7, 0]`.
- Negative change: `[10, 4] -> diff [10, -6]`.

## Common mistakes

- Returning `diff` as the final answer.
- Forgetting `diff[0]` is the anchor.
- Double-counting `diff[0]` by starting `running` at `diff[0]` and adding it again.
- Using subtraction during restore.
- Using `end` instead of `end + 1` for an inclusive range stop mark.

---

# Bridge to Problem 2: array indexes become years

What stays the same:

- We still store changes first.
- We still scan from left to right with a running total.

What changes:

- Indexes now represent years.
- The alive interval is `[birth, death - 1]`, so the stop mark is at `death`, not `death + 1`.

Artifact that carries forward:

- The change list. Birth is a `+1` change, death is a `-1` change.

---

# Problem 2: LeetCode 1854, Maximum Population Year

## Metadata

- Practice type: **Try**
- Difficulty: Easy
- Source: <https://leetcode.com/problems/maximum-population-year/description/>
- Concept focus: population changes as year-by-year deltas.
- CoderPad expectation: students try after the instructor bridge.

## Problem statement

Given logs where each row is `[birth, death]`, return the earliest year with the maximum population.

A person is alive from `birth` through `death - 1`. The death year is excluded.

## Input

```text
logs: int[][]
```

Sample 1:

```text
logs = [[1993,1999],[2000,2010]]
```

## Output

```text
1993
```

Sample 2:

```text
logs = [[1950,1961],[1960,1971],[1970,1981]]
```

Output:

```text
1960
```

## Concept before problem

- Birth adds `+1`. Example: birth 1960 means `diff[1960 - 1950] += 1`.
- Death adds `-1`. Example: death 1971 means `diff[1971 - 1950] -= 1`.
- Prefix sum gives current population.
- Scan years in increasing order.
- Return the earliest year when multiple years tie by updating only when `current > best`.

## Real-world context

Imagine a small town ledger. Instead of recounting every person for every year, we record only when the population changes:

```text
birth -> +1
death -> -1
```

Then one scan tells us the population in each year.

## Beginner hint

Use an offset:

```text
index = year - 1950
```

Examples:

```text
1950 -> 0
1960 -> 10
2050 -> 100
```

Do not use `death + 1` here. The death year itself is already excluded.

## Apply concept

For:

```text
logs = [[1950,1961],[1960,1971],[1970,1981]]
```

Boundary marks:

```text
[1950,1961]: diff[0] += 1, diff[11] -= 1
[1960,1971]: diff[10] += 1, diff[21] -= 1
[1970,1981]: diff[20] += 1, diff[31] -= 1
```

During the scan:

```text
1950 -> current = 1
1960 -> current = 2, best year = 1960
1970 -> current = 2, tied with best, keep 1960
```

## Java solution

```java
class Solution {
    public int maximumPopulation(int[][] logs) {
        int startYear = 1950;
        int endYear = 2050;

        // +2 gives a safe sentinel slot for the death mark at 2050.
        int[] diff = new int[endYear - startYear + 2];

        for (int[] log : logs) {
            int birth = log[0];
            int death = log[1];

            // Birth year is included.
            diff[birth - startYear] += 1;

            // Death year is excluded, so subtract at death.
            diff[death - startYear] -= 1;
        }

        int current = 0;
        int best = -1;
        int answer = startYear;

        for (int year = startYear; year <= endYear; year++) {
            current += diff[year - startYear];

            // Strict > preserves the earliest year during ties.
            if (current > best) {
                best = current;
                answer = year;
            }
        }

        return answer;
    }
}
```

## Python comparison

```python
class Solution:
    def maximumPopulation(self, logs: list[list[int]]) -> int:
        start_year = 1950
        end_year = 2050
        diff = [0] * (end_year - start_year + 2)

        for birth, death in logs:
            diff[birth - start_year] += 1
            diff[death - start_year] -= 1

        current = 0
        best = -1
        answer = start_year

        for year in range(start_year, end_year + 1):
            current += diff[year - start_year]
            if current > best:
                best = current
                answer = year

        return answer
```

## ASCII trace

```text
logs = [[1950,1961],[1960,1971],[1970,1981]]
1950: +1 starts first person
1960: +1 starts second person -> population 2
1961: -1 stops first person -> population 1
1970: +1 starts third person -> population 2
1971: -1 stops second person -> population 1
1981: -1 stops third person -> population 0
maximum population is 2, earliest year is 1960
```

## Complexity

- Time: `O(n + 101)` where `n` is the number of logs.
- Space: `O(101)` for the fixed year range, with a sentinel-safe array.

## Edge cases

- A person dies the year after birth: `[2000, 2001]` counts only 2000.
- Many years tie: scanning upward and using strict `>` keeps the earliest year.
- Death at 2050: the sentinel-safe array can store the stop mark.

## Common mistakes

- Counting a person in their death year.
- Using `death + 1` instead of `death`.
- Updating the answer on equal population and losing the earliest year.
- Forgetting the `year - 1950` offset.

---

# Bridge to Problem 3: one light becomes one clipped range update

What stays the same:

- We still place a start mark and a stop mark.
- We still rebuild actual values with prefix sum.

What changes:

- Each light covers a clipped interval of parking spots.
- Parking spots are numbered `1` through `N`, so 1-indexing is natural.

Artifact that carries forward:

- A boundary-mark diff array. One light over `[left, right]` becomes:

```text
diff[left] += 1
diff[right + 1] -= 1
```

`right` is the last included parking spot.

---

# Problem 3: CCC 2026 S2, Beams of Light

## Metadata

- Practice type: **Solve**
- Difficulty: Easy-to-Medium
- Source: <https://dmoj.ca/problem/ccc26s2>
- Concept focus: clipped 1D range coverage.
- CoderPad expectation: students solve.

## Problem statement

Parking spots are numbered `1` through `N`. Each light has position `P` and spread `S`.

A light illuminates:

```text
left = max(P - S, 1)
right = min(P + S, N)
```

Each light adds one beam of coverage over `[left, right]`. For each query spot, print `Y` if it is illuminated by at least one light; otherwise print `N`.

## Input

```text
N
L
Q
P1 S1
P2 S2
...
PL SL
query1
query2
...
queryQ
```

Required sample input:

```text
10
3
4
8 0
1 1
4 2
4
10
7
1
```

## Output

Required sample output:

```text
Y
N
N
Y
```

## Concept before problem

- Define the interval before marking it.
- Example `P = 4`, `S = 2`, `N = 10` gives `left = 2`, `right = 6`.
- Each light adds coverage over an inclusive interval.
- Use boundary marks:

  ```text
  diff[left] += 1
  diff[right + 1] -= 1
  ```

- Prefix sum creates `coverage[spot]`.
- Query prints `Y` if `coverage[spot] > 0`, otherwise `N`.

## Real-world context

A direct solution would walk every spot under every light. If a light covers 400,001 spots, that is 400,001 writes for one light.

The difference-array solution does two writes per light:

```text
start coverage
stop coverage after the last included spot
```

Then it builds coverage once.

## Beginner hint

Use 1-indexing and allocate a sentinel:

```java
int[] diff = new int[N + 2];
```

That makes `diff[right + 1]` safe even when `right = N`.

## Apply concept

Sample lights:

```text
8 0 -> left = 8, right = 8 -> diff[8] += 1, diff[9] -= 1
1 1 -> left = 1, right = 2 -> diff[1] += 1, diff[3] -= 1
4 2 -> left = 2, right = 6 -> diff[2] += 1, diff[7] -= 1
```

After rebuilding coverage:

```text
spots 1, 2, 3, 4, 5, 6, and 8 are lit
spots 7, 9, and 10 are not lit
```

Queries:

```text
4  -> Y
10 -> N
7  -> N
1  -> Y
```

## Java solution

```java
import java.io.BufferedInputStream;
import java.io.IOException;

public class Main {
    private static class FastScanner {
        private final BufferedInputStream input = new BufferedInputStream(System.in);
        private final byte[] buffer = new byte[1 << 16];
        private int pointer = 0;
        private int length = 0;

        private int read() throws IOException {
            if (pointer >= length) {
                length = input.read(buffer);
                pointer = 0;
                if (length <= 0) return -1;
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

        // 1-indexed spots plus one sentinel slot for right + 1.
        int[] diff = new int[n + 2];

        for (int i = 0; i < lights; i++) {
            int position = scanner.nextInt();
            int spread = scanner.nextInt();

            int left = Math.max(position - spread, 1);
            int right = Math.min(position + spread, n);

            // The light covers [left, right], where right is the last included spot.
            diff[left] += 1;
            diff[right + 1] -= 1;
        }

        int[] coverage = new int[n + 1];
        int running = 0;

        for (int spot = 1; spot <= n; spot++) {
            running += diff[spot];
            coverage[spot] = running;
        }

        StringBuilder output = new StringBuilder();
        for (int i = 0; i < questions; i++) {
            int spot = scanner.nextInt();
            output.append(coverage[spot] > 0 ? 'Y' : 'N').append('\n');
        }

        System.out.print(output.toString());
    }
}
```

## Python comparison

```python
import sys

def solve() -> None:
    data = list(map(int, sys.stdin.buffer.read().split()))
    index = 0

    n = data[index]
    index += 1
    lights = data[index]
    index += 1
    questions = data[index]
    index += 1

    diff = [0] * (n + 2)

    for _ in range(lights):
        position = data[index]
        spread = data[index + 1]
        index += 2

        left = max(position - spread, 1)
        right = min(position + spread, n)

        diff[left] += 1
        diff[right + 1] -= 1

    coverage = [0] * (n + 1)
    running = 0
    for spot in range(1, n + 1):
        running += diff[spot]
        coverage[spot] = running

    answers = []
    for _ in range(questions):
        spot = data[index]
        index += 1
        answers.append("Y" if coverage[spot] > 0 else "N")

    print("\n".join(answers))
```

## ASCII trace

```text
N = 10
light 8 0 -> [8, 8]
light 1 1 -> [1, 2]
light 4 2 -> [2, 6]
coverage: 1:Y 2:Y 3:Y 4:Y 5:Y 6:Y 7:N 8:Y 9:N 10:N
query 4 -> Y
query 10 -> N
query 7 -> N
query 1 -> Y
```

## Complexity

- Time: `O(N + L + Q)`.
- Space: `O(N)`.

## Edge cases

- A light at the far left: clip `left` to 1.
- A light at the far right: clip `right` to `N`.
- Spread 0: the light covers only its own position.
- Multiple lights over the same spot: coverage can be greater than 1, but the query only cares whether it is greater than 0.

## Common mistakes

- Reading input in the wrong order. The order is `N`, then `L`, then `Q`.
- Forgetting to clip the interval.
- Forgetting `right` is the last included spot before using `right + 1`.
- Rebuilding coverage separately for every query.
- Printing anything other than one `Y` or `N` per line.

---

# Bridge to Problem 4: dense arrays become sparse event maps

What stays the same:

- Starts add demand.
- Ends remove demand.
- A left-to-right scan rebuilds active demand.

What changes:

- Times may be large or sparse, so a `TreeMap<Integer, Integer>` is cleaner than a giant array.
- A meeting ending at time `t` frees a room for another meeting starting at time `t`.

Artifact that carries forward:

- A change map. It is a sparse difference array over sorted times.

---

# Problem 4: LeetCode Meeting Rooms II

## Metadata

- Practice type: **Try**
- Difficulty: Medium
- Source: <https://leetcode.com/problems/meeting-rooms-ii/>
- Concept focus: sparse event deltas for active meeting demand.
- CoderPad expectation: students try after the instructor bridge.

## Problem statement

Given meeting intervals, return the minimum number of conference rooms required.

The answer equals the peak number of active meetings at the same time.

## Input

```text
intervals: int[][]
```

Sample 1:

```text
intervals = [[0,30], [5,10], [15,20]]
```

Output:

```text
2
```

Sample 2:

```text
intervals = [[7,10], [2,4]]
```

Output:

```text
1
```

## Concept before problem

- A meeting start adds demand: `delta[start] += 1`.
- A meeting end removes demand: `delta[end] -= 1`.
- Scan times in sorted order.
- Track `active` meetings and `maxRooms`.
- A meeting ending at time `t` frees a room for a meeting starting at time `t`.

## Real-world context

Imagine a room scheduler:

```text
start time -> one more room needed
end time   -> one room freed
```

We only care about the times where room demand changes.

## Beginner hint

Use a sparse difference map:

```java
TreeMap<Integer, Integer> delta = new TreeMap<>();
```

For `[start, end]`:

```text
delta[start] += 1
delta[end] -= 1
```

If one meeting ends at 4 and another starts at 4, the combined delta at 4 may be `-1 + 1 = 0`, so no extra room is needed.

## Apply concept

For:

```text
[[0,30], [5,10], [15,20]]
```

Deltas:

```text
0: +1
5: +1
10: -1
15: +1
20: -1
30: -1
```

Sorted scan:

```text
time 0  -> active 1, max 1
time 5  -> active 2, max 2
time 10 -> active 1, max 2
time 15 -> active 2, max 2
time 20 -> active 1, max 2
time 30 -> active 0, max 2
```

Answer: `2`.

## Java solution

```java
import java.util.Map;
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
            active += event.getValue();
            maxRooms = Math.max(maxRooms, active);
        }

        return maxRooms;
    }
}
```

## Python comparison

```python
from collections import defaultdict

def min_meeting_rooms(intervals: list[list[int]]) -> int:
    delta = defaultdict(int)

    for start, end in intervals:
        delta[start] += 1
        delta[end] -= 1

    active = 0
    max_rooms = 0

    for time in sorted(delta):
        active += delta[time]
        max_rooms = max(max_rooms, active)

    return max_rooms
```

## ASCII trace

```text
intervals = [[0,30], [5,10], [15,20]]
0:  +1 -> active = 1, maxRooms = 1
5:  +1 -> active = 2, maxRooms = 2
10: -1 -> active = 1, maxRooms = 2
15: +1 -> active = 2, maxRooms = 2
20: -1 -> active = 1, maxRooms = 2
30: -1 -> active = 0, maxRooms = 2
answer = 2
```

Same-time reuse trace:

```text
[2,4] and [4,7]
delta[2] += 1
delta[4] -= 1
delta[4] += 1
delta[7] -= 1
combined delta[4] = 0
max active = 1
```

## Complexity

- Time: `O(n log n)` because each map update and sorted scan depends on ordered keys.
- Space: `O(n)` for the event deltas.

## Edge cases

- Back-to-back meetings: `[0, 10]` and `[10, 20]` need one room.
- Many meetings start at the same time: deltas combine into a larger positive value.
- Many meetings end at the same time: deltas combine into a larger negative value.
- The final active count should be 0, but the answer is the maximum active count seen earlier.

## Common mistakes

- Treating same-time end/start as a conflict.
- Forgetting to aggregate deltas at the same time.
- Returning final `active` instead of `maxRooms`.
- Using a dense array when time values are sparse.

---

# Closing summary

All four problems use the same core pattern:

| Problem | What stays the same | What changes |
|---|---|---|
| 1D Difference Build + Restore | diff stores changes, prefix sum restores values | we build from an existing original array |
| Maximum Population Year | starts and stops become deltas | indexes are years; death year is excluded |
| Beams of Light | inclusive ranges use two boundary marks | intervals must be clipped to parking spots `1..N` |
| Meeting Rooms II | event deltas use a running active count | a sparse sorted map replaces a dense array |

Final phrase to repeat:

```text
Store changes first. Rebuild values later.
```

## Instructor notes

- Keep Java primary. Let Python appear only as a comparison after students understand the Java logic.
- Require exact operation language: “add `+3` to `diff[1]`” and “add `-3` to `diff[4]`.”
- Before every range update, ask students to state `start`, `end`, and `delta`.
- Before every `end + 1`, ask students to say, “`end` is the last included index.”
- Between problems, explicitly name what stays the same, what changes, and what mental artifact carries forward.
- Watch for these recurring bugs: returning a diff array as final values, counting an excluded endpoint, missing clipping, and returning final active count instead of peak active count.
