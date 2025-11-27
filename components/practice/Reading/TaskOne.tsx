"use client";
import TaskHeader from "@/components/shared/TaskHeader";
import { useAuthStore } from "@/stores/authStore";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { BiVolumeFull } from "react-icons/bi";
import { FaArrowRight, FaCheckCircle } from "react-icons/fa";
import TaskLoadingLockError from "../TaskLoadingLock";

interface TaskResult {
  isAnswer: boolean;
  mark: number;
}

interface Task1Props {
  taskResult: TaskResult | null;
  onTaskComplete: (result: TaskResult | null) => void;
}

const Task1PhonemeFlashcards = ({ taskResult, onTaskComplete }: Task1Props) => {
  const { user, accessToken } = useAuthStore();
  const [letters, setLetters] = useState<string[]>([]);
  const [targetWord, setTargetWord] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [assembledWord, setAssembledWord] = useState("");
  const [showResult, setShowResult] = useState(false);

  useEffect(() => {
    const fetchFlashcards = async () => {
      setIsLoading(true);
      try {
        const res = await fetch(
          `${
            process.env.NEXT_PUBLIC_AI_API
          }/reading/phoneme-flashcards/generate_phoneme_flashcards?age=${
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
        const shuffledLetters = [...(data.characters || [])].sort(
          () => Math.random() - 0.5
        );
        setLetters(shuffledLetters);
        setTargetWord(data.word || "");
      } catch (error: any) {
        toast.error(
          error?.data?.errorMessages?.[0]?.message || error?.data?.message
        );
      } finally {
        setIsLoading(false);
      }
    };
    if (user?.age && accessToken) {
      fetchFlashcards();
    }
  }, [user?.age, accessToken]);

  const handlePlayLetter = (letter: string) => {
    if (taskResult !== null) return;

    const utterance = new SpeechSynthesisUtterance(letter);
    utterance.lang = "en-US";
    utterance.pitch = 1;
    utterance.rate = 1;
    speechSynthesis.speak(utterance);
    setAssembledWord((prev) => prev + letter);
  };

  const handleReset = () => {
    setAssembledWord("");
    setShowResult(false);
  };

  const handleNext = () => {
    const isCorrect = assembledWord.toUpperCase() === targetWord.toUpperCase();

    // Task 1: Either 100 or 0
    const result: TaskResult = {
      isAnswer: true,
      mark: isCorrect ? 100 : 0,
    };

    setShowResult(true);
    onTaskComplete(result);
  };

  return (
    <div className="w-full bg-gradient-to-br from-[#28284A] to-[#12122A] text-white p-8 rounded-xl shadow-lg flex flex-col gap-6">
      <TaskHeader
        title="Phoneme Flashcards"
        description="Click the cards to hear the sound"
        taskNumber={1}
      />

      {isLoading ? (
        <TaskLoadingLockError
          variant="loading"
          title="Phoneme Flashcards Loading.."
        />
      ) : (
        <>
          <div className="flex gap-6">
            {letters.map((letter, idx) => {
              const bgGradient =
                idx === 0
                  ? "from-yellow-300 to-yellow-500"
                  : idx === 1
                  ? "from-pink-300 to-pink-500"
                  : "from-sky-300 to-sky-500";
              return (
                <button
                  key={idx}
                  onClick={() => handlePlayLetter(letter)}
                  disabled={taskResult !== null}
                  className={`flex-1 p-6 rounded-xl bg-gradient-to-br ${bgGradient} text-white font-bold text-2xl shadow-lg flex flex-col items-center justify-center gap-2 cursor-pointer hover:scale-105 transition-transform ${
                    taskResult !== null ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                >
                  {letter} <BiVolumeFull className="w-6 h-6" />
                </button>
              );
            })}
          </div>

          <div className="bg-[#363851] p-8 rounded-xl flex flex-col items-center justify-center gap-4 w-full">
            <h2 className="text-white font-semibold text-lg">
              Now spell the word:{" "}
              {/* <span className="text-yellow-400">{targetWord}</span> */}
            </h2>
            <div className="px-6 py-2 border border-gray-500 bg-[#4F5167] rounded-xl text-3xl font-bold text-gradient flex flex-wrap gap-2 justify-center min-h-[60px] items-center">
              {assembledWord ? (
                assembledWord
                  .split("")
                  .map((letter, idx) => <span key={idx}>{letter}</span>)
              ) : (
                <span className="text-gray-500">_</span>
              )}
            </div>

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
                  disabled={assembledWord.length === 0}
                  className={`flex items-center gap-2 px-8 py-2 font-semibold rounded-xl bg-gradient-to-r from-yellow-400 to-pink-500 text-white cursor-pointer hover:opacity-90 transition-opacity ${
                    assembledWord.length === 0
                      ? "opacity-50 cursor-not-allowed"
                      : ""
                  }`}
                >
                  Next <FaArrowRight className="w-4 h-4" />
                </button>
              </div>
            )}

            {showResult && taskResult && taskResult.mark === 100 && (
              <div className="flex flex-col items-center gap-4">
                <div className="flex items-center gap-3 bg-green-500/20 border-2 border-green-500 rounded-xl px-6 py-3">
                  <FaCheckCircle className="w-6 h-6 text-green-500" />
                  <span className="text-green-500 font-semibold text-lg">
                    Perfect! Correct Answer! (100/100)
                  </span>
                </div>
              </div>
            )}

            {showResult && taskResult && taskResult.mark === 0 && (
              <div className="flex flex-col items-center gap-4">
                <div className="flex items-center gap-3 bg-yellow-500/20 border-2 border-yellow-500 rounded-xl px-6 py-3">
                  <span className="text-yellow-500 font-semibold text-lg">
                    The correct word was: {targetWord} (0/100)
                  </span>
                </div>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default Task1PhonemeFlashcards;
