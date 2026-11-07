import type { StageView, StoryContext } from "../../player/contracts";
import { assemblyNodes, scenarioNode, warningNode } from "./nodes";
import type { Role } from "./catalog";
import { configuration, observation, type Observation } from "./lesson-model";
import { resultNodes } from "./result-nodes";
function bindings(
  context: StoryContext,
  phase: number,
  config: Record<string, string>,
  run: Observation | undefined,
): StageView["edges"] {
  const edges: StageView["edges"] = [];
  if (context.attempt === "inside")
    edges.push({
      id: "bad-selection",
      from: "scenario",
      to: "publisher-telegram",
      emphasis: true,
    });
  if (phase >= 4 && (phase > 4 || context.answers.inject === "objects"))
    for (const role of ["source", "writer", "publisher"] as Role[]) {
      const called = run?.calls.some(
        (c) =>
          c.operation ===
          (
            {
              source: "collect",
              writer: "write",
              publisher: "publish",
            } as const
          )[role],
      );
      if (!run || called)
        edges.push({
          id: `binding-${role}`,
          from: run ? "scenario" : `${role}-${config[role]}`,
          to: run ? `${role}-${config[role]}` : "scenario",
          emphasis: !!run || phase === 4,
        });
    }
  return edges;
}
function regions(
  context: StoryContext,
  phase: number,
  run: Observation | undefined,
): StageView["regions"] {
  return [
    {
      id: "application",
      label: "СЦЕНАРИЙ · application",
      x: 20,
      y: 20,
      width: 310,
      height: 490,
    },
    ...(phase > 0 || context.answers.root === "outside"
      ? [
          {
            id: "composition",
            label: "СБОРКА · аргумент ports",
            x: 350,
            y: 20,
            width: 315,
            height: 490,
          },
        ]
      : []),
    {
      id: "catalog",
      label:
        phase === 9
          ? "ТВОЙ НАБОР — ЗАПУСК НИЖЕ"
          : run && ![6, 7].includes(phase)
            ? "РЕЗУЛЬТАТ ПРОГОНА"
            : "ВЫБЕРИ РЕАЛИЗАЦИЮ",
      x: 690,
      y: 20,
      width: 305,
      height: 490,
    },
  ];
}
function note(phase: number, run: Observation | undefined) {
  return phase === 9
    ? "Настройки песочницы ниже сразу меняют эту сборку. Сценарий остаётся прежним."
    : run
      ? "Стрелки — реальные вызовы через порты. Карточки 1–3 показывают данные этого прогона; анимация иллюстрирует порядок."
      : phase <= 3
        ? "Нажми карточку с + или выбери действие справа. Выбранный объект переместится в сборку."
        : "Передаём объекты из сборки в сценарий. Это не стрелки импортов из урока DIP.";
}
export function lessonView(context: StoryContext, phase: number): StageView {
  const config = {
    ...configuration(context),
    ...(phase === 8 && !context.answers.probe ? { publisher: "probe" } : {}),
    ...(phase === 9 ? context.configuration : {}),
  };
  const bad = ["inside", "name", "rewrite", "type"].includes(
    context.attempt ?? "",
  );
  const run = phase === 9 ? undefined : observation(context);
  const nodes = [
    scenarioNode(context.attempt === "inside"),
    ...assemblyNodes(context, phase, config),
  ];
  if (bad) nodes.push(warningNode(context.attempt!));
  else if (run) nodes.push(...resultNodes(run, phase));
  return {
    nodes,
    edges: bindings(context, phase, config, run),
    flow: !!run,
    regions: regions(context, phase, run),
    note: note(phase, run),
  };
}
