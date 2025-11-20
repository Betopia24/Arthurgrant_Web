"use client";

import { ArrowRight, Sparkles, Volume2 } from "lucide-react";
import React, { useState, useEffect, useCallback } from "react";
import { FaMicrophone, FaMicrophoneSlash } from "react-icons/fa";
import FeedbackScore from "./FeedbackScore";
import { AIFeedback, PresentationTask } from "./PresentationContent";

interface PowerWord {
  word: string;
  definition: string;
  example: string;
}

interface PowerWordsPulseProps {
  onTaskUpdate: (taskId: string, progress: number, completed?: boolean) => void;
  onAIFeedback: (
    taskId: string,
    audioBlob: Blob,
    transcript: string
  ) => Promise<AIFeedback>;
  task?: PresentationTask;
}

const PowerWordsPulse: React.FC<PowerWordsPulseProps> = ({
  onTaskUpdate,
  onAIFeedback,
  task,
}) => {
  const [powerWords, setPowerWords] = useState<PowerWord[]>([]);
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
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);

  // Load power words (simulate API call)
  useEffect(() => {
    const loadPowerWords = async () => {
      // In real implementation, fetch from API
      const words: PowerWord[] = [
        {
          word: "Dynamic",
          definition: "Characterized by constant change, activity, or progress",
          example: "The dynamic presentation captivated the audience.",
        },
        {
          word: "Innovation",
          definition: "The introduction of new ideas or methods",
          example:
            "Their innovation in technology revolutionized the industry.",
        },
        {
          word: "Strategy",
          definition: "A plan of action designed to achieve a long-term goal",
          example: "The company's growth strategy proved highly effective.",
        },
        {
          word: "Execution",
          definition: "The process of carrying out a plan or order",
          example:
            "The flawless execution of the project impressed stakeholders.",
        },
        {
          word: "Vision",
          definition:
            "The ability to think about or plan the future with imagination",
          example: "The CEO's vision guided the company through rapid changes.",
        },
      ];
      setPowerWords(words);
    };

    loadPowerWords();
  }, []);

  const currentWord = powerWords[currentWordIndex];

  // Speech synthesis for word pronunciation
  const speakWord = useCallback((text: string) => {
    if ("speechSynthesis" in window) {
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
        setAudioBlob(blob);
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
    if (mediaRecorder && isRecording) {
      mediaRecorder.stop();
      setIsRecording(false);
      setMediaRecorder(null);

      // Simulate speech-to-text (replace with actual API)
      setTimeout(() => {
        const simulatedTranscript =
          activeRecording === "definition"
            ? `My definition of ${currentWord.word} is...`
            : `I would use ${currentWord.word} in a sentence like...`;

        setRecordings((prev) => ({
          ...prev,
          [activeRecording!]: simulatedTranscript,
        }));

        // Update progress
        const newProgress =
          Object.keys({
            ...recordings,
            [activeRecording!]: simulatedTranscript,
          }).length * 50;
        onTaskUpdate("1", newProgress, newProgress >= 100);
      }, 1000);
    }
  };

  // Handle AI feedback
  const handleAICheck = async () => {
    if (!audioBlob) {
      alert("Please record both definition and sentence first.");
      return;
    }

    setIsLoading(true);
    try {
      const transcript = recordings.definition + " " + recordings.sentence;
      const feedback = await onAIFeedback("1", audioBlob, transcript);
      setFeedback(feedback);
    } catch (error) {
      console.error("Error getting AI feedback:", error);
      alert("Failed to get AI feedback. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // Skip to next word
  const skipWord = () => {
    if (currentWordIndex < powerWords.length - 1) {
      setCurrentWordIndex((prev) => prev + 1);
      setRecordings({});
      setFeedback(null);
      setAudioBlob(null);
    }
  };

  if (!currentWord) {
    return <div>Loading power words...</div>;
  }

  return (
    <div className="p-6 bg-[#FFFFFF1F] border border-white/15 rounded-2xl flex flex-col gap-6 w-full">
      <div className="flex items-center justify-between">
        <h1 className="font-semibold text-2xl text-white">Power Words Pulse</h1>
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
          <h1 className="text-3xl font-bold text-white">
            "{currentWord.word}"
          </h1>
          <button
            onClick={() => speakWord(currentWord.word)}
            className="inline-flex items-center gap-2 text-blue-400 hover:text-blue-300 transition-colors">
            <Volume2 className="w-5 h-5" />
            <span className="text-sm">Hear pronunciation</span>
          </button>
        </div>

        {/* Definition Recording */}
        <div className="px-4 py-6 bg-[#FFFFFF1F] border border-white/15 rounded-xl flex flex-col items-center justify-center gap-4 w-full">
          <button
            onClick={() =>
              isRecording && activeRecording === "definition"
                ? stopRecording()
                : startRecording("definition")
            }
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
            onClick={() =>
              isRecording && activeRecording === "sentence"
                ? stopRecording()
                : startRecording("sentence")
            }
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
            {recordings.sentence ? "✓ Sentence recorded" : "Use in a sentence"}
          </span>

          {recordings.sentence && (
            <div className="text-xs text-green-400 text-center">
              "{recordings.sentence}"
            </div>
          )}
        </div>

        {/* Example Section */}
        <div className="p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg">
          <h3 className="text-blue-400 font-semibold text-sm mb-2">Example:</h3>
          <p className="text-white/80 text-sm">{currentWord.example}</p>
        </div>
      </div>

      {/* AI Check Button */}
      <button
        onClick={handleAICheck}
        disabled={!recordings.definition || !recordings.sentence || isLoading}
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
          suggestions={feedback.suggestions}
          pronunciationScore={feedback.pronunciationScore}
          fluencyScore={feedback.fluencyScore}
          clarityScore={feedback.clarityScore}
        />
      )}
    </div>
  );
};

export default PowerWordsPulse;
