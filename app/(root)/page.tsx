"use client";
import React, { useState, useRef, useEffect } from "react";
import FAQ from "@/components/landing/FAQ";
import Features from "@/components/landing/Features";
import Hero from "@/components/landing/Hero";
import LearningProgress from "@/components/landing/LearningProgress";
import Pricing from "@/components/landing/Pricing";
import Review from "@/components/landing/Review";
import About from "@/components/landing/About";
import DownloadApp from "@/components/landing/DownloadApp";
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

  // ⬇️ Intro states (start hidden)
  const [showIntroVideo, setShowIntroVideo] = useState(false);
  const [showIntroLogo, setShowIntroLogo] = useState(false);
  const [showLanguagePopup, setShowLanguagePopup] = useState(false);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const introVideoRef = useRef<HTMLVideoElement | null>(null);

  /* ===============================
     OPTION-1: FIRST VISIT ONLY
  =============================== */
  useEffect(() => {
    const hasSeenIntro = localStorage.getItem("manifex_has_seen_intro");
    if (!hasSeenIntro) {
      setShowIntroLogo(true);
    }
  }, []);

  /* Logo → Intro video transition */
  useEffect(() => {
    if (showIntroLogo) {
      const timer = setTimeout(() => {
        setShowIntroLogo(false);
        setShowIntroVideo(true);
      }, 1500);

      return () => clearTimeout(timer);
    }
  }, [showIntroLogo]);

  /* ===============================
     MUSIC CONTROLS
  =============================== */
  const playMusic = () => {
    if (audioRef.current && !isMusicPlaying) {
      audioRef.current
        .play()
        .then(() => setIsMusicPlaying(true))
        .catch(() => setShowMusicPopup(true));
    }
  };

  const stopMusic = () => {
    if (audioRef.current && isMusicPlaying) {
      audioRef.current.pause();
      setIsMusicPlaying(false);
    }
  };

  const toggleMusic = () => {
    if (!audioRef.current) return;

    if (isMusicPlaying) {
      audioRef.current.pause();
      setIsMusicPlaying(false);
    } else {
      audioRef.current.play().then(() => setIsMusicPlaying(true));
    }
    setShowMusicPopup(false);
  };

  /* ===============================
     INTRO VIDEO HANDLERS
  =============================== */
  const handleIntroVideoEnd = () => {
    localStorage.setItem("manifex_has_seen_intro", "true");
    setShowIntroVideo(false);

    if (!hasSelectedLanguage) {
      setShowLanguagePopup(true);
    } else {
      setIsVideoModalOpen(true);
    }
  };

  const handleSkipIntro = () => {
    localStorage.setItem("manifex_has_seen_intro", "true");

    if (introVideoRef.current) {
      introVideoRef.current.pause();
    }

    setShowIntroVideo(false);

    if (!hasSelectedLanguage) {
      setShowLanguagePopup(true);
    } else {
      setIsVideoModalOpen(true);
    }
  };

  /* ===============================
     LANGUAGE HANDLERS
  =============================== */
  const handleLanguageSelect = (languageCode: string) => {
    setLanguage(languageCode);
    setShowLanguagePopup(false);
    setIsVideoModalOpen(true);
  };

  const handleLanguagePopupClose = () => {
    setShowLanguagePopup(false);
    if (!hasSelectedLanguage) {
      setLanguage("en");
    }
    setIsVideoModalOpen(true);
  };

  /* ===============================
     HERO VIDEO HANDLERS
  =============================== */
  const handleVideoEnd = () => {
    setIsVideoModalOpen(false);
    playMusic();
  };

  const handleVideoModalOpen = () => {
    setIsVideoModalOpen(true);
    stopMusic();
    setShowMusicPopup(false);
  };

  const handleVideoModalClose = () => {
    setIsVideoModalOpen(false);
    playMusic();
  };

  /* Disable scroll during overlays */
  useEffect(() => {
    if (
      showIntroVideo ||
      showLanguagePopup ||
      isVideoModalOpen ||
      showIntroLogo
    ) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [showIntroVideo, showLanguagePopup, isVideoModalOpen, showIntroLogo]);

  /* Auto-play music on mount or after overlays are closed */
  useEffect(() => {
    if (
      !showIntroVideo &&
      !showLanguagePopup &&
      !showIntroLogo &&
      !isVideoModalOpen
    ) {
      playMusic();
    }
  }, [showIntroVideo, showLanguagePopup, showIntroLogo, isVideoModalOpen]);

  return (
    <>
      {/* Hidden audio */}
      <audio ref={audioRef} loop src="/bg-music-01.mp3" preload="auto" />

      {/* LOGO INTRO */}
      {showIntroLogo && (
        <div className="fixed inset-0 z-50 bg-black flex items-center justify-center">
          <div className="text-center animate__animated animate__fadeIn animate__slow">
            <div className="flex flex-col items-center gap-8">
              <img
                src="/manifex-logo-02.png"
                alt="Manifex Logo"
                className="h-32 md:h-48 drop-shadow-2xl animate__animated animate__zoomIn animate__delay-1s"
              />
              <h1 className="text-6xl md:text-8xl uppercase font-extrabold bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500 bg-clip-text text-transparent tracking-tight animate__animated animate__fadeInUp animate__delay-2s">
                Manifex
              </h1>
            </div>
          </div>
        </div>
      )}

      {/* INTRO VIDEO */}
      {showIntroVideo && (
        <div
          className="fixed inset-0 z-50 bg-black flex items-center justify-center cursor-pointer"
          onClick={handleSkipIntro}>
          <video
            ref={introVideoRef}
            autoPlay
            muted
            onEnded={handleIntroVideoEnd}
            className="w-full h-full object-cover">
            <source src="/intro-01.mp4" type="video/mp4" />
          </video>

          <button
            className="absolute top-4 right-4 bg-black/50 text-white px-4 py-2 rounded-lg hover:bg-black/70 transition-colors"
            onClick={handleSkipIntro}>
            Skip
          </button>
        </div>
      )}

      {/* LANGUAGE POPUP */}
      {showLanguagePopup && (
        <LanguagePopup
          isOpen={showLanguagePopup}
          onClose={handleLanguagePopupClose}
          onLanguageSelect={handleLanguageSelect}
        />
      )}

      {/* MAIN CONTENT */}
      {!showIntroVideo && !showLanguagePopup && !showIntroLogo && (
        <div style={{ minHeight: "100vh", cursor: "default" }}>
          <Hero
            onVideoEnd={handleVideoEnd}
            onVideoModalOpen={handleVideoModalOpen}
            onVideoModalClose={handleVideoModalClose}
          />
          <Features />
          <About />
          <Review />
          <Pricing />
          <FAQ />
          <DownloadApp />

          {!isVideoModalOpen && (
            <div className="fixed bottom-4 right-4 z-50">
              {showMusicPopup && (
                <div className="absolute bottom-16 right-0 mb-4 w-64 p-4 bg-gradient-to-br from-[#28284A] via-[#28284A] to-[#12122A] text-white rounded-lg shadow-xl border border-gray-500">
                  <div className="text-sm text-gray-100 mb-2 font-medium tracking-wide">
                    Enjoy background music while you explore?
                  </div>
                </div>
              )}

              <button
                onClick={toggleMusic}
                className="bg-gradient-brand-btn text-white p-2 border rounded-full shadow-lg">
                {isMusicPlaying ? <Volume2 /> : <VolumeOff />}
              </button>
            </div>
          )}
        </div>
      )}
    </>
  );
}
