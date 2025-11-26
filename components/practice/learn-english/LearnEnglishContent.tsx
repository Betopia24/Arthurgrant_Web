"use client";

import CompletePageFooterMessage from "@/components/shared/CompletePageFooterMessage";
import Heading from "@/components/shared/Heading";
import { useAuthStore } from "@/stores/authStore";
import { useEffect, useRef, useState } from "react";
import PracticeHero from "../PracticeHero2";
import AuditoryDiscrimination from "./AuditoryDiscrimination";
import PhonemeGraphemeMapping from "./PhonemeGraphemeMapping";
import PhraseMaker from "./PhraseMaker";
import SentenceBuilder from "./SentenceBuilder";
import WordFlash from "./WordFlash";
import WordPartsWorkshop from "./WordPartsWorkshop";
import "./gradient-button.css";

interface TaskResult {
  isAnswer: boolean;
  marks: number;
}

const LearnEnglishContent = () => {
  const { user, accessToken } = useAuthStore();

  // Time tracking
  const startTimeRef = useRef<number>(Date.now());
  const [timeSpent, setTimeSpent] = useState<number>(0);
  const submitButtonRef = useRef<HTMLDivElement>(null);

  // ALL TASKS RESULTS STATE with marks
  const [taskResults, setTaskResults] = useState<{
    task1: TaskResult | null;
    task2: TaskResult | null;
    task3: TaskResult | null;
    task4: TaskResult | null;
    task5: TaskResult | null;
    task6: TaskResult | null;
  }>({
    task1: null,
    task2: null,
    task3: null,
    task4: null,
    task5: null,
    task6: null,
  });

  // Track which tasks have been completed
  const [taskCompleted, setTaskCompleted] = useState({
    task1: false,
    task2: false,
    task3: false,
    task4: false,
    task5: false,
    task6: false,
  });

  // Submission state
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  

  // Update time spent every second
  useEffect(() => {
    const interval = setInterval(() => {
      setTimeSpent(Math.floor((Date.now() - startTimeRef.current) / 1000));
    }, 1000);

    return () => clearInterval(interval);
  }, []);





  // Task completion handlers
  const handleTask1Complete = (result: TaskResult | null) => {
    console.log("Task 1 completed with result:", result);
    setTaskResults((prev) => ({ ...prev, task1: result }));
    if (result !== null) {
      setTaskCompleted((prev) => ({ ...prev, task1: true }));
    }
  };

  const handleTask2Complete = (result: TaskResult | null) => {
    console.log("Task 2 completed with result:", result);
    setTaskResults((prev) => ({ ...prev, task2: result }));
    if (result !== null) {
      setTaskCompleted((prev) => ({ ...prev, task2: true }));
    }
  };

  const handleTask3Complete = (result: TaskResult | null) => {
    console.log("Task 3 completed with result:", result);
    setTaskResults((prev) => ({ ...prev, task3: result }));
    if (result !== null) {
      setTaskCompleted((prev) => ({ ...prev, task3: true }));
    }
  };

  const handleTask4Complete = (result: TaskResult | null) => {
    console.log("Task 4 completed with result:", result);
    setTaskResults((prev) => ({ ...prev, task4: result }));
    if (result !== null) {
      setTaskCompleted((prev) => ({ ...prev, task4: true }));
    }
  };

  const handleTask5Complete = (result: TaskResult | null) => {
    console.log("Task 5 completed with result:", result);
    setTaskResults((prev) => ({ ...prev, task5: result }));
    if (result !== null) {
      setTaskCompleted((prev) => ({ ...prev, task5: true }));
    }
  };

  const handleTask6Complete = (result: TaskResult | null) => {
    console.log("Task 6 completed with result:", result);
    setTaskResults((prev) => ({ ...prev, task6: result }));
    if (result !== null) {
      setTaskCompleted((prev) => ({ ...prev, task6: true }));

      // Scroll to submit button when last task is completed
      setTimeout(() => {
        submitButtonRef.current?.scrollIntoView({
          behavior: "smooth",
          block: "center",
        });
      }, 500);
    }
  };

  // Check if all tasks are completed
  const allTasksCompleted =
    taskCompleted.task1 &&
    taskCompleted.task2 &&
    taskCompleted.task3 &&
    taskCompleted.task4 &&
    taskCompleted.task5 &&
    taskCompleted.task6;

  // Format time for display (MM:SS)
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  };



  // Handle final submission
  const handleSubmitAllAnswers = async () => {
    console.log("Submit button clicked!");
    console.log("Current task results:", taskResults);
    console.log("Current task completed:", taskCompleted);

    setIsSubmitting(true);

    // Calculate final time spent
    const finalTimeSpent = Math.floor(
      (Date.now() - startTimeRef.current) / 1000
    );

    
    const submissionData = {
      tasks: [
        {
          taskName: "Auditory Discrimination",
          isAnswer: taskResults.task1?.isAnswer || false,
          marks: taskResults.task1?.marks || 0,
        },
        {
          taskName: "Phoneme Grapheme Mapping",
          isAnswer: taskResults.task2?.isAnswer || false,
          marks: taskResults.task2?.marks || 0,
        },
        {
          taskName: "Word Flash",
          isAnswer: taskResults.task3?.isAnswer || false,
          marks: taskResults.task3?.marks || 0,
        },
        {
          taskName: "Word Parts Workshop",
          isAnswer: taskResults.task4?.isAnswer || false,
          marks: taskResults.task4?.marks || 0,
        },
        {
          taskName: "Phrase Maker",
          isAnswer: taskResults.task5?.isAnswer || false,
          marks: taskResults.task5?.marks || 0,
        },
        {
          taskName: "Sentence Builder",
          isAnswer: taskResults.task6?.isAnswer || false,
          marks: taskResults.task6?.marks || 0,
        },
      ],
      timeSpent: finalTimeSpent,
    };

    console.log("===== SUBMISSION DATA =====");
    console.log(JSON.stringify(submissionData, null, 2));
    console.log("===========================");

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_AI_API}/adult/submit_adult_tasks`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            authtoken: `${accessToken}`,
          },
          body: JSON.stringify(submissionData),
        }
      );
      const data = await res.json();
      console.log("===== SUBMISSION RESPONSE =====");
      console.log(JSON.stringify(data, null, 2));
      console.log("===============================");
      setIsSubmitted(true);
    } catch (error) {
      console.error("===== SUBMISSION ERROR =====");
      console.error(error);
      console.error("============================");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-section-dark">
      <PracticeHero
        heading="Master English Like a Professional"
        subheading="Structured activities designed for adult learners. Build confidence in speaking, listening, and communication."
        specialText="Professional"
        align="center"
        greetText={`Hi ${user?.firstName || "there"}!`}
        streakValue="9"
        sessionTime={formatTime(timeSpent)}
        progressValue={`${
          Object.values(taskCompleted).filter((t) => t === true).length
        }/6`}
        goalValue="75%"
        sessionProgressWidth="60%"
        progressWidth={`${
          (Object.values(taskCompleted).filter((t) => t === true).length / 6) *
          100
        }%`}
        goalWidth="70%"
      />

      <div className="py-12 lg:py-20">
        <div className="app-container flex flex-col gap-8 lg:gap-12 w-full">
          {/* Header with Progress */}
          <Heading
            heading="Adult Language Learning Tasks"
            subheading="Complete each task to improve your english"
            specialText="Tasks"
            align="left"
          />

          {/* Tasks Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
            <AuditoryDiscrimination
              taskResult={taskResults.task1}
              onTaskComplete={handleTask1Complete}
            />
            <PhonemeGraphemeMapping
            taskResult={taskResults.task2}
            onTaskComplete={handleTask2Complete}
            />
            <WordFlash
            // taskResult={taskResults.task3}
            // onTaskComplete={handleTask3Complete}
            />
            <WordPartsWorkshop
            // taskResult={taskResults.task4}
            // onTaskComplete={handleTask4Complete}
            />
            <PhraseMaker
            // taskResult={taskResults.task5}
            // onTaskComplete={handleTask5Complete}
            />
            <SentenceBuilder
            // taskResult={taskResults.task6}
            // onTaskComplete={handleTask6Complete}
            />
          </div>

          {/* Submit All Button */}
          <div
            ref={submitButtonRef}
            className="w-full flex flex-col items-center justify-center gap-4"
          >
            <button
              onClick={handleSubmitAllAnswers}
              disabled={!allTasksCompleted || isSubmitting || isSubmitted}
              className={`px-12 py-4 font-semibold text-lg rounded-2xl ${
                !allTasksCompleted || isSubmitting || isSubmitted
                  ? "bg-[#828882] opacity-50 cursor-not-allowed"
                  : "bg-gradient-brand text-white cursor-pointer hover:brightness-110 transition-all"
              }`}
            >
              {isSubmitting
                ? "Submitting..."
                : isSubmitted
                ? "Submitted!"
                : "Submit All Answers"}
            </button>
            {!allTasksCompleted && (
              <p className="text-gray-400 text-sm">
                Complete all 6 tasks to submit your answers
              </p>
            )}
            {isSubmitted && (
              <p className="text-green-400 text-sm">
                Time taken: {formatTime(timeSpent)}
              </p>
            )}
          </div>

          {/* Completion Message */}
          {isSubmitted && (
            <CompletePageFooterMessage
              text={`Congratulations ${
                user?.firstName || "there"
              }! You've completed all adult learning tasks for today. Your progress is outstanding!`}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default LearnEnglishContent;
