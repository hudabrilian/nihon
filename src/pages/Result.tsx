import { useWindowSize } from "react-use";
import { Page, usePageStore } from "../stores/page";
import { useResultStore } from "../stores/result";
import { Sets, useTestStore } from "../stores/test";
import ReactConfetti from "react-confetti";
import { useEffect } from "react";

export default function ResultPage() {
  const { width, height } = useWindowSize();

  const { questions, answers, mistakes, setAnswers, setQuestions } =
    useResultStore();
  const { setSet, setSelectedGroups } = useTestStore();
  const { setPage } = usePageStore();

  useEffect(() => {
    if (questions.length === 0) {
      setPage(Page.Home);
    }
  }, []);

  const groups = questions
    .map((item) => item.group)
    .filter((value, index, self) => self.indexOf(value) === index);

  const reset = () => {
    setAnswers([]);
    setQuestions([]);
    setSet(Sets.Hiragana);
    setSelectedGroups([]);
    setPage(Page.Home);
  };

  const restart = () => {
    setAnswers([]);
    setPage(Page.Test);
  };

  const result = {
    correct: answers.filter((item, i) => item === questions[i].answer).length,
    incorrect: answers.filter((item, i) => item !== questions[i].answer).length,
  };

  return (
    <div className="container mx-auto px-4 py-10 flex flex-col gap-6 bg-base-100 relative overflow-hidden min-h-screen select-auto">
      {result.incorrect === 0 && (
        <ReactConfetti width={width} height={height} />
      )}

      <div className="flex justify-between items-center">
        <h1 className="font-bold text-3xl">Result Page</h1>
        <p>
          Correct: {result.correct}
          <br />
          Incorrect: {result.incorrect}
        </p>
      </div>

      <div className="flex-1">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {groups.map((group, i) => (
            <div key={i} className="card bg-base-300 shadow-md p-4 gap-4">
              <h2 className="text-xl font-bold">Group {group}</h2>
              <div className="grid grid-cols-5 gap-4">
                {questions
                  .filter((item) => item.group === group)
                  .map((item, j) => (
                    <div
                      key={j}
                      className={
                        "card p-2 flex items-center justify-center flex-col " +
                        (answers[item.idx] === item.answer
                          ? "bg-success text-success-content"
                          : "bg-error text-error-content")
                      }
                    >
                      <p>
                        {mistakes.find(
                          (mistake) => mistake.question === item.question
                        )
                          ? mistakes.find(
                              (mistake) => mistake.question === item.question
                            )?.count
                          : 0}{" "}
                        x
                      </p>
                      <h3 className="font-bold text-xl">{item.question}</h3>
                      <p>{answers[item.idx]}</p>
                    </div>
                  ))}
              </div>
            </div>
          ))}
        </div>

        <div className="flex justify-center gap-10 p-6">
          <button
            className="btn btn-primary"
            onClick={() => {
              reset();
            }}
          >
            Home
          </button>
          <button
            className="btn btn-primary"
            onClick={() => {
              restart();
            }}
          >
            Restart
          </button>
        </div>
      </div>
    </div>
  );
}
