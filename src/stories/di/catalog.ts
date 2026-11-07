export type Role = "source" | "writer" | "publisher";
export type Service = {
  id: string;
  role: Role;
  label: string;
  short: string;
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
    contract: "Publisher",
    icon: "globe",
    x: 850,
    y: 370,
  },
  {
    id: "probe",
    role: "publisher",
    label: "Проверочный",
    short: "Запись вызова",
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
  publisher: { y: 370, label: "Канал", contract: "Publisher[]", phase: 3 },
};
