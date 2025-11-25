"use client";
import React, { useState, useEffect } from "react";
import { FaLock, FaCheckCircle, FaArrowRight } from "react-icons/fa";
import TaskHeader from "@/components/shared/TaskHeader";
import { useAuthStore } from "@/stores/authStore";
import toast from "react-hot-toast";

interface TaskResult {
  isAnswer: boolean;
  mark: number;
}

interface Task3Props {
  taskResult: TaskResult | null;
  onTaskComplete: (result: TaskResult | null) => void;
  isLocked: boolean;
}

interface Word {
  id: string;
  text: string;
}

interface Image {
  id: string;
  url: string;
}

interface WordCard {
  id: string;
  word: string;
  bg: string;
}

interface PictureCard {
  id: string;
  src: string;
  word: string;
  matched: boolean;
}

const Task3DragMatch = ({
  taskResult,
  onTaskComplete,
  isLocked,
}: Task3Props) => {
  const { accessToken } = useAuthStore();

  const [wordCards, setWordCards] = useState<WordCard[]>([]);
  const [pictureCards, setPictureCards] = useState<PictureCard[]>([]);
  const [wordCardsInitial, setWordCardsInitial] = useState<WordCard[]>([]);
  const [pictureCardsInitial, setPictureCardsInitial] = useState<PictureCard[]>(
    []
  );
  const [showResult, setShowResult] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Shuffle array helper function
  const shuffleArray = <T,>(array: T[]): T[] => {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  };

  // Fetch word match data from API
  useEffect(() => {
    const fetchWordMatch = async () => {
      if (isLocked) return;

      setIsLoading(true);
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_API}/word-match`,
          {
            method: "GET",
          }
        );
        const response = await res.json();

        const data = response.data;
        const words: Word[] = data.words || [];
        const images: Image[] = data.images || [];

        // Background gradients
        const bgGradients = [
          "from-yellow-300 to-yellow-500",
          "from-pink-300 to-pink-500",
          "from-sky-300 to-sky-500",
          "from-purple-300 to-purple-500",
          "from-green-300 to-green-500",
        ];

        // Create word cards and shuffle them
        const wordsData: WordCard[] = words.map((word, idx) => ({
          id: word.id,
          word: word.text,
          bg: bgGradients[idx % bgGradients.length],
        }));
        const shuffledWords = shuffleArray(wordsData);

        // Create picture cards and shuffle them
        const imagesData: PictureCard[] = images.map((image) => ({
          id: image.id,
          src: image.url,
          word: "",
          matched: false,
        }));
        const shuffledImages = shuffleArray(imagesData);

        setWordCards(shuffledWords);
        setPictureCards(shuffledImages);
        setWordCardsInitial(shuffledWords);
        setPictureCardsInitial(shuffledImages);
      } catch (error: any) {
        toast.error(
          error?.data?.errorMessages?.[0]?.message ||
            error?.data?.message ||
            "something went wrong"
        );
      } finally {
        setIsLoading(false);
      }
    };

    if (accessToken && !isLocked) {
      fetchWordMatch();
    }
  }, [accessToken, isLocked]);

  const handleDragStart = (e: React.DragEvent<HTMLDivElement>, id: string) => {
    e.dataTransfer.setData("text/plain", id);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>, picId: string) => {
    if (isLocked || taskResult !== null) return;

    const wordId = e.dataTransfer.getData("text");
    const wordCard = wordCards.find((w) => w.id === wordId);
    if (!wordCard) return;

    // Check if this picture already has a word - if yes, put the old word back
    const currentPicture = pictureCards.find((p) => p.id === picId);
    if (currentPicture && currentPicture.word) {
      
      const oldWordCard = wordCardsInitial.find(
        (w) => w.word === currentPicture.word
      );
      if (oldWordCard) {
      
        setWordCards((prev) => [...prev, oldWordCard]);
      }
    }


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

    
    setWordCards((prev) => prev.filter((w) => w.id !== wordId));
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const correctMatchCount = pictureCards.filter((p) => p.matched).length;
  const attemptedMatchCount = pictureCards.filter((p) => p.word !== "").length;

  const handleNext = () => {
    // Calculate percentage based on correct matches out of total items
    const totalMatches = pictureCardsInitial.length;
    const mark =
      totalMatches > 0
        ? Math.round((correctMatchCount / totalMatches) * 100)
        : 0;

    const result: TaskResult = {
      isAnswer: true,
      mark: mark,
    };

    setShowResult(true);
    onTaskComplete(result);
  };

  const handleReset = () => {
    setWordCards(wordCardsInitial);
    setPictureCards(
      pictureCardsInitial.map((pic) => ({ ...pic, word: "", matched: false }))
    );
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

      {isLoading && !isLocked ? (
        <div className="flex items-center justify-center py-12">
          <p className="text-gray-400 text-lg">Loading word match...</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-2 gap-4 w-full">
            <div className="flex flex-col gap-3">
              <h2 className="font-semibold mb-2">Words</h2>
              {wordCards.map((card) => (
                <div
                  key={card.id}
                  draggable={!isLocked && taskResult === null}
                  onDragStart={(e) => handleDragStart(e, card.id)}
                  className={`p-4 rounded-xl bg-gradient-to-br ${
                    card.bg
                  } text-white text-lg font-bold shadow-lg cursor-move flex items-center justify-center h-24 sm:h-28 ${
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
                    className="h-16 w-16 object-cover rounded-full"
                    onError={(e) => {
                      e.currentTarget.style.display = "none";
                    }}
                  />
                  <span className="absolute bottom-1 text-sm text-white font-semibold bg-black/50 px-2 py-1 rounded">
                    {pic.matched || pic.word ? pic.word : "Drop word here"}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="w-full flex flex-col items-center justify-center gap-4">
            <p className="text-gray-300">
              {attemptedMatchCount} of {pictureCardsInitial.length} attempted (
              {correctMatchCount} correct)
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
                  disabled={attemptedMatchCount === 0}
                  className={`flex items-center gap-2 px-8 py-2 font-semibold rounded-xl bg-gradient-to-r from-yellow-400 to-pink-500 text-white cursor-pointer hover:opacity-90 transition-opacity ${
                    attemptedMatchCount === 0
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
                  You matched {correctMatchCount} out of{" "}
                  {pictureCardsInitial.length} correctly ({taskResult.mark}/100)
                </span>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default Task3DragMatch;
