export type Role = "source" | "writer" | "publisher";
export type Service = {
  id: string;
  role: Role;
  label: string;
  short: string;
  actionLabel: string;
  detail?: string;
  contract: string;
  icon: string;
  x: number;
  y: number;
};
export const services: readonly Service[] = [
  {
    id: "rss",
    role: "source",
    label: "RSS-источник",
    short: "RSS",
    actionLabel: "Выбрать RSS",
    contract: "MaterialSource",
    icon: "rss",
    x: 705,
    y: 80,
  },
  {
    id: "aggregate",
    role: "source",
    label: "Агрегатор",
    short: "Агрегатор",
    actionLabel: "Выбрать агрегатор",
    contract: "MaterialSource",
    icon: "filter",
    x: 850,
    y: 80,
  },
  {
    id: "cloud",
    role: "writer",
    label: "Облачный редактор",
    short: "Облако",
    actionLabel: "Выбрать облачного редактора",
    contract: "DraftWriter",
    icon: "sparkles",
    x: 705,
    y: 225,
  },
  {
    id: "local",
    role: "writer",
    label: "Локальный редактор",
    short: "Локально",
    actionLabel: "Выбрать локального редактора",
    contract: "DraftWriter",
    icon: "sparkles",
    x: 850,
    y: 225,
  },
  {
    id: "telegram",
    role: "publisher",
    label: "Telegram",
    short: "Telegram",
    actionLabel: "Выбрать Telegram",
    contract: "Publisher",
    icon: "send",
    x: 705,
    y: 370,
  },
  {
    id: "website",
    role: "publisher",
    label: "Сайт",
    short: "Сайт",
    actionLabel: "Выбрать сайт",
    contract: "Publisher",
    icon: "globe",
    x: 850,
    y: 370,
  },
  {
    id: "probe",
    role: "publisher",
    label: "Запись выпуска",
    short: "Запись",
    actionLabel: "Выбрать запись выпуска",
    detail:
      "Этот публикатор нужен для проверки сценария. Вместо сообщения Telegram или страницы сайта он сохраняет полученный черновик. По записи видно, был ли вызов и что передали. В коде это recordingPublisher: объект с тем же методом publish, что у других публикаторов.",
    contract: "Publisher",
    icon: "check",
    x: 715,
    y: 370,
  },
  {
    id: "both",
    role: "publisher",
    label: "Два канала",
    short: "Два канала",
    actionLabel: "Выбрать два канала",
    contract: "Publisher[]",
    icon: "send",
    x: 715,
    y: 370,
  },
];
export const slots: Record<
  Role,
  { y: number; label: string; contract: string; phase: number }
> = {
  source: { y: 80, label: "Источник", contract: "MaterialSource", phase: 1 },
  writer: { y: 225, label: "AI-редактор", contract: "DraftWriter", phase: 2 },
  publisher: {
    y: 370,
    label: "Публикаторы",
    contract: "Publisher[]",
    phase: 3,
  },
};
