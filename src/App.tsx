import { useEffect, useReducer, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { ArrowDown, ArrowLeft, ArrowRight, Check, Moon, Sun, MoveUpRight } from "lucide-react";
import { useTheme } from "@vanya/ui";
import CoffeeScene from "./CoffeeScene";
import { chapters, initialState, transition, canBrew } from "./model";

export default function App() {
  const [state, dispatch] = useReducer(transition, initialState);
  const [brewing, setBrewing] = useState(false);
  const [answer, setAnswer] = useState<number|null>(null);
  const timer = useRef<ReturnType<typeof setTimeout>|null>(null);
  const { resolvedTheme, setTheme } = useTheme();
  const chapter = chapters[state.chapter];
  useEffect(()=>()=>{if(timer.current)clearTimeout(timer.current)},[]);
  useEffect(()=>{setBrewing(false);if(timer.current)clearTimeout(timer.current)},[state.machine,state.chapter]);
  function brew() {
    if(!canBrew(state)||brewing)return;
    dispatch({type:"brew"});setBrewing(true);
    timer.current=setTimeout(()=>setBrewing(false),1600);
  }
  return <>
    <a className="skip-link" href="#experience">Перейти к эксперименту</a>
    <header className="site-header"><a href="#" className="wordmark"><span className="brand-mark">↗</span> Простые вещи<span className="brand-divider"/>Сложные идеи, человеческим языком</a><button className="theme-button" onClick={()=>setTheme(resolvedTheme==="dark"?"light":"dark")} aria-label={resolvedTheme==="dark"?"Включить светлую тему":"Включить тёмную тему"}>{resolvedTheme==="dark"?<Sun size={17}/>:<Moon size={17}/>}</button></header>
    <main>
      <section className="intro">
        <div className="intro-main"><h1>Главное не должно<br/>зависеть от <span className="detail-word">деталей<svg viewBox="0 0 360 15" preserveAspectRatio="none" aria-hidden="true"><path d="M2 10Q150 0 356 7" fill="none" stroke="currentColor" strokeWidth="2"/></svg></span>.</h1><p>Инверсия зависимостей — звучит страшно.<br/>На самом деле ты уже понимаешь её. Просто ещё не знаешь об этом.</p></div>
        <div className="intro-note"><span className="time-mark">≈ 3 минуты</span><p>Ни строчки кода.<br/>Одна кофейня.<br/>И немного свободы.</p><a href="#experience" aria-label="К интерактивному объяснению"><ArrowDown size={21}/></a></div>
      </section>
      <section id="experience" className="experience" aria-label="Интерактивный эксперимент">
        <nav className="chapters" aria-label="Главы объяснения">{chapters.map((c,i)=><button key={c.title} onClick={()=>dispatch({type:"chapter",chapter:i})} aria-current={state.chapter===i?"step":undefined}><span className="chapter-index">{state.chapter>i?<Check size={13}/>:String(i+1).padStart(2,"0")}</span><span>{c.title}</span>{state.chapter===i&&<motion.span layoutId="chapter-active" className="chapter-active"/>}</button>)}</nav>
        <div className="experience-content">
          <div className="story"><div className="story-number">0{state.chapter+1}<span> / 03</span></div><AnimatePresence mode="wait" initial={false}><motion.div key={state.chapter} initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}}><h2>{chapter.heading.split("\n").map((line,i)=><span key={line}>{line}{i===0&&<br/>}</span>)}</h2><p className="story-body">{chapter.body}</p><div className="story-prompt"><MoveUpRight size={17}/><p>{chapter.prompt}</p></div></motion.div></AnimatePresence><div className="story-controls"><button className="icon-button" aria-label="Предыдущая глава" disabled={state.chapter===0} onClick={()=>dispatch({type:"chapter",chapter:state.chapter-1})}><ArrowLeft size={19}/></button><button className="next-button" onClick={()=>state.chapter<2?dispatch({type:"chapter",chapter:state.chapter+1}):document.getElementById("takeaway")?.scrollIntoView({behavior:window.matchMedia("(prefers-reduced-motion: reduce)").matches?"instant":"smooth"})}>{state.chapter===0?"Перевернуть зависимость":state.chapter===1?"А что это меняет?":"Поймать суть"}<ArrowRight size={17}/></button></div></div>
          <CoffeeScene state={state} dispatch={dispatch} brewing={brewing} brew={brew}/>
        </div>
        <div className="takeaway-strip"><span>Суть этого шага</span><AnimatePresence mode="wait" initial={false}><motion.p key={state.chapter} initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}}>{chapter.takeaway}</motion.p></AnimatePresence><span className="strip-arrow">↗</span></div>
      </section>
      <section className="meaning" id="takeaway"><div className="meaning-heading"><h2>Не «как устроено».<br/>А «что мне нужно».</h2><p>Вот и весь переворот. Не важное подстраивается<br className="desktop-break"/> под мелкое, а мелкое — под важное.</p></div><div className="principles">
        <article><span className="principle-number">01 / смысл</span><h3>Кофейня продаёт кофе.</h3><p>Это главное. В программе — задача бизнеса: оформить заказ, отправить сообщение, принять оплату.</p></article>
        <article><span className="principle-number">02 / договор</span><h3>Она задаёт, что ей нужно.</h3><p>«Приготовить кофе». В программе такой договор называют интерфейсом. Его определяют нужды главного, не особенности техники.</p></article>
        <article><span className="principle-number">03 / деталь</span><h3>Исполнитель соблюдает договор.</h3><p>Машина, почтовый сервис, платёжная система. Можно заменить — если новая деталь выполняет те же требования.</p></article>
      </div></section>
      <section className="quiz"><div><span className="quiz-mark">↳</span><h2>Проверка на одну мысль.</h2><p>Магазин хочет принимать оплату. Что должно<br className="desktop-break"/> определять его правила?</p></div><div className="quiz-options">{["Особенности конкретного банка","Договор «принять оплату»"].map((text,i)=><button key={text} onClick={()=>setAnswer(i)} aria-pressed={answer===i}><span className="answer-box">{answer===i?<Check size={14}/>:String(i+1).padStart(2,"0")}</span>{text}<ArrowRight size={16}/></button>)}<div className="quiz-feedback" role="status">{answer===null?"Выбери ответ. Здесь можно ошибаться.":answer===1?"Именно. Банки меняются. Смысл магазина — нет.":"Тогда смена банка заставит переделывать магазин. Пусть правила задаёт нужный магазину результат."}</div></div></section>
      <section className="closing"><span className="closing-glyph">↗</span><blockquote>«Детали меняются.<br/>Смысл остаётся».</blockquote><p>Инверсия зависимостей. Теперь по-человечески.</p><details><summary>А если чуть точнее?</summary><p>Высокоуровневая логика не должна зависеть от конкретных низкоуровневых реализаций. Обе стороны зависят от абстракции. Абстракция отражает потребности высокоуровневой логики; детали её реализуют.</p><p>Кофейня — упрощённая аналогия. В программе переворачивается направление зависимостей в коде, а не обязательно порядок вызовов. Внедрение зависимостей — способ передать исполнителя; само по себе оно ещё не гарантирует соблюдения принципа.</p><a href="https://en.wikipedia.org/wiki/Dependency_inversion_principle" target="_blank" rel="noreferrer">Подробнее о принципе <ArrowRight size={13}/></a></details></section>
    </main>
    <footer><span>Простые вещи <span className="footer-dot">·</span> Интерактивные объяснения</span><a href="https://motion.dev" target="_blank" rel="noreferrer">Сделано с Motion ↗</a><span>Hearth & Wave</span></footer>
  </>;
}
