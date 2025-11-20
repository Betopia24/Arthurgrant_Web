"use client";

import { Sparkles } from "lucide-react";
import React, { useState, useRef } from "react";
import { FaMicrophone, FaMicrophoneSlash } from "react-icons/fa";
import FeedbackScore from "./FeedbackScore";
import { AIFeedback, PresentationTask } from "./PresentationContent";
import "./gradient-button.css";
interface PrecisionDrillProps {
  onTaskUpdate: (taskId: string, progress: number, completed?: boolean) => void;
  onAIFeedback: (
    taskId: string,
    audioBlob: Blob,
    transcript: string
  ) => Promise<AIFeedback>;
  task?: PresentationTask;
}

const scenarios = [
  "Business Meeting",
  "Team Presentation",
  "Client Pitch",
  "Conference Talk",
  "Investor Update",
  "Product Demo",
  "Training Session",
];

const PrecisionDrill: React.FC<PrecisionDrillProps> = ({
  onTaskUpdate,
  onAIFeedback,
  task,
}) => {
  const [selectedScenario, setSelectedScenario] = useState<string>("");
  const [isRecording, setIsRecording] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [feedback, setFeedback] = useState<AIFeedback | null>(null);
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(
    null
  );
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [recordingTime, setRecordingTime] = useState(0);
  const timerRef = useRef<NodeJS.Timeout>(null);

  const startRecording = async () => {
    if (!selectedScenario) {
      alert("Please select a scenario first.");
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
        onTaskUpdate("2", 50);
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
      const transcript = `Practice speech for ${selectedScenario} scenario...`; // Simulated transcript
      const feedback = await onAIFeedback("2", audioBlob, transcript);
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
        <h1 className="font-semibold text-2xl text-white">Precision Drill</h1>
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
          <h2 className="text-white font-medium">Select a scenario:</h2>
          <div className="flex gap-3 flex-wrap">
            {scenarios.map((scenario) => (
              <button
                key={scenario}
                onClick={() => setSelectedScenario(scenario)}
                className={`px-8 py-4 rounded-2xl border transition-all ${
                  selectedScenario === scenario
                    ? "bg-gradient-brand border-transparent text-white"
                    : "gradient-button "
                }`}>
                {scenario}
              </button>
            ))}
          </div>
        </div>

        <div className="px-4 py-8 bg-[#FFFFFF1F] border border-white/15 rounded-xl flex flex-col items-center justify-center gap-6 w-full">
          <div className="text-center space-y-2">
            <button
              onClick={isRecording ? stopRecording : startRecording}
              disabled={!selectedScenario}
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
            {!selectedScenario
              ? "Select a scenario to begin"
              : isRecording
              ? "Recording... Click to stop"
              : audioBlob
              ? "✓ Speech recorded successfully"
              : "Click to start your continuous speech"}
          </span>
        </div>

        {selectedScenario && (
          <div className="p-4 bg-purple-500/10 border border-purple-500/20 rounded-lg">
            <h3 className="text-purple-400 font-semibold text-sm mb-2">
              Prompt:
            </h3>
            <p className="text-white/80 text-sm">
              Present a 2-minute overview of your current project as if you're
              speaking to {selectedScenario.toLowerCase()}. Focus on clear
              articulation and confident delivery.
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
        />
      )}
    </div>
  );
};

export default PrecisionDrill;
