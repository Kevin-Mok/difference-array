Here is the full transcript of the video **"Introduction | What | Why | Line Sweep Technique | Concepts & Questions - 1"** by **codestorywithMIK**, translated and transcribed for clarity:

[00:00:00] Hello everyone, welcome to my channel CodeStoryWithMIK. Today we are starting video number one of our Line Sweep Algorithm Concepts & Questions playlist.

[00:00:10] As you know, whenever a concepts playlist starts, we take an oath in the first video—that whatever I teach, I will teach with full detail and intuition. The motivation is simple: work a little harder, and you can change the world for yourself and your family.

[00:00:31] **What is Line Sweep Algorithm?** Imagine a newspaper or a book. Assume you have a long line that you can move back and forth across it. Currently, the line is at a specific spot; you should only care about what is visible at that exact position.

[00:01:11] As the line moves forward, if nothing is there, we do nothing. Once something appears in the line (like characters), we take action—maybe counting them or performing a specific task. We only act when "events" occur within the line. This is the essence: an imaginary line is sweeping, and our focus is entirely on what is inside that line at that moment.

[00:02:20] You can sweep horizontally or vertically. Earlier, I showed a vertical line moving sideways; you could also have a horizontal line moving upwards.

[00:03:02] **What Line Sweep actually means:** It is important to know that Line Sweep is not just "an algorithm"—it is a way of thinking and visualizing. Most future problems will depend on this visualization.

[00:03:34] The line is an imaginary "view." It must always move in a **sorted fashion**. It won’t jump from one spot to a random distant spot and back; it moves in a particular order.

[00:05:24] **Technical Details: Events.** Every Line Sweep problem revolves around "Events." This is the most important part. An event is a point where **something changes**. What changes depends on the problem statement. Line Sweep only cares about these events and ignores everything else.

[00:06:31] **Example: Intervals.** Suppose you have intervals with start and end times (e.g., 1 to 3, 2 to 5). These intervals extend along the x-axis. As the imaginary line moves, it hits "1" (the start of an interval)—this is an event. As it hits "2", that’s another event. At "3", an interval ends—another event. 

[00:09:11] Every start and end point is an event. We need to sweep the line in the **sorted order** of these events. Even if the input isn't sorted, we extract the events and then sort them ourselves. 

[00:11:54] **The Cafe Problem:** Imagine a cafe. At 1:00, a customer arrives (+1). At 4:00, they leave (-1). Another customer arrives at 2:00 (+1) and leaves at 5:00 (-1). If I ask for the maximum number of customers in the cafe at any point, we use Line Sweep.

[00:13:32] We sort the events: 1 (+1), 2 (+1), 4 (-1), 5 (-1). 
*   At 1:00, count becomes 1. Max = 1.
*   At 2:00, count becomes 2. Max = 2.
*   At 4:00, someone leaves, count becomes 1.
*   At 5:00, someone leaves, count becomes 0.
The answer is 2. This same logic applies to finding maximum intersection points in geometry.

[00:17:53] **Delta ($\Delta$):** You will often see the variable "delta" in code. It simply refers to the change at an event (like +1 or -1). Delta helps differentiate events that happen at the same time (e.g., someone leaving and someone arriving at exactly 4:00).

[00:22:02] **Types of Line Sweep:** 
1.  **Vertical Sweep:** A vertical line moving along the x-axis (most common).
2.  **Horizontal Sweep:** A horizontal line moving along the y-axis.
The problem usually dictates which one to use based on which axis the intervals or shapes are extending.

[00:24:02] **When to use Line Sweep:**
*   Interval/Scheduling problems.
*   Geometrical shapes (finding area or overlaps).
*   Skyline problems (visualizing building outlines).

[00:25:54] This video was an introduction to the non-technical and technical concepts. In the next video, we will dive into actual DSA (Data Structures and Algorithms) coding problems to see how this is implemented.

[00:26:38] I hope I was able to help. See you in the next video! Thank you.
