import React, { useState } from "react";
import { afterEach, expect, it } from "vitest";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import Dialog from "./Dialog";
afterEach(cleanup);
function Example() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <button onClick={() => setOpen(true)}>Открыть детали</button>
      {open && (
        <Dialog title="Детали" onClose={() => setOpen(false)}>
          Содержимое
        </Dialog>
      )}
    </>
  );
}
it.each(["button", "cancel"])(
  "returns focus to the opener when closed by %s",
  (method) => {
    render(<Example />);
    const opener = screen.getByRole("button", { name: "Открыть детали" });
    opener.focus();
    fireEvent.click(opener);
    const dialog = screen.getByRole("dialog");
    const close = screen.getByRole("button", { name: "Закрыть" });
    close.focus();
    if (method === "button") fireEvent.click(close);
    else fireEvent(dialog, new Event("cancel", { cancelable: true }));
    expect(screen.queryByRole("dialog")).toBeNull();
    expect(document.activeElement).toBe(opener);
  },
);
