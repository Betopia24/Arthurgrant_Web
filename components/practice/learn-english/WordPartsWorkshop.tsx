import { aiRequest } from "@/lib/aiRequest";
import { ArrowLeft, ArrowRight } from "lucide-react";
import React, { useEffect, useState, useCallback } from "react";
import TaskLoadingLockError from "../TaskLoadingLock";

interface TaskResult {
  isAnswer: boolean;
  marks: number;
}

type WordPartsType = {
  suffix: string[];
  root: string[];
  prefix: string[];
  suffix_meaning: string[];
  root_meaning: string[];
  prefix_meaning: string[];
};

interface WordPartsWorkshopProps {
  isLocked: boolean;
  taskResult: TaskResult | null;
  onTaskComplete: (result: TaskResult | null) => void;
}

const WordPartsWorkshop = ({
  isLocked,
  taskResult,
  onTaskComplete,
}: WordPartsWorkshopProps) => {
  const [wordParts, setWordParts] = useState<WordPartsType | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  const fetchWordParts = async () => {
    try {
      setIsLoading(true);
      const res = await aiRequest(
        "/adult/word-parts-workshop/get_word_parts",
        "GET"
      );
      setWordParts(res);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchWordParts();
  }, []);

  const handleNext = useCallback(() => {
    if (!wordParts) return;

    const maxLength = Math.max(
      wordParts.prefix.length,
      wordParts.root.length,
      wordParts.suffix.length
    );

    if (currentIndex < maxLength - 1) {
      setCurrentIndex((prev) => prev + 1);
    }
  }, [currentIndex, wordParts]);

  const handlePrevious = useCallback(() => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
    }
  }, [currentIndex]);

  const getCurrentWord = () => {
    if (!wordParts) return "REACTION";

    const prefix = wordParts.prefix[currentIndex] || "";
    const root = wordParts.root[currentIndex] || "";
    const suffix = wordParts.suffix[currentIndex] || "";

    const constructedWord = `${prefix}${root}${suffix}`;
    return constructedWord ? constructedWord.toUpperCase() : "REACTION";
  };

  const getCurrentMeanings = () => {
    if (!wordParts) return { prefix: "Again", root: "To do", suffix: "State" };

    return {
      prefix: wordParts.prefix_meaning[currentIndex] || "Again",
      root: wordParts.root_meaning[currentIndex] || "To do",
      suffix: wordParts.suffix_meaning[currentIndex] || "State",
    };
  };

  const getMaxLength = () => {
    if (!wordParts) return 15;
    return Math.max(
      wordParts.prefix.length,
      wordParts.root.length,
      wordParts.suffix.length
    );
  };

  const isFirstItem = currentIndex === 0;
  const isLastItem = currentIndex >= getMaxLength() - 1;
  const currentMeanings = getCurrentMeanings();

  const handleSubmitComplete = () => {
    onTaskComplete({ isAnswer: true, marks: 100 });
  };
  return (
    <div className="p-5 md:p-8 bg-[#FFFFFF1F] border border-white/15 rounded-2xl flex flex-col gap-6 w-full">
      <h1 className="font-semibold text-2xl text-white">Word Parts Workshop</h1>

      {/* Main content */}
      {isLocked ? (
        <TaskLoadingLockError
          title="Complete Task 3 to unlock this task"
          variant="locked"
        />
      ) : isLoading && !wordParts ? (
        <TaskLoadingLockError title="word parts loading..." variant="loading" />
      ) : (
        <div className="rounded-xl p-5 md:p-8 bg-[#101231] space-y-20">
          <div>
            <h3 className="text-white font-semibold text-xl">
              Identify prefixes, roots, and suffixes to understand vocabulary.
            </h3>
          </div>

          <div className="text-center space-y-4">
            <h1 className="text-white text-2xl font-semibold">
              "{getCurrentWord()}"
            </h1>
          </div>

          <div className="flex items-center gap-6">
            {/* Prefix Section */}
            <div className="flex flex-col items-start gap-2 w-full">
              <span className="text-white">Prefix</span>
              <button className="gradient-button w-full text-center">
                {wordParts?.prefix[currentIndex] || "re-"}
              </button>
              <span className="text-white">Meaning:</span>
              <span className="font-semibold text-white">
                {currentMeanings.prefix}
              </span>
            </div>

            {/* Root Section */}
            <div className="flex flex-col items-start gap-2 w-full">
              <span className="text-white">Root</span>
              <button className="gradient-button w-full text-center">
                {wordParts?.root[currentIndex] || "act"}
              </button>
              <span className="text-white">Meaning:</span>
              <span className="font-semibold text-white">
                {currentMeanings.root}
              </span>
            </div>

            {/* Suffix Section */}
            <div className="flex flex-col items-start gap-2 w-full">
              <span className="text-white">Suffix</span>
              <button className="gradient-button w-full text-center">
                {wordParts?.suffix[currentIndex] || "-ion"}
              </button>
              <span className="text-white">Meaning:</span>
              <span className="font-semibold text-white">
                {currentMeanings.suffix}
              </span>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <button
              onClick={handlePrevious}
              disabled={isFirstItem || isLoading}
              className="bg-[#FFFFFF1F] rounded-full border border-white/15 px-4 py-2 text-sm font-medium text-white flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-white/30 transition-colors">
              <ArrowLeft className="w-4 h-4" /> Previous
            </button>

            <h2 className="text-gradient font-semibold text-lg">
              {wordParts
                ? `${currentIndex + 1} of ${getMaxLength()}`
                : "0 of 0"}
            </h2>

            <button
              onClick={handleNext}
              disabled={isLastItem || isLoading}
              className="bg-[#FFFFFF1F] rounded-full border border-white/15 px-4 py-2 text-sm font-medium text-white flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-white/30 transition-colors">
              Next <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      <button
        onClick={handleSubmitComplete}
        disabled={!isLastItem}
        className="p-3 sm:p-4 inline-flex items-center justify-center gap-2 bg-gradient-brand rounded-2xl font-semibold text-sm sm:text-base text-white hover:brightness-110 transition disabled:opacity-50 disabled:cursor-not-allowed w-full sm:w-auto">
        Go to next task
      </button>
    </div>
  );
};

export default WordPartsWorkshop;
