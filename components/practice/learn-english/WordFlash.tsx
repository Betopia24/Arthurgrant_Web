import { aiRequest } from "@/lib/aiRequest";
import { ArrowLeft, ArrowRight, Sparkles } from "lucide-react";
import React, { useEffect, useState, useCallback } from "react";
import { FaCheckCircle, FaMicrophone } from "react-icons/fa";
import TaskLoadingLockError from "../TaskLoadingLock";
import toast from "react-hot-toast";

interface TaskResult {
  isAnswer: boolean;
  marks: number;
}

interface WordFlashProps {
  isLocked: boolean;
  taskResult: TaskResult | null;
  onTaskComplete: (result: TaskResult | null) => void;
}

const WordFlash = ({
  taskResult,
  onTaskComplete,
  isLocked,
}: WordFlashProps) => {
  const [words, setWords] = useState<string[]>([]);
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [isWordVisible, setIsWordVisible] = useState(false);
  const [userTranscript, setUserTranscript] = useState("");
  const [showResult, setShowResult] = useState(false);
  const [recognition, setRecognition] = useState<any>(null);
  const [hasShownWord, setHasShownWord] = useState(false);
  const [countdown, setCountdown] = useState<number>(0);
  const [correctAnswers, setCorrectAnswers] = useState<number>(0);

  // Initialize speech recognition
  useEffect(() => {
    if (typeof window !== "undefined") {
      const SpeechRecognition =
        (window as any).SpeechRecognition ||
        (window as any).webkitSpeechRecognition;
      if (SpeechRecognition) {
        const recognitionInstance = new SpeechRecognition();
        recognitionInstance.continuous = false;
        recognitionInstance.interimResults = true;
        recognitionInstance.lang = "en-US";

        recognitionInstance.onresult = (event: any) => {
          const transcript = Array.from(event.results)
            .map((result: any) => result[0])
            .map((result) => result.transcript)
            .join("");
          setUserTranscript(transcript);
        };

        recognitionInstance.onend = () => {
          setIsRecording(false);
        };

        recognitionInstance.onerror = (event: any) => {
          console.error("Speech recognition error:", event.error);
          setIsRecording(false);
          setIsWordVisible(false);
          setCountdown(0);
        };

        setRecognition(recognitionInstance);
      }
    }
  }, []);

  const fetchWords = async () => {
    try {
      setIsLoading(true);
      const res = await aiRequest("/adult/word-flash/get_word_flash", "GET");
      setWords(res.words || []);
    } catch (error) {
      console.error("Failed to fetch words:", error);
      // Fallback words in case of API failure
      setWords([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchWords();
  }, []);

  // Start recording and show word for 3 seconds
  const startRecordingAndShowWord = useCallback(() => {
    if (!words[currentWordIndex]) {
      toast("No word available", {
        style: {
          backgroundColor: "#ffff",
          color: "#000",
        },
      });
      return;
    }

    // Reset states
    setUserTranscript("");
    setShowResult(false);
    setHasShownWord(true);

    // Start recording first
    if (recognition) {
      setIsRecording(true);
      recognition.start();
    } else {
      console.warn("Speech recognition not supported");
      // Fallback: simulate recording for demo purposes
      setIsRecording(true);
    }

    // Show word after a small delay (100ms) to ensure recording starts first
    setTimeout(() => {
      setIsWordVisible(true);
      setCountdown(3);

      // Countdown timer
      const countdownInterval = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(countdownInterval);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      // Hide word and stop recording after 3 seconds
      const timer = setTimeout(() => {
        setIsWordVisible(false);
        setIsRecording(false);

        if (recognition) {
          recognition.stop();
        }

        clearInterval(countdownInterval);
        setCountdown(0);
      }, 3000);

      return () => {
        clearTimeout(timer);
        clearInterval(countdownInterval);
      };
    }, 100);
  }, [recognition, words, currentWordIndex]);

  // Handle next word
  const handleNext = useCallback(async () => {
    if (isRecording) return; // Prevent navigation during recording

    if (currentWordIndex < words.length - 1) {
      setCurrentWordIndex((prev) => prev + 1);
      setHasShownWord(false);
      setUserTranscript("");
      setShowResult(false);
    } else {
      // If it's the last word, fetch new words
      try {
        setIsLoading(true);
        const res = await aiRequest("/adult/word-flash/get_word_flash", "GET");
        const newWords = res.words || [];
        setWords(newWords);
        setCurrentWordIndex(0);
        setHasShownWord(false);
        setUserTranscript("");
        setShowResult(false);
      } catch (error) {
        console.error("Failed to fetch new words:", error);
      } finally {
        setIsLoading(false);
      }
    }
  }, [currentWordIndex, words.length, isRecording]);

  // Handle previous word
  const handlePrevious = useCallback(() => {
    if (isRecording) return; // Prevent navigation during recording

    if (currentWordIndex > 0) {
      setCurrentWordIndex((prev) => prev - 1);
      setHasShownWord(false);
      setUserTranscript("");
      setShowResult(false);
    }
  }, [currentWordIndex, isRecording]);

  const analyzeWithAI = async () => {
    if (!hasShownWord) {
      toast("Please record first by clicking the microphone", {
        style: {
          backgroundColor: "#ffff",
          color: "#000",
        },
      });
      return;
    }

    if (!userTranscript.trim()) {
      toast("No speech recorded. Please try again.", {
        style: {
          backgroundColor: "#ffff",
          color: "#000",
        },
      });
      return;
    }

    setIsAiLoading(true);
    try {
      const currentWord = words[currentWordIndex];

      const isCorrect = userTranscript
        .toLowerCase()
        .includes(currentWord.toLowerCase());

      // Update correct answers count
      if (isCorrect) {
        setCorrectAnswers((prev) => prev + 1);
      }

      setShowResult(true);

      // If this is the last word, complete the task
      if (currentWordIndex === words.length - 1) {
        const marks = Math.round((correctAnswers / words.length) * 100);

        const result: TaskResult = {
          isAnswer: true,
          marks: isCorrect ? marks + Math.round(100 / words.length) : marks,
        };
        onTaskComplete(result);
      }
    } catch (error) {
      console.error("AI analysis failed:", error);

      toast("Analysis failed. Please try again.", {
        style: {
          backgroundColor: "#ffff",
          color: "#000",
        },
      });
    } finally {
      setIsAiLoading(false);
    }
  };

  const currentWord = words[currentWordIndex] || "";
  const isLastWord = currentWordIndex === words.length - 1;
  const isFirstWord = currentWordIndex === 0;

  // Check if all steps are completed for AI button
  const isAllStepsCompleted =
    hasShownWord && userTranscript.trim() && !isRecording;

  return (
    <div className="p-4 sm:p-5 md:p-6 lg:p-8 bg-[#FFFFFF1F] border border-white/15 rounded-2xl flex flex-col gap-4 sm:gap-5 md:gap-6 w-full max-w-full mx-auto">
      <h1 className="font-semibold text-xl sm:text-2xl text-white text-center sm:text-left">
        Word Flash
      </h1>

      {/* Main content */}
      {isLocked ? (
        <TaskLoadingLockError
          title="Complete Task 2 to unlock this task"
          variant="locked"
        />
      ) : isLoading && words.length === 0 ? (
        <TaskLoadingLockError title="Word Flash Loading..." variant="loading" />
      ) : (
        <div className="rounded-xl p-4 sm:p-5 md:p-6 lg:p-8 bg-[#101231] space-y-6 sm:space-y-8">
          <div className="text-center sm:text-left">
            <h3 className="text-white font-semibold text-lg sm:text-xl mb-2">
              Click microphone to start recording and view word
            </h3>
            <p className="text-white text-sm sm:text-base opacity-90">
              Word will show for 3 seconds while recording, then automatically
              stop.
            </p>
          </div>

          {/* Word Display */}
          <div className="min-h-[100px] sm:min-h-[120px] flex items-center justify-center">
            {isWordVisible ? (
              <div className="text-center">
                <h1 className="text-white text-2xl sm:text-3xl md:text-4xl font-bold text-center animate-pulse capitalize px-4 break-words mb-4">
                  "{currentWord}"
                </h1>
                <div className="text-red-400 font-bold text-lg animate-pulse">
                  Recording... {countdown}s
                </div>
              </div>
            ) : (
              <div className="text-center px-4">
                <div className="text-gray-500 text-lg sm:text-xl md:text-2xl font-semibold mb-4 break-words">
                  {hasShownWord && userTranscript
                    ? "Recording completed!"
                    : "Click microphone to start"}
                </div>
              </div>
            )}
          </div>

          {/* Speech Recognition */}
          <div className="space-y-4">
            {/* Microphone Button */}
            <div className="flex items-center justify-center gap-6 sm:gap-8 md:gap-10">
              <button
                onClick={startRecordingAndShowWord}
                disabled={
                  isRecording || !words[currentWordIndex] || taskResult !== null
                }
                className={`rounded-full font-semibold text-white w-16 h-16 sm:w-18 sm:h-18 md:w-20 md:h-20 flex items-center justify-center transition-all ${
                  isRecording
                    ? "bg-red-500 animate-pulse"
                    : words[currentWordIndex] && taskResult === null
                    ? "bg-gradient-brand hover:brightness-110"
                    : "bg-gray-500"
                } disabled:opacity-50 disabled:cursor-not-allowed`}
                title={
                  isRecording
                    ? "Recording in progress..."
                    : words[currentWordIndex] && taskResult === null
                    ? "Click to start recording and view word"
                    : taskResult !== null
                    ? "Task completed"
                    : "No word available"
                }>
                <FaMicrophone className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8" />
              </button>
            </div>

            {/* Transcript Display */}
            {userTranscript && !isRecording && (
              <div className="text-center p-3 sm:p-4 bg-white/10 rounded-lg mx-2">
                <p className="text-white text-xs sm:text-sm mb-1">You said:</p>
                <p className="text-green-400 text-lg sm:text-xl font-semibold break-words px-2">
                  {userTranscript}
                </p>
              </div>
            )}

            {/* Result Display */}
            {showResult && (
              <div
                className={`text-center p-3 sm:p-4 rounded-lg font-semibold text-base sm:text-lg mx-2 ${
                  userTranscript
                    .toLowerCase()
                    .includes(currentWord.toLowerCase())
                    ? "bg-green-500/20 text-green-400"
                    : "bg-red-500/20 text-red-400"
                }`}>
                {userTranscript
                  .toLowerCase()
                  .includes(currentWord.toLowerCase())
                  ? "✓ Correct! Well done!"
                  : `✗ Incorrect - The word was "${currentWord}"`}
              </div>
            )}
          </div>

          {/* Navigation */}
          <div className="flex items-center justify-between flex-wrap gap-4">
            <button
              onClick={handlePrevious}
              disabled={
                (isFirstWord && currentWordIndex === 0) ||
                isRecording ||
                taskResult !== null
              }
              className="bg-[#FFFFFF1F] rounded-full border border-white/15 px-4 sm:px-5 md:px-6 py-2 sm:py-3 text-xs sm:text-sm font-medium text-white flex items-center gap-1 sm:gap-2 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-white/30 transition-colors order-1 flex-1 sm:flex-none justify-center min-w-[120px]">
              <ArrowLeft className="w-3 h-3 sm:w-4 sm:h-4" /> Previous
            </button>

            <h2 className="text-gradient font-semibold text-base sm:text-lg text-center order-3 w-full sm:w-auto sm:order-2">
              {words.length > 0
                ? `${currentWordIndex + 1} of ${words.length}`
                : "0 of 0"}
            </h2>

            <button
              onClick={handleNext}
              disabled={isRecording || taskResult !== null}
              className="bg-[#FFFFFF1F] rounded-full border border-white/15 px-4 sm:px-5 md:px-6 py-2 sm:py-3 text-xs sm:text-sm font-medium text-white flex items-center gap-1 sm:gap-2 hover:bg-white/30 transition-colors order-2 flex-1 sm:flex-none justify-center min-w-[120px]">
              Next <ArrowRight className="w-3 h-3 sm:w-4 sm:h-4" />
            </button>
          </div>
        </div>
      )}

      {/* AI Check Button */}
      <button
        onClick={analyzeWithAI}
        disabled={
          !isAllStepsCompleted ||
          isLoading ||
          isAiLoading ||
          taskResult !== null
        }
        className="p-3 sm:p-4 inline-flex items-center justify-center gap-2 bg-gradient-brand rounded-2xl font-semibold text-sm sm:text-base text-white hover:brightness-110 transition disabled:opacity-50 disabled:cursor-not-allowed w-full sm:w-auto"
        title={
          taskResult !== null
            ? "Task completed"
            : !hasShownWord
            ? "Record first by clicking microphone"
            : !userTranscript
            ? "No speech recorded"
            : "Check your answer with AI"
        }>
        {isAiLoading ? (
          <>
            <div className="w-4 h-4 sm:w-5 sm:h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            <span className="text-xs sm:text-sm">Analyzing...</span>
          </>
        ) : taskResult !== null ? (
          <>
            <FaCheckCircle className="w-5 h-5" />
            Task Completed
          </>
        ) : (
          <>
            <span className="text-xs sm:text-sm">Check with AI</span>
            <Sparkles className="w-4 h-4 sm:w-5 sm:h-5" />
          </>
        )}
      </button>
    </div>
  );
};

export default WordFlash;
