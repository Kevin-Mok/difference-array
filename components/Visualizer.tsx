import { CodeBlock } from "./CodeBlock";

interface VisualizerProps {
  solution: string;
  trace: string[];
  language?: "java" | "python";
}

export function Visualizer({ solution, trace, language = "java" }: VisualizerProps) {
  return (
    <div className="visualizer">
      <section className="visualizer__panel">
        <header className="visualizer__header">
          <span className="visualizer__title">
            {language === "java" ? "Java solution" : "Python solution"}
          </span>
          <span className="visualizer__meta">read-only reference</span>
        </header>
        <CodeBlock code={solution} language={language} />
      </section>
      <section className="visualizer__panel visualizer__terminal">
        <header className="visualizer__header">
          <span className="visualizer__title">Terminal trace</span>
          <span className="visualizer__meta">step-by-step state</span>
        </header>
        <div className="visualizer__stream" aria-label="Algorithm trace">
          {trace.map((line, index) => (
            <div
              key={`${line.slice(0, 18)}-${index}`}
              className="visualizer__line"
            >
              {line}
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
