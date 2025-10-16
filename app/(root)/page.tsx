"use client";

import React, { useState, useRef, useEffect } from "react";
import FAQ from "@/components/landing/FAQ";
import Features from "@/components/landing/Features";
import Hero from "@/components/landing/Hero";
import LearningProgress from "@/components/landing/LearningProgress";
import Pricing from "@/components/landing/Pricing";
import IntroVideo from "@/components/landing/IntroVideo";
import Review from "@/components/landing/Review";
import About from "@/components/landing/About";
import { Volume2, VolumeOff } from "lucide-react";

export default function Home() {
  const [isVideoFinished, setIsVideoFinished] = useState(false);
  const [isMusicPlaying, setIsMusicPlaying] = useState(false);
  const [showAudioButton, setShowAudioButton] = useState(false);
  const [audioInitialized, setAudioInitialized] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const hasUserInteracted = useRef(false);
  const volumeButtonRef = useRef<HTMLButtonElement>(null);

  const handleVideoEnd = () => {
    console.log("Video ended");
    setIsVideoFinished(true);
    setShowAudioButton(true); // Show the audio button once the video ends
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
  };

  // Initialize audio with user interaction (after video ends)
  const initializeAudio = () => {
    if (!audioRef.current || audioInitialized) return;

    console.log("Initializing audio...");

    // Set volume to a reasonable level
    audioRef.current.volume = 0.7;

    // Try to play audio
    audioRef.current
      .play()
      .then(() => {
        console.log("Audio started successfully!");
        setIsMusicPlaying(true);
        setAudioInitialized(true);
      })
      .catch((error) => {
        console.log("Audio play failed:", error);
        setIsMusicPlaying(false);
        setAudioInitialized(true);
      });
  };

  // Handle user interaction
  const handleUserInteraction = (event: React.MouseEvent | MouseEvent) => {
    // Only trigger audio if user interacts after video ends and volume button is visible
    if (!hasUserInteracted.current && isVideoFinished && showAudioButton) {
      console.log("User interaction detected, initializing audio...");

      hasUserInteracted.current = true;
      initializeAudio();
    }
  };

  useEffect(() => {
    if (isVideoFinished && !audioInitialized) {
      console.log("Waiting for user interaction after video ends");

      // Add event listeners for user interaction
      const handleClick = (e: MouseEvent) => handleUserInteraction(e);

      // Listen for clicks on the document to trigger the audio if user clicks anywhere outside the volume button
      document.addEventListener("click", handleClick);

      return () => {
        document.removeEventListener("click", handleClick);
      };
    }
  }, [isVideoFinished, audioInitialized]);

  return (
    <>
      {/* Display the intro video initially */}
      {!isVideoFinished && <IntroVideo onEnd={handleVideoEnd} />}

      {/* Hidden audio element */}
      <audio ref={audioRef} loop src="/intro.mp3" preload="auto" />

      {isVideoFinished && (
        <>
          {/* Music toggle button - only show after video ends */}
          {showAudioButton && (
            <button
              ref={volumeButtonRef}
              onClick={toggleMusic}
              className="fixed bottom-4 right-4 z-50 bg-gradient-brand-btn text-white p-2 border rounded-full transition-colors shadow-lg cursor-pointer"
              title={isMusicPlaying ? "Mute music" : "Play music"}
            >
              {isMusicPlaying ? <Volume2 /> : <VolumeOff />}
            </button>
          )}

          {/* Landing page content */}
          <div
            style={{ minHeight: "100vh", cursor: "default" }}
            onClick={handleUserInteraction} // Only need to track clicks here after video ends
            onMouseMove={handleUserInteraction} // Optional: track mousemove if you prefer
          >
            <Hero />
            <Features />
            <LearningProgress />
            <About />
            <Review />
            <Pricing />
            <FAQ />
          </div>
        </>
      )}
    </>
  );
}
