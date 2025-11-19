"use client";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { FaCircleCheck } from "react-icons/fa6";
import Heading from "../shared/Heading";
import TaskHeader from "../shared/TaskHeader";
import { FaCheck, FaHeadphones, FaMicrophone } from "react-icons/fa";
import { FiRefreshCcw } from "react-icons/fi";
import { GiSpeaker } from "react-icons/gi";

// Type definitions
interface SpeechRecognitionEvent extends Event {
  results: SpeechRecognitionResultList;
}

interface SpeechRecognition extends EventTarget {
  lang: string;
  interimResults: boolean;
  maxAlternatives: number;
  start(): void;
  stop(): void;
  onresult: ((event: SpeechRecognitionEvent) => void) | null;
  onerror: ((event: Event) => void) | null;
  onend: (() => void) | null;
}

declare global {
  interface Window {
    SpeechRecognition: {
      new (): SpeechRecognition;
    };
    webkitSpeechRecognition: {
      new (): SpeechRecognition;
    };
  }
}

/**
 * SpeakingTask
 *
 * - Uses speechSynthesis for playback (text-to-speech)
 * - Uses Web Speech API (SpeechRecognition) when available; otherwise falls back to a typed-input modal
 * - All data is dummy and randomizes on refresh
 *
 * Design and classes are intentionally preserved.
 */

const SpeakingTask = () => {
  // Dummy data pools
  const wordsPool = useMemo(
    () => [
      "Dog",
      "Apple",
      "House",
      "Car",
      "Book",
      "Tree",
      "River",
      "Moon",
      "Chair",
      "Phone",
    ],
    []
  );
  const phrasesPool = useMemo(
    () => [
      "Good morning",
      "How are you",
      "See you later",
      "Thank you very much",
      "Have a nice day",
    ],
    []
  );
  const sentencesPool = useMemo(
    () => [
      "The sun is so hot today.",
      "I like to read books every weekend.",
      "She bought a new red bicycle.",
      "They will travel to the city tomorrow.",
      "He made a delicious chocolate cake.",
    ],
    []
  );
  const vocabPool = useMemo(
    () => [
      ["cat", "dog", "bird", "fish"],
      ["apple", "banana", "orange", "grape"],
      ["car", "bus", "train", "bike"],
      ["sun", "moon", "star", "cloud"],
      ["red", "blue", "green", "yellow"],
    ],
    []
  );

  // Speech Recognition setup (works on Chrome/Edge/Chromium-based)
  const SpeechRecognition =
    typeof window !== "undefined" &&
    (window.SpeechRecognition || window.webkitSpeechRecognition);
  const recognitionRef = useRef<SpeechRecognition | null>(null);

  useEffect(() => {
    if (SpeechRecognition) {
      try {
        recognitionRef.current = new SpeechRecognition();
        recognitionRef.current.lang = "en-US";
        recognitionRef.current.interimResults = false;
        recognitionRef.current.maxAlternatives = 3;
      } catch (e) {
        console.warn("Speech recognition initialization failed:", e);
        recognitionRef.current = null;
      }
    } else {
      recognitionRef.current = null;
    }

    return () => {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch (e) {
          // Ignore errors during cleanup
        }
      }
    };
  }, [SpeechRecognition]);

  // Helper: speak text
  const speakText = (
    text: string,
    options: { rate?: number; pitch?: number } = {}
  ) => {
    try {
      if (typeof window === "undefined" || !window.speechSynthesis) {
        console.warn("Speech synthesis not available");
        return;
      }

      const utter = new SpeechSynthesisUtterance(text);
      if (options.rate) utter.rate = options.rate;
      if (options.pitch) utter.pitch = options.pitch;

      window.speechSynthesis.cancel(); // stop previous if any
      window.speechSynthesis.speak(utter);
    } catch (e) {
      console.warn("TTS unavailable:", e);
      // no-op fallback
    }
  };

  // Levenshtein distance for similarity
  const levenshtein = (a: string = "", b: string = ""): number => {
    const A = a.toLowerCase().trim();
    const B = b.toLowerCase().trim();
    if (A === B) return 0;
    const alen = A.length;
    const blen = B.length;
    const dp = Array.from({ length: alen + 1 }, () =>
      new Array(blen + 1).fill(0)
    );
    for (let i = 0; i <= alen; i++) dp[i][0] = i;
    for (let j = 0; j <= blen; j++) dp[0][j] = j;
    for (let i = 1; i <= alen; i++) {
      for (let j = 1; j <= blen; j++) {
        const cost = A[i - 1] === B[j - 1] ? 0 : 1;
        dp[i][j] = Math.min(
          dp[i - 1][j] + 1,
          dp[i][j - 1] + 1,
          dp[i - 1][j - 1] + cost
        );
      }
    }
    return dp[alen][blen];
  };

  const similarityPercent = (expected: string, actual: string): number => {
    const expectedTrim = expected.trim();
    const actualTrim = actual.trim();
    if (!expectedTrim && !actualTrim) return 100;
    const dist = levenshtein(expectedTrim, actualTrim);
    const maxLen = Math.max(expectedTrim.length, actualTrim.length, 1);
    const sim = Math.max(0, 1 - dist / maxLen);
    return Math.round(sim * 100);
  };

  // ---- Task 1: Pronunciation Practice (word)
  const [task1Word, setTask1Word] = useState(
    () => wordsPool[Math.floor(Math.random() * wordsPool.length)]
  );
  const [task1Done, setTask1Done] = useState(false);
  const [task1Listening, setTask1Listening] = useState(false);

  const task1Refresh = () => {
    const newWord = wordsPool[Math.floor(Math.random() * wordsPool.length)];
    setTask1Word(newWord);
    setTask1Done(false);
  };

  // ---- Task 2: Phrase repeat (phrase + fluency)
  const [task2Phrase, setTask2Phrase] = useState(
    () => phrasesPool[Math.floor(Math.random() * phrasesPool.length)]
  );
  const [task2Fluency, setTask2Fluency] = useState<number | null>(null);
  const [task2Listening, setTask2Listening] = useState(false);

  const task2Refresh = () => {
    const newPhrase =
      phrasesPool[Math.floor(Math.random() * phrasesPool.length)];
    setTask2Phrase(newPhrase);
    setTask2Fluency(null);
  };

  // ---- Task 3: Sentence repeat (listen/slow, message)
  const [task3Sentence, setTask3Sentence] = useState(
    () => sentencesPool[Math.floor(Math.random() * sentencesPool.length)]
  );
  const [task3Done, setTask3Done] = useState(false);
  const [task3Listening, setTask3Listening] = useState(false);

  const task3Refresh = () => {
    const newSen =
      sentencesPool[Math.floor(Math.random() * sentencesPool.length)];
    setTask3Sentence(newSen);
    setTask3Done(false);
  };

  // ---- Task 4: Vocabulary challenge (4 words)
  const [task4Words, setTask4Words] = useState(
    () => vocabPool[Math.floor(Math.random() * vocabPool.length)]
  );
  const [task4Correct, setTask4Correct] = useState<Set<string>>(
    () => new Set()
  );
  const [task4Listening, setTask4Listening] = useState(false);

  const task4Refresh = () => {
    const newSet = vocabPool[Math.floor(Math.random() * vocabPool.length)];
    setTask4Words(newSet);
    setTask4Correct(new Set());
  };

  // Utility: start recognition and return a promise that resolves to transcript or null
  const startRecognitionOnce = (
    timeoutMs: number = 7000
  ): Promise<string | null> => {
    return new Promise((resolve) => {
      const recognition = recognitionRef.current;
      if (!recognition) {
        resolve(null);
        return;
      }

      let finished = false;

      const onResult = (e: SpeechRecognitionEvent) => {
        if (finished) return;
        finished = true;
        try {
          const transcript = Array.from(e.results)
            .map((r) => r[0].transcript)
            .join(" ");
          cleanup();
          resolve(transcript);
        } catch (err) {
          cleanup();
          resolve(null);
        }
      };

      const onError = (e: Event) => {
        if (finished) return;
        finished = true;
        cleanup();
        resolve(null);
      };

      const onEnd = () => {
        if (finished) return;
        finished = true;
        cleanup();
        resolve(null);
      };

      const cleanup = () => {
        try {
          recognition.removeEventListener("result", onResult as EventListener);
          recognition.removeEventListener("error", onError);
          recognition.removeEventListener("end", onEnd);
          recognition.stop();
        } catch (e) {
          // Ignore cleanup errors
        }
        if (timer) clearTimeout(timer);
      };

      recognition.addEventListener("result", onResult as EventListener);
      recognition.addEventListener("error", onError);
      recognition.addEventListener("end", onEnd);

      // start recognizing
      try {
        recognition.start();
      } catch (e) {
        // sometimes start throws if previously not properly stopped
        try {
          recognition.stop();
        } catch (e2) {
          // Ignore stop errors
        }
        resolve(null);
        return;
      }

      const timer = setTimeout(() => {
        if (finished) return;
        finished = true;
        try {
          recognition.removeEventListener("result", onResult as EventListener);
          recognition.removeEventListener("error", onError);
          recognition.removeEventListener("end", onEnd);
          recognition.stop();
        } catch (e) {
          // Ignore cleanup errors
        }
        resolve(null);
      }, timeoutMs);
    });
  };

  // Fallback: prompt typed input when recognition is not available
  const typedInputFallback = async (
    message: string = "Type what you said:"
  ): Promise<string | null> => {
    // use window.prompt for simple fallback
    try {
      if (typeof window === "undefined") return null;
      const typed = window.prompt(message);
      return typed ? typed.trim() : null;
    } catch (e) {
      return null;
    }
  };

  // ---- Handlers for Task 1
  const handleTask1Play = () => {
    speakText(task1Word);
  };

  const handleTask1Mic = async () => {
    setTask1Listening(true);
    let transcript: string | null = null;
    if (recognitionRef.current) {
      transcript = await startRecognitionOnce(7000);
    } else {
      transcript = await typedInputFallback(
        "Type the word you said (fallback):"
      );
    }
    setTask1Listening(false);

    if (!transcript) {
      // nothing recognized
      return;
    }

    const recognized = transcript.split(/\s+/)[0] || transcript;
    const sim = similarityPercent(task1Word, recognized);
    if (sim >= 80) {
      setTask1Done(true);
    }
  };

  // ---- Handlers for Task 2
  const handleTask2Play = () => {
    speakText(task2Phrase);
  };

  const handleTask2Mic = async () => {
    setTask2Listening(true);
    let transcript: string | null = null;
    if (recognitionRef.current) {
      transcript = await startRecognitionOnce(9000);
    } else {
      transcript = await typedInputFallback(
        "Type the phrase you said (fallback):"
      );
    }
    setTask2Listening(false);

    if (!transcript) return;
    const sim = similarityPercent(task2Phrase, transcript);
    setTask2Fluency(sim);
  };

  // ---- Handlers for Task 3
  const handleTask3Play = () => {
    speakText(task3Sentence, { rate: 1 });
  };

  const handleTask3Slow = () => {
    speakText(task3Sentence, { rate: 0.7 });
  };

  const handleTask3Mic = async () => {
    setTask3Listening(true);
    let transcript: string | null = null;
    if (recognitionRef.current) {
      transcript = await startRecognitionOnce(10000);
    } else {
      transcript = await typedInputFallback(
        "Type the sentence you said (fallback):"
      );
    }
    setTask3Listening(false);
    if (!transcript) return;
    const sim = similarityPercent(task3Sentence, transcript);
    if (sim >= 75) {
      setTask3Done(true);
    }
  };

  // ---- Handlers for Task 4
  const handleTask4PlayWord = (word: string) => {
    speakText(word);
  };

  const handleTask4Mic = async () => {
    setTask4Listening(true);
    let transcript: string | null = null;
    if (recognitionRef.current) {
      transcript = await startRecognitionOnce(7000);
    } else {
      transcript = await typedInputFallback(
        "Type the word you said (fallback):"
      );
    }
    setTask4Listening(false);
    if (!transcript) return;
    const recognized = transcript.split(/\s+/)[0] || transcript;

    const foundIndex = task4Words.findIndex(
      (w) => similarityPercent(w, recognized) >= 80
    );
    if (foundIndex >= 0) {
      setTask4Correct((prev) => {
        const copy = new Set(prev);
        copy.add(task4Words[foundIndex].toLowerCase());
        return copy;
      });
    }
  };

  // derived progress for task 4
  const task4Progress = Math.round(
    (task4Correct.size / task4Words.length) * 100
  );

  // Check if speech recognition is available for button titles
  const isSpeechRecognitionAvailable = !!recognitionRef.current;

  return (
    <div className="py-20 bg-section-dark">
      <div className="app-container flex flex-col items-start gap-12 w-full">
        {/* Heading */}
        <Heading
          heading="Speaking Tasks"
          subheading="Complete each task to improve your pronunciation and fluency"
          specialText="Tasks"
          align="left"
        />

        <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Task 01 */}
          <div className="w-full bg-[#2D2F4A] text-white p-6 rounded-xl shadow-lg flex flex-col gap-6">
            <TaskHeader
              title="Pronunciation Practice"
              description="Word Level Training"
              taskNumber={1}
            />

            {/* Test Holder */}
            <div>
              <div className="bg-[#101231] p-6 rounded-xl flex flex-col items-center justify-center gap-6">
                <h1 className="text-3xl sm:text-4xl font-semibold">
                  {task1Word}
                </h1>
                <p className="px-5 py-2 text-sm rounded-full bg-[#2D2F4A] inline-block">
                  Tap the microphone & say the word clearly
                </p>
                <div className="flex items-center justify-center gap-6">
                  <button
                    className="p-3.5 rounded-full bg-[#2D2F4A]"
                    onClick={handleTask1Play}
                    title="Play word">
                    <FaHeadphones className="w-5 h-5" />
                  </button>
                  <button
                    className="p-3.5 rounded-full bg-gradient-brand"
                    onClick={handleTask1Mic}
                    title={
                      isSpeechRecognitionAvailable
                        ? "Record your voice"
                        : "Fallback input"
                    }>
                    <FaMicrophone className="w-5 h-5" />
                  </button>
                  <button
                    className="p-3.5 rounded-full bg-[#2D2F4A]"
                    onClick={task1Refresh}
                    title="Get a new word">
                    <FiRefreshCcw className="w-5 h-5" />
                  </button>
                </div>
                {/* small indicator for listening */}
                {task1Listening && (
                  <div className="text-xs mt-2">Listening...</div>
                )}
              </div>

              <div className="flex items-center justify-center w-full mt-4 px-8 py-4 font-semibold rounded-xl bg-[#464860] cursor-pointer">
                <p className="flex text-sm items-center justify-center gap-2">
                  {task1Done ? (
                    <>
                      <FaCheck className="w-4 h-4 p-1 rounded-full bg-gradient-brand text-white" />
                      <span className="text-gradient">
                        Perfect Go to Next Challenge
                      </span>
                    </>
                  ) : (
                    <>
                      <FaCheck className="w-4 h-4 p-1 rounded-full bg-[#6b6b6b] text-white" />
                      <span>Say the word to complete</span>
                    </>
                  )}
                </p>
              </div>
            </div>
          </div>

          {/* Task 02 */}
          <div className="w-full bg-[#2D2F4A] text-white p-6 rounded-xl shadow-lg flex flex-col gap-6">
            <TaskHeader
              title="Phrase Repeat"
              description="Follow Mercury's Lead"
              taskNumber={2}
            />

            {/* Test Holder */}
            <div>
              <div className="bg-[#101231] p-6 rounded-xl flex flex-col items-center justify-center gap-6">
                <h1 className="text-lg sm:text-xl font-semibold bg-gradient-brand py-2 px-6 rounded-xl">
                  {task2Phrase}
                </h1>
                <p className="px-5 py-2 text-sm rounded-full bg-[#2D2F4A] inline-block">
                  Listen first, then repeat after Mercury
                </p>
                <div className="flex items-center justify-center gap-6">
                  <button
                    className="p-3.5 rounded-full bg-[#2D2F4A]"
                    onClick={handleTask2Play}
                    title="Play phrase">
                    <FaHeadphones className="w-5 h-5" />
                  </button>
                  <button
                    className="p-3.5 rounded-full bg-gradient-brand"
                    onClick={handleTask2Mic}
                    title={
                      isSpeechRecognitionAvailable
                        ? "Record your voice"
                        : "Fallback input"
                    }>
                    <FaMicrophone className="w-5 h-5" />
                  </button>
                  <button
                    className="p-3.5 rounded-full bg-[#2D2F4A]"
                    onClick={task2Refresh}
                    title="New phrase">
                    <FiRefreshCcw className="w-5 h-5" />
                  </button>
                </div>
                {task2Listening && (
                  <div className="text-xs mt-2">Listening...</div>
                )}
              </div>

              <div className="flex flex-col items-center justify-center w-full mt-4 px-4 py-2 font-semibold rounded-xl bg-[#464860] cursor-pointer">
                <div className="flex items-center justify-between text-sm w-full">
                  <p>Fluency Score</p>{" "}
                  <span>
                    {task2Fluency !== null ? `${task2Fluency}%` : "--"}
                  </span>
                </div>

                {/* Progress bar with gradient */}
                <div className="w-full mt-2 h-2 bg-gray-500 rounded-full">
                  <div
                    className="h-full rounded-full bg-gradient-brand"
                    style={{ width: `${task2Fluency ?? 0}%` }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Task 03 */}
          <div className="w-full bg-[#2D2F4A] text-white p-6 rounded-xl shadow-lg flex flex-col gap-6">
            <TaskHeader
              title="Listen & Speak"
              description="Sentence Repetition"
              taskNumber={3}
            />

            {/* Test Holder */}
            <div>
              <div className="bg-[#101231] p-6 rounded-xl flex flex-col items-center justify-center gap-6">
                <div className="bg-gradient-to-br from-[#28284A] to-[#12122A] rounded-xl px-6 py-4 w-full flex items-center flex-col gap-2">
                  <h1 className="text-xl font-semibold">{task3Sentence}</h1>
                  <div className="flex items-center gap-2 text-sm">
                    <button
                      className="px-3 py-1 rounded-full bg-[#2D2F4A] flex items-center gap-1"
                      onClick={handleTask3Play}>
                      <GiSpeaker /> <span>Listen</span>
                    </button>
                    <button
                      className="px-3 py-1 rounded-full bg-[#2D2F4A] flex items-center gap-1"
                      onClick={handleTask3Slow}>
                      <span>Slow</span>
                    </button>
                  </div>
                </div>
                <p className="px-5 py-2 text-sm rounded-full bg-[#2D2F4A] inline-block">
                  Now repeat the sentence
                </p>
                <div className="flex items-center justify-center gap-6">
                  <button
                    className="p-3.5 rounded-full bg-[#2D2F4A]"
                    onClick={handleTask3Play}
                    title="Play sentence">
                    <FaHeadphones className="w-5 h-5" />
                  </button>
                  <button
                    className="p-3.5 rounded-full bg-gradient-brand"
                    onClick={handleTask3Mic}
                    title={
                      isSpeechRecognitionAvailable
                        ? "Record your voice"
                        : "Fallback input"
                    }>
                    <FaMicrophone className="w-5 h-5" />
                  </button>
                  <button
                    className="p-3.5 rounded-full bg-[#2D2F4A]"
                    onClick={task3Refresh}
                    title="New sentence">
                    <FiRefreshCcw className="w-5 h-5" />
                  </button>
                </div>
                {task3Listening && (
                  <div className="text-xs mt-2">Listening...</div>
                )}
              </div>

              <div className="flex items-center justify-start w-full mt-4 px-8 py-4 font-semibold rounded-xl bg-[#464860] cursor-pointer">
                <p className="flex text-sm items-center justify-start gap-2">
                  {task3Done ? (
                    <>
                      <FaCheck className="w-4 h-4 p-1 rounded-full bg-gradient-brand text-white" />
                      <span className="text-gradient">
                        Perfect Great Pronunciation!
                      </span>
                    </>
                  ) : (
                    <>
                      <FaCheck className="w-4 h-4 p-1 rounded-full bg-[#6b6b6b] text-white" />
                      <span>Say the sentence to complete</span>
                    </>
                  )}
                </p>
              </div>
            </div>
          </div>

          {/* Task 04 */}
          <div className="w-full bg-[#2D2F4A] text-white p-6 rounded-xl shadow-lg flex flex-col gap-6">
            <TaskHeader
              title="Vocabulary Challenge"
              description="Daily Word Practice"
              taskNumber={4}
            />
            <div>
              {/* Test Holder */}
              <div className="bg-[#101231] p-6 rounded-xl flex flex-col items-center justify-center gap-6">
                <p className="px-5 py-2 text-sm rounded-full bg-[#2D2F4A] inline-block">
                  Listen first, then repeat after Mercury
                </p>

                {/* 4 Static Divs */}
                <div className="w-full grid grid-cols-2 gap-4 mt-4">
                  {task4Words.map((w) => {
                    const isCorrect = task4Correct.has(w.toLowerCase());
                    return (
                      <div
                        key={w}
                        className={`border-2 ${
                          isCorrect
                            ? "border-green-500 text-green-500"
                            : "border-gray-500 text-gray-500"
                        } p-4 rounded-xl flex items-center justify-center gap-2 cursor-pointer`}
                        onClick={() => handleTask4PlayWord(w)}
                        title="Play this word">
                        {isCorrect ? (
                          <FaCheck className="w-5 h-5" />
                        ) : (
                          <FaMicrophone className="w-5 h-5" />
                        )}
                        <span>{w}</span>
                      </div>
                    );
                  })}
                </div>

                {/* Buttons */}
                <div className="flex items-center justify-center gap-6">
                  <button
                    className="p-3.5 rounded-full bg-gradient-brand"
                    onClick={handleTask4Mic}
                    title={
                      isSpeechRecognitionAvailable
                        ? "Record a word"
                        : "Fallback input"
                    }>
                    <FaMicrophone className="w-5 h-5 text-white" />
                  </button>
                  <button
                    className="p-3.5 rounded-full bg-[#2D2F4A]"
                    onClick={task4Refresh}
                    title="New words">
                    <FiRefreshCcw className="w-5 h-5 text-white" />
                  </button>
                </div>
                {task4Listening && (
                  <div className="text-xs mt-2">Listening...</div>
                )}
              </div>

              {/* Word Target Section */}
              <div className="flex flex-col items-center justify-center w-full mt-4 px-4 py-2 font-semibold rounded-xl bg-[#464860] cursor-pointer">
                <div className="flex items-center justify-between text-sm w-full">
                  <p>Word Target</p>{" "}
                  <span>{`${task4Correct.size}/${task4Words.length}`}</span>
                </div>

                {/* Progress bar with gradient */}
                <div className="w-full mt-2 h-2 bg-gray-500 rounded-full">
                  <div
                    className="h-full rounded-full bg-gradient-brand"
                    style={{ width: `${task4Progress}%` }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Completion message */}
        <div className="w-full flex items-center justify-center gap-3 border-2 border-green-500 rounded-xl p-6 bg-[#1a2a1a]">
          <div className="flex items-center justify-center w-8 h-8 rounded-full bg-green-500 text-white">
            <FaCircleCheck className="w-5 h-5 text-white" />
          </div>
          <span className="text-lg text-green-500 font-semibold">
            Well done Jobair! You've finished today's speaking session
          </span>
        </div>
      </div>
    </div>
  );
};

export default SpeakingTask;
