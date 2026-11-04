import { Pause, Play, RotateCcw, SkipBack, SkipForward } from "lucide-react";
import type { Dispatch } from "react";
import type { StoryDefinition } from "./contracts";
import type { PlaybackEvent, PlaybackState } from "./playback";
const clock = (ms: number) =>
  `${Math.floor(ms / 60000)
    .toString()
    .padStart(
      2,
      "0",
    )}:${Math.floor(ms / 1000) % 60 < 10 ? "0" : ""}${Math.floor(ms / 1000) % 60}`;
export default function Transport({
  story,
  state,
  dispatch,
}: {
  story: StoryDefinition;
  state: PlaybackState;
  dispatch: Dispatch<PlaybackEvent>;
}) {
  const total = story.scenes.reduce((n, s) => n + s.duration, 0);
  const before = story.scenes
    .slice(0, state.index)
    .reduce((n, s) => n + s.duration, 0);
  function seek(ms: number) {
    let rest = ms,
      index = 0;
    while (
      index < story.scenes.length - 1 &&
      rest >= story.scenes[index].duration
    ) {
      rest -= story.scenes[index].duration;
      index++;
    }
    dispatch({ type: "seek", index, elapsed: rest });
  }
  return (
    <div className="transport">
      <div className="transport-controls">
        <button
          className="play-button"
          aria-label={state.playing ? "Пауза" : "Воспроизвести"}
          onClick={() => dispatch({ type: state.playing ? "pause" : "play" })}
        >
          {state.playing ? (
            <Pause size={16} />
          ) : (
            <Play size={16} fill="currentColor" />
          )}
          <span>{state.playing ? "Пауза" : "Смотреть"}</span>
        </button>
        <button
          className="icon-button"
          aria-label="Предыдущая сцена"
          disabled={state.index === 0}
          onClick={() => dispatch({ type: "previous" })}
        >
          <SkipBack size={16} />
        </button>
        <button
          className="icon-button"
          aria-label="Следующая сцена"
          disabled={state.index === story.scenes.length - 1}
          onClick={() => dispatch({ type: "next" })}
        >
          <SkipForward size={16} />
        </button>
        <span className="timecode" aria-label="Позиция фильма">
          {clock(before + state.elapsed)} <span>/ {clock(total)}</span>
        </span>
        <select
          className="speed-select"
          aria-label="Скорость воспроизведения"
          value={state.speed}
          onChange={(e) =>
            dispatch({
              type: "speed",
              speed: Number(e.target.value) as 1 | 1.5 | 2,
            })
          }
        >
          <option value={1}>1×</option>
          <option value={1.5}>1.5×</option>
          <option value={2}>2×</option>
        </select>
        <button
          className="icon-button"
          aria-label="Начать сначала"
          onClick={() => dispatch({ type: "reset" })}
        >
          <RotateCcw size={15} />
        </button>
      </div>
      <input
        className="film-scrubber"
        type="range"
        aria-label="Позиция на таймлайне"
        min={0}
        max={total}
        step={100}
        value={before + state.elapsed}
        onChange={(e) => seek(Number(e.target.value))}
      />
      <div className="scene-ticks">
        {story.scenes.map((scene, index) => (
          <button
            key={scene.id}
            title={scene.title}
            aria-label={`Перейти к сцене ${index + 1}: ${scene.title}`}
            aria-current={index === state.index ? "step" : undefined}
            onClick={() => dispatch({ type: "seek", index })}
          >
            <span className={index < state.index ? "tick-done" : ""} />
            <span className="tick-index">
              {String(index + 1).padStart(2, "0")}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
