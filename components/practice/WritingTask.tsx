"use client";
import React, { useState, ChangeEvent, MouseEvent } from "react";
import { FaCircleCheck } from "react-icons/fa6";
import Heading from "../shared/Heading";
import { Sparkles } from "lucide-react";
import { useAuthStore } from "@/stores/authStore";
import PracticeHero from "./PracticeHero2";
import { usePathname } from "next/navigation";

const NEXT_PUBLIC_AI_API = process.env.NEXT_PUBLIC_AI_API;
const NEXT_PUBLIC_BACKEND_API = process.env.NEXT_PUBLIC_BACKEND_API;

const words: string[] = [
  "Sports",
  "Dance",
  "Cooking",
  "Food",
  "Nature",
  "Art",
  "Movie",
  "Travel",
  "Science",
  "Gaming",
];

interface WordRelative {
  related_words: string[];
}

interface FinalFeedback {
  sentence_score: number;
  motivation: string;
}

const WritingTask = () => {
  const currentPath = usePathname();

  const [selectedWord, setSelectedWord] = useState<string | null>(null);
  const [writing, setWriting] = useState<string>("");
  const [wordReletive, setWordReletive] = useState<WordRelative | null>(null);
  const [finalFeedback, setFinalFeedback] = useState<FinalFeedback | null>(
    null
  );
  const [loadingTopic, setLoadingTopic] = useState(false);
  const [loadingFeedback, setLoadingFeedback] = useState(false);
  const [Word, setWord] = useState<any | null>(null);

  const { user, accessToken } = useAuthStore();

  // Circle settings
  const circleRadius = 45;
  const circleCircumference = 2 * Math.PI * circleRadius;

  const [categories, setCategories] = useState<any[]>([]);

  // Callback to handle data from child
  const handleCategories = (data: any) => {
    console.log("Received from child:", data);
    setCategories(data); // store data in state
  };

  // ============ SELECT WORD + SEND TO API ============
  const handleSelectedWord = async (word: string) => {
    if (selectedWord === word) {
      setSelectedWord(null);
      setWordReletive(null);
      return;
    }

    setLoadingTopic(true);
    try {
      const res = await fetch(`${NEXT_PUBLIC_AI_API}/writing/topic`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          authtoken: `${accessToken}`,
        },
        body: JSON.stringify({ topic: word, age: user?.age || 10 }),
      });

      const data: WordRelative = await res.json();
      setWordReletive(data);
      setSelectedWord(word);
    } catch (error) {
      console.error("Error fetching topic:", error);
    } finally {
      setLoadingTopic(false);
    }
  };

  // Handles writing input change
  const handleWritingChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setWriting(e.target.value);
  };

  // Handles AI Check Button click
  const handleCheckWriting = async (e: MouseEvent<HTMLButtonElement>) => {
    if (!selectedWord || writing.trim() === "") return;

    setLoadingFeedback(true);
    try {
      const res = await fetch(`${NEXT_PUBLIC_AI_API}/writing/final`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          authtoken: `${accessToken}`,
        },
        body: JSON.stringify({
          topic: selectedWord,
          related_words: wordReletive?.related_words,
          user_paragraph: writing,
        }),
      });
      const data: FinalFeedback = await res.json();

      if (res) {
        await fetch(`${NEXT_PUBLIC_BACKEND_API}/writing-Task/submit`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
          body: JSON.stringify({
            sentence_score: data?.sentence_score,
            motivation: data?.motivation,
          }),
        });
      }

      setFinalFeedback(data);
      localStorage.setItem("subscription_change_route", currentPath);
    } catch (error) {
      console.error("Error fetching final feedback:", error);
    } finally {
      setLoadingFeedback(false);
    }
  };

  // Progress circle offset
  const score = finalFeedback?.sentence_score || 0;
  const dashOffset = circleCircumference - (score / 10) * circleCircumference;

  // Button disabled conditions
  const isButtonDisabled = !selectedWord || writing.trim() === "";

  return (
    <>
      <PracticeHero
        heading="Today's Your Writing Adventure"
        subheading="Master your pronunciation with AI-powered feedback and interactive exercises designed for your success."
        specialText="Adventure"
        align="center"
        greetText={
          user
            ? `Welcome back, ${user?.firstName}!`
            : "Welcome to Writing Practice!"
        }
        streakValue="9"
        sessionTime="12:34"
        progressValue="2/4"
        goalValue="75%"
        sessionProgressWidth="60%"
        progressWidth="40%"
        goalWidth="70%"
      />

      <div className="py-20 bg-section-dark">
        <div className="app-container flex flex-col items-start gap-12 w-full">
          {/* Heading */}
          <Heading
            heading="Choose Your Writing Topic"
            subheading="Pick a topic that sparks your creativity and imagination"
            specialText="Topic"
            align="left"
          />

          <div className="w-full flex flex-col gap-8">
            {/* ============ WORD SELECTION ============ */}
            <div className="flex flex-wrap gap-4">
              {/* <WritingTopicsGenerating onSuccess={handleCategories} /> */}

              {words.map((word, idx) => (
                <button
                  key={idx}
                  className={`px-4 py-2 rounded-lg font-semibold transition duration-300
      ${
        selectedWord === word
          ? "bg-gradient-to-r from-[#FFBC6F] via-[#F176B7] to-[#3797CD]"
          : "bg-[#2D2F4A] hover:bg-gradient-to-r hover:from-[#FFBC6F] hover:via-[#F176B7] hover:to-[#3797CD]"
      }
    `}
                  onClick={() => handleSelectedWord(word)}
                  disabled={loadingTopic}>
                  {loadingTopic && selectedWord === word ? (
                    "Loading..."
                  ) : (
                    <span className="flex items-center gap-2">
                      {word}
                      {selectedWord === word && (
                        <FaCircleCheck className="text-white" />
                      )}
                    </span>
                  )}
                </button>
              ))}
            </div>

            {/* Related Words */}
            {wordReletive === null || finalFeedback ? null : (
              <div>
                <h2 className="mb-2 text-md ">Relative Words</h2>
                {wordReletive?.related_words?.map((relatedWord, idx) => (
                  <span
                    key={idx}
                    className="px-2 py-1 bg-gray-700 rounded mr-2">
                    {relatedWord}
                  </span>
                ))}
              </div>
            )}

            {/* ============ WRITING AREA ============ */}
            {finalFeedback ? null : (
              <div className="w-full bg-gradient-to-br from-[#28284A] to-[#12122A] text-white p-6 rounded-xl shadow-lg flex flex-col gap-6">
                <h1 className="text-lg md:text-xl lg:text-2xl font-semibold">
                  Your Writing Space
                </h1>
                <p className="text-sm sm:text-base text-gray-300">
                  Express your thoughts clearly & creatively. Aim for at least
                  3–4 sentences.
                </p>

                <textarea
                  value={writing}
                  onChange={handleWritingChange}
                  rows={10}
                  className="w-full p-4 text-gray-200 bg-[#3d3e5a] border-2 border-gray-600 rounded-lg focus:outline-none focus:border-gray-400 min-h-[240px]"
                  placeholder="Write your thoughts here..."
                />

                {/* AI Check Button */}
                <div className="w-full flex items-center justify-center">
                  <button
                    onClick={handleCheckWriting}
                    className={`flex items-center justify-center px-6 py-2 gap-2 rounded-xl font-bold text-lg shadow-lg
                  ${
                    isButtonDisabled || loadingFeedback
                      ? "bg-gray-500 cursor-not-allowed"
                      : "bg-gradient-to-r from-gradient-from via-gradient-via to-gradient-to text-white"
                  }`}
                    disabled={isButtonDisabled || loadingFeedback}>
                    {loadingFeedback
                      ? "Checking..."
                      : "Check My Writing with AI"}
                    <Sparkles className="w-5 h-5" />
                  </button>
                </div>
              </div>
            )}

            {/* ============ FEEDBACK SECTION ============ */}
            {finalFeedback && (
              <div className="w-full bg-[#3D3E5A] flex flex-col items-center gap-6 p-8 rounded-xl border-gray-600">
                <h1 className="text-2xl font-semibold">Great Job!</h1>

                <div className="relative flex justify-center items-center">
                  <svg
                    width="120"
                    height="120"
                    viewBox="0 0 120 120"
                    xmlns="http://www.w3.org/2000/svg">
                    <circle
                      cx="60"
                      cy="60"
                      r={circleRadius}
                      fill="none"
                      stroke="#e5e7eb"
                      strokeWidth="10"
                    />
                    <circle
                      cx="60"
                      cy="60"
                      r={circleRadius}
                      fill="none"
                      stroke="url(#gradient)"
                      strokeWidth="10"
                      strokeDasharray={circleCircumference}
                      strokeDashoffset={dashOffset}
                      strokeLinecap="round"
                    />

                    <defs>
                      <linearGradient
                        id="gradient"
                        x1="0%"
                        y1="0%"
                        x2="100%"
                        y2="100%">
                        <stop offset="0%" stopColor="#FFBC6F" />
                        <stop offset="50%" stopColor="#F176B7" />
                        <stop offset="100%" stopColor="#3797CD" />
                      </linearGradient>
                    </defs>
                  </svg>

                  <div className="absolute text-white text-2xl font-semibold">
                    {score}/10
                  </div>
                </div>

                <p className="text-gradient font-semibold">
                  {finalFeedback.motivation}
                </p>
              </div>
            )}

            {finalFeedback && (
              <div className="rounded-[16px] border-2 border-[#00C06D] bg-white/12 flex h-[147px] justify-center items-center gap-4 self-stretch">
                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-green-500 text-white">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none">
                    <path
                      d="M5 14L8.5 17.5L19 6.5"
                      stroke="white"
                      strokeWidth="3"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
                <span className="text-lg text-green-500 font-semibold">
                  Well done! You've finished today's writing session
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default WritingTask;
