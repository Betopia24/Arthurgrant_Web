"use client";



import TaskHeader from "@/components/shared/TaskHeader";
import React, { useState } from "react";

import { FaLock } from "react-icons/fa";

interface Task2Props {
  isLocked: boolean;
  taskResult: boolean | null;
  onTaskComplete: (passed: boolean) => void;
}

const Task2SightWordPractice = ({
  isLocked,
  taskResult,
  onTaskComplete,
}: Task2Props) => {
  const sentence = "The cat sat on the mat";
  const sightWords = ["cat", "mat"];
  const [clickedWords, setClickedWords] = useState<
    Record<number, "correct" | "wrong">
  >({});

  const handleWordClick = (word: string, idx: number) => {
    setClickedWords((prev) => ({
      ...prev,
      [idx]: sightWords.includes(word.toLowerCase()) ? "correct" : "wrong",
    }));
  };

  const correctCount = Object.values(clickedWords).filter(
    (v) => v === "correct"
  ).length;

  // Auto-complete when all sight words are found correctly
  React.useEffect(() => {
    if (correctCount === sightWords.length && sightWords.length > 0) {
      onTaskComplete(true);
    }
  }, [correctCount, onTaskComplete]);

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
              onClick={() => !isLocked && handleWordClick(word, idx)}
              className={`px-2 py-1 text-lg sm:text-xl md:text-2xl font-semibold rounded cursor-pointer select-none ${bgClass} transition-colors duration-200 ${
                isLocked ? "pointer-events-none" : ""
              }`}
            >
              {word}
            </span>
          );
        })}
      </div>
      <div className="w-full flex flex-col items-center justify-center gap-4">
        <button className="mt-4 px-8 py-2 font-semibold rounded-xl text-gradient bg-[#33354F] border-2 border-gray-600 cursor-pointer">
          Nice! You found {correctCount} of {sightWords.length} sight words!
        </button>
      </div>
    </div>
  );
};

export default Task2SightWordPractice;
