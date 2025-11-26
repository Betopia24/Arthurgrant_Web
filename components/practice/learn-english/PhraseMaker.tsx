"use client";

import { ArrowLeft, ArrowRight, Sparkles } from "lucide-react";
import { useState, useEffect } from "react";
import { FaCheckCircle, FaLock } from "react-icons/fa";
import { useAuthStore } from "@/stores/authStore";
import toast from "react-hot-toast";
import TaskLoadingLock from "../TaskLoadingLock";

interface TaskResult {
  isAnswer: boolean;
  marks: number;
}

interface PhraseMakerProps {
  taskResult: TaskResult | null;
  onTaskComplete: (result: TaskResult | null) => void;
  isLocked: boolean;
}

interface Phrase {
  phrase: string;
  phrase_options: string[];
}

const PhraseMaker = ({
  taskResult,
  onTaskComplete,
  isLocked,
}: PhraseMakerProps) => {
  const { accessToken } = useAuthStore();

  const [phrases, setPhrases] = useState<Phrase[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [availableWords, setAvailableWords] = useState<string[]>([]);
  const [selectedWords, setSelectedWords] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);
  const [showResult, setShowResult] = useState(false);
  const [correctAnswers, setCorrectAnswers] = useState<number>(0);

  // Shuffle array helper
  const shuffleArray = <T,>(array: T[]): T[] => {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  };

  // Fetch data from API
  useEffect(() => {
    const fetchPhrases = async () => {
      if (isLocked) return;
      setIsFetching(true);
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_AI_API}/adult/phrase-maker/get_phrases`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              authtoken: `${accessToken}`,
            },
          }
        );
        const data = await res.json();

        setPhrases(data.phrases || []);

        // Initialize first phrase
        if (data.phrases && data.phrases.length > 0) {
          setAvailableWords(shuffleArray(data.phrases[0].phrase_options));
        }
      } catch (error: any) {
        toast.error(
          error?.data?.errorMessages?.[0]?.message || error?.data?.message
        );
      } finally {
        setIsFetching(false);
      }
    };

    if (accessToken && !isLocked) {
      fetchPhrases();
    }
  }, [accessToken, isLocked]);

  const currentPhrase = phrases[currentIndex];

  // Handle word selection
  const handleWordClick = (word: string) => {
    if (taskResult !== null) return;

    // Add word to selected
    setSelectedWords([...selectedWords, word]);
    // Remove word from available
    setAvailableWords(availableWords.filter((w) => w !== word));
  };

  // Handle word removal (click on selected word to remove it)
  const handleRemoveWord = (index: number) => {
    if (taskResult !== null) return;

    const wordToRemove = selectedWords[index];
    // Remove from selected
    setSelectedWords(selectedWords.filter((_, i) => i !== index));
    // Add back to available
    setAvailableWords([...availableWords, wordToRemove]);
  };

  // Reset current phrase
  const handleReset = () => {
    if (currentPhrase) {
      setAvailableWords(shuffleArray(currentPhrase.phrase_options));
      setSelectedWords([]);
      setShowResult(false);
    }
  };

  // Handle previous
  const handlePrevious = () => {
    if (currentIndex > 0) {
      const prevIndex = currentIndex - 1;
      setCurrentIndex(prevIndex);
      setAvailableWords(shuffleArray(phrases[prevIndex].phrase_options));
      setSelectedWords([]);
      setShowResult(false);
    }
  };

  // Handle next
  const handleNext = () => {
    if (currentIndex < phrases.length - 1) {
      const nextIndex = currentIndex + 1;
      setCurrentIndex(nextIndex);
      setAvailableWords(shuffleArray(phrases[nextIndex].phrase_options));
      setSelectedWords([]);
      setShowResult(false);
    }
  };

  // Handle check with AI
  const handleCheckWithAI = () => {
    if (!currentPhrase || selectedWords.length === 0) return;

    setIsLoading(true);

    setTimeout(() => {
      // Join selected words with space and compare
      const userPhrase = selectedWords.join(" ").toLowerCase().trim();
      const correctPhrase = currentPhrase.phrase.toLowerCase().trim();

      const isCorrect = userPhrase === correctPhrase;

      // Update correct answers count
      if (isCorrect) {
        setCorrectAnswers((prev) => prev + 1);
      }

      setShowResult(true);
      setIsLoading(false);

      // If this is the last phrase, complete the task
      if (currentIndex === phrases.length - 1) {
        const totalCorrect = isCorrect ? correctAnswers + 1 : correctAnswers;
        const marks = Math.round((totalCorrect / phrases.length) * 100);

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
        <>
          <TaskLoadingLock
            variant="locked"
            title=" Complete Task 4 to unlock this task"
          />
        </>
      ) : (
        <>
          <h1 className="font-semibold text-2xl text-white">Phrase Maker</h1>

          {isFetching ? (
            <TaskLoadingLock variant="loading" title="loading..." />
          ) : (
            <>
              {/* Main content */}
              <div className="rounded-xl p-5 md:p-8 bg-[#101231] space-y-20">
                <div>
                  <h3 className="text-white font-semibold text-xl">
                    Arrange the words in correct order:
                  </h3>
                  <p className="text-white text-md">
                    Click each word in sequence to build the phrase.
                  </p>
                </div>

                {currentPhrase && (
                  <>
                    {/* Available Words */}
                    <div className="flex flex-col gap-2">
                      <span className="text-gray-300">Available Words:</span>
                      <div className="flex flex-wrap gap-4">
                        {availableWords.length > 0 ? (
                          availableWords.map((word, index) => (
                            <button
                              key={index}
                              onClick={() => handleWordClick(word)}
                              disabled={taskResult !== null}
                              className={`gradient-button w-fit ${
                                taskResult !== null
                                  ? "opacity-50 cursor-not-allowed"
                                  : ""
                              }`}
                            >
                              {word}
                            </button>
                          ))
                        ) : (
                          <p className="text-gray-500 italic">
                            All words selected. Click words below to remove
                            them.
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Your Phrase */}
                    <div className="flex flex-col gap-2">
                      <span className="text-gray-300">Your phrase:</span>
                      <div className="bg-[#FFFFFF1C] rounded-xl p-6 min-h-[80px] flex items-center justify-center">
                        {selectedWords.length > 0 ? (
                          <div className="flex flex-wrap gap-2">
                            {selectedWords.map((word, index) => (
                              <button
                                key={index}
                                onClick={() => handleRemoveWord(index)}
                                disabled={taskResult !== null}
                                className={`px-4 py-2 bg-gradient-brand rounded-lg font-semibold text-white text-lg hover:brightness-110 transition ${
                                  taskResult !== null
                                    ? "opacity-50 cursor-not-allowed"
                                    : "cursor-pointer"
                                }`}
                              >
                                {word}
                              </button>
                            ))}
                          </div>
                        ) : (
                          <p className="text-gray-500 italic">
                            Click words above to build your phrase
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Result Message */}
                    {showResult && (
                      <div className="flex items-center justify-center">
                        {selectedWords.join(" ").toLowerCase().trim() ===
                        currentPhrase.phrase.toLowerCase().trim() ? (
                          <div className="flex items-center gap-3 bg-green-500/20 border-2 border-green-500 rounded-xl px-6 py-3">
                            <FaCheckCircle className="w-6 h-6 text-green-500" />
                            <span className="text-green-500 font-semibold text-lg">
                              Perfect! The phrase is correct: "
                              {currentPhrase.phrase}"
                            </span>
                          </div>
                        ) : (
                          <div className="flex items-center gap-3 bg-red-500/20 border-2 border-red-500 rounded-xl px-6 py-3">
                            <span className="text-red-500 font-semibold text-lg">
                              Wrong! The correct phrase is: "
                              {currentPhrase.phrase}"
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

                      <div className="flex items-center gap-4">
                        <h2 className="text-gradient font-semibold text-lg">
                          {currentIndex + 1} of {phrases.length}
                        </h2>
                        <button
                          onClick={handleReset}
                          disabled={taskResult !== null}
                          className={`text-sm text-gray-400 hover:text-white transition ${
                            taskResult !== null
                              ? "opacity-50 cursor-not-allowed"
                              : ""
                          }`}
                        >
                          Reset
                        </button>
                      </div>

                      <button
                        onClick={handleNext}
                        disabled={currentIndex === phrases.length - 1}
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
                  selectedWords.length === 0 || isLoading || taskResult !== null
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

export default PhraseMaker;
