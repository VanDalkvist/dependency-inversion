import type { StageNode } from "../../player/contracts";
import type { Observation } from "./lesson-model";
export function resultNodes(run: Observation, phase: number): StageNode[] {
  const count = run.calls.filter((c) => c.operation === "publish").length;
  const json = (value: unknown) => JSON.stringify(value, null, 2);
  const result: StageNode[] = [
    {
      id: "result-materials",
      label: "1 · Материалы",
      subtitle: `${run.received} получено → ${run.selected} отобрано`,
      lines: ["Дубли исключены"],
      code: { file: "Результат / Material[]", text: json(run.draft.materials) },
      appearAfter: 0,
    },
    {
      id: "result-draft",
      label: "2 · Черновик",
      subtitle: run.names.writer,
      lines: [`${run.draft.materials.length} материала в Draft`],
      code: { file: "Результат / Draft", text: json(run.draft) },
      appearAfter: 0.35,
    },
    {
      id: "result-publication",
      label: !run.approved
        ? "3 · Публикация запрещена"
        : run.config.publisher === "probe"
          ? "3 · Записан Draft"
          : "3 · Выпуск готов",
      subtitle: `Вызовов publish: ${count}`,
      lines: [`Локальных документов: ${run.artifacts.length}`],
      code: {
        file: "Результат / Publisher",
        text:
          run.artifacts.map((a) => a.body).join("\n\n") ||
          "Publisher не вызывался. Запись вызова пуста.",
      },
      appearAfter: 0.7,
    },
  ].map((n, i) => ({
    ...n,
    x: 705,
    y: 80 + i * 145,
    width: 280,
    height: 112,
    kind: "artifact",
    icon: "check",
    detail:
      "Фактические данные учебного прогона. Внешние сервисы не вызываются.",
  }));
  if (phase === 6 || phase === 7)
    return [{ ...result[2], x: 45, y: 390, width: 255, appearAfter: 0 }];
  return result;
}
