import type { StageNode, StageView } from "../../player/contracts";
import pipelineCode from "../../content-factory/pipeline.ts?raw";
import adaptersCode from "../../content-factory/adapters.ts?raw";
import assemblyCode from "./assembly.ts?raw";
import { wiringSnapshot } from "./snapshots";
export type AssemblyState = {
  selected?: boolean;
  injected?: boolean;
  website?: boolean;
  probe?: boolean;
};
const box = (
  id: string,
  label: string,
  subtitle: string,
  x: number,
  y: number,
  kind: StageNode["kind"],
  extra: Partial<StageNode> = {},
): StageNode => ({
  id,
  label,
  subtitle,
  x,
  y,
  kind,
  width: 220,
  height: 96,
  ...extra,
});
export function assembly(state: AssemblyState = {}): StageView {
  const {
    selected = false,
    injected = false,
    website = false,
    probe = false,
  } = state;
  const channel = probe ? "Проверочный" : website ? "Сайт" : "Telegram";
  const expression = probe
    ? "recordingPublisher"
    : website
      ? "websitePublisher"
      : "telegramPublisher";
  const nodes: StageNode[] = [
    box(
      "assembler",
      "Сборка фабрики",
      "Выбор перед запуском",
      45,
      153,
      "policy",
      {
        width: 255,
        height: 216,
        icon: "workflow",
        body: [
          "Выбрать источник материалов",
          "Подключить AI-редактора",
          "Задать каналы публикации",
        ],
        linesLabel: "Выбранные объекты",
        lines: selected
          ? [
              "source = rssSource",
              "writer = cloudWriter",
              `channel = ${expression}`,
            ]
          : ["source: ?", "writer: ?", "publishers: ?"],
        detail:
          "Сборка выбирает реализации и создаёт нужные объекты. При вызове сценария они передаются параметрами. Фрагмент ниже показывает этап, выбранный в уроке; полная исполняемая сборка доступна через блок канала.",
        code: {
          file: "учебный фрагмент / assembly.ts",
          text: wiringSnapshot(state),
        },
      },
    ),
    box(
      "source",
      selected ? "RSS-источник" : "Источник",
      "MaterialSource",
      375,
      50,
      selected ? "detail" : "contract",
      {
        icon: "rss",
        lines: selected ? ["collect(Brief)"] : ["Реализация ещё не выбрана"],
        detail:
          "MaterialSource — описание нужной операции. rssSource — конкретный объект с методом collect. Он выбирается в сборке. В этом учебном примере возвращает заготовленные материалы.",
        code: { file: "content-factory/adapters.ts", text: adaptersCode },
      },
    ),
    box(
      "writer",
      selected ? "Облачный редактор" : "Редактор",
      "DraftWriter",
      375,
      210,
      selected ? "detail" : "contract",
      {
        icon: "sparkles",
        lines: selected
          ? ["write(Brief, Material[])"]
          : ["Реализация ещё не выбрана"],
        detail:
          "В сценарий передаётся объект редактора. Вызов writer.write выполняет именно его реализацию. Учебный cloudWriter возвращает подготовленный текст; внешняя модель не вызывается.",
        code: { file: "content-factory/adapters.ts", text: adaptersCode },
      },
    ),
    box(
      "publisher",
      selected ? channel : "Канал",
      "Publisher",
      375,
      370,
      selected ? "detail" : "contract",
      {
        icon: probe ? "check" : website ? "globe" : "send",
        lines: selected ? ["publish(Draft)"] : ["Реализация ещё не выбрана"],
        detail: probe
          ? "Проверочный Publisher записывает полученный Draft и возвращает его JSON-снимок. Это реальная реализация того же контракта. По записи можно проверить аргумент вызова; без согласования publish не вызывается."
          : "Сборка создаёт выбранный Publisher и передаёт его сценарию. Метод publish получает готовый Draft. В учебном запуске создаётся локальный документ; сообщения и страницы не публикуются во внешних сервисах.",
        code: { file: "stories/di/assembly.ts", text: assemblyCode },
      },
    ),
    box(
      "scenario",
      "Сценарий выпуска",
      "Правила фабрики контента",
      730,
      153,
      "policy",
      {
        width: 255,
        height: 216,
        icon: "workflow",
        body: [
          "Отобрать материалы без дублей",
          "Подготовить черновик выпуска",
          "Публиковать после согласования",
        ],
        linesLabel: "Получает параметрами",
        lines: [
          "source: MaterialSource",
          "writer: DraftWriter",
          "publishers: Publisher[]",
        ],
        detail:
          "runDigest использует объекты из аргумента ports: source.collect, writer.write и publishers[].publish. Он сам не выбирает rssSource, cloudWriter или канал. Контракты принадлежат сценарию, конкретные реализации выбирает внешний код сборки.",
        code: { file: "content-factory/pipeline.ts", text: pipelineCode },
      },
    ),
  ];
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
    nodes,
    edges,
    regions: [
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
    ],
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
