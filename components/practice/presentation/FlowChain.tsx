"use client";

import { Sparkles } from "lucide-react";
import React, { useState, useRef, useEffect } from "react";
import { FaMicrophone, FaMicrophoneSlash } from "react-icons/fa";
import FeedbackScore from "./FeedbackScore";
import { aiRequest } from "@/lib/aiRequest";
import { useAppDispatch } from "@/redux/hooks";
import { setTaskComplete } from "@/redux/features/presentation/presentationSlice";
import TaskLoadingLockError from "../TaskLoadingLock";

interface AIFeedback {
  score: number;
  feedback: string;
  status: string;
  message: string;
}

interface PropsType {
  scenarios: string[];
  loading: boolean;
  error: string | null;
  isTask3Complete: boolean;
}
const FlowChain = ({
  scenarios,
  error,
  loading,
  isTask3Complete,
}: PropsType) => {
  const dispatch = useAppDispatch();
  const [selectedScenarios, setSelectedScenarios] = useState<string[]>([]);
  const [isRecording, setIsRecording] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [feedback, setFeedback] = useState<AIFeedback | null>(null);
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(
    null
  );
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [recordingTime, setRecordingTime] = useState(0);

  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const toggleScenario = (scenario: string) => {
    setSelectedScenarios((prev) => {
      if (prev.includes(scenario)) {
        return prev.filter((s) => s !== scenario);
      } else if (prev.length < 3) {
        return [...prev, scenario];
      }
      return prev;
    });
  };

  const startRecording = async () => {
    if (selectedScenarios.length === 0) {
      alert("Please select at least one scenario to begin.");
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;
      const recorder = new MediaRecorder(stream);
      const audioChunks: BlobPart[] = [];

      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunks.push(event.data);
        }
      };

      recorder.onstop = () => {
        const blob = new Blob(audioChunks, { type: "audio/wav" });
        const file = new File([blob], "flow_chain_recording.wav", {
          type: "audio/wav",
        });

        setAudioBlob(blob);
        setAudioFile(file);

        if (streamRef.current) {
          streamRef.current.getTracks().forEach((track) => track.stop());
          streamRef.current = null;
        }
      };

      recorder.start();
      setMediaRecorder(recorder);
      setIsRecording(true);
      setRecordingTime(0);
      setFeedback(null);

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
        timerRef.current = null;
      }

      // Stop stream if still active
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
        streamRef.current = null;
      }
    }
  };

  const handleRecordingClick = () => {
    if (isRecording) {
      stopRecording();
    } else {
      startRecording();
    }
  };

  const handleAICheck = async () => {
    if (!audioFile || selectedScenarios.length === 0) {
      alert("Please record your speech and select scenarios first.");
      return;
    }

    setIsLoading(true);
    try {
      const wordsWithQuotes = selectedScenarios
        .map((word) => `"${word}"`)
        .join(", ");
      const formData = new FormData();
      formData.append("word_list", wordsWithQuotes);
      formData.append("file", audioFile);

      const data = await aiRequest(
        "/presentation/flow-chain/flow_chain",
        "POST",
        formData
      );
      setFeedback(data);
      dispatch(setTaskComplete({ task: "task_4", feedback: data }));
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

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);

  return (
    <div className="p-6 bg-[#FFFFFF1F] border border-white/15 rounded-2xl flex flex-col gap-6 w-full">
      <h1 className="font-semibold text-2xl text-white">Flow Chain</h1>

      {!isTask3Complete ? (
        <TaskLoadingLockError
          title="Please complete previous task"
          variant="locked"
        />
      ) : loading ? (
        <TaskLoadingLockError title="Flow chain loading..." variant="loading" />
      ) : error ? (
        <TaskLoadingLockError
          title={error} // Use the actual error message
          variant="error"
        />
      ) : !scenarios ? (
        <TaskLoadingLockError
          title="No Flow chain data available"
          variant="error"
        />
      ) : (
        <div className="rounded-xl p-6 bg-[#101231] space-y-8">
          <div className="space-y-4">
            <h2 className="text-white font-medium">
              Select scenarios to connect (1-3):
            </h2>
            <div className="flex gap-3 flex-wrap">
              {scenarios.length === 0 ? (
                <div className="text-white/60 text-center w-full py-4">
                  No scenarios available
                </div>
              ) : (
                scenarios.map((scenario, index) => (
                  <button
                    key={index}
                    onClick={() => toggleScenario(scenario)}
                    disabled={
                      !selectedScenarios.includes(scenario) &&
                      selectedScenarios.length >= 3
                    }
                    className={`px-8 py-4 rounded-2xl transition-all ${
                      selectedScenarios.includes(scenario)
                        ? "bg-gradient-brand border-transparent text-white"
                        : "gradient-button"
                    } disabled:opacity-50 disabled:cursor-not-allowed`}>
                    {scenario}
                    {selectedScenarios.includes(scenario) && (
                      <span className="ml-1">✓</span>
                    )}
                  </button>
                ))
              )}
            </div>
            <p className="text-white/60 text-sm">
              {selectedScenarios.length}/3 scenarios selected
            </p>
          </div>

          <div className="px-4 py-8 bg-[#FFFFFF1F] border border-white/15 rounded-xl flex flex-col items-center justify-center gap-6 w-full">
            <div className="text-center space-y-2">
              <button
                onClick={handleRecordingClick}
                disabled={
                  selectedScenarios.length === 0 || scenarios.length === 0
                }
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
              {scenarios.length === 0
                ? "No scenarios available"
                : selectedScenarios.length === 0
                ? "Select 1-3 scenarios to begin"
                : isRecording
                ? "Recording... Click to stop"
                : audioBlob
                ? "✓ Speech recorded successfully"
                : "Click to start your continuous speech"}
            </span>
          </div>
        </div>
      )}

      <button
        onClick={handleAICheck}
        disabled={!audioFile || isLoading || selectedScenarios.length === 0}
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

export default FlowChain;
