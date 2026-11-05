import type {
  ExperimentDefinition,
  ExperimentResult,
} from "../../player/contracts";
import { runDigest } from "./pipeline";
import {
  aggregateSource,
  cloudWriter,
  localWriter,
  rssSource,
  telegramPublisher,
  websitePublisher,
} from "./adapters";
import type { Artifact, Publisher } from "./contracts";
export function runExperiment(
  config: Record<string, string>,
): ExperimentResult {
  const sources = { rss: rssSource, aggregate: aggregateSource };
  const writers = { cloud: cloudWriter, local: localWriter };
  if (
    !Object.hasOwn(sources, config.source) ||
    !Object.hasOwn(writers, config.writer) ||
    !["telegram", "website", "both"].includes(config.publisher) ||
    !["yes", "no"].includes(config.approval)
  )
    throw new Error("Неизвестная конфигурация фабрики контента");
  const outbox: Artifact[] = [];
  const publishers: Publisher[] =
    config.publisher === "both"
      ? [telegramPublisher(outbox), websitePublisher(outbox)]
      : [
          config.publisher === "telegram"
            ? telegramPublisher(outbox)
            : websitePublisher(outbox),
        ];
  const result = runDigest(
    { topic: "Фабрика контента: от материалов до публикации", limit: 3 },
    {
      source: sources[config.source as keyof typeof sources],
      writer: writers[config.writer as keyof typeof writers],
      publishers,
    },
    config.approval === "yes",
  );
  return {
    summary: result.approved
      ? "Учебный выпуск готов. Тексты для выбранных каналов — ниже."
      : "Выпуск не согласован. В учебном прогоне публикации не созданы.",
    facts: [
      { label: "Исходных материалов", value: String(result.received) },
      { label: "Материалов в выпуске", value: String(result.selected) },
      { label: "Подготовлено публикаций", value: String(outbox.length) },
    ],
    artifacts: outbox,
    trace: [
      `Собрано материалов: ${result.received}`,
      `Дубли удалены, выбрано: ${result.selected}`,
      "Черновик подготовлен",
      result.approved
        ? `Подготовлено публикаций: ${outbox.length}`
        : "Согласование не получено — публикация остановлена",
    ],
  };
}
export const experiment: ExperimentDefinition = {
  title: "Песочница фабрики контента",
  runLabel: "Запустить выпуск",
  description:
    "Здесь работают заготовленные материалы и тексты, а не реальные RSS и AI-модели. Меняй настройки и сравнивай документы: сценарий runDigest остаётся тем же. Публикации создаются только внутри этой страницы.",
  choices: [
    {
      id: "source",
      label: "Источник материалов",
      options: [
        { id: "rss", label: "Одна RSS-лента" },
        { id: "aggregate", label: "Агрегатор источников" },
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
      label: "Каналы публикации",
      options: [
        { id: "telegram", label: "Telegram" },
        { id: "website", label: "Сайт" },
        { id: "both", label: "Оба канала" },
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
  run: runExperiment,
};
