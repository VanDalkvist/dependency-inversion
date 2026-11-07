import type { StageView } from "../../player/contracts";
import type { AssemblyState } from "./graph-contracts";
import { assemblyNodes } from "./nodes";
function regions(selected: boolean): StageView["regions"] {
  return [
    {
      id: "composition",
      label: "СБОРКА · composition root",
      x: 20,
      y: 20,
      width: 310,
      height: 490,
    },
    {
      id: "objects",
      label: selected ? "ОБЪЕКТЫ СЕРВИСОВ" : "РОЛИ И КОНТРАКТЫ",
      x: 350,
      y: 20,
      width: 315,
      height: 490,
    },
    {
      id: "application",
      label: "СЦЕНАРИЙ · application",
      x: 710,
      y: 20,
      width: 280,
      height: 490,
    },
  ];
}
export function assembly(state: AssemblyState = {}): StageView {
  const { selected = false, injected = false } = state;
  const edges: StageView["edges"] = [];
  if (selected)
    for (const id of ["source", "writer", "publisher"])
      edges.push({ id: `choose-${id}`, from: "assembler", to: id });
  if (injected)
    for (const id of ["source", "writer", "publisher"])
      edges.push({
        id: `inject-${id}`,
        from: id,
        to: "scenario",
        emphasis: true,
      });
  return {
    nodes: assemblyNodes(state),
    edges,
    regions: regions(selected),
    note: injected
      ? "Стрелки показывают передачу объектов в сценарий. Это сборка, а не направление импортов из урока DIP."
      : selected
        ? "Объекты выбраны. Передача параметров и вызовы методов — следующие шаги."
        : "Контракт описывает нужную операцию. Конкретный объект выбирает сборка.",
  };
}
export function execution(state: AssemblyState = {}): StageView {
  const view = assembly({ ...state, selected: true, injected: true });
  return {
    ...view,
    flow: true,
    edges: ["source", "writer", "publisher"].map((id) => ({
      id: `call-${id}`,
      from: "scenario",
      to: id,
      emphasis: true,
    })),
    note: "Здесь стрелки — вызовы методов: collect → write → publish. До publish сценарий проверяет согласование. Фактические вызовы увидим в песочнице.",
  };
}
export const views = (state: AssemblyState = {}) => ({
  assembly: assembly(state),
  runtime: execution(state),
});
