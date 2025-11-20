import React from "react";
import {
  FaCheck,
  FaHeadphones,
  FaMicrophone,
  FaMicrophoneSlash,
} from "react-icons/fa";
import { FiRefreshCcw } from "react-icons/fi";

interface Task2ContentProps {
  phrase: string;
  isSpeaking: boolean;
  listening: boolean;
  done: boolean;
  fluency: number | null;
  onPlay: () => void;
  onMic: () => void;
  onRefresh: () => void;
  isSpeechRecognitionAvailable: boolean;
}

const Task2Content: React.FC<Task2ContentProps> = ({
  phrase,
  isSpeaking,
  listening,
  done,
  fluency,
  onPlay,
  onMic,
  onRefresh,
  isSpeechRecognitionAvailable,
}) => {
  return (
    <>
      <div className="bg-[#101231] p-5 md:p-6 rounded-xl flex flex-col items-center justify-center gap-5 md:gap-6">
        <h1 className="text-lg sm:text-xl md:text-xl font-semibold bg-gradient-brand py-2 px-4 md:px-6 rounded-xl text-center">
          {`"${phrase}"`}
        </h1>

        <p className="px-4 py-2 text-xs sm:text-sm rounded-full bg-[#2D2F4A] text-center">
          Listen first, then repeat the phrase
        </p>

        <div className="flex items-center justify-center gap-4 md:gap-6 flex-wrap">
          <button
            className="p-3 rounded-full bg-[#2D2F4A] hover:bg-[#3A3C58] transition-all duration-200 disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-blue-400"
            onClick={onPlay}
            title="Play phrase"
            disabled={isSpeaking}
            aria-label="Play phrase audio">
            <FaHeadphones className="w-4 h-4 md:w-5 md:h-5" />
          </button>

          <button
            className={`p-3 rounded-full transition-all duration-200 hover:brightness-110 focus:outline-none focus:ring-2 focus:ring-blue-400 ${
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
            title="New phrase"
            aria-label="Refresh phrase">
            <FiRefreshCcw className="w-4 h-4 md:w-5 md:h-5" />
          </button>
        </div>

        {listening && (
          <div className="text-xs text-center text-green-400 animate-pulse">
            Listening... Speak now!
          </div>
        )}
      </div>

      <div className="flex flex-col items-center justify-center w-full p-4 font-semibold rounded-xl bg-[#464860]">
        <div className="flex items-center justify-between text-sm w-full mb-2">
          <span>Fluency Score</span>
          <span className="text-white font-bold">
            {fluency !== null ? `${fluency}%` : "--"}
          </span>
        </div>

        <div
          className="w-full bg-gray-500 rounded-full h-2"
          role="progressbar"
          aria-valuenow={fluency ?? 0}
          aria-valuemin={0}
          aria-valuemax={100}>
          <div
            className="h-full rounded-full bg-gradient-brand transition-all duration-1000 ease-out"
            style={{ width: `${fluency ?? 0}%` }}
          />
        </div>
      </div>
    </>
  );
};

export default Task2Content;
