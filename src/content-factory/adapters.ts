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
    title: "Как собрать фабрику контента",
    url: "https://example.com/agents",
    excerpt:
      "Сценарий связывает сбор материалов, подготовку черновика и публикацию. Интеграции остаются сменяемыми.",
  },
  {
    id: "launch",
    title: "Зачем согласовывать AI-черновики",
    url: "https://example.com/launch",
    excerpt:
      "Перед выпуском редактор проверяет факты, формулировки и ссылки. Без согласования публикация останавливается.",
  },
  {
    id: "research",
    title: "Как выбрать каналы публикации",
    url: "https://example.com/research",
    excerpt:
      "Один выпуск можно оформить для Telegram и сайта. Формат каждого канала задаёт его интеграция.",
  },
];
export const rssSource: MaterialSource = {
  collect: () => [
    articles[0],
    articles[1],
    { ...articles[0], id: "duplicate" },
  ].map((article) => ({ ...article })),
};
export const aggregateSource: MaterialSource = {
  collect: () => [...rssSource.collect({ topic: "", limit: 3 }), { ...articles[2] }],
};
export const cloudWriter: DraftWriter = {
  write: (brief, materials) => ({
    title: brief.topic,
    intro:
      "Выпуск о фабрике контента: как собрать материалы, подготовить черновик и разнести публикации по каналам.",
    materials,
  }),
};
export const localWriter: DraftWriter = {
  write: (brief, materials) => ({
    title: brief.topic,
    intro:
      "В этом выпуске — сбор материалов, проверка AI-черновиков и публикация в нескольких каналах.",
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
        title: "Текст для Telegram",
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
        title: "HTML для сайта",
        format: "text/html",
        body: `<article><h1>${escape(draft.title)}</h1><p>${escape(draft.intro)}</p>${draft.materials.map((m) => `<section><h2><a href="${escape(m.url)}">${escape(m.title)}</a></h2><p>${escape(m.excerpt)}</p></section>`).join("")}</article>`,
      };
      outbox.push(artifact);
      return artifact;
    },
  };
}
