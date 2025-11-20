"use client";
import React, { useState, ChangeEvent, MouseEvent } from "react";
import { FaCircleCheck } from "react-icons/fa6";
import Heading from "../shared/Heading";
import { Sparkles } from "lucide-react";
import PracticeHero from "./PracticeHero2";

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

interface Feedback {
  message: string;
  score: number;
}

const WritingTask = () => {
  const [selectedWords, setSelectedWords] = useState<string[]>([]);
  const [writing, setWriting] = useState<string>("");
  const [feedback, setFeedback] = useState<Feedback | null>(null);
  const [score, setScore] = useState<number | null>(null);

  // Circle settings
  const circleRadius = 45;
  const circleCircumference = 2 * Math.PI * circleRadius;

  // Handles word selection
  const handleWordSelect = (word: string): void => {
    setSelectedWords((prevWords) =>
      prevWords.includes(word)
        ? prevWords.filter((w) => w !== word)
        : [...prevWords, word]
    );
  };

  // Handles writing input change
  const handleWritingChange = (e: ChangeEvent<HTMLTextAreaElement>): void => {
    setWriting(e.target.value);
  };

  // Handles AI Check Button click
  const handleCheckWriting = (e: MouseEvent<HTMLButtonElement>): void => {
    // Log the selected words and writing to the console
    console.log("Selected Words: ", selectedWords);
    console.log("User's Writing: ", writing);

    // Simulate AI check with a dummy score and feedback
    const dummyScore = Math.floor(Math.random() * 10) + 1; // Random score between 1 and 10
    setScore(dummyScore);

    // Dummy feedback message
    setFeedback({
      message: `Your writing progress is amazing! Keep it up...`,
      score: dummyScore,
    });
  };

  // Calculate the dashoffset based on the score
  const dashOffset = score
    ? circleCircumference - (score / 10) * circleCircumference
    : 0;

  // Both word selection and writing are required to enable the button
  const isButtonDisabled = selectedWords.length === 0 || writing.trim() === "";

  return (
    <>
      <PracticeHero
        heading="Today's Your Writing Adventure"
        subheading="Master your pronunciation with AI-powered feedback and interactive exercises designed for your success."
        specialText="Adventure"
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
            {/* Word Selection */}
            <div className="flex flex-wrap gap-4">
              {words.map((word, idx) => (
                <button
                  key={idx}
                  className={`px-4 py-2 rounded-lg 
        border-gray-500 font-semibold cursor-pointer 
        transition duration-300 ease-in-out
        ${
          selectedWords.includes(word)
            ? "bg-gradient-to-r from-[#FFBC6F] via-[#F176B7] to-[#3797CD]" // Selected word gradient
            : "bg-[#2D2F4A] hover:bg-gradient-to-r hover:from-[#FFBC6F] hover:via-[#F176B7] hover:to-[#3797CD]"
        } // Default non-selected hover
      `}
                  onClick={() => handleWordSelect(word)}>
                  {word}
                </button>
              ))}
            </div>

            {/* Task */}
            <div className="w-full bg-gradient-to-br from-[#28284A] to-[#12122A] text-white p-6 rounded-xl shadow-lg flex flex-col gap-6">
              <div className="flex flex-col gap-0">
                <h1 className="text-lg md:text-xl lg:text-2xl font-semibold">
                  Your Writing Space
                </h1>
                <p className="text-sm sm:text-base text-gray-300">
                  Express your thoughts clearly & creatively, Aim for at least
                  3-4 sentences
                </p>
              </div>

              {/* Textarea for Writing */}
              <textarea
                value={writing}
                onChange={handleWritingChange}
                rows={10}
                className="w-full p-4 text-gray-200 bg-[#3d3e5a] border-2 border-gray-600 rounded-lg focus:outline-none focus:border-gray-400 min-h-[240px]"
                placeholder="Try to describe your thoughts clearly in at leat 3-4 sentences..."
              />

              {/* AI Check Button */}
              <div className="w-full flex items-center justify-center">
                <button
                  onClick={handleCheckWriting}
                  className={`flex items-center justify-center px-6 py-2 gap-2 rounded-xl font-bold text-sm sm:text-base md:text-lg cursor-pointer shadow-lg transition duration-300 ease-in-out
                  ${
                    isButtonDisabled
                      ? "bg-gray-500 cursor-not-allowed"
                      : "bg-gradient-to-r from-gradient-from via-gradient-via to-gradient-to text-white"
                  }`}
                  disabled={isButtonDisabled}>
                  Check My Writing with AI
                  <Sparkles className="w-4 h-4 sm:w-5 sm:h-5" />
                </button>
              </div>
            </div>

            {/* Progress Feedback - Only show after AI Check */}
            {feedback && (
              <div className="w-full bg-[#3D3E5A] flex items-center flex-col gap-6 p-8 rounded-xl border-gray-600">
                <h1 className="text-xl sm:text-2xl font-semibold">
                  Great Job!
                </h1>
                <div className="w-full flex justify-center items-center">
                  {/* Circle Progress Bar with Score */}
                  <svg
                    width="120"
                    height="120"
                    viewBox="0 0 120 120"
                    xmlns="http://www.w3.org/2000/svg"
                    className="relative">
                    {/* Background Circle */}
                    <circle
                      cx="60"
                      cy="60"
                      r={circleRadius}
                      fill="none"
                      stroke="#e5e7eb"
                      strokeWidth="10"
                    />
                    {/* Progress Circle */}
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
                    {/* Gradient Definition */}
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

                  {/* Score Display */}
                  <div className="absolute text-white text-2xl font-semibold">
                    {score}/10
                  </div>
                </div>
                <p className="inline-block text-gradient font-semibold">
                  {feedback.message}
                </p>
              </div>
            )}
          </div>

          {/* Completion message */}
          {feedback && (
            <div className="w-full flex items-center justify-center gap-3 border-2 border-green-500 rounded-xl p-6 bg-[#1a2a1a]">
              <div className="flex items-center justify-center w-8 h-8 rounded-full bg-green-500 text-white">
                <FaCircleCheck className="w-5 h-5 text-white" />
              </div>
              <span className="text-lg text-green-500 font-semibold">
                Well done! You've finished today's writing session
              </span>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default WritingTask;
