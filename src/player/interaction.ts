import type { StoryContext, StoryScene } from "./contracts";
export function presentScene(
  scene: StoryScene,
  context: StoryContext,
): StoryScene {
  return scene.project ? { ...scene, ...scene.project(context) } : scene;
}
export function answerEvent(
  scene: StoryScene,
  context: StoryContext,
  id: string,
) {
  const action = scene.actions?.find((a) => a.id === id);
  const next = {
    ...context,
    attempt: id,
    answers: action?.correct
      ? { ...context.answers, [scene.id]: id }
      : context.answers,
  };
  try {
    return { type: "answer" as const, id, result: action?.perform?.(next) };
  } catch (error) {
    return {
      type: "answer" as const,
      id,
      error:
        error instanceof Error
          ? error.message
          : "Не удалось выполнить действие",
    };
  }
}
