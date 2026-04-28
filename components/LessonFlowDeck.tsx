"use client";

import { useEffect, useMemo, useState } from "react";
import { CodeBlock } from "./CodeBlock";
import { ProblemCard } from "./ProblemCard";
import {
  getProblemBySlug,
  lessonFlow,
  type LessonDeckAgendaItem,
  type LessonReferenceTable,
  type LessonStep,
  type ProblemWorkshop,
} from "../data/lessonFlow";
import { problems, type DifferenceArraysProblem } from "../data/problems";

type AudienceMode = "presenter" | "student";
type ProblemPhase = "precontext" | "student-work" | "explanation";
type SolutionLanguage = "java" | "python";

type LessonSlide =
  | {
      kind: "lesson";
      id: string;
      title: string;
      step: LessonStep;
      problem?: never;
      tag: string;
      timing?: string;
      timelineStartMinute: number;
      timelineMinutes: number;
    }
  | {
      kind: "problem";
      id: string;
      title: string;
      step?: never;
      problem: ProblemWorkshop;
      tag: string;
      phase: ProblemPhase;
      timing?: string;
      timelineStartMinute: number;
      timelineMinutes: number;
    };

const problemPhaseMeta: Record<
  ProblemPhase,
  { label: string; revealTitle: string; navLabel: string; titleSummary: string }
> = {
  precontext: {
    label: "Instructor launch: concept, context, hint",
    revealTitle: "Precontext prompts",
    navLabel: "Precontext",
    titleSummary: "Concept, context, hint",
  },
  "student-work": {
    label: "Students: guided work and trace setup",
    revealTitle: "Student work prompts",
    navLabel: "Student work",
    titleSummary: "Work time, hints, trace",
  },
  explanation: {
    label: "Instructor explanation: code, trace, mistakes",
    revealTitle: "Instructor explanation prompts",
    navLabel: "Explanation",
    titleSummary: "Walkthrough, code, takeaways",
  },
};

const problemPhaseOrder: ProblemPhase[] = ["precontext", "student-work", "explanation"];

type PresenterPoint = {
  bullet: string;
  expansion?: string[];
};

type PresenterPointGroup = {
  heading: string;
  points: PresenterPoint[];
};

function LessonReferenceTableCard({
  table,
}: {
  table: LessonReferenceTable;
}) {
  return (
    <section className="content-section reference-table-card">
      <div className="reference-table-card__header">
        <h4>{table.title}</h4>
        {table.caption ? <p className="muted">{table.caption}</p> : null}
      </div>
      <div className="reference-table-card__scroll">
        <table className="reference-table">
          <thead>
            <tr>
              {table.columns.map((column) => (
                <th key={`${table.title}-${column}`} scope="col">
                  {column}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {table.rows.map((row, rowIndex) => (
              <tr key={`${table.title}-row-${rowIndex}`}>
                {row.map((cell, cellIndex) => (
                  <td key={`${table.title}-row-${rowIndex}-cell-${cellIndex}`}>
                    {cell}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

function TextBlocks({ items }: { items: string[] }) {
  return (
    <div className="text-blocks">
      {items.map((item, index) =>
        item.includes("\n") ? (
          <pre key={`${item.slice(0, 18)}-${index}`} className="teaching-pre">
            {item}
          </pre>
        ) : (
          <p key={`${item.slice(0, 18)}-${index}`}>{item}</p>
        ),
      )}
    </div>
  );
}

function ProblemTeachingPacket({ problem }: { problem: DifferenceArraysProblem }) {
  return (
    <section className="content-section teaching-packet">
      <div className="teaching-grid">
        <div>
          <h4>Concept before problem</h4>
          <TextBlocks items={problem.conceptBeforeProblem} />
        </div>
        <div>
          <h4>Real-world context</h4>
          <TextBlocks items={problem.realWorldContext} />
        </div>
        <div>
          <h4>Beginner hint</h4>
          <TextBlocks items={problem.beginnerHint} />
        </div>
        <div>
          <h4>Apply the concept</h4>
          <TextBlocks items={problem.applyConcept} />
        </div>
      </div>
    </section>
  );
}

export function LessonFlowDeck() {
  const [audience, setAudience] = useState<AudienceMode>("presenter");
  const [showPresenterHelpers, setShowPresenterHelpers] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const [traceLineIndex, setTraceLineIndex] = useState(0);
  const [revealIndex, setRevealIndex] = useState(-1);
  const [notes, setNotes] = useState<Record<string, string>>({});
  const [checkStates, setCheckStates] = useState<
    Record<string, Record<string, boolean>>
  >({});
  const [problemLanguageBySlug, setProblemLanguageBySlug] = useState<
    Record<string, SolutionLanguage>
  >({});

  const slides = useMemo<LessonSlide[]>(() => {
    const lessonSlides = new Map<string, LessonStep>(
      lessonFlow.lessonSteps.map((step) => [step.id, step]),
    );
    const problemWorkshops = new Map<string, ProblemWorkshop>(
      lessonFlow.problemWorkshops.map((workshop) => [workshop.problemSlug, workshop]),
    );
    const problemOrder = new Map<string, number>(
      lessonFlow.problemWorkshops.map((workshop, index) => [
        workshop.problemSlug,
        index + 1,
      ]),
    );
    const agenda = lessonFlow.classAgenda.length
      ? lessonFlow.classAgenda
      : lessonFlow.lessonSteps.map<LessonDeckAgendaItem>((step) => ({
          kind: "lesson",
          lessonStepId: step.id,
        }));
    let runningMinute = 0;
    const agendaSlides: LessonSlide[] = [];

    const addLessonSlide = (step: LessonStep) => {
      const timelineStartMinute = runningMinute;
      const timelineMinutes = step.durationMinutes ?? 0;
      const endMinute = timelineStartMinute + timelineMinutes;
      runningMinute = endMinute;
      agendaSlides.push({
        kind: "lesson",
        id: `lesson-${step.id}`,
        title: step.title,
        tag: `Teaching step - ${timelineStartMinute}-${endMinute} min`,
        step,
        timing: timelineMinutes ? `${timelineMinutes} min` : undefined,
        timelineStartMinute,
        timelineMinutes,
      });
    };

    agenda.forEach((item: LessonDeckAgendaItem) => {
      if (item.kind === "lesson" && item.lessonStepId) {
        const step = lessonSlides.get(item.lessonStepId);
        if (!step) return;
        addLessonSlide(step);
        return;
      }

      if (item.kind !== "problem" || !item.problemSlug) return;
      const workshop = problemWorkshops.get(item.problemSlug);
      if (!workshop) return;
      const problemIndex = problemOrder.get(item.problemSlug) ?? 0;
      const precontextMinutes = workshop.workPhaseTimings?.precontextMinutes ?? 4;
      const workMinutes = workshop.workPhaseTimings?.workMinutes ?? 10;
      const explanationMinutes = workshop.workPhaseTimings?.explanationMinutes ?? 8;

      problemPhaseOrder.forEach((phase) => {
        const timelineMinutes =
          phase === "precontext"
            ? precontextMinutes
            : phase === "student-work"
              ? workMinutes
              : explanationMinutes;
        const phaseMeta = problemPhaseMeta[phase];
        const timelineStartMinute = runningMinute;
        const endMinute = timelineStartMinute + timelineMinutes;
        runningMinute = endMinute;
        agendaSlides.push({
          kind: "problem",
          id: `problem-${workshop.problemSlug}-${phase}`,
          title: `Problem ${problemIndex}: ${phaseMeta.titleSummary}`,
          tag: `Problem ${problemIndex} - ${phaseMeta.navLabel} (${timelineStartMinute}-${endMinute} min)`,
          problem: workshop,
          phase,
          timing: `${timelineMinutes} min`,
          timelineStartMinute,
          timelineMinutes,
        });
      });
    });

    return agendaSlides.sort((a, b) => a.timelineStartMinute - b.timelineStartMinute);
  }, []);

  const problemSlideIndexByPhase = useMemo(() => {
    const map = new Map<string, number>();
    slides.forEach((slide, index) => {
      if (slide.kind !== "problem") return;
      map.set(`${slide.problem.problemSlug}-${slide.phase}`, index);
    });
    return map;
  }, [slides]);

  useEffect(() => {
    const rawSlide = new URL(window.location.href).searchParams.get("slide");
    if (!rawSlide) return;
    const parsed = Number.parseInt(rawSlide, 10);
    if (!Number.isInteger(parsed) || parsed < 1 || parsed > slides.length) {
      return;
    }
    setActiveIndex(parsed - 1);
    setTraceLineIndex(0);
    setRevealIndex(-1);
  }, [slides.length]);

  useEffect(() => {
    const url = new URL(window.location.href);
    url.searchParams.set("slide", String(activeIndex + 1));
    window.history.replaceState({}, "", url.toString());
  }, [activeIndex]);

  const activeSlide = slides[activeIndex];
  const progress = ((activeIndex + 1) / slides.length) * 100;

  useEffect(() => {
    setRevealIndex(-1);
  }, [activeSlide.id]);

  const copyCurrentSlideUrl = async () => {
    const url = new URL(window.location.href);
    url.searchParams.set("slide", String(activeIndex + 1));
    try {
      await navigator.clipboard.writeText(url.toString());
      return;
    } catch {
      return;
    }
  };

  const goPrevious = () => {
    setActiveIndex((value) => Math.max(0, value - 1));
    setTraceLineIndex(0);
    setRevealIndex(-1);
  };

  const goNext = () => {
    setActiveIndex((value) => Math.min(slides.length - 1, value + 1));
    setTraceLineIndex(0);
    setRevealIndex(-1);
  };

  const activeProblemSlug = activeSlide.kind === "problem" ? activeSlide.problem.problemSlug : "";
  const activeProblem = activeProblemSlug
    ? getProblemBySlug(activeProblemSlug)
    : undefined;
  const activeProblemLanguage =
    activeProblemSlug && problemLanguageBySlug[activeProblemSlug]
      ? problemLanguageBySlug[activeProblemSlug]
      : "java";
  const activeProblemSolution =
    activeProblem && activeProblemLanguage === "python"
      ? activeProblem.pythonSolution
      : activeProblem?.javaSolution ?? "";
  const activeWorkshop = activeSlide.kind === "problem" ? activeSlide.problem : undefined;
  const activeProblemIndex = activeProblemSlug
    ? slides.findIndex(
        (slide) =>
          slide.kind === "problem" &&
          slide.problem.problemSlug === activeProblemSlug,
      )
    : -1;
  const activeProblemPhaseIndex =
    activeSlide.kind === "problem"
      ? problemPhaseOrder.indexOf(activeSlide.phase)
      : 0;
  const isProblemExplanationPhase =
    activeSlide.kind === "problem" && activeSlide.phase === "explanation";
  const isProblemPromptPhaseForStudents =
    activeSlide.kind === "problem" && activeSlide.phase !== "explanation";
  const isProblemInstructorExplanationOnly =
    isProblemExplanationPhase && audience === "presenter";
  const showProblemPrompts =
    activeSlide.kind !== "problem" ||
    isProblemPromptPhaseForStudents ||
    isProblemInstructorExplanationOnly;

  const setActiveProblemLanguage = (language: SolutionLanguage) => {
    if (!activeProblemSlug) return;
    setProblemLanguageBySlug((previous) => ({
      ...previous,
      [activeProblemSlug]: language,
    }));
  };

  const goToProblemPhase = (phaseIndex: number) => {
    if (activeProblemIndex < 0) return;
    if (!activeWorkshop) return;
    const target = problemSlideIndexByPhase.get(
      `${activeWorkshop.problemSlug}-${problemPhaseOrder[phaseIndex]}`,
    );
    if (target === undefined) return;
    setActiveIndex(target);
    setTraceLineIndex(0);
    setRevealIndex(-1);
  };

  const getProblemPhasePrompts = (
    workshop: ProblemWorkshop,
    phase: ProblemPhase,
  ): string[] => {
    switch (phase) {
      case "precontext":
        return workshop.precontextPrompts ?? workshop.prompts ?? [];
      case "student-work":
        return workshop.studentWorkPrompts ?? workshop.prompts ?? [];
      case "explanation":
        return workshop.explanationPrompts ?? workshop.prompts ?? [];
      default:
        return workshop.prompts ?? [];
    }
  };

  const currentProblemState = activeProblemSlug
    ? checkStates[activeProblemSlug] ?? {}
    : {};

  const toggleProblemCheck = (id: string) => {
    if (!activeProblemSlug) return;
    setCheckStates((prev) => {
      const current = prev[activeProblemSlug] ?? {};
      return {
        ...prev,
        [activeProblemSlug]: {
          ...current,
          [id]: !current[id],
        },
      };
    });
  };

  const setTraceLine = (index: number) => {
    if (!activeProblem?.traceAscii) return;
    setTraceLineIndex(() => {
      if (index < 0) return 0;
      if (index >= activeProblem.traceAscii.length) {
        return activeProblem.traceAscii.length - 1;
      }
      return index;
    });
  };

  const activeKey = `${activeSlide.id}-${audience}`;
  const noteText = notes[activeKey] ?? "";

  const legacyLessonPointGroups = (step: LessonStep): PresenterPointGroup[] => [
    {
      heading: "Coach script",
      points: step.teacherNotes.map((note) => ({ bullet: note, expansion: [] })),
    },
    {
      heading: "Student movement checks",
      points: [
        ...step.studentMoves.map((move) => ({ bullet: move, expansion: [] })),
        ...step.checks.map((check) => ({ bullet: check, expansion: [] })),
      ],
    },
    {
      heading: "Correctness",
      points: [
        ...(step.invariant
          ? [{ bullet: `Invariant: ${step.invariant}`, expansion: [] }]
          : []),
        ...(step.successCriteria
          ? [{ bullet: `Success criteria: ${step.successCriteria}`, expansion: [] }]
          : []),
      ],
    },
    {
      heading: "Common bugs to watch",
      points: (
        step.failurePatterns ??
        step.commonFailurePatterns ??
        []
      ).map((failure) => ({ bullet: failure, expansion: [] })),
    },
    {
      heading: "Checks and edge cases",
      points: [
        ...(step.sanityChecks ?? []).map((check) => ({ bullet: check, expansion: [] })),
        ...(step.edgeCasePrompts ?? []).map((prompt) => ({
          bullet: `Edge case: ${prompt}`,
          expansion: [],
        })),
      ],
    },
  ].filter((group) => group.points.length > 0);

  const legacyProblemPointGroups = (workshop: ProblemWorkshop): PresenterPointGroup[] => [
    {
      heading: "Coach script",
      points: [{ bullet: workshop.coachScript, expansion: [] }],
    },
    {
      heading: "Instructor focus",
      points: [
        ...(workshop.commonFailurePatterns
          ? workshop.commonFailurePatterns.map((item) => ({ bullet: item, expansion: [] }))
          : []),
        ...(workshop.sanityChecks ?? []).map((check) => ({
          bullet: check,
          expansion: [],
        })),
      ],
    },
    {
      heading: "Extra checks",
      points: [
        ...(workshop.edgeCasePrompts ?? []).map((prompt) => ({
          bullet: `Edge case prompt: ${prompt}`,
          expansion: [],
        })),
        ...(workshop.successCriteria
          ? [{ bullet: `Success criteria: ${workshop.successCriteria}`, expansion: [] }]
          : []),
      ],
    },
  ].filter((group) => group.points.length > 0);

  let presenterTalkingPointGroups: PresenterPointGroup[] = [];
  if (activeSlide.kind === "lesson") {
    presenterTalkingPointGroups =
      activeSlide.step.presenterTalkingPointGroups ??
      legacyLessonPointGroups(activeSlide.step);
  } else if (activeSlide.kind === "problem" && activeWorkshop) {
    presenterTalkingPointGroups =
      activeWorkshop.presenterTalkingPointGroups ??
      legacyProblemPointGroups(activeWorkshop);
  }

  const lessonContext =
    activeSlide.kind === "lesson"
      ? activeSlide.step.studentContext.length
        ? activeSlide.step.studentContext
        : activeSlide.step.teacherNotes
      : activeSlide.kind === "problem" && activeWorkshop
        ? showProblemPrompts
          ? getProblemPhasePrompts(activeWorkshop, activeSlide.phase)
          : []
        : [];

  const visibleRevealItemCount = Math.max(
    0,
    Math.min(revealIndex + 1, lessonContext.length),
  );
  const revealItems = lessonContext.slice(0, visibleRevealItemCount);
  const canRevealMore = lessonContext.length > visibleRevealItemCount;

  const revealNext = () => {
    if (!lessonContext.length) return;
    setRevealIndex((value) => Math.min(value + 1, lessonContext.length - 1));
  };

  const revealReset = () => {
    setRevealIndex(-1);
  };

  const revealTitle =
    activeSlide.kind === "lesson"
      ? "Teaching points"
      : problemPhaseMeta[activeSlide.phase].revealTitle;

  return (
    <main className="page">
      <section className="hero panel">
        <p className="eyebrow">Difference Arrays Live Lesson Flow</p>
        <h1>{lessonFlow.classTitle}</h1>
        <p className="lead">
          A presenter-friendly lesson deck that starts with change lists, then
          turns range updates into boundary marks and one prefix-sum rebuild.
        </p>
      </section>

      <section className="panel">
        <p className="eyebrow">Problem path</p>
        <p className="section-subtitle">
          Three beginner problems, each tied to the concept students need right before solving.
        </p>
        <div className="problem-grid">
          {problems.map((problem) => (
            <ProblemCard key={problem.slug} problem={problem} />
          ))}
        </div>
      </section>

      <section id="lesson-deck" className="panel lesson-toolbar">
        <div className="deck-controls">
          <button
            type="button"
            className={`chip ${audience === "presenter" ? "chip--active" : ""}`}
            onClick={() => setAudience("presenter")}
          >
            Presenter view
          </button>
          <button
            type="button"
            className={`chip ${audience === "student" ? "chip--active" : ""}`}
            onClick={() => setAudience("student")}
          >
            Student view
          </button>
          {audience === "presenter" ? (
            <button
              type="button"
              className={`chip ${showPresenterHelpers ? "chip--active" : ""}`}
              onClick={() => setShowPresenterHelpers((value) => !value)}
            >
              Presenter talking points
            </button>
          ) : null}
          <button type="button" className="chip" onClick={copyCurrentSlideUrl}>
            Copy slide link
          </button>
        </div>
        <div className="lesson-progress">
          <span>Slide {activeIndex + 1} / {slides.length}</span>
          <div className="lesson-progress__track">
            <div className="lesson-progress__bar" style={{ width: `${progress}%` }} />
          </div>
        </div>
      </section>

      <section className="panel">
        <div className="timeline-grid">
          <ol className="timeline-list">
            {slides.map((slide, index) => (
              <li key={slide.id}>
                <button
                  type="button"
                  className={`timeline-item ${index === activeIndex ? "timeline-item--active" : ""}`}
                  onClick={() => {
                    setActiveIndex(index);
                    setTraceLineIndex(0);
                    setRevealIndex(-1);
                  }}
                >
                  <span>{slide.tag}</span>
                  <strong>{slide.title}</strong>
                </button>
              </li>
            ))}
          </ol>

          <article className="timeline-content">
            <header className="detail-card__header">
              <div>
                <p className="problem-card__index">
                  {activeSlide.tag}
                </p>
                <h2>{activeSlide.title}</h2>
              </div>
              <span className="difficulty-chip difficulty-easy">
                {activeSlide.kind === "lesson" ? "Teaching step" : "Problem section"}
              </span>
            </header>

            {activeSlide.kind === "lesson" ? (
              <>
                <p className="detail-card__description">
                  {activeSlide.step.objective}
                </p>
                <section className="content-section workshop-checks">
                  <div className="reveal-controls">
                    <p className="section-subtitle">
                      {revealTitle}: {visibleRevealItemCount} of {lessonContext.length}
                    </p>
                    <div className="reveal-controls__actions">
                      <button
                        type="button"
                        className="problem-card__action"
                        onClick={revealNext}
                        disabled={!canRevealMore}
                      >
                        Reveal next
                      </button>
                      <button
                        type="button"
                        className="problem-card__action"
                        onClick={revealReset}
                        disabled={visibleRevealItemCount <= 0}
                      >
                        Reset
                      </button>
                    </div>
                  </div>
                  <div className="workshop-reveal-list">
                    {revealItems.map((point, index) =>
                      point.includes("\n") ? (
                        <pre key={`${activeSlide.id}-context-${index}`} className="teaching-pre">
                          {point}
                        </pre>
                      ) : (
                        <p key={`${activeSlide.id}-context-${index}`}>{point}</p>
                      ),
                    )}
                  </div>
                </section>
                {activeSlide.step.referenceTable ? (
                  <LessonReferenceTableCard table={activeSlide.step.referenceTable} />
                ) : null}
              </>
            ) : null}

            {activeSlide.kind === "problem" && activeWorkshop && activeProblem ? (
              <>
                <p className="detail-card__description">
                  {activeProblem.description}
                </p>
                <ProblemTeachingPacket problem={activeProblem} />
                <section className="content-section workshop-checks">
                  <h4>Student goal</h4>
                  <p>{activeWorkshop.studentGoal}</p>
                </section>
                <section className="content-section samples-row">
                  <div>
                    <h4>Input spec</h4>
                    <pre>{activeProblem.inputSpec}</pre>
                  </div>
                  <div>
                    <h4>Output spec</h4>
                    <pre>{activeProblem.outputSpec}</pre>
                  </div>
                  <div>
                    <h4>Sample input</h4>
                    <pre>{activeProblem.sampleInput}</pre>
                  </div>
                  <div>
                    <h4>Expected output</h4>
                    <pre>{activeProblem.sampleOutput}</pre>
                  </div>
                </section>
                {activeProblem.codepadLinks ? (
                  <section className="content-section codepad-practice">
                    <div>
                      <h4>CoderPad practice</h4>
                      <p className="section-subtitle">
                        Start with the blank student pad, then compare against the solution pad.
                      </p>
                    </div>
                    <div className="codepad-practice__actions">
                      <a
                        href={activeProblem.codepadLinks.starterUrl}
                        className="problem-card__action"
                        target="_blank"
                        rel="noreferrer"
                      >
                        Open student pad
                      </a>
                      <a
                        href={activeProblem.codepadLinks.solutionUrl}
                        className="problem-card__action"
                        target="_blank"
                        rel="noreferrer"
                      >
                        Open solution pad
                      </a>
                    </div>
                  </section>
                ) : null}
                <section className="problem-part-nav">
                  {problemPhaseOrder.map((phase, index) => (
                    <button
                      key={`${activeProblemSlug}-${phase}`}
                      type="button"
                      className={`chip ${
                        activeProblemPhaseIndex === index ? "chip--active" : ""
                      }`}
                      onClick={() => {
                        goToProblemPhase(index);
                      }}
                    >
                      {problemPhaseMeta[phase].label}
                    </button>
                  ))}
                </section>
                <p className="section-subtitle">
                  {problemPhaseMeta[activeSlide.phase].label}
                </p>
                {showProblemPrompts ? (
                  <section className="content-section workshop-checks">
                    <div className="reveal-controls">
                      <p className="section-subtitle">
                        {revealTitle}: {visibleRevealItemCount} of {lessonContext.length}
                      </p>
                      <div className="reveal-controls__actions">
                        <button
                          type="button"
                          className="problem-card__action"
                          onClick={revealNext}
                          disabled={!canRevealMore}
                        >
                          Reveal next
                        </button>
                        <button
                          type="button"
                          className="problem-card__action"
                          onClick={revealReset}
                          disabled={visibleRevealItemCount <= 0}
                        >
                          Reset
                        </button>
                      </div>
                    </div>
                    <h4>{problemPhaseMeta[activeSlide.phase].revealTitle}</h4>
                    <div className="workshop-reveal-list">
                      {revealItems.map((prompt, index) => (
                        <label
                          key={`${activeWorkshop.problemSlug}-${index}`}
                          className="check-item"
                        >
                          <input
                            type="checkbox"
                            checked={Boolean(currentProblemState[prompt])}
                            onChange={() => toggleProblemCheck(prompt)}
                          />
                          {prompt}
                        </label>
                      ))}
                    </div>
                  </section>
                ) : null}
                {activeSlide.phase === "explanation" && audience === "student" ? (
                  <section className="content-section workshop-checks">
                    <p className="muted">
                      Instructor explanation details are shown only in presenter view.
                    </p>
                  </section>
                ) : null}
                {isProblemInstructorExplanationOnly ? (
                  <>
                    <section className="content-section workshop-trace">
                      <h4>ASCII trace walkthrough</h4>
                      <div className="workshop-trace__controls">
                        <button
                          type="button"
                          className="problem-card__action"
                          onClick={() => setTraceLine(traceLineIndex - 1)}
                          disabled={traceLineIndex === 0}
                        >
                          Previous line
                        </button>
                        <button
                          type="button"
                          className="problem-card__action"
                          onClick={() => setTraceLine(traceLineIndex + 1)}
                          disabled={
                            !activeProblem.traceAscii ||
                            traceLineIndex >= activeProblem.traceAscii.length - 1
                          }
                        >
                          Next line
                        </button>
                      </div>
                      <div className="visualizer__stream">
                        {activeProblem.traceAscii
                          .slice(0, traceLineIndex + 1)
                          .map((line, index) => (
                            <div
                              key={`${activeProblem.slug}-trace-${index}`}
                              className="visualizer__line"
                            >
                              {line}
                            </div>
                          ))}
                      </div>
                      <p className="section-subtitle">
                        Line {traceLineIndex + 1} of {activeProblem.traceAscii.length}
                      </p>
                    </section>
                    <section className="content-section workshop-code">
                      <div className="reveal-controls">
                        <h4>Reference implementation</h4>
                        <div className="reveal-controls__actions">
                          <button
                            type="button"
                            className={`chip ${activeProblemLanguage === "java" ? "chip--active" : ""}`}
                            onClick={() => setActiveProblemLanguage("java")}
                          >
                            Java primary
                          </button>
                          <button
                            type="button"
                            className={`chip ${activeProblemLanguage === "python" ? "chip--active" : ""}`}
                            onClick={() => setActiveProblemLanguage("python")}
                          >
                            Python reference
                          </button>
                        </div>
                      </div>
                      <CodeBlock
                        code={activeProblemSolution}
                        language={activeProblemLanguage}
                      />
                    </section>
                    <section className="content-section workshop-checks">
                      <h4>Step-by-step explanation</h4>
                      <ol>
                        {activeProblem.explanation.map((step) => (
                          <li key={`${activeProblem.slug}-${step}`}>{step}</li>
                        ))}
                      </ol>
                      <h4>Complexity</h4>
                      <p>Time: {activeProblem.timeComplexity}</p>
                      <p>Space: {activeProblem.spaceComplexity}</p>
                      <h4>Checkpoint checklist</h4>
                      {activeWorkshop.checkpoints.map((checkpoint) => (
                        <label
                          key={`${activeProblem.slug}-${checkpoint}`}
                          className="check-item"
                        >
                          <input
                            type="checkbox"
                            checked={Boolean(currentProblemState[checkpoint])}
                            onChange={() => toggleProblemCheck(checkpoint)}
                          />
                          {checkpoint}
                        </label>
                      ))}
                      <h4>Common mistakes to watch</h4>
                      <ul>
                        {(activeProblem.commonMistakes ?? activeWorkshop.commonBugs).map((bug) => (
                          <li key={`${activeWorkshop.problemSlug}-${bug}`}>{bug}</li>
                        ))}
                      </ul>
                      <p className="muted">
                        Stretch: {activeWorkshop.stretchQuestion}
                      </p>
                    </section>
                  </>
                ) : null}
                {audience === "presenter" ? (
                  <section className="content-section notes-workspace">
                    <h4>Live notes</h4>
                    <textarea
                      className="notes-workspace__box"
                      value={noteText}
                      onChange={(event) =>
                        setNotes((all) => ({
                          ...all,
                          [activeKey]: event.target.value,
                        }))
                      }
                      placeholder="Capture student responses and observations here."
                      aria-label="Slide notes"
                    />
                  </section>
                ) : null}
              </>
            ) : null}

            {audience === "presenter" && showPresenterHelpers && presenterTalkingPointGroups.length ? (
              <section className="content-section detail-pane detail-pane--presenter">
                <h4>Presenter talking points</h4>
                <div className="talking-point-groups">
                  {presenterTalkingPointGroups.map((group, groupIndex) => (
                    <details key={`${activeSlide.id}-group-${groupIndex}`} className="talking-point-group">
                      <summary className="talking-point-group__summary">
                        {group.heading}
                      </summary>
                      <ul className="talking-point-group__items">
                        {group.points.map((point, pointIndex) => (
                          <li
                            key={`${activeSlide.id}-point-${groupIndex}-${pointIndex}`}
                            className="talking-point"
                          >
                            {point.expansion?.length ? (
                              <details>
                                <summary>{point.bullet}</summary>
                                <ul>
                                  {point.expansion.map((expansion, expansionIndex) => (
                                    <li
                                      key={`${activeSlide.id}-expansion-${groupIndex}-${pointIndex}-${expansionIndex}`}
                                    >
                                      {expansion}
                                    </li>
                                  ))}
                                </ul>
                              </details>
                            ) : (
                              point.bullet
                            )}
                          </li>
                        ))}
                      </ul>
                    </details>
                  ))}
                </div>
              </section>
            ) : null}

            {activeSlide.kind === "problem" ? (
              <div className="problem-stage-nav">
                <button
                  type="button"
                  className="problem-card__action"
                  onClick={() =>
                    goToProblemPhase(Math.max(0, activeProblemPhaseIndex - 1))
                  }
                  disabled={activeProblemPhaseIndex === 0}
                >
                  Previous phase
                </button>
                <button
                  type="button"
                  className="problem-card__action"
                  onClick={() =>
                    goToProblemPhase(
                      Math.min(
                        problemPhaseOrder.length - 1,
                        activeProblemPhaseIndex + 1,
                      ),
                    )
                  }
                  disabled={activeProblemPhaseIndex === problemPhaseOrder.length - 1}
                >
                  Next phase
                </button>
              </div>
            ) : null}

            <div className="timeline-nav">
              <button
                type="button"
                className="problem-card__action"
                onClick={goPrevious}
                disabled={activeIndex === 0}
              >
                Previous slide
              </button>
              <button
                type="button"
                className="problem-card__action"
                onClick={goNext}
                disabled={activeIndex === slides.length - 1}
              >
                Next slide
              </button>
            </div>
          </article>
        </div>
      </section>
    </main>
  );
}
