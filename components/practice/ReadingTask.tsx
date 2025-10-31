"use client";
import React, { useState } from "react";
import Heading from "../shared/Heading";
import { BiVolumeFull } from "react-icons/bi";
import { FaCheckCircle } from "react-icons/fa";
import TaskHeader from "../shared/TaskHeader";

const ReadingTask = () => {
  // Task 01 state
  const [assembledWord, setAssembledWord] = useState("");
  const letters = ["A", "B", "C"];

  const handlePlayLetter = (letter: string) => {
    const utterance = new SpeechSynthesisUtterance(letter);
    utterance.lang = "en-US";
    utterance.pitch = 1;
    utterance.rate = 1;
    speechSynthesis.speak(utterance);
    setAssembledWord((prev) => prev + letter);
  };

  // Task 02 state
  const sentence = "The cat sat on the mat";
  const sightWords = ["cat", "mat"];
  const [clickedWords, setClickedWords] = useState<
    Record<number, "correct" | "wrong">
  >({});

  const handleWordClick = (word: string, idx: number) => {
    setClickedWords((prev) => ({
      ...prev,
      [idx]: sightWords.includes(word.toLowerCase()) ? "correct" : "wrong",
    }));
  };

  const correctCount = Object.values(clickedWords).filter(
    (v) => v === "correct"
  ).length;

  // Task 03 state
  const wordCardsInitial = [
    { id: "dog", word: "Dog", bg: "from-yellow-300 to-yellow-500" },
    { id: "apple", word: "Apple", bg: "from-pink-300 to-pink-500" },
    { id: "sun", word: "Sun", bg: "from-sky-300 to-sky-500" },
  ];

  const pictureCardsInitial = [
    { id: "dog", src: "/dog.png", word: "", matched: false },
    { id: "apple", src: "/apple.png", word: "", matched: false },
    { id: "sun", src: "/sun.png", word: "", matched: false },
  ];

  const [wordCards, setWordCards] = useState(wordCardsInitial);
  const [pictureCards, setPictureCards] = useState(pictureCardsInitial);

  const handleDragStart = (e: React.DragEvent<HTMLDivElement>, id: string) => {
    e.dataTransfer.setData("text/plain", id);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>, picId: string) => {
    const wordId = e.dataTransfer.getData("text");
    const wordCard = wordCards.find((w) => w.id === wordId);
    if (!wordCard) return;

    setPictureCards((prev) =>
      prev.map((pic) =>
        pic.id === picId
          ? {
              ...pic,
              matched: pic.id === wordId,
              word: wordCard.word,
            }
          : pic
      )
    );

    if (wordId === picId) {
      setWordCards((prev) => prev.filter((w) => w.id !== wordId));
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const correctDropCount = pictureCards.filter((p) => p.matched).length;

  return (
    <div className="py-20 bg-section-dark">
      <div className="app-container flex flex-col items-start gap-12 w-full">
        {/* Heading */}
        <Heading
          heading="Reading Tasks"
          subheading="Complete each task to improve your English reading skill"
          specialText="Tasks"
          align="left"
        />

        {/* Task 01 */}
        <div className="w-full bg-gradient-to-br from-[#28284A] to-[#12122A] text-white p-8 rounded-xl shadow-lg flex flex-col gap-6">
          <TaskHeader
            title="Phoneme Flashcards"
            description="Click the cards to hear the sound"
            taskNumber={1}
          />

          <div className="flex gap-6">
            {letters.map((letter, idx) => {
              const bgGradient =
                idx === 0
                  ? "from-yellow-300 to-yellow-500"
                  : idx === 1
                  ? "from-pink-300 to-pink-500"
                  : "from-sky-300 to-sky-500";
              return (
                <button
                  key={idx}
                  onClick={() => handlePlayLetter(letter)}
                  className={`flex-1 p-6 rounded-xl bg-gradient-to-br ${bgGradient} text-white font-bold text-2xl shadow-lg flex flex-col items-center justify-center gap-2 cursor-pointer`}
                >
                  {letter} <BiVolumeFull className="w-6 h-6" />
                </button>
              );
            })}
          </div>

          <div className="bg-[#363851] p-8 rounded-xl flex flex-col items-center justify-center gap-4 w-full">
            <h2 className="text-white font-semibold text-lg">
              Now spell the word:
            </h2>
            <div className="px-6 py-2 border border-gray-500 bg-[#4F5167] rounded-xl text-3xl font-bold text-gradient flex flex-wrap gap-2 justify-center">
              {(assembledWord.split("") || ["_"]).map((letter, idx) => (
                <span key={idx}>{letter}</span>
              ))}
            </div>

            <button className="mt-4 px-8 py-2 font-semibold rounded-xl text-gradient bg-[#33354F] border-2 border-gray-600 cursor-pointer">
              Perfect Go to Next Challenge
            </button>
          </div>
        </div>

        {/* Task 02 */}
        <div className="w-full bg-gradient-to-br from-[#28284A] to-[#12122A] text-white p-8 rounded-xl shadow-lg flex flex-col gap-6">
          <TaskHeader
            title="Sight Word Practice"
            description="Click on all the sight words you see. Some words may appear more than once."
            taskNumber={2}
          />

          <div className="flex flex-wrap items-center justify-center gap-2">
            {sentence.split(" ").map((word, idx) => {
              const status = clickedWords[idx];
              const bgClass =
                status === "correct"
                  ? "bg-green-500 text-white"
                  : status === "wrong"
                  ? "bg-red-500 text-white"
                  : "bg-transparent";

              return (
                <span
                  key={idx}
                  onClick={() => handleWordClick(word, idx)}
                  className={`px-2 py-1 text-lg sm:text-xl md:text-2xl font-semibold rounded cursor-pointer select-none ${bgClass} transition-colors duration-200`}
                >
                  {word}
                </span>
              );
            })}
          </div>

          <div className="w-full flex flex-col items-center justify-center gap-4">
            <button className="mt-4 px-8 py-2 font-semibold rounded-xl text-gradient bg-[#33354F] border-2 border-gray-600 cursor-pointer">
              Nice! You found {correctCount} of {sightWords.length} sight words!
            </button>
          </div>
        </div>

        {/* Task 03 */}
        <div className="w-full bg-gradient-to-br from-[#28284A] to-[#12122A] text-white p-8 rounded-xl shadow-lg flex flex-col gap-6">
          <TaskHeader
            title="Drag & Match Words"
            description="Drag the word onto the correct picture"
            taskNumber={3}
          />

          <div className="grid grid-cols-2 gap-4 w-full">
            {/* Word Cards */}
            <div className="flex flex-col gap-3">
              <h2 className="font-semibold mb-2">Words</h2>
              {wordCards.map((card) => (
                <div
                  key={card.id}
                  draggable
                  onDragStart={(e) => handleDragStart(e, card.id)}
                  className={`p-4 rounded-xl bg-gradient-to-br ${card.bg} text-white text-lg font-bold shadow-lg cursor-move flex items-center justify-center h-24 sm:h-28`}
                >
                  {card.word}
                </div>
              ))}
            </div>

            {/* Picture Cards */}
            <div className="flex flex-col gap-3">
              <h2 className="font-semibold mb-2">Pictures</h2>
              {pictureCards.map((pic) => (
                <div
                  key={pic.id}
                  onDrop={(e) => handleDrop(e, pic.id)}
                  onDragOver={handleDragOver}
                  className={`relative p-2 h-24 sm:h-28 border-2 border-dashed border-gray-500 rounded-xl flex items-center justify-center transition-colors duration-200 ${
                    pic.matched
                      ? "bg-green-500"
                      : pic.word
                      ? "bg-red-500"
                      : "bg-gray-700"
                  }`}
                >
                  <img
                    src={pic.src}
                    alt={pic.id}
                    className="h-full object-contain"
                  />
                  <span className="absolute bottom-1 text-sm text-white">
                    {pic.matched || pic.word ? pic.word : "Drop word here"}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="w-full flex flex-col items-center justify-center gap-4">
            <button className="mt-4 px-8 py-2 font-semibold rounded-xl text-gradient bg-[#33354F] border-2 border-gray-600 cursor-pointer">
              {pictureCards.filter((p) => p.matched).length} of{" "}
              {pictureCards.length} correct!
            </button>
          </div>
        </div>

        {/* Task 04 */}
        <div className="w-full bg-gradient-to-br from-[#28284A] to-[#12122A] text-white p-8 rounded-xl shadow-lg flex flex-col gap-6">
          <TaskHeader
            title="Reading Comprehension"
            description="Read the passage and answer the questions"
            taskNumber={4}
          />

          {/* Responsive 2-column layout */}
          <div className="flex flex-col lg:flex-row gap-6 w-full">
            {/* Left Column: Passage */}
            <div className="lg:w-1/2 bg-[#363851] p-6 rounded-xl flex flex-col gap-4">
              <div className="w-full flex items-center justify-center">
                <h2 className="text-xl font-semibold text-gradient text-center">
                  Tom's Adventure
                </h2>
              </div>

              <p className="text-gray-200 text-base sm:text-lg">
                Tom went on an adventurous journey through the mountains. He
                encountered many challenges but also learned important lessons
                about courage and friendship. Along the way, he met new friends
                and discovered hidden places that few had ever seen.
              </p>
              <img
                src="/passage-01.png"
                alt="Passage illustration"
                className="w-full h-auto object-contain rounded-xl"
              />
            </div>

            {/* Right Column: Questions */}
            <div className="lg:w-1/2 flex flex-col gap-6">
              {[
                {
                  question: "Where did Tom go on his adventure?",
                  options: ["City", "Mountains", "Beach", "Forest"],
                },
                {
                  question: "What did Tom learn on his journey?",
                  options: [
                    "Courage and friendship",
                    "How to swim",
                    "Cooking skills",
                    "Painting",
                  ],
                },
              ].map((q, idx) => (
                <div
                  key={idx}
                  className="bg-[#363851] p-4 rounded-xl flex flex-col gap-3"
                >
                  <h3 className="text-lg font-semibold">
                    {idx + 1}. {q.question}
                  </h3>
                  <div className="flex flex-col gap-2">
                    {q.options.map((opt, optIdx) => (
                      <label
                        key={optIdx}
                        className="flex items-center gap-3 cursor-pointer"
                      >
                        <input
                          type="radio"
                          name={`question-${idx}`}
                          className="appearance-none w-5 h-5 border-2 border-gray-500 rounded-full checked:border-0 checked:bg-gradient-to-r checked:from-yellow-300 checked:to-pink-500 transition-all duration-200"
                        />
                        <span className="text-gray-200">{opt}</span>
                      </label>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Submit Button */}
          <div className="w-full flex flex-col items-center justify-center gap-4">
            <button className="mt-4 px-8 py-2 font-semibold rounded-xl text-gradient bg-[#33354F] border-2 border-gray-600 cursor-pointer">
              Submit All Answers
            </button>
          </div>
        </div>

        {/* Complemetion message */}
        <div className="w-full flex items-center justify-center gap-3 border-2 border-green-500 rounded-xl p-6 bg-[#1a2a1a]">
          <div className="flex items-center justify-center w-8 h-8 rounded-full bg-green-500 text-white">
            <FaCheckCircle className="w-5 h-5 text-white" />
          </div>
          <span className="text-lg text-green-500 font-semibold">
            Well done Jobair! You've finished today's reading session
          </span>
        </div>
      </div>
    </div>
  );
};

export default ReadingTask;
