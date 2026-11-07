import type { Brief, FactoryPorts } from "../../content-factory/contracts";
import { prepareDigest } from "../../content-factory/prepare-digest";
export function runFactory(brief: Brief, ports: FactoryPorts) {
  const prepared = prepareDigest(brief, ports);
  const artifacts = ports.publishers.map((p) => p.publish(prepared.draft));
  return { ...prepared, artifacts };
}
