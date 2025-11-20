import Heading from "@/components/shared/Heading";
import { FaMedal } from "react-icons/fa";
import React from "react";
import { achievements } from "@/lib/constants";
import { Check, CheckCircle } from "lucide-react";
import PracticeHero from "@/components/practice/PracticeHero2";

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
      <PracticeHero
        heading="Learning You Can See"
        subheading="Track your learning journey with daily stats, streaks, and achievements — see how far you’ve come."
        specialText="Can See"
        align="center"
        greetText="Hi Raju!"
        streakValue="9"
        sessionTime="12:34"
        progressValue="2/4"
        goalValue="75%"
        sessionProgressWidth="60%"
        progressWidth="40%"
        goalWidth="70%"
      />

      <div className="py-20 bg-section-dark">
        <div className="app-container flex flex-col items-center gap-12">
          {/* Heading */}
          <Heading
            heading="Learning You Can See"
            subheading="Track your 30-day, 60-day, and 90-day growth visually, designed for both learners and parents"
            specialText="Can See"
            align="left"
          />

          <div className="mt-6 w-full flex flex-col lg:flex-row gap-10 lg:items-stretch">
            {/* Left section - Progress Tracking */}
            <div className="flex-1 bg-gradient-to-br from-[#2B2E4E] to-brand-darker p-6 rounded-2xl shadow-lg flex flex-col justify-between">
              {/* Top part: Learning progress + filters + bars */}
              <div>
                <div className="flex justify-between items-start mb-4">
                  <h2 className="text-lg sm:text-xl font-semibold text-white mb-4">
                    Learning Progress
                  </h2>

                  {/* Day filters */}
                  <div className="flex items-center gap-2 mb-4">
                    {["30 D", "60 D", "90 D"].map((day) => (
                      <p
                        key={day}
                        className="px-4 py-1 rounded-full border border-gray-400 text-gray-200 text-xs sm:text-sm font-semibold cursor-pointer bg-gradient-to-r hover:from-gradient-from hover:via-gradient-via hover:to-gradient-to">
                        {day}
                      </p>
                    ))}
                  </div>
                </div>

                {/* Progress Bars */}
                <ProgressBar
                  label="Reading Comprehension"
                  value={67}
                  gradient="bg-gradient-to-r from-[#001925] via-[#F27CB1] to-[#FBAAB1]"
                />
                <ProgressBar
                  label="Listening Skills"
                  value={54}
                  gradient="bg-gradient-to-r from-[#001925] via-[#F27CB1] to-[#FBAAB1]"
                />
                <ProgressBar
                  label="Speaking Confidence"
                  value={73}
                  gradient="bg-gradient-to-r from-[#001925] via-[#F27CB1] to-[#FBAAB1]"
                />
                <ProgressBar
                  label="Grammar Accuracy"
                  value={82}
                  gradient="bg-gradient-to-r from-[#001925] via-[#F27CB1] to-[#FBAAB1]"
                />
              </div>

              {/* Bottom part: Daily Goal */}
              <div className="mt-8">
                <h3 className="text-lg font-semibold text-white mb-2">
                  Today's Goal
                </h3>
                <ProgressBar
                  label="Reading Comprehension"
                  value={4}
                  max={5}
                  gradient="bg-gradient-to-r from-[#001925] via-[#F27CB1] to-[#FBAAB1]"
                />
              </div>
            </div>

            {/* Right section - Analytics */}
            <div className="flex-1 flex flex-col justify-between">
              <p className="text-gray-300 mb-6">
                Our advanced analytics dashboard provides real-time insights
                into learning progress, helping both students and parents
                understand achievements and areas for improvement.
              </p>

              <div className="grid grid-cols-2 gap-6">
                {/* Words Learned */}
                <div className="bg-gradient-to-br from-[#2B2E4E] to-brand-darker p-6 rounded-2xl">
                  <h1 className="text-3xl font-bold text-yellow-400">508</h1>
                  <p className="text-gray-300 mb-2 text-sm">Words Learned</p>
                  <ProgressBar
                    value={80}
                    label=""
                    gradient="bg-gradient-to-r from-yellow-200 to-yellow-600"
                  />
                </div>

                {/* Day Streak */}
                <div className="bg-gradient-to-br from-[#2B2E4E] to-brand-darker p-6 rounded-2xl">
                  <h1 className="text-3xl font-bold text-pink-400">34</h1>
                  <p className="text-gray-300 mb-2 text-sm">Day Streak</p>
                  <ProgressBar
                    value={34}
                    max={60}
                    label=""
                    gradient="bg-gradient-to-r from-pink-200 to-pink-600"
                  />
                </div>

                {/* Accuracy */}
                <div className="bg-gradient-to-br from-[#2B2E4E] to-brand-darker p-6 rounded-2xl">
                  <h1 className="text-3xl font-bold text-blue-400">95%</h1>
                  <p className="text-gray-300 mb-2 text-sm">Accuracy</p>
                  <ProgressBar
                    value={95}
                    label=""
                    gradient="bg-gradient-to-r from-blue-200 to-blue-600"
                  />
                </div>

                {/* Badges */}
                <div className="bg-gradient-to-br from-[#2B2E4E] to-brand-darker p-6 rounded-2xl">
                  <h1 className="text-3xl font-bold text-purple-400">12</h1>
                  <p className="text-gray-300 mb-2 text-sm">Badges Earned</p>
                  <div className="flex items-center gap-2 mt-4">
                    {[...Array(4)].map((_, i) => (
                      <FaMedal key={i} className="text-yellow-500 text-md" />
                    ))}
                    <span className="text-gradient text-sm">+8 more</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
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
