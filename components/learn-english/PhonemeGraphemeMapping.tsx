import { Sparkles } from "lucide-react";
import React, { useState } from "react";

const PhonemeGraphemeMapping = () => {
  const [isLoading, setIsLoading] = useState(false);
  return (
    <div className="p-6 bg-[#FFFFFF1F] border border-white/15 rounded-2xl flex flex-col gap-6 w-full">
      <div className="rounded-xl p-6 bg-[#101231] space-y-6"></div>

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

export default PhonemeGraphemeMapping;
