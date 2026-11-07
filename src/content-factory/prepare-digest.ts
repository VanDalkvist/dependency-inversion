import type { Brief, FactoryPorts } from "./contracts";
export function prepareDigest(
  brief: Brief,
  ports: Pick<FactoryPorts, "source" | "writer">,
) {
  const received = ports.source.collect(brief);
  const unique = [
    ...new Map(received.map((item) => [item.url, item])).values(),
  ].slice(0, brief.limit);
  const draft = ports.writer.write(brief, unique);
  return { received: received.length, selected: unique.length, draft };
}
