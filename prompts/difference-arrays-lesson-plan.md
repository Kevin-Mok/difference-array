# Title

**Difference Arrays: Mark Change, Then Rebuild**

# Audience

Students should already know:

- arrays or lists
- loops
- zero-based indexes
- simple prefix sums / running totals

Students do **not** need advanced data structures. This lesson stays focused on beginner-friendly change arrays, prefix restoration, and event sweeps.

# Learning Goals

By the end of this lesson, students can:

- explain that a difference array stores **changes**, not final values
- build a 1D difference array from an original array
- restore an original 1D array from a difference array with a running total
- define a `range update` as adding or subtracting a value across one continuous index range
- define `delta` as the amount of change added at an event or boundary
- define a `boundary mark` as a change recorded where an update starts or stops
- use a prefix sum as the reverse operation that rebuilds values from stored changes
- build and restore a 2D difference matrix using above, left, and diagonal cells
- handle 2D boundary cases for `(0,0)`, first row, first column, and inner cells
- explain line sweep as sorted event processing with an active count
- sort line sweep start events before end events at the same coordinate for closed intervals

# Opening Theory

A difference array changes the question from:

```text
What is the final value at every position?
```

to:

```text
What changed at this position compared with the previous one?
```

For a 1D array:

```text
diff[0] = nums[0]
diff[i] = nums[i] - nums[i - 1]
```

The reverse operation is a prefix sum:

```text
running += diff[i]
restored[i] = running
```

So the core phrase is:

```text
diff stores changes.
prefix sum restores values.
```

This same idea grows into 2D restoration, and then into line sweep, where start and end points become sorted change events.

# Problem 1: 1D difference + restore

**Title:** Restore from a 1D Difference Array  
**Difficulty:** Easy  
**Concept Focus:** Build original -> diff, then reverse diff -> original

## concept-before

First, build the difference array from an original array.

```text
original nums = [4, 7, 7, 10]
```

The difference array stores what changed:

```text
diff[0] = nums[0] = 4
diff[1] = nums[1] - nums[0] = 7 - 4 = 3
diff[2] = nums[2] - nums[1] = 7 - 7 = 0
diff[3] = nums[3] - nums[2] = 10 - 7 = 3
```

So:

```text
original -> diff
[4, 7, 7, 10] -> [4, 3, 0, 3]
```

Now reverse it. Add each change into a running total:

```text
running values: 4, 7, 7, 10
```

So:

```text
diff -> restored original
[4, 3, 0, 3] -> [4, 7, 7, 10]
```

## real-world context

Imagine a daily step-count report:

```text
steps = [1200, 1300, 1300, 1500]
```

Instead of storing every full value, describe the changes:

```text
start at 1200
then +100
then +0
then +200
```

The change list is the difference array. Running total restores the original step counts.

## problem statement

Given a non-empty 1D difference array `diff`, return the restored original array.

Also be ready to prove the inverse:

```text
original -> diff -> restored original
```

Use this sample relationship:

```text
original = [4, 7, 7, 10]
diff     = [4, 3, 0, 3]
restored = [4, 7, 7, 10]
```

## beginner hint

At every index, ask:

```text
What is the running total after adding this change?
```

Do not return `diff` directly. `diff` stores changes. The restored array stores actual values.

## apply concept

Build check:

```text
nums   = [4, 7, 7, 10]
diff   = [4, 3, 0, 3]
```

Reverse restore:

```text
start running = 0
index 0: running = 0 + 4  = 4
index 1: running = 4 + 3  = 7
index 2: running = 7 + 0  = 7
index 3: running = 7 + 3  = 10
```

Result:

```text
restored = [4, 7, 7, 10]
```

Reverse-to-build check:

```text
buildDifference([4, 7, 7, 10]) = [4, 3, 0, 3]
```

The check matches the input `diff`.

## input

```text
diff: int[]
```

## output

```text
int[] restored
```

## sample input

```text
diff = [4, 3, 0, 3]
```

## sample output

```text
[4, 7, 7, 10]
```

## step-by-step explanation

1. Create `restored` with the same length as `diff`.
2. Set `running = 0`.
3. Scan left to right.
4. Add the current change: `running += diff[i]`.
5. Store the current value: `restored[i] = running`.
6. Return `restored`.
7. Optional check: build a new diff from `restored` and confirm it equals the input.

## Java solution

```java
import java.util.Arrays;

public class DifferenceArray1D {
    public static int[] restoreFromDifference(int[] diff) {
        int[] restored = new int[diff.length];
        int running = 0;

        for (int i = 0; i < diff.length; i++) {
            // Add the stored change at this index.
            running += diff[i];

            // The running total is the restored original value.
            restored[i] = running;
        }

        return restored;
    }

    public static int[] buildDifference(int[] nums) {
        int[] diff = new int[nums.length];

        // diff[0] stores the first actual value as the starting anchor.
        diff[0] = nums[0];

        for (int i = 1; i < nums.length; i++) {
            // Each later diff value stores the change from the previous number.
            diff[i] = nums[i] - nums[i - 1];
        }

        return diff;
    }

    public static boolean roundTripCheck(int[] nums) {
        int[] diff = buildDifference(nums);
        int[] restored = restoreFromDifference(diff);
        return Arrays.equals(nums, restored);
    }
}
```

## Python solution

```python
def restore_from_difference(diff: list[int]) -> list[int]:
    restored = [0] * len(diff)
    running = 0

    for i, change in enumerate(diff):
        # Add the stored change.
        running += change
        # The running total is the restored value.
        restored[i] = running

    return restored


def build_difference(nums: list[int]) -> list[int]:
    diff = [0] * len(nums)
    diff[0] = nums[0]

    for i in range(1, len(nums)):
        diff[i] = nums[i] - nums[i - 1]

    return diff


def round_trip_check(nums: list[int]) -> bool:
    return restore_from_difference(build_difference(nums)) == nums
```

## ASCII trace

```text
$ diff = [4, 3, 0, 3]

running starts at 0

index 0: running = 0 + 4 = 4
restored = [4, _, _, _]

index 1: running = 4 + 3 = 7
restored = [4, 7, _, _]

index 2: running = 7 + 0 = 7
restored = [4, 7, 7, _]

index 3: running = 7 + 3 = 10
restored = [4, 7, 7, 10]

answer = [4, 7, 7, 10]
```

## time complexity

`O(n)`, where `n` is the length of `diff`.

Each position is visited once.

## space complexity

`O(n)` for the restored output array.

## common mistakes

- Returning `diff` instead of rebuilding the values.
- Forgetting that `diff[0]` is the first actual value.
- Starting with `running = diff[0]` and then also adding `diff[0]` again.
- Thinking restore means subtracting; restore means adding changes into a running total.

# Problem 2: 2D difference + restore

**Title:** Restore from a 2D Difference Matrix  
**Difficulty:** Easy  
**Concept Focus:** Build and reverse a 2D difference matrix with boundary cases

## concept-before

A 2D difference matrix is the grid version of storing changes.

For an inner cell, the forward formula is:

```text
diff[r][c] = A[r][c] - A[r-1][c] - A[r][c-1] + A[r-1][c-1]
```

The reverse formula is:

```text
A[r][c] = diff[r][c] + A[r-1][c] + A[r][c-1] - A[r-1][c-1]
```

Names around cell `(r,c)`:

```text
A[r-1][c-1] = above-left diagonal
A[r-1][c]   = above
A[r][c-1]   = left
A[r][c]     = current cell being restored
```

Visual:

```text
                 above
                  |
                  v
+----------------+----------------+
| diagonal       | A[r-1][c]      |
| A[r-1][c-1]    |                |
+----------------+----------------+
| left           | current        |
| A[r][c-1]      | A[r][c]        |
+----------------+----------------+
```

Why subtract the diagonal in the reverse formula?

```text
above includes the diagonal area.
left also includes the diagonal area.
So diagonal got counted twice.
Subtract it once.
```

Boundary cases:

```text
(0,0):        A[0][0] = diff[0][0]
first row:    A[0][c] = diff[0][c] + A[0][c-1]
first column: A[r][0] = diff[r][0] + A[r-1][0]
inner cells:  A[r][c] = diff[r][c] + above + left - diagonal
```

## real-world context

Imagine a city-grid heatmap.

Each restored cell tells the total activity accumulated from the top-left corner to that cell.

The difference matrix stores only the local change needed at each cell. Prefix restoration rebuilds the full heatmap.

## problem statement

Given a non-empty 2D difference matrix `diff`, return the restored matrix `A`.

You must handle all four cases:

```text
(0,0)
first row
first column
inner matrix cells
```

Also show that the sample works in both directions:

```text
original matrix -> difference matrix -> restored original matrix
```

## beginner hint

Fill the restored matrix row by row.

At each cell, ask which neighbors exist:

```text
above?    only if r > 0
left?     only if c > 0
diagonal? only if r > 0 and c > 0
```

Then use the correct boundary case.

## apply concept

Original matrix:

```text
A =
[[1, 3, 6],
 [2, 6, 10],
 [5, 12, 20]]
```

Forward build to difference matrix:

```text
D[0][0] = 1
D[0][1] = 3 - 1 = 2
D[0][2] = 6 - 3 = 3

D[1][0] = 2 - 1 = 1
D[1][1] = 6 - 3 - 2 + 1 = 2
D[1][2] = 10 - 6 - 6 + 3 = 1

D[2][0] = 5 - 2 = 3
D[2][1] = 12 - 6 - 5 + 2 = 3
D[2][2] = 20 - 10 - 12 + 6 = 4
```

So:

```text
D =
[[1, 2, 3],
 [1, 2, 1],
 [3, 3, 4]]
```

Reverse restore from `D`:

```text
A[0][0] = 1
A[0][1] = 2 + 1 = 3
A[0][2] = 3 + 3 = 6

A[1][0] = 1 + 1 = 2
A[1][1] = 2 + 3 + 2 - 1 = 6
A[1][2] = 1 + 6 + 6 - 3 = 10

A[2][0] = 3 + 2 = 5
A[2][1] = 3 + 6 + 5 - 2 = 12
A[2][2] = 4 + 10 + 12 - 6 = 20
```

Restored matrix:

```text
[[1, 3, 6],
 [2, 6, 10],
 [5, 12, 20]]
```

## input

```text
diff: int[][]
```

## output

```text
int[][] restored
```

## sample input

```text
diff = [[1, 2, 3], [1, 2, 1], [3, 3, 4]]
```

## sample output

```text
[[1, 3, 6], [2, 6, 10], [5, 12, 20]]
```

## step-by-step explanation

1. Create `restored` with the same number of rows and columns as `diff`.
2. Loop through every cell row by row.
3. If the cell is `(0,0)`, copy `diff[0][0]`.
4. If the cell is in the first row, add only the left restored value.
5. If the cell is in the first column, add only the above restored value.
6. If the cell is inner, add above and left, then subtract the diagonal.
7. Return `restored`.
8. Optional check: build the 2D difference matrix from `restored` and confirm it matches the input `diff`.

## Java solution

```java
import java.util.Arrays;

public class DifferenceArray2D {
    public static int[][] restoreFromDifference(int[][] diff) {
        int rows = diff.length;
        int cols = diff[0].length;
        int[][] restored = new int[rows][cols];

        for (int r = 0; r < rows; r++) {
            for (int c = 0; c < cols; c++) {
                if (r == 0 && c == 0) {
                    // (0,0): no above, no left, no diagonal.
                    restored[r][c] = diff[r][c];
                } else if (r == 0) {
                    // First row: only the left restored cell exists.
                    restored[r][c] = diff[r][c] + restored[r][c - 1];
                } else if (c == 0) {
                    // First column: only the above restored cell exists.
                    restored[r][c] = diff[r][c] + restored[r - 1][c];
                } else {
                    // Inner cell: add above and left, then remove double-counted diagonal.
                    restored[r][c] = diff[r][c]
                            + restored[r - 1][c]
                            + restored[r][c - 1]
                            - restored[r - 1][c - 1];
                }
            }
        }

        return restored;
    }

    public static int[][] buildDifference(int[][] A) {
        int rows = A.length;
        int cols = A[0].length;
        int[][] diff = new int[rows][cols];

        for (int r = 0; r < rows; r++) {
            for (int c = 0; c < cols; c++) {
                if (r == 0 && c == 0) {
                    // (0,0): first value is the anchor.
                    diff[r][c] = A[r][c];
                } else if (r == 0) {
                    // First row: subtract the left value.
                    diff[r][c] = A[r][c] - A[r][c - 1];
                } else if (c == 0) {
                    // First column: subtract the above value.
                    diff[r][c] = A[r][c] - A[r - 1][c];
                } else {
                    // Inner cell: remove above and left, then add diagonal back once.
                    diff[r][c] = A[r][c]
                            - A[r - 1][c]
                            - A[r][c - 1]
                            + A[r - 1][c - 1];
                }
            }
        }

        return diff;
    }

    public static boolean roundTripCheck(int[][] A) {
        int[][] diff = buildDifference(A);
        int[][] restored = restoreFromDifference(diff);
        return Arrays.deepEquals(A, restored);
    }
}
```

## Python solution

```python
def restore_from_difference(diff: list[list[int]]) -> list[list[int]]:
    rows, cols = len(diff), len(diff[0])
    restored = [[0] * cols for _ in range(rows)]

    for r in range(rows):
        for c in range(cols):
            if r == 0 and c == 0:
                restored[r][c] = diff[r][c]
            elif r == 0:
                restored[r][c] = diff[r][c] + restored[r][c - 1]
            elif c == 0:
                restored[r][c] = diff[r][c] + restored[r - 1][c]
            else:
                restored[r][c] = (
                    diff[r][c]
                    + restored[r - 1][c]
                    + restored[r][c - 1]
                    - restored[r - 1][c - 1]
                )

    return restored


def build_difference(A: list[list[int]]) -> list[list[int]]:
    rows, cols = len(A), len(A[0])
    diff = [[0] * cols for _ in range(rows)]

    for r in range(rows):
        for c in range(cols):
            if r == 0 and c == 0:
                diff[r][c] = A[r][c]
            elif r == 0:
                diff[r][c] = A[r][c] - A[r][c - 1]
            elif c == 0:
                diff[r][c] = A[r][c] - A[r - 1][c]
            else:
                diff[r][c] = A[r][c] - A[r - 1][c] - A[r][c - 1] + A[r - 1][c - 1]

    return diff


def round_trip_check(A: list[list[int]]) -> bool:
    return restore_from_difference(build_difference(A)) == A
```

## ASCII trace

```text
$ diff =
  [[1, 2, 3],
   [1, 2, 1],
   [3, 3, 4]]

(0,0):
A[0][0] = 1

first row:
A[0][1] = 2 + A[0][0] = 2 + 1 = 3
A[0][2] = 3 + A[0][1] = 3 + 3 = 6

first column:
A[1][0] = 1 + A[0][0] = 1 + 1 = 2
A[2][0] = 3 + A[1][0] = 3 + 2 = 5

inner cells:
A[1][1] = 2 + above(3) + left(2) - diagonal(1) = 6
A[1][2] = 1 + above(6) + left(6) - diagonal(3) = 10
A[2][1] = 3 + above(6) + left(5) - diagonal(2) = 12
A[2][2] = 4 + above(10) + left(12) - diagonal(6) = 20

answer =
[[1, 3, 6],
 [2, 6, 10],
 [5, 12, 20]]
```

## time complexity

`O(r * c)`, where `r` is the number of rows and `c` is the number of columns.

Each matrix cell is visited once.

## space complexity

`O(r * c)` for the restored output matrix.

## common mistakes

- Forgetting the special `(0,0)` case.
- Using the inner-cell formula on the first row or first column.
- Adding the diagonal instead of subtracting it during restoration.
- Forgetting that the diagonal was counted twice by above and left.
- Mixing up row and column indexes.

# Problem 3: Line Sweep max-overlap intro

**Title:** Maximum Overlapping Intervals  
**Difficulty:** Easy  
**Concept Focus:** Convert intervals into sorted events and track active overlap

## concept-before

Line sweep is a way of thinking:

```text
Move across coordinates in sorted order.
Only act when something changes.
```

For intervals, the changes are events:

```text
(start, +1) means one interval becomes active.
(end, -1) means one interval ends.
```

The `+1` or `-1` is the `delta`.

For this problem, intervals are **closed**:

```text
[start, end]
```

So if one interval ends at coordinate `4` and another starts at coordinate `4`, they overlap at that exact coordinate.

Tie rule:

```text
same coordinate -> process start events before end events
```

That means `+1` comes before `-1` when sorting events with the same coordinate.

## real-world context

Think of customers in a cafe:

```text
Customer A: 1 to 4
Customer B: 2 to 6
Customer C: 4 to 7
Customer D: 4 to 5
Customer E: 5 to 8
```

We want the maximum number of customers inside at the same time.

Arrivals are `+1`. Departures are `-1`.

## problem statement

Given a list of inclusive intervals `[start, end]`, return the maximum number of overlapping intervals.

Use line sweep:

1. Convert intervals into start and end events.
2. Sort events by coordinate.
3. For ties, process starts before ends.
4. Sweep left to right with an active count.

## beginner hint

Turn each interval into two rows:

```text
[start, +1]
[end, -1]
```

Then sort.

During the sweep:

```text
active += delta
maxActive = max(maxActive, active)
```

## apply concept

Intervals:

```text
[[1,4], [2,6], [4,7], [4,5], [5,8]]
```

Events before sorting:

```text
(1,+1), (4,-1)
(2,+1), (6,-1)
(4,+1), (7,-1)
(4,+1), (5,-1)
(5,+1), (8,-1)
```

Sorted events with start-before-end ties:

```text
(1,+1)
(2,+1)
(4,+1)
(4,+1)
(4,-1)
(5,+1)
(5,-1)
(6,-1)
(7,-1)
(8,-1)
```

Sweep:

```text
1:+1 -> active 1, max 1
2:+1 -> active 2, max 2
4:+1 -> active 3, max 3
4:+1 -> active 4, max 4
4:-1 -> active 3, max 4
5:+1 -> active 4, max 4
5:-1 -> active 3, max 4
6:-1 -> active 2, max 4
7:-1 -> active 1, max 4
8:-1 -> active 0, max 4
```

Answer:

```text
4
```

## input

```text
intervals: int[][]
```

## output

```text
int maximumOverlap
```

## sample input

```text
intervals = [[1,4], [2,6], [4,7], [4,5], [5,8]]
```

## sample output

```text
4
```

## step-by-step explanation

1. Create an empty `events` list.
2. For every interval `[start, end]`, add `(start, +1)` and `(end, -1)`.
3. Sort by coordinate ascending.
4. If coordinates tie, sort `+1` before `-1`.
5. Scan the sorted events.
6. Add each event delta into `active`.
7. Update `maxActive` after each event.
8. Return `maxActive`.

## Java solution

```java
import java.util.ArrayList;
import java.util.List;

public class LineSweepMaxOverlap {
    public static int maxOverlap(int[][] intervals) {
        List<int[]> events = new ArrayList<>();

        for (int[] interval : intervals) {
            int start = interval[0];
            int end = interval[1];

            // Start event: this interval becomes active.
            events.add(new int[]{start, 1});

            // End event: this interval stops being active after this point is counted.
            events.add(new int[]{end, -1});
        }

        events.sort((a, b) -> {
            if (a[0] != b[0]) {
                // Smaller coordinate is processed first.
                return Integer.compare(a[0], b[0]);
            }

            // Same coordinate: +1 before -1 for closed intervals.
            return Integer.compare(b[1], a[1]);
        });

        int active = 0;
        int maxActive = 0;

        for (int[] event : events) {
            // Apply the event's delta to the active interval count.
            active += event[1];

            // Capture the highest active count seen so far.
            maxActive = Math.max(maxActive, active);
        }

        return maxActive;
    }
}
```

## Python solution

```python
def max_overlap(intervals: list[list[int]]) -> int:
    events = []

    for start, end in intervals:
        events.append((start, 1))
        events.append((end, -1))

    # Sort by coordinate, then put +1 before -1 at the same coordinate.
    events.sort(key=lambda event: (event[0], -event[1]))

    active = 0
    max_active = 0

    for _coord, delta in events:
        active += delta
        max_active = max(max_active, active)

    return max_active
```

## ASCII trace

```text
sorted events:
(1,+1), (2,+1), (4,+1), (4,+1), (4,-1),
(5,+1), (5,-1), (6,-1), (7,-1), (8,-1)

active starts at 0

(1,+1): active 0 -> 1, max = 1
(2,+1): active 1 -> 2, max = 2
(4,+1): active 2 -> 3, max = 3
(4,+1): active 3 -> 4, max = 4
(4,-1): active 4 -> 3, max = 4
(5,+1): active 3 -> 4, max = 4
(5,-1): active 4 -> 3, max = 4
(6,-1): active 3 -> 2, max = 4
(7,-1): active 2 -> 1, max = 4
(8,-1): active 1 -> 0, max = 4

answer = 4
```

## time complexity

`O(n log n)`, where `n` is the number of intervals.

There are `2n` events, and sorting dominates the runtime.

## space complexity

`O(n)` for the event list.

## common mistakes

- Processing end events before start events at the same coordinate for closed intervals.
- Forgetting to state whether intervals are closed or half-open.
- Updating `maxActive` before applying the event delta.
- Sorting by delta only and ignoring coordinate order.
- Forgetting to add the end event for each interval.

# Closing Summary

The lesson connects three versions of the same idea:

```text
Store changes first.
Rebuild or sweep with a running total.
```

1D difference:

```text
diff[0] = nums[0]
diff[i] = nums[i] - nums[i - 1]
restored[i] = running sum of diff up to i
```

2D difference:

```text
diff[r][c] = A[r][c] - above - left + diagonal
A[r][c] = diff[r][c] + above + left - diagonal
```

Line sweep:

```text
start event = +1
end event = -1
sort by coordinate
same coordinate -> start before end
track max active
```

# Instructor Notes

## Suggested lesson rhythm

- Start with 1D original -> diff -> restored original.
- Keep asking: "Does this array store values or changes?"
- Move to 2D only after students are comfortable with prefix restoration.
- For 2D, draw the above, left, and diagonal cells before showing code.
- For line sweep, introduce it as an event version of change tracking.
- Keep all examples small enough to trace by hand.

## Teacher checks

Ask before revealing code:

```text
1) In 1D, what does diff[2] = 0 mean?
2) In 2D, why do we subtract the diagonal during restore?
3) In line sweep, why do starts come before ends at the same coordinate?
```

Expected answers:

```text
1) The value did not change from the previous index.
2) Above and left both include the diagonal, so it was counted twice.
3) Closed intervals share the endpoint, so the new start should count before the old end is removed.
```

## Common failure patterns to watch

- Students call `diff` the final answer instead of the change list.
- Students skip the first value anchor in 1D.
- Students use the inner 2D formula on boundary cells.
- Students forget the `- diagonal` part in 2D restoration.
- Students process line sweep ties in the wrong order.
- Students do not state the endpoint convention for intervals.

## Source alignment notes

- The 1D and 2D sections follow the requested build-and-reverse flow: create `diff`, then recover the original with prefix sums.
- The line sweep section uses the event model: sorted events, `delta` values, and an active count.
- The PDF notes are visual/low-text, so the transcript should be treated as the operational text source for Problem 3 when regenerating this lesson.
