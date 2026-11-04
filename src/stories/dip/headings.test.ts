import { describe, expect, it } from "vitest";
import { dependencyInversionStory } from "./index";

describe("self-contained lesson headings", () => {
  it("names DIP and the three stages without relying on body copy", () => {
    expect(dependencyInversionStory.title).toBe("Инверсия зависимостей");
    expect(
      dependencyInversionStory.chapters.map((chapter) => chapter.title),
    ).toEqual([
      "Зависимость от сервисов",
      "Контракты сценария",
      "Замена сервисов",
    ]);
  });
  it("makes each scene subject explicit", () => {
    const titles = Object.fromEntries(
      dependencyInversionStory.scenes.map((scene) => [scene.id, scene.title]),
    );
    expect(titles).toEqual({
      first: "Сценарий знает API всех сервисов",
      growth: "Добавление сайта меняет сценарий выпуска",
      wrapper: "Обёртка сохраняет зависимость от Telegram",
      invert: "Сценарий задаёт интерфейс публикации",
      channel: "Telegram и сайт реализуют Publisher",
      sources: "Источники зависят от контракта сценария",
      writer: "AI-редактор реализует контракт сценария",
      directions: "DIP меняет зависимости кода, а не порядок вызовов",
      sandbox: "Замени сервисы, сохрани сценарий выпуска",
    });
  });
});
