# Lessons

- When preparing CoderPad Java exercises, include visible checks in `Main.main` as well as JUnit tests. CoderPad may show only Maven compile/build output unless the user runs the test task, and passing JUnit tests are normally silent.
- When expanding lesson slides, include a concrete example for each bullet point so students can see the concept in action, not only the definition.
- When explaining that a difference-array mark is not the final answer, show the prefix-rebuild scan as the middle step: mark changes running total, running total becomes the final value.
- When a lesson bullet still feels unclear, expand the example into labeled mechanics: what `diff` stores, how the running total changes, and what final value gets written.
- When showing range-update changes in bullet points, always include `start`, `end`, and `delta` first so the boundary marks and running totals have concrete context.
- When a lesson bullet needs to show values changing across indexes, prefer a table with columns for index, range position, diff mark, running total after the mark, and final value.
- When the user still does not understand a lesson concept after incremental edits, rewrite the slide around one simple mental model instead of adding more detail to the old framing.
- When introducing an `update` array, define the shape `[start, end, delta]` before decoding a concrete example.
- Avoid vague verbs like "write" in beginner algorithm lessons. Say the exact operation and target, such as "add +3 to `diff[1]`."
- When a slide bullet uses `end + 1`, restate that `end` is the last included index in the range inside that same bullet.
- When explaining efficiency, include operation counts that compare direct range-length work against the constant two boundary marks.
- When moving between lesson problems, explicitly state the bridge: what idea stays the same, what changes, and how the previous problem's artifact is reused.
- When defining prefix sum for beginners, explain its purpose as the rebuild step and show the scan mechanics: add diff entry to running total, then write the running total as the final value.
- If a slide objective claims an efficiency benefit, show a direct side-by-side work comparison early on the slide instead of relying on later prose.
- Avoid wide plain-text tables inside reveal cards; use short grouped lines when the content must fit narrow slide panels.
- When a lesson is about reverse operations, keep both directions present (build then restore) before moving to the next abstraction.
- When user-requested lesson refresh includes a "mega prompt", record the exact attachment list and fixed problem order as part of the requested assets.
