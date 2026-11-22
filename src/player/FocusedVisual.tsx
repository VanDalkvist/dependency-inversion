import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { Check, FileText, Globe2, MessageCircle, Newspaper, Sparkles } from "lucide-react";
import { CraftCard, Tag } from "@vanya/ui";
import type { PlaybackState } from "./playback";

type Observation = {
  received?: number;
  selected?: number;
  draft?: { title?: string };
  artifacts?: { title: string; format: string; body: string }[];
  config?: { publisher?: string };
};

type VisualProps = {
  storyId: string;
  sceneId: string;
  index: number;
  state: PlaybackState;
};

/**
 * A film prop, not a second architecture diagram. Actual selections and
 * run outputs come from PlaybackState, whose effects execute the real lessons.
 * CraftCard and Tag are the shipped Vanya UI components.
 */
export default function FocusedVisual({ storyId, sceneId, index, state }: VisualProps) {
  const reduced = useReducedMotion();
  const isDi = storyId === "dependency-injection";
  const answers = state.answers;
  const run = (state.results.probe ?? state.results.swap ?? state.results.run) as Observation | undefined;
  const publisherId = answers.swap ?? answers.channel;
  const publisher = publisherId === "website" ? "Сайт" : publisherId === "telegram" ? "Telegram" : "Канал пока свободен";
  const hasSharedRule = !!answers.invert || (index > 3 && !isDi);
  const hasRequestedSite = !!answers.growth || index > 1;
  const siteReady = !!answers.channel || !!answers.swap;
  const shownTitle = run?.draft?.title ?? "Новостной выпуск";
  const visualLabel = isDi ? "Помощник Ани и его выпуск" : "Готовый выпуск и каналы публикации";

  return (
    <section className="story-visual" aria-label={visualLabel}>
      <header className="story-visual-header">
        <span className="story-visual-eyebrow">{isDi ? "РАБОЧИЙ СТОЛ АНИ" : "РЕДАКЦИЯ · УЧЕБНЫЙ ПРИМЕР"}</span>
        <Tag isActive={!!run || (!isDi && siteReady)} size="md">
          {run ? "Выпуск собран" : isDi ? "Помощник готов" : siteReady ? "Два канала" : "Первый выпуск"}
        </Tag>
      </header>

      <motion.div className="story-sheet-motion" layout={!reduced}
        transition={reduced ? {duration:0} : {type:"spring", stiffness:240, damping:28}}>
        <CraftCard className="story-paper">
          <div className="story-paper-top">
            <Newspaper size={21} aria-hidden="true"/>
            <span>ДАЙДЖЕСТ АНИ</span>
          </div>
          <AnimatePresence mode="wait" initial={false}>
            <motion.h3 key={shownTitle} initial={reduced ? false : {opacity:0,y:8}}
              animate={{opacity:1,y:0}} exit={reduced ? undefined : {opacity:0,y:-7}}
              transition={{duration:reduced ? 0 : .22}}>
              {shownTitle}
            </motion.h3>
          </AnimatePresence>
          <p>{run && typeof run.selected === "number"
            ? `Помощник получил ${run.received} материала, выбрал ${run.selected} и подготовил текст.`
            : "У Ани собраны новости. Помощник превращает их в готовый текст."}</p>
          <div className="story-paper-stamp">
            <FileText size={17} aria-hidden="true"/>
            <span>{run ? "Текст получен из учебного запуска" : "Один текст для любого канала"}</span>
          </div>
        </CraftCard>
      </motion.div>

      <div className="story-delivery" aria-label="Куда попадёт выпуск">
        <div className="story-delivery-line" aria-hidden="true"><span/></div>
        <div className="story-channel-list">
          {isDi ? (
            <AnimatePresence mode="wait" initial={false}>
              <motion.div key={publisher} className="story-channel-motion"
                initial={reduced ? false : {opacity:0,scale:.95,y:8}}
                animate={{opacity:1,scale:1,y:0}}
                exit={reduced ? undefined : {opacity:0,scale:.95,y:-8}}
                transition={{duration:reduced ? 0 : .28}}>
                <CraftCard className={`story-channel ${publisherId ? "story-channel-ready" : ""}`}>
                  {publisherId === "website" ? <Globe2 size={24} aria-hidden="true"/> :
                    <MessageCircle size={24} aria-hidden="true"/>}
                  <div><strong>{publisher}</strong><span>{!publisherId ? "Аня выберет перед запуском" :
                    sceneId === "swap" && answers.swap ? "Новый канал подключён" : run ? "Готовый текст передан" : "Канал выбран"}</span></div>
                  {publisherId && <Check size={19} className="story-channel-check" aria-hidden="true"/>}
                </CraftCard>
              </motion.div>
            </AnimatePresence>
          ) : (
            <>
              <CraftCard className="story-channel story-channel-ready">
                <MessageCircle size={24} aria-hidden="true"/>
                <div><strong>Telegram</strong><span>Первый выпуск опубликован</span></div>
                <Check size={19} className="story-channel-check" aria-hidden="true"/>
              </CraftCard>
              <AnimatePresence initial={false}>
                {hasRequestedSite && (
                  <motion.div className="story-channel-motion" key="website"
                    initial={reduced ? false : {opacity:0, y:14}}
                    animate={{opacity:1, y:0}}
                    exit={reduced ? undefined : {opacity:0,y:-12}}
                    transition={{duration:reduced ? 0 : .26}}>
                    <CraftCard className={`story-channel ${siteReady ? "story-channel-ready" : "story-channel-waiting"}`}>
                      <Globe2 size={24} aria-hidden="true"/>
                      <div><strong>Сайт</strong><span>{siteReady ? "Тот же выпуск готов к публикации" :
                        hasSharedRule ? "Канал можно подключить" : "Нужна доработка помощника"}</span></div>
                      {siteReady && <Check size={19} className="story-channel-check" aria-hidden="true"/>}
                    </CraftCard>
                  </motion.div>
                )}
              </AnimatePresence>
            </>
          )}
        </div>
      </div>

      {(hasSharedRule || run) && (
        <motion.p className="story-visual-consequence"
          initial={reduced ? false : {opacity:0, y:10}} animate={{opacity:1, y:0}}
          transition={{duration:reduced ? 0 : .22}}>
          {run
            ? `Результат учебного запуска: ${run.artifacts?.length ?? 0} ${(run.artifacts?.length ?? 0)===1 ? "документ" : "документа"}.`
            : "Помощник передаёт готовый текст. Каждый канал оформляет его своим способом."}
        </motion.p>
      )}
      {isDi && !run && sceneId === "root" && (
        <div className="story-assistant-caption"><Sparkles size={19} aria-hidden="true"/>Аня выбирает канал перед каждым выпуском.</div>
      )}
    </section>
  );
}
