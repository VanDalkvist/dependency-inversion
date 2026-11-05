import type { StageNode } from "./contracts";

export default function NodeContent({ node }: { node: StageNode }) {
  const body = node.body ?? [];
  const dependencyTop = body.length ? 77 + body.length * 17 + 13 : 77;
  const linesTop = dependencyTop + (node.linesLabel ? 20 : 0);
  return (
    <>
      {body.map((line, i) => (
        <text key={line} x="16" y={77 + i * 17} className="node-body">{line}</text>
      ))}
      {body.length > 0 && !!node.lines?.length && (
        <line x1="16" x2={(node.width ?? 220) - 16} y1={dependencyTop - 13} y2={dependencyTop - 13} className="node-content-divider" />
      )}
      {node.linesLabel && (
        <text x="16" y={dependencyTop} className="node-lines-label">{node.linesLabel}</text>
      )}
      {node.lines?.map((line, i) => (
        <text key={line} x="16" y={linesTop + i * 17} className="node-code">{line}</text>
      ))}
    </>
  );
}
