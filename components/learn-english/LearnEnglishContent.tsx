"use client";

import React from "react";
import LearnEnglishHero from "./LearnEnglishHero";
import Heading from "../shared/Heading";

const LearnEnglishContent = () => {
  return (
    <div className="min-h-screen bg-section-dark">
      <LearnEnglishHero />

      <div className="py-12 lg:py-20">
        <div className="app-container flex flex-col gap-8 lg:gap-12 w-full">
          {/* Header with Progress */}
          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6">
            <Heading
              heading="Adult Language Learning Tasks"
              subheading="Complete each task to improve your english"
              specialText="Tasks"
              align="left"
            />

            {/* Tasks Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LearnEnglishContent;
