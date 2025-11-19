import { ArrowRight, Sparkles } from "lucide-react";
import React from "react";
import { FaMicrophone } from "react-icons/fa";
import FeedbackScore from "./FeedbackScore";

const PowerWordsPulse = () => {
  return (
    <div className="p-6 bg-[#FFFFFF1F] border border-white/15 rounded-2xl flex flex-col gap-6 w-full">
      <h1 className="font-semibold text-2xl text-white">Power Words Pulse</h1>

      <div className="rounded-xl p-6 bg-[#101231] space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-gradient font-semibold text-lg">Word 5 of 10</h2>
          <div className="bg-[#FFFFFF1F] rounded-full border border-white/15 px-3 py-1 text-sm font-medium text-white flex items-center gap-2">
            Skip <ArrowRight className="w-4 h-4" />
          </div>
        </div>

        <h1 className="text-2xl text-center">"Dynamic"</h1>

        <div className="px-4 py-8 bg-[#FFFFFF1F] border border-white/15 rounded-xl flex flex-col items-center justify-center gap-6 w-full">
          <button className="bg-gradient-brand rounded-full font-semibold text-white w-[72px] h-[72px] flex items-center justify-center hover:brightness-110 transition">
            <FaMicrophone fill="white" className="w-8 h-8" />
          </button>

          <span className="font-medium text-white text-md">
            Define in your own words
          </span>
        </div>

        <div className="px-4 py-8 bg-[#FFFFFF1F] border border-white/15 rounded-xl flex flex-col items-center justify-center gap-6 w-full">
          <button className="bg-gradient-brand rounded-full font-semibold text-white w-[72px] h-[72px] flex items-center justify-center hover:brightness-110 transition">
            <FaMicrophone fill="white" className="w-8 h-8" />
          </button>

          <span className="font-medium text-white text-md">
            Define in your own words
          </span>
        </div>
      </div>

      <button
        type="button"
        className="p-4 inline-flex items-center justify-center gap-2 bg-gradient-brand rounded-2xl font-semibold text-base text-white hover:brightness-110 transition">
        Check with AI
        <Sparkles className="w-5 h-5" />
      </button>

      {/* <FeedbackScore
        score={70}
        feedbackText="bb9qbcjqcuqecbqcqbcqbcuqeiebb9qbcjqcuqecbqcqbcqbcuqeiebb9qbcjqcuqecbqcqbcqbcuqeiebb9qbcjqcuqecbqcqbcqbcuqeiebb9qbcjqcuqecbqcqbcqbcuqeiebb9qbcjqcuqecbqcqbcqbcuqeiebb9qbcjqcuqecbqcqbcqbcuqeiebb9qbcjqcuqecbqcqbcqbcuqeiebb9qbcjqcuqecbqcqbcqbcuqeiebb9qbcjqcuqecbqcqbcqbcuqeiebb9qbcjqcuqecbqcqbcqbcuqeiebb9qbcjqcuqecbqcqbcqbcuqeie"
      /> */}
    </div>
  );
};

export default PowerWordsPulse;
