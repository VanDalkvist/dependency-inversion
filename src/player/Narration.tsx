import { AnimatePresence, motion } from "motion/react";
import { ArrowRight, Check, Info, Pause } from "lucide-react";
import type { StoryScene } from "./contracts";
export default function Narration({
  scene,
  playing,
  answered,
  answer,
  feedback,
  hasNext,
  onAnswer,
  onNext,
}: {
  scene: StoryScene;
  playing: boolean;
  answered: boolean;
  answer?: string;
  feedback: string | null;
  hasNext: boolean;
  onAnswer: (id: string) => void;
  onNext: () => void;
}) {
  return (
    <aside className="narration">
      <div className="narration-status">
        {scene.gate && !answered ? (
          <>
            <Pause size={12} />
            Твоё действие
          </>
        ) : answered ? (
          <>
            <Check size={13} />
            Проверено
          </>
        ) : (
          <>
            <span className="status-dot" />
            {playing ? "История идёт" : "История ждёт"}
          </>
        )}
      </div>
      <AnimatePresence initial={false} mode="wait">
        <motion.div
          key={scene.id}
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -5 }}
        >
          <h2>{scene.title}</h2>
          <p className="narration-body">{scene.body}</p>
        </motion.div>
      </AnimatePresence>
      {scene.actions && (
        <div className="scene-actions">
          {scene.actions.map((action) => (
            <button
              key={action.id}
              onClick={() => onAnswer(action.id)}
              aria-pressed={answer === action.id}
            >
              {action.label}
              <span>
                {answer === action.id ? (
                  <Check size={15} />
                ) : (
                  <ArrowRight size={15} />
                )}
              </span>
            </button>
          ))}
        </div>
      )}
      <div className="action-feedback" role="status" aria-live="polite">
        {feedback}
      </div>
      <div className="narration-bottom">
        {scene.insight && (
          <p>
            <Info size={14} />
            {scene.insight}
          </p>
        )}
        {hasNext && (
          <button
            className="continue-button"
            onClick={() => onNext()}
            disabled={!!scene.gate && !answered}
          >
            Следующий кадр
            <ArrowRight size={16} />
          </button>
        )}
      </div>
    </aside>
  );
}
