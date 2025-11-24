"use client";
import React, { useEffect, useState } from "react";
import { FaLock, FaCheckCircle, FaArrowRight } from "react-icons/fa";
import TaskHeader from "@/components/shared/TaskHeader";
import { useAuthStore } from "@/stores/authStore";

interface TaskResult {
  isAnswer: boolean;
  mark: number;
}

interface Task2Props {
  taskResult: TaskResult | null;
  onTaskComplete: (result: TaskResult | null) => void;
  isLocked: boolean;
}

const Task2SightWordPractice = ({
  taskResult,
  onTaskComplete,
  isLocked,
}: Task2Props) => {
  const { user, accessToken } = useAuthStore();
  const [sentence, setSentence] = useState<string>("");
  const [sightWords, setSightWords] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [clickedWords, setClickedWords] = useState<Record<number, "correct" | "wrong">
  >({});
  const [showResult, setShowResult] = useState(false);

  useEffect(() => {
    const fetchSightWords = async () => {
      if (isLocked) return;

      setIsLoading(true);
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_AI_API}/reading/sight-word-practice/sight_words`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              authtoken: `${accessToken}`,
            },
            body: JSON.stringify({
              age: user?.age.split(" ")[0],
            }),
          }
        );
        const data = await res.json();
        console.log("Task 2 API Response:", data);

        setSentence(data.sentence || "");
        setSightWords(data.sight_words || []);
      } catch (error) {
        console.error("Failed to load sight words", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (user?.age && accessToken && !isLocked) {
      fetchSightWords();
    }
  }, [user?.age, accessToken, isLocked]);

  const handleWordClick = (word: string, idx: number) => {
    if (isLocked || taskResult !== null) return;

    const isCorrectWord = sightWords.some(
      (sightWord) => sightWord.toLowerCase() === word.toLowerCase()
    );

    setClickedWords((prev) => ({
      ...prev,
      [idx]: isCorrectWord ? "correct" : "wrong",
    }));
  };

  const correctCount = Object.values(clickedWords).filter(
    (v) => v === "correct"
  ).length;

  const handleNext = () => {
    // Calculate percentage: (correct / total) * 100
    const totalSightWords = sightWords.length;
    const mark = totalSightWords > 0 
      ? Math.round((correctCount / totalSightWords) * 100) 
      : 0;

    const result: TaskResult = {
      isAnswer: true,
      mark: mark,
    };

    setShowResult(true);
    onTaskComplete(result);
  };

  const handleReset = () => {
    setClickedWords({});
    setShowResult(false);
  };

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
              Complete Task 1 to unlock this task
            </p>
          </div>
        </div>
      )}

      <TaskHeader
        title="Sight Word Practice"
        description="Click on all the sight words you see. Some words may appear more than once."
        taskNumber={2}
      />

      {isLoading && !isLocked ? (
        <div className="flex items-center justify-center py-12">
          <p className="text-gray-400 text-lg">Loading sight words...</p>
        </div>
      ) : (
        <>
          <div className="bg-[#363851] p-4 rounded-xl">
            <p className="text-gray-300 text-center">
              Find these sight words:{" "}
              <span className="text-yellow-400 font-semibold">
                {sightWords.join(", ")}
              </span>
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-2">
            {sentence.split(" ").map((word, idx) => {
              const status = clickedWords[idx];
              const bgClass =
                status === "correct"
                  ? "bg-green-500 text-white"
                  : status === "wrong"
                  ? "bg-red-500 text-white"
                  : "bg-transparent";

              return (
                <span
                  key={idx}
                  onClick={() => handleWordClick(word, idx)}
                  className={`px-2 py-1 text-lg sm:text-xl md:text-2xl font-semibold rounded cursor-pointer select-none ${bgClass} transition-colors duration-200 ${
                    isLocked || taskResult !== null ? "pointer-events-none" : ""
                  }`}
                >
                  {word}
                </span>
              );
            })}
          </div>

          <div className="w-full flex flex-col items-center justify-center gap-4">
            <p className="text-gray-300">
              Found {correctCount} of {sightWords.length} sight words
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
                  disabled={Object.keys(clickedWords).length === 0}
                  className={`flex items-center gap-2 px-8 py-2 font-semibold rounded-xl bg-gradient-to-r from-yellow-400 to-pink-500 text-white cursor-pointer hover:opacity-90 transition-opacity ${
                    Object.keys(clickedWords).length === 0
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
                  Perfect! You found all sight words! (100/100)
                </span>
              </div>
            )}

            {showResult && taskResult && taskResult.mark < 100 && (
              <div className="flex items-center gap-3 bg-yellow-500/20 border-2 border-yellow-500 rounded-xl px-6 py-3">
                <span className="text-yellow-500 font-semibold text-lg">
                  You found {correctCount} out of {sightWords.length} sight
                  words ({taskResult.mark}/100)
                </span>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default Task2SightWordPractice;