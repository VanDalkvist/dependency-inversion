import type { StoryDefinition } from "./contracts";
export type PlaybackState = {
  index: number;
  elapsed: number;
  playing: boolean;
  speed: 1 | 1.5 | 2;
  view: string;
  answers: Record<string, string>;
  feedback: string | null;
  selectedNode: string | null;
};
export type PlaybackEvent =
  | { type: "play" }
  | { type: "pause" }
  | { type: "tick"; ms: number }
  | { type: "seek"; index: number; elapsed?: number }
  | { type: "next" }
  | { type: "previous" }
  | { type: "answer"; id: string }
  | { type: "speed"; speed: 1 | 1.5 | 2 }
  | { type: "view"; view: string }
  | { type: "inspect"; id: string | null }
  | { type: "reset" };
export const createPlayback = (): PlaybackState => ({
  index: 0,
  elapsed: 0,
  playing: false,
  speed: 1,
  view: "code",
  answers: {},
  feedback: null,
  selectedNode: null,
});
export function playback(
  story: StoryDefinition,
  state: PlaybackState,
  event: PlaybackEvent,
): PlaybackState {
  const scene = story.scenes[state.index];
  const seek = (index: number): PlaybackState => {
    const target = Math.max(
      0,
      Math.min(
        story.scenes.length - 1,
        Number.isFinite(index) ? Math.trunc(index) : 0,
      ),
    );
    return {
      ...state,
      index: target,
      elapsed: 0,
      playing: false,
      feedback: null,
      selectedNode: null,
      answers: Object.fromEntries(
        story.scenes
          .slice(0, target)
          .filter((s) => state.answers[s.id])
          .map((s) => [s.id, state.answers[s.id]]),
      ),
    };
  };
  if (!scene) return createPlayback();
  switch (event.type) {
    case "play":
      return state.index === story.scenes.length - 1 &&
        state.elapsed >= scene.duration
        ? { ...createPlayback(), playing: true, speed: state.speed }
        : { ...state, playing: true };
    case "pause":
      return { ...state, playing: false };
    case "tick": {
      if (!state.playing || !Number.isFinite(event.ms) || event.ms <= 0)
        return state;
      const elapsed = Math.min(
        scene.duration,
        state.elapsed + event.ms * state.speed,
      );
      if (elapsed < scene.duration) return { ...state, elapsed };
      if (scene.gate && !state.answers[scene.id])
        return { ...state, elapsed, playing: false };
      if (state.index === story.scenes.length - 1)
        return { ...state, elapsed, playing: false };
      return {
        ...state,
        index: state.index + 1,
        elapsed: 0,
        feedback: null,
        selectedNode: null,
      };
    }
    case "seek": {
      const next = seek(event.index);
      return {
        ...next,
        elapsed: Math.max(
          0,
          Math.min(
            story.scenes[next.index].duration,
            Number.isFinite(event.elapsed) ? event.elapsed! : 0,
          ),
        ),
      };
    }
    case "previous":
      return seek(state.index - 1);
    case "next":
      return scene.gate && !state.answers[scene.id]
        ? {
            ...state,
            playing: false,
            feedback: "Выбери действие в этой сцене, затем продолжай просмотр.",
          }
        : seek(state.index + 1);
    case "answer": {
      const action = scene.actions?.find((a) => a.id === event.id);
      if (!action) return state;
      return {
        ...state,
        playing: false,
        feedback: action.feedback,
        answers: action.correct
          ? { ...state.answers, [scene.id]: action.id }
          : state.answers,
      };
    }
    case "speed":
      return [1, 1.5, 2].includes(event.speed)
        ? { ...state, speed: event.speed }
        : state;
    case "view":
      return { ...state, view: event.view, selectedNode: null };
    case "inspect":
      return { ...state, selectedNode: event.id, playing: false };
    case "reset":
      return createPlayback();
  }
}
