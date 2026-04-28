# Difference Arrays CoderPad Java Exercises

Each exercise is a standalone CoderPad setup. For each one, replace the starter files in these exact locations:

- `src/main/java/com/coderpad/app/Main.java`
- `src/test/java/com/coderpad/app/MainTest.java`

Keep the package line as `package com.coderpad.app;`.

If CoderPad only shows Maven `BUILD SUCCESS`, it compiled the app but did not print JUnit details. Use the `Main.java` versions below to get visible `PASS` lines from the normal Run button, and use the matching `MainTest.java` files when you want the JUnit test runner.

Important paste rule:

- `Main.java` must contain `public class Main` and no `org.junit` imports.
- `MainTest.java` must contain `public class MainTest` and the `org.junit` imports.
- If you see `bad source file ... Main.java file does not contain class com.coderpad.app.Main`, you pasted the test file into `Main.java`. Replace `Main.java` with the matching `Main.java` block below.
- If you only want visible terminal output, paste the `Main.java` block and run it. You can leave `MainTest.java` alone.

## CodePad 1: Build the Change List

### `src/main/java/com/coderpad/app/Main.java`

```java
package com.coderpad.app;

import java.util.Arrays;

public class Main {
  public static void main(String[] args) {
    runCheck(
      "lesson sample",
      buildDifferenceArray(new int[] {4, 7, 7, 10}),
      new int[] {4, 3, 0, 3}
    );

    runCheck(
      "repeated values",
      buildDifferenceArray(new int[] {5, 5, 5, 5}),
      new int[] {5, 0, 0, 0}
    );

    runCheck(
      "negative changes",
      buildDifferenceArray(new int[] {10, 7, 2, 2}),
      new int[] {10, -3, -5, 0}
    );
  }

  public static int[] buildDifferenceArray(int[] nums) {
    int[] diff = new int[nums.length];

    diff[0] = nums[0];

    for (int index = 1; index < nums.length; index++) {
      diff[index] = nums[index] - nums[index - 1];
    }

    return diff;
  }

  private static void runCheck(String testName, int[] actual, int[] expected) {
    if (!Arrays.equals(actual, expected)) {
      throw new AssertionError(
        testName + " failed. Expected " + Arrays.toString(expected) + " but got " + Arrays.toString(actual)
      );
    }

    System.out.println("PASS " + testName + " -> " + Arrays.toString(actual));
  }
}
```

### `src/test/java/com/coderpad/app/MainTest.java`

```java
package com.coderpad.app;

import static org.junit.Assert.*;

import org.junit.Test;

public class MainTest {
  @Test
  public void shouldBuildLessonSampleChangeList() {
    int[] nums = {4, 7, 7, 10};

    assertArrayEquals(new int[] {4, 3, 0, 3}, Main.buildDifferenceArray(nums));
  }

  @Test
  public void shouldHandleRepeatedValues() {
    int[] nums = {5, 5, 5, 5};

    assertArrayEquals(new int[] {5, 0, 0, 0}, Main.buildDifferenceArray(nums));
  }

  @Test
  public void shouldHandleNegativeChanges() {
    int[] nums = {10, 7, 2, 2};

    assertArrayEquals(new int[] {10, -3, -5, 0}, Main.buildDifferenceArray(nums));
  }
}
```

## CodePad 2: One Range Update With Boundary Marks

### `src/main/java/com/coderpad/app/Main.java`

```java
package com.coderpad.app;

import java.util.Arrays;

public class Main {
  public static void main(String[] args) {
    runCheck(
      "lesson sample",
      applyOneRangeUpdate(5, new int[] {1, 3, 3}),
      new int[] {0, 3, 3, 3, 0}
    );

    runCheck(
      "update through last index",
      applyOneRangeUpdate(5, new int[] {0, 4, 2}),
      new int[] {2, 2, 2, 2, 2}
    );

    runCheck(
      "negative single index update",
      applyOneRangeUpdate(5, new int[] {4, 4, -2}),
      new int[] {0, 0, 0, 0, -2}
    );
  }

  public static int[] applyOneRangeUpdate(int n, int[] update) {
    int[] diff = new int[n];

    int start = update[0];
    int end = update[1];
    int delta = update[2];

    diff[start] += delta;

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

  private static void runCheck(String testName, int[] actual, int[] expected) {
    if (!Arrays.equals(actual, expected)) {
      throw new AssertionError(
        testName + " failed. Expected " + Arrays.toString(expected) + " but got " + Arrays.toString(actual)
      );
    }

    System.out.println("PASS " + testName + " -> " + Arrays.toString(actual));
  }
}
```

### `src/test/java/com/coderpad/app/MainTest.java`

```java
package com.coderpad.app;

import static org.junit.Assert.*;

import org.junit.Test;

public class MainTest {
  @Test
  public void shouldApplyLessonSampleUpdate() {
    int n = 5;
    int[] update = {1, 3, 3};

    assertArrayEquals(new int[] {0, 3, 3, 3, 0}, Main.applyOneRangeUpdate(n, update));
  }

  @Test
  public void shouldApplyUpdateThroughLastIndex() {
    int n = 5;
    int[] update = {0, 4, 2};

    assertArrayEquals(new int[] {2, 2, 2, 2, 2}, Main.applyOneRangeUpdate(n, update));
  }

  @Test
  public void shouldApplyNegativeSingleIndexUpdate() {
    int n = 5;
    int[] update = {4, 4, -2};

    assertArrayEquals(new int[] {0, 0, 0, 0, -2}, Main.applyOneRangeUpdate(n, update));
  }
}
```

## CodePad 3: Multiple Range Updates, One Rebuild

### `src/main/java/com/coderpad/app/Main.java`

```java
package com.coderpad.app;

import java.util.Arrays;

public class Main {
  public static void main(String[] args) {
    runCheck(
      "lesson sample",
      applyRangeUpdates(5, new int[][] {
        {1, 3, 3},
        {0, 2, 2},
        {2, 4, -1}
      }),
      new int[] {2, 5, 4, 2, -1}
    );

    runCheck(
      "overlapping updates",
      applyRangeUpdates(4, new int[][] {
        {0, 1, 5},
        {1, 3, 2}
      }),
      new int[] {5, 7, 2, 2}
    );

    runCheck(
      "no updates",
      applyRangeUpdates(3, new int[][] {}),
      new int[] {0, 0, 0}
    );
  }

  public static int[] applyRangeUpdates(int n, int[][] updates) {
    int[] diff = new int[n];

    for (int[] update : updates) {
      int start = update[0];
      int end = update[1];
      int delta = update[2];

      diff[start] += delta;

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

  private static void runCheck(String testName, int[] actual, int[] expected) {
    if (!Arrays.equals(actual, expected)) {
      throw new AssertionError(
        testName + " failed. Expected " + Arrays.toString(expected) + " but got " + Arrays.toString(actual)
      );
    }

    System.out.println("PASS " + testName + " -> " + Arrays.toString(actual));
  }
}
```

### `src/test/java/com/coderpad/app/MainTest.java`

```java
package com.coderpad.app;

import static org.junit.Assert.*;

import org.junit.Test;

public class MainTest {
  @Test
  public void shouldApplyLessonSampleUpdates() {
    int n = 5;
    int[][] updates = {
      {1, 3, 3},
      {0, 2, 2},
      {2, 4, -1}
    };

    assertArrayEquals(new int[] {2, 5, 4, 2, -1}, Main.applyRangeUpdates(n, updates));
  }

  @Test
  public void shouldCombineOverlappingUpdates() {
    int n = 4;
    int[][] updates = {
      {0, 1, 5},
      {1, 3, 2}
    };

    assertArrayEquals(new int[] {5, 7, 2, 2}, Main.applyRangeUpdates(n, updates));
  }

  @Test
  public void shouldHandleNoUpdates() {
    int n = 3;
    int[][] updates = {};

    assertArrayEquals(new int[] {0, 0, 0}, Main.applyRangeUpdates(n, updates));
  }
}
```
