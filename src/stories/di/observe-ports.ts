import type { FactoryPorts } from "../../content-factory/contracts";
export type DependencyCall = {
  operation: "collect" | "write" | "publish";
  implementation: string;
};

export function observePorts(
  ports: FactoryPorts,
  names: { source: string; writer: string; publishers: string[] },
  calls: DependencyCall[],
): FactoryPorts {
  return {
    source: {
      collect(brief) {
        calls.push({ operation: "collect", implementation: names.source });
        return ports.source.collect(brief);
      },
    },
    writer: {
      write(brief, materials) {
        calls.push({ operation: "write", implementation: names.writer });
        return ports.writer.write(brief, materials);
      },
    },
    publishers: ports.publishers.map((p, index) => ({
      publish(draft) {
        calls.push({
          operation: "publish",
          implementation: names.publishers[index],
        });
        return p.publish(draft);
      },
    })),
  };
}
