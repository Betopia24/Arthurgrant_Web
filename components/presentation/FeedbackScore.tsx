import React from "react";

type FeedbackScoreProps = {
  score: number;
  feedbackText: string;
};

const FeedbackScore = ({ score, feedbackText }: FeedbackScoreProps) => {
  return (
    <div className="space-y-6 w-full">
      <div className="bg-[#FFFFFF1F] p-5 rounded-xl w-full">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-white/80">Your Score</span>
          <span className="text-sm font-medium text-white">{score}%</span>
        </div>

        {/* Progress Bar */}
        <div className="w-full h-2.5 bg-white/10 rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-500 bg-gradient-brand`}
            style={{
              width: `${score}%`,
            }}
          />
        </div>
      </div>

      <div className="space-y-2">
        <h2 className="font-semibold text-xl text-gradient">AI Feedback</h2>
        <p className="text-sm text-white/90 break-words">{feedbackText}</p>
      </div>
    </div>
  );
};

export default FeedbackScore;
