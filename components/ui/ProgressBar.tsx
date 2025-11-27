"use client";

import React from "react";

interface ProgressBarProps {
  label: string;
  value: number;
  max?: number;
  gradient: string; // Tailwind gradient classes
}

const ProgressBar: React.FC<ProgressBarProps> = ({
  label,
  value,
  max = 100,
  gradient,
}) => {
  const percentage = Math.min((value / max) * 100, 100);

  return (
    <div className="mb-4">
      {/* Label + value */}
      <div className="flex justify-between text-sm font-medium text-gray-200 mb-1">
        <span>{label}</span>
        <span>
          {value}
          {max !== 100 ? `/${max}` : "%"}
        </span>
      </div>

      {/* Progress bar container */}
      <div className="w-full h-2 bg-gray-700 rounded-full overflow-hidden">
        {/* Filled bar */}
        <div
          className={`h-2 rounded-full ${gradient}`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
};

export default ProgressBar;
