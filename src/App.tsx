import { useEffect } from "react";
import StoryPlayer from "./player/StoryPlayer";
import { lessonForPath, lessons } from "./lessons";
// Composition root owns lesson selection; the player imports no concrete lesson.
export default function App() {
 const lesson = lessonForPath(window.location.pathname);
 useEffect(() => {
   document.title = `${lesson?.title ?? "Урок не найден"} — Простые вещи`;
   if (lesson) document.querySelector('meta[name="description"]')?.setAttribute("content", lesson.story.subtitle);
 }, [lesson]);
 if (!lesson) return <main><h1>Урок не найден</h1><a href="/">К первому уроку</a></main>;
 return <StoryPlayer story={lesson.story} navigation={lessons.map(item=>({href:item.href,label:item.label,title:`${item.label} — ${item.title}`,current:item.id===lesson.id}))} />;
}
