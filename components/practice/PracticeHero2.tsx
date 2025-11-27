"use client";

import React, { useEffect, useState } from "react";
import Heading from "../shared/Heading";
import { FaFire, FaClock, FaChartLine, FaBullseye } from "react-icons/fa";
import { useAuthStore } from "@/stores/authStore";
import useGetSessionTime from "@/hooks/useGetSessionTime";
import { authApi } from "@/lib/api";

type PracticeHeroProps = {
  heading: string;
  subheading: string;
  specialText: string;
  align?: "left" | "center" | "right";

  greetText: string;

  streakValue: string | number;
  sessionTime: string;
  progressValue: string;
  goalValue: string;

  sessionProgressWidth: string; // e.g. "60%"
  progressWidth: string; // e.g. "40%"
  goalWidth: string; // e.g. "70%"
};

interface UserProgressType {
  dayStreak: number;
  totalWords: number;
  totalLessons: number;
  overallAccuracy: number;
  dailyGoal: number;
  lastActivityDate: string;
}

const PracticeHero = ({
  heading,
  subheading,
  specialText,
  align = "center",

  greetText,

  streakValue,
  sessionTime,
  progressValue,
  goalValue,

  sessionProgressWidth,
  progressWidth,
  goalWidth,
}: PracticeHeroProps) => {
  const { user } = useAuthStore();
  const sessionTimes = useGetSessionTime();
  const [data, setData] = useState<UserProgressType | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let isMounted = true;

    const fetchData = async () => {
      setLoading(true);
      try {
        const profileResponse = await authApi.getProfile();

        if (isMounted) {
          setData(profileResponse.data.userProgress);
          console.log("check response:", profileResponse.data.userProgress);
        }
      } catch (error) {
        console.error(error);
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchData();

    return () => {
      isMounted = false; // cleanup
    };
  }, []);

  return (
    <div className="pt-36 pb-16 md:py-44 bg-gradient-to-br from-brand-dark via-brand-darker to-brand-darker">
      <div className="app-container flex flex-col items-center gap-12">
        {/* Heading */}
        <Heading
          heading={heading}
          subheading={subheading}
          specialText={specialText}
          align={align}
        />

        {/* Avatar + Comment Box */}
        <div className="mt-6 mx-auto max-w-7xl flex flex-col md:flex-row items-center gap-10 w-full">
          {/* Avatar */}
          <div className="relative w-40 h-40">
            <div className="absolute inset-0 rounded-full bg-gradient-to-r from-gradient-from via-gradient-via to-gradient-to p-1">
              <div className="bg-black rounded-full w-full h-full overflow-hidden">
                <img
                  src="/avatar.png"
                  alt="Avatar"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>

          {/* Comment Box */}
          <div className="flex-1 relative bg-gradient-to-b from-[#28284A] to-[#12122A] p-8 rounded-2xl shadow-lg text-white">
            <div className="absolute -left-4 top-1/2 transform -translate-y-1/2 w-0 h-0 border-t-8 border-b-8 border-r-8 border-t-transparent border-b-transparent border-r-gray-900"></div>

            <h1 className="text-lg sm:text-xl lg:text-3xl font-semibold mb-2">
              <span className="text-gradient">{`Hi ${
                user?.firstName || "User"
              }!`}</span>{" "}
              Welcome Back
            </h1>

            <p className="text-gray-300 text-sm sm:text-base lg:text-lg">
              I'm Mercury, your AI reading companion. Today we'll practice
              reading together with some exciting challenges. Are you ready to
              unlock your potential?
            </p>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 w-full mt-4">
          {/* Streak */}
          <div className="flex flex-col gap-2 bg-gradient-to-br from-[#28284A] to-[#12122A] text-white p-6 rounded-xl shadow-lg">
            <div className="flex items-center justify-between gap-3">
              <div className="p-3 rounded-full bg-gradient-to-r from-yellow-300 to-yellow-600 flex items-center justify-center">
                <FaFire className="text-white text-xl" />
              </div>
              <span className="text-base font-semibold">Streak</span>
            </div>
            {loading ? (
              <div className="flex items-center justify-center">
                <div className="w-14 h-14 rounded-full animate-pulse bg-gray-700"></div>
              </div>
            ) : (
              <div className="mt-3 text-3xl font-bold text-center text-white">
                {data?.dayStreak || "N/A"}
              </div>
            )}
            <div className="text-center text-base sm:text-lg font-semibold">
              Days Streak!
            </div>
            <div className="text-center text-base font-semibold bg-clip-text text-transparent bg-gradient-to-r from-yellow-400 to-yellow-600">
              Keep it up!
            </div>
          </div>

          {/* Session Timer */}
          <div className="flex flex-col gap-2 bg-gradient-to-br from-[#28284A] to-[#12122A] text-white p-6 rounded-xl shadow-lg">
            <div className="flex items-center justify-between gap-3">
              <div className="p-3 rounded-full bg-gradient-to-r from-pink-300 to-pink-600 flex items-center justify-center">
                <FaClock className="text-white text-xl" />
              </div>
              <span className="text-base font-semibold">Session Timer</span>
            </div>
            <div className="mt-3 text-3xl font-bold text-center text-white">
              {sessionTimes}
            </div>
            <div className="text-center text-base sm:text-lg font-semibold">
              Remaining
            </div>
          </div>

          {/* Progress */}
          <div className="flex flex-col gap-2 bg-gradient-to-br from-[#28284A] to-[#12122A] text-white p-6 rounded-xl shadow-lg">
            <div className="flex items-center justify-between gap-3">
              <div className="p-3 rounded-full bg-gradient-to-r from-sky-300 to-sky-600 flex items-center justify-center">
                <FaChartLine className="text-white text-xl" />
              </div>
              <span className="text-base font-semibold">Progress</span>
            </div>
            <div className="mt-3 text-3xl font-bold text-center text-white">
              {progressValue}
            </div>
            <div className="text-center text-base sm:text-lg font-semibold">
              Remaining
            </div>
          </div>

          {/* Today's Goal */}
          <div className="flex flex-col gap-2 bg-gradient-to-br from-[#28284A] to-[#12122A] text-white p-6 rounded-xl shadow-lg">
            <div className="flex items-center justify-between gap-3">
              <div className="p-3 rounded-full bg-gradient-to-r from-green-300 to-green-600 flex items-center justify-center">
                <FaBullseye className="text-white text-xl" />
              </div>
              <span className="text-base font-semibold">Today's Goal</span>
            </div>

            {loading ? (
              <div className="flex items-center justify-center">
                <div className="w-14 h-14 rounded-full animate-pulse bg-gray-700"></div>
              </div>
            ) : (
              <div className="mt-3 text-3xl font-bold text-center text-white">
                {data?.dailyGoal ? `${data.dailyGoal}%` : "N/A"}
              </div>
            )}

            <div className="text-center text-base sm:text-lg font-semibold">
              Accuracy
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PracticeHero;
