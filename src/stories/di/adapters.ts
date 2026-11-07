import type {
  Material,
  MaterialSource,
  DraftWriter,
} from "../../content-factory/contracts";
import {
  rssSource as baseRss,
  aggregateSource as baseAggregate,
} from "../../content-factory/adapters";
function lessonMaterial(material: Material): Material {
  return material.id === "launch"
    ? {
        id: "injection",
        title: "Как передать сервисы сценарию",
        url: "https://example.com/injection",
        excerpt:
          "Сервисы выбираются в сборке. Сценарий получает готовые объекты источника, редактора и публикатора.",
      }
    : { ...material };
}
export const rssSource: MaterialSource = {
  collect: (brief) => baseRss.collect(brief).map(lessonMaterial),
};
export const aggregateSource: MaterialSource = {
  collect: (brief) => baseAggregate.collect(brief).map(lessonMaterial),
};
export const cloudWriter: DraftWriter = {
  write: (brief, materials) => ({
    title: brief.topic,
    intro:
      "Материалы о сборке фабрики: как выбрать сервисы, передать их сценарию и заменить публикатор.",
    materials,
  }),
};
export const localWriter: DraftWriter = {
  write: (brief, materials) => ({
    title: brief.topic,
    intro:
      "В этом выпуске — выбор сервисов, передача зависимостей и смена канала публикации.",
    materials,
  }),
};
