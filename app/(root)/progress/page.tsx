"use client";

import PracticeHero from "@/components/practice/PracticeHero2";
import LearningProgressSection from "@/components/Progress/LearningProgressSection";
import Heading from "@/components/shared/Heading";
import { useAuthStore } from "@/stores/authStore";
import axios from "axios";
import { Check, Award } from "lucide-react";
import React, { useEffect, useState } from "react";

interface Badge {
  id: string;
  name: string;
  type: string;
  icon: string;
  description: string;
  requirement: string;
  targetValue: number;
  isUnlocked: boolean;
  earnedAt: string | null;
  progress: Record<string, any>;
}

export default function Page() {
  const { accessToken } = useAuthStore();
  const [badges, setBadges] = useState<Badge[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBadges = async () => {
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_BACKEND_API}/badge/user-badges`,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );
        setBadges(response.data.data || []);
      } catch (error) {
        console.error("Error fetching badges:", error);
      } finally {
        setLoading(false);
      }
    };

    if (accessToken) {
      fetchBadges();
    }
  }, [accessToken]);

  return (
    <>
      <PracticeHero
        heading="Learning You Can See"
        subheading="Track your learning journey with daily stats, streaks, and achievements — see how far you've come."
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

          {loading ? (
            <div className="text-white text-center py-12">
              Loading achievements...
            </div>
          ) : badges.length === 0 ? (
            <div className="text-gray-400 text-center py-12">
              No achievements yet. Keep practicing!
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
              {badges.map((badge) => {
                const isUnlocked = badge.isUnlocked;

                return (
                  <div
                    key={badge.id}
                    className={`relative rounded-xl p-[2px] ${
                      isUnlocked
                        ? "bg-gradient-to-br from-gradient-from via-gradient-via to-gradient-to"
                        : "bg-gray-700"
                    }`}
                  >
                    <div className="rounded-xl bg-[#232339] p-6 flex flex-col gap-3">
                      <div className="w-full flex items-start justify-between">
                        {/* Main achievement icon */}
                        <div
                          className={`flex items-center justify-center w-12 h-12 rounded-full ${
                            isUnlocked
                              ? "bg-gradient-brand text-white"
                              : "bg-[#91919C] text-black"
                          }`}
                        >
                          {badge.icon ? (
                            <img
                              src={badge.icon}
                              alt={badge.name}
                              className="w-6 h-6"
                            />
                          ) : (
                            <Award className="w-5 h-5" />
                          )}
                        </div>

                        {/* Check mark */}
                        <div
                          className={`flex items-center justify-center w-6 h-6 rounded-full ${
                            isUnlocked ? "bg-gradient-brand" : "bg-[#91919C]"
                          }`}
                        >
                          <Check className="w-3 h-3 text-white" />
                        </div>
                      </div>

                      <h3 className="text-lg md:text-xl font-semibold text-white">
                        {badge.name}
                      </h3>

                      <p className="text-sm md:text-base text-gray-300">
                        {badge.description}
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
          )}
        </div>
      </div>
    </>
  );
}
