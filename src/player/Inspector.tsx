import { X, Code2 } from "lucide-react";
import type { StageNode } from "./contracts";
export default function Inspector({node,close}:{node:StageNode;close:()=>void}){
 return <section className="inspector" aria-label="Инспектор блока"><div className="inspector-title"><span><Code2 size={16}/>{node.label}</span><button className="icon-button" onClick={close} aria-label="Закрыть инспектор"><X size={16}/></button></div><p>{node.detail??node.subtitle}</p>{node.code&&<details><summary>Посмотреть код · {node.code.file}</summary><pre><code>{node.code.text}</code></pre></details>}</section>;
}
