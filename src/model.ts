export type Machine = "espresso" | "filter" | "kettle";
export type State = { chapter: number; machine: Machine; cups: number; contract: string };
export type Action = { type: "chapter"; chapter: number } | { type: "machine"; machine: Machine } | { type: "brew" } | { type: "reset" };
export const initialState: State = { chapter: 0, machine: "espresso", cups: 0, contract: "Приготовить чашку чёрного кофе" };
export function canBrew(state: State): boolean {
  return state.machine !== "kettle" && (state.chapter > 0 || state.machine === "espresso");
}
export function transition(state: State, action: Action): State {
  switch (action.type) {
    case "chapter": return { ...state, chapter: Math.max(0, Math.min(2, action.chapter)) };
    case "machine": return { ...state, machine: action.machine };
    case "brew": return canBrew(state) ? { ...state, cups: state.cups + 1 } : state;
    case "reset": return initialState;
  }
}
export const machines: { id: Machine; name: string; note: string }[] = [
  { id: "espresso", name: "Эспрессо-машина", note: "Давление и помпа" },
  { id: "filter", name: "Фильтр-машина", note: "Гравитация и время" },
  { id: "kettle", name: "Просто чайник", note: "Только горячая вода" },
];
export const chapters = [
  { title: "В плену у детали", heading: "Одна машина.\nСлишком много власти.", body: "Ты открываешь кофейню. Но все инструкции заточены под одну эспрессо-машину: её кнопки, её режимы, её привычки.", prompt: "Попробуй заменить машину. Что будет с кофейней?", takeaway: "Деталь диктует правила всему делу." },
  { title: "Перевернём правила", heading: "Сначала — что нужно.\nПотом — кто сделает.", body: "Теперь кофейня сама задаёт договор: «Приготовить чашку чёрного кофе». Не сколько бар давления. Не какую кнопку нажать. Только нужный результат.", prompt: "Смени машину и приготовь кофе. Договор останется прежним.", takeaway: "Кофейня владеет требованиями. Техника подстраивается." },
  { title: "Свобода замены", heading: "Другая техника.\nТа же кофейня.", body: "Эспрессо или фильтр — способы разные, обещание одно. Ты меняешь исполнителя, а не смысл своего дела. Но чайник не подходит: он не умеет варить кофе.", prompt: "Проверь границу: выбери чайник. Договор — не магия.", takeaway: "Меняем детали. Сохраняем главное." },
];
