"use client";
import React, { useState, useRef, useEffect } from "react";
import FAQ from "@/components/landing/FAQ";
import Features from "@/components/landing/Features";
import Hero from "@/components/landing/Hero";
import LearningProgress from "@/components/landing/LearningProgress";
import Pricing from "@/components/landing/Pricing";
import Review from "@/components/landing/Review";
import About from "@/components/landing/About";
import LanguagePopup from "@/components/shared/LanguagePopup";
import { Volume2, VolumeOff } from "lucide-react";
import { useLanguageStore } from "@/stores/languageStore";
import Image from "next/image";

export default function Home() {
  const { preferredLang, hasSelectedLanguage, setLanguage } =
    useLanguageStore();
  const [isMusicPlaying, setIsMusicPlaying] = useState(false);
  const [showMusicPopup, setShowMusicPopup] = useState(false);
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);
  const [showIntroVideo, setShowIntroVideo] = useState(false); // ← changed: starts hidden
  const [showIntroLogo, setShowIntroLogo] = useState(true);     // ← logo shows first
  const [showLanguagePopup, setShowLanguagePopup] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const introVideoRef = useRef<HTMLVideoElement | null>(null);

  // Auto-hide logo after ~2.5s and then show intro video
  useEffect(() => {
    if (showIntroLogo) {
      const timer = setTimeout(() => {
        setShowIntroLogo(false);
        setShowIntroVideo(true); // ← now start the video
      }, 1500); // adjust duration if you want logo longer/shorter

      return () => clearTimeout(timer);
    }
  }, [showIntroLogo]);

  // Auto-play music when video modal closes
  const playMusic = () => {
    if (audioRef.current && !isMusicPlaying) {
      audioRef.current
        .play()
        .then(() => {
          setIsMusicPlaying(true);
          console.log("Music auto-started");
        })
        .catch((error) => {
          console.log("Auto-play failed:", error);
          setShowMusicPopup(true);
        });
    }
  };

  // Stop music when video modal opens
  const stopMusic = () => {
    if (audioRef.current && isMusicPlaying) {
      audioRef.current.pause();
      setIsMusicPlaying(false);
      console.log("Music stopped");
    }
  };

  const toggleMusic = () => {
    if (audioRef.current) {
      if (isMusicPlaying) {
        audioRef.current.pause();
        setIsMusicPlaying(false);
      } else {
        audioRef.current
          .play()
          .then(() => setIsMusicPlaying(true))
          .catch((error) => {
            console.log("Play failed:", error);
          });
      }
    }
    setShowMusicPopup(false);
  };

  // Handle intro video end - Show language popup
  const handleIntroVideoEnd = () => {
    console.log("Intro video ended");
    setShowIntroVideo(false);
    // Show language popup only if no language selected yet
    if (!hasSelectedLanguage) {
      setShowLanguagePopup(true);
    } else {
      // If language already selected, go directly to hero section
      setIsVideoModalOpen(true);
    }
  };

  // Handle intro video skip
  const handleSkipIntro = () => {
    if (introVideoRef.current) {
      introVideoRef.current.pause();
    }
    setShowIntroVideo(false);
    // Show language popup only if no language selected yet
    if (!hasSelectedLanguage) {
      setShowLanguagePopup(true);
    } else {
      // If language already selected, go directly to hero section
      setIsVideoModalOpen(true);
    }
  };

  // Language selection handler
  const handleLanguageSelect = (languageCode: string) => {
    console.log("Language selected:", languageCode);
    setLanguage(languageCode);
    setShowLanguagePopup(false);
    // After language selection, show the hero section video
    setIsVideoModalOpen(true);
  };

  // Handle language popup close
  const handleLanguagePopupClose = () => {
    setShowLanguagePopup(false);
    // If user closes without selecting, default to English
    if (!hasSelectedLanguage) {
      setLanguage("en");
    }
    // After language popup closes, show the hero section video
    setIsVideoModalOpen(true);
  };

  const handleVideoEnd = () => {
    console.log("Hero video ended, auto-playing music");
    setIsVideoModalOpen(false);
    playMusic();
  };

  const handleVideoModalOpen = () => {
    console.log("Hero video modal opened, stopping music");
    setIsVideoModalOpen(true);
    stopMusic();
    setShowMusicPopup(false);
  };

  const handleVideoModalClose = () => {
    console.log("Hero video modal closed, auto-playing music");
    setIsVideoModalOpen(false);
    playMusic();
  };

  // Disable scroll when intro video or language popup is showing
  useEffect(() => {
    if (showIntroVideo || showLanguagePopup || isVideoModalOpen || showIntroLogo) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [showIntroVideo, showLanguagePopup, isVideoModalOpen, showIntroLogo]);

  return (
    <>
      {/* Hidden audio element */}
      <audio ref={audioRef} loop src="/bg-music-01.mp3" preload="auto" />

      {/* Beautiful Logo Intro - Shows FIRST */}
      {showIntroLogo && (
        <div className="fixed inset-0 z-50 bg-black flex items-center justify-center">
          <div className="text-center animate__animated animate__fadeIn animate__slow">
            <div className="flex flex-col items-center gap-8">
              <img
                src="/manifex-logo-02.png"
                alt="Manifex Logo"
                className="h-32 md:h-48 drop-shadow-2xl animate__animated animate__zoomIn animate__delay-1s"
              />
              <h1 className="text-6xl md:text-8xl font-extrabold bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500 bg-clip-text text-transparent tracking-tight animate__animated animate__fadeInUp animate__delay-2s">
                Manifex
              </h1>
            </div>
          </div>
        </div>
      )}

      {/* Full-screen Intro Video -> Shows SECOND (after logo) */}
      {showIntroVideo && (
        <div
          className="fixed inset-0 z-50 bg-black flex items-center justify-center cursor-pointer"
          onClick={handleSkipIntro}
        >
          <video
            ref={introVideoRef}
            autoPlay
            muted
            onEnded={handleIntroVideoEnd}
            className="w-full h-full object-cover"
          >
            <source src="/intro-01.mp4" type="video/mp4" />
            Your browser does not support the video tag.
          </video>
          {/* Skip button */}
          <button
            className="absolute top-4 right-4 bg-black/50 text-white px-4 py-2 rounded-lg hover:bg-black/70 transition-colors cursor-pointer"
            onClick={handleSkipIntro}
          >
            Skip
          </button>
        </div>
      )}

      {/* Language Selection Popup -> Shows AFTER intro video */}
      {showLanguagePopup && (
        <LanguagePopup
          isOpen={showLanguagePopup}
          onClose={handleLanguagePopupClose}
          onLanguageSelect={handleLanguageSelect}
        />
      )}

      {/* Main Landing Page Content -> Shows AFTER language selection */}
      {!showIntroVideo && !showLanguagePopup && !showIntroLogo && (
        <div style={{ minHeight: "100vh", cursor: "default" }}>
          <Hero
            onVideoEnd={handleVideoEnd}
            onVideoModalOpen={handleVideoModalOpen}
            onVideoModalClose={handleVideoModalClose}
          />
          <Features />
          {/* <LearningProgress /> */}
          <About />
          <Review />
          <Pricing />
          <FAQ />

          {/* Music toggle button - Only visible when video modal is closed */}
          {!isVideoModalOpen && (
            <div className="fixed bottom-4 right-4 z-50">
              {showMusicPopup && (
                <div className="absolute bottom-16 right-0 mb-4 w-64 p-4 bg-gradient-to-br from-[#28284A] via-[#28284A] to-[#12122A] text-white rounded-lg shadow-xl border border-gray-500">
                  <div className="text-sm text-gray-100 mb-2 font-medium tracking-wide">
                    Enjoy background music while you explore?
                  </div>
                  <div className="absolute -bottom-10 right-8">
                    <svg
                      width="50"
                      height="40"
                      viewBox="0 0 50 40"
                      className="text-gray-400"
                    >
                      <path
                        d="M 0,0 Q 25,25 50,40"
                        stroke="currentColor"
                        strokeWidth="2"
                        fill="none"
                      />
                    </svg>
                  </div>
                </div>
              )}
              <button
                onClick={toggleMusic}
                className="bg-gradient-brand-btn text-white p-2 border rounded-full transition-colors shadow-lg cursor-pointer"
                title={isMusicPlaying ? "Mute music" : "Play music"}
              >
                {isMusicPlaying ? <Volume2 /> : <VolumeOff />}
              </button>
            </div>
          )}
        </div>
      )}
    </>
  );
}