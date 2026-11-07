import type { Brief, FactoryPorts } from "./contracts";
import { prepareDigest } from "./prepare-digest";
export function runDigest(
  brief: Brief,
  ports: FactoryPorts,
  approved: boolean,
) {
  const prepared = prepareDigest(brief, ports);
  const { draft } = prepared;
  const artifacts = approved
    ? ports.publishers.map((p) => p.publish(draft))
    : [];
  return {
    ...prepared,
    artifacts,
    approved,
  };
}
