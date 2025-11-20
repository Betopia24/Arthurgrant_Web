"use client";
import React, {
  useEffect,
  useMemo,
  useRef,
  useState,
  useCallback,
} from "react";
import { FaCircleCheck } from "react-icons/fa6";
import Heading from "../shared/Heading";
import TaskHeader from "../shared/TaskHeader";
import {
  FaCheck,
  FaHeadphones,
  FaMicrophone,
  FaMicrophoneSlash,
  FaVolumeUp,
  FaVolumeMute,
} from "react-icons/fa";
import { FiRefreshCcw } from "react-icons/fi";
import { GiSpeaker } from "react-icons/gi";

// Enhanced Type definitions that match the Web Speech API
interface SpeechRecognitionAlternative {
  transcript: string;
  confidence: number;
}

interface SpeechRecognitionResult {
  isFinal: boolean;
  [index: number]: SpeechRecognitionAlternative;
}

interface SpeechRecognitionResultList {
  [index: number]: SpeechRecognitionResult;
  length: number;
}

interface SpeechRecognitionEvent extends Event {
  results: SpeechRecognitionResultList;
  resultIndex: number;
}

interface SpeechRecognitionErrorEvent extends Event {
  error: string;
  message: string;
}

interface SpeechRecognition extends EventTarget {
  lang: string;
  continuous: boolean;
  interimResults: boolean;
  maxAlternatives: number;
  start(): void;
  stop(): void;
  onresult: ((event: SpeechRecognitionEvent) => void) | null;
  onerror: ((event: SpeechRecognitionErrorEvent) => void) | null;
  onend: (() => void) | null;
  onstart: (() => void) | null;
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
 * SpeakingTask - A comprehensive speaking practice component
 * Features text-to-speech, speech recognition, and progress tracking
 */
const SpeakingTask = () => {
  // Dummy data pools with more variety
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
      "Computer",
      "Water",
      "Music",
      "Friend",
      "Family",
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
      "What's your name",
      "I love learning",
      "Beautiful weather today",
      "How is everything",
      "Nice to meet you",
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
      "We are going to the park this afternoon.",
      "The children play in the garden every day.",
      "My favorite color is blue and green.",
      "Learning new languages is very interesting.",
      "The restaurant serves amazing Italian food.",
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
      ["happy", "sad", "angry", "excited"],
      ["run", "walk", "jump", "swim"],
      ["big", "small", "tall", "short"],
      ["one", "two", "three", "four"],
      ["morning", "afternoon", "evening", "night"],
    ],
    []
  );

  // Speech Recognition setup
  const SpeechRecognition =
    typeof window !== "undefined" &&
    (window.SpeechRecognition || window.webkitSpeechRecognition);
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const speechSynthRef = useRef<SpeechSynthesis | null>(null);

  // Initialize speech synthesis and recognition
  useEffect(() => {
    if (typeof window !== "undefined") {
      speechSynthRef.current = window.speechSynthesis;
    }

    if (SpeechRecognition) {
      try {
        recognitionRef.current = new SpeechRecognition();
        recognitionRef.current.lang = "en-US";
        recognitionRef.current.continuous = false;
        recognitionRef.current.interimResults = false;
        recognitionRef.current.maxAlternatives = 3;
      } catch (e) {
        console.warn("Speech recognition initialization failed:", e);
        recognitionRef.current = null;
      }
    }

    return () => {
      // Cleanup speech synthesis
      if (speechSynthRef.current) {
        speechSynthRef.current.cancel();
      }

      // Cleanup speech recognition
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch (e) {
          // Ignore errors during cleanup
        }
      }
    };
  }, [SpeechRecognition]);

  // Task states
  const [currentTask, setCurrentTask] = useState(1);
  const [overallProgress, setOverallProgress] = useState(0);

  // Task 1: Word Pronunciation
  const [task1Word, setTask1Word] = useState(
    () => wordsPool[Math.floor(Math.random() * wordsPool.length)]
  );
  const [task1Done, setTask1Done] = useState(false);
  const [task1Listening, setTask1Listening] = useState(false);
  const [task1Attempts, setTask1Attempts] = useState(0);

  // Task 2: Phrase Repeat
  const [task2Phrase, setTask2Phrase] = useState(
    () => phrasesPool[Math.floor(Math.random() * phrasesPool.length)]
  );
  const [task2Fluency, setTask2Fluency] = useState<number | null>(null);
  const [task2Listening, setTask2Listening] = useState(false);
  const [task2Done, setTask2Done] = useState(false);

  // Task 3: Sentence Repetition
  const [task3Sentence, setTask3Sentence] = useState(
    () => sentencesPool[Math.floor(Math.random() * sentencesPool.length)]
  );
  const [task3Done, setTask3Done] = useState(false);
  const [task3Listening, setTask3Listening] = useState(false);
  const [task3Attempts, setTask3Attempts] = useState(0);

  // Task 4: Vocabulary Challenge
  const [task4Words, setTask4Words] = useState(
    () => vocabPool[Math.floor(Math.random() * vocabPool.length)]
  );
  const [task4Correct, setTask4Correct] = useState<Set<string>>(
    () => new Set()
  );
  const [task4Listening, setTask4Listening] = useState(false);
  const [task4Done, setTask4Done] = useState(false);

  // Audio state
  const [isSpeaking, setIsSpeaking] = useState(false);

  // Helper: speak text with proper state management
  const speakText = useCallback(
    (text: string, options: { rate?: number; pitch?: number } = {}) => {
      if (!speechSynthRef.current) {
        console.warn("Speech synthesis not available");
        return;
      }

      try {
        // Cancel any ongoing speech
        speechSynthRef.current.cancel();

        const utter = new SpeechSynthesisUtterance(text);
        utter.rate = options.rate || 1;
        utter.pitch = options.pitch || 1;

        utter.onstart = () => setIsSpeaking(true);
        utter.onend = () => setIsSpeaking(false);
        utter.onerror = () => setIsSpeaking(false);

        speechSynthRef.current.speak(utter);
      } catch (e) {
        console.warn("TTS unavailable:", e);
        setIsSpeaking(false);
      }
    },
    []
  );

  // Stop speaking
  const stopSpeaking = useCallback(() => {
    if (speechSynthRef.current) {
      speechSynthRef.current.cancel();
      setIsSpeaking(false);
    }
  }, []);

  // Levenshtein distance for similarity calculation
  const levenshtein = useCallback((a: string = "", b: string = ""): number => {
    const A = a.toLowerCase().trim();
    const B = b.toLowerCase().trim();
    if (A === B) return 0;

    const alen = A.length;
    const blen = B.length;
    if (alen === 0) return blen;
    if (blen === 0) return alen;

    const matrix = Array(alen + 1)
      .fill(null)
      .map(() => Array(blen + 1).fill(0));

    for (let i = 0; i <= alen; i++) matrix[i][0] = i;
    for (let j = 0; j <= blen; j++) matrix[0][j] = j;

    for (let i = 1; i <= alen; i++) {
      for (let j = 1; j <= blen; j++) {
        const cost = A[i - 1] === B[j - 1] ? 0 : 1;
        matrix[i][j] = Math.min(
          matrix[i - 1][j] + 1,
          matrix[i][j - 1] + 1,
          matrix[i - 1][j - 1] + cost
        );
      }
    }

    return matrix[alen][blen];
  }, []);

  // Calculate similarity percentage
  const similarityPercent = useCallback(
    (expected: string, actual: string): number => {
      const expectedTrim = expected.trim();
      const actualTrim = actual.trim();

      if (!expectedTrim && !actualTrim) return 100;
      if (!expectedTrim || !actualTrim) return 0;

      const dist = levenshtein(expectedTrim, actualTrim);
      const maxLen = Math.max(expectedTrim.length, actualTrim.length, 1);
      const similarity = Math.max(0, 1 - dist / maxLen);

      return Math.round(similarity * 100);
    },
    [levenshtein]
  );

  // Fixed Speech recognition utility with proper event handling
  const startRecognitionOnce = useCallback(
    (timeoutMs: number = 7000): Promise<string | null> => {
      return new Promise((resolve) => {
        const recognition = recognitionRef.current;
        if (!recognition) {
          resolve(null);
          return;
        }

        let finished = false;

        const cleanup = () => {
          if (finished) return;
          finished = true;

          try {
            recognition.removeEventListener("result", onResult);
            recognition.removeEventListener("error", onError);
            recognition.removeEventListener("end", onEnd);
            recognition.stop();
          } catch (e) {
            // Ignore cleanup errors
          }

          if (timer) clearTimeout(timer);
        };

        const onResult = (e: Event) => {
          if (finished) return;
          cleanup();

          try {
            // Convert to unknown first, then to SpeechRecognitionEvent
            const speechEvent = e as unknown as SpeechRecognitionEvent;
            if (speechEvent.results && speechEvent.results.length > 0) {
              const transcript = speechEvent.results[0][0].transcript;
              resolve(transcript || null);
            } else {
              resolve(null);
            }
          } catch (err) {
            resolve(null);
          }
        };

        const onError = (e: Event) => {
          if (finished) return;
          cleanup();
          resolve(null);
        };

        const onEnd = () => {
          if (finished) return;
          cleanup();
          resolve(null);
        };

        recognition.addEventListener("result", onResult);
        recognition.addEventListener("error", onError);
        recognition.addEventListener("end", onEnd);

        try {
          recognition.start();
        } catch (e) {
          cleanup();
          resolve(null);
          return;
        }

        const timer = setTimeout(() => {
          cleanup();
          resolve(null);
        }, timeoutMs);
      });
    },
    []
  );

  // Typed input fallback
  const typedInputFallback = async (
    message: string = "Type what you said:"
  ): Promise<string | null> => {
    try {
      if (typeof window === "undefined") return null;
      const typed = window.prompt(message);
      return typed ? typed.trim() : null;
    } catch (e) {
      return null;
    }
  };

  // Task refresh functions
  const task1Refresh = useCallback(() => {
    const usedWords = new Set([task1Word]);
    let newWord;
    do {
      newWord = wordsPool[Math.floor(Math.random() * wordsPool.length)];
    } while (usedWords.has(newWord) && usedWords.size < wordsPool.length);

    setTask1Word(newWord);
    setTask1Done(false);
    setTask1Attempts(0);
  }, [task1Word, wordsPool]);

  const task2Refresh = useCallback(() => {
    const usedPhrases = new Set([task2Phrase]);
    let newPhrase;
    do {
      newPhrase = phrasesPool[Math.floor(Math.random() * phrasesPool.length)];
    } while (
      usedPhrases.has(newPhrase) &&
      usedPhrases.size < phrasesPool.length
    );

    setTask2Phrase(newPhrase);
    setTask2Fluency(null);
    setTask2Done(false);
  }, [task2Phrase, phrasesPool]);

  const task3Refresh = useCallback(() => {
    const usedSentences = new Set([task3Sentence]);
    let newSentence;
    do {
      newSentence =
        sentencesPool[Math.floor(Math.random() * sentencesPool.length)];
    } while (
      usedSentences.has(newSentence) &&
      usedSentences.size < sentencesPool.length
    );

    setTask3Sentence(newSentence);
    setTask3Done(false);
    setTask3Attempts(0);
  }, [task3Sentence, sentencesPool]);

  const task4Refresh = useCallback(() => {
    const usedSets = new Set([task4Words.join(",")]);
    let newSet;
    do {
      newSet = vocabPool[Math.floor(Math.random() * vocabPool.length)];
    } while (
      usedSets.has(newSet.join(",")) &&
      usedSets.size < vocabPool.length
    );

    setTask4Words(newSet);
    setTask4Correct(new Set());
    setTask4Done(false);
  }, [task4Words, vocabPool]);

  // Task handlers
  const handleTask1Play = () => {
    stopSpeaking();
    speakText(task1Word, { rate: 0.8 });
  };

  const handleTask1Mic = async () => {
    setTask1Listening(true);
    stopSpeaking();

    let transcript: string | null = null;
    if (recognitionRef.current) {
      transcript = await startRecognitionOnce(5000);
    } else {
      transcript = await typedInputFallback(`Type the word "${task1Word}":`);
    }

    setTask1Listening(false);
    setTask1Attempts((prev) => prev + 1);

    if (!transcript) return;

    const recognized = transcript.split(/\s+/)[0] || transcript;
    const sim = similarityPercent(task1Word, recognized);

    if (sim >= 70) {
      setTask1Done(true);
      setCurrentTask((prev) => Math.min(prev + 1, 4));
    }
  };

  const handleTask2Play = () => {
    stopSpeaking();
    speakText(task2Phrase, { rate: 0.9 });
  };

  const handleTask2Mic = async () => {
    setTask2Listening(true);
    stopSpeaking();

    let transcript: string | null = null;
    if (recognitionRef.current) {
      transcript = await startRecognitionOnce(8000);
    } else {
      transcript = await typedInputFallback(
        `Type the phrase "${task2Phrase}":`
      );
    }

    setTask2Listening(false);

    if (!transcript) return;

    const sim = similarityPercent(task2Phrase, transcript);
    setTask2Fluency(sim);

    if (sim >= 65) {
      setTask2Done(true);
      setCurrentTask((prev) => Math.min(prev + 1, 4));
    }
  };

  const handleTask3Play = () => {
    stopSpeaking();
    speakText(task3Sentence, { rate: 1 });
  };

  const handleTask3Slow = () => {
    stopSpeaking();
    speakText(task3Sentence, { rate: 0.7 });
  };

  const handleTask3Mic = async () => {
    setTask3Listening(true);
    stopSpeaking();

    let transcript: string | null = null;
    if (recognitionRef.current) {
      transcript = await startRecognitionOnce(10000);
    } else {
      transcript = await typedInputFallback(
        `Type the sentence "${task3Sentence}":`
      );
    }

    setTask3Listening(false);
    setTask3Attempts((prev) => prev + 1);

    if (!transcript) return;

    const sim = similarityPercent(task3Sentence, transcript);
    if (sim >= 60) {
      setTask3Done(true);
      setCurrentTask((prev) => Math.min(prev + 1, 4));
    }
  };

  const handleTask4PlayWord = (word: string) => {
    stopSpeaking();
    speakText(word, { rate: 0.8 });
  };

  const handleTask4Mic = async () => {
    setTask4Listening(true);
    stopSpeaking();

    let transcript: string | null = null;
    if (recognitionRef.current) {
      transcript = await startRecognitionOnce(6000);
    } else {
      transcript = await typedInputFallback(
        "Type one of the vocabulary words:"
      );
    }

    setTask4Listening(false);

    if (!transcript) return;

    const recognized = transcript.split(/\s+/)[0] || transcript;
    const foundWord = task4Words.find(
      (w) => similarityPercent(w, recognized) >= 70
    );

    if (foundWord) {
      setTask4Correct((prev) => {
        const newCorrect = new Set(prev);
        newCorrect.add(foundWord.toLowerCase());

        if (newCorrect.size === task4Words.length) {
          setTask4Done(true);
          setCurrentTask((prev) => Math.min(prev + 1, 4));
        }

        return newCorrect;
      });
    }
  };

  // Calculate overall progress
  useEffect(() => {
    const completedTasks = [task1Done, task2Done, task3Done, task4Done].filter(
      Boolean
    ).length;
    const progress = Math.round((completedTasks / 4) * 100);
    setOverallProgress(progress);
  }, [task1Done, task2Done, task3Done, task4Done]);

  // Derived values
  const task4Progress = Math.round(
    (task4Correct.size / task4Words.length) * 100
  );
  const isSpeechRecognitionAvailable = !!recognitionRef.current;

  // Check if all tasks are completed
  const allTasksCompleted = task1Done && task2Done && task3Done && task4Done;

  return (
    <div className="min-h-screen bg-section-dark py-8 md:py-20">
      <div className="app-container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
        <div className="w-full space-y-8 md:space-y-12">
          <Heading
            heading="Speaking Tasks"
            subheading="Complete each task to improve your pronunciation and fluency"
            specialText="Tasks"
            align="left"
          />

          {/* Tasks Grid */}
          <div className="w-full grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
            {/* Task 1: Word Pronunciation */}
            <div
              className={`w-full bg-[#2D2F4A] text-white p-5 md:p-6 rounded-xl shadow-lg flex flex-col gap-5 md:gap-6 transition-all duration-300 ${
                currentTask === 1 ? "ring-2 ring-blue-400" : "opacity-90"
              }`}>
              <TaskHeader
                title="Pronunciation Practice"
                description="Word Level Training"
                taskNumber={1}
              />

              <div className="bg-[#101231] p-5 md:p-6 rounded-xl flex flex-col items-center justify-center gap-5 md:gap-6">
                <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-center text-gradient">
                  {task1Word}
                </h1>

                <p className="px-4 py-2 text-xs sm:text-sm rounded-full bg-[#2D2F4A] text-center">
                  Tap the microphone & say the word clearly
                </p>

                <div className="flex items-center justify-center gap-4 md:gap-6 flex-wrap">
                  <button
                    className="p-3 rounded-full bg-[#2D2F4A] hover:bg-[#3A3C58] transition-all duration-200 disabled:opacity-50"
                    onClick={handleTask1Play}
                    title="Play word"
                    disabled={isSpeaking}>
                    {isSpeaking ? (
                      <FaVolumeMute className="w-4 h-4 md:w-5 md:h-5" />
                    ) : (
                      <FaVolumeUp className="w-4 h-4 md:w-5 md:h-5" />
                    )}
                  </button>

                  <button
                    className={`p-3 rounded-full hover:brightness-110 transition-all duration-200 ${
                      task1Listening
                        ? "bg-red-500 animate-pulse ring-2 ring-red-300"
                        : "bg-gradient-brand hover:shadow-lg"
                    }`}
                    onClick={handleTask1Mic}
                    title={
                      isSpeechRecognitionAvailable
                        ? "Record your voice"
                        : "Type your response"
                    }
                    disabled={task1Listening || task1Done}>
                    {task1Listening ? (
                      <FaMicrophoneSlash className="w-4 h-4 md:w-5 md:h-5" />
                    ) : (
                      <FaMicrophone className="w-4 h-4 md:w-5 md:h-5" />
                    )}
                  </button>

                  <button
                    className="p-3 rounded-full bg-[#2D2F4A] hover:bg-[#3A3C58] transition-all duration-200"
                    onClick={task1Refresh}
                    title="Get a new word">
                    <FiRefreshCcw className="w-4 h-4 md:w-5 md:h-5" />
                  </button>
                </div>

                {task1Listening && (
                  <div className="text-xs text-center text-green-400 animate-pulse">
                    Listening... Speak now!
                  </div>
                )}

                {task1Attempts > 0 && !task1Done && (
                  <div className="text-xs text-orange-400 text-center">
                    Attempts: {task1Attempts}
                  </div>
                )}
              </div>

              <div className="flex items-center justify-center w-full mt-4 p-4 md:p-6 font-semibold rounded-xl bg-[#464860]">
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

            {/* Task 2: Phrase Repeat */}
            <div
              className={`w-full bg-[#2D2F4A] text-white p-5 md:p-6 rounded-xl shadow-lg flex flex-col gap-5 md:gap-6 transition-all duration-300 ${
                currentTask === 2 ? "ring-2 ring-blue-400" : "opacity-90"
              }`}>
              <TaskHeader
                title="Phrase Repeat"
                description="Follow the Pronunciation"
                taskNumber={2}
              />

              <div className="bg-[#101231] p-5 md:p-6 rounded-xl flex flex-col items-center justify-center gap-5 md:gap-6">
                <h1 className="text-lg sm:text-xl md:text-xl font-semibold bg-gradient-brand py-2 px-4 md:px-6 rounded-xl text-center">
                  {`"${task2Phrase}"`}
                </h1>

                <p className="px-4 py-2 text-xs sm:text-sm rounded-full bg-[#2D2F4A] text-center">
                  Listen first, then repeat the phrase
                </p>

                <div className="flex items-center justify-center gap-4 md:gap-6 flex-wrap">
                  <button
                    className="p-3 rounded-full bg-[#2D2F4A] hover:bg-[#3A3C58] transition-all duration-200 disabled:opacity-50"
                    onClick={handleTask2Play}
                    title="Play phrase"
                    disabled={isSpeaking}>
                    {isSpeaking ? (
                      <FaVolumeMute className="w-4 h-4 md:w-5 md:h-5" />
                    ) : (
                      <FaVolumeUp className="w-4 h-4 md:w-5 md:h-5" />
                    )}
                  </button>

                  <button
                    className={`p-3 rounded-full transition-all duration-200  hover:brightness-110 ${
                      task2Listening
                        ? "bg-red-500 animate-pulse ring-2 ring-red-300"
                        : "bg-gradient-brand hover:shadow-lg"
                    }`}
                    onClick={handleTask2Mic}
                    title={
                      isSpeechRecognitionAvailable
                        ? "Record your voice"
                        : "Type your response"
                    }
                    disabled={task2Listening || task2Done}>
                    {task2Listening ? (
                      <FaMicrophoneSlash className="w-4 h-4 md:w-5 md:h-5" />
                    ) : (
                      <FaMicrophone className="w-4 h-4 md:w-5 md:h-5" />
                    )}
                  </button>

                  <button
                    className="p-3 rounded-full bg-[#2D2F4A] hover:bg-[#3A3C58] transition-all duration-200"
                    onClick={task2Refresh}
                    title="New phrase">
                    <FiRefreshCcw className="w-4 h-4 md:w-5 md:h-5" />
                  </button>
                </div>

                {task2Listening && (
                  <div className="text-xs text-center text-green-400 animate-pulse">
                    Listening... Speak now!
                  </div>
                )}
              </div>

              <div className="flex flex-col items-center justify-center w-full p-4 font-semibold rounded-xl bg-[#464860]">
                <div className="flex items-center justify-between text-sm w-full mb-2">
                  <span>Fluency Score</span>
                  <span className="text-white font-bold">
                    {task2Fluency !== null ? `${task2Fluency}%` : "--"}
                  </span>
                </div>

                <div className="w-full bg-gray-500 rounded-full h-2">
                  <div
                    className="h-full rounded-full bg-gradient-brand transition-all duration-1000 ease-out"
                    style={{ width: `${task2Fluency ?? 0}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Task 3: Sentence Repetition */}
            <div
              className={`w-full bg-[#2D2F4A] text-white p-5 md:p-6 rounded-xl shadow-lg flex flex-col gap-5 md:gap-6 transition-all duration-300 ${
                currentTask === 3 ? "ring-2 ring-blue-400" : "opacity-90"
              }`}>
              <TaskHeader
                title="Listen & Speak"
                description="Sentence Repetition"
                taskNumber={3}
              />

              <div className="bg-[#101231] p-5 md:p-6 rounded-xl flex flex-col items-center justify-center gap-5 md:gap-6">
                <div className="bg-gradient-to-br from-[#28284A] to-[#12122A] rounded-xl px-4 py-3 md:px-6 md:py-4 w-full">
                  <h1 className="text-lg md:text-xl font-semibold text-center mb-3 md:mb-4">
                    {task3Sentence}
                  </h1>

                  <div className="flex items-center justify-center gap-2 md:gap-3 flex-wrap">
                    <button
                      className="px-3 py-1.5 text-xs md:text-sm rounded-full bg-[#2D2F4A] hover:bg-[#3A3C58] transition-all duration-200 flex items-center gap-1 disabled:opacity-50"
                      onClick={handleTask3Play}
                      disabled={isSpeaking}>
                      <GiSpeaker className="w-3 h-3 md:w-4 md:h-4" />
                      <span>Listen</span>
                    </button>
                    <button
                      className="px-3 py-1.5 text-xs md:text-sm rounded-full bg-[#2D2F4A] hover:bg-[#3A3C58] transition-all duration-200 disabled:opacity-50"
                      onClick={handleTask3Slow}
                      disabled={isSpeaking}>
                      <span>Slow Speed</span>
                    </button>
                  </div>
                </div>

                <p className="px-4 py-2 text-xs sm:text-sm rounded-full bg-[#2D2F4A] text-center">
                  Now repeat the sentence clearly
                </p>

                <div className="flex items-center justify-center gap-4 md:gap-6 flex-wrap">
                  <button
                    className="p-3 rounded-full bg-[#2D2F4A] hover:bg-[#3A3C58] transition-all duration-200 disabled:opacity-50"
                    onClick={handleTask3Play}
                    title="Play sentence"
                    disabled={isSpeaking}>
                    <FaHeadphones className="w-4 h-4 md:w-5 md:h-5" />
                  </button>

                  <button
                    className={`p-3 rounded-full transition-all duration-200  hover:brightness-110 ${
                      task3Listening
                        ? "bg-red-500 animate-pulse ring-2 ring-red-300"
                        : "bg-gradient-brand hover:shadow-lg"
                    }`}
                    onClick={handleTask3Mic}
                    title={
                      isSpeechRecognitionAvailable
                        ? "Record your voice"
                        : "Type your response"
                    }
                    disabled={task3Listening || task3Done}>
                    {task3Listening ? (
                      <FaMicrophoneSlash className="w-4 h-4 md:w-5 md:h-5" />
                    ) : (
                      <FaMicrophone className="w-4 h-4 md:w-5 md:h-5" />
                    )}
                  </button>

                  <button
                    className="p-3 rounded-full bg-[#2D2F4A] hover:bg-[#3A3C58] transition-all duration-200"
                    onClick={task3Refresh}
                    title="New sentence">
                    <FiRefreshCcw className="w-4 h-4 md:w-5 md:h-5" />
                  </button>
                </div>

                {task3Listening && (
                  <div className="text-xs text-center text-green-400 animate-pulse">
                    Listening... Speak now!
                  </div>
                )}

                {task3Attempts > 0 && !task3Done && (
                  <div className="text-xs text-orange-400 text-center">
                    Attempts: {task3Attempts}
                  </div>
                )}
              </div>

              <div className="flex items-center justify-start w-full mt-4 p-4 md:p-6 font-semibold rounded-xl bg-[#464860]">
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

            {/* Task 4: Vocabulary Challenge */}
            <div
              className={`w-full bg-[#2D2F4A] text-white p-5 md:p-6 rounded-xl shadow-lg flex flex-col gap-5 md:gap-6 transition-all duration-300 ${
                currentTask === 4 ? "ring-2 ring-blue-400" : "opacity-90"
              }`}>
              <TaskHeader
                title="Vocabulary Challenge"
                description="Daily Word Practice"
                taskNumber={4}
              />

              <div className="bg-[#101231] p-5 md:p-6 rounded-xl flex flex-col items-center justify-center gap-5 md:gap-6">
                <p className="px-4 py-2 text-xs sm:text-sm rounded-full bg-[#2D2F4A] text-center">
                  Listen to each word, then pronounce it correctly
                </p>

                {/* Vocabulary Grid */}
                <div className="w-full grid grid-cols-2 gap-3 md:gap-4">
                  {task4Words.map((word) => {
                    const isCorrect = task4Correct.has(word.toLowerCase());
                    return (
                      <div
                        key={word}
                        className={`p-3 md:p-4 rounded-xl flex items-center justify-center gap-2 cursor-pointer transition-all duration-300 ${
                          isCorrect
                            ? "border-2 border-green-500 bg-green-500/10 text-green-400"
                            : "border-2 border-gray-500 bg-[#2D2F4A] text-gray-300 hover:border-blue-400 hover:text-blue-300"
                        }`}
                        onClick={() => handleTask4PlayWord(word)}
                        title={`Play "${word}"`}>
                        {isCorrect ? (
                          <FaCheck className="w-4 h-4 md:w-5 md:h-5 flex-shrink-0" />
                        ) : (
                          <FaMicrophone className="w-4 h-4 md:w-5 md:h-5 flex-shrink-0" />
                        )}
                        <span className="text-sm md:text-base font-medium text-center">
                          {word}
                        </span>
                      </div>
                    );
                  })}
                </div>

                {/* Buttons */}
                <div className="flex items-center justify-center gap-4 md:gap-6 flex-wrap">
                  <button
                    className={`p-3 rounded-full transition-all duration-200 hover:brightness-110 ${
                      task4Listening
                        ? "bg-red-500 animate-pulse ring-2 ring-red-300"
                        : "bg-gradient-brand hover:shadow-lg"
                    }`}
                    onClick={handleTask4Mic}
                    title={
                      isSpeechRecognitionAvailable
                        ? "Record a word"
                        : "Type a word"
                    }
                    disabled={task4Listening || task4Done}>
                    {task4Listening ? (
                      <FaMicrophoneSlash className="w-4 h-4 md:w-5 md:h-5 text-white" />
                    ) : (
                      <FaMicrophone className="w-4 h-4 md:w-5 md:h-5 text-white" />
                    )}
                  </button>

                  <button
                    className="p-3 rounded-full bg-[#2D2F4A] hover:bg-[#3A3C58] transition-all duration-200"
                    onClick={task4Refresh}
                    title="New words">
                    <FiRefreshCcw className="w-4 h-4 md:w-5 md:h-5 text-white" />
                  </button>
                </div>

                {task4Listening && (
                  <div className="text-xs text-center text-green-400 animate-pulse">
                    Listening... Say a vocabulary word!
                  </div>
                )}
              </div>

              {/* Progress Section */}
              <div className="flex flex-col items-center justify-center w-full p-4 font-semibold rounded-xl bg-[#464860]">
                <div className="flex items-center justify-between text-sm w-full mb-2">
                  <span>Word Target</span>
                  <span className="text-white font-bold">
                    {task4Correct.size}/{task4Words.length}
                  </span>
                </div>

                <div className="w-full bg-gray-500 rounded-full h-2">
                  <div
                    className="h-full rounded-full bg-gradient-brand transition-all duration-1000 ease-out"
                    style={{ width: `${task4Progress}%` }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Completion Message */}
          {allTasksCompleted && (
            <div className="w-full flex items-center justify-center gap-3 border-2 border-green-500 rounded-xl p-6 bg-[#1a2a1a] animate-fade-in">
              <div className="flex items-center justify-center w-8 h-8 rounded-full bg-green-500 text-white">
                <FaCircleCheck className="w-5 h-5 text-white" />
              </div>
              <span className="text-lg text-green-500 font-semibold text-center">
                "Congratulations Jobair! You've completed all speaking tasks for
                today!
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SpeakingTask;
