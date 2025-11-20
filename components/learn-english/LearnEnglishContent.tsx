"use client";

import React from "react";
import LearnEnglishHero from "./LearnEnglishHero";
import Heading from "../shared/Heading";
import AuditoryDiscrimination from "./AuditoryDiscrimination";
import PhonemeGraphemeMapping from "./PhonemeGraphemeMapping";
import WordFlash from "./WordFlash";
import WordPartsWorkshop from "./WordPartsWorkshop";
import PhraseMaker from "./PhraseMaker";
import SentenceBuilder from "./SentenceBuilder";
import CompletePageFooterMessage from "../shared/CompletePageFooterMessage";

const LearnEnglishContent = () => {
  return (
    <div className="min-h-screen bg-section-dark">
      <LearnEnglishHero />

      <div className="py-12 lg:py-20">
        <div className="app-container flex flex-col gap-8 lg:gap-12 w-full">
          {/* Header with Progress */}
          <Heading
            heading="Adult Language Learning Tasks"
            subheading="Complete each task to improve your english"
            specialText="Tasks"
            align="left"
          />

          {/* Tasks Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
            <AuditoryDiscrimination />
            <PhonemeGraphemeMapping />
            <WordFlash />
            <WordPartsWorkshop />
            <PhraseMaker />
            <SentenceBuilder />
          </div>

          <CompletePageFooterMessage text="Congratulations! You've completed all presentation tasks for today. Your progress is outstanding!" />
        </div>
      </div>
    </div>
  );
};

export default LearnEnglishContent;
