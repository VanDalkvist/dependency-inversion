import type { StageNode, StoryContext } from "../../player/contracts";
import pipelineCode from "../../content-factory/pipeline.ts?raw";
import adaptersCode from "../../content-factory/adapters.ts?raw";
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
      "Публиковать после согласования",
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
    code: { file: "content-factory/pipeline.ts", text: pipelineCode },
  };
}
function serviceNode(
  service: Service,
  selected: boolean,
  active: boolean,
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
      ? { action: { id: service.id, label: `Подключить ${service.label}` } }
      : {}),
    detail:
      "Это конкретная учебная реализация. Её объект выбирается в сборке и передаётся сценарию. Подготовленные данные обрабатываются внутри страницы.",
    code: {
      file:
        service.role === "publisher"
          ? "stories/di/assembly.ts"
          : "content-factory/adapters.ts",
      text: service.role === "publisher" ? assemblyCode : adaptersCode,
    },
  };
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
  const candidates =
    phase < 5 || phase === 9
      ? services.filter((s) => !["probe", "both"].includes(s.id))
      : phase === 6
        ? services.filter(
            (s) =>
              s.role === "publisher" && ["telegram", "website"].includes(s.id),
          )
        : phase === 7
          ? services.filter((s) => s.id === "probe")
          : [];
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
    ),
  );
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
          lines: ["Выбери реализацию справа"],
          detail:
            "Слот показывает, какой объект нужно передать в аргументе ports.",
        });
  return nodes;
}
export function warningNode(attempt: string): StageNode {
  const descriptions: Record<string, [string, string]> = {
    inside: ["Выбор попал в сценарий", "Вынеси сборку наружу"],
    name: ["Имя ещё не объект", "У строки нет метода publish"],
    rewrite: ["Сценарий менять не нужно", "Подключи другой Publisher"],
    type: ["Тип подходит. А был вызов?", "Подключи запись аргумента Draft"],
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
