import type {
  ExperimentDefinition,
  ExperimentResult,
} from "../../player/contracts";
import { runDigest } from "../../content-factory/pipeline";
import { assembleFactory } from "./assembly";

export function runInjectionExperiment(
  config: Record<string, string>,
): ExperimentResult {
  if (!["yes", "no"].includes(config.approval))
    throw new Error("Неизвестное состояние согласования");
  const factory = assembleFactory(config);
  const brief = {
    topic: "Выпуск фабрики с внедрёнными зависимостями",
    limit: 3,
  };
  const approved = config.approval === "yes";
  const result = runDigest(brief, factory.ports, approved);
  const code = [
    "// Упрощённый фрагмент: наблюдатели вызовов опущены.",
    "// Функции и типы импортированы из модулей примера.",
    "const outbox: Artifact[] = [];",
    ...(config.publisher === "probe" ? ["const captured: Draft[] = [];"] : []),
    `const source = ${factory.names.source};`,
    `const writer = ${factory.names.writer};`,
    `const publishers = [${factory.expressions.join(", ")}];`,
    `runDigest(${JSON.stringify(brief)}, { source, writer, publishers }, ${approved});`,
  ].join("\n");
  return {
    summary: approved
      ? "Фабрика собрана. Сценарий вызвал переданные реализации."
      : "Фабрика собрана. Черновик готов; без согласования Publisher не вызван.",
    facts: [
      {
        label: "Зависимостей передано",
        value: String(2 + factory.ports.publishers.length),
      },
      { label: "Материалов в выпуске", value: String(result.selected) },
      {
        label: "Вызовов publish",
        value: String(
          factory.calls.filter((c) => c.operation === "publish").length,
        ),
      },
    ],
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
    "Выбери реализации и запусти тот же runDigest. Ниже — фрагмент сборки, фактические вызовы и полученные документы. Все данные учебные: запросов к моделям и внешних публикаций нет.",
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
      label: "Реализация Publisher",
      options: [
        { id: "telegram", label: "Telegram" },
        { id: "website", label: "Сайт" },
        { id: "both", label: "Telegram и сайт" },
        { id: "probe", label: "Запись вызова в тесте" },
      ],
    },
    {
      id: "approval",
      label: "Согласование выпуска",
      options: [
        { id: "yes", label: "Согласовать выпуск" },
        { id: "no", label: "Не согласовывать" },
      ],
    },
  ],
  run: runInjectionExperiment,
};
