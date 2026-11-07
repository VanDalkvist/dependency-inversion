import type { StoryDefinition } from "../player/contracts";
export const fixture: StoryDefinition = {
  id: "other-pattern",
  title: "Другая история",
  subtitle: "Независимый сценарий",
  chapters: [{ id: "one", title: "Начало" }],
  scenes: [
    {
      id: "a",
      chapter: "one",
      title: "Начальная сцена",
      body: "Текст",
      caption: "Первый шаг",
      duration: 1000,
      views: { code: { nodes: [], edges: [] } },
    },
    {
      id: "b",
      chapter: "one",
      title: "Решение",
      body: "Выбери",
      caption: "Решение зрителя",
      duration: 1000,
      gate: true,
      actions: [
        { id: "no", label: "Нет", feedback: "Попробуй ещё" },
        { id: "yes", label: "Да", correct: true, feedback: "Верно" },
      ],
      views: { code: { nodes: [], edges: [] } },
    },
    {
      id: "c",
      chapter: "one",
      title: "Конец",
      body: "Готово",
      caption: "Последний шаг",
      duration: 1000,
      views: { code: { nodes: [], edges: [] } },
    },
  ],
};
