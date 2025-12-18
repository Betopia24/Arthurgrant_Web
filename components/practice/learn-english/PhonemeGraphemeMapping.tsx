"use client";

import { useAuthStore } from "@/stores/authStore";
import { ArrowLeft, ArrowRight, Sparkles } from "lucide-react";
import React, { useEffect, useState } from "react";
import { FaMicrophone } from "react-icons/fa";
import { FaCheckCircle } from "react-icons/fa";
import TaskLoadingLockError from "../TaskLoadingLock";

interface TaskResult {
  isAnswer: boolean;
  marks: number;
}

interface PhonemeGraphemeMappingProps {
  taskData: any[] | null;
  isFetching: boolean;
  taskResult: TaskResult | null;
  onTaskComplete: (result: TaskResult | null) => void;
  isLocked: boolean;
  currentStepIndex: number;
  onStepComplete: () => void;
  totalSteps: number;
}

interface Exercise {
  word: string;
  word_url: string;
  options: string[];
}

const PhonemeGraphemeMapping = ({
  taskData,
  isFetching,
  taskResult,
  onTaskComplete,
  isLocked,
  currentStepIndex,
  onStepComplete,
  totalSteps,
}: PhonemeGraphemeMappingProps) => {
  const { accessToken, user } = useAuthStore();

  const [exercises, setExercises] = useState<Exercise[]>(taskData || []);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOptions, setSelectedOptions] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const [correctAnswers, setCorrectAnswers] = useState<number>(0);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);

  // Update exercises when taskData changes
  useEffect(() => {
    if (taskData) {
      setExercises(taskData);
    }
  }, [taskData]);

  const currentExercise = exercises[currentIndex];

  // Check if current step is already completed
  const isStepCompleted = completedSteps.includes(currentIndex);

  // Check if we can navigate to next step
  const canNavigateNext =
    currentIndex < exercises.length - 1 &&
    (isStepCompleted || completedSteps.includes(currentIndex + 1));

  // Play audio
  const playAudio = () => {
    if (currentExercise?.word_url) {
      const audio = new Audio(currentExercise.word_url);
      audio.play();
    }
  };

  // Handle option selection
  const handleOptionClick = (option: string) => {
    if (taskResult !== null || isStepCompleted) return;

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
    if (canNavigateNext) {
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

      // Mark step as completed
      if (!completedSteps.includes(currentIndex)) {
        const newCompletedSteps = [...completedSteps, currentIndex];
        setCompletedSteps(newCompletedSteps);
        onStepComplete();
      }

      setShowResult(true);
      setIsLoading(false);

      // If this is the last exercise and all steps are completed, complete the task
      if (currentIndex === exercises.length - 1) {
        const allStepsCompleted = completedSteps.length + 1 >= exercises.length;
        if (allStepsCompleted) {
          const totalCorrect = isCorrect ? correctAnswers + 1 : correctAnswers;
          const marks = Math.round((totalCorrect / exercises.length) * 100);

          const result: TaskResult = {
            isAnswer: true,
            marks: marks,
          };
          onTaskComplete(result);
        }
      }
    }, 1000);
  };

  // Check if all steps are completed
  const isAllStepsCompleted = completedSteps.length >= exercises.length;

  return (
    <div
      className={`p-5 md:p-8 bg-[#FFFFFF1F] border border-white/15 rounded-2xl flex flex-col gap-6 w-full relative ${
        isLocked ? "opacity-60" : ""
      }`}>
      <h1 className="font-semibold text-2xl text-white">
        Phoneme Grapheme Mapping
      </h1>

      {/* Main content */}
      {isLocked ? (
        <TaskLoadingLockError
          variant="locked"
          title="Complete Task 1 to unlock this task"
        />
      ) : isFetching ? (
        <TaskLoadingLockError
          title=" Phoneme Grapheme loading..."
          variant="loading"
        />
      ) : (
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
                  disabled={taskResult !== null || isStepCompleted}
                  className={`rounded-full font-semibold text-white w-16 h-16 flex items-center justify-center transition-all bg-gradient-brand hover:brightness-110 ${
                    taskResult !== null || isStepCompleted
                      ? "opacity-50 cursor-not-allowed"
                      : ""
                  }`}>
                  <FaMicrophone className="w-6 h-6" />
                </button>
                <p className="text-gray-300 text-sm">Click to hear the word</p>
              </div>

              {/* Selected Options Display */}
              <div className="flex items-center justify-center">
                <div className="bg-[#1a1a3e] border-2 border-dashed border-gray-500 rounded-xl px-8 py-4 min-h-[60px] flex items-center justify-center gap-2">
                  {selectedOptions.length > 0 ? (
                    <span className="text-2xl font-bold text-gradient">
                      {selectedOptions.join("")}
                    </span>
                  ) : (
                    <span className="text-gray-500">Select letters below</span>
                  )}
                </div>
              </div>

              {/* Options */}
              <div className="flex flex-wrap gap-4 justify-center">
                {currentExercise.options.map((option, index) => (
                  <button
                    key={index}
                    onClick={() => handleOptionClick(option)}
                    disabled={taskResult !== null || isStepCompleted}
                    className={`gradient-button w-fit min-w-[60px] ${
                      selectedOptions.includes(option)
                        ? "ring-2 ring-yellow-400 scale-105"
                        : ""
                    } ${
                      taskResult !== null || isStepCompleted
                        ? "opacity-50 cursor-not-allowed"
                        : ""
                    }`}>
                    {option}
                  </button>
                ))}
              </div>

              {/* Step Completion Indicator */}
              <div className="flex items-center justify-center gap-2">
                {isStepCompleted && (
                  <div className="flex items-center gap-2 bg-green-500/20 px-3 py-1 rounded-full">
                    <FaCheckCircle className="w-4 h-4 text-green-500" />
                    <span className="text-green-500 text-sm">
                      Step Completed
                    </span>
                  </div>
                )}
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
                  className="bg-[#FFFFFF1F] rounded-full border border-white/15 px-4 py-2 text-sm font-medium text-white flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-white/30 transition-colors">
                  <ArrowLeft className="w-4 h-4" /> Previous
                </button>

                <div className="flex flex-col items-center">
                  <h2 className="text-gradient font-semibold text-lg">
                    {currentIndex + 1} of {exercises.length}
                  </h2>
                  <p className="text-gray-400 text-sm">
                    Steps completed: {completedSteps.length}/{exercises.length}
                  </p>
                </div>

                <button
                  onClick={handleNext}
                  disabled={!canNavigateNext}
                  className="bg-[#FFFFFF1F] rounded-full border border-white/15 px-4 py-2 text-sm font-medium text-white flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-white/30 transition-colors">
                  Next <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </>
          )}
        </div>
      )}

      {/* AI Check Button */}
      <button
        onClick={handleCheckWithAI}
        disabled={
          selectedOptions.length === 0 ||
          isLoading ||
          taskResult !== null ||
          isStepCompleted
        }
        className="p-4 inline-flex items-center justify-center gap-2 bg-gradient-brand rounded-2xl font-semibold text-base text-white hover:brightness-110 transition disabled:opacity-50 disabled:cursor-not-allowed">
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
        ) : isStepCompleted ? (
          <>
            <FaCheckCircle className="w-5 h-5" />
            Step Completed
          </>
        ) : (
          <>
            Check with AI
            <Sparkles className="w-5 h-5" />
          </>
        )}
      </button>
    </div>
  );
};

export default PhonemeGraphemeMapping;
