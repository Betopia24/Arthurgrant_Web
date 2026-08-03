"use client";

import React, { useEffect, useState } from "react";
import { FaMedal } from "react-icons/fa";
import ProgressBar from "../ui/ProgressBar";
import { useAuthStore } from "@/stores/authStore";
import LearningProgressSkeleton from "./LearningProgressSkeleton";

const API_BASE = process.env.NEXT_PUBLIC_BACKEND_API;

const LearningProgressSection = () => {
  const { accessToken, user } = useAuthStore();

  const [progress, setProgress] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    fetchProgress();
  }, []);

  const fetchProgress = async () => {
    try {
      const res = await fetch(`${API_BASE}/progress`, {
        method: "GET",
        headers: { Authorization: `Bearer ${accessToken}` },
      });

      const data = await res.json();
      setProgress(data?.data || {});
    } catch (err) {
      console.error("Progress fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  // 🔥 Show Skeleton While Loading
  if (loading) return <LearningProgressSkeleton />;

  // ❌ Show Error When No Data
  if (!progress)
    return (
      <p className="text-red-400 text-center text-lg mt-5">
        Failed to load progress. Try again later.
      </p>
    );

  // ✅ Render Main UI
  return (
    <div className="mt-6 w-full flex flex-col lg:flex-row gap-10 lg:items-stretch">
      {/* ---------------- LEFT SIDE ---------------- */}
      <div className="flex-1 bg-gradient-to-br from-[#2B2E4E] to-brand-darker p-6 rounded-2xl shadow-lg flex flex-col justify-between">
        <div>
          <div className="flex justify-between items-start">
            <h2 className="text-lg sm:text-xl font-semibold text-white mb-4">
              Learning Progress
            </h2>

            <div className="flex items-center gap-2 mb-4">
              {["30 D", "60 D", "90 D"].map((d) => (
                <p
                  key={d}
                  className="px-4 py-1 rounded-full border border-gray-400 text-gray-200 text-xs sm:text-sm cursor-pointer hover:bg-gray-700 transition"
                >
                  {d}
                </p>
              ))}
            </div>
          </div>

          {/* Conditionally Rendered Progress Bars based on User's Age */}
          {user?.age === "6-9" && (
            <>
              <ProgressBar
                label="Reading Comprehension"
                value={progress.readingProgress || 0}
                gradient="bg-gradient-to-r from-[#001925] via-[#F27CB1] to-[#FBAAB1]"
              />
              <ProgressBar
                label="Speaking Confidence"
                value={progress.speakingProgress || 0}
                gradient="bg-gradient-to-r from-[#001925] via-[#F27CB1] to-[#FBAAB1]"
              />
            </>
          )}

          {(user?.age === "10-13" || user?.age === "14-17") && (
            <>
              <ProgressBar
                label="Interactive Reading"
                value={progress.readingProgress || 0}
                gradient="bg-gradient-to-r from-[#001925] via-[#F27CB1] to-[#FBAAB1]"
              />
              <ProgressBar
                label="Smart Writing"
                value={progress.writingProgress || 0}
                gradient="bg-gradient-to-r from-[#001925] via-[#F27CB1] to-[#FBAAB1]"
              />
              <ProgressBar
                label="Speaking Confidence"
                value={progress.speakingProgress || 0}
                gradient="bg-gradient-to-r from-[#001925] via-[#F27CB1] to-[#FBAAB1]"
              />
            </>
          )}

          {user?.age === "18-40" && (
            <>
              <ProgressBar
                label="Smart Writing "
                value={progress.writingProgress || 0}
                gradient="bg-gradient-to-r from-[#001925] via-[#F27CB1] to-[#FBAAB1]"
              />
              <ProgressBar
                label="Presentation"
                value={progress.presentationProgress || 0}
                gradient="bg-gradient-to-r from-[#001925] via-[#F27CB1] to-[#FBAAB1]"
              />
              <ProgressBar
                label="Vocabulary"
                value={progress.vocabularyProgress || 0}
                gradient="bg-gradient-to-r from-[#001925] via-[#F27CB1] to-[#FBAAB1]"
              />
            </>
          )}

          {!user?.age && (
            <>
              <ProgressBar
                label="Reading Comprehension"
                value={progress.readingProgress || 0}
                gradient="bg-gradient-to-r from-[#001925] via-[#F27CB1] to-[#FBAAB1]"
              />
              <ProgressBar
                label="Writing Skills"
                value={progress.writingProgress || 0}
                gradient="bg-gradient-to-r from-[#001925] via-[#F27CB1] to-[#FBAAB1]"
              />
              <ProgressBar
                label="Speaking Confidence"
                value={progress.speakingProgress || 0}
                gradient="bg-gradient-to-r from-[#001925] via-[#F27CB1] to-[#FBAAB1]"
              />
              <ProgressBar
                label="Presentation"
                value={progress.presentationProgress || 0}
                gradient="bg-gradient-to-r from-[#001925] via-[#F27CB1] to-[#FBAAB1]"
              />
              <ProgressBar
                label="Vocabulary"
                value={progress.vocabularyProgress || 0}
                gradient="bg-gradient-to-r from-[#001925] via-[#F27CB1] to-[#FBAAB1]"
              />
            </>
          )}
        </div>

        {/* Today's Goal */}
        <div className="mt-8">
          <h3 className="text-lg font-semibold text-white mb-2">
            Today's Goal
          </h3>

          <ProgressBar
            label="Daily Goal"
            value={progress.dailyGoalCompleted || 0}
            max={progress.dailyGoal || 1}
            gradient="bg-gradient-to-r from-[#001925] via-[#F27CB1] to-[#FBAAB1]"
          />
        </div>
      </div>

      {/* ---------------- RIGHT SIDE ---------------- */}
      <div className="flex-1 flex flex-col justify-between">
        <p className="text-gray-300 mb-6 leading-relaxed">
          Our advanced analytics dashboard provides real-time insights into your
          learning performance and overall skill development.
        </p>

        <div className="grid grid-cols-2 gap-6">
          {/* Words Learned */}
          <div className="bg-gradient-to-br from-[#2B2E4E] to-brand-darker p-6 rounded-2xl">
            <h1 className="text-3xl font-bold text-yellow-400">
              {progress.totalWords || 0}
            </h1>
            <p className="text-gray-300 mb-2 text-sm">Words Learned</p>

            <ProgressBar
              label=""
              value={progress.totalWords || 0}
              max={500}
              gradient="bg-gradient-to-r from-yellow-200 to-yellow-600"
            />
          </div>

          {/* Day Streak */}
          <div className="bg-gradient-to-br from-[#2B2E4E] to-brand-darker p-6 rounded-2xl">
            <h1 className="text-3xl font-bold text-pink-400">
              {progress.dayStreak || 0}
            </h1>
            <p className="text-gray-300 mb-2 text-sm">Day Streak</p>

            <ProgressBar
              label=""
              value={progress.dayStreak || 0}
              max={60}
              gradient="bg-gradient-to-r from-pink-200 to-pink-600"
            />
          </div>

          {/* Accuracy */}
          <div className="bg-gradient-to-br from-[#2B2E4E] to-brand-darker p-6 rounded-2xl">
            <h1 className="text-3xl font-bold text-blue-400">
              {progress.overallAccuracy || 0}%
            </h1>
            <p className="text-gray-300 mb-2 text-sm">Accuracy</p>

            <ProgressBar
              label=""
              value={progress.overallAccuracy || 0}
              gradient="bg-gradient-to-r from-blue-200 to-blue-600"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default LearningProgressSection;
