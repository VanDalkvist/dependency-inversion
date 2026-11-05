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
      "Правила фабрики контента",
      45,
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
        linesLabel: "Зависимости кода",
        lines: [
          o.source ? "Источник: MaterialSource" : "Источник: RSS API",
          o.writer ? "Редактор: DraftWriter" : "Редактор: API модели",
          o.publisher
            ? "Каналы: Publisher"
            : o.wrapper
              ? "Каналы: TelegramClient"
              : o.website
                ? "Каналы: Telegram API + сайт API"
                : "Каналы: Telegram API",
        ],
        detail: [
          "Сценарий фабрики связывает сбор материалов, подготовку черновика и публикацию. Здесь остаются правила: убрать дубли, ограничить размер выпуска и не публиковать без согласования.",
          o.source
            ? "Источник: MaterialSource возвращает материалы в формате Material[], заданном сценарием."
            : "RSS: сценарий читает поле item.description из формата ленты.",
          o.writer
            ? "Редактор: DraftWriter возвращает Draft; ответ конкретной модели разбирает интеграция."
            : "Модель: сценарий сам разбирает choices[0].message из ответа провайдера.",
          o.publisher
            ? "Каналы: Publisher принимает Draft; разметка и API каждого канала остаются в интеграциях."
            : o.wrapper
              ? "Отправка: TelegramClient по-прежнему требует chatId и parse_mode — параметры API Telegram."
              : "Отправка: сценарий передаёт chatId и parse_mode в Telegram API.",
        ].join(" "),
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
    node("rss", "RSS-лента", "Материалы из ленты", 735, 60, "detail", {
      icon: "rss",
      height: 82,
      detail:
        "RSS-интеграция знает поля ленты. После инверсии она должна вернуть Material[] в формате, заданном сценарием фабрики. В коде ниже — учебные реализации без запросов к внешним сервисам.",
      code: { file: "stories/dip/adapters.ts", text: adaptersCode },
    }),
    node("llm", "AI-редактор", "Подготовка черновика", 735, 217, "detail", {
      icon: "sparkles",
      height: 82,
      detail:
        "Интеграция AI-редактора обращается к модели и превращает её ответ в Draft. Сценарий не разбирает ответ провайдера сам. В песочнице используются заготовленные тексты, а не вызовы модели.",
      code: { file: "stories/dip/adapters.ts", text: adaptersCode },
    }),
    node(
      "telegram",
      "Telegram",
      "Сообщение для канала",
      735,
      365,
      "detail",
      {
        height: 70,
        icon: "send",
        detail: o.publisher
          ? "Telegram-интеграция принимает Draft через Publisher и оформляет сообщение. Она использует контракты фабрики. В учебном прогоне создаётся текст сообщения, но ничего не отправляется в Telegram."
          : "Пока сценарий сам знает параметры Telegram и форматирует сообщение. Код ниже показывает итоговую учебную реализацию после инверсии, а не текущую версию сценария.",
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
      "MaterialSource определён на стороне сценария фабрики. Операция collect(Brief) возвращает Material[]. В этом контракте нет полей RSS или ответа конкретного агрегатора.",
    ],
    [
      o.writer,
      "writer-port",
      "DraftWriter",
      "Подготовить черновик",
      207,
      "DraftWriter определён на стороне сценария фабрики: write(Brief, Material[]) возвращает Draft. Параметры запроса к модели и разбор её ответа остаются внутри интеграции.",
    ],
    [
      o.publisher || o.wrapper,
      "publish-port",
      o.wrapper ? "TelegramClient" : "Publisher",
      o.wrapper ? "sendMessage(chatId, text)" : "Опубликовать выпуск",
      365,
      o.wrapper
        ? "TelegramClient определён в модуле Telegram и требует chatId и parse_mode. Сценарий по-прежнему зависит от интерфейса конкретного сервиса. Одного выделения файла для DIP недостаточно."
        : "Publisher определён на стороне сценария: publish(Draft). Интеграция принимает выпуск и сама готовит формат своего канала. Из сценария не нужно передавать ей Telegram-разметку или HTML-страницу.",
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
        detail: o.publisher
          ? "Интеграция сайта реализует Publisher: принимает Draft и создаёт HTML-страницу. Правила подготовки выпуска не меняются. В песочнице HTML показывается на странице, но не размещается на настоящем сайте."
          : "До инверсии поддержку сайта приходится добавлять в сценарий рядом с кодом Telegram. Код ниже показывает итоговую учебную реализацию после появления Publisher.",
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
        label: "СЦЕНАРИЙ ФАБРИКИ · application",
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
      ? "Интерфейс TelegramClient описан в модуле Telegram. Сценарий всё ещё зависит от параметров этого сервиса."
      : hasPorts
        ? "Стрелка A → B: код A использует определения из B. Это зависимость кода, а не направление передачи материалов."
        : "Сценарий напрямую использует API сервисов. При изменении API правки могут понадобиться и в сценарии.",
  };
}
export const execution: StageView = {
  flow: true,
  nodes: [
    node("run-source", "Собрать", "RSS или агрегатор", 30, 195, "detail", {
      width: 160,
      icon: "rss",
    }),
    node("run-select", "Отобрать", "Дубли и лимит выпуска", 225, 195, "policy", {
      width: 160,
      icon: "filter",
    }),
    node("run-write", "Написать", "AI-черновик", 420, 195, "detail", {
      width: 160,
      icon: "sparkles",
    }),
    node("run-approve", "Согласовать", "Согласование выпуска", 615, 195, "policy", {
      width: 160,
      icon: "check",
    }),
    node(
      "run-publish",
      "Выпустить",
      "Telegram или сайт",
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
  note: "Порядок операций остался прежним. Сценарий вызывает сервисы через свои интерфейсы; материалы идут от источника к публикации.",
};
export const views = (options: Options = {}) => ({
  code: architecture(options),
  runtime: execution,
});
