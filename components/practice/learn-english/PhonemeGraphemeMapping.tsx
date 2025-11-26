"use client";

import { useAuthStore } from "@/stores/authStore";
import { ArrowLeft, ArrowRight, Sparkles } from "lucide-react";
import React, { useEffect, useState } from "react";
import { FaLock, FaMicrophone } from "react-icons/fa";
import { FaCheckCircle } from "react-icons/fa";
import TaskLoadingLock from "../TaskLoadingLock";

interface TaskResult {
  isAnswer: boolean;
  marks: number;
}

interface PhonemeGraphemeMappingProps {
  taskResult: TaskResult | null;
  onTaskComplete: (result: TaskResult | null) => void;
  isLocked: boolean;
}

interface Exercise {
  word: string;
  word_url: string;
  options: string[];
}

const PhonemeGraphemeMapping = ({
  taskResult,
  onTaskComplete,
  isLocked,
}: PhonemeGraphemeMappingProps) => {
  const { accessToken } = useAuthStore();

  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOptions, setSelectedOptions] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);
  const [showResult, setShowResult] = useState(false);
  const [correctAnswers, setCorrectAnswers] = useState<number>(0);

  // Fetch data from API
  useEffect(() => {
    const fetchExercises = async () => {
      if (isLocked) return;

      setIsFetching(true);
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_AI_API}/adult/phenome-mapping/get_phenome_mapping`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              authtoken: `${accessToken}`,
            },
          }
        );
        const data = await res.json();
        console.log("Phoneme Grapheme Mapping API Response:", data);
        setExercises(data.exercises || []);
      } catch (error) {
        console.error("Failed to load phoneme grapheme mapping", error);
      } finally {
        setIsFetching(false);
      }
    };

    if (accessToken && !isLocked) {
      fetchExercises();
    }
  }, [accessToken, isLocked]);

  const currentExercise = exercises[currentIndex];

  // Play audio
  const playAudio = () => {
    if (currentExercise?.word_url) {
      const audio = new Audio(currentExercise.word_url);
      audio.play();
    }
  };

  // Handle option selection
  const handleOptionClick = (option: string) => {
    if (taskResult !== null) return;

    // Toggle selection
    if (selectedOptions.includes(option)) {
      setSelectedOptions(selectedOptions.filter((o) => o !== option));
    } else {
      setSelectedOptions([...selectedOptions, option]);
    }
  };

  // Handle previous
  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      setSelectedOptions([]);
      setShowResult(false);
    }
  };

  // Handle next
  const handleNext = () => {
    if (currentIndex < exercises.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setSelectedOptions([]);
      setShowResult(false);
    }
  };

  // Handle check with AI
  const handleCheckWithAI = () => {
    if (!currentExercise || selectedOptions.length === 0) return;

    setIsLoading(true);

    setTimeout(() => {
      // Combine selected options to form the user's answer
      const userAnswer = [...selectedOptions].join("");
      const correctAnswer = currentExercise.word.toLowerCase();
      const isCorrect = userAnswer.toLowerCase() === correctAnswer;

      // Update correct answers count
      if (isCorrect) {
        setCorrectAnswers((prev) => prev + 1);
      }

      setShowResult(true);
      setIsLoading(false);

      // If this is the last exercise, complete the task
      if (currentIndex === exercises.length - 1) {
        const totalCorrect = isCorrect ? correctAnswers + 1 : correctAnswers;
        const marks = Math.round((totalCorrect / exercises.length) * 100);

        const result: TaskResult = {
          isAnswer: true,
          marks: marks,
        };
        onTaskComplete(result);
      }
    }, 1000);
  };

  return (
    <div
      className={`p-5 md:p-8 bg-[#FFFFFF1F] border border-white/15 rounded-2xl flex flex-col gap-6 w-full relative ${
        isLocked ? "opacity-60" : ""
      }`}
    >
      {isLocked ? (
        // <div className="absolute inset-0 bg-black/50 backdrop-blur-sm rounded-xl flex items-center justify-center z-10">
        //   <div className="flex flex-col items-center gap-4">
        //     <FaLock className="w-12 h-12 text-gray-400" />
        //     <p className="text-xl font-semibold text-gray-300">
        //       Complete Task 1 to unlock this task
        //     </p>
        //   </div>
        // </div>

        <TaskLoadingLock
          variant="locked"
          title=" Complete Task 1 to unlock this task"
        />
      ) : (
        <>
          <h1 className="font-semibold text-2xl text-white">
            Phoneme Grapheme Mapping
          </h1>

          {/* Main content */}
          {isFetching ? (
            <div className="rounded-xl p-5 md:p-8 bg-[#101231] flex items-center justify-center min-h-[400px]">
              {/* <p className="text-gray-400 text-lg">Loading exercises...</p> */}
              <TaskLoadingLock variant="loading" title="loading..." />
            </div>
          ) : (
            <>
              <div className="rounded-xl p-5 md:p-8 bg-[#101231] space-y-20">
                <div>
                  <h3 className="text-white font-semibold text-xl">
                    Match the sound to its written form
                  </h3>
                  <p className="text-white text-md">
                    Listen to the sound and choose the correct letter or letter
                    combination.
                  </p>
                </div>

                {currentExercise && (
                  <>
                    {/* Audio Player */}
                    <div className="flex flex-col items-center justify-center gap-4">
                      <button
                        onClick={playAudio}
                        disabled={taskResult !== null}
                        className={`rounded-full font-semibold text-white w-16 h-16 flex items-center justify-center transition-all bg-gradient-brand hover:brightness-110 ${
                          taskResult !== null
                            ? "opacity-50 cursor-not-allowed"
                            : ""
                        }`}
                      >
                        <FaMicrophone className="w-6 h-6" />
                      </button>
                      <p className="text-gray-300 text-sm">
                        Click to hear the word
                      </p>
                    </div>

                    {/* Selected Options Display */}
                    <div className="flex items-center justify-center">
                      <div className="bg-[#1a1a3e] border-2 border-dashed border-gray-500 rounded-xl px-8 py-4 min-h-[60px] flex items-center justify-center gap-2">
                        {selectedOptions.length > 0 ? (
                          <span className="text-2xl font-bold text-gradient">
                            {selectedOptions.join("")}
                          </span>
                        ) : (
                          <span className="text-gray-500">
                            Select letters below
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Options */}
                    <div className="flex flex-wrap gap-4 justify-center">
                      {currentExercise.options.map((option, index) => (
                        <button
                          key={index}
                          onClick={() => handleOptionClick(option)}
                          disabled={taskResult !== null}
                          className={`gradient-button w-fit min-w-[60px] ${
                            selectedOptions.includes(option)
                              ? "ring-2 ring-yellow-400 scale-105"
                              : ""
                          } ${
                            taskResult !== null
                              ? "opacity-50 cursor-not-allowed"
                              : ""
                          }`}
                        >
                          {option}
                        </button>
                      ))}
                    </div>

                    {/* Result Message */}
                    {showResult && (
                      <div className="flex items-center justify-center">
                        {[...selectedOptions].join("").toLowerCase() ===
                        currentExercise.word.toLowerCase() ? (
                          <div className="flex items-center gap-3 bg-green-500/20 border-2 border-green-500 rounded-xl px-6 py-3">
                            <FaCheckCircle className="w-6 h-6 text-green-500" />
                            <span className="text-green-500 font-semibold text-lg">
                              Correct! The word is "{currentExercise.word}"
                            </span>
                          </div>
                        ) : (
                          <div className="flex items-center gap-3 bg-red-500/20 border-2 border-red-500 rounded-xl px-6 py-3">
                            <span className="text-red-500 font-semibold text-lg">
                              Wrong! The correct word is: {currentExercise.word}
                            </span>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Navigation */}
                    <div className="flex items-center justify-between">
                      <button
                        onClick={handlePrevious}
                        disabled={currentIndex === 0}
                        className="bg-[#FFFFFF1F] rounded-full border border-white/15 px-4 py-2 text-sm font-medium text-white flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-white/30 transition-colors"
                      >
                        <ArrowLeft className="w-4 h-4" /> Previous
                      </button>

                      <h2 className="text-gradient font-semibold text-lg">
                        {currentIndex + 1} of {exercises.length}
                      </h2>

                      <button
                        onClick={handleNext}
                        disabled={currentIndex === exercises.length - 1}
                        className="bg-[#FFFFFF1F] rounded-full border border-white/15 px-4 py-2 text-sm font-medium text-white flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-white/30 transition-colors"
                      >
                        Next <ArrowRight className="w-4 h-4" />
                      </button>
                    </div>
                  </>
                )}
              </div>

              {/* AI Check Button */}
              <button
                onClick={handleCheckWithAI}
                disabled={
                  selectedOptions.length === 0 ||
                  isLoading ||
                  taskResult !== null
                }
                className="p-4 inline-flex items-center justify-center gap-2 bg-gradient-brand rounded-2xl font-semibold text-base text-white hover:brightness-110 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Analyzing...
                  </>
                ) : taskResult !== null ? (
                  <>
                    <FaCheckCircle className="w-5 h-5" />
                    Task Completed
                  </>
                ) : (
                  <>
                    Check with AI
                    <Sparkles className="w-5 h-5" />
                  </>
                )}
              </button>
            </>
          )}
        </>
      )}
    </div>
  );
};

export default PhonemeGraphemeMapping;
