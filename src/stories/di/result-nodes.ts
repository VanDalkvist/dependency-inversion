import type { StageNode } from "../../player/contracts";
import type { Observation } from "./lesson-model";
import { draftText, materialsText } from "./result-content";
function materials(run: Observation): StageNode {
  return {
    id: "result-materials",
    label: "1 · Материалы",
    subtitle: `${run.received} получено → ${run.selected} отобрано`,
    lines: ["Дубли исключены"],
    inspectLabel: "Открыть материалы",
    content: {
      title: "Материалы, отобранные сценарием",
      text: materialsText(run.draft.materials),
    },
    kind: "artifact",
    x: 0,
    y: 0,
  };
}
function draft(run: Observation): StageNode {
  return {
    id: "result-draft",
    label: "2 · Черновик",
    subtitle: "Подготовлен выбранным редактором",
    lines: [`Материалов в выпуске: ${run.draft.materials.length}`],
    inspectLabel: "Открыть черновик",
    content: {
      title: "Черновик до оформления для канала",
      text: draftText(run.draft),
    },
    kind: "artifact",
    x: 0,
    y: 0,
  };
}
function publication(run: Observation): StageNode {
  const count = run.calls.filter((c) => c.operation === "publish").length,
    probe = run.config.publisher === "probe";
  const received = run.captured[0];
  return {
    id: "result-publication",
    label: !run.approved
      ? "3 · Публикация запрещена"
      : probe
        ? "3 · Черновик сохранён"
        : "3 · Выпуск готов",
    subtitle: `Вызовов публикатора: ${count}`,
    lines: [
      probe
        ? `Записано черновиков: ${run.captured.length}`
        : `Создано документов: ${run.artifacts.length}`,
    ],
    inspectLabel: !run.approved
      ? "Открыть проверку"
      : probe
        ? "Открыть запись"
        : "Открыть выпуск",
    content: {
      title: probe ? "Что получил публикатор" : "Документ выбранного канала",
      text: probe
        ? received
          ? draftText(received)
          : "Публикатор не вызывался. Записанного черновика нет."
        : run.artifacts.map((a) => a.body).join("\n\n") ||
          "Выпуск не передавался на публикацию.",
    },
    kind: "artifact",
    x: 0,
    y: 0,
  };
}
export function resultNodes(run: Observation, phase: number): StageNode[] {
  const nodes = [materials(run), draft(run), publication(run)].map(
    (node, i) => ({
      ...node,
      x: 705,
      y: 80 + i * 145,
      width: 280,
      height: 112,
      icon: "check",
      appearAfter: i * 0.35,
      detail:
        "Это данные фактического учебного запуска. Они созданы внутри страницы и не отправляются во внешние сервисы.",
    }),
  );
  return phase === 6 || phase === 7
    ? [{ ...nodes[2], x: 45, y: 390, width: 255, appearAfter: 0 }]
    : nodes;
}
