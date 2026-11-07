import type { StageNode } from "./contracts";
import { Info } from "lucide-react";
function Button({
  label,
  activate,
  children,
  className,
  pressed,
  disabled = false,
}: {
  label: string;
  activate: () => void;
  children: React.ReactNode;
  className: string;
  pressed?: boolean;
  disabled?: boolean;
}) {
  return (
    <g
      role="button"
      tabIndex={disabled ? -1 : 0}
      aria-label={label}
      aria-pressed={pressed}
      aria-disabled={disabled || undefined}
      className={className}
      onClick={(event) => {
        event.stopPropagation();
        if (!disabled) { event.currentTarget.focus(); activate(); }
      }}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          event.stopPropagation();
          if (!disabled) activate();
        }
      }}
    >
      {children}
    </g>
  );
}
export default function NodeControls({
  node,
  onAction,
  onInspect,
}: {
  node: StageNode;
  onAction?: (id: string) => void;
  onInspect: (id: string) => void;
}) {
  const width = node.width ?? 220,
    height = node.height ?? 96;
  return (
    <>
      {node.action ? (
        <Button
          label={node.action.label}
          className="node-select"
          pressed={node.action.selected}
          disabled={!onAction}
          activate={() => onAction?.(node.action!.id)}
        >
          <rect width={width} height={height} rx="3" className="node-hit" />
          <text x="16" y={height - 20} className="node-control-label">
            {node.action.selected ? "Выбрано ✓" : "Выбрать +"}
          </text>
        </Button>
      ) : node.hint ? (
        <text x="16" y={height - 20} className="node-state-hint">
          {node.hint}
        </text>
      ) : null}
      {node.inspectLabel ? (
        <Button
          label={node.inspectLabel}
          className="node-open-document"
          activate={() => onInspect(node.id)}
        >
          <rect
            x="12"
            y={height - 27}
            width={width - 24}
            height="23"
            rx="2"
            className="node-document-hit"
          />
          <text x="20" y={height - 11} className="node-control-label">
            {node.inspectLabel}
          </text>
        </Button>
      ) : (
        <Button
          label={`${node.code ? "Описание и код" : "Описание"}: ${node.label}`}
          className="node-info"
          activate={() => onInspect(node.id)}
        >
          <title>{node.code ? "Описание и код" : "Описание"}</title>
          <rect
            x={width - 34}
            y={height - 34}
            width="28"
            height="28"
            rx="3"
            className="node-info-hit"
          />
          <Info
            x={width - 29}
            y={height - 29}
            width="18"
            height="18"
            strokeWidth={1.5}
          />
        </Button>
      )}
    </>
  );
}
