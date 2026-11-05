import type { StoryDefinition } from "../../player/contracts";
import { scenes } from "./scenes";
import { experiment } from "./experiment";
export const dependencyInversionStory: StoryDefinition = {
  id: "dependency-inversion",
  title: "Инверсия зависимостей",
  subtitle:
    "На примере фабрики контента: как менять источники, AI-редактора и каналы публикации, не переписывая сценарий выпуска.",
  topic: "dependency inversion principle",
  viewLabels: { code: "Зависимости кода", runtime: "Порядок работы" },
  conclusion: {
    title: "Интеграции зависят от контрактов сценария",
    body: "Фабрика определяет, какие материалы ей нужны, какой черновик подготовить и когда выпускать публикации. Интеграции реализуют эти операции через её интерфейсы.",
  },
  chapters: [
    { id: "direct", title: "Зависимость от сервисов" },
    { id: "inversion", title: "Контракты сценария" },
    { id: "proof", title: "Замена сервисов" },
  ],
  scenes,
  experiment,
  sources: [
    {
      title: "Роберт Мартин: кто владеет интерфейсом",
      url: "https://blog.cleancoder.com/uncle-bob/2016/01/04/ALittleArchitecture.html",
    },
    {
      title: "DIP in the Wild",
      url: "https://martinfowler.com/articles/dipInTheWild.html",
    },
    {
      title: "Refactoring Guru — референс подачи, не копия",
      url: "https://refactoring.guru/design-patterns/adapter",
    },
  ],
};
