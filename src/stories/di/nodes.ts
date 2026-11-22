import type { StageNode, StoryContext } from "../../player/contracts";
import pipelineCode from "./pipeline.ts?raw";
import adaptersCode from "./adapters.ts?raw";
import assemblyCode from "./assembly.ts?raw";
import { services, slots, type Service, type Role } from "./catalog";
export function scenarioNode(bad = false): StageNode {
  return {
    id: "scenario",
    label: "Сценарий выпуска",
    subtitle: "Правила остаются прежними",
    kind: "policy",
    icon: "workflow",
    x: 45,
    y: 153,
    width: 255,
    height: 216,
    body: [
      "Отобрать материалы без дублей",
      "Подготовить черновик выпуска",
      "Передать выпуск публикатору",
    ],
    linesLabel: "Получает параметрами",
    lines: bad
      ? ["Выбор Telegram попал внутрь", "Сценарий знает конкретный канал"]
      : [
          "source: MaterialSource",
          "writer: DraftWriter",
          "publishers: Publisher[]",
        ],
    focus: bad,
    detail:
      "Сценарий вызывает переданные объекты и сохраняет правила выпуска. Выбор конкретных реализаций находится снаружи.",
    code: { file: "stories/di/pipeline.ts", text: pipelineCode },
  };
}
function serviceNode(
  service: Service,
  selected: boolean,
  active: boolean,
  hint: string,
): StageNode {
  const wide = selected || service.id === "probe" || service.id === "both";
  return {
    id: `${service.role}-${service.id}`,
    label: wide ? service.label : service.short,
    subtitle: selected
      ? `${service.role === "publisher" ? "publishers" : service.role} · ${service.contract}`
      : service.contract,
    kind: "detail",
    icon: service.icon,
    x: selected ? 390 : service.x,
    y: selected ? slots[service.role].y : service.y,
    width: wide ? 230 : 138,
    height: 100,
    focus: active && selected,
    ...(active
      ? { action: { id: service.id, label: service.actionLabel, selected } }
      : {}),
    hint,
    detail:
      service.detail ??
      {
        source:
          "Источник поставляет исходные материалы. Сценарий просит их методом collect, затем сам удаляет дубли и отбирает материалы. В коде роль называется MaterialSource.",
        writer:
          "AI-редактор получает отобранные материалы и готовит черновик: заголовок, вводный текст и список материалов. В коде роль называется DraftWriter, а черновик — Draft.",
        publisher:
          "Публикатор получает готовый черновик. Telegram оформляет сообщение, сайт — HTML-страницу. В коде роль называется Publisher; метод publish принимает черновик. В этом уроке документы создаются внутри страницы.",
      }[service.role],
    code: {
      file:
        service.role === "publisher"
          ? "stories/di/assembly.ts"
          : "stories/di/adapters.ts",
      text: service.role === "publisher" ? assemblyCode : adaptersCode,
    },
  };
}
function candidatesFor(phase: number, attempt: string | null) {
  // Show only the choice needed *now*. The first scene is about the problem,
  // not a catalogue of six unrelated implementation cards.
  if (phase === 0)
    return attempt === "inside" ? services.filter((s) => s.id === "telegram") : [];
  const activeRole: Record<number, Role> = {
    1: "source",
    2: "writer",
    3: "publisher",
  };
  if (phase in activeRole)
    return services.filter(
      (s) => s.role === activeRole[phase] && !["probe", "both"].includes(s.id),
    );
  if (phase === 8)
    return services.filter((s) => !["probe", "both"].includes(s.id));
  if (phase === 6)
    return services.filter(
      (s) => s.role === "publisher" && ["telegram", "website"].includes(s.id),
    );
  if (phase === 7) return services.filter((s) => s.id === "probe");
  return [];
}
function emptySlots(
  context: StoryContext,
  phase: number,
  filled: (role: Role) => boolean,
): StageNode[] {
  const nodes: StageNode[] = [];
  const roles: Role[] = ["source", "writer", "publisher"];
  if (phase > 0 || context.answers.root === "outside")
    for (const role of roles)
      if (!filled(role))
        nodes.push({
          id: `empty-${role}`,
          label: slots[role].label,
          subtitle: `${role === "publisher" ? "publishers" : role} · ${slots[role].contract}`,
          kind: "contract",
          x: 390,
          y: slots[role].y,
          width: 230,
          height: 100,
          lines: ["Ждёт выбранный сервис"],
          detail:
            "Здесь будет выбранный сервис. В коде набор сервисов называется ports: источник, редактор и список публикаторов передаются сценарию одним аргументом.",
        });
  return nodes;
}
export function assemblyNodes(
  context: StoryContext,
  phase: number,
  config: Record<string, string>,
): StageNode[] {
  const roles: Role[] = ["source", "writer", "publisher"];
  const filled = (role: Role) =>
    phase > slots[role].phase ||
    (phase === slots[role].phase &&
      !!context.answers[role === "publisher" ? "channel" : role]);
  const chosen = roles
    .filter(filled)
    .map((role) =>
      services.find((s) => s.role === role && s.id === config[role])!,
    );
  const candidates = candidatesFor(phase, context.attempt);
  const unique = [
    ...new Map(
      [...candidates, ...chosen].map((s) => [`${s.role}-${s.id}`, s]),
    ).values(),
  ];
  const nodes = unique.map((s) =>
    serviceNode(
      s,
      chosen.includes(s),
      phase === slots[s.role].phase ||
        (phase === 6 &&
          s.role === "publisher" &&
          s.id !== (context.answers.channel ?? "telegram")) ||
        (phase === 7 && s.id === "probe"),
      chosen.includes(s)
        ? "В сборке"
        : phase === 8
          ? "Выбор ниже"
          : phase < slots[s.role].phase
            ? `Выбор на шаге ${slots[s.role].phase + 1}`
            : `Изменить: шаг ${slots[s.role].phase + 1}`,
    ),
  );
  nodes.push(...emptySlots(context, phase, filled));
  return nodes;
}
export function warningNode(attempt: string): StageNode {
  const descriptions: Record<string, [string, string]> = {
    inside: ["Выбор попал в сценарий", "Вынеси сборку наружу"],
    name: ["Имя ещё не объект", "У строки нет метода publish"],
    rewrite: ["Правила остаются прежними", "Выбери другой канал публикации"],
    type: ["Метод есть. А что он получил?", "Подключи запись выпуска"],
  };
  const [label, subtitle] = descriptions[attempt];
  return {
    id: "bad-attempt",
    label,
    subtitle,
    x: 45,
    y: 390,
    width: 255,
    height: 112,
    kind: "artifact",
    icon: "filter",
    focus: true,
    detail: subtitle,
  };
}
