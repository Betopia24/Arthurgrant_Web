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
import { useAppSelector } from "@/redux/hooks";
import CompletePageFooterMessage from "@/components/shared/CompletePageFooterMessage";
import { apiRequest } from "@/lib/apiRequest";
import toast from "react-hot-toast";

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
  submit: boolean;
};

type ErrorState = {
  powerWords: string | null;
  scenarios: string | null;
  contextData: string | null;
  flowChainData: string | null;
  submit: string | null;
};

const PresentationContent = () => {
  const { task_1, task_2, task_3, task_4 } = useAppSelector(
    (state) => state.presentation
  );
  const [powerWords, setPowerWords] = useState<string[]>([]);
  const [scenarios, setScenarios] = useState<ScenariosTypes | null>(null);
  const [contextData, setContextData] = useState<ContextDataType | null>(null);
  const [flowChainData, setFlowChainData] = useState<string[]>([]);

  const [loading, setLoading] = useState<LoadingState>({
    powerWords: false,
    scenarios: false,
    contextData: false,
    flowChainData: false,
    submit: false,
  });

  const [errors, setErrors] = useState<ErrorState>({
    powerWords: null,
    scenarios: null,
    contextData: null,
    flowChainData: null,
    submit: null,
  });

  const allCompleted =
    task_1?.isComplete &&
    task_2?.isComplete &&
    task_3?.isComplete &&
    task_4?.isComplete;

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
        powerWords: "Failed to load power words. Please try again.",
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
      setErrors((prev) => ({
        ...prev,
        scenarios: "Failed to load scenarios. Please try again.",
      }));
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
        contextData: "Failed to load context data. Please try again.",
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
        flowChainData: "Failed to load flow chain. Please try again.",
      }));
    } finally {
      setLoading((prev) => ({ ...prev, flowChainData: false }));
    }
  };

  useEffect(() => {
    // Fetch initial data
    fetchPowerWords();
  }, []);

  useEffect(() => {
    if (task_1.isComplete) {
      fetchScenarios();
    }
  }, [task_1.isComplete]);

  useEffect(() => {
    if (task_2.isComplete) {
      fetchContext();
    }
  }, [task_2.isComplete]);

  useEffect(() => {
    if (task_3.isComplete) {
      fetchFlowChainData();
    }
  }, [task_3.isComplete]);

  const handleSubmit = async () => {
    try {
      setLoading((prev) => ({ ...prev, submit: true }));
      setErrors((prev) => ({ ...prev, submit: null }));

      const body = {
        tasks: [
          task_1.feedback,
          task_2.feedback,
          task_3.feedback,
          task_4.feedback,
        ],
      };
      const res = await apiRequest("/presentation/submit", "POST", body);
      console.log("check presentation submit", res);
      toast.success(res.message || "Presentation submitted successfully");
    } catch (error: any) {
      console.error(error);
      setErrors((prev) => ({
        ...prev,
        submit: "Failed to submit presentation. Please try again.",
      }));
      toast.error(
        error.error ||
          error.data.message ||
          "Failed to submit presentation. Please try again."
      );
    } finally {
      setLoading((prev) => ({ ...prev, submit: false }));
    }
  };

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
            <PowerWordsPulse
              powerWords={powerWords}
              error={errors.powerWords}
              loading={loading.powerWords}
            />

            {/* Precision Drill */}
            <PrecisionDrill
              scenarios={scenarios}
              error={errors.scenarios}
              loading={loading.scenarios}
              isTask1Complete={task_1.isComplete}
            />

            {/* Context Spin */}
            <ContextSpin
              contextData={contextData}
              error={errors.contextData}
              loading={loading.contextData}
              isTask2Complete={task_2.isComplete}
            />

            {/* Flow Chain */}
            <FlowChain
              scenarios={flowChainData}
              error={errors.flowChainData}
              loading={loading.flowChainData}
              isTask3Complete={task_3.isComplete}
            />
          </div>

          <button
            onClick={handleSubmit}
            disabled={loading.submit || !allCompleted}
            className={`px-12 py-4 font-semibold text-lg rounded-xl ${
              !allCompleted || loading.submit
                ? "bg-[#828882] opacity-50 cursor-not-allowed"
                : "bg-gradient-to-r from-yellow-400 to-pink-500 text-white cursor-pointer hover:opacity-90 transition-opacity"
            }`}>
            {loading.submit
              ? "Submitting presentation..."
              : " Submit All Answers"}
          </button>

          {allCompleted && <CompletePageFooterMessage text="Done" />}
        </div>
      </div>
    </div>
  );
};

export default PresentationContent;
