"use client";

import React from "react";
import Heading from "../shared/Heading";
import CompletePageFooterMessage from "../shared/CompletePageFooterMessage";
import PowerWordsPulse from "./PowerWordsPulse";
import PrecisionDrill from "./PrecisionDrill";
import ContextSpin from "./ContextSpin";
import FlowChain from "./FlowChain";
import PresentationHero from "./PresentationHero";

const PresentationContent = () => {
  return (
    <div>
      <PresentationHero />

      <div className="py-20 bg-section-dark">
        <div className="app-container flex flex-col gap-12 w-full">
          {/* Heading */}
          <Heading
            heading="Presentation"
            subheading="Complete each task to improve your presentation skill"
            specialText="Tasks"
            align="left"
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <PowerWordsPulse />
            <PrecisionDrill />
            <ContextSpin />
            <FlowChain />
          </div>

          <CompletePageFooterMessage text="“Great job Raju! You finished today’s presentation session." />
        </div>
      </div>
    </div>
  );
};

export default PresentationContent;
