"use client";

import React, { useEffect, useState } from "react";
import { Heading2 } from "../shared/Heading";
import Image from "next/image";
import { activities } from "@/lib/constants";
import Link from "next/link";
import { Check } from "lucide-react";
import { FaLock } from "react-icons/fa";

// Vidstack Styles
import "@vidstack/react/player/styles/base.css";
import "@vidstack/react/player/styles/default/theme.css";
import "@vidstack/react/player/styles/default/layouts/video.css";

import { MediaPlayer, MediaProvider } from "@vidstack/react";
import { Poster } from "@vidstack/react";
import {
  DefaultVideoLayout,
  defaultLayoutIcons,
} from "@vidstack/react/player/layouts/default";
import { apiRequest } from "@/lib/apiRequest";
import { DailyCheckRewardResponseType } from "@/types/rewardTypes";

const RewardVideo = () => {
  const [data, setData] = useState<DailyCheckRewardResponseType | null>(null);

  useEffect(() => {
    const fetchDailyRewardCheck = async () => {
      try {
        const res = await apiRequest(
          "/reward-video/check/daily/rewards",
          "GET"
        );

        if (res.success) {
          setData(res.data);
        }
      } catch (error) {
        console.error(error);
      }
    };
    fetchDailyRewardCheck();
  }, []);

  const allCompleted = data?.progress.tasks?.every((task) => task.completed);

  return (
    <div className="w-full">
      <Heading2
        heading="Learning Feels Better When, You're Rewarded"
        subheading="Daily practice unlocks new videos, matched to your passion— sports, dance, cooking, and more"
        specialText="You're Rewarded"
        align="center"
      />

      <div className="w-full bg-gradient-to-br from-[#2B2E4E] to-brand-darker p-6 rounded-2xl shadow-lg flex flex-col lg:flex-row gap-8 items-stretch mt-6">
        {/* Left - Video */}
        <div className="flex-1">
          <MediaPlayer
            title="Sprite Fight"
            src="/videos/demo.mp4"
            preload="auto"
            controls={allCompleted}
            hideControlsOnMouseLeave={allCompleted}
            playsInline
            load="visible"
            posterLoad="visible"
            className="relative group overflow-hidden rounded-md">
            <MediaProvider>
              <Poster
                className="absolute inset-0 block h-full w-full bg-black rounded-md opacity-0 
        transition-opacity data-[visible]:opacity-100 [&>img]:h-full [&>img]:w-full [&>img]:object-cover"
                src="https://files.vidstack.io/sprite-fight/poster.webp"
                alt="Sprite Fight Poster"
              />
            </MediaProvider>

            {/* Default controls only if allComplete */}
            {allCompleted && <DefaultVideoLayout icons={defaultLayoutIcons} />}

            {/* 🔒 LOCK OVERLAY WHEN NOT COMPLETE */}
            {!allCompleted && (
              <div
                className="
        absolute inset-0 z-20 flex items-center justify-center 
        bg-black/40 backdrop-blur-md select-none pointer-events-auto
      "
                onClick={(e) => e.stopPropagation()} // disable clicking on video
              >
                <div className="flex flex-col items-center gap-2 text-white">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-12 h-12 text-white"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M16.5 10.5V7.5C16.5 5.01472 14.4853 3 12 3C9.51472 3 7.5 5.01472 7.5 7.5V10.5M6 10.5H18V20.25H6V10.5Z"
                    />
                  </svg>
                  <p className="text-sm">
                    Complete all tasks to unlock this video
                  </p>
                </div>
              </div>
            )}

            {/* Disable clicking/playing if locked */}
            {!allCompleted && (
              <div className="absolute inset-0 z-10 pointer-events-auto" />
            )}
          </MediaPlayer>
        </div>

        {/* Right - Info */}
        <div className="flex-1 flex flex-col gap-4">
          {/* Icon + Heading */}
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-[#4C4F69] p-3">
              <Image
                src="/icon-04.png"
                alt="placeholder"
                width={30}
                height={30}
                className="object-contain"
              />
            </div>
            <div>
              <h3 className="text-lg sm:text-xl font-semibold text-white">
                Today's Session
              </h3>
              <p className="text-gray-300 text-sm sm:text-base">
                Complete the following activities
              </p>
            </div>
          </div>

          {/* Activities */}
          <ul className="flex flex-col gap-2 mt-2">
            {data?.progress.tasks.map((item, index) => (
              <li
                key={index}
                className="flex items-center gap-2 text-white text-sm sm:text-base">
                <div
                  className={`w-5 h-5 flex items-center justify-center rounded-full text-white ${
                    item.completed ? "bg-green-500" : "bg-gray-400"
                  }`}>
                  <Check className="w-3 h-3" />
                </div>
                <span>{item.name}</span>
              </li>
            ))}
          </ul>

          {/* Lock Button */}
          <button
            disabled={!allCompleted}
            onClick={() => {
              console.log("Button clicked - video access requested");
            }}
            className={`mt-2 xl:mt-8 inline-flex items-center gap-2 justify-center rounded-xl px-6 py-2 font-semibold w-max bg-gradient-brand text-white transition-opacity duration-200 ${
              allCompleted
                ? "hover:opacity-90 cursor-pointer"
                : "opacity-40 cursor-not-allowed"
            }`}>
            {!allCompleted && <FaLock />}
            See Full Video
          </button>
        </div>
      </div>
    </div>
  );
};

export default RewardVideo;
