import { useEffect, useMemo, useRef, useCallback } from "react";
import Sidebar from "../components/sidebar";
import { getKana } from "../data/data";
import { Page, usePageStore } from "../stores/page";
import { useResultStore } from "../stores/result";
import { useSettingsStore } from "../stores/settings";
import { useTestStore } from "../stores/test";
import { useTestLogic } from "../hooks/useTestLogic";

import useSound from "use-sound";
import correctSfx from "../assets/sounds/correct.mp3";
import incorrectSfx from "../assets/sounds/incorrect.mp3";

export default function TestPage() {
  const { setPage } = usePageStore();
  const { currentSet, selectedGroups, randomize } = useTestStore();
  const { setQuestions, setAnswers, setMistakes, setPreviousAnswers } =
    useResultStore();
  const {
    font,
    showNextQuestion,
    showPreviousQuestion,
    enableSound,
    showPreviousAnswers,
  } = useSettingsStore();

  const { state, dispatch } = useTestLogic(
    currentSet,
    selectedGroups,
    randomize,
  );
  const inputRef = useRef<HTMLInputElement>(null);
  const scrollNum = useRef<HTMLDivElement>(null);

  const [playCorrect] = useSound(correctSfx, {
    volume: 0.15,
    interrupt: true,
  });
  const [playIncorrect] = useSound(incorrectSfx, {
    volume: 0.15,
    interrupt: true,
  });

  useEffect(() => {
    if (scrollNum.current) {
      // scroll if the element is not in view
      scrollNum.current.scrollIntoView({
        behavior: "smooth",
        block: "center",
        inline: "center",
      });
    }
  }, [state.step]);

  const listKana = useMemo(() => {
    return getKana(currentSet, selectedGroups, randomize);
  }, [currentSet, selectedGroups]);

  useEffect(() => {
    dispatch({ type: "INIT", payload: { length: listKana.length } });
  }, [listKana, dispatch]);

  const proceedToResults = useCallback(
    (updatedUserAnswer: string[]) => {
      setQuestions(
        listKana.map((item, index) => ({
          idx: index,
          question: item.char,
          answer: item.romaji,
          group: item.group,
        })),
      );
      setAnswers(updatedUserAnswer);
      setMistakes(state.mistakesState);
      setPreviousAnswers(state.previousAnswers);
      setPage(Page.Result);
    },
    [
      listKana,
      state.mistakesState,
      state.previousAnswers,
      setQuestions,
      setAnswers,
      setMistakes,
      setPreviousAnswers,
      setPage,
    ],
  );

  const updateUserAnswer = useCallback(() => {
    if (state.userAnswer[state.step] === state.answer) {
      return;
    }

    const currentKana = listKana[state.step];
    if (state.answer !== "") {
      if (currentKana.romaji === state.answer.toLowerCase()) {
        // Jawaban benar: simpan jawaban
        dispatch({
          type: "UPDATE_ANSWER",
          payload: { step: state.step, answer: state.answer },
        });
        dispatch({
          type: "SET_CORRECT",
          payload: { step: state.step, value: true },
        });

        if (enableSound) {
          playCorrect();
        }
      } else {
        // Jawaban salah: kosongkan jawaban
        dispatch({
          type: "UPDATE_ANSWER",
          payload: { step: state.step, answer: "" },
        });
        dispatch({
          type: "SET_CORRECT",
          payload: { step: state.step, value: false },
        });

        dispatch({
          type: "ADD_PREVIOUS_ANSWER",
          payload: {
            question: currentKana.char,
            answers: [state.answer],
          },
        });

        if (enableSound) {
          playIncorrect();
        }

        dispatch({
          type: "ADD_MISTAKE",
          payload: { question: currentKana.char, count: 1 },
        });
      }
    }
  }, [
    state.userAnswer,
    state.answer,
    state.step,
    listKana,
    enableSound,
    playCorrect,
    playIncorrect,
    dispatch,
  ]);

  const finish = useCallback(() => {
    updateUserAnswer();

    setTimeout(() => {
      const updatedUserAnswer = [...state.userAnswer];
      updatedUserAnswer[state.step] = state.answer || "";

      if (updatedUserAnswer.filter((item: string) => item === "").length > 0) {
        if (state.alertShown) {
          proceedToResults(updatedUserAnswer);
        } else {
          dispatch({ type: "SET_SHOW_ALERT", payload: true });
          dispatch({ type: "SET_ALERT_SHOWN", payload: true });
        }
        return;
      }

      dispatch({ type: "SET_SHOW_ALERT", payload: false });
      proceedToResults(updatedUserAnswer);
    }, 0);
  }, [
    updateUserAnswer,
    state.userAnswer,
    state.answer,
    state.step,
    state.alertShown,
    proceedToResults,
    dispatch,
  ]);

  const restart = useCallback(() => {
    dispatch({ type: "RESET", payload: { length: listKana.length } });
    setPage(Page.Test);
  }, [listKana.length, setPage, dispatch]);

  const changeStep = useCallback(
    (next: boolean) => {
      updateUserAnswer();

      if (next) {
        dispatch({ type: "NEXT_STEP", payload: { length: listKana.length } });
      } else {
        dispatch({ type: "PREV_STEP" });
      }
    },
    [updateUserAnswer, listKana.length, dispatch],
  );

  useEffect(() => {
    dispatch({
      type: "SET_ANSWER",
      payload: state.userAnswer[state.step] || "",
    });
    dispatch({ type: "SET_SHOW_ALERT", payload: false });
    dispatch({ type: "SET_ALERT_SHOWN", payload: false });

    if (inputRef.current) {
      inputRef.current.select();
    }
  }, [state.step, state.userAnswer, dispatch]);

  useEffect(() => {
    if (state.hoverList) return;

    let scrollTimeout: ReturnType<typeof setTimeout> | null = null;

    const handleScroll = (e: Event) => {
      if (e instanceof WheelEvent) {
        if (scrollTimeout) {
          clearTimeout(scrollTimeout);
        }

        scrollTimeout = setTimeout(() => {
          if (e.deltaY > 0) {
            changeStep(true);
          } else {
            changeStep(false);
          }
        }, 20);
      }
    };

    window.addEventListener("wheel", handleScroll);
    return () => {
      if (scrollTimeout) {
        clearTimeout(scrollTimeout);
      }
      window.removeEventListener("wheel", handleScroll);
    };
  }, [changeStep, state.hoverList]);

  useEffect(() => {
    const answered = state.userAnswer.filter(
      (item: string) => item !== "",
    ).length;
    const total = listKana.length;
    dispatch({
      type: "UPDATE_PROGRESS",
      payload: (answered / total) * 100,
    });
  }, [state.userAnswer, listKana.length, dispatch]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Enter" || e.key === "ArrowRight") {
        if (state.step === listKana.length - 1 && e.key !== "ArrowRight") {
          finish();
        } else {
          changeStep(true);
        }
      } else if (e.key === "ArrowLeft" && state.step > 0) {
        changeStep(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [changeStep, state.step, listKana.length, finish]);

  return (
    <div className="min-h-screen max-h-screen flex flex-col items-center justify-center w-screen max-w-screen overflow-hidden select-none">
      <div className="bg-base-100 w-full flex items-center justify-center p-4">
        <div className="flex items-center justify-between w-5xl gap-4">
          <div className="w-1/3 flex gap-4">
            <button
              className="btn btn-primary btn-sm"
              onClick={() => {
                setPage(Page.Home);
              }}
            >
              Back
            </button>
            <button className="btn btn-accent btn-sm" onClick={finish}>
              Finish
            </button>
          </div>

          <div className="flex-1 text-center">
            <h1 className="text-xl font-bold">Nihoon</h1>
            <span className="text-xs text-base-content/30">By Brilian.</span>
          </div>

          <div className="flex justify-end gap-4 w-1/3">
            <button
              className="btn btn-secondary btn-sm"
              onClick={() => {
                const modal = document.getElementById(
                  "restart_modal",
                ) as HTMLDialogElement;
                modal?.showModal();
              }}
            >
              Restart
            </button>
            <dialog id="restart_modal" className="modal">
              <div className="modal-box">
                <h3 className="font-bold text-lg">
                  Are you sure you want to restart the test?
                </h3>
                <p className="py-4">
                  This will reset your progress and you will lose all your
                  answers.
                </p>

                <div className="flex justify-end gap-4">
                  <button
                    className="btn btn-primary"
                    onClick={() => {
                      restart();
                      const modal = document.getElementById(
                        "restart_modal",
                      ) as HTMLDialogElement;
                      modal?.close();
                    }}
                  >
                    Yes, restart
                  </button>

                  <button
                    className="btn btn-secondary"
                    onClick={() => {
                      const modal = document.getElementById(
                        "restart_modal",
                      ) as HTMLDialogElement;
                      modal?.close();
                    }}
                  >
                    Cancel
                  </button>
                </div>
              </div>
              <form method="dialog" className="modal-backdrop">
                <button>close</button>
              </form>
            </dialog>

            <div className="flex items-center gap-4 text-end">
              <Sidebar />
            </div>
          </div>
        </div>
      </div>

      <div className="flex-1 flex relative flex-col bg-base gap-10 w-full h-full items-center justify-center">
        {state.showAlert && (
          <div
            role="alert"
            className="alert alert-error absolute top-10 max-w-md z-10 transition-all duration-300 ease-in-out"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 shrink-0 stroke-current"
              fill="none"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <div className="flex flex-col gap-2">
              <span>
                Are you sure you want to finish the test without answering all
                the questions?
              </span>
              <span>
                You still have{" "}
                {state.userAnswer.filter((item: string) => item === "").length}{" "}
                unanswered questions.
              </span>
              <span>
                Click on the "Finish" button again to finish the test.
              </span>
            </div>
          </div>
        )}

        <div className="flex-1 flex w-full relative bg-base-200">
          <div className="absolute z-0 w-full h-full flex justify-center">
            <progress
              className="progress progress-primary w-5/6 absolute m-2"
              value={state.progress}
              max="100"
            ></progress>

            <h3 className="font-bold text-2xl mt-10">
              {state.step + 1}/{listKana.length}
            </h3>
          </div>

          <div
            className="hidden sm:block absolute z-10 h-full"
            onMouseEnter={() =>
              dispatch({ type: "SET_HOVER_LIST", payload: true })
            }
            onMouseLeave={() =>
              dispatch({ type: "SET_HOVER_LIST", payload: false })
            }
          >
            {!state.showList && (
              <button
                className="btn btn-primary btn-sm m-10"
                onClick={() => {
                  dispatch({ type: "SET_SHOW_LIST", payload: true });
                }}
              >
                {">"}
              </button>
            )}
            {state.showList && (
              <div className="card bg-base-300 shadow-lg rounded-box p-4 m-6 max-w-md h-1/2">
                <div className="flex flex-row items-start justify-start">
                  <button
                    className="btn btn-primary btn-sm mr-2"
                    onClick={() => {
                      dispatch({ type: "SET_SHOW_LIST", payload: false });
                    }}
                  >
                    {"<"}
                  </button>
                  <h2 className="font-bold text-base-content text-2xl pb-4">
                    Questions
                  </h2>
                </div>
                <div className="grid grid-cols-5 gap-2 overflow-y-scroll">
                  {listKana.map((item, index) => (
                    <div
                      key={index}
                      ref={index === state.step ? scrollNum : null}
                      className={
                        "flex items-center justify-center p-2 rounded-md hover:bg-accent/50 " +
                        (state.step === index
                          ? "cursor-default bg-secondary text-secondary-content"
                          : "cursor-pointer") +
                        (state.correct[index] !== null
                          ? state.correct[index] === true
                            ? " bg-success text-success-content "
                            : " bg-error text-error-content "
                          : " ") +
                        font
                      }
                      onClick={() => {
                        dispatch({ type: "SET_STEP", payload: index });
                      }}
                    >
                      <span className="text-lg">{item.char}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
          <div className="flex-1 w-full flex flex-col p-4">
            <div className={"h-full " + font}>
              <div className="flex flex-row items-center justify-center w-full h-full">
                <div className="flex justify-end w-1/3">
                  {showPreviousQuestion && (
                    <h2 className="font-bold text-primary/30 text-6xl relative hidden sm:block">
                      {state.step !== 0 ? listKana[state.step - 1].char : ""}

                      {state.step !== 0 &&
                        state.correct[state.step - 1] !== null &&
                        state.correct[state.step - 1] === true && (
                          <span className="font-bold text-sm text-success absolute -top-2 left-0">
                            ✓
                          </span>
                        )}

                      {state.step !== 0 &&
                        state.correct[state.step - 1] !== null &&
                        !state.correct[state.step - 1] && (
                          <span className="font-bold text-sm text-error absolute -top-2 left-0">
                            ✕
                          </span>
                        )}
                    </h2>
                  )}
                </div>

                <div className="w-1/3 flex flex-col items-center justify-center relative gap-4">
                  <h2 className="font-bold text-primary text-9xl px-12 min-w-fit">
                    {listKana[state.step].char}
                  </h2>
                  {state.correct[state.step] !== null && (
                    <div
                      className={
                        "badge absolute -bottom-12 " +
                        (state.correct[state.step] === true
                          ? "badge-success"
                          : "badge-error")
                      }
                    >
                      {state.correct[state.step] === true
                        ? "Correct"
                        : "Incorrect"}
                    </div>
                  )}
                </div>

                <div className="flex justify-start w-1/3">
                  {showNextQuestion && (
                    <h2 className="font-bold text-primary/30 text-6xl relative hidden sm:block">
                      {state.step !== listKana.length - 1
                        ? listKana[state.step + 1].char
                        : ""}

                      {state.step !== listKana.length - 1 &&
                        state.correct[state.step + 1] !== null &&
                        state.correct[state.step + 1] === true && (
                          <span className="font-bold text-sm text-success absolute -top-2 right-0">
                            ✓
                          </span>
                        )}

                      {state.step !== listKana.length - 1 &&
                        state.correct[state.step + 1] !== null &&
                        !state.correct[state.step + 1] && (
                          <span className="font-bold text-sm text-error absolute -top-2 right-0">
                            ✕
                          </span>
                        )}
                    </h2>
                  )}
                </div>
              </div>
            </div>

            <div className="flex flex-col items-center justify-center z-20">
              {showPreviousAnswers && (
                <div className="mb-2">
                  {state.previousAnswers
                    .filter(
                      (item: any) =>
                        item.question === listKana[state.step].char,
                    )
                    .map((item: any) =>
                      item.answers
                        .slice(-4) // Get the latest 4 answers
                        .map((answer: string, index: number) => (
                          <span
                            key={index}
                            className="badge badge-error badge-outline text-xs mr-1"
                          >
                            {answer}
                          </span>
                        )),
                    )}
                </div>
              )}

              <h3 className="font-bold text-2xl">Type the romaji</h3>
              <input
                type="text"
                placeholder="_ _"
                className="input input-ghost input-xl text-center focus:outline-0 focus:bg-base-200 border-b-accent focus:border-b-accent mb-4 rounded-none "
                ref={inputRef}
                value={state.answer}
                onChange={(e) => {
                  dispatch({ type: "SET_ANSWER", payload: e.target.value });
                }}
              />

              <div className="w-full flex items-center justify-around px-6 pb-6 gap-4">
                <div className="flex w-1/3 justify-end">
                  <button
                    className="btn btn-primary"
                    onClick={() => {
                      changeStep(false);
                    }}
                    disabled={state.step === 0}
                  >
                    Previous
                  </button>
                </div>

                <div className="max-w-md text-center mx-4">
                  <span className="text-xs pb-2 opacity-50 text-center max-w-md">
                    Press 'Enter' or 'Right Arrow' to go to the next question.
                    Press 'Left Arrow' to go to the previous question. Scroll to
                    change the question.
                  </span>
                </div>

                <div className="flex w-1/3 justify-start">
                  {state.step === listKana.length - 1 ? (
                    <button
                      className="btn btn-accent"
                      onClick={() => {
                        updateUserAnswer();
                        finish();
                      }}
                    >
                      Finish
                    </button>
                  ) : (
                    <button
                      className="btn btn-primary"
                      onClick={() => {
                        changeStep(true);
                      }}
                      disabled={state.step === listKana.length - 1}
                    >
                      Next
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
