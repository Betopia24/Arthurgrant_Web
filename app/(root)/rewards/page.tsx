import React from "react";
import RewardVideo from "@/components/reward-video/RewardVideo";

export default function page() {
  return (
    <div className="min-h-screen py-20 bg-brand-darker">
      <div className="app-container flex flex-col items-center gap-12">
        {/* Featuring Video */}
        <div className="mt-4 sm:mt-6" />
        <RewardVideo />
      </div>
    </div>
  );
}
