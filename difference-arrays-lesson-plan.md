# Title

**Difference Arrays: Mark the Boundaries, Then Rebuild**

# Audience

Students should already know:

- arrays or lists
- loops
- zero-based indexes
- simple prefix sums / running totals

Students do **not** need advanced data structures. This lesson stays focused on beginner range updates, boundary marks, and prefix-sum rebuilding.

# Learning Goals

By the end of this lesson, students can:

- explain why repeated direct range updates can be slow
- define a `difference array` as an array that stores changes between neighboring positions
- define a `range update` as adding or subtracting a value across one continuous index range
- define `delta` as the amount of change being added
- define a `boundary mark` as a change recorded at the start of a range or just after the end of a range
- define a `prefix sum` as a running total used to rebuild final values from stored changes
- use `diff[start] += delta` and `diff[end + 1] -= delta` when `end + 1` is in bounds
- rebuild the final array using one left-to-right running total

# Opening Theory

Sometimes a problem asks us to update a whole range of an array.

A **range update** means: “add or subtract this amount across one continuous block of indexes.”

Example:

```text
Add +3 from index 1 through index 3.
```

The direct way is to visit every index in the range:

```text
array[1] += 3
array[2] += 3
array[3] += 3
```

That is fine for one tiny update. But if the array is large, and there are many updates, repeatedly changing every element can become slow. One update can take `O(n)` time in the worst case. Many updates can become `O(n * m)`, where `m` is the number of updates.

A **difference array** stores changes instead of final values.

For this lesson, we use a difference array with the same length as the final array:

```text
diff[0] = first value
diff[i] = current value - previous value
```

So if the final values are:

```text
nums = [4, 7, 7, 10]
```

Then the changes are:

```text
diff = [4, 3, 0, 3]
```

Read that as:

```text
start at 4
change by +3 to reach 7
change by 0 to stay 7
change by +3 to reach 10
```

A difference array is useful because a range update creates only two important changes:

1. The update **starts** at `start`.
2. The update **stops** just after `end`.

Those two changes are called **boundary marks**.

For a range update `[start, end, delta]`:

```text
diff[start] += delta
if end + 1 < n:
    diff[end + 1] -= delta
```

The `+delta` says: “start adding this amount here.”

The `-delta` says: “stop adding this amount after the range ends.”

After all boundary marks are recorded, a **prefix sum** rebuilds the final array. The running total carries active changes forward until a stop mark cancels them.

Tiny example:

```text
Start: [0, 0, 0, 0, 0]
Add +3 from index 1 through 3
Boundary idea:
  diff[1] += 3
  diff[4] -= 3
Prefix rebuild:
  [0, 3, 3, 3, 0]
```

Teacher check before moving on:

```text
What does diff store: final values or changes?
```

Expected answer:

```text
Changes.
```

# Problem 1

**Title:** Build the Change List  
**Difficulty:** Easy  
**Concept Focus:** Understand what a difference array stores

## Concept Before the Problem

Before using difference arrays for fast range updates, students need to understand what the array stores.

A difference array does **not** store the final values directly. It stores how much each value changed compared with the previous position.

For this beginner version:

```text
diff[0] = nums[0]
diff[i] = nums[i] - nums[i - 1]
```

The first value is kept because the prefix rebuild needs a starting point.

## Real-World Context

Imagine a short temperature log:

```text
[4, 7, 7, 10]
```

Instead of saying every temperature again, you can say:

```text
Start at 4, go up 3, stay the same, go up 3.
```

That “change list” is the difference array.

## Problem Statement

Given an integer array `nums`, return its difference array `diff`.

Use these rules:

```text
diff[0] = nums[0]
for every index i from 1 to n - 1:
    diff[i] = nums[i] - nums[i - 1]
```

Assume `nums` is non-empty.

## Beginner Hint

Do not copy the values into `diff`.

Ask this at every index after `0`:

```text
How much did the value change from the previous index?
```

## Apply the Concept

For:

```text
nums = [4, 7, 7, 10]
```

The difference array is:

```text
diff[0] = 4
diff[1] = 7 - 4 = 3
diff[2] = 7 - 7 = 0
diff[3] = 10 - 7 = 3
```

So:

```text
diff = [4, 3, 0, 3]
```

This means the original array can be rebuilt with a running total:

```text
4
4 + 3 = 7
7 + 0 = 7
7 + 3 = 10
```

## Input

```text
nums: int[]
```

## Output

```text
int[] diff
```

## Sample Input

```text
nums = [4, 7, 7, 10]
```

## Sample Output

```text
[4, 3, 0, 3]
```

## Step-by-Step Explanation

1. Create `diff` with the same length as `nums`.
2. Store the first value: `diff[0] = nums[0]`.
3. For each later index, subtract the previous value from the current value.
4. Return `diff`.
5. Remember: `diff` stores changes, not final values.

## Java Solution

```java
public static int[] buildDifferenceArray(int[] nums) {
    int[] diff = new int[nums.length];

    // The first value gives the prefix rebuild a starting point.
    diff[0] = nums[0];

    for (int index = 1; index < nums.length; index++) {
        diff[index] = nums[index] - nums[index - 1];
    }

    return diff;
}
```

## Python Solution

```python
def build_difference_array(nums: list[int]) -> list[int]:
    diff = [0] * len(nums)

    # The first value gives the prefix rebuild a starting point.
    diff[0] = nums[0]

    for index in range(1, len(nums)):
        diff[index] = nums[index] - nums[index - 1]

    return diff
```

## ASCII Trace

```text
$ nums = [4, 7, 7, 10]
> diff[0] = nums[0]
  diff = [4, 0, 0, 0]
> diff[1] = nums[1] - nums[0] = 7 - 4 = 3
  diff = [4, 3, 0, 0]
> diff[2] = nums[2] - nums[1] = 7 - 7 = 0
  diff = [4, 3, 0, 0]
> diff[3] = nums[3] - nums[2] = 10 - 7 = 3
  diff = [4, 3, 0, 3]
>= difference array [4, 3, 0, 3]
```

## Time Complexity

`O(n)`, where `n` is the length of `nums`.

Each index is visited once.

## Space Complexity

`O(n)` for the `diff` array.

## Common Mistakes

- Storing `nums[i]` instead of `nums[i] - nums[i - 1]`.
- Forgetting that `diff[0]` is the starting value.
- Starting the loop at index `0` and accidentally reading `nums[-1]` or `nums[index - 1]` before it exists.
- Thinking `diff` is the final answer values instead of the change values.

# Problem 2

**Title:** One Range Update With Boundary Marks  
**Difficulty:** Easy  
**Concept Focus:** Apply one range update and rebuild with prefix sums

## Concept Before the Problem

Now that students know `diff` stores changes, they can use it to record a range update cheaply.

Suppose we want to add `delta` from index `start` through index `end`, inclusive.

The direct way changes every index inside the range.

The difference-array way records only two boundary marks:

```text
diff[start] += delta
if end + 1 < n:
    diff[end + 1] -= delta
```

Think of it like a switch:

```text
+delta at start      -> turn the change on
-delta after end     -> turn the change off
```

Then a prefix sum carries the active change through the correct indexes.

## Real-World Context

Imagine five players start with `0` points:

```text
[0, 0, 0, 0, 0]
```

A bonus gives `+3` points to players at indexes `1` through `3`.

Instead of editing indexes `1`, `2`, and `3` one at a time, mark where the bonus starts and where it stops.

## Problem Statement

Given:

```text
n = 5
update = [1, 3, 3]
```

This means:

```text
add 3 from index 1 through index 3, inclusive
```

Return the final array after applying the update to a zero-filled array of length `n`.

## Beginner Hint

Use the update as:

```text
start = 1
end = 3
delta = 3
```

Mark the start first:

```text
diff[1] += 3
```

Then mark just after the end:

```text
diff[4] -= 3
```

Then rebuild with a running total.

## Apply the Concept

Start with:

```text
diff = [0, 0, 0, 0, 0]
```

Apply the boundary marks:

```text
diff[1] += 3  -> [0, 3, 0, 0, 0]
diff[4] -= 3  -> [0, 3, 0, 0, -3]
```

Now rebuild with prefix sums:

```text
index 0: running = 0      -> result[0] = 0
index 1: running = 0 + 3  -> result[1] = 3
index 2: running = 3 + 0  -> result[2] = 3
index 3: running = 3 + 0  -> result[3] = 3
index 4: running = 3 - 3  -> result[4] = 0
```

Final array:

```text
[0, 3, 3, 3, 0]
```

## Input

```text
n: int
update: int[] in the form [start, end, delta]
```

## Output

```text
int[] final values after the update
```

## Sample Input

```text
n = 5
update = [1, 3, 3]
```

## Sample Output

```text
[0, 3, 3, 3, 0]
```

## Step-by-Step Explanation

1. Create a zero-filled `diff` array of length `n`.
2. Read `start`, `end`, and `delta` from the update.
3. Mark where the update starts: `diff[start] += delta`.
4. If `end + 1` is inside the array, mark where the update stops: `diff[end + 1] -= delta`.
5. Rebuild the final array with a prefix-sum pass.
6. Return the rebuilt array, not the raw `diff` array.

## Java Solution

```java
public static int[] applyOneRangeUpdate(int n, int[] update) {
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
}
```

## Python Solution

```python
def apply_one_range_update(n: int, update: list[int]) -> list[int]:
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

    return result
```

## ASCII Trace

```text
$ n = 5, update = [1, 3, 3]
> start with zero difference array
  diff = [0, 0, 0, 0, 0]
> mark start: diff[1] += 3
  diff = [0, 3, 0, 0, 0]
> mark stop: diff[4] -= 3
  diff = [0, 3, 0, 0, -3]
> prefix rebuild with running total
  running values = 0, 3, 3, 3, 0
>= final array [0, 3, 3, 3, 0]
```

## Time Complexity

`O(n)` total.

The boundary update is `O(1)`, and the prefix rebuild is `O(n)`.

## Space Complexity

`O(n)` for the `diff` array and `result` array.

## Common Mistakes

- Subtracting at `end` instead of `end + 1`.
- Forgetting the bounds check before using `diff[end + 1]`.
- Returning the raw `diff` array instead of rebuilding the final array.
- Directly updating every value in the range instead of using boundary marks.

# Problem 3

**Title:** Multiple Range Updates, One Rebuild  
**Difficulty:** Easy  
**Concept Focus:** Combine several boundary marks and reconstruct once

## Concept Before the Problem

The real power of difference arrays appears when there are multiple range updates.

The rule does not change:

```text
diff[start] += delta
if end + 1 < n:
    diff[end + 1] -= delta
```

For many updates, keep adding boundary marks into the same `diff` array.

Do **not** rebuild after every update.

Instead:

1. Mark all update boundaries.
2. Run one prefix-sum pass at the end.
3. The running total automatically combines overlapping updates.

## Real-World Context

Imagine a five-day scoreboard starts at zero:

```text
[0, 0, 0, 0, 0]
```

Several events add or subtract points across day ranges:

```text
+3 from day 1 through day 3
+2 from day 0 through day 2
-1 from day 2 through day 4
```

Some days are affected by more than one event. Difference arrays let those overlaps combine naturally during the prefix rebuild.

## Problem Statement

Given:

```text
n = 5
updates = [
    [1, 3, 3],
    [0, 2, 2],
    [2, 4, -1],
]
```

Each update is in the form:

```text
[start, end, delta]
```

Return the final zero-filled array after applying all updates.

## Beginner Hint

Handle each update using the same two boundary rules.

Do not special-case negative `delta`.

For `delta = -1`, the same rule still works:

```text
diff[start] += -1
if end + 1 < n:
    diff[end + 1] -= -1
```

In this sample, the last update ends at index `4`, so `end + 1 = 5` is outside the array. That stop mark is skipped.

## Apply the Concept

Start:

```text
diff = [0, 0, 0, 0, 0]
```

Apply every update:

| Update | Boundary marks | `diff` after update |
|---|---|---|
| `[1, 3, 3]` | `diff[1] += 3`, `diff[4] -= 3` | `[0, 3, 0, 0, -3]` |
| `[0, 2, 2]` | `diff[0] += 2`, `diff[3] -= 2` | `[2, 3, 0, -2, -3]` |
| `[2, 4, -1]` | `diff[2] += -1`, skip `diff[5]` | `[2, 3, -1, -2, -3]` |

Now rebuild with a prefix sum:

| Index | `diff[index]` | Running total | `result[index]` |
|---:|---:|---:|---:|
| 0 | 2 | 2 | 2 |
| 1 | 3 | 5 | 5 |
| 2 | -1 | 4 | 4 |
| 3 | -2 | 2 | 2 |
| 4 | -3 | -1 | -1 |

Final array:

```text
[2, 5, 4, 2, -1]
```

## Input

```text
n: int
updates: int[][] where each update is [start, end, delta]
```

## Output

```text
int[] final values after all updates
```

## Sample Input

```text
n = 5
updates = [
    [1, 3, 3],
    [0, 2, 2],
    [2, 4, -1],
]
```

## Sample Output

```text
[2, 5, 4, 2, -1]
```

## Step-by-Step Explanation

1. Create a zero-filled `diff` array of length `n`.
2. For each update, read `start`, `end`, and `delta`.
3. Add `delta` at `start`.
4. Subtract `delta` at `end + 1` only if that index is inside the array.
5. After all updates are marked, run one prefix-sum pass.
6. Store each running total in the final result array.
7. Return the result.

## Java Solution

```java
public static int[] applyRangeUpdates(int n, int[][] updates) {
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
}
```

## Python Solution

```python
def apply_range_updates(n: int, updates: list[list[int]]) -> list[int]:
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

    return result
```

## ASCII Trace

```text
$ n = 5, updates = [[1,3,3], [0,2,2], [2,4,-1]]
> start diff
  [0, 0, 0, 0, 0]
> update [1,3,3]: diff[1] += 3, diff[4] -= 3
  [0, 3, 0, 0, -3]
> update [0,2,2]: diff[0] += 2, diff[3] -= 2
  [2, 3, 0, -2, -3]
> update [2,4,-1]: diff[2] += -1, end+1 = 5 so skip stop mark
  [2, 3, -1, -2, -3]
> prefix rebuild
  running values = 2, 5, 4, 2, -1
>= final array [2, 5, 4, 2, -1]
```

## Time Complexity

`O(n + m)`, where:

```text
n = array length
m = number of updates
```

Each update is marked in `O(1)`, then the array is rebuilt in `O(n)`.

## Space Complexity

`O(n)` for the `diff` array and `result` array.

## Common Mistakes

- Rebuilding the final array after every update instead of once at the end.
- Clearing `diff` between updates.
- Forgetting that overlapping ranges should add together.
- Changing the rule for negative `delta`; the same boundary formula still applies.
- Subtracting at `end` instead of `end + 1`.

# Closing Summary

Difference arrays are useful when we have range updates and only need the final array after those updates are applied.

Core memory phrase:

```text
Mark where the change starts.
Mark where the change stops.
Prefix-sum once to rebuild.
```

Direct range updates change many values immediately.

Difference arrays delay the work:

```text
range update -> two boundary marks
all updates  -> one prefix rebuild
```

The most important formula is:

```text
diff[start] += delta
if end + 1 < n:
    diff[end + 1] -= delta
```

The most important mental model is:

```text
+delta turns the change on.
-delta turns the change off.
The running total shows which changes are active at each index.
```

Students should leave able to say:

```text
A difference array stores changes, not final values.
Boundary marks make range updates cheap.
Prefix sums rebuild the final values.
```

# Instructor Notes

## Suggested Lesson Rhythm

| Segment | Goal | Instructor Move |
|---|---|---|
| Opening Theory | Explain why direct range updates can be slow | Compare editing every value with marking only start/stop |
| Problem 1 | Make `diff` concrete | Ask: “What changed from the previous index?” |
| Problem 2 | Teach one boundary-mark update | Ask: “Where does +3 turn on, and where does it turn off?” |
| Problem 3 | Combine multiple updates | Ask: “Do old boundary marks disappear?” Expected answer: no |
| Closing | Lock in the pattern | Repeat: mark starts, mark stops, prefix-sum once |

## Teacher Checks

Use these before revealing code:

```text
What does the difference array store?
Where does the update start?
Where does the update stop?
Why do we subtract at end + 1 instead of end?
What does the running total mean at this index?
```

Expected student language:

```text
It stores changes.
The start mark turns the delta on.
The end + 1 mark turns the delta off.
The running total is the final value at this index.
```

## Common Failure Patterns To Watch

- Students return `diff` instead of the rebuilt array.
- Students subtract at `end` instead of `end + 1`.
- Students forget to skip the stop mark when `end + 1 == n`.
- Students rebuild after every update instead of after all updates.
- Students treat negative `delta` as a special case and accidentally reverse the rule.

## Beginner Pacing Notes

Keep the first pass concrete. Use numbers, not abstract symbols, until students can explain the trace.

Recommended narration:

```text
This +3 starts at index 1.
The running total carries it through index 2 and index 3.
The -3 at index 4 cancels it, so index 4 goes back to 0.
```

Avoid introducing advanced structures in this lesson. Do not branch into Fenwick trees, segment trees, coordinate compression, or sweep line. The target skill is the basic boundary-mark and prefix-rebuild pattern.

## Conversion Notes For The Teaching Site

- Each problem has extractable fields for title, difficulty, concept focus, statement, sample input, sample output, solutions, trace, complexity, and common mistakes.
- Java is written as the primary readable solution.
- Python is included as a secondary reference implementation.
- ASCII traces are short terminal-style traces that can be split into visualizer lines.
- The progression is cumulative: build `diff`, mark one update, then mark many updates and rebuild once.
