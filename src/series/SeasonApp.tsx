import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { ArrowLeft, ArrowRight, Bot, CheckCircle2, FileText, Globe2, MessageCircle, RotateCcw, TriangleAlert, Wrench } from "lucide-react";
import { ActionButton, CraftCard, Tag, ThemeToggle, WorkflowStrip, useTheme } from "@vanya/ui";
import { APPROVED_POST, REGENERATED_POST, episodes, episodeById, nextEpisode, type Episode, type ChoiceId, type EpisodeId } from "./model";
import { isApprovedSameContent, playChoice, retryOnlyWebsite, simulateWebsiteFailure, type EpisodeResult, type PublicationReceipt } from "./engine";
import "./season.css";

type StageProps = {
  episode: Episode;
  problemVisible: boolean;
  result: EpisodeResult | null;
  websiteFailed: boolean;
  websiteRecovered: boolean;
  deliveryOverride: PublicationReceipt[] | null;
};
function PostCard({ label, text, accent = false }: { label: string; text: string; accent?: boolean }) {
  return <CraftCard className={`season-post ${accent ? "season-post-accent" : ""}`}>
    <div className="season-post-top"><FileText size={20} aria-hidden="true" /><span>{label}</span></div>
    <strong>{APPROVED_POST.title}</strong>
    <p>{text}</p>
  </CraftCard>;
}
function Receipt({ receipt }: { receipt: PublicationReceipt }) {
  return <CraftCard className="season-receipt" data-status={receipt.status}>
    {receipt.channel === "Telegram" ? <MessageCircle size={22} aria-hidden="true"/> : <Globe2 size={22} aria-hidden="true"/>}
    <div><strong>{receipt.channel}</strong><span>{receipt.status === "готово" ? "Учебный результат получен" : receipt.status === "ошибка" ? "Отправка не удалась" : "Ожидает публикации"}</span></div>
    <Tag size="md" isActive={receipt.status === "готово"}>{receipt.status}</Tag>
  </CraftCard>;
}
function Stage({ episode, problemVisible, result, websiteFailed, websiteRecovered, deliveryOverride }: StageProps) {
  const reduced = useReducedMotion();
  const receipts = deliveryOverride ?? result?.receipts ?? [];
  const fullyDelivered = !!result?.achieved && (!websiteFailed || websiteRecovered);
  const stageNote = episode.id === "one-post"
    ? "Один утверждённый текст. Сравните дату в обоих каналах."
    : episode.id === "both-channels"
      ? "Каждый канал возвращает собственный результат."
      : episode.id === "rules"
        ? "Смотрите, какая часть программы должна меняться."
        : "Меняется редактор, а работа фабрики остаётся на месте.";
  const bugShown = episode.id === "one-post" && problemVisible && !result;
  const postText = episode.id === "one-post" && (bugShown || result?.choice === "rewrite") ? REGENERATED_POST.text : APPROVED_POST.text;
  return <aside className="season-stage" aria-label="Сцена с результатами фабрики">
    <div className="season-stage-header">
      <span>РАБОЧИЙ СТОЛ АНИ</span>
      <Tag size="md" isActive={fullyDelivered}>{fullyDelivered ? "Изменение видно" : websiteFailed ? "Частичный результат" : problemVisible ? "Есть задача" : "Начало"}</Tag>
    </div>
    {episode.id === "rules" ? (
      <div className="season-rules">
        <div className="season-rules-row">
          <CraftCard className="season-rule-card" data-changed={result?.choice === "patch-core" ? "true" : undefined}>
            <Wrench size={21} aria-hidden="true"/>
            <strong>Фабрика контента</strong>
            <p>{result?.choice === "own-rule" ? "Пишет пост и просит: «Опубликуй готовое»" : "Пишет пост и знает, как оформлять HTML для сайта"}</p>
          </CraftCard>
          <span className="season-rule-arrow" aria-hidden="true">→</span>
          <CraftCard className="season-rule-card" data-changed={result?.choice === "own-rule" ? "true" : undefined}>
            <Globe2 size={21} aria-hidden="true"/>
            <strong>Инструмент сайта</strong>
            <p>{result?.choice === "own-rule" ? "Сам оформляет HTML и выполняет правило фабрики" : "Получает готовую разметку из фабрики"}</p>
          </CraftCard>
        </div>
        <PostCard label="ВЫПУСК · ТОТ ЖЕ ТЕКСТ" text={APPROVED_POST.text}/>
        <p className="season-stage-foot">{result?.choice === "own-rule" ? "Правило принадлежит фабрике. Требования сайта живут в его инструменте." : "На сайте: **Открытие клуба** — видна несогласованная разметка."}</p>
      </div>
    ) : episode.id === "injection" ? (
      <div className="season-injection">
        <div className="season-slot">
          <span>ИНСТРУМЕНТ РЕДАКТОРА</span>
          <AnimatePresence mode="wait" initial={false}>
            <motion.strong key={result?.writer ?? "cloud"} initial={reduced ? false : {opacity:0, y:7}}
              animate={{opacity:1,y:0}} exit={reduced ? undefined : {opacity:0,y:-7}}>
              {result?.writer === "localWriter" ? "Локальный редактор" : "Облачный редактор"}
            </motion.strong>
          </AnimatePresence>
          <Tag size="md" isActive={result?.writer === "localWriter"}>{result?.writer === "localWriter" ? "Подключён" : "Недоступен в учебном примере"}</Tag>
        </div>
        <div className="season-process" aria-label="Последовательность фабрики">
          <span>Новости</span><ArrowRight size={18} aria-hidden="true"/><span>Редактор</span><ArrowRight size={18} aria-hidden="true"/><span>Публикация</span>
        </div>
        {result?.draft && <PostCard label="ТЕКСТ ИЗ НАСТОЯЩЕГО УЧЕБНОГО ПРОГОНА" text={result.draft.intro}/>}
        {result?.achieved && <div className="season-receipts">{receipts.map((receipt) => <Receipt key={receipt.channel} receipt={receipt}/>)}</div>}
      </div>
    ) : (
      <div className="season-paper-stage">
        <PostCard label="УТВЕРЖДЁННЫЙ ПОСТ · АНЕЙ" text={APPROVED_POST.text} accent/>
        {episode.id === "one-post" && problemVisible && (
          <motion.div initial={reduced ? false : {opacity:0,y:9}} animate={{opacity:1,y:0}}>
            <PostCard label="ПОСТ НА САЙТЕ" text={postText}/>
          </motion.div>
        )}
        {episode.id === "both-channels" && <div className="season-receipts">
          {(receipts.length ? receipts : [
            {channel:"Telegram" as const,status:problemVisible ? "готово" as const : "ожидает" as const,content:APPROVED_POST.text},
            {channel:"Сайт" as const,status:"ожидает" as const,content:APPROVED_POST.text}
          ]).map(r=><Receipt receipt={r} key={r.channel}/>)}
        </div>}
        {episode.id === "one-post" && result?.achieved && (
          <div className="season-receipts">{receipts.map((receipt) => <Receipt key={receipt.channel} receipt={receipt}/>)}</div>
        )}
      </div>
    )}
    <p className="season-stage-note">{stageNote}</p>
    {result?.achieved && episode.id==="one-post" && <p className="season-proof">Содержание совпадает: {isApprovedSameContent(receipts) ? "да" : "нет"}</p>}
    {result?.proof && <details className="season-proof-details"><summary>Показать, как это устроено</summary><code>{result.proof}</code></details>}
    <p className="season-simulation">Вымышленная история. Все публикации и ответы агента — учебная симуляция.</p>
  </aside>;
}
export default function SeasonApp() {
  const initial = episodeById(new URLSearchParams(window.location.search).get("episode"));
  const [episodeId, setEpisodeId] = useState<EpisodeId>(initial.id);
  const [problemVisible, setProblemVisible] = useState(false);
  const [choice, setChoice] = useState<ChoiceId | null>(null);
  const [result, setResult] = useState<EpisodeResult | null>(null);
  const [deliveryOverride, setDeliveryOverride] = useState<PublicationReceipt[] | null>(null);
  const [websiteFailed, setWebsiteFailed] = useState(false);
  const [websiteRecovered, setWebsiteRecovered] = useState(false);
  const reduced = useReducedMotion();
  const {resolvedTheme} = useTheme();
  const titleRef = useRef<HTMLHeadingElement>(null);
  const firstRender = useRef(true);
  const episode = episodeById(episodeId);
  const next = nextEpisode(episode);
  const beat = problemVisible ? episode.problem : episode.start;
  // Publishing adapters are local but their calls must still run once per choice,
  // not again on every UI render or when we reveal a partial-failure example.
  useEffect(() => {
    const restore = () => {
      const selected = episodeById(new URLSearchParams(window.location.search).get("episode"));
      setEpisodeId(selected.id);
      setProblemVisible(false);setChoice(null);setResult(null);setDeliveryOverride(null);setWebsiteFailed(false);setWebsiteRecovered(false);
    };
    window.addEventListener("popstate", restore);
    return () => window.removeEventListener("popstate", restore);
  }, []);
  useEffect(() => {
    document.title = `${episode.name} — Фабрика Ани · Vanya Arc / Aha!`;
    if(firstRender.current){firstRender.current=false;return}
    titleRef.current?.focus();
  }, [episodeId, problemVisible, episode.name]);
  function chooseNext(id: EpisodeId) {
    history.pushState(null,"",`/series/?episode=${id}`);
    setEpisodeId(id);setProblemVisible(false);setChoice(null);setWebsiteFailed(false);setWebsiteRecovered(false);
  }
  const canContinue = !!result?.achieved && (!websiteFailed || websiteRecovered);
  return <div className="season" data-episode={episode.id} data-beat={problemVisible ? "problem" : "intro"}>
    <a className="skip-link" href="#season-story">Перейти к истории</a>
    <header className="season-header">
      <a href="/" className="season-brand" aria-label="Vanya Arc / Aha! — главная">
        <img src={resolvedTheme==="dark"?"/aha-impulse-mark-dark.svg":"/aha-impulse-mark.svg"} alt="" width="44" height="28"/>
        <span>Vanya Arc <span>/</span> <strong>Aha!</strong></span>
      </a>
      <ThemeToggle variant="dropdown"/>
    </header>
    <main id="season-story" className="season-main">
      <WorkflowStrip className="season-progress" label="Фабрика Ани" status={`Серия ${episode.number} из ${episodes.length}`}
        progress={{value:episode.number,max:episodes.length,label:"Прогресс сезона"}}/>
      <AnimatePresence mode="wait" initial={false}>
        <motion.article key={episode.id + (problemVisible ? "-problem" : "-start")} className="season-episode"
          initial={reduced ? false : {opacity:0,y:10}} animate={{opacity:1,y:0}}
          exit={reduced ? undefined : {opacity:0,y:-8}} transition={{duration:reduced ? 0 : .2}}>
          <div className="season-copy">
            <p className="season-kicker">СЕЗОН 1 · СЕРИЯ {episode.number}</p>
            <h1 tabIndex={-1} ref={titleRef}>{beat.title}</h1>
            <p className="season-description">{beat.body}</p>
            <section className="season-chat" aria-label="Аня разговаривает с агентом">
              <div className="season-message">
                <span className="season-chat-speaker">Аня</span>
                <p>{beat.anya}</p>
              </div>
              <div className="season-message season-agent-message">
                <div className="season-chat-speaker"><Bot size={17} aria-hidden="true"/> Агент</div>
                <p>{beat.agent}</p>
              </div>
            </section>
            {!problemVisible ? (
              <ActionButton variant="accent" size="md" className="season-primary"
                onClick={()=>{setProblemVisible(true);setChoice(null);setResult(null);setDeliveryOverride(null)}}>
                {episode.reveal}<ArrowRight size={19} aria-hidden="true"/>
              </ActionButton>
            ) : (
              <section className="season-decision" aria-label="Решение зрителя">
                <h2>{episode.decision}</h2>
                <div className="season-choices">
                  {episode.choices.map((option)=><ActionButton key={option.id} variant="outline" size="md"
                    className="season-choice" aria-pressed={choice===option.id}
                    onClick={()=>{setChoice(option.id);setResult(playChoice(episode.id, option.id));setDeliveryOverride(null);setWebsiteFailed(false);setWebsiteRecovered(false)}}>
                    <span>{option.label}</span><ArrowRight size={18} aria-hidden="true"/>
                  </ActionButton>)}
                </div>
                {result && <motion.div className="season-consequence" role="status"
                  key={result.choice} initial={reduced ? false : {opacity:0,y:7}} animate={{opacity:1,y:0}}>
                  <div className="season-consequence-heading">
                    {canContinue ? <CheckCircle2 size={22} aria-hidden="true"/> : <TriangleAlert size={22} aria-hidden="true"/>}
                    <strong>{websiteFailed && !websiteRecovered ? "Сайт не получил пост. Telegram уже получил." : result.heading}</strong>
                  </div>
                  <p>{websiteFailed && !websiteRecovered ? "Пост не нужно генерировать заново и отправлять в Telegram повторно. Исправим только сайт." : result.explanation}</p>
                  <dl>
                    <div><dt>Изменилось</dt><dd>{result.changed}</dd></div>
                    <div><dt>Осталось</dt><dd>{result.unchanged}</dd></div>
                  </dl>
                </motion.div>}
                {episode.id==="both-channels" && !!result?.achieved && (
                  <div className="season-failure">
                    {!websiteFailed ? <ActionButton variant="text" size="md" onClick={()=>{setDeliveryOverride(simulateWebsiteFailure());setWebsiteFailed(true)}}>
                      Проверить, что будет при ошибке сайта
                    </ActionButton> :
                      websiteRecovered ? <p role="status">Повторили только сайт. Telegram не отправляли второй раз.</p> :
                      <><p role="status">Сайт временно не принимает пост. Telegram уже получил свой экземпляр.</p>
                      <ActionButton variant="outline" size="md" onClick={()=>{if(deliveryOverride){setDeliveryOverride(retryOnlyWebsite(deliveryOverride));setWebsiteRecovered(true)}}}>Повторить только публикацию на сайте</ActionButton></>}
                  </div>
                )}
                {canContinue && <div className="season-afterword">
                  <Tag size="md" isActive>{episode.pattern}</Tag>
                  <h2>{episode.finish.title}</h2>
                  <p>{episode.finish.explanation}</p>
                  <p className="season-anya-last">Аня: «{episode.finish.anya.replace(/^"|"$/g,"")}»</p>
                  {next ? <ActionButton variant="accent" size="md" className="season-primary" onClick={()=>chooseNext(next.id)}>
                    Следующая серия · {next.number}<ArrowRight size={19} aria-hidden="true"/>
                  </ActionButton> : <a className="season-season-end" href="/di/">Сезон пройден. Исследовать старый технический фильм</a>}
                </div>}
              </section>
            )}
          </div>
          <Stage episode={episode} problemVisible={problemVisible} result={result}
            websiteFailed={websiteFailed} websiteRecovered={websiteRecovered} deliveryOverride={deliveryOverride}/>
        </motion.article>
      </AnimatePresence>
      <div className="season-bottom">
        <div className="season-links">
          {episode.number>1 && <ActionButton variant="text" size="md" onClick={()=>chooseNext(episodes[episode.number-2].id)}><ArrowLeft size={17} aria-hidden="true"/> Предыдущая серия</ActionButton>}
          <ActionButton variant="text" size="md" onClick={()=>{setProblemVisible(false);setChoice(null);setWebsiteFailed(false);setWebsiteRecovered(false)}}><RotateCcw size={17} aria-hidden="true"/> Сначала эту серию</ActionButton>
        </div>
        <details className="season-episodes-list"><summary>Все четыре серии</summary><div>{episodes.map(e=><button type="button" key={e.id} onClick={()=>chooseNext(e.id)} aria-current={e.id===episode.id?"step":undefined}>{e.number}. {e.name}</button>)}</div></details>
      </div>
    </main>
    <footer className="season-footer"><span>Учебный сериал · четыре маленьких эксперимента</span><a href="/">Технический фильм DIP</a></footer>
  </div>;
}
