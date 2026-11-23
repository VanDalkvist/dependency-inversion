import { useId } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import {
  Braces,
  Rss,
  Send,
  Sparkles,
  Workflow,
  Globe,
  Filter,
  Check,
  FileText,
} from "lucide-react";
import type { StageNode, StageView } from "./contracts";
import NodeContent from "./NodeContent";
import NodeControls from "./NodeControls";
const icons: Record<string, typeof Braces> = {
  braces: Braces,
  rss: Rss,
  send: Send,
  sparkles: Sparkles,
  workflow: Workflow,
  globe: Globe,
  filter: Filter,
  check: Check,
};
function edgePath(from: StageNode, to: StageNode) {
  const forward = from.x < to.x;
  const sx = from.x + (forward ? (from.width ?? 220) : 0),
    sy = from.y + (from.height ?? 96) / 2;
  const tx = to.x + (forward ? 0 : (to.width ?? 220)),
    ty = to.y + (to.height ?? 96) / 2;
  const bend = Math.max(45, Math.abs(tx - sx) * 0.48);
  return `M ${sx} ${sy} C ${sx + (forward ? bend : -bend)} ${sy}, ${tx + (forward ? -bend : bend)} ${ty}, ${tx} ${ty}`;
}
export default function Stage({
  view,
  onInspect,
  onAction,
  selected,
  playing,
}: {
  view: StageView;
  onInspect: (id: string) => void;
  onAction?: (id: string) => void;
  selected: string | null;
  playing: boolean;
}) {
  const reduced = useReducedMotion();
  const marker = useId().replace(/:/g, "");
  return (
    <svg
      viewBox="0 0 1000 535"
      className="stage-svg"
      role="group"
      aria-label={
        view.explicitControls
          ? "Интерактивная схема: выбор сервисов"
          : "Интерактивная схема. Нажми на блок для подробностей."
      }
    >
      <defs>
        <marker
          id={marker}
          markerWidth="8"
          markerHeight="8"
          refX="7"
          refY="4"
          orient="auto"
        >
          <path
            d="m1 1 5.5 3L1 7"
            fill="none"
            stroke="context-stroke"
            strokeWidth="1.4"
          />
        </marker>
        <pattern
          id={marker + "dots"}
          width="20"
          height="20"
          patternUnits="userSpaceOnUse"
        >
          <circle cx="1" cy="1" r=".7" fill="var(--border)" />
        </pattern>
      </defs>
      <rect width="1000" height="535" fill={`url(#${marker}dots)`} />
      {view.regions?.map((region) => (
        <motion.g
          key={region.id}
          initial={false}
          animate={{ x: region.x, y: region.y }}
          transition={{ duration: reduced ? 0 : 0.6 }}
        >
          <motion.rect
            initial={false}
            animate={{ width: region.width, height: region.height }}
            rx="3"
            fill="none"
            stroke="var(--border)"
            strokeDasharray="4 5"
          />
          <text x="16" y="25" className="region-label">
            {region.label.toLowerCase()}
          </text>
        </motion.g>
      ))}
      {view.edges.map((edge) => {
        const from = view.nodes.find((n) => n.id === edge.from),
          to = view.nodes.find((n) => n.id === edge.to);
        if (!from || !to) return null;
        const path = edgePath(from, to);
        return (
          <g
            key={edge.id}
            className={edge.emphasis ? "edge edge-accent" : "edge"}
          >
            <motion.path
              initial={false}
              animate={{ d: path }}
              transition={{ duration: reduced ? 0 : 0.6 }}
              fill="none"
              stroke="currentColor"
              strokeWidth="1.4"
              markerEnd={`url(#${marker})`}
            />
            {playing && view.flow && !reduced && (
              <motion.path
                d={path}
                fill="none"
                pathLength={1}
                stroke="var(--accent)"
                strokeWidth="3"
                strokeDasharray=".025 .975"
                initial={{ strokeDashoffset: 0 }}
                animate={{ strokeDashoffset: -1 }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              />
            )}
          </g>
        );
      })}
      <AnimatePresence initial={false}>
        {view.nodes.map((node) => {
          const Icon = icons[node.icon ?? ""] ?? FileText;
          return (
            <motion.g
              key={node.id}
              initial={{ opacity: reduced ? 1 : 0, scale: reduced ? 1 : 0.96, x: node.x, y: node.y }}
              animate={{ opacity: 1, scale: 1, x: node.x, y: node.y }}
              exit={{ opacity: 0 }}
              transition={{
                x: { type: "spring", stiffness: 170, damping: 24 },
                y: { type: "spring", stiffness: 170, damping: 24 },
                scale: { duration: reduced ? 0 : 0.22 },
                opacity: {
                  duration: reduced ? 0 : 0.2,
                  delay: reduced ? 0 : (node.appearAfter ?? 0),
                },
              }}
              className={`stage-node ${view.explicitControls ? "node-explicit" : ""} ${node.kind} ${node.focus ? "node-focus" : ""} ${selected === node.id ? "node-selected" : ""}`}
              tabIndex={view.explicitControls ? undefined : 0}
              role={view.explicitControls ? "group" : "button"}
              aria-label={
                view.explicitControls
                  ? `Карточка ${node.label}`
                  : (node.action?.label ?? `Блок ${node.label}. Подробнее`)
              }
              aria-disabled={node.action && !onAction ? true : undefined}
              onClick={
                view.explicitControls
                  ? undefined
                  : () =>
                      node.action
                        ? onAction?.(node.action.id)
                        : onInspect(node.id)
              }
              onKeyDown={
                view.explicitControls
                  ? undefined
                  : (event) => {
                      if (event.key === "Enter" || event.key === " ") {
                        event.preventDefault();
                        if (node.action) onAction?.(node.action.id);
                        else onInspect(node.id);
                      }
                    }
              }
              data-node-id={node.id}
            >
              <rect
                width={node.width ?? 220}
                height={node.height ?? 96}
                rx="3"
                className="node-surface"
              />
              {node.focus && (
                <motion.rect
                  width={node.width ?? 220}
                  height={node.height ?? 96}
                  rx="3"
                  fill="none"
                  stroke="var(--accent)"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: [0.2, 0.8, 0.2] }}
                  transition={{
                    duration: 1.6,
                    repeat: playing && !reduced ? Infinity : 0,
                  }}
                />
              )}
              <Icon
                x={16}
                y={16}
                width={17}
                height={17}
                strokeWidth={1.5}
                className="node-icon"
              />
              <text x="44" y="29" className="node-label">
                {node.label}
              </text>
              <text x="16" y="52" className="node-subtitle">
                {node.subtitle}
              </text>
              <NodeContent node={node} />
              {view.explicitControls ? (
                <NodeControls
                  node={node}
                  onAction={onAction}
                  onInspect={onInspect}
                />
              ) : (
                <text x={(node.width ?? 220) - 19} y="28" className="node-open">
                  {node.action ? "+" : "↗"}
                </text>
              )}
            </motion.g>
          );
        })}
      </AnimatePresence>
    </svg>
  );
}
