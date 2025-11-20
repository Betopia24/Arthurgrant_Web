import React from "react";
import {
  FaCheck,
  FaHeadphones,
  FaMicrophone,
  FaMicrophoneSlash,
} from "react-icons/fa";
import { FiRefreshCcw } from "react-icons/fi";

interface Task1ContentProps {
  word: string;
  isSpeaking: boolean;
  listening: boolean;
  done: boolean;
  attempts: number;
  onPlay: () => void;
  onMic: () => void;
  onRefresh: () => void;
  isSpeechRecognitionAvailable: boolean;
}

const Task1Content: React.FC<Task1ContentProps> = ({
  word,
  isSpeaking,
  listening,
  done,
  attempts,
  onPlay,
  onMic,
  onRefresh,
  isSpeechRecognitionAvailable,
}) => {
  return (
    <>
      <div className="bg-[#101231] p-5 md:p-6 rounded-xl flex flex-col items-center justify-center gap-5 md:gap-6">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-center text-gradient">
          {word}
        </h1>

        <p className="px-4 py-2 text-xs sm:text-sm rounded-full bg-[#2D2F4A] text-center">
          Tap the microphone & say the word clearly
        </p>

        <div className="flex items-center justify-center gap-4 md:gap-6 flex-wrap">
          <button
            className="p-3 rounded-full bg-[#2D2F4A] hover:bg-[#3A3C58] transition-all duration-200 disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-blue-400"
            onClick={onPlay}
            title="Play word"
            disabled={isSpeaking}
            aria-label="Play word audio">
            <FaHeadphones className="w-4 h-4 md:w-5 md:h-5" />
          </button>

          <button
            className={`p-3 rounded-full hover:brightness-110 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-400 ${
              listening
                ? "bg-red-500 animate-pulse ring-2 ring-red-300"
                : "bg-gradient-brand hover:shadow-lg"
            }`}
            onClick={onMic}
            title={
              isSpeechRecognitionAvailable
                ? "Record your voice"
                : "Type your response"
            }
            disabled={listening || done}
            aria-label={listening ? "Listening..." : "Start recording"}>
            {listening ? (
              <FaMicrophoneSlash className="w-4 h-4 md:w-5 md:h-5" />
            ) : (
              <FaMicrophone className="w-4 h-4 md:w-5 md:h-5" />
            )}
          </button>

          <button
            className="p-3 rounded-full bg-[#2D2F4A] hover:bg-[#3A3C58] transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-400"
            onClick={onRefresh}
            title="Get a new word"
            aria-label="Refresh word">
            <FiRefreshCcw className="w-4 h-4 md:w-5 md:h-5" />
          </button>
        </div>

        {listening && (
          <div className="text-xs text-center text-green-400 animate-pulse">
            Listening... Speak now!
          </div>
        )}

        {attempts > 0 && !done && (
          <div className="text-xs text-orange-400 text-center">
            Attempts: {attempts}
          </div>
        )}
      </div>

      <div className="flex items-center justify-center w-full mt-4 p-4 md:p-6 font-semibold rounded-xl bg-[#464860]">
        <p className="flex text-sm items-center justify-center gap-2">
          {done ? (
            <>
              <FaCheck className="w-4 h-4 p-1 rounded-full bg-gradient-brand text-white" />
              <span className="text-gradient">
                Perfect! Go to Next Challenge
              </span>
            </>
          ) : (
            <>
              <FaCheck className="w-4 h-4 p-1 rounded-full bg-[#6b6b6b] text-white" />
              <span>Say the word to complete</span>
            </>
          )}
        </p>
      </div>
    </>
  );
};

export default Task1Content;
