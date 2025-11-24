"use client";
import React, { useState } from "react";
import { FaLock, FaCheckCircle, FaArrowRight } from "react-icons/fa";
import TaskHeader from "@/components/shared/TaskHeader";

interface TaskResult {
  isAnswer: boolean;
  mark: number;
}

interface Task3Props {
  taskResult: TaskResult | null;
  onTaskComplete: (result: TaskResult | null) => void;
  isLocked: boolean;
}

const Task3DragMatch = ({
  taskResult,
  onTaskComplete,
  isLocked,
}: Task3Props) => {
  const wordCardsInitial = [
    { id: "dog", word: "Dog", bg: "from-yellow-300 to-yellow-500" },
    { id: "apple", word: "Apple", bg: "from-pink-300 to-pink-500" },
    { id: "sun", word: "Sun", bg: "from-sky-300 to-sky-500" },
  ];

  const pictureCardsInitial = [
    { id: "dog", src: "/dog.png", word: "", matched: false },
    { id: "apple", src: "/apple.png", word: "", matched: false },
    { id: "sun", src: "/sun.png", word: "", matched: false },
  ];

  const [wordCards, setWordCards] = useState(wordCardsInitial);
  const [pictureCards, setPictureCards] = useState(pictureCardsInitial);
  const [showResult, setShowResult] = useState(false);

  const handleDragStart = (e: React.DragEvent<HTMLDivElement>, id: string) => {
    e.dataTransfer.setData("text/plain", id);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>, picId: string) => {
    if (isLocked || taskResult !== null) return;

    const wordId = e.dataTransfer.getData("text");
    const wordCard = wordCards.find((w) => w.id === wordId);
    if (!wordCard) return;

    setPictureCards((prev) =>
      prev.map((pic) =>
        pic.id === picId
          ? {
              ...pic,
              matched: pic.id === wordId,
              word: wordCard.word,
            }
          : pic
      )
    );

    if (wordId === picId) {
      setWordCards((prev) => prev.filter((w) => w.id !== wordId));
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const correctMatchCount = pictureCards.filter((p) => p.matched).length;

  const handleNext = () => {
    // Calculate percentage: (correct / total) * 100
    const totalMatches = pictureCardsInitial.length;
    const mark =
      totalMatches > 0 ? Math.round((correctMatchCount / totalMatches) * 100) : 0;

    const result: TaskResult = {
      isAnswer: true,
      mark: mark,
    };

    setShowResult(true);
    onTaskComplete(result);
  };

  const handleReset = () => {
    setWordCards(wordCardsInitial);
    setPictureCards(pictureCardsInitial);
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
              Complete Task 2 to unlock this task
            </p>
          </div>
        </div>
      )}

      <TaskHeader
        title="Drag & Match Words"
        description="Drag the word onto the correct picture"
        taskNumber={3}
      />

      <div className="grid grid-cols-2 gap-4 w-full">
        <div className="flex flex-col gap-3">
          <h2 className="font-semibold mb-2">Words</h2>
          {wordCards.map((card) => (
            <div
              key={card.id}
              draggable={!isLocked && taskResult === null}
              onDragStart={(e) => handleDragStart(e, card.id)}
              className={`p-4 rounded-xl bg-gradient-to-br ${card.bg} text-white text-lg font-bold shadow-lg cursor-move flex items-center justify-center h-24 sm:h-28 ${
                isLocked || taskResult !== null ? "pointer-events-none" : ""
              }`}
            >
              {card.word}
            </div>
          ))}
        </div>

        <div className="flex flex-col gap-3">
          <h2 className="font-semibold mb-2">Pictures</h2>
          {pictureCards.map((pic) => (
            <div
              key={pic.id}
              onDrop={(e) => handleDrop(e, pic.id)}
              onDragOver={handleDragOver}
              className={`relative p-2 h-24 sm:h-28 border-2 border-dashed border-gray-500 rounded-xl flex items-center justify-center transition-colors duration-200 ${
                pic.matched
                  ? "bg-green-500"
                  : pic.word
                  ? "bg-red-500"
                  : "bg-gray-700"
              }`}
            >
              <img
                src={pic.src}
                alt={pic.id}
                className="h-full object-contain"
              />
              <span className="absolute bottom-1 text-sm text-white">
                {pic.matched || pic.word ? pic.word : "Drop word here"}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="w-full flex flex-col items-center justify-center gap-4">
        <p className="text-gray-300">
          {correctMatchCount} of {pictureCardsInitial.length} correct
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
              disabled={wordCards.length === wordCardsInitial.length}
              className={`flex items-center gap-2 px-8 py-2 font-semibold rounded-xl bg-gradient-to-r from-yellow-400 to-pink-500 text-white cursor-pointer hover:opacity-90 transition-opacity ${
                wordCards.length === wordCardsInitial.length
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
              Perfect! All matches correct! (100/100)
            </span>
          </div>
        )}

        {showResult && taskResult && taskResult.mark < 100 && (
          <div className="flex items-center gap-3 bg-yellow-500/20 border-2 border-yellow-500 rounded-xl px-6 py-3">
            <span className="text-yellow-500 font-semibold text-lg">
              You matched {correctMatchCount} out of {pictureCardsInitial.length}{" "}
              correctly ({taskResult.mark}/100)
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export default Task3DragMatch;