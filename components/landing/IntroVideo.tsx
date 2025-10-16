"use client";
import React, { useState } from "react";

const IntroVideo = ({ onEnd }: { onEnd: () => void }) => {
  const [isVideoFinished, setIsVideoFinished] = useState(false);

  const handleVideoEnd = () => {
    setIsVideoFinished(true);
    onEnd(); // Notify parent that the video has ended
  };

  return (
    <div
      className={`fixed inset-0 bg-black flex items-center justify-center transition-opacity duration-300 ${
        isVideoFinished ? "opacity-0" : "opacity-100"
      }`}
      style={{ zIndex: 9999 }}
    >
      <video
        autoPlay
        muted
        onEnded={handleVideoEnd}
        className="w-full h-full object-cover"
      >
        <source src="/intro-01.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>
    </div>
  );
};

export default IntroVideo;
