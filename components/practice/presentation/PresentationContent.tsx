"use client";

import React, { useEffect, useState } from "react";

import PowerWordsPulse from "./PowerWordsPulse";
import PrecisionDrill from "./PrecisionDrill";
import ContextSpin from "./ContextSpin";
import FlowChain from "./FlowChain";
import PracticeHero from "../PracticeHero2";
import Heading from "@/components/shared/Heading";
import "./gradient-button.css";
import { aiRequest } from "@/lib/aiRequest";
import TaskLoadingLock from "../TaskLoadingLock";

type ScenariosTypes = {
  slow: string[];
  medium: string[];
  fast: string[];
};
interface ContextDataType {
  words: string[];
  scenario: string;
}

type LoadingState = {
  powerWords: boolean;
  scenarios: boolean;
  contextData: boolean;
  flowChainData: boolean;
};

type ErrorState = {
  powerWords: string | null;
  scenarios: string | null;
  contextData: string | null;
  flowChainData: string | null;
};

const PresentationContent = () => {
  const [powerWords, setPowerWords] = useState<string[]>([]);
  const [scenarios, setScenarios] = useState<ScenariosTypes | null>(null);
  const [contextData, setContextData] = useState<ContextDataType | null>(null);
  const [flowChainData, setFlowChainData] = useState<string[]>([]);

  const [loading, setLoading] = useState<LoadingState>({
    powerWords: true,
    scenarios: true,
    contextData: true,
    flowChainData: true,
  });

  const [errors, setErrors] = useState<ErrorState>({
    powerWords: null,
    scenarios: null,
    contextData: null,
    flowChainData: null,
  });

  const fetchPowerWords = async () => {
    try {
      setLoading((prev) => ({ ...prev, powerWords: true }));
      setErrors((prev) => ({ ...prev, powerWords: null }));

      const data = await aiRequest(
        "/presentation/power-words/get_power_words",
        "GET"
      );
      setPowerWords(data);
    } catch (error) {
      console.error("Error fetching power words:", error);
      setErrors((prev) => ({
        ...prev,
        powerWords: "Failed to load power words",
      }));
    } finally {
      setLoading((prev) => ({ ...prev, powerWords: false }));
    }
  };

  const fetchScenarios = async () => {
    try {
      setLoading((prev) => ({ ...prev, scenarios: true }));
      setErrors((prev) => ({ ...prev, scenarios: null }));

      const data = await aiRequest(
        "/presentation/precision-drill/get_precision_drill",
        "GET"
      );
      setScenarios(data);
    } catch (error) {
      console.error("Error fetching scenarios:", error);
      setErrors((prev) => ({ ...prev, scenarios: "Failed to load scenarios" }));
    } finally {
      setLoading((prev) => ({ ...prev, scenarios: false }));
    }
  };

  const fetchContext = async () => {
    try {
      setLoading((prev) => ({ ...prev, contextData: true }));
      setErrors((prev) => ({ ...prev, contextData: null }));

      const data = await aiRequest(
        "/presentation/context-spin/get_context_spin",
        "GET"
      );
      setContextData(data);
    } catch (error) {
      console.error("Error fetching context data:", error);
      setErrors((prev) => ({
        ...prev,
        contextData: "Failed to load context data",
      }));
    } finally {
      setLoading((prev) => ({ ...prev, contextData: false }));
    }
  };

  const fetchFlowChainData = async () => {
    try {
      setLoading((prev) => ({ ...prev, flowChainData: true }));
      setErrors((prev) => ({ ...prev, flowChainData: null }));

      const data = await aiRequest(
        "/presentation/flow-chain/get_flow_chain",
        "GET"
      );
      setFlowChainData(data);
    } catch (error) {
      console.error("Error fetching flow chain data:", error);
      setErrors((prev) => ({
        ...prev,
        flowChainData: "Failed to load flow chain",
      }));
    } finally {
      setLoading((prev) => ({ ...prev, flowChainData: false }));
    }
  };

  useEffect(() => {
    // Fetch all data in parallel
    Promise.all([
      fetchPowerWords(),
      fetchScenarios(),
      fetchContext(),
      fetchFlowChainData(),
    ]);
  }, []);

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
            {/* Power Words Pulse */}
            {loading.powerWords ? (
              <TaskLoadingLock
                variant="loading"
                title="Power Words Loading..."
              />
            ) : errors.powerWords ? (
              <TaskLoadingLock
                variant="error"
                title="Failed to Load Power Words"
                onRetry={fetchPowerWords}
              />
            ) : (
              <PowerWordsPulse powerWords={powerWords} />
            )}

            {/* Precision Drill */}
            {loading.scenarios ? (
              <TaskLoadingLock
                variant="loading"
                title="Precision Drill Loading..."
              />
            ) : errors.scenarios ? (
              <TaskLoadingLock
                variant="error"
                title="Failed to Load Precision Drill"
                onRetry={fetchScenarios}
              />
            ) : (
              <PrecisionDrill scenarios={scenarios!} />
            )}

            {/* Context Spin */}
            {loading.contextData ? (
              <TaskLoadingLock
                variant="loading"
                title="Context Spin Loading..."
              />
            ) : errors.contextData ? (
              <TaskLoadingLock
                variant="error"
                title="Failed to Load Context Spin"
                onRetry={fetchContext}
              />
            ) : (
              <ContextSpin contextData={contextData!} />
            )}

            {/* Flow Chain */}
            {loading.flowChainData ? (
              <TaskLoadingLock
                variant="loading"
                title="Flow Chain Loading..."
              />
            ) : errors.flowChainData ? (
              <TaskLoadingLock
                variant="error"
                title="Failed to Load Flow Chain"
                onRetry={fetchFlowChainData}
              />
            ) : (
              <FlowChain scenarios={flowChainData} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PresentationContent;
