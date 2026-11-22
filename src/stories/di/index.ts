import type { StoryDefinition } from "../../player/contracts";
import { injectionScenes } from "./scenes";
import { injectionExperiment } from "./experiment";
export const dependencyInjectionStory: StoryDefinition = {
  id: "dependency-injection",
  title: "Внедрение зависимостей",
  hook: "Как менять инструменты у одного помощника?",
  subtitle:
    "Представь: помощник собирает новости и готовит выпуск. Сегодня он публикует в Telegram, завтра — на сайте. Нужно ли его переделывать?",
  purpose: "Ты соберёшь выпуск, заменишь канал и увидишь, почему сам процесс остался прежним.",
  topic: "dependency injection",
  chapters: [
    { id: "choose", title: "Собираем помощника" },
    { id: "inject", title: "Запускаем выпуск" },
    { id: "check", title: "Меняем канал" },
  ],
  viewLabels: { assembly: "Сборка", runtime: "Вызовы" },
  scenes: injectionScenes,
  experiment: injectionExperiment,
  conclusion: {
    title: "Сценарий получает готовые зависимости из сборки",
    body: "Код сборки выбирает реализации и передаёт их сценарию. Сценарий использует полученные объекты. В этом примере DI выполнен обычными параметрами функции; отдельный контейнер не требуется.",
  },
  sources: [
    {
      title:
        "Мартин Фаулер: Dependency Injection и отделение сборки от использования",
      url: "https://martinfowler.com/articles/injection.html",
    },
    {
      title: "Марк Симан: где размещать Composition Root",
      url: "https://blog.ploeh.dk/2011/07/28/CompositionRoot/",
    },
  ],
};
