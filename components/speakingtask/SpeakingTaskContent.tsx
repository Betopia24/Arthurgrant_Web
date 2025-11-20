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
import { SpeechRecognition, SpeechRecognitionEvent } from "./speakingTypes";
import TaskCard from "./TaskCard";
import Task1Content from "./Task1Content";
import Task2Content from "./Task2Content";
import Task3Content from "./Task3Content";
import Task4Content from "./Task4Content";
import PracticeHero from "../practice/PracticeHero2";

// Speech Recognition setup
const SpeechRecognitionAPI =
  typeof window !== "undefined" &&
  (window.SpeechRecognition || window.webkitSpeechRecognition);

/**
 * SpeakingTask - Main parent component managing state and core logic
 */
const SpeakingTaskContent = () => {
  // Data pools
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

  // Refs
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const speechSynthRef = useRef<SpeechSynthesis | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  // Core state
  const [currentTask, setCurrentTask] = useState(1);
  const [overallProgress, setOverallProgress] = useState(0);
  const [isSpeaking, setIsSpeaking] = useState(false);

  // Task states
  const [task1State, setTask1State] = useState({
    word: wordsPool[Math.floor(Math.random() * wordsPool.length)],
    done: false,
    listening: false,
    attempts: 0,
  });

  const [task2State, setTask2State] = useState({
    phrase: phrasesPool[Math.floor(Math.random() * phrasesPool.length)],
    fluency: null as number | null,
    done: false,
    listening: false,
  });

  const [task3State, setTask3State] = useState({
    sentence: sentencesPool[Math.floor(Math.random() * sentencesPool.length)],
    done: false,
    listening: false,
    attempts: 0,
  });

  const [task4State, setTask4State] = useState({
    words: vocabPool[Math.floor(Math.random() * vocabPool.length)],
    correct: new Set<string>(),
    done: false,
    listening: false,
  });

  // Initialize speech APIs
  useEffect(() => {
    if (typeof window !== "undefined") {
      speechSynthRef.current = window.speechSynthesis;
    }

    if (SpeechRecognitionAPI) {
      try {
        recognitionRef.current = new SpeechRecognitionAPI();
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
      if (speechSynthRef.current) {
        speechSynthRef.current.cancel();
      }
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
          recognitionRef.current.abort?.();
        } catch (e) {}
      }
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  // Speech utilities
  const speakText = useCallback(
    (text: string, options: { rate?: number; pitch?: number } = {}) => {
      if (!speechSynthRef.current) {
        console.warn("Speech synthesis not available");
        return;
      }

      try {
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

  const stopSpeaking = useCallback(() => {
    if (speechSynthRef.current) {
      speechSynthRef.current.cancel();
      setIsSpeaking(false);
    }
  }, []);

  // Similarity calculation
  const levenshtein = useCallback((a: string = "", b: string = ""): number => {
    const A = a.toLowerCase().trim();
    const B = b.toLowerCase().trim();
    if (A === B) return 0;

    const matrix = Array(A.length + 1)
      .fill(null)
      .map(() => Array(B.length + 1).fill(0));
    for (let i = 0; i <= A.length; i++) matrix[i][0] = i;
    for (let j = 0; j <= B.length; j++) matrix[0][j] = j;

    for (let i = 1; i <= A.length; i++) {
      for (let j = 1; j <= B.length; j++) {
        const cost = A[i - 1] === B[j - 1] ? 0 : 1;
        matrix[i][j] = Math.min(
          matrix[i - 1][j] + 1,
          matrix[i][j - 1] + 1,
          matrix[i - 1][j - 1] + cost
        );
      }
    }
    return matrix[A.length][B.length];
  }, []);

  const similarityPercent = useCallback(
    (expected: string, actual: string): number => {
      const dist = levenshtein(expected.trim(), actual.trim());
      const maxLen = Math.max(expected.trim().length, actual.trim().length, 1);
      const similarity = Math.max(0, 1 - dist / maxLen);
      return Math.round(similarity * 100);
    },
    [levenshtein]
  );

  // Speech recognition
  const startRecognitionOnce = useCallback(
    (timeoutMs: number = 7000): Promise<string | null> => {
      return new Promise((resolve) => {
        const recognition = recognitionRef.current;
        if (!recognition) {
          resolve(null);
          return;
        }

        let finished = false;
        abortControllerRef.current = new AbortController();
        const { signal } = abortControllerRef.current;

        const cleanup = () => {
          if (finished) return;
          finished = true;
          try {
            recognition.removeEventListener("result", onResult);
            recognition.removeEventListener("error", onError);
            recognition.removeEventListener("end", onEnd);
            recognition.stop();
            recognition.abort?.();
          } catch (e) {}
          if (timer) clearTimeout(timer);
        };

        const onResult = (e: Event) => {
          if (finished || signal.aborted) return;
          cleanup();
          try {
            const speechEvent = e as SpeechRecognitionEvent;
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

        const onError = () => {
          if (finished || signal.aborted) return;
          cleanup();
          resolve(null);
        };

        const onEnd = () => {
          if (finished || signal.aborted) return;
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
          if (!finished && !signal.aborted) {
            cleanup();
            resolve(null);
          }
        }, timeoutMs);

        signal.addEventListener("abort", () => {
          cleanup();
          resolve(null);
        });
      });
    },
    []
  );

  const typedInputFallback = async (
    message: string
  ): Promise<string | null> => {
    try {
      if (typeof window === "undefined") return null;
      const typed = window.prompt(message);
      return typed ? typed.trim() : null;
    } catch (e) {
      return null;
    }
  };

  // Task handlers
  const handleTask1Play = useCallback(() => {
    stopSpeaking();
    speakText(task1State.word, { rate: 0.8 });
  }, [stopSpeaking, speakText, task1State.word]);

  const handleTask1Mic = async () => {
    setTask1State((prev) => ({ ...prev, listening: true }));
    stopSpeaking();

    try {
      let transcript: string | null = null;
      if (recognitionRef.current) {
        transcript = await startRecognitionOnce(5000);
      } else {
        transcript = await typedInputFallback(
          `Type the word "${task1State.word}":`
        );
      }

      setTask1State((prev) => ({ ...prev, attempts: prev.attempts + 1 }));

      if (!transcript) {
        setTask1State((prev) => ({ ...prev, listening: false }));
        return;
      }

      const recognized = transcript.split(/\s+/)[0] || transcript;
      const sim = similarityPercent(task1State.word, recognized);

      if (sim >= 70) {
        setTask1State((prev) => ({ ...prev, done: true, listening: false }));
        setCurrentTask((prev) => Math.min(prev + 1, 4));
      } else {
        setTask1State((prev) => ({ ...prev, listening: false }));
      }
    } catch (error) {
      setTask1State((prev) => ({ ...prev, listening: false }));
    }
  };

  const handleTask2Play = useCallback(() => {
    stopSpeaking();
    speakText(task2State.phrase, { rate: 0.9 });
  }, [stopSpeaking, speakText, task2State.phrase]);

  const handleTask2Mic = async () => {
    setTask2State((prev) => ({ ...prev, listening: true }));
    stopSpeaking();

    try {
      let transcript: string | null = null;
      if (recognitionRef.current) {
        transcript = await startRecognitionOnce(8000);
      } else {
        transcript = await typedInputFallback(
          `Type the phrase "${task2State.phrase}":`
        );
      }

      if (!transcript) {
        setTask2State((prev) => ({ ...prev, listening: false }));
        return;
      }

      const sim = similarityPercent(task2State.phrase, transcript);
      setTask2State((prev) => ({ ...prev, fluency: sim, listening: false }));

      if (sim >= 65) {
        setTask2State((prev) => ({ ...prev, done: true }));
        setCurrentTask((prev) => Math.min(prev + 1, 4));
      }
    } catch (error) {
      setTask2State((prev) => ({ ...prev, listening: false }));
    }
  };

  const handleTask3Play = useCallback(() => {
    stopSpeaking();
    speakText(task3State.sentence, { rate: 1 });
  }, [stopSpeaking, speakText, task3State.sentence]);

  const handleTask3Slow = useCallback(() => {
    stopSpeaking();
    speakText(task3State.sentence, { rate: 0.7 });
  }, [stopSpeaking, speakText, task3State.sentence]);

  const handleTask3Mic = async () => {
    setTask3State((prev) => ({ ...prev, listening: true }));
    stopSpeaking();

    try {
      let transcript: string | null = null;
      if (recognitionRef.current) {
        transcript = await startRecognitionOnce(10000);
      } else {
        transcript = await typedInputFallback(
          `Type the sentence "${task3State.sentence}":`
        );
      }

      setTask3State((prev) => ({ ...prev, attempts: prev.attempts + 1 }));

      if (!transcript) {
        setTask3State((prev) => ({ ...prev, listening: false }));
        return;
      }

      const sim = similarityPercent(task3State.sentence, transcript);
      if (sim >= 60) {
        setTask3State((prev) => ({ ...prev, done: true, listening: false }));
        setCurrentTask((prev) => Math.min(prev + 1, 4));
      } else {
        setTask3State((prev) => ({ ...prev, listening: false }));
      }
    } catch (error) {
      setTask3State((prev) => ({ ...prev, listening: false }));
    }
  };

  const handleTask4PlayWord = useCallback(
    (word: string) => {
      stopSpeaking();
      speakText(word, { rate: 0.8 });
    },
    [stopSpeaking, speakText]
  );

  const handleTask4Mic = async () => {
    setTask4State((prev) => ({ ...prev, listening: true }));
    stopSpeaking();

    try {
      let transcript: string | null = null;
      if (recognitionRef.current) {
        transcript = await startRecognitionOnce(6000);
      } else {
        transcript = await typedInputFallback(
          "Type one of the vocabulary words:"
        );
      }

      if (!transcript) {
        setTask4State((prev) => ({ ...prev, listening: false }));
        return;
      }

      const recognized = transcript.split(/\s+/)[0] || transcript;
      const foundWord = task4State.words.find(
        (w) => similarityPercent(w, recognized) >= 70
      );

      if (foundWord) {
        setTask4State((prev) => {
          const newCorrect = new Set(prev.correct);
          newCorrect.add(foundWord.toLowerCase());
          const done = newCorrect.size === prev.words.length;

          if (done) {
            setCurrentTask((task) => Math.min(task + 1, 4));
          }

          return { ...prev, correct: newCorrect, done, listening: false };
        });
      } else {
        setTask4State((prev) => ({ ...prev, listening: false }));
      }
    } catch (error) {
      setTask4State((prev) => ({ ...prev, listening: false }));
    }
  };

  // Refresh functions
  const task1Refresh = useCallback(() => {
    const usedWords = new Set([task1State.word]);
    let newWord;
    let attempts = 0;
    do {
      newWord = wordsPool[Math.floor(Math.random() * wordsPool.length)];
      attempts++;
    } while (usedWords.has(newWord) && attempts < wordsPool.length * 2);

    setTask1State({
      word: newWord,
      done: false,
      listening: false,
      attempts: 0,
    });
  }, [task1State.word, wordsPool]);

  const task2Refresh = useCallback(() => {
    const usedPhrases = new Set([task2State.phrase]);
    let newPhrase;
    let attempts = 0;
    do {
      newPhrase = phrasesPool[Math.floor(Math.random() * phrasesPool.length)];
      attempts++;
    } while (usedPhrases.has(newPhrase) && attempts < phrasesPool.length * 2);

    setTask2State({
      phrase: newPhrase,
      fluency: null,
      done: false,
      listening: false,
    });
  }, [task2State.phrase, phrasesPool]);

  const task3Refresh = useCallback(() => {
    const usedSentences = new Set([task3State.sentence]);
    let newSentence;
    let attempts = 0;
    do {
      newSentence =
        sentencesPool[Math.floor(Math.random() * sentencesPool.length)];
      attempts++;
    } while (
      usedSentences.has(newSentence) &&
      attempts < sentencesPool.length * 2
    );

    setTask3State({
      sentence: newSentence,
      done: false,
      listening: false,
      attempts: 0,
    });
  }, [task3State.sentence, sentencesPool]);

  const task4Refresh = useCallback(() => {
    const usedSets = new Set([task4State.words.join(",")]);
    let newSet;
    let attempts = 0;
    do {
      newSet = vocabPool[Math.floor(Math.random() * vocabPool.length)];
      attempts++;
    } while (usedSets.has(newSet.join(",")) && attempts < vocabPool.length * 2);

    setTask4State({
      words: newSet,
      correct: new Set(),
      done: false,
      listening: false,
    });
  }, [task4State.words, vocabPool]);

  // Progress calculation
  useEffect(() => {
    const completedTasks = [
      task1State.done,
      task2State.done,
      task3State.done,
      task4State.done,
    ].filter(Boolean).length;
    const progress = Math.round((completedTasks / 4) * 100);
    setOverallProgress(progress);
  }, [task1State.done, task2State.done, task3State.done, task4State.done]);

  // Derived values
  const task4Progress = Math.round(
    (task4State.correct.size / task4State.words.length) * 100
  );
  const isSpeechRecognitionAvailable = !!recognitionRef.current;
  const allTasksCompleted =
    task1State.done && task2State.done && task3State.done && task4State.done;

  return (
    <div className="min-h-screen bg-section-dark">
      <PracticeHero
        heading="Today's Speaking Practice"
        subheading="Master your pronunciation with AI-powered feedback and interactive exercises designed for your success."
        specialText="Practice"
        align="center"
        greetText="Hi Raju!"
        streakValue="9"
        sessionTime="12:34"
        progressValue="2/4"
        goalValue="75%"
        sessionProgressWidth="60%"
        progressWidth="40%"
        goalWidth="70%"
      />

      <div className="app-container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-20">
        <div className="w-full space-y-8 md:space-y-12">
          <Heading
            heading="Speaking Tasks"
            subheading="Complete each task to improve your pronunciation and fluency"
            specialText="Tasks"
            align="left"
          />

          <div className="w-full grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
            {/* Task 1 */}
            <TaskCard
              taskNumber={1}
              currentTask={currentTask}
              title="Pronunciation Practice"
              description="Word Level Training"
              content={
                <Task1Content
                  word={task1State.word}
                  isSpeaking={isSpeaking}
                  listening={task1State.listening}
                  done={task1State.done}
                  attempts={task1State.attempts}
                  onPlay={handleTask1Play}
                  onMic={handleTask1Mic}
                  onRefresh={task1Refresh}
                  isSpeechRecognitionAvailable={isSpeechRecognitionAvailable}
                />
              }
            />

            {/* Task 2 */}
            <TaskCard
              taskNumber={2}
              currentTask={currentTask}
              title="Phrase Repeat"
              description="Follow the Pronunciation"
              content={
                <Task2Content
                  phrase={task2State.phrase}
                  isSpeaking={isSpeaking}
                  listening={task2State.listening}
                  done={task2State.done}
                  fluency={task2State.fluency}
                  onPlay={handleTask2Play}
                  onMic={handleTask2Mic}
                  onRefresh={task2Refresh}
                  isSpeechRecognitionAvailable={isSpeechRecognitionAvailable}
                />
              }
            />

            {/* Task 3 */}
            <TaskCard
              taskNumber={3}
              currentTask={currentTask}
              title="Listen & Speak"
              description="Sentence Repetition"
              content={
                <Task3Content
                  sentence={task3State.sentence}
                  isSpeaking={isSpeaking}
                  listening={task3State.listening}
                  done={task3State.done}
                  attempts={task3State.attempts}
                  onPlay={handleTask3Play}
                  onSlow={handleTask3Slow}
                  onMic={handleTask3Mic}
                  onRefresh={task3Refresh}
                  isSpeechRecognitionAvailable={isSpeechRecognitionAvailable}
                />
              }
            />

            {/* Task 4 */}
            <TaskCard
              taskNumber={4}
              currentTask={currentTask}
              title="Vocabulary Challenge"
              description="Daily Word Practice"
              content={
                <Task4Content
                  words={task4State.words}
                  correct={task4State.correct}
                  listening={task4State.listening}
                  done={task4State.done}
                  progress={task4Progress}
                  onPlayWord={handleTask4PlayWord}
                  onMic={handleTask4Mic}
                  onRefresh={task4Refresh}
                  isSpeaking={isSpeaking}
                  isSpeechRecognitionAvailable={isSpeechRecognitionAvailable}
                />
              }
            />
          </div>

          {/* Completion Message */}
          {allTasksCompleted && (
            <div
              className="w-full flex items-center justify-center gap-3 border-2 border-green-500 rounded-xl p-6 bg-[#1a2a1a] animate-fade-in"
              role="alert"
              aria-live="polite">
              <div className="flex items-center justify-center w-8 h-8 rounded-full bg-green-500 text-white">
                <FaCircleCheck className="w-5 h-5 text-white" />
              </div>
              <span className="text-lg text-green-500 font-semibold text-center">
                Congratulations! You've completed all speaking tasks for today!
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SpeakingTaskContent;
