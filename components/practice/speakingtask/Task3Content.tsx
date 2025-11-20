import React from "react";
import {
  FaCheck,
  FaHeadphones,
  FaMicrophone,
  FaMicrophoneSlash,
} from "react-icons/fa";
import { FiRefreshCcw } from "react-icons/fi";
import { GiSpeaker } from "react-icons/gi";

interface Task3ContentProps {
  sentence: string;
  isSpeaking: boolean;
  listening: boolean;
  done: boolean;
  attempts: number;
  onPlay: () => void;
  onSlow: () => void;
  onMic: () => void;
  onRefresh: () => void;
  isSpeechRecognitionAvailable: boolean;
}

const Task3Content: React.FC<Task3ContentProps> = ({
  sentence,
  isSpeaking,
  listening,
  done,
  attempts,
  onPlay,
  onSlow,
  onMic,
  onRefresh,
  isSpeechRecognitionAvailable,
}) => {
  return (
    <>
      <div className="bg-[#101231] p-5 md:p-6 rounded-xl flex flex-col items-center justify-center gap-5 md:gap-6">
        <div className="bg-gradient-to-br from-[#28284A] to-[#12122A] rounded-xl px-4 py-3 md:px-6 md:py-4 w-full">
          <h1 className="text-lg md:text-xl font-semibold text-center mb-3 md:mb-4">
            {sentence}
          </h1>

          <div className="flex items-center justify-center gap-2 md:gap-3 flex-wrap">
            <button
              className="px-3 py-1.5 text-xs md:text-sm rounded-full bg-[#2D2F4A] hover:bg-[#3A3C58] transition-all duration-200 flex items-center gap-1 disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-blue-400"
              onClick={onPlay}
              disabled={isSpeaking}
              aria-label="Listen to sentence">
              <GiSpeaker className="w-3 h-3 md:w-4 md:h-4" />
              <span>Listen</span>
            </button>
            <button
              className="px-3 py-1.5 text-xs md:text-sm rounded-full bg-[#2D2F4A] hover:bg-[#3A3C58] transition-all duration-200 disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-blue-400"
              onClick={onSlow}
              disabled={isSpeaking}
              aria-label="Listen to sentence slowly">
              <span>Slow Speed</span>
            </button>
          </div>
        </div>

        <p className="px-4 py-2 text-xs sm:text-sm rounded-full bg-[#2D2F4A] text-center">
          Now repeat the sentence clearly
        </p>

        <div className="flex items-center justify-center gap-4 md:gap-6 flex-wrap">
          <button
            className="p-3 rounded-full bg-[#2D2F4A] hover:bg-[#3A3C58] transition-all duration-200 disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-blue-400"
            onClick={onPlay}
            title="Play sentence"
            disabled={isSpeaking}
            aria-label="Play sentence audio">
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
            title="New sentence"
            aria-label="Refresh sentence">
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

      <div className="flex items-center justify-start w-full mt-4 p-4 md:p-6 font-semibold rounded-xl bg-[#464860]">
        <p className="flex text-sm items-center justify-start gap-2">
          {done ? (
            <>
              <FaCheck className="w-4 h-4 p-1 rounded-full bg-gradient-brand text-white" />
              <span className="text-gradient">
                Perfect! Great Pronunciation!
              </span>
            </>
          ) : (
            <>
              <FaCheck className="w-4 h-4 p-1 rounded-full bg-[#6b6b6b] text-white" />
              <span>Say the sentence to complete</span>
            </>
          )}
        </p>
      </div>
    </>
  );
};

export default Task3Content;
