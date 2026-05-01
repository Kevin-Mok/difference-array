import type { DifferenceArraysProblem } from "../data/problems";

interface ProblemCardProps {
  problem: DifferenceArraysProblem;
}

const slugClass = (value: string) => value.toLowerCase().replace(/[^a-z0-9]+/g, "-");

export function ProblemCard({ problem }: ProblemCardProps) {
  return (
    <article id={`card-${problem.slug}`} className="problem-card">
      <header className="problem-card__header">
        <div className="problem-card__titles">
          <p className="problem-card__index">Problem {problem.id}</p>
          <h3>{problem.title}</h3>
        </div>
        <div className="problem-card__metadata" aria-label="Problem metadata">
          {problem.practiceType ? (
            <span className={`difficulty-chip practice-${slugClass(problem.practiceType)}`}>
              {problem.practiceType}
            </span>
          ) : null}
          <span className={`difficulty-chip difficulty-${slugClass(problem.difficulty)}`}>
            {problem.difficulty}
          </span>
        </div>
      </header>

      <p className="problem-card__focus">{problem.conceptFocus}</p>

      <p className="problem-card__description">{problem.description}</p>

      {problem.source ? (
        <p className="problem-card__source">
          Source:{" "}
          <a href={problem.source.url} target="_blank" rel="noreferrer">
            {problem.source.label}
          </a>
        </p>
      ) : null}

      <div className="problem-card__samples">
        <section>
          <h4>Sample input</h4>
          <pre>{problem.sampleInput}</pre>
        </section>
        <section>
          <h4>Sample output</h4>
          <pre>{problem.sampleOutput}</pre>
        </section>
      </div>

      <p className="problem-card__complexity">
        Complexity: {problem.timeComplexity} time, {problem.spaceComplexity} space
      </p>

      <div className="problem-card__actions">
        <a href="#lesson-deck" className="problem-card__action">
          Open in lesson deck
        </a>
        {problem.codepadLinks ? (
          <>
            <a
              href={problem.codepadLinks.starterUrl}
              className="problem-card__action"
              target="_blank"
              rel="noreferrer"
            >
              Try in CoderPad
            </a>
            <a
              href={problem.codepadLinks.solutionUrl}
              className="problem-card__action"
              target="_blank"
              rel="noreferrer"
            >
              Solution CoderPad
            </a>
          </>
        ) : null}
      </div>
    </article>
  );
}
