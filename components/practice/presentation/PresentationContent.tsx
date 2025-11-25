"use client";

import React from "react";

import PowerWordsPulse from "./PowerWordsPulse";
import PrecisionDrill from "./PrecisionDrill";
import ContextSpin from "./ContextSpin";
import FlowChain from "./FlowChain";
import PracticeHero from "../PracticeHero2";
import Heading from "@/components/shared/Heading";
import "./gradient-button.css";
const PresentationContent = () => {
  return (
    <div className="min-h-screen bg-section-dark">
      <PracticeHero
        heading="Today's Presentation Practice"
        subheading="Master your delivery with Mercury's AI-powered coaching."
        specialText="Practice"
        align="center"
        greetText="Hi Raju!"
        streakValue="6"
        sessionTime="12:34"
        progressValue="2/4"
        goalValue="75%"
        sessionProgressWidth="60%"
        progressWidth="40%"
        goalWidth="70%"
      />

      <div className="py-12 lg:py-20">
        <div className="app-container flex flex-col gap-8 lg:gap-12 w-full">
          {/* Header with Progress */}
          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6">
            <Heading
              heading="Presentation Tasks"
              subheading="Complete each task to improve your presentation skills"
              specialText="Tasks"
              align="left"
            />
          </div>

          {/* Tasks Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
            <PowerWordsPulse />
            <PrecisionDrill />
            <ContextSpin />
            <FlowChain />
          </div>
        </div>
      </div>
    </div>
  );
};

export default PresentationContent;
