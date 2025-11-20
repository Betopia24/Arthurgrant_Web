"use client";
import TaskHeader from "@/components/shared/TaskHeader";
import React, { useState } from "react";

import { FaLock } from "react-icons/fa";

interface Task3Props {
  isLocked: boolean;
  taskResult: boolean | null;
  onTaskComplete: (passed: boolean) => void;
}

const Task3DragAndMatch = ({ isLocked, taskResult, onTaskComplete }: Task3Props) => {
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

  const handleDragStart = (e: React.DragEvent<HTMLDivElement>, id: string) => {
    e.dataTransfer.setData("text/plain", id);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>, picId: string) => {
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

  const correctDropCount = pictureCards.filter((p) => p.matched).length;

  React.useEffect(() => {
    if (correctDropCount === pictureCards.length && pictureCards.length > 0) {
      onTaskComplete(true);
    }
  }, [correctDropCount, onTaskComplete]);

  return (
    <div className={`w-full bg-gradient-to-br from-[#28284A] to-[#12122A] text-white p-8 rounded-xl shadow-lg flex flex-col gap-6 relative ${isLocked ? "opacity-60" : ""}`}>
      {isLocked && (
        <div className="absolute inset-0 bg-black/50 backdrop-blur-sm rounded-xl flex items-center justify-center z-10">
          <div className="flex flex-col items-center gap-4">
            <FaLock className="w-12 h-12 text-gray-400" />
            <p className="text-xl font-semibold text-gray-300">Complete Task 2 to unlock this task</p>
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
              draggable={!isLocked}
              onDragStart={(e) => handleDragStart(e, card.id)}
              className={`p-4 rounded-xl bg-gradient-to-br ${card.bg} text-white text-lg font-bold shadow-lg cursor-move flex items-center justify-center h-24 sm:h-28 ${isLocked ? "pointer-events-none" : ""}`}
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
              onDrop={(e) => !isLocked && handleDrop(e, pic.id)}
              onDragOver={handleDragOver}
              className={`relative p-2 h-24 sm:h-28 border-2 border-dashed border-gray-500 rounded-xl flex items-center justify-center transition-colors duration-200 ${
                pic.matched ? "bg-green-500" : pic.word ? "bg-red-500" : "bg-gray-700"
              }`}
            >
              <img src={pic.src} alt={pic.id} className="h-full object-contain" />
              <span className="absolute bottom-1 text-sm text-white">
                {pic.matched || pic.word ? pic.word : "Drop word here"}
              </span>
            </div>
          ))}
        </div>
      </div>
      <div className="w-full flex flex-col items-center justify-center gap-4">
        <button className="mt-4 px-8 py-2 font-semibold rounded-xl text-gradient bg-[#33354F] border-2 border-gray-600 cursor-pointer">
          {correctDropCount} of {pictureCards.length} correct!
        </button>
      </div>
    </div>
  );
};

export default Task3DragAndMatch;