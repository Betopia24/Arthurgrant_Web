"use client";

import { Sparkles } from "lucide-react";
import React, { useState, useRef, useEffect } from "react";
import { FaMicrophone, FaMicrophoneSlash } from "react-icons/fa";
import FeedbackScore from "./FeedbackScore";
import { aiRequest } from "@/lib/aiRequest";

interface AIFeedback {
  score: number;
  feedback: string;
}

type ScenariosTypes = {
  slow: string[];
  medium: string[];
  fast: string[];
};

interface PropsType {
  scenarios: ScenariosTypes | null;
}

const PrecisionDrill = ({ scenarios }: PropsType) => {
  const [isRecording, setIsRecording] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [feedback, setFeedback] = useState<AIFeedback | null>(null);
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(
    null
  );
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [recordingTime, setRecordingTime] = useState(0);

  const [currentSpeed, setCurrentSpeed] = useState<"slow" | "medium" | "fast">(
    "slow"
  );
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [allWords, setAllWords] = useState<string[]>([]);
  const [currentProgress, setCurrentProgress] = useState(0);
  const [totalWords, setTotalWords] = useState(0);

  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const scrollIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const streamRef = useRef<MediaStream | null>(null); // Add ref for stream

  // Combine all words from all speeds into one array
  useEffect(() => {
    if (scenarios) {
      const allWordsCombined = [
        ...scenarios.slow,
        ...scenarios.medium,
        ...scenarios.fast,
      ];
      setAllWords(allWordsCombined);
      setTotalWords(allWordsCombined.length);
    }
  }, [scenarios]);

  // Determine current speed based on word index
  useEffect(() => {
    if (!scenarios) return;

    const slowLength = scenarios.slow.length;
    const mediumLength = scenarios.medium.length;

    if (currentWordIndex < slowLength) {
      setCurrentSpeed("slow");
    } else if (currentWordIndex < slowLength + mediumLength) {
      setCurrentSpeed("medium");
    } else {
      setCurrentSpeed("fast");
    }

    // Update progress percentage
    setCurrentProgress(Math.round((currentWordIndex / totalWords) * 100));
  }, [currentWordIndex, scenarios, totalWords]);

  // Start auto-scrolling when recording starts
  const startAutoScroll = () => {
    let scrollSpeed = 2000; // Start slow (2 seconds per word)

    const scrollToNextWord = () => {
      setCurrentWordIndex((prev) => {
        const nextIndex = prev + 1;

        // Check if all words are finished
        if (nextIndex >= totalWords) {
          // Stop everything immediately when all words are done
          if (scrollIntervalRef.current) {
            clearInterval(scrollIntervalRef.current);
            scrollIntervalRef.current = null;
          }

          // Force stop recording
          if (mediaRecorder && isRecording) {
            mediaRecorder.stop();
            setIsRecording(false);

            // Stop all media tracks
            if (streamRef.current) {
              streamRef.current.getTracks().forEach((track) => track.stop());
              streamRef.current = null;
            }

            // Stop timer
            if (timerRef.current) {
              clearInterval(timerRef.current);
              timerRef.current = null;
            }
          }
          return prev;
        }

        // Speed up transitions
        if (nextIndex === scenarios?.slow.length) {
          scrollSpeed = 1200; // Medium speed
          if (scrollIntervalRef.current) {
            clearInterval(scrollIntervalRef.current);
            scrollIntervalRef.current = setInterval(
              scrollToNextWord,
              scrollSpeed
            );
          }
        } else if (
          nextIndex ===
          (scenarios?.slow.length || 0) + (scenarios?.medium.length || 0)
        ) {
          scrollSpeed = 800; // Fast speed
          if (scrollIntervalRef.current) {
            clearInterval(scrollIntervalRef.current);
            scrollIntervalRef.current = setInterval(
              scrollToNextWord,
              scrollSpeed
            );
          }
        }

        return nextIndex;
      });
    };

    // Start scrolling
    scrollIntervalRef.current = setInterval(scrollToNextWord, scrollSpeed);
  };

  // Stop auto-scrolling
  const stopAutoScroll = () => {
    if (scrollIntervalRef.current) {
      clearInterval(scrollIntervalRef.current);
      scrollIntervalRef.current = null;
    }
  };

  const startRecording = async () => {
    if (!scenarios || allWords.length === 0) {
      alert("Please wait for words to load.");
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream; // Store stream in ref
      const recorder = new MediaRecorder(stream);
      const audioChunks: BlobPart[] = [];

      recorder.ondataavailable = (event) => {
        audioChunks.push(event.data);
      };

      recorder.onstop = () => {
        const blob = new Blob(audioChunks, { type: "audio/wav" });
        const audioFile = new File([blob], "precision_drill_recording.wav", {
          type: "audio/wav",
        });
        setAudioFile(audioFile);

        // Stop stream tracks
        if (streamRef.current) {
          streamRef.current.getTracks().forEach((track) => track.stop());
          streamRef.current = null;
        }
      };

      recorder.start();
      setMediaRecorder(recorder);
      setIsRecording(true);
      setRecordingTime(0);
      setCurrentWordIndex(0);
      setCurrentProgress(0);
      setFeedback(null); // Reset previous feedback

      // Start auto-scrolling
      startAutoScroll();

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
      stopAutoScroll();

      // Stop stream tracks
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
        streamRef.current = null;
      }

      // Stop timer
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
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
    if (!audioFile) {
      alert("Please record your speech first.");
      return;
    }

    setIsLoading(true);
    try {
      const wordsWithQuotes = allWords.map((word) => `"${word}"`).join(", ");
      const formData = new FormData();
      formData.append("wordlist", wordsWithQuotes);
      formData.append("file", audioFile);

      const data = await aiRequest(
        "/presentation/precision-drill/precision_drill",
        "POST",
        formData
      );
      setFeedback(data);
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

  // Cleanup on component unmount
  useEffect(() => {
    return () => {
      // Clean up all intervals and media tracks
      if (scrollIntervalRef.current) {
        clearInterval(scrollIntervalRef.current);
      }
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
      <h1 className="font-semibold text-2xl text-white">Precision Drill</h1>

      <div className="rounded-xl p-6 bg-[#101231] space-y-8">
        {/* Progress Display */}
        <div className="flex items-center justify-between">
          <div className="text-white font-medium">
            Progress: {currentProgress}%
          </div>
          <div className="text-white font-medium">
            Speed:{" "}
            <span className="text-gradient-brand capitalize">
              {currentSpeed}
            </span>
          </div>
        </div>

        {/* Word Display */}
        <div className="px-4 py-8 bg-[#000000] border border-white/15 rounded-xl flex flex-col items-center justify-center gap-6 w-full min-h-[200px]">
          <div className="text-center space-y-4 w-full">
            {isRecording || audioFile ? (
              <div className="space-y-2">
                <div className="text-white text-lg font-semibold">
                  {currentWordIndex < totalWords
                    ? "Current Word:"
                    : "Drill Complete!"}
                </div>
                <div className="text-4xl font-bold text-gradient capitalize transition-all duration-300">
                  {currentWordIndex < totalWords
                    ? allWords[currentWordIndex]
                    : "🎉"}
                </div>
                <div className="text-white/60 text-sm">
                  Word {Math.min(currentWordIndex + 1, totalWords)} of{" "}
                  {totalWords}
                </div>
              </div>
            ) : (
              <div className="text-white/60 text-lg">
                Click record to start the precision drill
              </div>
            )}
          </div>
        </div>

        {/* Recording Section */}
        <div className="px-4 py-8 bg-[#FFFFFF1F] border border-white/15 rounded-xl flex flex-col items-center justify-center gap-6 w-full">
          <div className="text-center space-y-2">
            <button
              onClick={handleRecordingClick}
              disabled={allWords.length === 0}
              className={`rounded-full font-semibold text-white w-20 h-20 flex items-center justify-center transition-all ${
                isRecording
                  ? "bg-red-500 animate-pulse"
                  : audioFile
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
            {allWords.length === 0
              ? "Loading words..."
              : isRecording
              ? "Recording... Words auto-scroll from slow to fast"
              : audioFile
              ? "✓ Precision drill completed successfully"
              : "Click to start - words will auto-scroll from slow to fast"}
          </span>
        </div>
      </div>

      {/* AI Check Button */}
      <button
        onClick={handleAICheck}
        disabled={!audioFile || isLoading || isRecording}
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

export default PrecisionDrill;
