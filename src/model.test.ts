import { describe, expect, it } from "vitest";
import { canBrew, initialState, transition } from "./model";
describe("coffee shop dependency model", () => {
 it("keeps the original shop tied to its specific machine", () => { expect(canBrew({ ...initialState, machine: "filter" })).toBe(false); });
 it("accepts both implementations after inversion", () => { expect(canBrew({ ...initialState, chapter: 2, machine: "filter" })).toBe(true); });
 it("rejects an implementation that cannot fulfill the contract", () => { expect(canBrew({ ...initialState, chapter: 2, machine: "kettle" })).toBe(false); });
 it("does not record coffee when an incompatible machine is used", () => { const s = { ...initialState, machine: "kettle" as const }; expect(transition(s, { type: "brew" }).cups).toBe(0); });
 it("changes the machine without changing the shop contract", () => { const s = transition({ ...initialState, chapter: 2 }, { type: "machine", machine: "filter" }); expect(s.contract).toBe(initialState.contract); expect(transition(s, { type: "brew" }).cups).toBe(1); });
 it("resets the entire experiment", () => { expect(transition({ ...initialState, chapter: 2, cups: 3 }, { type: "reset" })).toEqual(initialState); });
});
