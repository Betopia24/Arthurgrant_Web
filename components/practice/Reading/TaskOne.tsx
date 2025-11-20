"use client";
import React, { useEffect, useState } from "react";
import { BiVolumeFull } from "react-icons/bi";
import { FaCheckCircle } from "react-icons/fa";

import { useAuthStore } from "@/stores/authStore";
import TaskHeader from "@/components/shared/TaskHeader";

interface Task1Props {
  taskResult: boolean | null;
  onTaskComplete: (passed: boolean) => void;
}

const Task1PhonemeFlashcards = ({ taskResult, onTaskComplete }: Task1Props) => {
  const { user, accessToken } = useAuthStore();
  const [letters, setLetters] = useState<string[]>([]);
  const [targetWord, setTargetWord] = useState<string>("");
  const [task1Loading, setTask1Loading] = useState<boolean>(true);
  const [assembledWord, setAssembledWord] = useState("");

  useEffect(() => {
    const fetchFlashcards = async () => {
      setTask1Loading(true);
      try {
        const res = await fetch(
          `${
            process.env.NEXT_PUBLIC_AI_API
          }phoneme_flashcards/generate_phoneme_flashcards?age=${
            user?.age.split(" ")[0]
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
      } catch (error) {
        console.error("Failed to load phoneme flashcards", error);
      } finally {
        setTask1Loading(false);
      }
    };
    if (user?.age && accessToken) {
      fetchFlashcards();
    }
  }, [user?.age, accessToken]);

  const handlePlayLetter = (letter: string) => {
    const utterance = new SpeechSynthesisUtterance(letter);
    utterance.lang = "en-US";
    utterance.pitch = 1;
    utterance.rate = 1;
    speechSynthesis.speak(utterance);
    setAssembledWord((prev) => prev + letter);
  };

  const handleResetTask1 = () => {
    setAssembledWord("");
    onTaskComplete(null as any);
  };

  const handleCheckTask1 = () => {
    const isCorrect = assembledWord.toUpperCase() === targetWord.toUpperCase();
    onTaskComplete(isCorrect);
  };

  return (
    <div className="w-full bg-gradient-to-br from-[#28284A] to-[#12122A] text-white p-8 rounded-xl shadow-lg flex flex-col gap-6">
      <TaskHeader
        title="Phoneme Flashcards"
        description="Click the cards to hear the sound"
        taskNumber={1}
      />
      {task1Loading ? (
        <div className="flex items-center justify-center py-12">
          <p className="text-gray-400 text-lg">Loading flashcards...</p>
        </div>
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
              <span className="text-yellow-400">{targetWord}</span>
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
            {taskResult === null && (
              <div className="flex gap-4">
                <button
                  onClick={handleResetTask1}
                  className="px-8 py-2 font-semibold rounded-xl bg-[#33354F] border-2 border-gray-600 cursor-pointer hover:bg-[#3a3c55] transition-colors"
                >
                  Reset
                </button>
                <button
                  onClick={handleCheckTask1}
                  disabled={assembledWord.length === 0}
                  className={`px-8 py-2 font-semibold rounded-xl bg-[#33354F] border-2 border-blue-500 cursor-pointer hover:bg-[#3a3c55] transition-colors ${
                    assembledWord.length === 0
                      ? "opacity-50 cursor-not-allowed"
                      : ""
                  }`}
                >
                  Check Answer
                </button>
              </div>
            )}
            {taskResult === true && (
              <div className="flex flex-col items-center gap-4">
                <div className="flex items-center gap-3 bg-green-500/20 border-2 border-green-500 rounded-xl px-6 py-3">
                  <FaCheckCircle className="w-6 h-6 text-green-500" />
                  <span className="text-green-500 font-semibold text-lg">
                    Perfect! Correct Answer! Move to next task.
                  </span>
                </div>
                <button
                  onClick={handleResetTask1}
                  className="px-8 py-2 font-semibold rounded-xl text-gradient bg-[#33354F] border-2 border-gray-600 cursor-pointer hover:bg-[#3a3c55] transition-colors"
                >
                  Try Again
                </button>
              </div>
            )}
            {taskResult === false && (
              <div className="flex flex-col items-center gap-4">
                <div className="flex items-center gap-3 bg-red-500/20 border-2 border-red-500 rounded-xl px-6 py-3">
                  <span className="text-red-500 font-semibold text-lg">
                    Wrong! Try again
                  </span>
                </div>
                <button
                  onClick={handleResetTask1}
                  className="px-8 py-2 font-semibold rounded-xl bg-[#33354F] border-2 border-gray-600 cursor-pointer hover:bg-[#3a3c55] transition-colors"
                >
                  Try Again
                </button>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default Task1PhonemeFlashcards;
