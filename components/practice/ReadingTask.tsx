"use client";
import { useAuthStore } from "@/stores/authStore";
import { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import { FaCheckCircle } from "react-icons/fa";
import Heading from "../shared/Heading";
import PracticeHero from "./PracticeHero2";
import Task3ReadingComprehension from "./Reading/TaskFour";
import Task2DragMatch from "./Reading/TaskThree";
import Task1SightWordPractice from "./Reading/TaskTwo";
import { usePathname } from "next/navigation";
import Task2SightWordPractice from "./Reading/TaskTwo";

interface TaskResult {
  isAnswer: boolean;
  mark: number;
}

const ReadingTask = () => {
  const currentPath = usePathname();

  const { user, accessToken } = useAuthStore();

  // Time tracking
  const startTimeRef = useRef<number>(Date.now());
  const [timeSpent, setTimeSpent] = useState<number>(0);
  const submitButtonRef = useRef<HTMLDivElement>(null);

  // ALL TASKS RESULTS STATE with marks (now only 3 tasks)
  const [taskResults, setTaskResults] = useState<{
    task1: TaskResult | null;
    task2: TaskResult | null;
    task3: TaskResult | null;
  }>({
    task1: null,
    task2: null,
    task3: null,
  });

  // Track which tasks have been completed (now only 3 tasks)
  const [taskCompleted, setTaskCompleted] = useState({
    task1: false,
    task2: false,
    task3: false,
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
    setTaskResults((prev) => ({ ...prev, task1: result }));
    if (result !== null) {
      setTaskCompleted((prev) => ({ ...prev, task1: true }));
    }
  };

  const handleTask2Complete = (result: TaskResult | null) => {
    setTaskResults((prev) => ({ ...prev, task2: result }));
    if (result !== null) {
      setTaskCompleted((prev) => ({ ...prev, task2: true }));
    }
  };

  const handleTask3Complete = (result: TaskResult | null) => {
    setTaskResults((prev) => ({ ...prev, task3: result }));
    if (result !== null) {
      setTaskCompleted((prev) => ({ ...prev, task3: true }));

      // Scroll to submit button when task 3 is completed
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

  // Check if all tasks are completed
  const allTasksCompleted =
    taskCompleted.task1 &&
    taskCompleted.task2 &&
    taskCompleted.task3;

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
    setIsSubmitting(true);

    // Calculate final time spent
    const finalTimeSpent = Math.floor(
      (Date.now() - startTimeRef.current) / 1000
    );

    // Prepare data in the format backend expects
    const submissionData = {
      tasks: [
        {
          taskName: "Sight Word Practice",
          isAnswer: taskResults.task1?.isAnswer || false,
          marks: taskResults.task1?.mark || 0,
        },
        {
          taskName: "Drag & Match Words",
          isAnswer: taskResults.task2?.isAnswer || false,
          marks: taskResults.task2?.mark || 0,
        },
        {
          taskName: "Reading Comprehension",
          isAnswer: taskResults.task3?.isAnswer || false,
          marks: taskResults.task3?.mark || 0,
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
            Authorization: `${accessToken}`,
          },
          body: JSON.stringify(submissionData),
        }
      );
      const data = await res.json();

      if (data?.success === true) {
        toast.success("Answers submitted successfully!");
        setIsSubmitted(true);
      }
    } catch (error: any) {
      toast.error(
        error?.data?.errorMessages?.[0]?.message ||
          error?.data?.message ||
          "Something went wrong"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-section-dark">
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
        }/3`}
        goalValue="75%"
        sessionProgressWidth="60%"
        progressWidth={`${
          (Object.values(taskCompleted).filter((t) => t === true).length / 3) *
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

        <Task2SightWordPractice
          taskResult={taskResults.task1}
          onTaskComplete={handleTask1Complete}
        />

        <Task2DragMatch
          taskResult={taskResults.task2}
          onTaskComplete={handleTask2Complete}
          isLocked={isTask2Locked}
        />

        <Task3ReadingComprehension
          taskResult={taskResults.task3}
          onTaskComplete={handleTask3Complete}
          isLocked={isTask3Locked}
        />

        <div
          ref={submitButtonRef}
          className="w-full flex flex-col items-center justify-center gap-4">
          <button
            onClick={handleSubmitAllAnswers}
            type="submit"
            disabled={!allTasksCompleted || isSubmitting || isSubmitted}
            className={`px-12 py-4 font-semibold text-lg rounded-xl ${
              !allTasksCompleted || isSubmitting || isSubmitted
                ? "bg-[#828882] opacity-50 cursor-not-allowed"
                : "bg-gradient-to-r from-yellow-400 to-pink-500 text-white cursor-pointer hover:opacity-90 transition-opacity"
            }`}>
            {isSubmitting
              ? "Submitting..."
              : isSubmitted
              ? "Submitted!"
              : "Submit All Answers"}
          </button>
          {!allTasksCompleted && (
            <p className="text-gray-400 text-sm">
              Complete all 3 tasks to submit your answers
            </p>
          )}
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