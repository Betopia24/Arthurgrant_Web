"use client";
import TaskHeader from "@/components/shared/TaskHeader";
import React from "react";

import { FaLock } from "react-icons/fa";

interface Task4Props {
  isLocked: boolean;
  onSubmitAll: () => void;
}

const Task4ReadingComprehension = ({ isLocked, onSubmitAll }: Task4Props) => {
  return (
    <div
      className={`w-full bg-gradient-to-br from-[#28284A] to-[#12122A] text-white p-8 rounded-xl shadow-lg flex flex-col gap-6 relative ${
        isLocked ? "opacity-60" : ""
      }`}
    >
      {isLocked && (
        <div className="absolute inset-0 bg-black/50 backdrop-blur-sm rounded-xl flex items-center justify-center z-10">
          <div className="flex flex-col items-center gap-4">
            <FaLock className="w-12 h-12 text-gray-400" />
            <p className="text-xl font-semibold text-gray-300">
              Complete Task 3 to unlock this task
            </p>
          </div>
        </div>
      )}
      <TaskHeader
        title="Reading Comprehension"
        description="Read the passage and answer the questions"
        taskNumber={4}
      />
      <div className="flex flex-col lg:flex-row gap-6 w-full">
        <div className="lg:w-1/2 bg-[#363851] p-6 rounded-xl flex flex-col gap-4">
          <div className="w-full flex items-center justify-center">
            <h2 className="text-xl font-semibold text-gradient text-center">
              Tom's Adventure
            </h2>
          </div>
          <p className="text-gray-200 text-base sm:text-lg">
            Tom went on an adventurous journey through the mountains. He
            encountered many challenges but also learned important lessons about
            courage and friendship. Along the way, he met new friends and
            discovered hidden places that few had ever seen.
          </p>
          <img
            src="/passage-01.png"
            alt="Passage illustration"
            className="w-full h-auto object-contain rounded-xl"
          />
        </div>
        <div className="lg:w-1/2 flex flex-col gap-6">
          {[
            {
              question: "Where did Tom go on his adventure?",
              options: ["City", "Mountains", "Beach", "Forest"],
            },
            {
              question: "What did Tom learn on his journey?",
              options: [
                "Courage and friendship",
                "How to swim",
                "Cooking skills",
                "Painting",
              ],
            },
          ].map((q, idx) => (
            <div
              key={idx}
              className="bg-[#363851] p-4 rounded-xl flex flex-col gap-3"
            >
              <h3 className="text-lg font-semibold">
                {idx + 1}. {q.question}
              </h3>
              <div className="flex flex-col gap-2">
                {q.options.map((opt, optIdx) => (
                  <label
                    key={optIdx}
                    className="flex items-center gap-3 cursor-pointer"
                  >
                    <input
                      type="radio"
                      name={`question-${idx}`}
                      disabled={isLocked}
                      className="appearance-none w-5 h-5 border-2 border-gray-500 rounded-full checked:border-0 checked:bg-gradient-to-r checked:from-yellow-300 checked:to-pink-500 transition-all duration-200"
                    />
                    <span className="text-gray-200">{opt}</span>
                  </label>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="w-full flex flex-col items-center justify-center gap-4">
        <button
          onClick={onSubmitAll}
          disabled={isLocked}
          className={`mt-4 px-8 py-2 font-semibold rounded-xl text-gradient bg-[#33354F] border-2 border-gray-600 cursor-pointer ${
            isLocked ? "opacity-50 cursor-not-allowed" : ""
          }`}
        >
          Submit All Answers
        </button>
      </div>
    </div>
  );
};

export default Task4ReadingComprehension;
