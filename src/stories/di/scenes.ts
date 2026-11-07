import type { StoryScene, StoryContext } from "../../player/contracts";
import { lessonView } from "./graphs";
import { configuration, observation } from "./lesson-model";
import { assemblyScenes } from "./assembly-scenes";
import { executionScenes } from "./execution-scenes";
const specs = [...assemblyScenes, ...executionScenes];
function project(
  scene: (typeof specs)[number],
  phase: number,
  context: StoryContext,
) {
  const view = lessonView(context, phase);
  const actions =
    scene.id === "swap"
      ? scene.actions?.filter(
          (a) =>
            a.id === "rewrite" ||
            a.id !== (context.answers.channel ?? "telegram"),
        )
      : scene.actions;
  const preset =
    phase > 1 &&
    phase < 8 &&
    (!context.answers.source ||
      (phase > 2 && !context.answers.writer) ||
      (phase > 3 && !context.answers.channel));
  return {
    views: {
      [observation(context) && phase >= 5 && phase < 8
        ? "runtime"
        : "assembly"]: view,
    },
    actions,
    body: preset
      ? `${scene.body} При прямом переходе недостающие сервисы взяты из учебного набора.`
      : scene.body,
    experimentDefaults: {
      ...configuration(context),
      ...(phase === 8 ? context.configuration : {}),
    },
  };
}
export const injectionScenes: StoryScene[] = specs.map((scene, phase) => ({
  ...scene,
  revealOnAction: true,
  views: { assembly: { nodes: [], edges: [] } },
  project: (context) => project(scene, phase, context),
}));
