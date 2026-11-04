import { motion } from "motion/react";
import type { Machine } from "./model";

export function Cafe() {
  return <svg viewBox="0 0 230 220" fill="none" aria-hidden="true" className="cafe-art">
    <path d="M35 91h160v112H35z" fill="var(--surface)" stroke="currentColor" strokeWidth="1.5"/>
    <path d="M24 91h182L184 48H46L24 91Z" fill="var(--surface-inset)" stroke="currentColor" strokeWidth="1.5"/>
    {[40,70,100,130,160].map((x,i)=><path key={x} d={`M${x+7-i*2} 49l-7 42v8q13 17 27 0v-8l-4-42`} fill={i%2===0?"var(--ground)":"var(--surface-inset)"} stroke="currentColor" strokeWidth="1.2"/>)}
    <path d="M52 129h63v45H52zM136 125h41v78h-41z" stroke="currentColor" strokeWidth="1.5"/>
    <path d="M83 130v43M53 153h62M160 164h4M19 204h193" stroke="currentColor" strokeWidth="1.4"/>
    <path d="M135 125h43v12h-43z" fill="var(--surface-inset)"/>
    <path d="M157 23v25" stroke="currentColor"/><path d="M138 12h38v20h-38z" fill="var(--ground)" stroke="currentColor"/>
    <path d="M148 19h12v5q-6 7-12 0v-5Zm12 1q8-1 5 4h-5" stroke="var(--accent)" strokeWidth="1.5"/>
    <path d="M63 185h44M49 190h71" stroke="currentColor" opacity=".3"/>
    <path d="M196 203v-26m0 9q-24-14-7-23 10 5 7 23Zm0 0q25-19 12-27-12 8-12 27Z" stroke="currentColor" strokeWidth="1.2"/>
    <text x="82" y="117" fill="currentColor" fontSize="8" fontFamily="Manrope, sans-serif" letterSpacing="3">КОФЕ</text>
  </svg>;
}
export function MachineArt({ kind, brewing = false }: { kind: Machine; brewing?: boolean }) {
  return <svg viewBox="0 0 230 220" fill="none" aria-hidden="true" className="machine-art">
    {kind==="espresso" ? <g>
      <path d="M49 67h130v119H49z" fill="var(--surface-inset)" stroke="currentColor" strokeWidth="1.5"/>
      <path d="M49 67h130v42H49z" fill="var(--surface)" stroke="currentColor" strokeWidth="1.5"/>
      <circle cx="80" cy="87" r="10" stroke="currentColor"/><path d="m80 87 4-5" stroke="var(--accent)" strokeWidth="1.5"/>
      <circle cx="144" cy="87" r="4" fill="var(--accent)"/><path d="M155 84h9m-9 6h9" stroke="currentColor"/>
      <path d="M88 109v10h30v-10M118 115h31" stroke="currentColor" strokeWidth="3"/>
      <path d="M61 176h106M65 181h99M49 187v7m130-7v7" stroke="currentColor" strokeWidth="1.5"/>
      <path d="M164 112v24l13 12" stroke="currentColor" strokeWidth="2"/>
      <Cup x={85} y={145} brewing={brewing}/>
      <motion.path d="M100 121v23M107 121v23" stroke="var(--accent)" strokeWidth="2" animate={{opacity:brewing?1:0,pathLength:brewing?1:0}} />
    </g> : kind==="filter" ? <g>
      <path d="M62 65h107v22H62zM156 86v102H62v-10h81V86" fill="var(--surface-inset)" stroke="currentColor" strokeWidth="1.5"/>
      <path d="m77 87 15 38h29l15-38" fill="var(--surface)" stroke="currentColor" strokeWidth="1.5"/>
      <path d="M90 136h39l8 33q-26 17-54 0l7-33Z" fill="var(--surface)" stroke="currentColor" strokeWidth="1.5"/>
      <path d="M129 143q25-3 19 17l-14 4M90 155h43" stroke="currentColor" strokeWidth="1.5"/>
      <motion.path d="M85 162q25-4 49 0v7q-25 12-50 0Z" fill="var(--accent)" animate={{opacity:brewing?.65:.15}}/>
      <circle cx="155" cy="76" r="3" fill="var(--accent)"/>
      <motion.path d="M108 125v11" stroke="var(--accent)" strokeWidth="2" animate={{opacity:brewing?1:0}}/>
    </g> : <g>
      <path d="M71 112q0-31 38-31 35 0 38 31l7 61q-39 19-91 0l8-61Z" fill="var(--surface-inset)" stroke="currentColor" strokeWidth="1.5"/>
      <path d="m72 115-27-8 21 42M147 107q53-8 31 41l-27 10M90 81v-8h36v9M64 182h91" stroke="currentColor" strokeWidth="2"/>
      <path d="M99 114h18v39H99z" stroke="currentColor"/><path d="M102 144h12" stroke="var(--accent)" strokeWidth="2"/>
    </g>}
    <path d="M33 199h165" stroke="currentColor" opacity=".3"/>
  </svg>;
}
function Cup({ x, y, brewing }: { x: number; y: number; brewing: boolean }) {
  return <g transform={`translate(${x} ${y})`}>
    <path d="M0 0h35v15q-17 17-35 0V0Zm35 3q17-1 9 12h-9M-5 26h45" stroke="currentColor" strokeWidth="1.5" fill="var(--ground)"/>
    <motion.path d="M10-8q-5-5 0-11m12 11q-5-5 0-11" stroke="var(--accent)" strokeWidth="1.2" animate={{opacity:brewing?1:0,y:brewing?-4:0}}/>
  </g>;
}
