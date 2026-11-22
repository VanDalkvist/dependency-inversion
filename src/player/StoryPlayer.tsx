import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { ArrowUpRight, Maximize2, Moon, Sun } from "lucide-react";
import { useTheme } from "@vanya/ui";
import type { LessonLink, StoryDefinition } from "./contracts";
import { usePlayback } from "./usePlayback";
import { answerEvent } from "./interaction";
import Stage from "./Stage";
import Transport from "./Transport";
import Inspector from "./Inspector";
import ExperimentPanel from "./ExperimentPanel";
import Narration from "./Narration";
import LessonDetails from "./LessonDetails";
import "./layout.css";
type PlayerProps = {
  story: StoryDefinition;
  navigation?: readonly LessonLink[];
};
export default function StoryPlayer({ story, navigation }: PlayerProps) {
  return <PlayerSession key={story.id} story={story} navigation={navigation} />;
}

function PlayerSession({ story, navigation }: PlayerProps) {
  const { state, dispatch, scene } = usePlayback(story);
  const { resolvedTheme, setTheme } = useTheme();
  const screen = useRef<HTMLDivElement>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [pane, setPane] = useState<"graph" | "text">("text");
  // Each new scene returns mobile readers to the narrative action;
  // a previous graph inspection must not hide the next question.
  useEffect(() => setPane("text"), [scene.id]);
  function answer(id: string) {
    dispatch(answerEvent(scene, state, id));
    // The reader decides when to inspect the graph; don't steal focus or hide feedback.
  }
  const answered = !!state.answers[scene.id];
  const sceneViews =
    answered && scene.resolvedViews ? scene.resolvedViews : scene.views;
  const activeView =
    state.view in sceneViews ? state.view : Object.keys(sceneViews)[0];
  const view = sceneViews[activeView];
  const selected = view.nodes.find((n) => n.id === state.selectedNode);
  async function fullscreen() {
    try {
      if (document.fullscreenElement) await document.exitFullscreen();
      else if (screen.current?.requestFullscreen)
        await screen.current.requestFullscreen();
      else setNotice("Полноэкранный режим недоступен в этом браузере.");
    } catch {
      setNotice("Браузер не разрешил полноэкранный режим.");
    }
  }
  return (
    <div className={`app-shell${navigation?.length ? " has-lesson-nav" : ""}`}>
      <div className="lesson-screen">
        <a className="skip-link" href="#film">
          Перейти к фильму
        </a>
        <header className="site-header">
          <a className="wordmark" href="/" aria-label="Простые вещи">
            <span className="brand-mark">↗</span>
            <strong>Простые вещи</strong>
            <span className="brand-divider" />
            <span className="brand-description">
              Архитектура, которую можно потрогать
            </span>
          </a>
          {!!navigation?.length && (
            <nav className="lesson-nav" aria-label="Уроки">
              {navigation.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  aria-label={link.title}
                  aria-current={link.current ? "page" : undefined}
                >
                  {link.label}
                </a>
              ))}
            </nav>
          )}
          <div className="header-actions">
            <a
              className="home-link"
              href="https://vanya-arc.dev/"
              target="_blank"
              rel="noopener noreferrer"
            >
              vanya-arc.dev
              <ArrowUpRight size={13} />
            </a>
            <button
              className="icon-button"
              aria-label={
                resolvedTheme === "dark"
                  ? "Включить светлую тему"
                  : "Включить тёмную тему"
              }
              onClick={() =>
                setTheme(resolvedTheme === "dark" ? "light" : "dark")
              }
            >
              {resolvedTheme === "dark" ? (
                <Sun size={17} />
              ) : (
                <Moon size={17} />
              )}
            </button>
          </div>
        </header>
        <main className="lesson-main">
          <section className="intro">
            <div className="intro-copy">
              {story.hook && <p className="story-kicker">{story.title}</p>}
              <h1>{story.hook ?? story.title}</h1>
              <p>{story.subtitle}</p>
            </div>
            {story.purpose && (
              <p className="intro-purpose">
                <strong>Что увидишь</strong>
                {story.purpose}
              </p>
            )}
          </section>
          <div
            id="film"
            ref={screen}
            className="film"
            data-scene={scene.id}
            data-story={story.id}
            data-pane={pane}
          >
            <nav className="chapters" aria-label="Главы">
              {story.chapters.map((chapter, index) => (
                <button
                  key={chapter.id}
                  aria-current={
                    scene.chapter === chapter.id ? "step" : undefined
                  }
                  onClick={() =>
                    dispatch({
                      type: "seek",
                      index: story.scenes.findIndex(
                        (s) => s.chapter === chapter.id,
                      ),
                    })
                  }
                >
                  <span className="chapter-index">0{index + 1}</span>
                  {chapter.title}
                  {scene.chapter === chapter.id && (
                    <motion.span
                      layoutId="active-chapter"
                      className="chapter-active"
                    />
                  )}
                </button>
              ))}
            </nav>
            <div className="film-toolbar">
              <span className="scene-counter">
                {String(state.index + 1).padStart(2, "0")}{" "}
                <span>/ {String(story.scenes.length).padStart(2, "0")}</span>
              </span>
              <span className="film-topic" role="status">
                {scene.gate && !answered
                  ? "Твой ход: выбери вариант"
                  : state.playing
                    ? "История продолжается"
                    : "Исследуй сцену"}
              </span>
              <div
                className="pane-toggle"
                role="group"
                aria-label="Панель сцены"
              >
                <button
                  aria-pressed={pane === "graph"}
                  onClick={() => setPane("graph")}
                >
                  Схема
                </button>
                <button
                  aria-pressed={pane === "text"}
                  onClick={() => setPane("text")}
                >
                  Текст{scene.gate && !answered ? " · действие" : ""}
                </button>
              </div>
              {Object.keys(sceneViews).length > 1 && (
                <div
                  className="view-toggle"
                  role="group"
                  aria-label="Режим схемы"
                >
                  {Object.keys(sceneViews).map((key) => (
                    <button
                      key={key}
                      aria-pressed={activeView === key}
                      onClick={() => dispatch({ type: "view", view: key })}
                    >
                      {story.viewLabels?.[key] ?? key}
                    </button>
                  ))}
                </div>
              )}
              <button
                className="icon-button fullscreen-button"
                onClick={fullscreen}
                aria-label="Развернуть сцену"
              >
                <Maximize2 size={15} />
              </button>
            </div>
            {notice && (
              <p className="player-notice" role="status">
                {notice}
              </p>
            )}
            <p className="mobile-scene-title">{scene.title}</p>
            <div className="film-content">
              <div className="visual-stage">
                <Stage
                  view={view}
                  selected={state.selectedNode}
                  playing={state.playing}
                  onInspect={(id) => dispatch({ type: "inspect", id })}
                  onAction={answer}
                />
                <details className="stage-key">
                  <summary>Как читать схему</summary>
                  <div className="stage-legend">
                    <span>
                      <span className="legend-square contract-square" />
                      Контракт
                    </span>
                    <span>
                      <span className="legend-square" />
                      Реализация
                    </span>
                    <span className="inspect-hint">
                      {view.explicitControls
                        ? "Выбрать — подключить · ⓘ — подробности"
                        : "Нажми на блок для подробностей"}
                    </span>
                  </div>
                  <p className="graph-note">{view.note ?? ""}</p>
                </details>
              </div>
              <Narration
                key={scene.id}
                scene={scene}
                playing={state.playing}
                answered={answered}
                answer={state.attempt ?? state.answers[scene.id]}
                feedback={state.feedback}
                onAnswer={answer}
                hasNext={state.index < story.scenes.length - 1}
                onContinue={() => dispatch({ type: "continue" })}
                onShowVisual={() => setPane("graph")}
                onReadMore={() => dispatch({ type: "pause" })}
              />
            </div>
            <div className="caption">
              <span className="caption-symbol">↳</span>
              <AnimatePresence initial={false} mode="wait">
                <motion.p
                  key={scene.caption}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  {scene.caption}
                </motion.p>
              </AnimatePresence>
            </div>
            <Transport story={story} state={state} dispatch={dispatch} />
            {selected && (
              <Inspector
                node={selected}
                close={() => dispatch({ type: "inspect", id: null })}
              />
            )}
          </div>
        </main>
        <footer>
          <span>Простые вещи · интерактивные объяснения</span>
          <LessonDetails
            conclusion={story.conclusion}
            sources={story.sources}
          />
          <a href="https://motion.dev" target="_blank" rel="noreferrer">
            Motion × Hearth & Wave ↗
          </a>
        </footer>
      </div>
      {scene.experiment && story.experiment && (
        <section className="lesson-extras" aria-label="Практика">
          <ExperimentPanel
            experiment={story.experiment}
            initialConfiguration={scene.experimentDefaults}
            onConfigurationChange={(value) =>
              dispatch({ type: "configuration", value })
            }
          />
        </section>
      )}
    </div>
  );
}
