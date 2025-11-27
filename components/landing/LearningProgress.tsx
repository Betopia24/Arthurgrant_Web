import React from "react";
import Heading from "../shared/Heading";
import { FaMedal } from "react-icons/fa";
import RewardVideo from "../reward-video/RewardVideo";
import LearningProgressSection from "../Progress/LearningProgressSection";

interface ProgressBarProps {
  label: string;
  value: number;
  max?: number;
  gradient: string; // Tailwind gradient
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
        <div
          className={`h-2 rounded-full ${gradient}`}
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  );
};

const LearningProgress = () => {
  return (
    <div className="py-20 bg-brand-darker">
      <div className="app-container flex flex-col items-center gap-12">
        {/* Heading */}
        <Heading
          heading="Learning You Can See"
          subheading="Track your 30-day, 60-day, and 90-day growth visually, designed for both learners and parents"
          specialText="Can See"
          align="left"
        />
        <LearningProgressSection />

        {/* 2nd Section - Featuring Video */}
        <div className="mt-4 sm:mt-6" />
        <RewardVideo />
      </div>
    </div>
  );
};

export default LearningProgress;
