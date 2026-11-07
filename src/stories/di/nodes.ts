import type { StageNode } from "../../player/contracts";
import type { AssemblyState } from "./graph-contracts";
import pipelineCode from "../../content-factory/pipeline.ts?raw";
import adaptersCode from "../../content-factory/adapters.ts?raw";
import assemblyCode from "./assembly.ts?raw";
import { wiringSnapshot } from "./snapshots";
const positions = {
  assembler: { x: 45, y: 153 },
  source: { x: 375, y: 50 },
  writer: { x: 375, y: 210 },
  publisher: { x: 375, y: 370 },
  scenario: { x: 730, y: 153 },
} as const;
const box = (
  id: keyof typeof positions,
  label: string,
  subtitle: string,
  kind: StageNode["kind"],
  extra: Partial<StageNode> = {},
): StageNode => ({
  id,
  label,
  subtitle,
  kind,
  width: 220,
  height: 96,
  ...positions[id],
  ...extra,
});

function assemblerNode(state: AssemblyState): StageNode {
  const { selected = false } = state;
  const expression = state.probe
    ? "recordingPublisher"
    : state.website
      ? "websitePublisher"
      : "telegramPublisher";
  return box("assembler", "Сборка фабрики", "Выбор перед запуском", "policy", {
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
  });
}

function sourceNode(state: AssemblyState): StageNode {
  const { selected = false } = state;
  return box(
    "source",
    selected ? "RSS-источник" : "Источник",
    "MaterialSource",
    selected ? "detail" : "contract",
    {
      icon: "rss",
      lines: selected ? ["collect(Brief)"] : ["Реализация ещё не выбрана"],
      detail:
        "MaterialSource — описание нужной операции. rssSource — конкретный объект с методом collect. Он выбирается в сборке. В этом учебном примере возвращает заготовленные материалы.",
      code: { file: "content-factory/adapters.ts", text: adaptersCode },
    },
  );
}

function writerNode(state: AssemblyState): StageNode {
  const { selected = false } = state;
  return box(
    "writer",
    selected ? "Облачный редактор" : "Редактор",
    "DraftWriter",
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
  );
}

function publisherNode(state: AssemblyState): StageNode {
  const { selected = false, website = false, probe = false } = state;
  const channel = probe ? "Проверочный" : website ? "Сайт" : "Telegram";
  return box(
    "publisher",
    selected ? channel : "Канал",
    "Publisher",
    selected ? "detail" : "contract",
    {
      icon: probe ? "check" : website ? "globe" : "send",
      lines: selected ? ["publish(Draft)"] : ["Реализация ещё не выбрана"],
      detail: probe
        ? "Проверочный Publisher записывает полученный Draft и возвращает его JSON-снимок. Это реальная реализация того же контракта. По записи можно проверить аргумент вызова; без согласования publish не вызывается."
        : "Сборка создаёт выбранный Publisher и передаёт его сценарию. Метод publish получает готовый Draft. В учебном запуске создаётся локальный документ; сообщения и страницы не публикуются во внешних сервисах.",
      code: { file: "stories/di/assembly.ts", text: assemblyCode },
    },
  );
}

function scenarioNode(): StageNode {
  return box(
    "scenario",
    "Сценарий выпуска",
    "Правила фабрики контента",
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
  );
}

export function assemblyNodes(state: AssemblyState): StageNode[] {
  return [
    assemblerNode(state),
    sourceNode(state),
    writerNode(state),
    publisherNode(state),
    scenarioNode(),
  ];
}
