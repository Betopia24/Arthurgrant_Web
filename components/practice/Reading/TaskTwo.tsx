// "use client";
// import React, { useEffect, useState } from "react";
// import { FaLock, FaCheckCircle, FaArrowRight } from "react-icons/fa";
// import TaskHeader from "@/components/shared/TaskHeader";
// import { useAuthStore } from "@/stores/authStore";
// import toast from "react-hot-toast";
// import TaskLoadingLockError from "../TaskLoadingLock";

// interface TaskResult {
//   isAnswer: boolean;
//   mark: number;
// }

// interface Task2Props {
//   taskResult: TaskResult | null;
//   onTaskComplete: (result: TaskResult | null) => void;
//   isLocked: boolean;
// }

// const Task2SightWordPractice = ({
//   taskResult,
//   onTaskComplete,
//   isLocked,
// }: Task2Props) => {
//   const { user, accessToken } = useAuthStore();
//   const [sentence, setSentence] = useState<string>("");
//   const [sightWords, setSightWords] = useState<string[]>([]);
//   const [isLoading, setIsLoading] = useState<boolean>(true);
//   const [clickedWords, setClickedWords] = useState<
//     Record<number, "correct" | "wrong">
//   >({});
//   const [showResult, setShowResult] = useState(false);

//   useEffect(() => {
//     const fetchSightWords = async () => {
//       if (isLocked) return;

//       setIsLoading(true);
//       try {
//         const res = await fetch(
//           `${process.env.NEXT_PUBLIC_AI_API}/reading/sight-word-practice/sight_words?user_id=${user?.id}`,
//           {
//             method: "POST",
//             headers: {
//               "Content-Type": "application/json",
//               authtoken: `${accessToken}`,
//             },
//             body: JSON.stringify({
//               age: user?.age.split("-")[0],
//             }),
//           }
//         );
//         const data = await res.json();

//         setSentence(data.sentence || "");
//         setSightWords(data.sight_words || []);
//       } catch (error: any) {
//         toast.error(
//           error?.data?.errorMessages?.[0]?.message || error?.data?.message
//         );
//       } finally {
//         setIsLoading(false);
//       }
//     };

//     if (user?.age && accessToken && !isLocked) {
//       fetchSightWords();
//     }
//   }, [user?.age, accessToken, isLocked]);

//   const handleWordClick = (word: string, idx: number) => {
//     if (isLocked || taskResult !== null) return;

//     const isCorrectWord = sightWords.some(
//       (sightWord) => sightWord.toLowerCase() === word.toLowerCase()
//     );

//     setClickedWords((prev) => ({
//       ...prev,
//       [idx]: isCorrectWord ? "correct" : "wrong",
//     }));
//   };

//   const correctCount = Object.values(clickedWords).filter(
//     (v) => v === "correct"
//   ).length;

//   const handleNext = () => {
//     // Calculate percentage: (correct / total) * 100
//     const totalSightWords = sightWords.length;
//     const mark =
//       totalSightWords > 0
//         ? Math.round((correctCount / totalSightWords) * 100)
//         : 0;

//     const result: TaskResult = {
//       isAnswer: true,
//       mark: mark,
//     };

//     setShowResult(true);
//     onTaskComplete(result);
//   };

//   const handleReset = () => {
//     setClickedWords({});
//     setShowResult(false);
//   };

//   return (
//     <div
//       className={`w-full bg-gradient-to-br from-[#28284A] to-[#12122A] text-white p-8 rounded-xl shadow-lg flex flex-col gap-6 relative ${
//         isLocked ? "opacity-60" : ""
//       }`}
//     >
//       {isLocked && (
//         <div className="absolute inset-0 bg-black/50 backdrop-blur-sm rounded-xl flex items-center justify-center z-10">
//           <div className="flex flex-col items-center gap-4">
//             <FaLock className="w-12 h-12 text-gray-400" />
//             <p className="text-xl font-semibold text-gray-300">
//               Complete Task 1 to unlock this task
//             </p>
//           </div>
//         </div>
//       )}

//       <TaskHeader
//         title="Sight Word Practice"
//         description="Click on all the sight words you see. Some words may appear more than once."
//         taskNumber={2}
//       />

//       {isLoading && !isLocked ? (
//         <TaskLoadingLockError variant="loading" title="Sight Word Loading.." />
//       ) : (
//         <>
//           {/* <div className="bg-[#363851] p-4 rounded-xl">
//             <p className="text-gray-300 text-center">
//               Find these sight words:{" "}
//               <span className="text-yellow-400 font-semibold">
//                 {sightWords.join(", ")}
//               </span>
//             </p>
//           </div> */}

//           <div className="flex flex-wrap items-center justify-center gap-2">
//             {sentence.split(" ").map((word, idx) => {
//               const status = clickedWords[idx];
//               const bgClass =
//                 status === "correct"
//                   ? "bg-green-500 text-white"
//                   : status === "wrong"
//                   ? "bg-red-500 text-white"
//                   : "bg-transparent";

//               return (
//                 <span
//                   key={idx}
//                   onClick={() => handleWordClick(word, idx)}
//                   className={`px-2 py-1 text-lg sm:text-xl md:text-2xl font-semibold rounded cursor-pointer select-none ${bgClass} transition-colors duration-200 ${
//                     isLocked || taskResult !== null ? "pointer-events-none" : ""
//                   }`}
//                 >
//                   {word}
//                 </span>
//               );
//             })}
//           </div>

//           <div className="w-full flex flex-col items-center justify-center gap-4">
//             <p className="text-gray-300">
//               Found {correctCount} of {sightWords.length} sight words
//             </p>

//             {!showResult && taskResult === null && (
//               <div className="flex gap-4">
//                 <button
//                   onClick={handleReset}
//                   className="px-8 py-2 font-semibold rounded-xl bg-[#33354F] border-2 border-gray-600 cursor-pointer hover:bg-[#3a3c55] transition-colors"
//                 >
//                   Reset
//                 </button>
//                 <button
//                   onClick={handleNext}
//                   disabled={Object.keys(clickedWords).length === 0}
//                   className={`flex items-center gap-2 px-8 py-2 font-semibold rounded-xl bg-gradient-to-r from-yellow-400 to-pink-500 text-white cursor-pointer hover:opacity-90 transition-opacity ${
//                     Object.keys(clickedWords).length === 0
//                       ? "opacity-50 cursor-not-allowed"
//                       : ""
//                   }`}
//                 >
//                   Next <FaArrowRight className="w-4 h-4" />
//                 </button>
//               </div>
//             )}

//             {showResult && taskResult && taskResult.mark === 100 && (
//               <div className="flex items-center gap-3 bg-green-500/20 border-2 border-green-500 rounded-xl px-6 py-3">
//                 <FaCheckCircle className="w-6 h-6 text-green-500" />
//                 <span className="text-green-500 font-semibold text-lg">
//                   Perfect! You found all sight words! (100/100)
//                 </span>
//               </div>
//             )}

//             {showResult && taskResult && taskResult.mark < 100 && (
//               <div className="flex items-center gap-3 bg-yellow-500/20 border-2 border-yellow-500 rounded-xl px-6 py-3">
//                 <span className="text-yellow-500 font-semibold text-lg">
//                   You found {correctCount} out of {sightWords.length} sight
//                   words ({taskResult.mark}/100)
//                 </span>
//               </div>
//             )}
//           </div>
//         </>
//       )}
//     </div>
//   );
// };

// export default Task2SightWordPractice;


"use client";
import React, { useEffect, useState } from "react";
import { FaLock, FaCheckCircle, FaArrowRight, FaArrowLeft } from "react-icons/fa";
import TaskHeader from "@/components/shared/TaskHeader";
import { useAuthStore } from "@/stores/authStore";
import toast from "react-hot-toast";
import TaskLoadingLockError from "../TaskLoadingLock";

interface TaskResult {
  isAnswer: boolean;
  mark: number;
}

interface Task2Props {
  taskResult: TaskResult | null;
  onTaskComplete: (result: TaskResult | null) => void;
  isLocked: boolean;
}

interface SightWordItem {
  word: string;
  definition: string[];
  sentence: string;
  quiz: string[];
  answer: string;
}

const Task2SightWordPractice = ({
  taskResult,
  onTaskComplete,
  isLocked,
}: Task2Props) => {
  const { user, accessToken } = useAuthStore();
  const [items, setItems] = useState<SightWordItem[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [showResult, setShowResult] = useState(false);
  const [correctAnswers, setCorrectAnswers] = useState<number>(0);

  // Helper function to normalize and create pattern from sentence
  const createPattern = (str: string) => {
    // Remove the sight word and any punctuation, create a pattern
    // Convert to lowercase and remove extra spaces
    return str
      .toLowerCase()
      .replace(/[.,!?;:]/g, '')
      .replace(/\s+/g, ' ')
      .trim();
  };

  // Helper function to remove underscores and normalize
  const normalizeWithoutBlanks = (str: string) => {
    return str
      .replace(/_{2,}/g, '')
      .toLowerCase()
      .replace(/[.,!?;:]/g, '')
      .replace(/\s+/g, ' ')
      .trim();
  };

  useEffect(() => {
    const fetchSightWords = async () => {
      if (isLocked) return;

      setIsLoading(true);
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_AI_API}/reading/sight-word-practice/sight_words?user_id=${user?.id}`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              authtoken: `${accessToken}`,
            },
            body: JSON.stringify({
              age: user?.age.split("-")[0],
            }),
          }
        );
        const data = await res.json();
        console.log("Sight Word Practice API Response:", data);
        setItems(data.response || []);
      } catch (error: any) {
        console.error("Failed to load sight words", error);
        toast.error(
          error?.data?.errorMessages?.[0]?.message || error?.data?.message || "Failed to load sight words"
        );
      } finally {
        setIsLoading(false);
      }
    };

    if (user?.age && accessToken && !isLocked) {
      fetchSightWords();
    }
  }, [user?.age, accessToken, isLocked, user?.id]);

  const currentItem = items[currentIndex];

  // Handle answer selection
  const handleAnswerClick = (quizOption: string) => {
    if (taskResult !== null || showResult) return;

    setSelectedAnswer(quizOption);

    // Remove blanks and sight word, then compare the remaining pattern
    const selectedNormalized = normalizeWithoutBlanks(quizOption);
    const correctAnswer = createPattern(currentItem.answer);
    const correctWithoutWord = correctAnswer.replace(currentItem.word.toLowerCase(), '').replace(/\s+/g, ' ').trim();
    
    console.log("Selected (normalized):", selectedNormalized);
    console.log("Correct pattern:", correctWithoutWord);
    
    const isCorrect = selectedNormalized === correctWithoutWord;

    if (isCorrect) {
      setCorrectAnswers((prev) => prev + 1);
    }

    setShowResult(true);
  };

  // Handle previous
  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      setSelectedAnswer(null);
      setShowResult(false);
    }
  };

  // Handle next
  const handleNext = () => {
    if (currentIndex < items.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setSelectedAnswer(null);
      setShowResult(false);
    } else {
      // Last item - complete the task
      const totalItems = items.length;
      const mark = totalItems > 0 ? Math.round((correctAnswers / totalItems) * 100) : 0;

      const result: TaskResult = {
        isAnswer: true,
        mark: mark,
      };

      onTaskComplete(result);
    }
  };

  return (
    <div
      className={`w-full bg-gradient-to-br from-[#28284A] to-[#12122A] text-white p-8 rounded-xl shadow-lg flex flex-col gap-6 relative ${
        isLocked ? "opacity-60" : ""
      }`}
    >
      {isLocked && (
        <div className="absolute inset-0 bg-black/50 backdrop-blur-sm rounded-xl flex items-center justify-center z-10">
          <div className="flex flex-col items-center gap-4">
            <FaLock className="w-12 h-12 text-gray-400" />
            <p className="text-xl font-semibold text-gray-300">
              Complete Task 1 to unlock this task
            </p>
          </div>
        </div>
      )}

      <TaskHeader
        title="Sight Word Practice"
        description="Learn sight words with definitions and practice with quizzes"
        taskNumber={2}
      />

      {isLoading && !isLocked ? (
        <TaskLoadingLockError variant="loading" title="Sight Word Loading.." />
      ) : (
        <>
          {currentItem && (
            <div className="space-y-6">
              {/* Word and Definition Section */}
              <div className="bg-[#363851] p-6 rounded-xl space-y-4">
                <div>
                  <h3 className="text-gray-400 text-sm mb-2">Sight Word:</h3>
                  <p className="text-yellow-400 font-bold text-3xl capitalize">
                    {currentItem.word}
                  </p>
                </div>

                <div>
                  <h3 className="text-gray-400 text-sm mb-2">Definition:</h3>
                  <ul className="list-disc list-inside space-y-1">
                    {currentItem.definition.map((def, idx) => (
                      <li key={idx} className="text-white text-lg">
                        {def}
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h3 className="text-gray-400 text-sm mb-2">Example Sentence:</h3>
                  <p className="text-white text-lg italic">"{currentItem.sentence}"</p>
                </div>
              </div>

              {/* Quiz Section */}
              <div className="space-y-4">
                <h3 className="text-white font-semibold text-xl">
                  Choose the correct sentence:
                </h3>

                <div className="space-y-3">
                  {currentItem.quiz.map((quizOption, idx) => {
                    const isSelected = selectedAnswer === quizOption;
                    const selectedNormalized = normalizeWithoutBlanks(quizOption);
                    const correctAnswer = createPattern(currentItem.answer);
                    const correctWithoutWord = correctAnswer.replace(currentItem.word.toLowerCase(), '').replace(/\s+/g, ' ').trim();
                    const isCorrect = selectedNormalized === correctWithoutWord;

                    let bgClass = "bg-[#363851] hover:bg-[#4a4d6e]";
                    if (showResult && isSelected) {
                      bgClass = isCorrect
                        ? "bg-green-500/50 border-2 border-green-500"
                        : "bg-red-500/50 border-2 border-red-500";
                    }

                    return (
                      <button
                        key={idx}
                        onClick={() => handleAnswerClick(quizOption)}
                        disabled={taskResult !== null || showResult}
                        className={`w-full p-4 rounded-xl text-left text-white text-lg font-medium transition-all ${bgClass} ${
                          taskResult !== null || showResult
                            ? "cursor-not-allowed"
                            : "cursor-pointer"
                        }`}
                      >
                        {quizOption}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Result Message */}
              {showResult && selectedAnswer && (
                <div className="flex items-center justify-center">
                  {(() => {
                    const selectedNormalized = normalizeWithoutBlanks(selectedAnswer);
                    const correctAnswer = createPattern(currentItem.answer);
                    const correctWithoutWord = correctAnswer.replace(currentItem.word.toLowerCase(), '').replace(/\s+/g, ' ').trim();
                    const isCorrect = selectedNormalized === correctWithoutWord;
                    
                    return isCorrect ? (
                      <div className="flex items-center gap-3 bg-green-500/20 border-2 border-green-500 rounded-xl px-6 py-3">
                        <FaCheckCircle className="w-6 h-6 text-green-500" />
                        <span className="text-green-500 font-semibold text-lg">
                          Correct! Great job!
                        </span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-3 bg-red-500/20 border-2 border-red-500 rounded-xl px-6 py-3">
                        <span className="text-red-500 font-semibold text-lg">
                          Wrong! The correct answer is: "{currentItem.answer}"
                        </span>
                      </div>
                    );
                  })()}
                </div>
              )}

              {/* Navigation */}
              <div className="flex items-center justify-between pt-4">
                <button
                  onClick={handlePrevious}
                  disabled={currentIndex === 0}
                  className="flex items-center gap-2 px-6 py-2 font-semibold rounded-xl bg-[#33354F] border-2 border-gray-600 cursor-pointer hover:bg-[#3a3c55] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <FaArrowLeft className="w-4 h-4" /> Previous
                </button>

                <span className="text-gradient font-semibold text-lg">
                  {currentIndex + 1} of {items.length}
                </span>

                <button
                  onClick={handleNext}
                  disabled={!showResult}
                  className={`flex items-center gap-2 px-6 py-2 font-semibold rounded-xl bg-gradient-to-r from-yellow-400 to-pink-500 text-white cursor-pointer hover:opacity-90 transition-opacity ${
                    !showResult ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                >
                  {currentIndex === items.length - 1 ? "Finish" : "Next"}{" "}
                  <FaArrowRight className="w-4 h-4" />
                </button>
              </div>

              {/* Score Display */}
              <div className="text-center text-gray-400 text-sm">
                Correct Answers: {correctAnswers} / {currentIndex + 1}
              </div>
            </div>
          )}

          {/* Final Result */}
          {taskResult !== null && (
            <div className="flex items-center justify-center">
              {taskResult.mark === 100 ? (
                <div className="flex items-center gap-3 bg-green-500/20 border-2 border-green-500 rounded-xl px-6 py-3">
                  <FaCheckCircle className="w-6 h-6 text-green-500" />
                  <span className="text-green-500 font-semibold text-lg">
                    Perfect! You got all {items.length} correct! (100/100)
                  </span>
                </div>
              ) : (
                <div className="flex items-center gap-3 bg-yellow-500/20 border-2 border-yellow-500 rounded-xl px-6 py-3">
                  <span className="text-yellow-500 font-semibold text-lg">
                    You got {correctAnswers} out of {items.length} correct ({taskResult.mark}/100)
                  </span>
                </div>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Task2SightWordPractice;