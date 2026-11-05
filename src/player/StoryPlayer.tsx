import { useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { ArrowUpRight, Maximize2, Moon, Sun } from "lucide-react";
import { useTheme } from "@vanya/ui";
import type { StoryDefinition } from "./contracts";
import { usePlayback } from "./usePlayback";
import Stage from "./Stage";
import Transport from "./Transport";
import Inspector from "./Inspector";
import ExperimentPanel from "./ExperimentPanel";
import Narration from "./Narration";
import LessonDetails from "./LessonDetails";
import "./layout.css";
export default function StoryPlayer({ story }: { story: StoryDefinition }) {
  return <PlayerSession key={story.id} story={story} />;
}

function PlayerSession({ story }: { story: StoryDefinition }) {
  const { state, dispatch, scene } = usePlayback(story);
  const { resolvedTheme, setTheme } = useTheme();
  const screen = useRef<HTMLDivElement>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [pane, setPane] = useState<"graph" | "text">("text");
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
    <div className="app-shell">
      <div className="lesson-screen">
      <a className="skip-link" href="#film">
        Перейти к фильму
      </a>
      <header className="site-header">
        <a className="wordmark" href="#">
          <span className="brand-mark">↗</span>
          <strong>Простые вещи</strong>
          <span className="brand-divider" />
          <span className="brand-description">
            Архитектура, которую можно потрогать
          </span>
        </a>
        <div className="header-actions">
          <a className="home-link" href="https://vanya-arc.dev/">
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
            {resolvedTheme === "dark" ? <Sun size={17} /> : <Moon size={17} />}
          </button>
        </div>
      </header>
      <main className="lesson-main">
        <section className="intro">
          <div>
            <h1>{story.title}</h1>
            <p>{story.subtitle}</p>
          </div>

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
                aria-current={scene.chapter === chapter.id ? "step" : undefined}
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
            <span className="film-topic">{story.topic ?? story.subtitle}</span>
            <div className="pane-toggle" role="group" aria-label="Панель сцены">
              <button aria-pressed={pane === "graph"} onClick={() => setPane("graph")}>Схема</button>
              <button aria-pressed={pane === "text"} onClick={() => setPane("text")}>Текст{scene.gate && !answered ? " · действие" : ""}</button>
            </div>
            <div className="view-toggle" role="group" aria-label="Режим схемы">
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
              />
              <div className="stage-legend">
                <span>
                  <span className="legend-square contract-square" />
                  Контракт
                </span>
                <span>
                  <span className="legend-square" />
                  Реализация
                </span>
                <span className="inspect-hint">Нажми на блок ↗</span>
                <span className="mobile-stage-hint">
                  ↗ Детали — по клику на блок
                </span>
              </div>
              <p className="graph-note">{view.note ?? " "}</p>
            </div>
            <Narration
              key={scene.id}
              scene={scene}
              playing={state.playing}
              answered={answered}
              answer={state.answers[scene.id]}
              feedback={state.feedback}
              onAnswer={(id) => dispatch({ type: "answer", id })}
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
        <LessonDetails conclusion={story.conclusion} sources={story.sources} />
        <a href="https://motion.dev" target="_blank" rel="noreferrer">
          Motion × Hearth & Wave ↗
        </a>
      </footer>
      </div>
      {scene.experiment && story.experiment && <section className="lesson-extras" aria-label="Практика"><ExperimentPanel experiment={story.experiment} /></section>}
    </div>
  );
}
