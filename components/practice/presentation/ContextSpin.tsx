"use client";

import { Sparkles } from "lucide-react";
import React, { useState, useRef, useEffect } from "react";
import { FaMicrophone, FaMicrophoneSlash } from "react-icons/fa";
import FeedbackScore from "./FeedbackScore";
import { aiRequest } from "@/lib/aiRequest";
import {
  resetSpecificTask,
  setTaskComplete,
} from "@/redux/features/presentation/presentationSlice";
import { useAppDispatch } from "@/redux/hooks";
import TaskLoadingLockError from "../TaskLoadingLock";
import toast from "react-hot-toast";

interface AIFeedback {
  score: number;
  feedback: string;
  status: string;
  message: string;
}
interface ContextDataType {
  words: string[];
  scenario: string;
}

interface PropsType {
  contextData: ContextDataType | null;
  loading: boolean;
  error: string | null;
  isTask2Complete: boolean;
}
const ContextSpin = ({
  contextData,
  error,
  loading,
  isTask2Complete,
}: PropsType) => {
  const dispatch = useAppDispatch();
  const [selectedWords, setSelectedWords] = useState<string[]>([]);
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

  const toggleWord = (word: string) => {
    setSelectedWords((prev) => {
      if (prev.includes(word)) {
        return prev.filter((w) => w !== word);
      } else {
        return [...prev, word];
      }
    });
  };

  const startRecording = async () => {
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
        const file = new File([blob], "context_spin_recording.wav", {
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
    if (!audioFile || selectedWords.length === 0 || !contextData) {
      alert("Please record your speech and select words first.");
      return;
    }

    setIsLoading(true);
    try {
      const wordsWithQuotes = selectedWords
        .map((word) => `"${word}"`)
        .join(", ");

      const formData = new FormData();
      formData.append("scenario", contextData.scenario);
      formData.append("words", wordsWithQuotes);
      formData.append("file", audioFile);

      const data = await aiRequest(
        "/presentation/context-spin/context_spin",
        "POST",
        formData
      );
      setFeedback(data);
      dispatch(setTaskComplete({ task: "task_3", feedback: data }));
    } catch (error: any) {
      console.error("Error getting AI feedback:", error);

      toast.error("Failed to get AI feedback. Please try again.");
      setFeedback(null);
      dispatch(resetSpecificTask({ task: "task_3" }));
    } finally {
      setIsLoading(false);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  // Check if ready to record
  const isReadyToRecord = contextData && selectedWords.length > 0;

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
      <h1 className="font-semibold text-2xl text-white">Context Spin</h1>

      {!isTask2Complete ? (
        <TaskLoadingLockError
          title="Please complete previous task"
          variant="locked"
        />
      ) : loading ? (
        <TaskLoadingLockError title="Context loading..." variant="loading" />
      ) : error ? (
        <TaskLoadingLockError
          title={error} // Use the actual error message
          variant="error"
        />
      ) : !contextData ? (
        <TaskLoadingLockError
          title="No context data available"
          variant="error"
        />
      ) : (
        <div className="rounded-xl p-6 bg-[#101231] space-y-8">
          {/* Scenario Display */}
          <div className="px-4 py-8 bg-[#000000] border border-white/15 rounded-xl overflow-hidden">
            <p className="text-white text-lg leading-relaxed">
              {contextData?.scenario &&
                contextData.scenario.charAt(0).toUpperCase() +
                  contextData.scenario.slice(1)}
            </p>
          </div>

          {/* Word Selection */}
          <div className="space-y-4">
            <h2 className="text-white font-medium text-lg">
              Select words to include:
            </h2>
            <div className="flex gap-3 flex-wrap">
              {contextData?.words.map((word, index) => (
                <button
                  key={index}
                  onClick={() => toggleWord(word)}
                  className={`px-8 py-4 rounded-2xl transition-all ${
                    selectedWords.includes(word)
                      ? "bg-gradient-brand border-transparent text-white"
                      : "gradient-button"
                  }`}>
                  {word}
                  {selectedWords.includes(word) && (
                    <span className="ml-1">✓</span>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Recording Section */}
          <div className="px-4 py-8 bg-[#FFFFFF1F] border border-white/15 rounded-xl flex flex-col items-center justify-center gap-6 w-full">
            <div className="text-center space-y-2">
              <button
                onClick={handleRecordingClick}
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
                ? "Select words to begin recording"
                : isRecording
                ? "Recording... Click to stop"
                : audioBlob
                ? "✓ Response recorded successfully"
                : "Click to start your 20-30s response"}
            </span>
          </div>
        </div>
      )}

      {/* AI Check Button */}
      <button
        onClick={handleAICheck}
        disabled={!audioFile || isLoading || selectedWords.length === 0}
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

      {/* AI Feedback */}
      {feedback && (
        <FeedbackScore
          score={feedback.score}
          feedbackText={feedback.feedback}
        />
      )}
    </div>
  );
};

export default ContextSpin;
