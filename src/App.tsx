import { useEffect } from "react";
import StoryPlayer from "./player/StoryPlayer";
import SeasonApp from "./series/SeasonApp";
import { lessonForPath, lessons } from "./lessons";
// Composition root owns lesson selection; the player imports no concrete lesson.
export default function App() {
  const isSeason = /^\/series(?:\/|$)/.test(window.location.pathname);
  const lesson = isSeason ? undefined : lessonForPath(window.location.pathname);
  useEffect(() => {
    if (isSeason) return;
    document.title = `${lesson?.title ?? "Урок не найден"} — Vanya Arc / Aha!`;
    if (lesson)
      document
        .querySelector('meta[name="description"]')
        ?.setAttribute("content", lesson.story.subtitle);
  }, [lesson, isSeason]);
  if (isSeason) return <SeasonApp />;
  if (!lesson)
    return (
      <main>
        <h1>Урок не найден</h1>
        <a href="/">К первому уроку</a>
      </main>
    );
  return (
    <StoryPlayer
      story={lesson.story}
      navigation={lessons.map((item) => ({
        href: item.href,
        label: item.label,
        title: `${item.label} — ${item.title}`,
        current: item.id === lesson.id,
      }))}
    />
  );
}
