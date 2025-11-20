import { ArrowLeft, ArrowRight, Sparkles } from "lucide-react";
import React, { useState } from "react";
import { FaMicrophone } from "react-icons/fa";

const WordFlash = () => {
  const [isLoading, setIsLoading] = useState(false);
  return (
    <div className="p-5 md:p-8 bg-[#FFFFFF1F] border border-white/15 rounded-2xl flex flex-col gap-6 w-full">
      <h1 className="font-semibold text-2xl text-white">Word Flash</h1>
      {/* Main content */}
      <div className="rounded-xl p-5 md:p-8 bg-[#101231] space-y-20">
        <div>
          <h3 className="text-white font-semibold text-xl">
            Read the word aloud before it vanishes
          </h3>
          <p className="text-white text-md">
            This text should appear for 1-3 seconds and then blur out or
            disappear.
          </p>
        </div>

        <h1 className="text-white text-2xl font-semibold text-center">
          "TRAP"
        </h1>

        <div className="flex items-center justify-center gap-10">
          <button className="rounded-full font-semibold text-white w-16 h-16 flex items-center justify-center transition-all bg-gradient-brand hover:brightness-110 disabled:opacity-50">
            <FaMicrophone className="w-6 h-6" />
          </button>
        </div>

        <div className="flex items-center justify-between">
          <button className="bg-[#FFFFFF1F] rounded-full border border-white/15 px-4 py-2 text-sm font-medium text-white flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-white/30 transition-colors">
            <ArrowLeft className="w-4 h-4" /> Previous
          </button>
          <h2 className="text-gradient font-semibold text-lg">5 of 15</h2>
          <button className="bg-[#FFFFFF1F] rounded-full border border-white/15 px-4 py-2 text-sm font-medium text-white flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-white/30 transition-colors">
            Next <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* AI Check Button */}
      <button className="p-4 inline-flex items-center justify-center gap-2 bg-gradient-brand rounded-2xl font-semibold text-base text-white hover:brightness-110 transition disabled:opacity-50 disabled:cursor-not-allowed">
        {isLoading ? (
          <>
            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            Analyzing...
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

export default WordFlash;
