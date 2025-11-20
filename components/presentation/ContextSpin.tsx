"use client";

import { Sparkles } from "lucide-react";
import React, { useState, useRef, useCallback } from "react";
import { FaMicrophone, FaMicrophoneSlash } from "react-icons/fa";
import FeedbackScore from "./FeedbackScore";
import { AIFeedback, PresentationTask } from "./PresentationContent";
import "./gradient-button.css";

interface ContextSpinProps {
  onTaskUpdate: (taskId: string, progress: number, completed?: boolean) => void;
  onAIFeedback: (
    taskId: string,
    audioBlob: Blob,
    transcript: string
  ) => Promise<AIFeedback>;
  task?: PresentationTask;
}

const scenarios = [
  "Product Launch",
  "Team Motivation",
  "Crisis Management",
  "Investor Pitch",
  "Client Negotiation",
];

const words = ["confidence", "inspire", "transform", "growth", "achieve"];

const ContextSpin: React.FC<ContextSpinProps> = ({
  onTaskUpdate,
  onAIFeedback,
  task,
}) => {
  const [selectedScenario, setSelectedScenario] = useState<string>("");
  const [selectedWords, setSelectedWords] = useState<Set<string>>(new Set());
  const [isRecording, setIsRecording] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [feedback, setFeedback] = useState<AIFeedback | null>(null);
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(
    null
  );
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [recordingTime, setRecordingTime] = useState(0);
  const timerRef = useRef<NodeJS.Timeout>(null);

  const toggleWord = (word: string) => {
    setSelectedWords((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(word)) {
        newSet.delete(word);
      } else {
        newSet.add(word);
      }
      return newSet;
    });
  };

  const startRecording = async () => {
    if (!selectedScenario || selectedWords.size === 0) {
      alert("Please select a scenario and at least one word to include.");
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
        onTaskUpdate("3", 50);
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
      alert("Please record your response first.");
      return;
    }

    setIsLoading(true);
    try {
      const transcript = `Response for ${selectedScenario} including words: ${Array.from(
        selectedWords
      ).join(", ")}...`;
      const feedback = await onAIFeedback("3", audioBlob, transcript);
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

  const isReadyToRecord = selectedScenario && selectedWords.size > 0;

  return (
    <div className="p-6 bg-[#FFFFFF1F] border border-white/15 rounded-2xl flex flex-col gap-6 w-full">
      <div className="flex items-center justify-between">
        <h1 className="font-semibold text-2xl text-white">Context Spin</h1>
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
        {/* Scenario Selection */}
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
                    : "gradient-button"
                }`}>
                {scenario}
              </button>
            ))}
          </div>
        </div>

        {/* Word Selection */}
        <div className="space-y-4">
          <h2 className="text-white font-medium">Select words to include:</h2>
          <div className="flex gap-3 flex-wrap">
            {words.map((word) => (
              <button
                key={word}
                onClick={() => toggleWord(word)}
                className={`px-4 py-2 rounded-full border transition-all ${
                  selectedWords.has(word)
                    ? "bg-gradient-brand border-transparent text-white"
                    : "bg-[#FFFFFF1F] border-white/15 text-white/80 hover:bg-white/20"
                }`}>
                {word}
                {selectedWords.has(word) && <span className="ml-1">✓</span>}
              </button>
            ))}
          </div>
        </div>

        {/* Recording Section */}
        <div className="px-4 py-8 bg-[#FFFFFF1F] border border-white/15 rounded-xl flex flex-col items-center justify-center gap-6 w-full">
          <div className="text-center space-y-2">
            <button
              onClick={isRecording ? stopRecording : startRecording}
              disabled={!isReadyToRecord}
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
            {!isReadyToRecord
              ? "Select scenario and words to begin"
              : isRecording
              ? "Recording... Click to stop"
              : audioBlob
              ? "✓ Response recorded successfully"
              : "Click to start your 20-30s response"}
          </span>
        </div>

        {selectedScenario && selectedWords.size > 0 && (
          <div className="p-4 bg-green-500/10 border border-green-500/20 rounded-lg">
            <h3 className="text-green-400 font-semibold text-sm mb-2">
              Your Challenge:
            </h3>
            <p className="text-white/80 text-sm mb-2">
              Create a 20-30 second response for{" "}
              <strong>{selectedScenario}</strong> that naturally includes these
              words:
            </p>
            <div className="flex gap-2 flex-wrap">
              {Array.from(selectedWords).map((word) => (
                <span
                  key={word}
                  className="px-2 py-1 bg-green-500/20 text-green-400 rounded text-sm">
                  {word}
                </span>
              ))}
            </div>
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

export default ContextSpin;
