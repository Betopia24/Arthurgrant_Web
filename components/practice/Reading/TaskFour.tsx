"use client";
import React, { useEffect, useState } from "react";
import { FaLock, FaCheckCircle, FaArrowRight } from "react-icons/fa";
import TaskHeader from "@/components/shared/TaskHeader";
import { useAuthStore } from "@/stores/authStore";
import toast from "react-hot-toast";
import TaskLoadingLockError from "../TaskLoadingLock";

interface TaskResult {
  isAnswer: boolean;
  mark: number;
}

interface Task4Props {
  taskResult: TaskResult | null;
  onTaskComplete: (result: TaskResult | null) => void;
  isLocked: boolean;
}

interface Question {
  question: string;
  options: string[];
  correct_answer: string;
}

const Task4ReadingComprehension = ({
  taskResult,
  onTaskComplete,
  isLocked,
}: Task4Props) => {
  const { user, accessToken } = useAuthStore();

  const [passageName, setPassageName] = useState<string>("");
  const [passageText, setPassageText] = useState<string>("");
  const [passageImage, setPassageImage] = useState<string>("");
  const [questions, setQuestions] = useState<Question[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const [selectedAnswers, setSelectedAnswers] = useState<
    Record<number, string>
  >({});
  const [showResult, setShowResult] = useState(false);

  useEffect(() => {
    const fetchComprehension = async () => {
      if (isLocked) return;

      setIsLoading(true);
      try {
        const res = await fetch(
          `${
            process.env.NEXT_PUBLIC_AI_API
          }/reading/comprehension/generate_comprehension?age=${
            user?.age.split("-")[0]
          }`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              authtoken: `${accessToken}`,
            },
          }
        );
        const data = await res.json();

        setPassageName(data.passage_name || "");
        setPassageText(data.text || "");
        setPassageImage(data.image || "");
        setQuestions(data.questions || []);
      } catch (error: any) {
        toast.error(
          error?.data?.errorMessages?.[0]?.message || error?.data?.message
        );
      } finally {
        setIsLoading(false);
      }
    };

    if (user?.age && accessToken && !isLocked) {
      fetchComprehension();
    }
  }, [user?.age, accessToken, isLocked]);

  const handleAnswerSelect = (questionIdx: number, answer: string) => {
    if (isLocked || taskResult !== null) return;

    setSelectedAnswers((prev) => ({
      ...prev,
      [questionIdx]: answer,
    }));
  };

  const handleNext = () => {
    // Calculate how many correct
    const correctAnswersCount = questions.filter(
      (q, idx) => selectedAnswers[idx] === q.correct_answer
    ).length;

    // Calculate percentage: (correct / total) * 100
    const totalQuestions = questions.length;
    const mark =
      totalQuestions > 0
        ? Math.round((correctAnswersCount / totalQuestions) * 100)
        : 0;

    const result: TaskResult = {
      isAnswer: true,
      mark: mark,
    };

    setShowResult(true);
    onTaskComplete(result);
  };

  const handleReset = () => {
    setSelectedAnswers({});
    setShowResult(false);
  };

  const answeredCount = Object.keys(selectedAnswers).length;
  const correctAnswersCount = questions.filter(
    (q, idx) => selectedAnswers[idx] === q.correct_answer
  ).length;

  return (
    <div
      className={`w-full bg-gradient-to-br from-[#28284A] to-[#12122A] text-white p-8 rounded-xl shadow-lg flex flex-col gap-6 relative ${
        isLocked ? "opacity-60" : ""
      }`}
    >
      {isLocked && (
        <div className="absolute inset-0 bg-black/50 backdrop-blur-sm rounded-xl flex items-center justify-center z-10">
          <div className="flex flex-col items-center gap-4">
            <FaLock className="w-12 h-12 text-gray-400" />
            <p className="text-xl font-semibold text-gray-300">
              Complete Task 3 to unlock this task
            </p>
          </div>
        </div>
      )}

      <TaskHeader
        title="Reading Comprehension"
        description="Read the passage and answer the questions"
        taskNumber={4}
      />

      {isLoading && !isLocked ? (
        <TaskLoadingLockError
          variant="loading"
          title="Reading Comprehension Loading ..."
        />
      ) : (
        <>
          <div className="flex flex-col lg:flex-row gap-6 w-full">
            <div className="lg:w-1/2 bg-[#363851] p-6 rounded-xl flex flex-col gap-4">
              <div className="w-full flex items-center justify-center">
                <h2 className="text-xl font-semibold text-gradient text-center">
                  {passageName}
                </h2>
              </div>

              <p className="text-gray-200 text-base sm:text-lg leading-relaxed">
                {passageText}
              </p>

              {passageImage && (
                <img
                  src={passageImage}
                  alt={passageName}
                  className="w-full h-auto object-contain rounded-xl"
                  onError={(e) => {
                    e.currentTarget.style.display = "none";
                  }}
                />
              )}
            </div>

            <div className="lg:w-1/2 flex flex-col gap-6">
              {questions.map((q, idx) => (
                <div
                  key={idx}
                  className="bg-[#363851] p-4 rounded-xl flex flex-col gap-3"
                >
                  <h3 className="text-lg font-semibold">
                    {idx + 1}. {q.question}
                  </h3>
                  <div className="flex flex-col gap-2">
                    {q.options.map((opt, optIdx) => (
                      <label
                        key={optIdx}
                        className={`flex items-center gap-3 cursor-pointer ${
                          isLocked || taskResult !== null
                            ? "pointer-events-none"
                            : ""
                        }`}
                      >
                        <input
                          type="radio"
                          name={`question-${idx}`}
                          checked={selectedAnswers[idx] === opt}
                          onChange={() => handleAnswerSelect(idx, opt)}
                          disabled={isLocked || taskResult !== null}
                          className="appearance-none w-5 h-5 border-2 border-gray-500 rounded-full checked:border-0 checked:bg-gradient-to-r checked:from-yellow-300 checked:to-pink-500 transition-all duration-200"
                        />
                        <span className="text-gray-200">{opt}</span>
                      </label>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="w-full flex flex-col items-center justify-center gap-4">
            <p className="text-gray-300">
              Answered {answeredCount} of {questions.length} questions
            </p>

            {!showResult && taskResult === null && (
              <div className="flex gap-4">
                <button
                  onClick={handleReset}
                  className="px-8 py-2 font-semibold rounded-xl bg-[#33354F] border-2 border-gray-600 cursor-pointer hover:bg-[#3a3c55] transition-colors"
                >
                  Reset
                </button>
                <button
                  onClick={handleNext}
                  disabled={answeredCount !== questions.length}
                  className={`flex items-center gap-2 px-8 py-2 font-semibold rounded-xl bg-gradient-to-r from-yellow-400 to-pink-500 text-white cursor-pointer hover:opacity-90 transition-opacity ${
                    answeredCount !== questions.length
                      ? "opacity-50 cursor-not-allowed"
                      : ""
                  }`}
                >
                  Next <FaArrowRight className="w-4 h-4" />
                </button>
              </div>
            )}

            {showResult && taskResult && taskResult.mark === 100 && (
              <div className="flex items-center gap-3 bg-green-500/20 border-2 border-green-500 rounded-xl px-6 py-3">
                <FaCheckCircle className="w-6 h-6 text-green-500" />
                <span className="text-green-500 font-semibold text-lg">
                  Perfect! All answers correct! (100/100)
                </span>
              </div>
            )}

            {showResult && taskResult && taskResult.mark < 100 && (
              <div className="flex items-center gap-3 bg-yellow-500/20 border-2 border-yellow-500 rounded-xl px-6 py-3">
                <span className="text-yellow-500 font-semibold text-lg">
                  You got {correctAnswersCount} out of {questions.length}{" "}
                  correct ({taskResult.mark}/100)
                </span>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default Task4ReadingComprehension;
