"use client";
import React, {
  useEffect,
  useMemo,
  useRef,
  useState,
  useCallback,
} from "react";
import { FaCircleCheck } from "react-icons/fa6";
import PracticeHero from "../PracticeHero2";
import Heading from "@/components/shared/Heading";
import { SpeechRecognition, SpeechRecognitionEvent } from "./speakingTypes";
import TaskCard from "./TaskCard";
import Task1Content from "./Task1Content";
import Task2Content from "./Task2Content";
import Task3Content from "./Task3Content";
import Task4Content from "./Task4Content";
import { aiRequest } from "@/lib/aiRequest";
import { useAuthStore } from "@/stores/authStore";
import CompletePageFooterMessage from "@/components/shared/CompletePageFooterMessage";
import TaskLoadingLockError from "../TaskLoadingLock";
import { apiRequest } from "@/lib/apiRequest";
import toast from "react-hot-toast";

// Speech Recognition setup
const SpeechRecognitionAPI =
  typeof window !== "undefined" &&
  (window.SpeechRecognition || window.webkitSpeechRecognition);

type LoadingState = {
  wordsPool: boolean;
  phrasesPool: boolean;
  sentencesPool: boolean;
  vocabPool: boolean;
  submit: boolean;
};

type ErrorState = {
  wordsPool: string | null;
  phrasesPool: string | null;
  sentencesPool: string | null;
  vocabPool: string | null;
  submit: string | null;
};

const SpeakingTaskContent = () => {
  const { user } = useAuthStore();
  const ageRange = user?.age;
  const firstAge = ageRange?.split("-")[0];

  // State initialization with proper types
  const [wordsPool, setWordsPool] = useState<string[]>([]);
  const [phrasesPool, setPhrasesPool] = useState<string[]>([]);
  const [sentencesPool, setSentencesPool] = useState<string[]>([]);
  const [vocabPool, setVocabPool] = useState<string[][]>([]);

  const [loading, setLoading] = useState<LoadingState>({
    wordsPool: true,
    phrasesPool: true,
    sentencesPool: true,
    vocabPool: true,
    submit: false,
  });

  const [errors, setErrors] = useState<ErrorState>({
    wordsPool: null,
    phrasesPool: null,
    sentencesPool: null,
    vocabPool: null,
    submit: null,
  });

  const fetchWordsPool = async () => {
    try {
      setLoading((prev) => ({ ...prev, wordsPool: true }));
      setErrors((prev) => ({ ...prev, wordsPool: null }));

      const data = await aiRequest(
        `/speaking/pronunciation/get_pronunciation?age=${firstAge}`,
        "GET"
      );
      setWordsPool(data.words || []);
    } catch (error) {
      console.error("Error fetching Words Pool:", error);
      setErrors((prev) => ({
        ...prev,
        wordsPool: "Failed to load Words Pool",
      }));
    } finally {
      setLoading((prev) => ({ ...prev, wordsPool: false }));
    }
  };

  const fetchPhrasesPool = async () => {
    try {
      setLoading((prev) => ({ ...prev, phrasesPool: true }));
      setErrors((prev) => ({ ...prev, phrasesPool: null }));

      const data = await aiRequest(
        `/speaking/phrase-repeat/get_phrase_repeat?age=${firstAge}`,
        "GET"
      );
      setPhrasesPool(data.phrases || []);
    } catch (error) {
      console.error("Error fetching Phrases Pool:", error);
      setErrors((prev) => ({
        ...prev,
        phrasesPool: "Failed to load Phrases Pool",
      }));
    } finally {
      setLoading((prev) => ({ ...prev, phrasesPool: false }));
    }
  };

  const fetchSentencesPool = async () => {
    try {
      setLoading((prev) => ({ ...prev, sentencesPool: true }));
      setErrors((prev) => ({ ...prev, sentencesPool: null }));

      const data = await aiRequest(
        `/speaking/listen-speak/get_listen_speak?age=${firstAge}`,
        "GET"
      );
      setSentencesPool(data.sentences || []);
    } catch (error) {
      console.error("Error fetching Sentences Pool:", error);
      setErrors((prev) => ({
        ...prev,
        sentencesPool: "Failed to load Sentences Pool",
      }));
    } finally {
      setLoading((prev) => ({ ...prev, sentencesPool: false }));
    }
  };

  const fetchVocabPool = async () => {
    try {
      setLoading((prev) => ({ ...prev, vocabPool: true }));
      setErrors((prev) => ({ ...prev, vocabPool: null }));

      const data = await aiRequest(
        `/speaking/vocabulary-challenge/get_vocabulary?age=${firstAge}`,
        "GET"
      );
      // Ensure we get a proper array of string arrays
      const vocabData = data.words || [];
      // If it's a single array, wrap it in another array
      const formattedVocab =
        Array.isArray(vocabData) &&
        vocabData.length > 0 &&
        typeof vocabData[0] === "string"
          ? [vocabData]
          : vocabData;
      setVocabPool(formattedVocab);
    } catch (error) {
      console.error("Error fetching Vocabulary Pool:", error);
      setErrors((prev) => ({
        ...prev,
        vocabPool: "Failed to load Vocabulary Pool",
      }));
    } finally {
      setLoading((prev) => ({ ...prev, vocabPool: false }));
    }
  };

  useEffect(() => {
    // Fetch all data in parallel
    Promise.all([
      fetchWordsPool(),
      fetchPhrasesPool(),
      fetchSentencesPool(),
      fetchVocabPool(),
    ]);
  }, []);

  // Refs
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const speechSynthRef = useRef<SpeechSynthesis | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  // Core state
  const [currentTask, setCurrentTask] = useState(1);
  const [overallProgress, setOverallProgress] = useState(0);
  const [isSpeaking, setIsSpeaking] = useState(false);

  // Task states with proper initialization
  const [task1State, setTask1State] = useState({
    word: "",
    done: false,
    listening: false,
    attempts: 0,
  });

  const [task2State, setTask2State] = useState({
    phrase: "",
    fluency: null as number | null,
    done: false,
    listening: false,
  });

  const [task3State, setTask3State] = useState({
    sentence: "",
    done: false,
    listening: false,
    attempts: 0,
  });

  const [task4State, setTask4State] = useState({
    words: [] as string[],
    correct: new Set<string>(),
    done: false,
    listening: false,
  });

  // Initialize task data when pools are loaded
  useEffect(() => {
    if (wordsPool.length > 0 && !task1State.word) {
      setTask1State((prev) => ({
        ...prev,
        word: wordsPool[Math.floor(Math.random() * wordsPool.length)],
      }));
    }
  }, [wordsPool, task1State.word]);

  useEffect(() => {
    if (phrasesPool.length > 0 && !task2State.phrase) {
      setTask2State((prev) => ({
        ...prev,
        phrase: phrasesPool[Math.floor(Math.random() * phrasesPool.length)],
      }));
    }
  }, [phrasesPool, task2State.phrase]);

  useEffect(() => {
    if (sentencesPool.length > 0 && !task3State.sentence) {
      setTask3State((prev) => ({
        ...prev,
        sentence:
          sentencesPool[Math.floor(Math.random() * sentencesPool.length)],
      }));
    }
  }, [sentencesPool, task3State.sentence]);

  useEffect(() => {
    if (vocabPool.length > 0 && task4State.words.length === 0) {
      const randomWordSet =
        vocabPool[Math.floor(Math.random() * vocabPool.length)];
      // Ensure we get a proper string array and take maximum 4 words
      const wordsArray = Array.isArray(randomWordSet)
        ? randomWordSet.slice(0, 4)
        : [];
      setTask4State((prev) => ({
        ...prev,
        words: wordsArray,
      }));
    }
  }, [vocabPool, task4State.words.length]);

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
      if (!speechSynthRef.current || !text) {
        console.warn("Speech synthesis not available or no text provided");
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
    if (!task1State.word) return;
    stopSpeaking();
    speakText(task1State.word, { rate: 0.8 });
  }, [stopSpeaking, speakText, task1State.word]);

  const handleTask1Mic = async () => {
    if (!task1State.word) return;

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
    if (!task2State.phrase) return;
    stopSpeaking();
    speakText(task2State.phrase, { rate: 0.9 });
  }, [stopSpeaking, speakText, task2State.phrase]);

  const handleTask2Mic = async () => {
    if (!task2State.phrase) return;

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
    if (!task3State.sentence) return;
    stopSpeaking();
    speakText(task3State.sentence, { rate: 1 });
  }, [stopSpeaking, speakText, task3State.sentence]);

  const handleTask3Slow = useCallback(() => {
    if (!task3State.sentence) return;
    stopSpeaking();
    speakText(task3State.sentence, { rate: 0.7 });
  }, [stopSpeaking, speakText, task3State.sentence]);

  const handleTask3Mic = async () => {
    if (!task3State.sentence) return;

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
    if (task4State.words.length === 0) return;

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
    if (wordsPool.length === 0) return;

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
    if (phrasesPool.length === 0) return;

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
    if (sentencesPool.length === 0) return;

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
    if (vocabPool.length === 0) return;

    // Get all available words from vocabPool and flatten them into a single array
    const allAvailableWords = vocabPool.flat();

    // Remove duplicates
    const uniqueWords = [...new Set(allAvailableWords)];

    if (uniqueWords.length < 4) {
      console.warn("Not enough unique words available for Task 4");
      return;
    }

    // Shuffle the unique words array to get random order
    const shuffledWords = [...uniqueWords].sort(() => Math.random() - 0.5);

    // Take first 4 words from shuffled array
    const newWords = shuffledWords.slice(0, 4);

    setTask4State({
      words: newWords,
      correct: new Set(),
      done: false,
      listening: false,
    });
  }, [vocabPool]);

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
  const task4Progress =
    task4State.words.length > 0
      ? Math.round((task4State.correct.size / task4State.words.length) * 100)
      : 0;

  const isSpeechRecognitionAvailable = !!recognitionRef.current;
  const allTasksCompleted =
    task1State.done && task2State.done && task3State.done && task4State.done;

  const handleSubmit = async () => {
    try {
      setLoading((prev) => ({ ...prev, submit: true }));
      setErrors((prev) => ({ ...prev, submit: null }));

      // Calculate scores based on task completion
      const task1Score = task1State.done ? 100 : 0;
      const task2Score = task2State.done ? task2State.fluency || 0 : 0;
      const task3Score = task3State.done ? 100 : 0;
      const task4Score = task4State.done
        ? Math.round((task4State.correct.size / task4State.words.length) * 100)
        : 0;

      const body = {
        tasks: [
          {
            taskName: "Pronunciation Practice",
            score: task1Score,
            isCorrect: task1State.done, // true when done
          },
          {
            taskName: "Phrase Repeat",
            score: task2Score,
            isCorrect: task2Score >= 65, // true when fluency >= 65
          },
          {
            taskName: "Listen & Speak",
            score: task3Score,
            isCorrect: task3State.done, // true when done
          },
          {
            taskName: "Vocabulary Challenge",
            score: task4Score,
            isCorrect: task4State.done, // true when done
          },
        ],
      };

      const res = await apiRequest("/speaking/submit-session", "POST", body);
      console.log("check Speaking submit", res);
      toast.success(res.message || "Speaking submitted successfully");
    } catch (error: any) {
      console.error(error);
      setErrors((prev) => ({
        ...prev,
        submit: "Failed to submit Speaking. Please try again.",
      }));
      toast.error("Failed to submit Speaking. Please try again.");
    } finally {
      setLoading((prev) => ({ ...prev, submit: false }));
    }
  };
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
        progressValue={`${currentTask}/4`}
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
                loading.wordsPool ? (
                  <TaskLoadingLockError
                    variant="loading"
                    title="Pronunciation Words Loading..."
                  />
                ) : errors.wordsPool ? (
                  <TaskLoadingLockError
                    variant="error"
                    title="Failed to Load Pronunciation Words"
                    onRetry={fetchWordsPool}
                  />
                ) : (
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
                )
              }
            />

            {/* Task 2 */}

            <TaskCard
              taskNumber={2}
              currentTask={currentTask}
              title="Phrase Repeat"
              description="Follow the Pronunciation"
              content={
                !task1State.done ? (
                  <TaskLoadingLockError
                    variant="locked"
                    title="Please complete previous task"
                  />
                ) : loading.phrasesPool ? (
                  <TaskLoadingLockError
                    variant="loading"
                    title="Phrases Loading..."
                  />
                ) : errors.phrasesPool ? (
                  <TaskLoadingLockError
                    variant="error"
                    title="Failed to Load Phrases"
                    onRetry={fetchPhrasesPool}
                  />
                ) : (
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
                )
              }
            />

            {/* Task 3 */}
            <TaskCard
              taskNumber={3}
              currentTask={currentTask}
              title="Listen & Speak"
              description="Sentence Repetition"
              content={
                !task2State.done ? (
                  <TaskLoadingLockError
                    variant="locked"
                    title="Please complete previous task"
                  />
                ) : loading.sentencesPool ? (
                  <TaskLoadingLockError
                    variant="loading"
                    title="Sentences Loading..."
                  />
                ) : errors.sentencesPool ? (
                  <TaskLoadingLockError
                    variant="error"
                    title="Failed to Load Sentences"
                    onRetry={fetchSentencesPool}
                  />
                ) : (
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
                )
              }
            />

            {/* Task 4 */}
            <TaskCard
              taskNumber={4}
              currentTask={currentTask}
              title="Vocabulary Challenge"
              description="Daily Word Practice"
              content={
                !task3State.done ? (
                  <TaskLoadingLockError
                    variant="locked"
                    title="Please complete previous task"
                  />
                ) : loading.vocabPool ? (
                  <TaskLoadingLockError
                    variant="loading"
                    title="Vocabulary Loading..."
                  />
                ) : errors.vocabPool ? (
                  <TaskLoadingLockError
                    variant="error"
                    title="Failed to Load Vocabulary"
                    onRetry={fetchVocabPool}
                  />
                ) : (
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
                )
              }
            />
          </div>

          <button
            onClick={handleSubmit}
            disabled={loading.submit || !allTasksCompleted}
            className={`px-12 py-4 font-semibold text-lg w-full rounded-xl ${
              !allTasksCompleted || loading.submit
                ? "bg-[#828882] opacity-50 cursor-not-allowed"
                : "bg-gradient-to-r from-yellow-400 to-pink-500 text-white cursor-pointer hover:opacity-90 transition-opacity"
            }`}>
            {loading.submit ? "Submitting speaking..." : " Submit All Answers"}
          </button>
          {/* Completion Message */}
          {allTasksCompleted && <CompletePageFooterMessage text="Done" />}
        </div>
      </div>
    </div>
  );
};

export default SpeakingTaskContent;
