"use client";

import React, { useEffect, useState } from "react";
import { Heading2 } from "../shared/Heading";
import Image from "next/image";
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
import {
  DailyCheckRewardResponseType,
  RewardVideoItemsType,
} from "@/types/rewardTypes";
import { useAuthStore } from "@/stores/authStore";
import {
  TaskListSkeleton,
  VideoInfoSkeleton,
  VideoListSkeleton,
  VideoPlayerSkeleton,
} from "./RewardSkeletons";

const RewardVideo = () => {
  const { user } = useAuthStore();
  const [data, setData] = useState<DailyCheckRewardResponseType | null>(null);
  const [rewardVideos, setRewardVideos] = useState<RewardVideoItemsType[]>([]);
  const [selectedVideo, setSelectedVideo] =
    useState<RewardVideoItemsType | null>(null);
  const [showVideoList, setShowVideoList] = useState(false);
  const [allCompleted, setAllCompleted] = useState<boolean>(false);

  const [loading, setLoading] = useState({
    data: true,
    rewardVideos: false,
  });

  const [error, setError] = useState({
    data: false,
    rewardVideos: false,
  });

  const isCurrentVideoLocked = () => {
    if (allCompleted) return false;
    if (!selectedVideo) return true;

    // If the selected video is in the archive list, it is already unlocked in the past
    const isArchived = rewardVideos.some((v) => v.id === selectedVideo.id);
    return !isArchived;
  };

  // Format views count
  const formatViews = (views: number): string => {
    if (views >= 1000000) {
      return (views / 1000000).toFixed(1) + "M";
    } else if (views >= 1000) {
      return (views / 1000).toFixed(1) + "K";
    }
    return views.toString();
  };

  // Fetch all reward videos
  const fetchAllRewardVideo = async () => {
    try {
      setLoading((prev) => ({ ...prev, rewardVideos: true }));
      setError((prev) => ({ ...prev, rewardVideos: false }));

      const res = await apiRequest("/reward-video/my/rewards", "GET");
      if (res.success) {
        const rewards = res.data?.rewards || [];
        // Filter only active videos
        const activeVideos = rewards
          .map((item: any) => item.video)
          .filter((video: any) => video && video.isActive);
        setRewardVideos(activeVideos);

        // Set initial video if not already set and there are active videos
        if (activeVideos.length > 0) {
          // Always set first video when fetching all videos
          if (showVideoList || !selectedVideo) {
            setSelectedVideo(activeVideos[0]);
          }
        }
      }
    } catch (error) {
      console.error("Error fetching reward videos:", error);
      setError((prev) => ({ ...prev, rewardVideos: true }));
    } finally {
      setLoading((prev) => ({ ...prev, rewardVideos: false }));
    }
  };

  // Fetch initial video (today's video) on component mount
  const fetchInitialVideo = async () => {
    try {
      setLoading((prev) => ({ ...prev, rewardVideos: true }));
      const res = await apiRequest("/reward-video/todays/reward", "GET");
      if (res.success && res.data?.todaysReward) {
        setSelectedVideo(res.data.todaysReward);
      }
    } catch (error) {
      console.error("Error fetching initial video:", error);
    } finally {
      setLoading((prev) => ({ ...prev, rewardVideos: false }));
    }
  };

  // Handle "Archive Rewards" button click
  const handleSeeAllVideos = async () => {
    const nextShowState = !showVideoList;
    setShowVideoList(nextShowState);

    // If we are opening the list, fetch the videos
    if (nextShowState) {
      await fetchAllRewardVideo();
    }
  };

  // Handle video item click
  const handleVideoClick = (video: RewardVideoItemsType) => {
    setSelectedVideo(video);
  };

  // Fetch daily reward check on component mount
  useEffect(() => {
    const fetchDailyRewardCheck = async () => {
      try {
        setLoading((prev) => ({ ...prev, data: true }));
        setError((prev) => ({ ...prev, data: false }));

        const res = await apiRequest(
          "/reward-video/check/daily/rewards",
          "GET"
        );

        if (res.success) {
          // Filter out "Interactive Writing" task
          const filteredTasks = res.data?.progress?.tasks?.filter(
            (task: any) => task.name !== "Interactive Writing"
          ) || [];
          
          const filteredData = {
            ...res.data,
            progress: {
              ...res.data.progress,
              tasks: filteredTasks,
            },
          };
          setData(filteredData);
        }
      } catch (error) {
        console.error("Error fetching daily rewards:", error);
        setError((prev) => ({ ...prev, data: true }));
      } finally {
        setLoading((prev) => ({ ...prev, data: false }));
      }
    };

    fetchDailyRewardCheck();
    // Fetch initial video on component mount
    fetchInitialVideo();
  }, []);

  useEffect(() => {
    if (data) {
      const isAdult = user?.age === "18-40";
      const tasks = data?.progress.tasks || [];
      const completed = isAdult
        ? tasks.some((task) => task.completed)
        : tasks.every((task) => task.completed);
      setAllCompleted(completed || false);
    } else {
      setAllCompleted(false);
    }
  }, [data, user?.age]);

  return (
    <div className="w-full px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <Heading2
        heading="Learning Feels Better When, You're Rewarded"
        subheading="Daily practice unlocks new videos, matched to your passion— sports, dance, cooking, and more"
        specialText="You're Rewarded"
        align="center"
      />

      <div className="w-full bg-gradient-to-br from-[#2B2E4E] to-brand-darker p-4 sm:p-6 rounded-2xl shadow-lg flex flex-col lg:flex-row gap-6 lg:gap-8 items-stretch mt-12">
        {/* Left - Video Player */}
        <div className="flex-1 min-w-0">
          {loading.data ? (
            <VideoPlayerSkeleton />
          ) : (
            <MediaPlayer
              title={selectedVideo?.title || "Reward Video"}
              src={selectedVideo?.videoUrl || "/videos/demo.mp4"}
              preload="auto"
              controls={!isCurrentVideoLocked()}
              hideControlsOnMouseLeave={!isCurrentVideoLocked()}
              playsInline
              load="visible"
              posterLoad="visible"
              className="relative group overflow-hidden rounded-lg sm:rounded-md w-full">
              <MediaProvider>
                <Poster
                  className="absolute inset-0 block h-full w-full bg-black rounded-lg sm:rounded-md opacity-0 
                    transition-opacity data-[visible]:opacity-100 [&>img]:h-full [&>img]:w-full [&>img]:object-cover"
                  src={"/reward-thumbnail.png"}
                  alt={selectedVideo?.title || "Reward Video Poster"}
                />
              </MediaProvider>

              {/* Default controls only if not locked */}
              {!isCurrentVideoLocked() && (
                <DefaultVideoLayout icons={defaultLayoutIcons} />
              )}

              {/*  LOCK OVERLAY WHEN NOT COMPLETE */}
              {isCurrentVideoLocked() && (
                <div
                  className="
                    absolute inset-0 z-20 flex items-center justify-center 
                    bg-black/40 backdrop-blur-md select-none pointer-events-auto
                  "
                  onClick={(e) => e.stopPropagation()} // disable clicking on video
                >
                  <div className="flex flex-col items-center gap-3 sm:gap-4 text-white text-center px-4 max-w-xs">
                    <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-gradient-to-br from-[#2B2E4E] to-brand-darker flex items-center justify-center">
                      <FaLock className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
                    </div>
                    <div>
                      <h3 className="text-base sm:text-lg font-semibold mb-1">
                        Video Locked
                      </h3>
                      <p className="text-xs sm:text-sm text-gray-300 leading-relaxed">
                        Complete all daily tasks to unlock this video and access
                        all available content
                      </p>
                    </div>
                    <div className="mt-2 px-4 py-2 bg-white/10 rounded-lg border border-white/20">
                      <p className="text-xs font-medium">
                        {data?.progress.tasks.filter((t) => t.completed)
                          .length || 0}
                        /{data?.progress.tasks.length || 0} tasks completed
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Disable clicking/playing if locked */}
              {isCurrentVideoLocked() && (
                <div className="absolute inset-0 z-10 pointer-events-auto" />
              )}
            </MediaPlayer>
          )}

          {/* Video Info - Show when video is selected */}
          {loading.data ? (
            <VideoInfoSkeleton />
          ) : selectedVideo && !isCurrentVideoLocked() ? (
            <div className="mt-4 text-white">
              <h3 className="text-base sm:text-lg font-semibold">
                {selectedVideo.title}
              </h3>
              <p className="text-gray-300 text-xs sm:text-sm mt-1 line-clamp-2">
                {selectedVideo.description}
              </p>
              <div className="flex flex-wrap gap-2 sm:gap-4 mt-2 text-xs text-gray-400">
                <span>Category: {selectedVideo.category}</span>
                <span>Age: {selectedVideo.age}</span>
                <span>Views: {formatViews(selectedVideo.views)}</span>
              </div>
            </div>
          ) : null}
        </div>

        {/* Right - Info and Video List */}
        <div className="flex-1 flex flex-col gap-4 min-w-0">
          {/* Icon + Heading */}
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-[#4C4F69] p-2 sm:p-3 flex-shrink-0">
              {loading.data ? (
                <div className="w-6 h-6 sm:w-8 sm:h-8 bg-gray-700 rounded animate-pulse"></div>
              ) : (
                <Image
                  src="/icon-04.png"
                  alt="placeholder"
                  width={30}
                  height={30}
                  className="object-contain w-6 h-6 sm:w-8 sm:h-8"
                />
              )}
            </div>
            <div className="min-w-0">
              {loading.data ? (
                <div className="space-y-2">
                  <div className="h-5 bg-gray-700 rounded animate-pulse w-32"></div>
                  <div className="h-4 bg-gray-700 rounded animate-pulse w-48"></div>
                </div>
              ) : (
                <>
                  <h3 className="text-base sm:text-lg font-semibold text-white truncate">
                    Today's Session
                  </h3>
                  <p className="text-gray-300 text-xs sm:text-sm truncate">
                    Complete the following activities
                  </p>
                </>
              )}
            </div>
          </div>

          {/* Activities */}
          {loading.data ? (
            <TaskListSkeleton />
          ) : (
            <ul className="flex flex-col gap-2 mt-2">
              {data?.progress.tasks.map((item, index) => (
                <li
                  key={index}
                  className="flex items-center gap-2 text-white text-sm sm:text-base">
                  <div
                    className={`w-5 h-5 flex items-center justify-center rounded-full text-white flex-shrink-0 ${
                      item.completed ? "bg-green-500" : "bg-gray-400"
                    }`}>
                    <Check className="w-3 h-3" />
                  </div>
                  <span className="break-words">{item.name}</span>
                </li>
              ))}
            </ul>
          )}

          {/* Archive Rewards Button */}
          <button
            disabled={loading.data}
            onClick={handleSeeAllVideos}
            className={`mt-2 xl:mt-4 inline-flex items-center gap-2 justify-center rounded-xl px-4 sm:px-6 py-2 text-sm sm:text-base font-semibold w-max bg-gradient-brand text-white transition-all duration-200 hover:opacity-90 cursor-pointer ${
              loading.data ? "opacity-40 cursor-not-allowed animate-pulse" : ""
            }`}>
            {loading.data ? (
              <>Loading...</>
            ) : (
              <>
                {showVideoList ? "Hide Videos" : "Archive Rewards"}
              </>
            )}
          </button>

          {/* Video List */}
          {showVideoList && (
            <div className="mt-4 p-3 sm:p-4 bg-[#3A3D57] rounded-lg max-h-60 sm:max-h-80 overflow-y-auto">
              {loading.rewardVideos ? (
                <VideoListSkeleton />
              ) : error.rewardVideos ? (
                <div className="text-red-400 text-center py-4 text-sm sm:text-base">
                  Failed to load videos. Please try again.
                </div>
              ) : rewardVideos.length === 0 ? (
                <div className="text-gray-400 text-center py-4 text-sm sm:text-base">
                  No videos available
                </div>
              ) : (
                <>
                  <h4 className="text-white font-semibold mb-3 text-sm sm:text-base">
                    Available Videos ({rewardVideos.length})
                  </h4>
                  <div className="space-y-3">
                    {rewardVideos.map((video) => (
                      <div
                        key={video.id}
                        onClick={() => handleVideoClick(video)}
                        className={`flex items-start gap-3 p-3 rounded-lg cursor-pointer transition-all ${
                          selectedVideo?.id === video.id
                            ? "bg-brand-primary/20 border border-brand-primary"
                            : "bg-[#4C4F69] hover:bg-[#565973]"
                        }`}>
                        <div className="w-12 h-9 sm:w-16 sm:h-12 bg-black rounded flex-shrink-0 overflow-hidden">
                          <img
                            src={"/reward-thumbnail.png"}
                            alt={video.title}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-white text-xs sm:text-sm font-medium line-clamp-2">
                            {video.title}
                          </p>
                          <div className="flex flex-wrap gap-1 sm:gap-2 mt-1">
                            <span className="text-xs text-gray-400 bg-[#2B2E4E] px-1.5 sm:px-2 py-0.5 sm:py-1 rounded">
                              {video.category}
                            </span>
                            <span className="text-xs text-gray-400">
                              {formatViews(video.views)} views
                            </span>
                          </div>
                        </div>
                        {selectedVideo?.id === video.id && (
                          <div className="w-2 h-2 bg-green-500 rounded-full mt-1.5 sm:mt-2 flex-shrink-0"></div>
                        )}
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RewardVideo;
