import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { Check, Coffee, ArrowUpRight, RotateCcw, X } from "lucide-react";
import { Cafe, MachineArt } from "./Illustrations";
import { canBrew, machines, type State, type Action } from "./model";

export default function CoffeeScene({ state, dispatch, brewing, brew }: { state: State; dispatch: (a: Action) => void; brewing: boolean; brew: () => void }) {
  const inverted = state.chapter > 0;
  const compatible = canBrew(state);
  const reduced = useReducedMotion();
  return <div className="lab">
    <div className="lab-top"><span className="live-dot"/><span>Твоя маленькая кофейня</span><span className="lab-edition">Живая модель</span></div>
    <div className="scene" data-inverted={inverted}>
      <div className="scene-node cafe-node">
        <div className="art-wrap"><Cafe /></div>
        <span className="node-name">Кофейня</span>
        <span className="node-detail">Большая идея</span>
      </div>
      <div className="connector">
        <svg className="wires" viewBox="0 0 240 130" aria-hidden="true">
          <defs><marker id="arrow" markerWidth="7" markerHeight="7" refX="6" refY="3.5" orient="auto-start-reverse"><path d="m1 1 5 2.5L1 6" fill="none" stroke="var(--accent)" strokeWidth="1.3"/></marker></defs>
          <motion.path d={inverted?"M5 65H75":"M5 65H230"} stroke="var(--accent)" fill="none" strokeWidth="1.4" markerEnd="url(#arrow)" animate={{pathLength:1,opacity:1}} initial={false}/>
          {inverted && <motion.path d="M235 65H165" stroke="var(--accent)" fill="none" strokeWidth="1.4" markerEnd="url(#arrow)" initial={{pathLength:reduced?1:0}} animate={{pathLength:1}}/>}
        </svg>
        <AnimatePresence initial={false} mode="wait">
          {inverted ? <motion.div key="contract" className="contract" initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}}>
            <div className="contract-fold"/><Check size={18}/><strong>Договор</strong><span>Чашка чёрного<br/>кофе</span>
          </motion.div> : <motion.div key="dependency" className="dependency-label" initial={false} animate={{opacity:1}} exit={{opacity:0}}>подстраивается<br/>под машину</motion.div>}
        </AnimatePresence>
        <span className="wire-caption">{inverted ? "обе стороны зависят от договора" : "зависит от конкретной детали"}</span>
      </div>
      <div className="scene-node machine-node">
        <div className="art-wrap"><AnimatePresence initial={false} mode="wait"><motion.div key={state.machine} initial={{opacity:0, y:reduced?0:8}} animate={{opacity:1,y:0}} exit={{opacity:0,y:reduced?0:-8}}><MachineArt kind={state.machine} brewing={brewing}/></motion.div></AnimatePresence></div>
        <span className="node-name">{machines.find(m=>m.id===state.machine)?.name}</span><span className="node-detail">Сменяемая деталь</span>
      </div>
    </div>
    <div className="machine-picker" role="group" aria-label="Выбор техники">{machines.map((machine,i)=><button key={machine.id} aria-pressed={state.machine===machine.id} onClick={()=>dispatch({type:"machine",machine:machine.id})}><span className="choice-index">0{i+1}</span>{machine.name}{state.machine===machine.id&&<motion.span layoutId="machine-line" className="choice-line"/>}</button>)}</div>
    <div className={`result ${compatible?"":"result-blocked"}`} role="status" aria-live="polite">
      <span className="result-icon">{compatible?<Check size={16}/>:<X size={16}/>}</span>
      <div><strong>{compatible ? (brewing?"Кофе готов. Дело продолжается.":inverted?"Договор выполнен. Кофейня работает.":"Всё работает. Пока машина та же.") : state.machine==="kettle"?"Горячая вода — ещё не кофе.":"Новая машина. Старые инструкции."}</strong><p>{compatible ? inverted?"Способ приготовления другой. Требование — то же.":"Другая техника потребует менять инструкции кофейни." : state.machine==="kettle"?"Чайник не выполняет договор. Свобода замены не означает «подойдёт что угодно».":"Кофейня знает кнопки эспрессо-машины, но не умеет работать с фильтром."}</p></div>
    </div>
    <div className="lab-bottom">
      <button className="brew-button" onClick={brew} disabled={!compatible||brewing}><Coffee size={16}/>{brewing?"Кофе готов!":"Приготовить кофе"}<ArrowUpRight size={15}/></button>
      <span className="cup-count" aria-live="polite">{state.cups===0?"Проверим на практике":`Приготовлено чашек: ${state.cups}`}</span>
      <button className="icon-button" onClick={()=>dispatch({type:"reset"})} aria-label="Начать заново" title="Начать заново"><RotateCcw size={16}/></button>
    </div>
    <span className="scene-footnote">Стрелки — кто под чьи требования подстраивается, а не куда течёт кофе.</span>
  </div>;
}
