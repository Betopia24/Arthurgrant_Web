"use client";

import { ArrowRight, Sparkles, Volume2 } from "lucide-react";
import React, { useState, useEffect, useCallback } from "react";
import { FaMicrophone, FaMicrophoneSlash } from "react-icons/fa";
import FeedbackScore from "./FeedbackScore";
import { aiRequest } from "@/lib/aiRequest";
import { useAppDispatch } from "@/redux/hooks";
import {
  resetSpecificTask,
  setTaskComplete,
} from "@/redux/features/presentation/presentationSlice";
import TaskLoadingLockError from "../TaskLoadingLock";
import toast from "react-hot-toast";

interface AIFeedback {
  score: number;
  feedback: string;
  status: string;
  message: string;
}

interface PropsType {
  powerWords: string[];
  loading: boolean;
  error: string | null;
}

const PowerWordsPulse = ({ powerWords, error, loading }: PropsType) => {
  const dispatch = useAppDispatch();
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [isRecording, setIsRecording] = useState(false);
  const [activeRecording, setActiveRecording] = useState<
    "definition" | "sentence" | null
  >(null);
  const [recordings, setRecordings] = useState<{
    definition?: string;
    sentence?: string;
  }>({});
  const [isLoading, setIsLoading] = useState(false);
  const [feedback, setFeedback] = useState<AIFeedback | null>(null);
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(
    null
  );
  const [audioFiles, setAudioFiles] = useState<{
    definition?: File;
    sentence?: File;
  }>({});

  const currentWord = powerWords[currentWordIndex];

  // Speech synthesis for word pronunciation
  const speakWord = useCallback((text: string) => {
    if ("speechSynthesis" in window) {
      speechSynthesis.cancel(); // Stop any ongoing speech
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.8;
      utterance.pitch = 1;
      speechSynthesis.speak(utterance);
    }
  }, []);

  // Start recording
  const startRecording = async (type: "definition" | "sentence") => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      const audioChunks: BlobPart[] = [];

      recorder.ondataavailable = (event) => {
        audioChunks.push(event.data);
      };

      recorder.onstop = () => {
        const blob = new Blob(audioChunks, { type: "audio/wav" });
        // Convert Blob to File
        const audioFile = new File([blob], `${type}_recording.wav`, {
          type: "audio/wav",
        });
        setAudioFiles((prev) => ({
          ...prev,
          [type]: audioFile,
        }));
        stream.getTracks().forEach((track) => track.stop());
      };

      recorder.start();
      setMediaRecorder(recorder);
      setIsRecording(true);
      setActiveRecording(type);
    } catch (error) {
      console.error("Error starting recording:", error);
      alert("Please allow microphone access to use this feature.");
    }
  };

  // Stop recording
  const stopRecording = () => {
    if (mediaRecorder && isRecording && activeRecording) {
      mediaRecorder.stop();
      setIsRecording(false);
      setMediaRecorder(null);

      // Simulate speech-to-text processing
      setTimeout(() => {
        const simulatedTranscript =
          activeRecording === "definition"
            ? `My definition of ${currentWord} is...`
            : `I would use ${currentWord} in a sentence like...`;

        setRecordings((prev) => ({
          ...prev,
          [activeRecording]: simulatedTranscript,
        }));
      }, 1000);
    }
  };

  // Handle recording button click
  const handleRecordingClick = (type: "definition" | "sentence") => {
    if (isRecording && activeRecording === type) {
      stopRecording();
    } else {
      startRecording(type);
    }
  };

  // Skip to next word
  const skipWord = () => {
    if (currentWordIndex < powerWords.length - 1) {
      setCurrentWordIndex((prev) => prev + 1);
      setRecordings({});
      setFeedback(null);
      setAudioFiles({});
      setActiveRecording(null);
    }
  };

  const handleAICheck = async () => {
    if (!audioFiles.definition || !audioFiles.sentence) return;
    console.log("Audio files:", audioFiles);

    try {
      setIsLoading(true);

      // Create FormData to properly send files
      const formData = new FormData();
      formData.append("word", currentWord);
      formData.append("defintion_file", audioFiles.definition);
      formData.append("sentence_file", audioFiles.sentence);

      const data = await aiRequest(
        "/presentation/power-words/power_words",
        "POST",
        formData
      );
      setFeedback(data);
      dispatch(setTaskComplete({ task: "task_1", feedback: data }));
    } catch (error: any) {
      console.error("Error submitting for AI feedback:", error);
      toast.error("Failed to get AI feedback. Please try again.");
      setFeedback(null);
      dispatch(resetSpecificTask({ task: "task_1" }));
    } finally {
      setIsLoading(false);
    }
  };

  // Check if both recordings are completed
  const isComplete = recordings.definition && recordings.sentence;

  return (
    <div className="p-6 bg-[#FFFFFF1F] border border-white/15 rounded-2xl flex flex-col gap-6 w-full">
      <h1 className="font-semibold text-2xl text-white">Power Words Pulse</h1>

      {loading ? (
        <TaskLoadingLockError
          variant="loading"
          title="Power words loading..."
        />
      ) : error ? (
        <TaskLoadingLockError variant="error" title={error} />
      ) : (
        <div className="rounded-xl p-6 bg-[#101231] space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-gradient font-semibold text-lg">
              Word {currentWordIndex + 1} of {powerWords.length}
            </h2>
            <button
              onClick={skipWord}
              disabled={currentWordIndex >= powerWords.length - 1}
              className="bg-[#FFFFFF1F] rounded-full border border-white/15 px-3 py-1 text-sm font-medium text-white flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-white/30 transition-colors">
              Skip <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          <div className="text-center space-y-4">
            <h1 className="text-3xl font-bold text-white capitalize">
              "{currentWord}"
            </h1>
            <button
              onClick={() => speakWord(currentWord)}
              className="inline-flex items-center gap-2 text-blue-400 hover:text-blue-300 transition-colors">
              <Volume2 className="w-5 h-5" />
              <span className="text-sm">Hear pronunciation</span>
            </button>
          </div>

          {/* Definition Recording */}
          <div className="px-4 py-6 bg-[#FFFFFF1F] border border-white/15 rounded-xl flex flex-col items-center justify-center gap-4 w-full">
            <button
              onClick={() => handleRecordingClick("definition")}
              disabled={isRecording && activeRecording !== "definition"}
              className={`rounded-full font-semibold text-white w-16 h-16 flex items-center justify-center transition-all ${
                isRecording && activeRecording === "definition"
                  ? "bg-red-500 animate-pulse"
                  : recordings.definition
                  ? "bg-green-500"
                  : "bg-gradient-brand hover:brightness-110"
              } disabled:opacity-50`}>
              {isRecording && activeRecording === "definition" ? (
                <FaMicrophoneSlash className="w-6 h-6" />
              ) : (
                <FaMicrophone className="w-6 h-6" />
              )}
            </button>

            <span className="font-medium text-white text-md text-center">
              {recordings.definition
                ? "✓ Definition recorded"
                : "Define in your own words"}
            </span>

            {recordings.definition && (
              <div className="text-xs text-green-400 text-center">
                "{recordings.definition}"
              </div>
            )}
          </div>

          {/* Sentence Recording */}
          <div className="px-4 py-6 bg-[#FFFFFF1F] border border-white/15 rounded-xl flex flex-col items-center justify-center gap-4 w-full">
            <button
              onClick={() => handleRecordingClick("sentence")}
              disabled={isRecording && activeRecording !== "sentence"}
              className={`rounded-full font-semibold text-white w-16 h-16 flex items-center justify-center transition-all ${
                isRecording && activeRecording === "sentence"
                  ? "bg-red-500 animate-pulse"
                  : recordings.sentence
                  ? "bg-green-500"
                  : "bg-gradient-brand hover:brightness-110"
              } disabled:opacity-50`}>
              {isRecording && activeRecording === "sentence" ? (
                <FaMicrophoneSlash className="w-6 h-6" />
              ) : (
                <FaMicrophone className="w-6 h-6" />
              )}
            </button>

            <span className="font-medium text-white text-md text-center">
              {recordings.sentence
                ? "✓ Sentence recorded"
                : "Use in a sentence"}
            </span>

            {recordings.sentence && (
              <div className="text-xs text-green-400 text-center">
                "{recordings.sentence}"
              </div>
            )}
          </div>
        </div>
      )}

      {/* AI Check Button */}
      <button
        onClick={handleAICheck}
        disabled={!isComplete || isLoading}
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

export default PowerWordsPulse;
