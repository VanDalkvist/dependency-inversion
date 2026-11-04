import type { StageNode, StageView } from "../../player/contracts";
import pipelineCode from "./pipeline.ts?raw";
import contractsCode from "./contracts.ts?raw";
import adaptersCode from "./adapters.ts?raw";
import { policySnapshot } from "./snapshots";
type Options = {
  publisher?: boolean;
  source?: boolean;
  writer?: boolean;
  wrapper?: boolean;
  website?: boolean;
  focus?: string;
};
const node = (
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
export function architecture(o: Options = {}): StageView {
  const hasPorts = o.publisher || o.source || o.writer;
  const nodes: StageNode[] = [
    node(
      "policy",
      "Сценарий выпуска",
      "Редакционные правила",
      45,
      195,
      "policy",
      {
        width: 255,
        height: 132,
        icon: "workflow",
        lines: [
          o.source ? "materials: Material[]" : "RSS: item.description",
          o.writer ? "draft: Draft" : "LLM: choices[0].message",
          o.publisher ? "publisher.publish(draft)" : "Telegram: parse_mode",
        ],
        detail:
          "Это высокоуровневая политика: что считать выпуском, как отбирать материалы и когда разрешать публикацию.",
        code: {
          file:
            o.publisher && o.source && o.writer
              ? "stories/dip/pipeline.ts"
              : "учебный срез / scenario.ts",
          text:
            o.publisher && o.source && o.writer
              ? pipelineCode
              : policySnapshot(o),
        },
      },
    ),
    node("rss", "RSS-лента", "Конкретный формат данных", 735, 60, "detail", {
      icon: "rss",
      height: 82,
      detail:
        "Интеграция знает item.description и поля внешнего источника. После инверсии возвращает Material[], определённый редакцией.",
      code: { file: "stories/dip/adapters.ts", text: adaptersCode },
    }),
    node("llm", "LLM-провайдер", "Конкретный API модели", 735, 217, "detail", {
      icon: "sparkles",
      height: 82,
      detail:
        "Реализация знает протокол модели. Сценарию нужен Draft, а не provider-specific response.",
      code: { file: "stories/dip/adapters.ts", text: adaptersCode },
    }),
    node(
      "telegram",
      "Telegram",
      "Формат сообщения и отправка",
      735,
      365,
      "detail",
      {
        height: 70,
        icon: "send",
        detail: o.publisher
          ? "Telegram-реализация принимает Draft и создаёт документ своего канала. Она зависит от Publisher и Draft, а не наоборот."
          : "Пока сценарий знает особенности Telegram. Открытый код ниже — итоговая реализация после инверсии, не текущая версия сценария.",
        code: { file: "stories/dip/adapters.ts", text: adaptersCode },
      },
    ),
  ];
  const edges: StageView["edges"] = [];
  for (const [flag, id, label, subtitle, y, detail] of [
    [
      o.source,
      "source-port",
      "MaterialSource",
      "Получить материалы",
      50,
      "Контракт принадлежит редакции: collect(Brief) → Material[]. Нет RSS-тегов и структуры ответа агрегатора.",
    ],
    [
      o.writer,
      "writer-port",
      "DraftWriter",
      "Подготовить черновик",
      207,
      "Контракт редакции: write(Brief, Material[]) → Draft. Нет messages, model и полей ответа провайдера.",
    ],
    [
      o.publisher || o.wrapper,
      "publish-port",
      o.wrapper ? "TelegramClient" : "Publisher",
      o.wrapper ? "sendMessage(chatId, text)" : "Опубликовать выпуск",
      365,
      o.wrapper
        ? "Обёртка есть, но интерфейс всё ещё говорит на языке Telegram и находится в его модуле. Сценарий импортирует деталь."
        : "Контракт задан сценарием: publish(Draft). Формат канала скрыт внутри реализации.",
    ],
  ] as const) {
    const target =
      id === "source-port" ? "rss" : id === "writer-port" ? "llm" : "telegram";
    if (flag) {
      nodes.push(
        node(
          id,
          label,
          subtitle,
          o.wrapper && id === "publish-port" ? 450 : 375,
          y,
          "contract",
          {
            height: id === "publish-port" ? 85 : 96,
            icon: "braces",
            detail,
            code: {
              file: o.wrapper
                ? "до / integrations/telegram.ts"
                : "stories/dip/contracts.ts",
              text: o.wrapper
                ? 'export interface TelegramClient {\n  sendMessage(chatId: string, text: string,\n    options: { parse_mode: "HTML" }): void;\n}\n// scenario.ts imports integrations/telegram.ts'
                : contractsCode,
            },
          },
        ),
      );
      edges.push({
        id: `policy-${target}`,
        from: "policy",
        to: id,
        emphasis: id === o.focus,
      });
      edges.push({
        id: `detail-${target}`,
        from: target,
        to: id,
        emphasis: !o.wrapper,
      });
    } else
      edges.push({
        id: `policy-${target}`,
        from: "policy",
        to: target,
        emphasis: !hasPorts,
      });
  }
  if (o.website) {
    nodes.push(
      node("website", "Сайт", "HTML-страница выпуска", 735, 450, "detail", {
        height: 55,
        icon: "globe",
        detail:
          "Новая интеграция реализует Publisher. Редакционные правила не меняются.",
        code: { file: "stories/dip/adapters.ts", text: adaptersCode },
      }),
    );
    edges.push({
      id: "website-publish",
      from: o.publisher ? "website" : "policy",
      to: o.publisher ? "publish-port" : "website",
      emphasis: true,
    });
  }
  return {
    nodes: nodes.map((n) => ({ ...n, focus: o.focus === n.id })),
    edges,
    regions: [
      {
        id: "application",
        label: "НАШ СЦЕНАРИЙ · application",
        x: 20,
        y: 20,
        width: o.wrapper ? 380 : hasPorts ? 620 : 380,
        height: 490,
      },
      {
        id: "integrations",
        label: "ИНТЕГРАЦИИ · infrastructure",
        x: o.wrapper ? 425 : hasPorts ? 690 : 425,
        y: 20,
        width: o.wrapper ? 560 : hasPorts ? 295 : 560,
        height: 490,
      },
    ],
    note: o.wrapper
      ? "Новый файл — ещё не инверсия. Контракт по-прежнему продиктован Telegram."
      : hasPorts
        ? "Стрелка означает: «исходный код знает об этом типе / импортирует его»."
        : "Сценарий знает API каждой интеграции. Изменение формата может затронуть его код.",
  };
}
export const execution: StageView = {
  flow: true,
  nodes: [
    node("run-source", "Собрать", "RSS / агрегатор", 30, 195, "detail", {
      width: 160,
      icon: "rss",
    }),
    node("run-select", "Отобрать", "Правила редакции", 225, 195, "policy", {
      width: 160,
      icon: "filter",
    }),
    node("run-write", "Подготовить", "Черновик выпуска", 420, 195, "detail", {
      width: 160,
      icon: "sparkles",
    }),
    node("run-approve", "Согласовать", "Решение человека", 615, 195, "policy", {
      width: 160,
      icon: "check",
    }),
    node(
      "run-publish",
      "Опубликовать",
      "Выбранные каналы",
      810,
      195,
      "detail",
      { width: 160, icon: "send" },
    ),
  ],
  edges: ["source", "select", "write", "approve"].map((_, i) => ({
    id: `flow-${i}`,
    from: ["run-source", "run-select", "run-write", "run-approve"][i],
    to: ["run-select", "run-write", "run-approve", "run-publish"][i],
    emphasis: true,
  })),
  regions: [
    {
      id: "runtime",
      label: "ПОРЯДОК ВЫПОЛНЕНИЯ · runtime",
      x: 15,
      y: 100,
      width: 970,
      height: 310,
    },
  ],
  note: "Инверсия не разворачивает поток данных. Сценарий по-прежнему вызывает интеграции — через свои контракты.",
};
export const views = (options: Options = {}) => ({
  code: architecture(options),
  runtime: execution,
});
