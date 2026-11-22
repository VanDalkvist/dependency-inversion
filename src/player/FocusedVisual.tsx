import { AnimatePresence, motion } from "motion/react";
import { Check, FileText, Radio, Send, Sparkles } from "lucide-react";
import type { PlaybackState } from "./playback";

type Observation = {
  received?: number;
  selected?: number;
  draft?: { title?: string };
  artifacts?: { title: string; format: string; body: string }[];
  config?: { publisher?: string };
};

function selection(value: string | undefined, options: Record<string, string>) {
  return value ? (options[value] ?? value) : "Пока не выбран";
}
function FlowStep({
  label,
  value,
  active,
  ready,
  icon: Icon,
}: {
  label: string;
  value: string;
  active: boolean;
  ready: boolean;
  icon: typeof Radio;
}) {
  return (
    <motion.div
      layout="position"
      className={`focus-step${active ? " is-active" : ""}${ready ? " is-ready" : ""}`}
    >
      <span className="focus-step-icon"><Icon size={22} aria-hidden="true" /></span>
      <span className="focus-step-label">{label}</span>
      <AnimatePresence mode="wait" initial={false}>
        <motion.strong
          key={value}
          initial={{ opacity: 0, y: 7 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -7 }}
          transition={{ duration: 0.2 }}
        >
          {value}
        </motion.strong>
      </AnimatePresence>
      {ready && <Check className="focus-step-done" size={18} aria-hidden="true" />}
    </motion.div>
  );
}

export default function FocusedVisual({
  storyId,
  sceneId,
  index,
  state,
}: {
  storyId: string;
  sceneId: string;
  index: number;
  state: PlaybackState;
}) {
  const isDi = storyId === "dependency-injection";
  const answers = state.answers;
  const run = (state.results.probe ?? state.results.swap ?? state.results.run) as Observation | undefined;
  if (isDi && sceneId === "root" && !answers.root) {
    return (
      <div className="focus-visual" role="img" aria-label="Помощник готовит выпуск: получает материалы, пишет текст и публикует">
        <motion.div className="focus-helper" initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }}>
          <span className="focus-helper-icon"><Sparkles size={35} aria-hidden="true" /></span>
          <strong>Твой помощник</strong>
          <span>Находит новости · готовит выпуск · публикует</span>
        </motion.div>
      </div>
    );
  }
  const publisher = answers.probe === "probe"
    ? "Запись выпуска"
    : selection(answers.swap ?? answers.channel, { telegram: "Telegram", website: "Сайт" });
  const source = selection(answers.source, { rss: "Новостная лента", aggregate: "Подборка новостей" });
  const writer = selection(answers.writer, { cloud: "Облачный AI", local: "Локальный AI" });
  if (isDi) {
    return (
      <div className="focus-visual" aria-label="Три этапа работы помощника">
        <div className="focus-workflow">
          <FlowStep icon={Radio} label="Получить" value={source} ready={!!answers.source}
            active={sceneId === "source"} />
          <span className="focus-connector" aria-hidden="true">→</span>
          <FlowStep icon={Sparkles} label="Написать" value={writer} ready={!!answers.writer}
            active={sceneId === "writer"} />
          <span className="focus-connector" aria-hidden="true">→</span>
          <FlowStep icon={Send} label="Передать" value={publisher} ready={!!answers.channel}
            active={["channel", "swap", "probe"].includes(sceneId)} />
        </div>
        {run && ["run", "swap", "probe", "sandbox"].includes(sceneId) && (
          <motion.div className="focus-proof" key={sceneId} initial={{ opacity: 0, y: 9 }}
            animate={{ opacity: 1, y: 0 }} aria-live="polite">
            <FileText size={23} aria-hidden="true" />
            <div>
              <strong>{run.config?.publisher === "probe" ? "Черновик записан" : "Выпуск собран"}</strong>
              <span>{typeof run.selected === "number" ? `Из ${run.received} материалов выбрано ${run.selected}` : "Инструменты выполнили учебный прогон"}.
                {run.artifacts?.length ? ` Создано документов: ${run.artifacts.length}.` : ""}</span>
            </div>
          </motion.div>
        )}
      </div>
    );
  }

  const hasRule = !!answers.invert || index >= 4;
  const hasWebsite = !!answers.growth || index >= 2;
  return (
    <div className="focus-visual" aria-label="Как помощник связан со способом публикации">
      <div className="focus-principle">
        <motion.div layout className="focus-principle-helper">
          <span className="focus-step-icon"><Sparkles size={24} aria-hidden="true" /></span>
          <strong>Помощник</strong>
          <span>Готовит один выпуск</span>
        </motion.div>
        <span className="focus-principle-arrow" aria-hidden="true">→</span>
        <AnimatePresence mode="wait" initial={false}>
          {hasRule ? (
            <motion.div key="rule" className="focus-principle-rule"
              initial={{ opacity: 0, scale: 0.94 }} animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }} transition={{ duration: .25 }}>
              <strong>«Опубликовать выпуск»</strong>
              <span>Одно правило для любого канала</span>
            </motion.div>
          ) : (
            <motion.div key="direct" className="focus-principle-direct"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <strong>Команды Telegram</strong>
              <span>Помощник знает конкретный сервис</span>
            </motion.div>
          )}
        </AnimatePresence>
        <span className="focus-principle-arrow" aria-hidden="true">→</span>
        <div className="focus-principle-services">
          <span>Telegram</span>
          {hasWebsite && <motion.span initial={{ opacity: 0, y: 9 }}
            animate={{ opacity: 1, y: 0 }}>Сайт</motion.span>}
        </div>
      </div>
      <p className="focus-visual-summary">
        {hasRule
          ? "Правила работы остаются у помощника. Сервисы подстраиваются под них."
          : "Пока всё работает, но смена канала заставляет менять самого помощника."}
      </p>
    </div>
  );
}
