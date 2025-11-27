import { aiRequest } from "@/lib/aiRequest";
import { ArrowLeft, ArrowRight, Sparkles } from "lucide-react";
import React, { useEffect, useState, useCallback } from "react";
import { FaMicrophone } from "react-icons/fa";
import TaskLoadingLockError from "../TaskLoadingLock";

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
  const [isRecording, setIsRecording] = useState(false);
  const [isWordVisible, setIsWordVisible] = useState(false);
  const [userTranscript, setUserTranscript] = useState("");
  const [showResult, setShowResult] = useState(false);
  const [recognition, setRecognition] = useState<any>(null);
  const [hasShownWord, setHasShownWord] = useState(false);

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
      setWords([
        "TRAP",
        "CLOCK",
        "PHONE",
        "TABLE",
        "CHAIR",
        "WATER",
        "LIGHT",
        "PAPER",
        "MUSIC",
        "BRAVE",
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchWords();
  }, []);

  // Show word for 3 seconds when next/prev is clicked
  const showWordTemporarily = useCallback(() => {
    setIsWordVisible(true);
    setHasShownWord(true);
    setUserTranscript("");
    setShowResult(false);

    const timer = setTimeout(() => {
      setIsWordVisible(false);
    }, 3000); // Word disappears after 3 seconds

    return () => clearTimeout(timer);
  }, []);

  // Handle next word
  const handleNext = useCallback(async () => {
    if (currentWordIndex < words.length - 1) {
      setCurrentWordIndex((prev) => prev + 1);
      setHasShownWord(false);
    } else {
      // If it's the last word, fetch new words
      try {
        setIsLoading(true);
        const res = await aiRequest("/adult/word-flash/get_word_flash", "GET");
        const newWords = res.words || [];
        setWords(newWords);
        setCurrentWordIndex(0);
        setHasShownWord(false);
      } catch (error) {
        console.error("Failed to fetch new words:", error);
      } finally {
        setIsLoading(false);
      }
    }
  }, [currentWordIndex, words.length]);

  // Handle previous word
  const handlePrevious = useCallback(() => {
    if (currentWordIndex > 0) {
      setCurrentWordIndex((prev) => prev - 1);
      setHasShownWord(false);
    }
  }, [currentWordIndex]);

  // Show word when next/prev is clicked
  useEffect(() => {
    if (words.length > 0 && currentWordIndex < words.length && !hasShownWord) {
      showWordTemporarily();
    }
  }, [currentWordIndex, words, hasShownWord, showWordTemporarily]);

  const startRecording = useCallback(() => {
    if (!hasShownWord) {
      alert("Please view the word first by clicking next/previous");
      return;
    }

    if (recognition) {
      setUserTranscript("");
      setIsRecording(true);
      recognition.start();
    } else {
      console.warn("Speech recognition not supported");
      // Fallback: simulate recording for demo purposes
      setIsRecording(true);
      setTimeout(() => {
        setIsRecording(false);
        setUserTranscript(words[currentWordIndex] || "demo");
      }, 2000);
    }
  }, [recognition, words, currentWordIndex, hasShownWord]);

  const stopRecording = useCallback(() => {
    if (recognition) {
      recognition.stop();
    }
    setIsRecording(false);
  }, [recognition]);

  const analyzeWithAI = async () => {
    if (!userTranscript.trim()) {
      alert("Please record your speech first");
      return;
    }

    if (!hasShownWord) {
      alert("Please view the word first by clicking next/previous");
      return;
    }

    setIsLoading(true);
    try {
      const currentWord = words[currentWordIndex];

      // Simulate AI analysis - replace with actual API call
      // For demo, we'll just check if transcript contains the word
      const isCorrect = userTranscript
        .toLowerCase()
        .includes(currentWord.toLowerCase());

      const result: TaskResult = {
        isAnswer: isCorrect,
        marks: isCorrect ? 1 : 0,
      };

      onTaskComplete(result);
      setShowResult(true);
    } catch (error) {
      console.error("AI analysis failed:", error);
      alert("Analysis failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const currentWord = words[currentWordIndex] || "";
  const isLastWord = currentWordIndex === words.length - 1;
  const isFirstWord = currentWordIndex === 0;

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
              Read the word aloud before it vanishes
            </h3>
            <p className="text-white text-sm sm:text-base opacity-90">
              Click Next/Previous to see the word for 3 seconds, then record
              your speech and check with AI.
            </p>
          </div>

          {/* Word Display */}
          <div className="min-h-[100px] sm:min-h-[120px] flex items-center justify-center">
            {isWordVisible ? (
              <h1 className="text-white text-2xl sm:text-3xl md:text-4xl font-bold text-center animate-pulse capitalize px-4 break-words">
                "{currentWord}"
              </h1>
            ) : (
              <div className="text-center px-4">
                <div className="text-gray-500 text-lg sm:text-xl md:text-2xl font-semibold mb-4 break-words">
                  {hasShownWord
                    ? "Word disappeared - speak now!"
                    : "Click Next/Previous to view word"}
                </div>
              </div>
            )}
          </div>

          {/* Speech Recognition */}
          <div className="space-y-4">
            {/* Microphone Button */}
            <div className="flex items-center justify-center gap-6 sm:gap-8 md:gap-10">
              <button
                onClick={isRecording ? stopRecording : startRecording}
                disabled={!hasShownWord || isWordVisible}
                className={`rounded-full font-semibold text-white w-16 h-16 sm:w-18 sm:h-18 md:w-20 md:h-20 flex items-center justify-center transition-all ${
                  isRecording
                    ? "bg-red-500 animate-pulse"
                    : hasShownWord
                    ? "bg-gradient-brand hover:brightness-110"
                    : "bg-gray-500"
                } disabled:opacity-50 disabled:cursor-not-allowed`}
                title={
                  !hasShownWord
                    ? "View the word first"
                    : isWordVisible
                    ? "Wait for word to disappear"
                    : "Click to record"
                }>
                <FaMicrophone className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8" />
              </button>
            </div>

            {/* Recording Status */}
            {isRecording && (
              <div className="text-center">
                <div className="text-red-400 font-semibold animate-pulse text-sm sm:text-base">
                  Recording... Speak now!
                </div>
              </div>
            )}

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
            {showResult && taskResult && (
              <div
                className={`text-center p-3 sm:p-4 rounded-lg font-semibold text-base sm:text-lg mx-2 ${
                  taskResult.isAnswer
                    ? "bg-green-500/20 text-green-400"
                    : "bg-red-500/20 text-red-400"
                }`}>
                {taskResult.isAnswer
                  ? "✓ Correct! Well done!"
                  : "✗ Incorrect - try the next word!"}
              </div>
            )}
          </div>

          {/* Navigation */}
          <div className="flex items-center justify-between flex-wrap gap-4">
            <button
              onClick={handlePrevious}
              disabled={isFirstWord && currentWordIndex === 0}
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
          !userTranscript.trim() || isLoading || isRecording || !hasShownWord
        }
        className="p-3 sm:p-4 inline-flex items-center justify-center gap-2 bg-gradient-brand rounded-2xl font-semibold text-sm sm:text-base text-white hover:brightness-110 transition disabled:opacity-50 disabled:cursor-not-allowed w-full sm:w-auto"
        title={
          !hasShownWord
            ? "View the word first"
            : !userTranscript
            ? "Record your speech first"
            : "Check your answer with AI"
        }>
        {isLoading ? (
          <>
            <div className="w-4 h-4 sm:w-5 sm:h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            <span className="text-xs sm:text-sm">Analyzing...</span>
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
