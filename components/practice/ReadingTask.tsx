"use client";
import React, { useEffect, useState, useRef } from "react";
import { FaCheckCircle } from "react-icons/fa";
import { useAuthStore } from "@/stores/authStore";
import Heading from "../shared/Heading";
import PracticeHero from "./PracticeHero2";
import Task1PhonemeFlashcards from "./Reading/TaskOne";
import Task2SightWordPractice from "./Reading/TaskTwo";
import Task3DragMatch from "./Reading/TaskThree";
import Task4ReadingComprehension from "./Reading/TaskFour";
import toast from "react-hot-toast";

interface TaskResult {
  isAnswer: boolean;
  mark: number;
}

const ReadingTask = () => {
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
  }>({
    task1: null,
    task2: null,
    task3: null,
    task4: null,
  });

  // Track which tasks have been completed
  const [taskCompleted, setTaskCompleted] = useState({
    task1: false,
    task2: false,
    task3: false,
    task4: false,
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

      // Scroll to submit button when task 4 is completed
      setTimeout(() => {
        submitButtonRef.current?.scrollIntoView({
          behavior: "smooth",
          block: "center",
        });
      }, 500);
    }
  };

  // Check if tasks are locked
  const isTask2Locked = !taskCompleted.task1;
  const isTask3Locked = !taskCompleted.task2;
  const isTask4Locked = !taskCompleted.task3;

  // Check if all tasks are completed
  const allTasksCompleted =
    taskCompleted.task1 &&
    taskCompleted.task2 &&
    taskCompleted.task3 &&
    taskCompleted.task4;

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

    // Prepare data in the format backend expects
    const submissionData = {
      tasks: [
        {
          taskName: "Task 1",
          isanswer: taskResults.task1?.isAnswer || false,
          mark: taskResults.task1?.mark || 0,
        },
        {
          taskName: "Task 2",
          isanswer: taskResults.task2?.isAnswer || false,
          mark: taskResults.task2?.mark || 0,
        },
        {
          taskName: "Task 3",
          isanswer: taskResults.task3?.isAnswer || false,
          mark: taskResults.task3?.mark || 0,
        },
        {
          taskName: "Task 4",
          isanswer: taskResults.task4?.isAnswer || false,
          mark: taskResults.task4?.mark || 0,
        },
      ],
      timeSpent: finalTimeSpent,
    };

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_API}/reading-task/submit`,
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
      toast.success("Answers submitted successfully!");

      console.log(JSON.stringify(data, null, 2));
      console.log("===============================");
      setIsSubmitted(true);
    } catch (error) {
      console.error("===== SUBMISSION ERROR =====");
      console.error(error);
      console.error("============================");
      toast.error("Failed to submit answers");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="py-20 bg-section-dark">
      <PracticeHero
        heading="Today's Reading Practice"
        subheading="Master your pronunciation with AI-powered feedback and interactive exercises designed for your success."
        specialText="Practice"
        align="center"
        greetText={`Hi ${user?.firstName || "there"}!`}
        streakValue="9"
        sessionTime={formatTime(timeSpent)}
        progressValue={`${
          Object.values(taskCompleted).filter((t) => t === true).length
        }/4`}
        goalValue="75%"
        sessionProgressWidth="60%"
        progressWidth={`${
          (Object.values(taskCompleted).filter((t) => t === true).length / 4) *
          100
        }%`}
        goalWidth="70%"
      />

      <div className="app-container flex flex-col items-start gap-12 w-full px-4 sm:px-6 lg:px-8 py-8 md:py-20">
        <Heading
          heading="Reading Tasks"
          subheading="Complete each task to improve your English reading skill"
          specialText="Tasks"
          align="left"
        />

        <Task1PhonemeFlashcards
          taskResult={taskResults.task1}
          onTaskComplete={handleTask1Complete}
        />

        <Task2SightWordPractice
          taskResult={taskResults.task2}
          onTaskComplete={handleTask2Complete}
          isLocked={isTask2Locked}
        />

        <Task3DragMatch
          taskResult={taskResults.task3}
          onTaskComplete={handleTask3Complete}
          isLocked={isTask3Locked}
        />

        <Task4ReadingComprehension
          taskResult={taskResults.task4}
          onTaskComplete={handleTask4Complete}
          isLocked={isTask4Locked}
        />

        <div
          ref={submitButtonRef}
          className="w-full flex flex-col items-center justify-center gap-4"
        >
          <button
            onClick={handleSubmitAllAnswers}
            type="submit"
            disabled={!allTasksCompleted || isSubmitting || isSubmitted}
            className={`px-12 py-4 font-semibold text-lg rounded-xl ${
              !allTasksCompleted || isSubmitting || isSubmitted
                ? "bg-[#828882] opacity-50 cursor-not-allowed"
                : "bg-gradient-to-r from-yellow-400 to-pink-500 text-white cursor-pointer hover:opacity-90 transition-opacity"
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
              Complete all 4 tasks to submit your answers
            </p>
          )}
          {/* {isSubmitted && (
            <p className="text-green-400 text-sm">
              Time taken: {formatTime(timeSpent)}
            </p>
          )} */}
        </div>

        {isSubmitted && (
          <div className="w-full flex items-center justify-center gap-3 border-2 border-green-500 rounded-xl p-6 bg-[#1a2a1a]">
            <div className="flex items-center justify-center w-8 h-8 rounded-full bg-green-500 text-white">
              <FaCheckCircle className="w-5 h-5 text-white" />
            </div>
            <span className="text-lg text-green-500 font-semibold">
              Well done {user?.firstName || "there"}! You've finished today's
              reading session
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export default ReadingTask;
