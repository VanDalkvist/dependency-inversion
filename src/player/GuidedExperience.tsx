import { useEffect, useReducer, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { ArrowLeft, ArrowRight, Check, Moon, RotateCcw, Sun } from "lucide-react";
import { useTheme } from "@vanya/ui";
import type { LessonLink, StoryDefinition } from "./contracts";
import { answerEvent, presentScene } from "./interaction";
import { createPlayback, playback, type PlaybackState } from "./playback";
import { guidedActionLabel, guidedBeat } from "./guided-copy";
import FocusedVisual from "./FocusedVisual";
import ExperimentPanel from "./ExperimentPanel";
import LessonDetails from "./LessonDetails";
import "./guided.css";

type Props = {
  story: StoryDefinition;
  navigation?: readonly LessonLink[];
  onExplore: (state: PlaybackState) => void;
  initialState?: PlaybackState | null;
};

export default function GuidedExperience({ story, navigation, onExplore, initialState }: Props) {
  // Exactly one state owner: this is the same reducer and action.perform()
  // used by the technical projection, without autoplay or a second fake model.
  const [state, dispatch] = useReducer(
    (s: ReturnType<typeof createPlayback>, e: Parameters<typeof playback>[2]) =>
      playback(story, s, e),
    initialState ?? createPlayback(),
  );
  const scene = presentScene(story.scenes[state.index], state);
  const beat = guidedBeat(story.id, scene);
  const answered = !!state.answers[scene.id];
  const last = state.index === story.scenes.length - 1;
  const { resolvedTheme, setTheme } = useTheme();
  const [practice, setPractice] = useState(false);
  const heading = useRef<HTMLHeadingElement>(null);
  const continueButton = useRef<HTMLButtonElement>(null);
  const firstScene = useRef(true);
  useEffect(() => {
    if (answered) continueButton.current?.focus();
  }, [answered]);
  const choose = (id: string) => {
    dispatch(answerEvent(scene, state, id));
    // The reducer's generic auto-play semantics remain available to the
    // technical film. Here a decision never starts an invisible countdown.
    dispatch({ type: "pause" });
  };
  const advance = () => {
    setPractice(false);
    dispatch({ type: "next" });
  };
  const retry = () => {
    setPractice(false);
    dispatch({ type: "reset" });
  };
  const selectedLabel = answered
    ? guidedActionLabel(story.id, scene, state.answers[scene.id])
    : null;
  const feedback = state.feedback
    ? (answered ? beat.result : beat.wrong?.[state.attempt ?? ""]) ?? state.feedback
    : null;
  const otherLessons = navigation?.filter((l) => !l.current) ?? [];

  return (
    <div className="experience" data-story={story.id} data-scene={scene.id}>
      <a className="skip-link" href="#experience-content">Перейти к истории</a>
      <header className="experience-header">
        <a className="experience-brand" href="/" aria-label="Vanya Arc / Aha! — интерактивные истории">
          <img src={resolvedTheme === "dark" ? "/aha-impulse-mark-dark.svg" : "/aha-impulse-mark.svg"}
            alt="" width="44" height="26" />
          <span>Vanya Arc <span className="experience-brand-slash">/</span> <strong>Aha!</strong></span>
        </a>
        <button className="experience-theme" type="button"
          aria-label={resolvedTheme === "dark" ? "Включить светлую тему" : "Включить тёмную тему"}
          onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}>
          {resolvedTheme === "dark" ? <Sun size={20} /> : <Moon size={20} />}
        </button>
      </header>

      <main className="experience-main" id="experience-content">
        <div className="experience-progress" aria-label={`Шаг ${state.index + 1} из ${story.scenes.length}`}>
          <span>История <b>{state.index + 1} / {story.scenes.length}</b></span>
          <div className="experience-progress-track" aria-hidden="true">
            <motion.div initial={false}
              animate={{ width: `${((state.index + 1) / story.scenes.length) * 100}%` }}
              transition={{ duration: .3 }} />
          </div>
        </div>

        <AnimatePresence mode="wait" initial={false}>
          <motion.article
            key={scene.id}
            className="experience-beat"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: .22 }}
            onAnimationComplete={() => {
              if (firstScene.current) firstScene.current = false;
              else heading.current?.focus();
            }}
          >
            <div className="experience-introduction">
              <p className="experience-eyebrow">{state.index === 0 ? "Начнём с обычной ситуации" : "Что происходит дальше"}</p>
              <h1 tabIndex={-1} ref={heading}>{state.index === 0 ? story.hook ?? beat.title : beat.title}</h1>
              <p className="experience-description">{beat.body}</p>
            </div>

            <div className="experience-illustration">
              <FocusedVisual storyId={story.id} sceneId={scene.id}
                index={state.index} state={state} />
            </div>

            <section className="experience-decision" aria-label="Твой следующий шаг">
              {!answered && !!scene.actions?.length ? (
                <>
                  <h2>{beat.nudge ?? "Что сделаем?"}</h2>
                  <div className="experience-options">
                    {scene.actions.map((action) => (
                      <button key={action.id} type="button"
                        className={`experience-option${state.attempt === action.id ? " was-attempted" : ""}`}
                        aria-pressed={state.attempt === action.id}
                        onClick={() => choose(action.id)}>
                        <span>{guidedActionLabel(story.id, scene, action.id)}</span>
                        <ArrowRight size={19} aria-hidden="true" />
                      </button>
                    ))}
                  </div>
                  {feedback && (
                    <p className="experience-feedback is-retry" role="status">{feedback}</p>
                  )}
                </>
              ) : (
                <>
                  {answered && selectedLabel && (
                    <p className="experience-selected"><Check size={18} aria-hidden="true" /> {selectedLabel}</p>
                  )}
                  {answered && feedback && (
                    <motion.p className="experience-feedback is-success" role="status"
                      initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}>
                      {feedback}
                    </motion.p>
                  )}
                  {last ? (
                    <div className="experience-finish">
                      <h2>Теперь ты знаешь главный принцип.</h2>
                      <p>{beat.result ?? story.purpose ?? "Инструменты меняются. Правила работы можно сохранить."}</p>
                      {scene.experiment && story.experiment && (
                        <button className="experience-primary" type="button"
                          aria-expanded={practice} onClick={() => setPractice((v) => !v)}>
                          {practice ? "Скрыть эксперимент" : "Попробовать свои инструменты"}
                          <ArrowRight size={20} aria-hidden="true" />
                        </button>
                      )}
                    </div>
                  ) : (
                    <button ref={continueButton} className="experience-primary" type="button" onClick={advance}>
                      {state.index === 0 && !answered ? "Начать историю" : answered ? "Посмотреть, что дальше" : "Продолжить"}
                      <ArrowRight size={20} aria-hidden="true" />
                    </button>
                  )}
                </>
              )}
            </section>
            {practice && scene.experiment && story.experiment && (
              <motion.div className="experience-practice" initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}>
                <ExperimentPanel experiment={story.experiment}
                  initialConfiguration={scene.experimentDefaults}
                  onConfigurationChange={(value) => dispatch({ type: "configuration", value })} />
              </motion.div>
            )}
          </motion.article>
        </AnimatePresence>

        <nav className="experience-secondary" aria-label="Дополнительно">
          {state.index > 0 && <button type="button" onClick={() => dispatch({ type: "previous" })}>
            <ArrowLeft size={16} aria-hidden="true" /> Назад
          </button>}
          <button type="button" onClick={retry}>
            <RotateCcw size={16} aria-hidden="true" /> С начала
          </button>
        </nav>
      </main>

      <footer className="experience-footer">
        <span>Для тех, кто хочет глубже</span>
        <div className="experience-extra-links">
          <button onClick={() => onExplore(state)} type="button">Исследовать схему и код</button>
          <LessonDetails conclusion={story.conclusion} sources={story.sources} />
          {otherLessons.map((item) => <a href={item.href} key={item.href}>{item.title}</a>)}
        </div>
      </footer>
    </div>
  );
}
