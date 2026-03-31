import { useReducer, useCallback, useMemo, useEffect } from "react";
import { getKana } from "../data/data";
import { Mistake, PreviousAnswers } from "../stores/result";
import { Sets } from "../stores/test";

export type TestState = {
  step: number;
  userAnswer: string[];
  showAlert: boolean;
  correct: Array<boolean | null>;
  alertShown: boolean;
  progress: number;
  hoverList: boolean;
  previousAnswers: PreviousAnswers[];
  answer: string;
  showList: boolean;
  mistakesState: Mistake[];
};

export type TestAction =
  | { type: "INIT"; payload: { length: number } }
  | { type: "UPDATE_ANSWER"; payload: { step: number; answer: string } }
  | { type: "SET_CORRECT"; payload: { step: number; value: boolean | null } }
  | { type: "NEXT_STEP"; payload: { length: number } }
  | { type: "PREV_STEP" }
  | { type: "SET_ANSWER"; payload: string }
  | { type: "SET_SHOW_ALERT"; payload: boolean }
  | { type: "SET_ALERT_SHOWN"; payload: boolean }
  | { type: "SET_SHOW_LIST"; payload: boolean }
  | { type: "SET_HOVER_LIST"; payload: boolean }
  | { type: "ADD_MISTAKE"; payload: Mistake }
  | { type: "ADD_PREVIOUS_ANSWER"; payload: PreviousAnswers }
  | { type: "UPDATE_PROGRESS"; payload: number }
  | { type: "RESET"; payload: { length: number } };

const initialState: TestState = {
  step: 0,
  userAnswer: [],
  showAlert: false,
  correct: [],
  alertShown: false,
  progress: 0,
  hoverList: false,
  previousAnswers: [],
  answer: "",
  showList: true,
  mistakesState: [],
};

function testReducer(state: TestState, action: TestAction): TestState {
  switch (action.type) {
    case "INIT":
      return {
        ...state,
        userAnswer: new Array(action.payload.length).fill(""),
        correct: new Array(action.payload.length).fill(null),
      };

    case "SET_ANSWER":
      return { ...state, answer: action.payload };

    case "UPDATE_ANSWER":
      const updated = [...state.userAnswer];
      updated[action.payload.step] = action.payload.answer;
      return { ...state, userAnswer: updated };

    case "SET_CORRECT":
      const newCorrect = [...state.correct];
      newCorrect[action.payload.step] = action.payload.value;
      return { ...state, correct: newCorrect };

    case "NEXT_STEP":
      return {
        ...state,
        step:
          state.step < action.payload.length - 1 ? state.step + 1 : state.step,
      };

    case "PREV_STEP":
      return {
        ...state,
        step: state.step > 0 ? state.step - 1 : state.step,
      };

    case "SET_SHOW_ALERT":
      return { ...state, showAlert: action.payload };

    case "SET_ALERT_SHOWN":
      return { ...state, alertShown: action.payload };

    case "SET_SHOW_LIST":
      return { ...state, showList: action.payload };

    case "SET_HOVER_LIST":
      return { ...state, hoverList: action.payload };

    case "ADD_MISTAKE":
      const existingMistake = state.mistakesState.find(
        (m) => m.question === action.payload.question,
      );
      const newMistakes = existingMistake
        ? state.mistakesState.map((m) =>
            m.question === action.payload.question
              ? { ...m, count: m.count + 1 }
              : m,
          )
        : [...state.mistakesState, action.payload];
      return { ...state, mistakesState: newMistakes };

    case "ADD_PREVIOUS_ANSWER":
      const existingAnswer = state.previousAnswers.find(
        (p) => p.question === action.payload.question,
      );
      const newPreviousAnswers = existingAnswer
        ? state.previousAnswers.map((p) =>
            p.question === action.payload.question
              ? {
                  ...p,
                  answers: [...p.answers, ...action.payload.answers],
                }
              : p,
          )
        : [...state.previousAnswers, action.payload];
      return { ...state, previousAnswers: newPreviousAnswers };

    case "UPDATE_PROGRESS":
      return { ...state, progress: action.payload };

    case "RESET":
      return {
        step: 0,
        userAnswer: new Array(action.payload.length).fill(""),
        showAlert: false,
        correct: new Array(action.payload.length).fill(null),
        alertShown: false,
        progress: 0,
        hoverList: false,
        previousAnswers: [],
        answer: "",
        showList: true,
        mistakesState: [],
      };

    default:
      return state;
  }
}

export function useTestLogic(
  currentSet: Sets,
  selectedGroups: string[],
  randomize: boolean,
) {
  const [state, dispatch] = useReducer(testReducer, initialState);

  const listKana = useMemo(
    () => getKana(currentSet, selectedGroups, randomize),
    [currentSet, selectedGroups, randomize],
  );

  // Initialize on mount and when listKana changes
  useEffect(() => {
    dispatch({ type: "INIT", payload: { length: listKana.length } });
  }, [listKana.length]);

  const changeStep = useCallback(
    (next: boolean) => {
      if (next) {
        dispatch({ type: "NEXT_STEP", payload: { length: listKana.length } });
      } else {
        dispatch({ type: "PREV_STEP" });
      }
    },
    [listKana.length],
  );

  return {
    state,
    dispatch,
    listKana,
    changeStep,
  };
}
