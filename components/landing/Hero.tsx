import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { Play, Rocket, Star, X } from "lucide-react";
import { useLanguageStore } from "@/stores/languageStore";

interface HeroProps {
  onVideoEnd: () => void;
  onVideoModalOpen: () => void;
  onVideoModalClose: () => void;
}

const Hero = ({
  onVideoEnd,
  onVideoModalOpen,
  onVideoModalClose,
}: HeroProps) => {
  const [showVideoPopup, setShowVideoPopup] = useState(true);
  const [showVideoTooltip, setShowVideoTooltip] = useState(true);
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  // Use the language store
  const { preferredLang } = useLanguageStore();

  // Function to get video source based on selected language
  const getVideoSource = () => {
    const videoMap: { [key: string]: string } = {
      en: "/intros/manifex-intro-english.mp4",
      fr: "/intros/manifex-intro-french.mp4",
      es: "/intros/manifex-intro-spanish.mp4",
      hi: "/intros/manifex-intro-hindi.mp4",
      bn: "/intros/manifex-intro-bangla.mp4",
      "zh-CN": "/intros/manifex-intro-chinese.mp4",
      ko: "/intros/manifex-intro-korean.mp4",
      ru: "/intros/manifex-intro-russian.mp4",
      vi: "/intros/manifex-intro-vietnamese.mp4",
      it: "/intros/manifex-intro-italian.mp4",
      de: "/intros/manifex-intro-german.mp4",
    };

    return videoMap[preferredLang] || "/intros/manifex-intro-english.mp4"; // Use preferredLang from store
  };

  const handlePlayVideo = () => {
    if (videoRef.current) {
      videoRef.current.muted = false; // Enable sound
      videoRef.current
        .play()
        .then(() => {
          setIsVideoPlaying(true);
          setShowVideoTooltip(false);
        })
        .catch((error) => {
          console.log("Video play failed:", error);
        });
    }
  };

  const handleVideoEnd = () => {
    setShowVideoPopup(false);
    setIsVideoPlaying(false);
    onVideoEnd(); // Notify parent
    onVideoModalClose(); // Notify parent that modal is closed
  };

  const handleCloseVideoPopup = () => {
    setShowVideoPopup(false);
    setIsVideoPlaying(false);
    onVideoEnd(); // Notify parent
    onVideoModalClose(); // Notify parent that modal is closed
  };

  const handleOpenVideoPopup = () => {
    setShowVideoPopup(true);
    setShowVideoTooltip(true);
    setIsVideoPlaying(false);
    onVideoModalOpen(); // Notify parent that modal is opening
  };

  // Notify parent when modal opens initially
  useEffect(() => {
    if (showVideoPopup) {
      onVideoModalOpen();
    }
  }, []);

  // Disable scroll when video popup is open
  useEffect(() => {
    if (showVideoPopup) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [showVideoPopup]);

  const videoSource = getVideoSource();

  return (
    <div className="pt-32 sm:pt-36 md:pt-40 xl:pt-44 min-h-screen bg-gradient-to-br from-brand-dark to-brand-darker relative">
      {/* Video Popup Modal with Blur Background */}
      {showVideoPopup && (
        <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-md">
          <div className="relative rounded-2xl mx-4 max-w-4xl w-full">
            {/* Header with close button only */}
            <div className="flex justify-end items-center py-4 px-0">
              <button
                onClick={handleCloseVideoPopup}
                className="p-2 bg-gradient-brand-btn hover:bg-white/20 border-2 border-gray-700 rounded-full transition-colors cursor-pointer"
              >
                <X className="w-6 h-6 text-white" />
              </button>
            </div>

            {/* Video Container */}
            <div className="p-2 relative border border-white/20 bg-black/90 overflow-hidden rounded-2xl">
              <video
                ref={videoRef}
                autoPlay={false}
                muted={true}
                onEnded={handleVideoEnd}
                className="w-full h-[500px] object-contain rounded-2xl"
                key={videoSource} // Important: forces video reload when source changes
              >
                <source src={videoSource} type="video/mp4" />
                Your browser does not support the video tag.
              </video>

              {/* Video Tooltip Overlay */}
              {showVideoTooltip && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-lg px-4">
                  <div
                    className="bg-gradient-to-br from-[#28284A] to-[#12122A] text-white rounded-lg 
      p-4 sm:p-6 md:p-8 
      w-full max-w-sm sm:max-w-md md:max-w-lg lg:max-w-xl 
      text-center shadow-xl"
                  >
                    <h3 className="text-base sm:text-lg md:text-xl lg:text-2xl font-semibold mb-2 sm:mb-3 md:mb-4">
                      Welcome to Mercury AI English Tutor
                    </h3>

                    <p
                      className="text-gray-300 mb-3 sm:mb-4 md:mb-6 
        text-xs sm:text-sm md:text-base lg:text-lg"
                    >
                      Watch our introduction to discover how Mercury makes
                      learning English fun and effective with AI-powered
                      personalized lessons.
                    </p>

                    <button
                      onClick={handlePlayVideo}
                      className="flex items-center justify-center gap-2 
          px-4 py-2 sm:px-6 sm:py-2.5 md:px-8 md:py-3 
          bg-gradient-brand text-white rounded-xl font-semibold 
          hover:opacity-90 transition-opacity mx-auto cursor-pointer 
          text-xs sm:text-sm md:text-base lg:text-lg"
                    >
                      <Play
                        className="w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5"
                        fill="white"
                      />
                      Watch Introduction
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Hero Content with conditional blur */}
      <div
        className={`app-container flex flex-col md:flex-row items-center gap-10 lg:gap-16 xl:gap-20 transition-all duration-300 ${
          showVideoPopup ? "filter blur-md" : ""
        }`}
      >
        {/* Left Part (60%) */}
        <div className="w-full md:w-3/5 flex flex-col items-center md:items-start text-white">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl 2xl:text-[80px] font-bold leading-tight md:leading-tight mb-5 sm:mb-6 md:mb-6 text-center md:text-left uppercase">
            Let's Speak&nbsp;
            <span className="text-gradient-minor italic mt-0.5">Energy.</span>
          </h1>

          <p className="text-base sm:text-lg md:text-xl lg:text-2xl xl:text-2xl mb-6 sm:mb-8 text-gray-300 max-w-full md:max-w-3xl text-center md:text-left">
            New innovative way to practice reading, writing, speaking, and LERAN
            ENGLISH!{" "}
            <span className="text-gradient-minor font-semibold">
              Guided, Sequenced, Engaging, Rewarding.
            </span>{" "}
            Just 10-15 minutes a day!
          </p>

          {/* Buttons */}
          <div className="mt-4 lg:mt-8 flex flex-wrap gap-3 sm:gap-4 md:gap-6 mb-6 sm:mb-8 justify-center md:justify-start">
            <button className="flex items-center justify-center px-5 py-2 sm:px-6 sm:py-3 md:px-8 md:py-3.5 xl:px-10 gap-2 rounded-3xl bg-gradient-to-r from-gradient-from via-gradient-via to-gradient-to font-bold text-white text-sm sm:text-base md:text-lg xl:text-xl shadow-lg transition">
              <Rocket className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6" /> Start
              Free Today
            </button>

            <button
              onClick={handleOpenVideoPopup}
              className="flex items-center justify-center px-5 py-2 sm:px-6 sm:py-3 md:px-8 md:py-3.5 xl:px-10 gap-2 rounded-3xl border border-gray-500 text-white hover:bg-white/10 transition font-semibold text-sm sm:text-base md:text-lg xl:text-xl"
            >
              <Play className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6" /> Watch
              Mercury in Action
            </button>
          </div>

          {/* Learners + Rating */}
          <div className="mt-4 flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6 lg:gap-8 justify-center md:justify-start">
            {/* Overlapping Avatars */}
            <div className="flex -space-x-3 sm:-space-x-4 self-center sm:self-auto">
              {[1, 2, 3].map((i) => (
                <Image
                  key={i}
                  src="/user1.png"
                  alt={`Learner ${i}`}
                  width={60}
                  height={60}
                  className="w-10 h-10 sm:w-12 sm:h-12 lg:w-16 lg:h-16 rounded-full border-2 border-brand-dark"
                />
              ))}
            </div>

            {/* Text + Stars */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:gap-4">
              <p className="font-semibold text-sm sm:text-base md:text-lg lg:text-lg xl:text-xl text-center md:text-left">
                100,000+ Learners
              </p>
              <div className="flex items-center gap-1 text-yellow-400 mt-1 sm:mt-0 justify-center md:justify-start">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className="w-3 h-3 sm:w-4 sm:h-4 md:w-4 md:h-4"
                    fill="currentColor"
                  />
                ))}
                <span className="ml-2 text-white text-xs sm:text-sm md:text-base lg:text-base xl:text-lg">
                  4.9 out of 5 Rating
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Part (40%) */}
        <div className="w-full md:w-2/5 flex flex-col items-center mt-10 md:mt-0 pb-16">
          {/* Image with Blur Background */}
          <div className="flex justify-center mb-4 sm:mb-6 relative">
            <div className="absolute w-[250px] sm:w-[300px] md:w-[350px] xl:w-[500px] h-[250px] sm:h-[300px] md:h-[350px] xl:h-[500px] rounded-full bg-gradient-to-t from-[#05061E] via-[#2C3E50] to-transparent blur-xl opacity-40"></div>
            <div className="relative w-[250px] sm:w-[300px] md:w-[350px] xl:w-[500px] h-[250px] sm:h-[300px] md:h-[350px] xl:h-[500px] rounded-full overflow-hidden">
              <Image
                src="/avatar.png"
                alt="Avatar"
                width={500}
                height={500}
                className="object-cover w-full h-full"
                priority
              />
            </div>
          </div>

          {/* Name styled like button with dual diagonal border */}
          <h1 className="relative inline-block mt-8 px-8 md:px-10 xl:px-20 py-2 sm:py-3 md:py-4 text-white font-semibold text-sm sm:text-base md:text-lg xl:text-xl rounded-full text-center notranslate">
            Mercury
            {/* Top-left triangle (lighter border) */}
            <div
              className="absolute inset-0 rounded-full pointer-events-none border-[2px]"
              style={{
                clipPath: "polygon(0 0, 100% 0, 0 100%)",
                borderColor: "#9CA3AF",
              }}
            />
            {/* Bottom-right triangle (darker border) */}
            <div
              className="absolute inset-0 rounded-full pointer-events-none border-[2px]"
              style={{
                clipPath: "polygon(100% 100%, 0 100%, 100% 0)",
                borderColor: "#4B5563",
              }}
            />
          </h1>
        </div>
      </div>
    </div>
  );
};

export default Hero;
