import React, { useState } from "react";
import { afterEach, expect, it, vi } from "vitest";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import Dialog from "./Dialog";
afterEach(()=>{cleanup();vi.restoreAllMocks();});
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
it.each(["button", "cancel", "backdrop"])(
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
    else if(method==="cancel") fireEvent(dialog, new Event("cancel", { cancelable: true }));
    else {
      vi.spyOn(dialog,"getBoundingClientRect").mockReturnValue({left:100,top:100,right:500,bottom:350,x:100,y:100,width:400,height:250,toJSON(){return {};}});
      fireEvent.mouseDown(dialog,{clientX:20,clientY:20});
      fireEvent.click(dialog,{clientX:20,clientY:20});
    }
    expect(screen.queryByRole("dialog")).toBeNull();
    expect(document.activeElement).toBe(opener);
  },
);
