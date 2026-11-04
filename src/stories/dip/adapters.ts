import type {
  Artifact,
  DraftWriter,
  Material,
  MaterialSource,
  Publisher,
} from "./contracts";
const articles: Material[] = [
  {
    id: "agents",
    title: "Агентские инструменты",
    url: "https://example.com/agents",
    excerpt: "Инструменты отделяют задачу агента от конкретной интеграции.",
  },
  {
    id: "launch",
    title: "Запуск маленького продукта",
    url: "https://example.com/launch",
    excerpt: "Проверить спрос можно до разработки всей платформы.",
  },
  {
    id: "research",
    title: "Исследование аудитории",
    url: "https://example.com/research",
    excerpt: "Качественный бриф помогает отбирать релевантные материалы.",
  },
];
export const rssSource: MaterialSource = {
  collect: () => [
    articles[0],
    articles[1],
    { ...articles[0], id: "duplicate" },
  ],
};
export const aggregateSource: MaterialSource = {
  collect: () => [...rssSource.collect({ topic: "", limit: 3 }), articles[2]],
};
export const cloudWriter: DraftWriter = {
  write: (brief, materials) => ({
    title: brief.topic,
    intro: "Главное за неделю: что пригодится в работе.",
    materials,
  }),
};
export const localWriter: DraftWriter = {
  write: (brief, materials) => ({
    title: brief.topic,
    intro: "Короткая редакционная сводка. Только полезное.",
    materials,
  }),
};
const escape = (text: string) =>
  text.replace(
    /[&<>"']/g,
    (c) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[
        c
      ]!,
  );
export function telegramPublisher(outbox: Artifact[]): Publisher {
  return {
    publish: (draft) => {
      const artifact = {
        title: "Telegram",
        format: "text/html",
        body: `<b>${escape(draft.title)}</b>\n\n${escape(draft.intro)}\n\n${draft.materials.map((m) => `<a href="${escape(m.url)}">${escape(m.title)}</a>\n${escape(m.excerpt)}`).join("\n\n")}`,
      };
      outbox.push(artifact);
      return artifact;
    },
  };
}
export function websitePublisher(outbox: Artifact[]): Publisher {
  return {
    publish: (draft) => {
      const artifact = {
        title: "Сайт",
        format: "text/html",
        body: `<article><h1>${escape(draft.title)}</h1><p>${escape(draft.intro)}</p>${draft.materials.map((m) => `<section><h2><a href="${escape(m.url)}">${escape(m.title)}</a></h2><p>${escape(m.excerpt)}</p></section>`).join("")}</article>`,
      };
      outbox.push(artifact);
      return artifact;
    },
  };
}
