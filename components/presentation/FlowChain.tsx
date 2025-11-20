"use client";

import { Sparkles } from "lucide-react";
import React, { useState, useRef, useCallback } from "react";
import { FaMicrophone, FaMicrophoneSlash } from "react-icons/fa";
import FeedbackScore from "./FeedbackScore";
import { AIFeedback, PresentationTask } from "./PresentationContent";
import "./gradient-button.css";

interface FlowChainProps {
  onTaskUpdate: (taskId: string, progress: number, completed?: boolean) => void;
  onAIFeedback: (
    taskId: string,
    audioBlob: Blob,
    transcript: string
  ) => Promise<AIFeedback>;
  task?: PresentationTask;
}

const scenarios = [
  "Innovation",
  "Strategy",
  "Execution",
  "Vision",
  "Teamwork",
  "Impact",
  "Excellence",
  "Leadership",
  "Growth",
  "Transformation",
];

const FlowChain: React.FC<FlowChainProps> = ({
  onTaskUpdate,
  onAIFeedback,
  task,
}) => {
  const [selectedScenarios, setSelectedScenarios] = useState<Set<string>>(
    new Set()
  );
  const [isRecording, setIsRecording] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [feedback, setFeedback] = useState<AIFeedback | null>(null);
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(
    null
  );
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [recordingTime, setRecordingTime] = useState(0);
  const timerRef = useRef<NodeJS.Timeout>(null);

  const toggleScenario = (scenario: string) => {
    setSelectedScenarios((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(scenario)) {
        newSet.delete(scenario);
      } else if (newSet.size < 3) {
        // Limit to 3 scenarios
        newSet.add(scenario);
      }
      return newSet;
    });
  };

  const startRecording = async () => {
    if (selectedScenarios.size === 0) {
      alert("Please select at least one scenario to begin.");
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      const audioChunks: BlobPart[] = [];

      recorder.ondataavailable = (event) => {
        audioChunks.push(event.data);
      };

      recorder.onstop = () => {
        const blob = new Blob(audioChunks, { type: "audio/wav" });
        setAudioBlob(blob);
        stream.getTracks().forEach((track) => track.stop());

        // Update progress
        onTaskUpdate("4", 50);
      };

      recorder.start();
      setMediaRecorder(recorder);
      setIsRecording(true);
      setRecordingTime(0);

      // Start timer
      timerRef.current = setInterval(() => {
        setRecordingTime((prev) => prev + 1);
      }, 1000);
    } catch (error) {
      console.error("Error starting recording:", error);
      alert("Please allow microphone access to use this feature.");
    }
  };

  const stopRecording = () => {
    if (mediaRecorder && isRecording) {
      mediaRecorder.stop();
      setIsRecording(false);
      setMediaRecorder(null);

      // Stop timer
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    }
  };

  const handleAICheck = async () => {
    if (!audioBlob) {
      alert("Please record your speech first.");
      return;
    }

    setIsLoading(true);
    try {
      const transcript = `Continuous speech connecting scenarios: ${Array.from(
        selectedScenarios
      ).join(", ")}...`;
      const feedback = await onAIFeedback("4", audioBlob, transcript);
      setFeedback(feedback);
    } catch (error) {
      console.error("Error getting AI feedback:", error);
      alert("Failed to get AI feedback. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <div className="p-6 bg-[#FFFFFF1F] border border-white/15 rounded-2xl flex flex-col gap-6 w-full">
      <div className="flex items-center justify-between">
        <h1 className="font-semibold text-2xl text-white">Flow Chain</h1>
        {task && (
          <div
            className={`px-3 py-1 rounded-full text-sm font-medium ${
              task.completed
                ? "bg-green-500/20 text-green-400"
                : "bg-blue-500/20 text-blue-400"
            }`}>
            {task.completed ? "Completed" : `${task.progress}%`}
          </div>
        )}
      </div>

      <div className="rounded-xl p-6 bg-[#101231] space-y-8">
        <div className="space-y-4">
          <h2 className="text-white font-medium">
            Select scenarios to connect (1-3):
          </h2>
          <div className="flex gap-3 flex-wrap">
            {scenarios.map((scenario) => (
              <button
                key={scenario}
                onClick={() => toggleScenario(scenario)}
                disabled={
                  !selectedScenarios.has(scenario) &&
                  selectedScenarios.size >= 3
                }
                className={`px-8 py-4 rounded-2xl border transition-all ${
                  selectedScenarios.has(scenario)
                    ? "bg-gradient-brand border-transparent text-white"
                    : "gradient-button"
                }`}>
                {scenario}
                {selectedScenarios.has(scenario) && (
                  <span className="ml-1">✓</span>
                )}
              </button>
            ))}
          </div>
          <p className="text-white/60 text-sm">
            {selectedScenarios.size}/3 scenarios selected
          </p>
        </div>

        <div className="px-4 py-8 bg-[#FFFFFF1F] border border-white/15 rounded-xl flex flex-col items-center justify-center gap-6 w-full">
          <div className="text-center space-y-2">
            <button
              onClick={isRecording ? stopRecording : startRecording}
              disabled={selectedScenarios.size === 0}
              className={`rounded-full font-semibold text-white w-20 h-20 flex items-center justify-center transition-all ${
                isRecording
                  ? "bg-red-500 animate-pulse"
                  : audioBlob
                  ? "bg-green-500"
                  : "bg-gradient-brand hover:brightness-110"
              } disabled:opacity-50`}>
              {isRecording ? (
                <FaMicrophoneSlash className="w-8 h-8" />
              ) : (
                <FaMicrophone className="w-8 h-8" />
              )}
            </button>

            {isRecording && (
              <div className="text-red-400 font-semibold animate-pulse">
                {formatTime(recordingTime)}
              </div>
            )}
          </div>

          <span className="font-medium text-white text-md text-center">
            {selectedScenarios.size === 0
              ? "Select 1-3 scenarios to begin"
              : isRecording
              ? "Recording... Click to stop"
              : audioBlob
              ? "✓ Speech recorded successfully"
              : "Click to start your continuous speech"}
          </span>
        </div>

        {selectedScenarios.size > 0 && (
          <div className="p-4 bg-orange-500/10 border border-orange-500/20 rounded-lg">
            <h3 className="text-orange-400 font-semibold text-sm mb-2">
              Your Challenge:
            </h3>
            <p className="text-white/80 text-sm mb-3">
              Create a 1-2 minute continuous speech that smoothly connects these
              concepts:
            </p>
            <div className="flex gap-2 flex-wrap mb-3">
              {Array.from(selectedScenarios).map((scenario, index) => (
                <React.Fragment key={scenario}>
                  <span className="px-2 py-1 bg-orange-500/20 text-orange-400 rounded text-sm">
                    {scenario}
                  </span>
                  {index < selectedScenarios.size - 1 && (
                    <span className="text-orange-400">→</span>
                  )}
                </React.Fragment>
              ))}
            </div>
            <p className="text-white/60 text-xs">
              Focus on smooth transitions and logical flow between concepts.
            </p>
          </div>
        )}
      </div>

      <button
        onClick={handleAICheck}
        disabled={!audioBlob || isLoading}
        className="p-4 inline-flex items-center justify-center gap-2 bg-gradient-brand rounded-2xl font-semibold text-base text-white hover:brightness-110 transition disabled:opacity-50 disabled:cursor-not-allowed">
        {isLoading ? (
          <>
            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            Analyzing...
          </>
        ) : (
          <>
            Check with AI
            <Sparkles className="w-5 h-5" />
          </>
        )}
      </button>

      {feedback && (
        <FeedbackScore
          score={feedback.score}
          feedbackText={feedback.feedback}
          suggestions={feedback.suggestions}
          pronunciationScore={feedback.pronunciationScore}
          fluencyScore={feedback.fluencyScore}
          clarityScore={feedback.clarityScore}
        />
      )}
    </div>
  );
};

export default FlowChain;
