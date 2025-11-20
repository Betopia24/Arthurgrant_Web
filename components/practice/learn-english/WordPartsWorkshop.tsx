import { ArrowLeft, ArrowRight, Sparkles } from "lucide-react";
import React, { useState } from "react";
import { FaMicrophone } from "react-icons/fa";

const WordPartsWorkshop = () => {
  const [isLoading, setIsLoading] = useState(false);
  return (
    <div className="p-5 md:p-8 bg-[#FFFFFF1F] border border-white/15 rounded-2xl flex flex-col gap-6 w-full">
      <h1 className="font-semibold text-2xl text-white">Word Parts Workshop</h1>
      {/* Main content */}
      <div className="rounded-xl p-5 md:p-8 bg-[#101231] space-y-20">
        <div>
          <h3 className="text-white font-semibold text-xl">
            Combine prefixes, roots, and suffixes to expand vocabulary.
          </h3>
        </div>

        <h1 className="text-white text-2xl font-semibold text-center">
          "REACTION"
        </h1>

        <div className="flex items-center gap-6">
          <div className="flex flex-col items-start gap-2 w-full">
            <span>Prefix</span>
            <button className="gradient-button w-full">re-</button>
            <span>Meaning:</span>
            <span className="font-semibold">Again</span>
          </div>

          <div className="flex flex-col items-start gap-2 w-full">
            <span>Root</span>
            <button className="gradient-button w-full">act</button>
            <span>Meaning:</span>
            <span className="font-semibold">To do</span>
          </div>

          <div className="flex flex-col items-start gap-2 w-full">
            <span>Suffix</span>
            <button className="gradient-button w-full">-ion</button>
            <span>Meaning:</span>
            <span className="font-semibold">State</span>
          </div>
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

export default WordPartsWorkshop;
