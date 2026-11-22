import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import Dialog from "./Dialog";
import { ArrowRight, Check, Info, Pause, X } from "lucide-react";
import type { StoryScene } from "./contracts";
export default function Narration({
  scene,
  playing,
  answered,
  answer,
  feedback,
  onAnswer,
  hasNext,
  onContinue,
  onShowVisual,
}: {
  scene: StoryScene;
  playing: boolean;
  answered: boolean;
  answer?: string;
  feedback: string | null;
  onAnswer: (id: string) => void;
  hasNext: boolean;
  onContinue: () => void;
  onShowVisual: () => void;
}) {
  const [readingOriginal, setReadingOriginal] = useState(false);
  const [insightOpen, setInsightOpen] = useState(false);
  return (
    <aside className="narration">
      <div className="narration-status">
        {scene.gate && !answered ? (
          <>
            <Pause size={12} />
            Выбери действие
          </>
        ) : answered ? (
          <>
            <Check size={13} />
            Получилось!
          </>
        ) : (
          <>
            <span className="status-dot" />
            {playing ? "Воспроизведение" : "На паузе"}
          </>
        )}
        {scene.insight && (
          <button
            className="insight-button"
            onClick={() => setInsightOpen(true)}
          >
            <Info size={13} />
            Почему это важно
          </button>
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
          <p className="narration-body" hidden={!!feedback && !readingOriginal}>
            {scene.body}
          </p>
        </motion.div>
      </AnimatePresence>
      {scene.actions && (
        <div className="scene-actions">
          {scene.actions.map((action) => (
            <button
              key={action.id}
              onClick={() => {
                setReadingOriginal(false);
                onAnswer(action.id);
              }}
              aria-pressed={answer === action.id}
            >
              {action.label}
              <span>
                {answer === action.id ? (
                  action.correct ? (
                    <Check size={15} />
                  ) : (
                    <X size={15} />
                  )
                ) : (
                  <ArrowRight size={15} />
                )}
              </span>
            </button>
          ))}
        </div>
      )}
      <div
        className="action-feedback"
        role="status"
        aria-live="polite"
        hidden={readingOriginal}
      >
        {feedback}
      </div>
      {feedback && (
        <button
          className="feedback-switch"
          onClick={() => setReadingOriginal(!readingOriginal)}
        >
          {readingOriginal ? "Показать ответ" : "Показать объяснение"}
        </button>
      )}
      {answered && (
        <button className="mobile-show-graph" onClick={onShowVisual}>
          Посмотреть, что изменилось на схеме <ArrowRight size={15} />
        </button>
      )}
      {answered && hasNext && (
        <button className="scene-continue" onClick={onContinue}>
          Дальше сейчас <ArrowRight size={16} />
        </button>
      )}
      <div className="narration-bottom">
        {insightOpen && scene.insight && (
          <Dialog
            title="Почему это важно"
            onClose={() => setInsightOpen(false)}
          >
            <p>{scene.insight}</p>
          </Dialog>
        )}
      </div>
    </aside>
  );
}
