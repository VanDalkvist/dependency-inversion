import { useState } from "react";
import { ArrowUpRight, Play, Check } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import type { ExperimentDefinition, ExperimentResult } from "./contracts";
export default function ExperimentPanel({
  experiment,
  initialConfiguration,
  onConfigurationChange,
}: {
  experiment: ExperimentDefinition;
  initialConfiguration?: Record<string, string>;
  onConfigurationChange?: (value: Record<string, string>) => void;
}) {
  const [config, setConfig] = useState<Record<string, string>>(() => ({
    ...Object.fromEntries(
      experiment.choices.map((c) => [c.id, c.options[0].id]),
    ),
    ...initialConfiguration,
  }));
  const [result, setResult] = useState<ExperimentResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  function run() {
    try {
      setResult(experiment.run(config));
      setError(null);
    } catch (e) {
      setError(
        e instanceof Error ? e.message : "Не удалось выполнить учебный прогон",
      );
      setResult(null);
    }
  }
  return (
    <section className="experiment" aria-label="Песочница">
      <div className="experiment-heading">
        <div>
          <h2>{experiment.title}</h2>
          <p>{experiment.description}</p>
        </div>
        <ArrowUpRight size={24} />
      </div>
      <div className="experiment-choices">
        {experiment.choices.map((choice) => (
          <label key={choice.id}>
            {choice.label}
            <select
              value={config[choice.id]}
              onChange={(e) => {
                const next = { ...config, [choice.id]: e.target.value };
                setConfig(next);
                onConfigurationChange?.(next);
                setResult(null);
                setError(null);
              }}
            >
              {choice.options.map((option) => (
                <option key={option.id} value={option.id}>
                  {option.label}
                </option>
              ))}
            </select>
          </label>
        ))}
      </div>
      <button className="run-button" onClick={run}>
        <Play size={15} />
        {experiment.runLabel ?? "Запустить пример"}
        <ArrowUpRight size={15} />
      </button>
      {error && <p role="alert">{error}</p>}
      <AnimatePresence mode="wait">
        {result && (
          <motion.div
            className="experiment-result"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            key={JSON.stringify(config)}
          >
            <p className="result-summary" role="status">
              <Check size={16} />
              {result.summary}
            </p>
            <div className="result-facts">
              {result.facts.map((f) => (
                <div key={f.label}>
                  <strong>{f.value}</strong>
                  <span>{f.label}</span>
                </div>
              ))}
            </div>
            <div className="result-trace">
              {result.trace.map((line, i) => (
                <span key={line}>
                  {i > 0 && <span aria-hidden="true">→ </span>}
                  {line}
                </span>
              ))}
            </div>
            <div className="artifacts">
              {result.artifacts.map((artifact) => (
                <details key={artifact.title} open>
                  <summary>
                    {artifact.title}
                    <span>{artifact.format}</span>
                  </summary>
                  <pre>{artifact.body}</pre>
                </details>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
