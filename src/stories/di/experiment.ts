import type {
  ExperimentDefinition,
  ExperimentResult,
} from "../../player/contracts";
import { runFactory } from "./pipeline";
import { assembleFactory } from "./assembly";
import type { Brief } from "../../content-factory/contracts";
function assemblyExcerpt(
  factory: ReturnType<typeof assembleFactory>,
  brief: Brief,
  probe: boolean,
): string {
  return [
    "// Упрощённый фрагмент: наблюдатели вызовов опущены.",
    "// Функции и типы импортированы из модулей примера.",
    "const outbox: Artifact[] = [];",
    ...(probe ? ["const captured: Draft[] = [];"] : []),
    `const source = ${factory.names.source};`,
    `const writer = ${factory.names.writer};`,
    `const publishers = [${factory.expressions.join(", ")}];`,
    `runFactory(${JSON.stringify(brief)}, { source, writer, publishers });`,
  ].join("\n");
}

function observedFacts(
  factory: ReturnType<typeof assembleFactory>,
  selected: number,
) {
  return [
    {
      label: "Зависимостей передано",
      value: String(2 + factory.ports.publishers.length),
    },
    { label: "Материалов в выпуске", value: String(selected) },
    {
      label: "Передач публикатору",
      value: String(
        factory.calls.filter((c) => c.operation === "publish").length,
      ),
    },
  ];
}

export function runInjectionExperiment(
  config: Record<string, string>,
): ExperimentResult {
  const factory = assembleFactory(config);
  const brief = {
    topic: "Выпуск фабрики с внедрёнными зависимостями",
    limit: 3,
  };
  const result = runFactory(brief, factory.ports);
  const code = assemblyExcerpt(factory, brief, config.publisher === "probe");
  return {
    summary:
      "Фабрика подготовила выпуск и передала его выбранным публикаторам.",
    facts: observedFacts(factory, result.selected),
    trace: factory.calls.map((c) => `${c.implementation}.${c.operation}()`),
    artifacts: [
      {
        title: "Сборка выбранной фабрики",
        format: "TypeScript · фрагмент",
        body: code,
      },
      ...result.artifacts,
    ],
  };
}
export const injectionExperiment: ExperimentDefinition = {
  title: "Песочница: сборка и вызовы фабрики",
  runLabel: "Собрать и запустить",
  description:
    "Публикатор получает готовый черновик. Telegram оформит сообщение, сайт — HTML-страницу, а «Запись выпуска» сохранит черновик для проверки. Все варианты работают внутри страницы: внешних публикаций и запросов к моделям нет.",
  choices: [
    {
      id: "source",
      label: "Источник материалов",
      options: [
        { id: "rss", label: "RSS-источник" },
        { id: "aggregate", label: "Агрегатор" },
      ],
    },
    {
      id: "writer",
      label: "AI-редактор",
      options: [
        { id: "cloud", label: "Облачный AI-редактор" },
        { id: "local", label: "Локальный AI-редактор" },
      ],
    },
    {
      id: "publisher",
      label: "Куда передать выпуск",
      options: [
        { id: "probe", label: "Запись выпуска (проверка)" },
        { id: "telegram", label: "Telegram" },
        { id: "website", label: "Сайт" },
        { id: "both", label: "Telegram и сайт" },
      ],
    },
  ],
  run: runInjectionExperiment,
};
