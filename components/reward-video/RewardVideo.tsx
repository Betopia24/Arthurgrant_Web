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

// Skeleton Components
const VideoPlayerSkeleton = () => (
  <div className="w-full aspect-video bg-gray-700 rounded-lg animate-pulse flex items-center justify-center">
    <div className="text-gray-500">Loading video...</div>
  </div>
);

const VideoInfoSkeleton = () => (
  <div className="mt-4 space-y-2">
    <div className="h-6 bg-gray-700 rounded animate-pulse w-3/4"></div>
    <div className="h-4 bg-gray-700 rounded animate-pulse w-full"></div>
    <div className="h-4 bg-gray-700 rounded animate-pulse w-2/3"></div>
    <div className="flex flex-wrap gap-4 mt-2">
      {[1, 2, 3, 4].map((item) => (
        <div
          key={item}
          className="h-3 bg-gray-700 rounded animate-pulse w-16"></div>
      ))}
    </div>
  </div>
);

const TaskListSkeleton = () => (
  <div className="flex flex-col gap-2 mt-2">
    {[1, 2, 3].map((item) => (
      <div key={item} className="flex items-center gap-2">
        <div className="w-5 h-5 bg-gray-700 rounded-full animate-pulse"></div>
        <div className="h-4 bg-gray-700 rounded animate-pulse flex-1"></div>
      </div>
    ))}
  </div>
);

const VideoListSkeleton = () => (
  <div className="mt-4 p-4 bg-[#3A3D57] rounded-lg max-h-80 overflow-y-auto">
    <div className="h-6 bg-gray-700 rounded animate-pulse w-1/3 mb-3"></div>
    <div className="space-y-3">
      {[1, 2, 3].map((item) => (
        <div
          key={item}
          className="flex items-start gap-3 p-3 rounded-lg bg-[#4C4F69]">
          <div className="w-16 h-12 bg-gray-700 rounded flex-shrink-0 animate-pulse"></div>
          <div className="flex-1 space-y-2">
            <div className="h-4 bg-gray-700 rounded animate-pulse w-3/4"></div>
            <div className="flex flex-wrap gap-2">
              {[1, 2, 3].map((tag) => (
                <div
                  key={tag}
                  className="h-3 bg-gray-700 rounded animate-pulse w-12"></div>
              ))}
            </div>
          </div>
        </div>
      ))}
    </div>
  </div>
);

const RewardVideo = () => {
  const [data, setData] = useState<DailyCheckRewardResponseType | null>(null);
  const [rewardVideos, setRewardVideos] = useState<RewardVideoItemsType[]>([]);
  const [selectedVideo, setSelectedVideo] =
    useState<RewardVideoItemsType | null>(null);
  const [showVideoList, setShowVideoList] = useState(false);

  const [loading, setLoading] = useState({
    data: true,
    rewardVideos: false,
  });

  const [error, setError] = useState({
    data: false,
    rewardVideos: false,
  });

  // Format file size to readable format
  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
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

      const res = await apiRequest("/reward-video", "GET");
      if (res.success) {
        const videos: RewardVideoItemsType[] = res.data;

        // Filter only active videos
        const activeVideos = videos.filter((video) => video.isActive);
        setRewardVideos(activeVideos);

        // Set initial video if not already set and there are active videos
        if (activeVideos.length > 0 && !selectedVideo) {
          setSelectedVideo(activeVideos[0]);
        }
      }
    } catch (error) {
      console.error("Error fetching reward videos:", error);
      setError((prev) => ({ ...prev, rewardVideos: true }));
    } finally {
      setLoading((prev) => ({ ...prev, rewardVideos: false }));
    }
  };

  // Handle "See All Video" button click
  const handleSeeAllVideos = async () => {
    if (!allCompleted) return;

    // If video list is not shown, fetch and show videos
    if (!showVideoList) {
      await fetchAllRewardVideo();
    }
    setShowVideoList((prev) => !prev);
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
          setData(res.data);
        }
      } catch (error) {
        console.error("Error fetching daily rewards:", error);
        setError((prev) => ({ ...prev, data: true }));
      } finally {
        setLoading((prev) => ({ ...prev, data: false }));
      }
    };
    fetchDailyRewardCheck();
  }, []);

  const allCompleted = true;

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
              controls={allCompleted}
              hideControlsOnMouseLeave={allCompleted}
              playsInline
              load="visible"
              posterLoad="visible"
              className="relative group overflow-hidden rounded-lg sm:rounded-md w-full">
              <MediaProvider>
                <Poster
                  className="absolute inset-0 block h-full w-full bg-black rounded-lg sm:rounded-md opacity-0 
                    transition-opacity data-[visible]:opacity-100 [&>img]:h-full [&>img]:w-full [&>img]:object-cover"
                  src={"https://files.vidstack.io/sprite-fight/poster.webp"}
                  alt={selectedVideo?.title || "Reward Video Poster"}
                />
              </MediaProvider>

              {/* Default controls only if allComplete */}
              {allCompleted && (
                <DefaultVideoLayout icons={defaultLayoutIcons} />
              )}

              {/* 🔒 LOCK OVERLAY WHEN NOT COMPLETE */}
              {!allCompleted && (
                <div
                  className="
                    absolute inset-0 z-20 flex items-center justify-center 
                    bg-black/40 backdrop-blur-md select-none pointer-events-auto
                  "
                  onClick={(e) => e.stopPropagation()} // disable clicking on video
                >
                  <div className="flex flex-col items-center gap-2 text-white text-center px-4">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="w-8 h-8 sm:w-12 sm:h-12 text-white"
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
                    <p className="text-xs sm:text-sm">
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
          )}

          {/* Video Info - Show when video is selected */}
          {loading.data ? (
            <VideoInfoSkeleton />
          ) : selectedVideo && allCompleted ? (
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
                <span>Size: {formatFileSize(selectedVideo.fileSize)}</span>
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

          {/* See All Video Button */}
          <button
            disabled={!allCompleted || loading.data}
            onClick={handleSeeAllVideos}
            className={`mt-2 xl:mt-4 inline-flex items-center gap-2 justify-center rounded-xl px-4 sm:px-6 py-2 text-sm sm:text-base font-semibold w-max bg-gradient-brand text-white transition-all duration-200 ${
              allCompleted && !loading.data
                ? "hover:opacity-90 cursor-pointer"
                : "opacity-40 cursor-not-allowed"
            } ${loading.data ? "animate-pulse" : ""}`}>
            {loading.data ? (
              <>Loading...</>
            ) : (
              <>
                {!allCompleted && <FaLock className="w-3 h-3 sm:w-4 sm:h-4" />}
                {showVideoList ? "Hide Videos" : "See All Videos"}
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
                            src={
                              "https://files.vidstack.io/sprite-fight/poster.webp"
                            }
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
                            <span className="text-xs text-gray-400">
                              {video.age}
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
