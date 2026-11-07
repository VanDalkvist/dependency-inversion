// Authored excerpts of the assembly stages; the executable implementation is assembly.ts.
export function wiringSnapshot({
  selected = false,
  injected = false,
  website = false,
  probe = false,
}: {
  selected?: boolean;
  injected?: boolean;
  website?: boolean;
  probe?: boolean;
}) {
  if (!selected)
    return "function runDigest(\n  brief: Brief,\n  ports: FactoryPorts,\n  approved: boolean,\n) { /* сценарий использует переданные объекты */ }";
  return [
    "const outbox: Artifact[] = [];",
    ...(probe ? ["const captured: Draft[] = [];"] : []),
    "const source = rssSource;",
    "const writer = cloudWriter;",
    `const publishers = [${probe ? "recordingPublisher(captured)" : website ? "websitePublisher(outbox)" : "telegramPublisher(outbox)"}];`,
    ...(injected
      ? ["", "runDigest(brief, { source, writer, publishers }, approved);"]
      : ["", "// Реализации выбраны; вызов сценария будет следующим шагом."]),
  ].join("\n");
}
