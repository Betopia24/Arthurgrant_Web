"use client";

import React from "react";

interface FeedbackScoreProps {
  score: number;
  feedbackText: string;
  suggestions: string[];
  pronunciationScore?: number;
  fluencyScore?: number;
  clarityScore?: number;
}

const FeedbackScore: React.FC<FeedbackScoreProps> = ({
  score,
  feedbackText,
  suggestions,
  pronunciationScore,
  fluencyScore,
  clarityScore,
}) => {
  const getScoreColor = (score: number) => {
    if (score >= 90) return "text-green-400";
    if (score >= 80) return "text-blue-400";
    if (score >= 70) return "text-yellow-400";
    return "text-red-400";
  };

  const getScoreBg = (score: number) => {
    if (score >= 90) return "bg-green-500/20";
    if (score >= 80) return "bg-blue-500/20";
    if (score >= 70) return "bg-yellow-500/20";
    return "bg-red-500/20";
  };

  return (
    <div className="p-6 bg-[#101231] border border-white/15 rounded-2xl space-y-6">
      {/* Overall Score */}
      <div className="text-center space-y-4">
        <h3 className="text-white font-semibold text-lg">AI Feedback</h3>
        <div
          className={`inline-flex items-center justify-center w-20 h-20 rounded-full ${getScoreBg(
            score
          )} border-4 border-white/20`}>
          <span className={`text-2xl font-bold ${getScoreColor(score)}`}>
            {score}
          </span>
        </div>
        <p className="text-white/80 text-sm">
          {score >= 90
            ? "Excellent!"
            : score >= 80
            ? "Great job!"
            : score >= 70
            ? "Good work!"
            : "Keep practicing!"}
        </p>
      </div>

      {/* Detailed Scores */}
      {(pronunciationScore || fluencyScore || clarityScore) && (
        <div className="grid grid-cols-3 gap-4">
          {pronunciationScore && (
            <div className="text-center">
              <div className="text-white/60 text-sm mb-1">Pronunciation</div>
              <div
                className={`text-lg font-semibold ${getScoreColor(
                  pronunciationScore
                )}`}>
                {pronunciationScore}%
              </div>
            </div>
          )}
          {fluencyScore && (
            <div className="text-center">
              <div className="text-white/60 text-sm mb-1">Fluency</div>
              <div
                className={`text-lg font-semibold ${getScoreColor(
                  fluencyScore
                )}`}>
                {fluencyScore}%
              </div>
            </div>
          )}
          {clarityScore && (
            <div className="text-center">
              <div className="text-white/60 text-sm mb-1">Clarity</div>
              <div
                className={`text-lg font-semibold ${getScoreColor(
                  clarityScore
                )}`}>
                {clarityScore}%
              </div>
            </div>
          )}
        </div>
      )}

      {/* Feedback Text */}
      <div>
        <h4 className="text-white font-medium mb-2">Feedback</h4>
        <p className="text-white/80 text-sm leading-relaxed">{feedbackText}</p>
      </div>

      {/* Suggestions */}
      {suggestions.length > 0 && (
        <div>
          <h4 className="text-white font-medium mb-2">
            Suggestions for Improvement
          </h4>
          <ul className="space-y-2">
            {suggestions.map((suggestion, index) => (
              <li key={index} className="flex items-start gap-2 text-sm">
                <span className="text-blue-400 mt-1">•</span>
                <span className="text-white/80">{suggestion}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default FeedbackScore;
