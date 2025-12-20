"use client";

import { ArrowLeft, ArrowRight, Sparkles } from "lucide-react";
import React, { useState, useEffect } from "react";
import { FaMicrophone } from "react-icons/fa";
import { FaCheckCircle } from "react-icons/fa";
import { useAuthStore } from "@/stores/authStore";
import "./gradient-button.css";
import TaskLoadingLockError from "../TaskLoadingLock";

interface WordPair {
  word1: string;
  word2: string;
  answer: string;
  audio_file1: string;
  audio_file2: string;
}

interface TaskResult {
  isAnswer: boolean;
  marks: number;
}

interface AuditoryDiscriminationProps {
  taskData: WordPair[] | null;
  isFetching: boolean;
  taskResult: TaskResult | null;
  onTaskComplete: (result: TaskResult | null) => void;
  currentStepIndex: number;
  onStepComplete: () => void;
  totalSteps: number;
}

const AuditoryDiscrimination = ({
  taskData,
  isFetching,
  taskResult,
  onTaskComplete,
  currentStepIndex,
  onStepComplete,
  totalSteps,
}: AuditoryDiscriminationProps) => {
  const { accessToken, user } = useAuthStore();

  const [wordPairs, setWordPairs] = useState<WordPair[]>(taskData || []);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const [correctAnswers, setCorrectAnswers] = useState<number>(0);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);

  // Update wordPairs when taskData changes
  useEffect(() => {
    if (taskData) {
      setWordPairs(taskData);
    }
  }, [taskData]);

  const currentPair = wordPairs[currentIndex];

  // Check if current step is already completed
  const isStepCompleted = completedSteps.includes(currentIndex);

  // Check if we can navigate to next step
  // Only allow navigation to next step if current step is completed OR if we're trying to go to a step that's already been completed
  const canNavigateNext =
    currentIndex < wordPairs.length - 1 &&
    (isStepCompleted || completedSteps.includes(currentIndex + 1));

  // Check if we can navigate to this step
  const canNavigateToStep = (stepIndex: number) => {
    // Allow current step, completed steps, or the immediate next step if current is completed
    return (
      stepIndex === currentIndex ||
      completedSteps.includes(stepIndex) ||
      (stepIndex === currentIndex + 1 && isStepCompleted)
    );
  };

  // Play audio
  const playAudio = (audioUrl: string) => {
    const audio = new Audio(audioUrl);
    audio.play();
  };

  // Handle previous
  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      setSelectedAnswer(null);
      setShowResult(false);
    }
  };

  // Handle next
  const handleNext = () => {
    if (canNavigateNext) {
      setCurrentIndex(currentIndex + 1);
      setSelectedAnswer(null);
      setShowResult(false);
    }
  };

  // Handle check with AI
  const handleCheckWithAI = () => {
    if (!selectedAnswer || !currentPair) return;

    setIsLoading(true);

    setTimeout(() => {
      const isCorrect =
        selectedAnswer.toLowerCase() === currentPair.answer.toLowerCase();

      // Update correct answers count
      if (isCorrect) {
        setCorrectAnswers((prev) => prev + 1);
      }

      // Mark step as completed if not already
      if (!completedSteps.includes(currentIndex)) {
        const newCompletedSteps = [...completedSteps, currentIndex];
        setCompletedSteps(newCompletedSteps);
        onStepComplete();
      }

      setShowResult(true);
      setIsLoading(false);

      // If this is the last pair and all steps are completed, complete the task
      if (currentIndex === wordPairs.length - 1) {
        const allStepsCompleted = completedSteps.length + 1 >= wordPairs.length;
        if (allStepsCompleted) {
          const marks = Math.round((correctAnswers / wordPairs.length) * 100);
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
  const isAllStepsCompleted = completedSteps.length >= wordPairs.length;

  if (isFetching) {
    return (
      <div className="p-5 md:p-8 bg-[#FFFFFF1F] border border-white/15 rounded-2xl flex flex-col gap-6 w-full">
        <h1 className="font-semibold text-2xl text-white">
          Auditory Discrimination
        </h1>
        <div className="rounded-xl p-5 md:p-8 bg-[#101231] flex items-center justify-center min-h-[400px]">
          <TaskLoadingLockError
            variant="loading"
            title="Auditory Discrimination Loading..."
          />
        </div>
      </div>
    );
  }

  return (
    <div className="p-5 md:p-8 bg-[#FFFFFF1F] border border-white/15 rounded-2xl flex flex-col gap-6 w-full">
      <h1 className="font-semibold text-2xl text-white">
        Auditory Discrimination
      </h1>

      {/* Main content */}
      <div className="rounded-xl p-5 md:p-8 bg-[#101231] space-y-20">
        <div>
          <h3 className="text-white font-semibold text-xl">
            Listen carefully and select if both are same or different
          </h3>
          <p className="text-white text-md">
            Click the play button to hear the word, then select if both are
            similar or different.
          </p>
        </div>

        {currentPair && (
          <>
            {/* Audio Players */}
            <div className="flex items-center justify-center gap-10">
              <div className="flex flex-col items-center justify-center gap-2">
                <button
                  onClick={() => playAudio(currentPair.audio_file1)}
                  disabled={taskResult !== null || isStepCompleted}
                  className={`rounded-full font-semibold text-white w-16 h-16 flex items-center justify-center transition-all bg-gradient-brand hover:brightness-110 ${
                    taskResult !== null || isStepCompleted
                      ? "opacity-50 cursor-not-allowed"
                      : ""
                  }`}>
                  <FaMicrophone className="w-6 h-6" />
                </button>
                <span className="text-white">Word 1</span>
              </div>

              <div className="flex flex-col items-center justify-center gap-2">
                <button
                  onClick={() => playAudio(currentPair.audio_file2)}
                  disabled={taskResult !== null || isStepCompleted}
                  className={`rounded-full font-semibold text-white w-16 h-16 flex items-center justify-center transition-all bg-gradient-brand hover:brightness-110 ${
                    taskResult !== null || isStepCompleted
                      ? "opacity-50 cursor-not-allowed"
                      : ""
                  }`}>
                  <FaMicrophone className="w-6 h-6" />
                </button>
                <span className="text-white">Word 2</span>
              </div>
            </div>

            {/* Answer Buttons */}
            <div className="flex items-center justify-center gap-8">
              <button
                onClick={() => setSelectedAnswer("same")}
                disabled={taskResult !== null || isStepCompleted}
                className={`gradient-button w-full ${
                  selectedAnswer === "same" ? "ring-2 ring-yellow-400" : ""
                } ${
                  taskResult !== null || isStepCompleted
                    ? "opacity-50 cursor-not-allowed"
                    : ""
                }`}>
                Same
              </button>
              <button
                onClick={() => setSelectedAnswer("different")}
                disabled={taskResult !== null || isStepCompleted}
                className={`gradient-button w-full ${
                  selectedAnswer === "different" ? "ring-2 ring-yellow-400" : ""
                } ${
                  taskResult !== null || isStepCompleted
                    ? "opacity-50 cursor-not-allowed"
                    : ""
                }`}>
                Different
              </button>
            </div>

            {/* Step Completion Indicator */}
            <div className="flex items-center justify-center gap-2">
              {isStepCompleted && (
                <div className="flex items-center gap-2 bg-green-500/20 px-3 py-1 rounded-full">
                  <FaCheckCircle className="w-4 h-4 text-green-500" />
                  <span className="text-green-500 text-sm">Step Completed</span>
                </div>
              )}
            </div>

            {/* Result Message */}
            {showResult && (
              <div className="flex items-center justify-center">
                {selectedAnswer?.toLowerCase() ===
                currentPair.answer.toLowerCase() ? (
                  <div className="flex items-center gap-3 bg-green-500/20 border-2 border-green-500 rounded-xl px-6 py-3">
                    <FaCheckCircle className="w-6 h-6 text-green-500" />
                    <span className="text-green-500 font-semibold text-lg">
                      Correct!
                    </span>
                  </div>
                ) : (
                  <div className="flex items-center gap-3 bg-red-500/20 border-2 border-red-500 rounded-xl px-6 py-3">
                    <span className="text-red-500 font-semibold text-lg">
                      Wrong! The correct answer is: {currentPair.answer}
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
                  {currentIndex + 1} of {wordPairs.length}
                </h2>
                <p className="text-gray-400 text-sm">
                  Steps completed: {completedSteps.length}/{wordPairs.length}
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

      {/* AI Check Button */}
      <button
        onClick={handleCheckWithAI}
        disabled={
          !selectedAnswer || isLoading || taskResult !== null || isStepCompleted
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

export default AuditoryDiscrimination;
