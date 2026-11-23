import { useEffect, useReducer, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { ArrowLeft, ArrowRight, Check, RotateCcw } from "lucide-react";
import { ActionButton, ThemeToggle, WorkflowStrip, useTheme } from "@vanya/ui";
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
  const journey = (story.guidedScenes?.length
    ? story.guidedScenes.map((id) => story.scenes.findIndex((scene) => scene.id === id))
      .filter((index) => index >= 0)
    : story.scenes.map((_, index) => index));
  const starting = initialState ?? createPlayback();
  // Technical mode has all scenes. If its current scene is outside the short
  // reader journey, return to the nearest earlier chapter without duplicating
  // or synthesizing any answers/results.
  const startingIndex = journey.includes(starting.index)
    ? starting.index
    : ([...journey].reverse().find((index) => index <= starting.index) ?? journey[0]);
  const [state, dispatch] = useReducer(
    (s: PlaybackState, e: Parameters<typeof playback>[2]) => playback(story, s, e),
    { ...starting, index: startingIndex, playing: false, resumeAfterInspect: false },
  );
  const journeyPosition = journey.indexOf(state.index);
  const step = journeyPosition < 0 ? 0 : journeyPosition;
  const scene = presentScene(story.scenes[state.index], state);
  const beat = guidedBeat(story.id, scene);
  const answered = !!state.answers[scene.id];
  const isFinal = step === journey.length - 1;
  const { resolvedTheme } = useTheme();
  const reduced = useReducedMotion();
  const [practice, setPractice] = useState(false);
  const heading = useRef<HTMLHeadingElement>(null);
  const firstScene = useRef(true);
  useEffect(() => {
    if (firstScene.current) {
      firstScene.current = false;
      return;
    }
    if (reduced) heading.current?.focus();
  }, [scene.id, reduced]);
  useEffect(() => {
    if (answered) document.querySelector<HTMLButtonElement>(".experience-primary")?.focus();
  }, [answered]);

  function choose(id: string) {
    dispatch(answerEvent(scene, state, id));
    // An answer never starts a hidden countdown in the reader's story.
    dispatch({ type: "pause" });
  }
  function advance() {
    if (scene.gate && !answered) return;
    if (isFinal) return;
    setPractice(false);
    dispatch({ type: "seek", index: journey[step + 1] });
  }
  function back() {
    if (step <= 0) return;
    setPractice(false);
    dispatch({ type: "seek", index: journey[step - 1] });
  }
  function retry() {
    setPractice(false);
    dispatch({ type: "reset" });
  }
  const selectedLabel = answered
    ? guidedActionLabel(story.id, scene, state.answers[scene.id])
    : null;
  const feedback = state.feedback
    ? (answered ? beat.result : beat.wrong?.[state.attempt ?? ""]) ?? state.feedback
    : null;
  const otherLessons = navigation?.filter((link) => !link.current) ?? [];

  return (
    <div className="experience" data-story={story.id} data-scene={scene.id} data-guided-step={step + 1}>
      <a className="skip-link" href="#experience-content">К истории</a>
      <header className="experience-header">
        <a className="experience-brand" href="/" aria-label="Vanya Arc / Aha! — интерактивные истории">
          <img src={resolvedTheme === "dark" ? "/aha-impulse-mark-dark.svg" : "/aha-impulse-mark.svg"}
            alt="" width="44" height="26" />
          <span>Vanya Arc <span className="experience-brand-slash">/</span> <strong>Aha!</strong></span>
        </a>
        <ThemeToggle className="experience-theme" variant="dropdown" />
      </header>

      <main className="experience-main" id="experience-content">
        <WorkflowStrip
          className="experience-progress"
          label="История Ани"
          status={`${step + 1} из ${journey.length}`}
          progress={{ value: step + 1, max: journey.length, label: "Пройденная часть истории" }}
        />

        <AnimatePresence mode="wait" initial={false}>
          <motion.article
            key={scene.id}
            className="experience-beat"
            initial={reduced ? false : { opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reduced ? undefined : { opacity: 0, y: -10 }}
            transition={{ duration: reduced ? 0 : .23 }}
            onAnimationComplete={() => {
              if (!reduced) heading.current?.focus();
            }}
          >
            <div className="experience-introduction">
              <span className="experience-eyebrow">{step === 0 ? "Всё началось с обычного выпуска" : "История продолжается"}</span>
              <h1 tabIndex={-1} ref={heading}>{beat.title}</h1>
              <p className="experience-description">{beat.body}</p>
            </div>

            <div className="experience-illustration">
              <FocusedVisual storyId={story.id} sceneId={scene.id} index={state.index} state={state} />
            </div>

            <section className="experience-decision" aria-label="Следующий шаг истории">
              {!answered && !!scene.actions?.length ? (
                <>
                  <h2>{beat.nudge ?? "Что сделает Аня?"}</h2>
                  <div className="experience-options">
                    {scene.actions.map((action) => (
                      <ActionButton
                        key={action.id}
                        variant="outline"
                        size="md"
                        type="button"
                        className="experience-option"
                        data-attempted={state.attempt === action.id || undefined}
                        onClick={() => choose(action.id)}
                      >
                        <span>{guidedActionLabel(story.id, scene, action.id)}</span>
                        <ArrowRight size={20} aria-hidden="true" />
                      </ActionButton>
                    ))}
                  </div>
                  {feedback && <p className="experience-feedback is-retry" role="status">{feedback}</p>}
                </>
              ) : (
                <>
                  {answered && selectedLabel &&
                    <p className="experience-selected"><Check size={18} aria-hidden="true"/> {selectedLabel}</p>}
                  {answered && feedback && (
                    <motion.p className="experience-feedback is-success" role="status"
                      initial={reduced ? false : {opacity:0,y:6}} animate={{opacity:1,y:0}}
                      transition={{duration:reduced ? 0 : .2}}>
                      {feedback}
                    </motion.p>
                  )}
                  {isFinal ? (
                    <div className="experience-finish">
                      <h2>{story.id === "dependency-injection"
                        ? "Аня может менять инструменты перед каждым выпуском"
                        : "У Ани теперь два способа публиковать новости"}</h2>
                      <p>{beat.result ?? story.purpose}</p>
                      {scene.experiment && story.experiment && (
                        <ActionButton variant="accent" size="md" className="experience-primary"
                          type="button" aria-expanded={practice}
                          onClick={() => setPractice((open) => !open)}>
                          {practice ? "Свернуть пробный выпуск" : "Собрать другой выпуск"}
                          <ArrowRight size={20} aria-hidden="true"/>
                        </ActionButton>
                      )}
                    </div>
                  ) : (
                    <ActionButton variant="accent" size="md" className="experience-primary"
                      type="button" onClick={advance}>
                      {beat.next ?? (step === 0 && !answered
                        ? "Посмотреть, что случилось дальше"
                        : "Продолжить историю")}
                      <ArrowRight size={20} aria-hidden="true"/>
                    </ActionButton>
                  )}
                </>
              )}
            </section>

            {practice && scene.experiment && story.experiment && (
              <motion.div className="experience-practice" initial={reduced ? false : {opacity:0}}
                animate={{opacity:1}}>
                <ExperimentPanel experiment={story.experiment}
                  initialConfiguration={scene.experimentDefaults}
                  onConfigurationChange={(value) => dispatch({ type: "configuration", value })}/>
              </motion.div>
            )}
          </motion.article>
        </AnimatePresence>

        <nav className="experience-secondary" aria-label="Навигация по истории">
          {step > 0 &&
            <ActionButton size="md" variant="text" type="button" onClick={back}>
              <ArrowLeft size={17} aria-hidden="true"/> Назад
            </ActionButton>}
          <ActionButton size="md" variant="text" type="button" onClick={retry}>
            <RotateCcw size={17} aria-hidden="true"/> С начала
          </ActionButton>
        </nav>
      </main>

      <footer className="experience-footer">
        <span>Учебная история · вымышленный пример</span>
        <div className="experience-extra-links">
          <ActionButton size="md" variant="text" type="button" onClick={() => onExplore(state)}>
            Посмотреть схему и код
          </ActionButton>
          <a href="/series/">Сериал «Фабрика Ани»</a>
          <LessonDetails conclusion={story.conclusion} sources={story.sources} />
          {otherLessons.map((item) => <a href={item.href} key={item.href}>{item.title}</a>)}
        </div>
      </footer>
    </div>
  );
}
