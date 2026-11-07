import React from "react";
import { afterEach,expect,it,vi } from "vitest";
import { cleanup,fireEvent,render,screen } from "@testing-library/react";
import Dialog from "./Dialog";
afterEach(cleanup);
it("does not dismiss for content, padding, or a drag that started inside",()=>{
 const close=vi.fn();render(<Dialog title="Результат" onClose={close}><p>Текст результата</p></Dialog>);
 const dialog=screen.getByRole("dialog");vi.spyOn(dialog,"getBoundingClientRect").mockReturnValue({left:100,top:100,right:500,bottom:350,x:100,y:100,width:400,height:250,toJSON(){return {};}});
 const content=screen.getByText("Текст результата");
 fireEvent.mouseDown(content,{clientX:200,clientY:200});fireEvent.click(content,{clientX:200,clientY:200});
 fireEvent.mouseDown(dialog,{clientX:110,clientY:110});fireEvent.click(dialog,{clientX:110,clientY:110});
 fireEvent.mouseDown(content,{clientX:200,clientY:200});fireEvent.mouseUp(dialog,{clientX:20,clientY:20});fireEvent.click(dialog,{clientX:20,clientY:20});
 expect(close).not.toHaveBeenCalled();
});
