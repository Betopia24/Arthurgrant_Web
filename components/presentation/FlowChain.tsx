import { Sparkles } from "lucide-react";
import React from "react";

import "./gradient-button.css";
import { FaMicrophone } from "react-icons/fa";
const scenarios = [
  "Innovation",
  "Strategy",
  "Execution",
  "Execution",
  "Vision",
  "Team",
  "Team",
  "Impact",
  "Excellence",
  "Leadership",
];
const FlowChain = () => {
  return (
    <div className="p-6 bg-[#FFFFFF1F] border border-white/15 rounded-2xl flex flex-col gap-6 w-full">
      <h1 className="font-semibold text-2xl text-white">Flow Chain</h1>

      <div className="rounded-xl p-6 bg-[#101231] space-y-8">
        <div className="space-y-3">
          <h2>Select a scenario:</h2>

          <div className="flex gap-4 flex-wrap">
            {scenarios.map((sec) => (
              <button className="gradient-button capitalize" key={sec}>
                <span>{sec}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="px-4 py-8 bg-[#FFFFFF1F] border border-white/15 rounded-xl flex flex-col items-center justify-center gap-6 w-full">
          <button className="bg-gradient-brand rounded-full font-semibold text-white w-[72px] h-[72px] flex items-center justify-center hover:brightness-110 transition">
            <FaMicrophone fill="white" className="w-8 h-8" />
          </button>

          <span className="font-medium text-white text-md">
            Click to start your continuous speech
          </span>
        </div>
      </div>

      <button
        type="button"
        className="p-4 inline-flex items-center justify-center gap-2 bg-gradient-brand rounded-2xl font-semibold text-base text-white hover:brightness-110 transition">
        Check with AI
        <Sparkles className="w-5 h-5" />
      </button>
    </div>
  );
};

export default FlowChain;
