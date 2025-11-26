import React from "react";
import { FaCheck, FaMicrophone, FaMicrophoneSlash } from "react-icons/fa";
import { FiRefreshCcw } from "react-icons/fi";

interface Task4ContentProps {
  words: string[];
  correct: Set<string>;
  listening: boolean;
  done: boolean;
  progress: number;
  onPlayWord: (word: string) => void;
  onMic: () => void;
  onRefresh: () => void;
  isSpeaking: boolean;
  isSpeechRecognitionAvailable: boolean;
}

const Task4Content: React.FC<Task4ContentProps> = ({
  words,
  correct,
  listening,
  done,
  progress,
  onPlayWord,
  onMic,
  onRefresh,
  isSpeaking,
  isSpeechRecognitionAvailable,
}) => {
  return (
    <>
      <div className="bg-[#101231] p-5 md:p-6 rounded-xl flex flex-col items-center justify-center gap-5 md:gap-6">
        <p className="px-4 py-2 text-xs sm:text-sm rounded-full bg-[#2D2F4A] text-center">
          Listen to each word, then pronounce it correctly
        </p>

        {/* Vocabulary Grid */}
        <div className="w-full grid grid-cols-2 gap-3 md:gap-4">
          {words.map((word) => {
            const isCorrect = correct.has(word.toLowerCase());
            return (
              <button
                key={word}
                className={`p-3 md:p-4 rounded-xl flex items-center justify-center gap-2 cursor-pointer transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-400 ${
                  isCorrect
                    ? "border-2 border-green-500 bg-green-500/10 text-green-400"
                    : "border-2 border-gray-500 bg-[#2D2F4A] text-gray-300 hover:border-blue-400 hover:text-blue-300"
                }`}
                onClick={() => onPlayWord(word)}
                title={`Play "${word}"`}
                aria-label={`Play pronunciation for ${word}`}
                disabled={isSpeaking}>
                {isCorrect ? (
                  <FaCheck className="w-4 h-4 md:w-5 md:h-5 flex-shrink-0" />
                ) : (
                  <FaMicrophone className="w-4 h-4 md:w-5 md:h-5 flex-shrink-0" />
                )}
                <span className="text-sm md:text-base font-medium text-center capitalize">
                  {word}
                </span>
              </button>
            );
          })}
        </div>

        {/* Buttons */}
        <div className="flex items-center justify-center gap-4 md:gap-6 flex-wrap">
          <button
            className={`p-3 rounded-full transition-all duration-200 hover:brightness-110 focus:outline-none focus:ring-2 focus:ring-blue-400 ${
              listening
                ? "bg-red-500 animate-pulse ring-2 ring-red-300"
                : "bg-gradient-brand hover:shadow-lg"
            }`}
            onClick={onMic}
            title={
              isSpeechRecognitionAvailable ? "Record a word" : "Type a word"
            }
            disabled={listening || done}
            aria-label={listening ? "Listening..." : "Start recording"}>
            {listening ? (
              <FaMicrophoneSlash className="w-4 h-4 md:w-5 md:h-5 text-white" />
            ) : (
              <FaMicrophone className="w-4 h-4 md:w-5 md:h-5 text-white" />
            )}
          </button>

          <button
            className="p-3 rounded-full bg-[#2D2F4A] hover:bg-[#3A3C58] transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-400"
            onClick={onRefresh}
            title="New words"
            aria-label="Refresh vocabulary words">
            <FiRefreshCcw className="w-4 h-4 md:w-5 md:h-5 text-white" />
          </button>
        </div>

        {listening && (
          <div className="text-xs text-center text-green-400 animate-pulse">
            Listening... Say a vocabulary word!
          </div>
        )}
      </div>

      {/* Progress Section */}
      <div className="flex flex-col items-center justify-center w-full p-4 font-semibold rounded-xl bg-[#464860]">
        <div className="flex items-center justify-between text-sm w-full mb-2">
          <span>Word Target</span>
          <span className="text-white font-bold">
            {correct.size}/{words.length}
          </span>
        </div>

        <div
          className="w-full bg-gray-500 rounded-full h-2"
          role="progressbar"
          aria-valuenow={progress}
          aria-valuemin={0}
          aria-valuemax={100}>
          <div
            className="h-full rounded-full bg-gradient-brand transition-all duration-1000 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
    </>
  );
};

export default Task4Content;
