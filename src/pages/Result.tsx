import { useWindowSize } from "../hooks/useWindowSize";
import { Page, usePageStore } from "../stores/page";
import { useResultStore } from "../stores/result";
import { Sets, useTestStore } from "../stores/test";
import ReactConfetti from "react-confetti";
import { useEffect, useMemo } from "react";
import Footer from "../components/footer";

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
  }, [questions.length, setPage]);

  const groupedStats = useMemo(() => {
    const uniqueGroups = [...new Set(questions.map((q) => q.group))];
    return uniqueGroups.map((group) => {
      const groupQuestions = questions.filter((item) => item.group === group);
      const groupCorrect = groupQuestions.filter(
        (item) => answers[item.idx] === item.answer,
      ).length;
      const groupPercentage = Math.round(
        (groupCorrect / groupQuestions.length) * 100,
      );

      return {
        group,
        groupQuestions,
        groupCorrect,
        groupPercentage,
      };
    });
  }, [questions, answers]);

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
    total: questions.length,
  };

  const percentage = Math.round((result.correct / result.total) * 100);

  const getPerformanceRating = (pct: number) => {
    if (pct === 100) return { label: "Perfect!", color: "text-success" };
    if (pct >= 80) return { label: "Excellent!", color: "text-success" };
    if (pct >= 60) return { label: "Good Job!", color: "text-info" };
    if (pct >= 40) return { label: "Keep Practicing", color: "text-warning" };
    return { label: "Try Again", color: "text-error" };
  };

  const performance = getPerformanceRating(percentage);

  return (
    <div className="container mx-auto px-4 py-10 flex flex-col gap-8 bg-base-100 relative overflow-hidden min-h-screen select-auto">
      {result.incorrect === 0 && (
        <ReactConfetti width={width} height={height} />
      )}

      {/* Header Section */}
      <div className="text-center">
        <h1 className="font-bold text-4xl mb-2">Test Results</h1>
        <p className="text-base-content/70">
          Here's a summary of your test results
        </p>
      </div>

      {/* Score Summary Card */}
      <div className="card bg-gradient-to-r from-primary to-primary/80 text-primary-content shadow-lg p-8 mx-auto w-full max-w-md">
        <div className="flex flex-col items-center gap-4">
          {/* Score Circle */}
          <div className="relative w-40 h-40 rounded-full flex items-center justify-center bg-primary-content/20 border-4 border-primary-content">
            <div className="text-center">
              <p className="text-5xl font-bold">{percentage}</p>
              <p className="text-sm opacity-90">%</p>
            </div>
          </div>

          {/* Performance Rating */}
          <h2 className={`text-3xl font-bold ${performance.color}`}>
            {performance.label}
          </h2>

          {/* Statistics */}
          <div className="w-full bg-primary-content/10 rounded-lg p-4 space-y-2">
            <div className="flex justify-between items-center">
              <span className="font-semibold">Correct Answers:</span>
              <span className="badge badge-success">
                {result.correct}/{result.total}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="font-semibold">Incorrect Answers:</span>
              <span className="badge badge-error">
                {result.incorrect}/{result.total}
              </span>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="w-full space-y-2">
            <div className="flex justify-between text-sm">
              <span>Progress</span>
              <span>
                {result.correct} of {result.total}
              </span>
            </div>
            <progress
              className="progress progress-success w-full bg-primary-content/20"
              value={result.correct}
              max={result.total}
            ></progress>
          </div>
        </div>
      </div>

      {/* Detailed Results by Group */}
      <div className="flex-1">
        <h2 className="text-2xl font-bold mb-6">Detailed Results by Group</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {groupedStats.map(
            ({ group, groupQuestions, groupCorrect, groupPercentage }, i) => (
              <div key={i} className="card bg-base-200 shadow-md p-6">
                <h3 className="text-lg font-bold mb-4 flex items-center justify-between">
                  <span>Group {group}</span>
                  <span className="text-sm badge badge-outline">
                    {groupCorrect}/{groupQuestions.length}
                  </span>
                </h3>

                {/* Group Progress */}
                <div className="mb-4">
                  <div className="w-full bg-base-300 rounded-full h-2 overflow-hidden">
                    <div
                      className={
                        groupPercentage === 100
                          ? "bg-success"
                          : groupPercentage >= 60
                            ? "bg-info"
                            : "bg-warning"
                      }
                      style={{ width: `${groupPercentage}%` }}
                    ></div>
                  </div>
                  <p className="text-xs text-base-content/70 mt-1 text-right">
                    {groupPercentage}%
                  </p>
                </div>

                {/* Questions */}
                <div className="space-y-2 max-h-96 overflow-y-auto">
                  {groupQuestions.map((item, j) => {
                    const isCorrect = answers[item.idx] === item.answer;
                    const mistakeCount =
                      mistakes.find(
                        (mistake) => mistake.question === item.question,
                      )?.count || 0;

                    return (
                      <div
                        key={j}
                        className={`p-3 rounded-lg border-l-4 transition-all ${
                          isCorrect
                            ? "bg-success/10 border-success"
                            : "bg-error/10 border-error"
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-bold text-lg">
                            {item.question}
                          </span>
                          <span
                            className={`text-sm font-semibold ${
                              isCorrect ? "text-success" : "text-error"
                            }`}
                          >
                            {isCorrect ? "✓" : "✕"}
                          </span>
                        </div>

                        <div className="space-y-1 text-sm">
                          <div>
                            <span className="text-base-content/70">
                              Your Answer:
                            </span>
                            <span className="ml-2 font-semibold">
                              {answers[item.idx] || "(not answered)"}
                            </span>
                          </div>

                          {!isCorrect && (
                            <div>
                              <span className="text-base-content/70">
                                Correct Answer:
                              </span>
                              <span className="ml-2 font-semibold text-success">
                                {item.answer}
                              </span>
                            </div>
                          )}

                          {mistakeCount > 0 && (
                            <div className="pt-1">
                              <span className="badge badge-sm badge-warning">
                                Mistakes {mistakeCount}x
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ),
          )}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-center gap-4 pt-6 border-t border-base-300">
        <button
          className="btn btn-primary btn-lg gap-2"
          onClick={() => {
            reset();
          }}
        >
          Back to Home
        </button>
        <button
          className="btn btn-accent btn-lg gap-2"
          onClick={() => {
            restart();
          }}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
            />
          </svg>
          Try Again
        </button>
      </div>

      <Footer />
    </div>
  );
}
