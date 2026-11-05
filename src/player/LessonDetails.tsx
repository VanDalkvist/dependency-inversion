import { useState } from "react";
import type { StoryDefinition } from "./contracts";
import Dialog from "./Dialog";
export default function LessonDetails({
  conclusion,
  sources,
}: Pick<StoryDefinition, "conclusion" | "sources">) {
  const [open, setOpen] = useState(false);
  if (!conclusion && !sources?.length) return null;
  return (
    <>
      <button className="lesson-details-button" onClick={() => setOpen(true)}>
        Вывод и источники
      </button>
      {open && (
        <Dialog title="Вывод и источники" onClose={() => setOpen(false)}>
          {conclusion && (
            <section className="lesson-conclusion">
              <h3>{conclusion.title}</h3>
              <p>{conclusion.body}</p>
            </section>
          )}
          {!!sources?.length && (
            <section className="lesson-source-list">
              <h3>Откуда взялся принцип</h3>
              {sources.map((source) => (
                <a
                  key={source.url}
                  href={source.url}
                  target="_blank"
                  rel="noreferrer"
                >
                  {source.title} ↗
                </a>
              ))}
            </section>
          )}
        </Dialog>
      )}
    </>
  );
}
