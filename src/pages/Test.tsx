import { useEffect, useMemo, useRef, useState } from "react";
import Sidebar from "../components/sidebar";
import { getKana } from "../data/data";
import { Page, usePageStore } from "../stores/page";
import { Mistake, PreviousAnswers, useResultStore } from "../stores/result";
import { useSettingsStore } from "../stores/settings";
import { useTestStore } from "../stores/test";

import useSound from "use-sound";
import correctSfx from "../assets/sounds/correct.mp3";
import incorrectSfx from "../assets/sounds/incorrect.mp3";
import UserNav from "../components/user-nav";
import { Link } from "@tanstack/react-router";

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

  const [step, setStep] = useState(0);
  const [userAnswer, setUserAnswer] = useState<string[]>([]);
  const [showAlert, setShowAlert] = useState(false);
  const [correct, setCorrect] = useState<Array<boolean | null>>([]);
  const [alertShown, setAlertShown] = useState(false);
  const [progress, setProgress] = useState(0);
  const [hoverList, setHoverList] = useState(false);

  const [previousAnswers, setPreviousAnswersState] = useState<
    PreviousAnswers[]
  >([]);

  const [answer, setAnswer] = useState<string>("");
  const inputRef = useRef<HTMLInputElement>(null);

  const [showList, setShowList] = useState(true);
  const [mistakesState, setMistakesState] = useState<Mistake[]>([]);

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
  }, [step]);

  const listKana = useMemo(() => {
    return getKana(currentSet, selectedGroups, randomize);
  }, [currentSet, selectedGroups]);

  useEffect(() => {
    setUserAnswer(listKana.map(() => ""));
    setCorrect(new Array(listKana.length).fill(null));
  }, [listKana]);

  const restart = () => {
    setStep(0);
    setUserAnswer(listKana.map(() => ""));
    setCorrect(new Array(listKana.length).fill(null));
    setMistakesState([]);
    setPreviousAnswersState([]);
    setShowAlert(false);
    setAlertShown(false);
    setProgress(0);
    setShowList(true);
    setAnswer("");
    setPage(Page.Test);
  };

  const finish = () => {
    updateUserAnswer();

    setTimeout(() => {
      const updatedUserAnswer = [...userAnswer];
      updatedUserAnswer[step] = answer || "";

      if (updatedUserAnswer.filter((item) => item === "").length > 0) {
        if (alertShown) {
          proceedToResults(updatedUserAnswer);
        } else {
          setShowAlert(true);
          setAlertShown(true);
        }
        return;
      }

      setShowAlert(false);
      proceedToResults(updatedUserAnswer);
    }, 0);
  };

  const proceedToResults = (updatedUserAnswer: string[]) => {
    setQuestions(
      listKana.map((item, index) => ({
        idx: index,
        question: item.char,
        answer: item.romaji,
        group: item.group,
      }))
    );
    setAnswers(updatedUserAnswer);
    setMistakes(mistakesState);
    setPreviousAnswers(previousAnswers);
    setPage(Page.Result);
  };

  const updateUserAnswer = () => {
    if (userAnswer[step] === answer) {
      return;
    }

    setUserAnswer((prev) => {
      const updated = [...prev];
      updated[step] = answer || "";
      return updated;
    });

    const currentKana = listKana[step];
    if (answer !== "") {
      if (currentKana.romaji === answer.toLowerCase()) {
        setCorrect((prev) =>
          prev.map((item, index) => (index === step ? true : item))
        );

        if (enableSound) {
          playCorrect();
        }
      } else {
        setCorrect((prev) =>
          prev.map((item, index) => (index === step ? false : item))
        );

        setPreviousAnswersState((prev) => {
          const updated = [...prev];
          const found = updated.find(
            (item) => item.question === currentKana.char
          );
          if (found) {
            found.answers.push(answer);
          } else {
            updated.push({
              question: currentKana.char,
              answers: [answer],
            });
          }
          return updated;
        });

        if (enableSound) {
          playIncorrect();
        }

        setMistakesState((prev) => {
          const updated = [...prev];
          const found = updated.find(
            (item) => item.question === currentKana.char
          );
          if (found) {
            found.count++;
          } else {
            updated.push({ question: currentKana.char, count: 1 });
          }
          return updated;
        });
      }
    }
  };

  const changeStep = (next: boolean) => {
    updateUserAnswer();

    if (next) {
      setStep((prev) => (prev === listKana.length - 1 ? prev : prev + 1));
    } else {
      setStep((prev) => (prev === 0 ? 0 : prev - 1));
    }
  };

  useEffect(() => {
    setAnswer(userAnswer[step] || "");
    setShowAlert(false);
    setAlertShown(false);

    if (inputRef.current) {
      inputRef.current.select();
    }
  }, [step]);

  useEffect(() => {
    if (hoverList) return;

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
  }, [changeStep]);

  useEffect(() => {
    const answered = userAnswer.filter((item) => item !== "").length;
    const total = listKana.length;
    setProgress((answered / total) * 100);
  }, [userAnswer]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Enter" || e.key === "ArrowRight") {
        if (step === listKana.length - 1 && e.key !== "ArrowRight") {
          finish();
        } else {
          changeStep(true);
        }
      } else if (e.key === "ArrowLeft" && step > 0) {
        changeStep(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [changeStep]);

  return (
    <div className="min-h-screen max-h-screen flex flex-col items-center justify-center w-screen max-w-screen overflow-hidden select-none">
      <div className="bg-base-100 w-full flex items-center justify-center p-4">
        <div className="flex items-center justify-between w-5xl gap-4">
          <div className="w-1/3 flex gap-4">
            <Link to="/selection">
              <button className="btn btn-primary btn-sm">Back</button>
            </Link>
            <button className="btn btn-accent btn-sm" onClick={finish}>
              Finish
            </button>
            <button
              className="btn btn-secondary btn-sm"
              onClick={() => {
                const modal = document.getElementById(
                  "restart_modal"
                ) as HTMLDialogElement;
                modal?.showModal();
              }}
            >
              Restart
            </button>
          </div>

          <div className="flex-1 text-center">
            <h1 className="text-xl font-bold">Nihoon</h1>
            <span className="text-xs text-base-content/30">By Brilian.</span>
          </div>

          <div className="flex justify-end gap-4 w-1/3">
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
                        "restart_modal"
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
                        "restart_modal"
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
              <UserNav greeting={false} />
            </div>
          </div>
        </div>
      </div>

      <div className="flex-1 flex relative flex-col bg-base gap-10 w-full h-full items-center justify-center">
        {showAlert && (
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
                You still have {userAnswer.filter((item) => item === "").length}{" "}
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
              value={progress}
              max="100"
            ></progress>

            <h3 className="font-bold text-2xl mt-10">
              {step + 1}/{listKana.length}
            </h3>
          </div>

          <div
            className="hidden sm:block absolute z-10 h-full"
            onMouseEnter={() => setHoverList(true)}
            onMouseLeave={() => setHoverList(false)}
          >
            {!showList && (
              <button
                className="btn btn-primary btn-sm m-10"
                onClick={() => {
                  setShowList(true);
                }}
              >
                {">"}
              </button>
            )}
            {showList && (
              <div className="card bg-base-300 shadow-lg rounded-box p-4 m-6 max-w-md h-1/2">
                <div className="flex flex-row items-start justify-start">
                  <button
                    className="btn btn-primary btn-sm mr-2"
                    onClick={() => {
                      setShowList(false);
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
                      ref={index === step ? scrollNum : null}
                      className={
                        "flex items-center justify-center p-2 rounded-md hover:bg-accent/50 " +
                        (step === index
                          ? "cursor-default bg-secondary text-secondary-content"
                          : "cursor-pointer") +
                        (correct[index] !== null
                          ? correct[index] === true
                            ? " bg-success text-success-content "
                            : " bg-error text-error-content "
                          : " ") +
                        font
                      }
                      onClick={() => {
                        setStep(index);
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
                      {step !== 0 ? listKana[step - 1].char : ""}

                      {step !== 0 &&
                        correct[step - 1] !== null &&
                        correct[step - 1] === true && (
                          <span className="font-bold text-sm text-success absolute -top-2 left-0">
                            ✓
                          </span>
                        )}

                      {step !== 0 &&
                        correct[step - 1] !== null &&
                        !correct[step - 1] && (
                          <span className="font-bold text-sm text-error absolute -top-2 left-0">
                            ✕
                          </span>
                        )}
                    </h2>
                  )}
                </div>

                <div className="w-1/3 flex flex-col items-center justify-center relative gap-4">
                  <h2 className="font-bold text-primary text-9xl px-12 min-w-fit">
                    {listKana[step].char}
                  </h2>
                  {correct[step] !== null && (
                    <div
                      className={
                        "badge absolute -bottom-12 " +
                        (correct[step] === true
                          ? "badge-success"
                          : "badge-error")
                      }
                    >
                      {correct[step] === true ? "Correct" : "Incorrect"}
                    </div>
                  )}
                </div>

                <div className="flex justify-start w-1/3">
                  {showNextQuestion && (
                    <h2 className="font-bold text-primary/30 text-6xl relative hidden sm:block">
                      {step !== listKana.length - 1
                        ? listKana[step + 1].char
                        : ""}

                      {step !== listKana.length - 1 &&
                        correct[step + 1] !== null &&
                        correct[step + 1] === true && (
                          <span className="font-bold text-sm text-success absolute -top-2 right-0">
                            ✓
                          </span>
                        )}

                      {step !== listKana.length - 1 &&
                        correct[step + 1] !== null &&
                        !correct[step + 1] && (
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
                  {previousAnswers
                    .filter((item) => item.question === listKana[step].char)
                    .map((item) =>
                      item.answers
                        .slice(-4) // Get the latest 4 answers
                        .map((answer, index) => (
                          <span
                            key={index}
                            className="badge badge-error badge-outline text-xs mr-1"
                          >
                            {answer}
                          </span>
                        ))
                    )}
                </div>
              )}

              <h3 className="font-bold text-2xl">Type the romaji</h3>
              <input
                type="text"
                placeholder="_ _"
                className="input input-ghost input-xl text-center focus:outline-0 focus:bg-base-200 border-b-accent focus:border-b-accent mb-4 rounded-none "
                ref={inputRef}
                value={answer}
                onChange={(e) => {
                  setAnswer(e.target.value);
                }}
              />

              <div className="w-full flex items-center justify-around px-6 pb-6 gap-4">
                <div className="flex w-1/3 justify-end">
                  <button
                    className="btn btn-primary"
                    onClick={() => {
                      changeStep(false);
                    }}
                    disabled={step === 0}
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
                  {step === listKana.length - 1 ? (
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
                      disabled={step === listKana.length - 1}
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
