"use client";

import React from "react";
import Heading from "../shared/Heading";
import { FaFire, FaClock, FaChartLine, FaBullseye } from "react-icons/fa";

const PracticeHero = () => {
  return (
    <div className="pt-28 pb-24 sm:pt-36 sm:pb-24 bg-gradient-to-br from-brand-dark via-brand-darker to-brand-darker">
      <div className="app-container flex flex-col items-center gap-12">
        {/* Heading */}
        <Heading
          heading="Today's Reading Adventure"
          subheading="Complete each challenge, unlock rewards, and become a stronger reader!"
          specialText="Adventure"
          align="center"
        />

        {/* Avatar + Comment Box */}
        <div className="mt-6 mx-auto max-w-7xl flex flex-col md:flex-row items-center gap-10 w-full">
          {/* Avatar */}
          <div className="relative w-40 h-40">
            {/* Gradient border */}
            <div className="absolute inset-0 rounded-full bg-gradient-to-r from-gradient-from via-gradient-via to-gradient-to p-1">
              {/* Inner circle to hold the image */}
              <div className="bg-black rounded-full w-full h-full overflow-hidden">
                <img
                  src="/avatar.png"
                  alt="Avatar"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>

          {/* Comment Box */}
          <div className="flex-1 relative bg-gradient-to-b from-[#28284A] to-[#12122A] p-8 rounded-2xl shadow-lg text-white">
            {/* Triangle arrow */}
            <div className="absolute -left-4 top-1/2 transform -translate-y-1/2 w-0 h-0 border-t-8 border-b-8 border-r-8 border-t-transparent border-b-transparent border-r-gray-900"></div>

            <h1 className="text-lg sm:text-xl lg:text-3xl font-semibold mb-2">
              <span className="text-gradient">Hi Raju!</span> Welcome Back
            </h1>
            <p className="text-gray-300 text-sm sm:text-base lg:text-lg">
              I'm Mercury, your AI reading companion. Today we'll practice
              reading together with some exciting challenges. Are you ready to
              unlock your potential?
            </p>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 w-full">
          {/* Streak Card */}
          <div className="flex flex-col gap-2 bg-gradient-to-br from-[#28284A] to-[#12122A] text-white p-6 rounded-xl shadow-lg">
            <div className="flex items-center justify-between gap-3">
              <div className="p-3 rounded-full bg-gradient-to-r from-yellow-300 to-yellow-600 flex items-center justify-center">
                <FaFire className="text-white text-xl" />
              </div>
              <span className="text-base font-semibold">Streak</span>
            </div>
            <div className="mt-3 text-3xl font-bold text-center text-white">
              6
            </div>
            <div className="text-center text-base sm:text-lg font-semibold">
              Days Streak!
            </div>
            <div className="text-center text-base font-semibold bg-clip-text text-transparent bg-gradient-to-r from-yellow-400 to-yellow-600">
              Keep it up!
            </div>
          </div>

          {/* Session Timer */}
          <div className="flex flex-col gap-2 bg-gradient-to-br from-[#28284A] to-[#12122A] text-white p-6 rounded-xl shadow-lg">
            <div className="flex items-center justify-between gap-3">
              <div className="p-3 rounded-full bg-gradient-to-r from-pink-300 to-pink-600 flex items-center justify-center">
                <FaClock className="text-white text-xl" />
              </div>
              <span className="text-base font-semibold">Session Timer</span>
            </div>
            <div className="mt-3 text-3xl font-bold text-center text-white">
              12:34
            </div>
            <div className="text-center text-base sm:text-lg font-semibold">
              Remaining
            </div>
            <div className="mt-3 w-full h-2 bg-gray-700 rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-pink-400 to-pink-600 w-[60%]"></div>
            </div>
          </div>

          {/* Progress */}
          <div className="flex flex-col gap-2 bg-gradient-to-br from-[#28284A] to-[#12122A] text-white p-6 rounded-xl shadow-lg">
            <div className="flex items-center justify-between gap-3">
              <div className="p-3 rounded-full bg-gradient-to-r from-sky-300 to-sky-600 flex items-center justify-center">
                <FaChartLine className="text-white text-xl" />
              </div>
              <span className="text-base font-semibold">Progress</span>
            </div>
            <div className="mt-3 text-3xl font-bold text-center text-white">
              2/4
            </div>
            <div className="text-center text-base sm:text-lg font-semibold">
              Remaining
            </div>
            <div className="mt-3 w-full h-2 bg-gray-700 rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-sky-400 to-sky-600 w-[40%]"></div>
            </div>
          </div>

          {/* Today's Goal */}
          <div className="flex flex-col gap-2 bg-gradient-to-br from-[#28284A] to-[#12122A] text-white p-6 rounded-xl shadow-lg">
            <div className="flex items-center justify-between gap-3">
              <div className="p-3 rounded-full bg-gradient-to-r from-green-300 to-green-600 flex items-center justify-center">
                <FaBullseye className="text-white text-xl" />
              </div>
              <span className="text-base font-semibold">Today's Goal</span>
            </div>
            <div className="mt-3 text-3xl font-bold text-center text-white">
              75%
            </div>
            <div className="text-center text-base sm:text-lg font-semibold">
              Accuracy
            </div>
            <div className="mt-3 w-full h-2 bg-gray-700 rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-green-400 to-green-600 w-[70%]"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PracticeHero;
