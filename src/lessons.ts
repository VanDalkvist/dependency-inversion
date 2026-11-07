import type { StoryDefinition } from "./player/contracts";
import { dependencyInversionStory } from "./stories/dip";
import { dependencyInjectionStory } from "./stories/di";
export const lessons: readonly {
  id: string;
  href: string;
  label: string;
  title: string;
  story: StoryDefinition;
}[] = [
  {
    id: "dip",
    href: "/",
    label: "DIP",
    title: "Инверсия зависимостей",
    story: dependencyInversionStory,
  },
  {
    id: "di",
    href: "/di/",
    label: "DI",
    title: "Внедрение зависимостей",
    story: dependencyInjectionStory,
  },
];
export function lessonForPath(path: string) {
  const normalized =
    path.replace(/\/index\.html$/, "/").replace(/\/+$/, "") || "/";
  return lessons.find(
    (item) => (item.href.replace(/\/+$/, "") || "/") === normalized,
  );
}
