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
    expect(policy.lines).toEqual(["Источник: RSS API", "Редактор: API модели", "Каналы: Publisher"]);
    expect(policy.detail).toContain("item.description");
    expect(policy.detail).toContain("choices[0].message");
    expect(policy.detail).not.toContain("parse_mode");
    expect(policy.code!.text).toContain('from "./integrations/rss"');
    expect(policy.code!.text).not.toContain('from "./integrations/telegram"');
  });
  it("keeps the same rules while each dependency boundary changes independently", () => {
    const before = architecture().nodes.find(n => n.id === "policy")!;
    const partial = architecture({ publisher: true, source: true }).nodes.find(n => n.id === "policy")!;
    const complete = architecture({ publisher: true, source: true, writer: true }).nodes.find(n => n.id === "policy")!;
    expect(before.body).toEqual(["Отобрать материалы без дублей", "Подготовить черновик выпуска", "Публиковать после согласования"]);
    expect(partial.body).toEqual(before.body);
    expect(complete.body).toEqual(before.body);
    expect(partial.lines).toEqual(["Источник: MaterialSource", "Редактор: API модели", "Каналы: Publisher"]);
    expect(complete.lines).toEqual(["Источник: MaterialSource", "Редактор: DraftWriter", "Каналы: Publisher"]);
  });
  it("does not label a Telegram wrapper or a direct website as an application-owned Publisher", () => {
    expect(architecture({ wrapper: true }).nodes.find(n => n.id === "policy")!.lines).toContain("Каналы: TelegramClient");
    expect(architecture({ website: true }).nodes.find(n => n.id === "policy")!.lines).toContain("Каналы: Telegram API + сайт API");
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
