import Heading from "@/components/shared/Heading";
import { FaMedal } from "react-icons/fa";
import React from "react";
import { achievements } from "@/lib/constants";
import { Check, CheckCircle } from "lucide-react";
import PracticeHero from "@/components/practice/PracticeHero2";
import LearningProgressSection from "@/components/Progress/LearningProgressSection";

interface ProgressBarProps {
  label: string;
  value: number;
  max?: number;
  gradient: string;
}

const ProgressBar: React.FC<ProgressBarProps> = ({
  label,
  value,
  max = 100,
  gradient,
}) => {
  const percent = Math.min((value / max) * 100, 100);

  return (
    <div className="mb-4">
      <div className="flex justify-between text-sm font-medium text-gray-200 mb-1">
        <span>{label}</span>
        <span>
          {value}
          {max !== 100 ? `/${max}` : "%"}
        </span>
      </div>
      <div className="w-full h-2 bg-gray-700 rounded-full overflow-hidden">
        <div className={`h-2 ${gradient}`} style={{ width: `${percent}%` }} />
      </div>
    </div>
  );
};

export default function Page() {
  return (
    <>
      <div className="py-20 bg-section-dark">
        <div className="app-container flex flex-col items-center gap-12 md:py-12 mt-12">
          {/* Heading */}
          <Heading
            heading="Learning You Can See"
            subheading="Track your 30-day, 60-day, and 90-day growth visually, designed for both learners and parents"
            specialText="Can See"
            align="left"
          />

          <LearningProgressSection />
        </div>
      </div>

      <div className="py-20 bg-brand-darker">
        <div className="app-container flex flex-col items-center gap-8">
          <div className="w-full items-start">
            <h1 className="text-2xl sm:text-3xl font-bold text-white">
              My Achievements
            </h1>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
            {achievements.map((item, idx) => {
              const isUnlocked = item.status === "Unlocked";
              const Icon = item.icon;

              return (
                <div
                  key={idx}
                  className={`relative rounded-xl p-[2px] ${
                    isUnlocked
                      ? "bg-gradient-to-br from-gradient-from via-gradient-via to-gradient-to"
                      : "bg-gray-700"
                  }`}>
                  <div className="rounded-xl bg-[#232339] p-6 flex flex-col gap-3">
                    <div className="w-full flex items-start justify-between">
                      {/* Main achievement icon */}
                      <div
                        className={`flex items-center justify-center w-12 h-12 rounded-full ${
                          isUnlocked
                            ? "bg-gradient-brand text-white"
                            : "bg-[#91919C] text-black"
                        }`}>
                        <Icon className="w-5 h-5" />
                      </div>

                      {/* Check mark */}
                      <div
                        className={`flex items-center justify-center w-6 h-6 rounded-full ${
                          isUnlocked ? "bg-gradient-brand" : "bg-[#91919C]"
                        }`}>
                        <Check className="w-3 h-3 text-white" />
                      </div>
                    </div>

                    <h3 className="text-lg md:text-xl font-semibold text-white">
                      {item.title}
                    </h3>

                    <p className="text-sm md:text-base text-gray-300">
                      {item.description}
                    </p>

                    <div>
                      {isUnlocked ? (
                        <span className="text-sm rounded-lg px-4 py-1.5 text-gray-100 font-semibold bg-gradient-to-r from-green-500 via-green-600 to-green-700">
                          Unlocked
                        </span>
                      ) : (
                        <span className="text-sm rounded-lg px-4 py-1.5 text-gray-800 font-semibold bg-[#91919C]">
                          Keep Practicing to Unlock
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </>
  );
}
