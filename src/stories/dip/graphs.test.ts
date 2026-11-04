import { describe, expect, it } from "vitest";
import { architecture, execution } from "./graphs";
describe("DIP semantic evidence", () => {
  it("keeps provider-owned interface outside the policy boundary before inversion", () => {
    const view = architecture({ wrapper: true });
    const port = view.nodes.find((n) => n.id === "publish-port")!;
    const app = view.regions!.find((r) => r.id === "application")!;
    expect(port.x).toBeGreaterThan(app.x + app.width);
    expect(port.code!.text).toContain("chatId");
  });
  it("moves the application contract inside and makes detail depend on it", () => {
    const view = architecture({ publisher: true });
    const port = view.nodes.find((n) => n.id === "publish-port")!;
    const app = view.regions!.find((r) => r.id === "application")!;
    expect(port.x + port.width!).toBeLessThan(app.x + app.width);
    expect(view.edges).toContainEqual(
      expect.objectContaining({ from: "telegram", to: "publish-port" }),
    );
  });
  it("does not hide still-concrete dependencies after only publisher inversion", () => {
    const policy = architecture({ publisher: true }).nodes.find(
      (n) => n.id === "policy",
    )!;
    expect(policy.lines).toContain("RSS: item.description");
    expect(policy.lines).toContain("LLM: choices[0].message");
    expect(policy.lines).toContain("publisher.publish(draft)");
    expect(policy.code!.text).toContain('from "./integrations/rss"');
    expect(policy.code!.text).not.toContain('from "./integrations/telegram"');
  });
  it("keeps the execution order distinct from code dependencies", () => {
    expect(execution.edges.map((e) => e.from)).toEqual([
      "run-source",
      "run-select",
      "run-write",
      "run-approve",
    ]);
  });
});
