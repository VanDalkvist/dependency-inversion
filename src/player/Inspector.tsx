import type { StageNode } from "./contracts";
import Dialog from "./Dialog";
export default function Inspector({
  node,
  close,
}: {
  node: StageNode;
  close: () => void;
}) {
  return (
    <Dialog title={node.label} onClose={close} closeLabel="Закрыть инспектор">
      <section className="inspector" aria-label="Инспектор блока">
        <p>{node.detail ?? node.subtitle}</p>
        {node.code && (
          <details>
            <summary>Посмотреть код · {node.code.file}</summary>
            <pre>
              <code>{node.code.text}</code>
            </pre>
          </details>
        )}
      </section>
    </Dialog>
  );
}
