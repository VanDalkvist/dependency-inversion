import type {
  Brief,
  DraftWriter,
  MaterialSource,
  Publisher,
} from "./contracts";
export function runDigest(
  brief: Brief,
  ports: {
    source: MaterialSource;
    writer: DraftWriter;
    publishers: Publisher[];
  },
  approved: boolean,
) {
  const received = ports.source.collect(brief);
  const unique = [
    ...new Map(received.map((item) => [item.url, item])).values(),
  ].slice(0, brief.limit);
  const draft = ports.writer.write(brief, unique);
  const artifacts = approved
    ? ports.publishers.map((p) => p.publish(draft))
    : [];
  return {
    received: received.length,
    selected: unique.length,
    draft,
    artifacts,
    approved,
  };
}
