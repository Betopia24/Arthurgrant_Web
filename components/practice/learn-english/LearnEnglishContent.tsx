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
import toast from "react-hot-toast";
import { apiRequest } from "@/lib/apiRequest";
import { usePathname } from "next/navigation";

interface TaskResult {
  isAnswer: boolean;
  marks: number;
}

// Interface for task data
interface TaskData {
  task1?: any;
  task2?: any;
  task3?: any;
  task4?: any;
  task5?: any;
  task6?: any;
}

// Interface for step completion
interface StepCompletion {
  task1: number[]; // Array of completed step indices for each task
  task2: number[];
  task3: number[];
  task4: number[];
  task5: number[];
  task6: number[];
}

const LearnEnglishContent = () => {
  const currentPath = usePathname();
  const { user, accessToken } = useAuthStore();

  // Time tracking
  const startTimeRef = useRef<number>(Date.now());
  const [timeSpent, setTimeSpent] = useState<number>(0);
  const submitButtonRef = useRef<HTMLDivElement>(null);

  // Task data from APIs
  const [taskData, setTaskData] = useState<TaskData>({
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

  // Track completed steps for each task
  const [stepCompletion, setStepCompletion] = useState<StepCompletion>({
    task1: [],
    task2: [],
    task3: [],
    task4: [],
    task5: [],
    task6: [],
  });

  // Track total steps per task
  const [taskTotalSteps, setTaskTotalSteps] = useState({
    task1: 0,
    task2: 0,
    task3: 0,
    task4: 0,
    task5: 0,
    task6: 0,
  });

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

  // Submission state
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Track API loading states
  const [isLoadingAPIs, setIsLoadingAPIs] = useState({
    task1: true,
    task2: false,
    task3: false,
    task4: false,
    task5: false,
    task6: false,
  });

  // Update time spent every second
  useEffect(() => {
    const interval = setInterval(() => {
      setTimeSpent(Math.floor((Date.now() - startTimeRef.current) / 1000));
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  // Fetch Task 1 API on initial load
  useEffect(() => {
    const fetchTask1Data = async () => {
      if (!accessToken || !user?.id) return;

      try {
        setIsLoadingAPIs((prev) => ({ ...prev, task1: true }));
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_AI_API}/adult/auditory-discrimination/get_auditory_discrimination?user_id=${user?.id}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              authtoken: `${accessToken}`,
            },
          }
        );
        const data = await res.json();
        console.log("Task 1 API Response:", data);
        setTaskData((prev) => ({ ...prev, task1: data.word_pairs || [] }));
        setTaskTotalSteps((prev) => ({
          ...prev,
          task1: data.word_pairs?.length || 0,
        }));
      } catch (error) {
        console.error("Failed to load Task 1 data", error);
      } finally {
        setIsLoadingAPIs((prev) => ({ ...prev, task1: false }));
      }
    };

    fetchTask1Data();
  }, [accessToken, user?.id]);

  // Fetch Task 2 API when Task 1 is completed
  useEffect(() => {
    const fetchTask2Data = async () => {
      if (!taskCompleted.task1 || !accessToken || !user?.id) return;

      try {
        setIsLoadingAPIs((prev) => ({ ...prev, task2: true }));
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_AI_API}/adult/phenome-mapping/get_phenome_mapping?user_id=${user?.id}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              authtoken: `${accessToken}`,
            },
          }
        );
        const data = await res.json();
        console.log("Task 2 API Response:", data);
        setTaskData((prev) => ({ ...prev, task2: data.exercises || [] }));
        setTaskTotalSteps((prev) => ({
          ...prev,
          task2: data.exercises?.length || 0,
        }));
      } catch (error) {
        console.error("Failed to load Task 2 data", error);
      } finally {
        setIsLoadingAPIs((prev) => ({ ...prev, task2: false }));
      }
    };

    fetchTask2Data();
  }, [taskCompleted.task1, accessToken, user?.id]);

  // Fetch Task 3 API when Task 2 is completed
  useEffect(() => {
    const fetchTask3Data = async () => {
      if (!taskCompleted.task2 || !accessToken) return;

      try {
        setIsLoadingAPIs((prev) => ({ ...prev, task3: true }));
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_AI_API}/adult/word-flash/get_word_flash?user_id=${user?.id}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              authtoken: `${accessToken}`,
            },
          }
        );
        const data = await res.json();
        console.log("Task 3 API Response:", data);
        setTaskData((prev) => ({ ...prev, task3: data.words || [] }));
        setTaskTotalSteps((prev) => ({
          ...prev,
          task3: data.words?.length || 0,
        }));
      } catch (error) {
        console.error("Failed to load Task 3 data", error);
      } finally {
        setIsLoadingAPIs((prev) => ({ ...prev, task3: false }));
      }
    };

    fetchTask3Data();
  }, [taskCompleted.task2, accessToken, user?.id]);

  // Fetch Task 4 API when Task 3 is completed
  useEffect(() => {
    const fetchTask4Data = async () => {
      if (!taskCompleted.task3 || !accessToken) return;

      try {
        setIsLoadingAPIs((prev) => ({ ...prev, task4: true }));
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_AI_API}/adult/word-parts-workshop/get_word_parts?user_id=${user?.id}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              authtoken: `${accessToken}`,
            },
          }
        );
        const data = await res.json();
        console.log("Task 4 API Response:", data);
        setTaskData((prev) => ({ ...prev, task4: data }));
        if (data) {
          const maxLength = Math.max(
            data.prefix?.length || 0,
            data.root?.length || 0,
            data.suffix?.length || 0
          );
          setTaskTotalSteps((prev) => ({ ...prev, task4: maxLength || 0 }));
        }
      } catch (error) {
        console.error("Failed to load Task 4 data", error);
      } finally {
        setIsLoadingAPIs((prev) => ({ ...prev, task4: false }));
      }
    };

    fetchTask4Data();
  }, [taskCompleted.task3, accessToken, user?.id]);

  // Fetch Task 5 API when Task 4 is completed
  useEffect(() => {
    const fetchTask5Data = async () => {
      if (!taskCompleted.task4 || !accessToken || !user?.id) return;

      try {
        setIsLoadingAPIs((prev) => ({ ...prev, task5: true }));
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_AI_API}/adult/phrase-maker/get_phrases?user_id=${user?.id}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              authtoken: `${accessToken}`,
            },
          }
        );
        const data = await res.json();
        console.log("Task 5 API Response:", data);
        setTaskData((prev) => ({ ...prev, task5: data.phrases || [] }));
        setTaskTotalSteps((prev) => ({
          ...prev,
          task5: data.phrases?.length || 0,
        }));
      } catch (error) {
        console.error("Failed to load Task 5 data", error);
      } finally {
        setIsLoadingAPIs((prev) => ({ ...prev, task5: false }));
      }
    };

    fetchTask5Data();
  }, [taskCompleted.task4, accessToken, user?.id]);

  // Fetch Task 6 API when Task 5 is completed
  useEffect(() => {
    const fetchTask6Data = async () => {
      if (!taskCompleted.task5 || !accessToken || !user?.id) return;

      try {
        setIsLoadingAPIs((prev) => ({ ...prev, task6: true }));
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_AI_API}/adult/sentence-builder/get_sentences?user_id=${user?.id}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              authtoken: `${accessToken}`,
            },
          }
        );
        const data = await res.json();
        console.log("Task 6 API Response:", data);
        setTaskData((prev) => ({ ...prev, task6: data.sentences || [] }));
        setTaskTotalSteps((prev) => ({
          ...prev,
          task6: data.sentences?.length || 0,
        }));
      } catch (error) {
        console.error("Failed to load Task 6 data", error);
      } finally {
        setIsLoadingAPIs((prev) => ({ ...prev, task6: false }));
      }
    };

    fetchTask6Data();
  }, [taskCompleted.task5, accessToken, user?.id]);

  // Step completion handlers
  const handleStepComplete = (
    taskName: keyof StepCompletion,
    stepIndex: number
  ) => {
    setStepCompletion((prev) => ({
      ...prev,
      [taskName]: [...prev[taskName], stepIndex].sort((a, b) => a - b),
    }));
  };

  // Check if all steps are completed for a task
  const isTaskAllStepsCompleted = (taskName: keyof StepCompletion) => {
    const totalSteps = taskTotalSteps[taskName];
    const completedSteps = stepCompletion[taskName];

    if (totalSteps === 0) return false;

    // Check if we have completed steps for all indices from 0 to totalSteps-1
    for (let i = 0; i < totalSteps; i++) {
      if (!completedSteps.includes(i)) {
        return false;
      }
    }
    return true;
  };

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

  // Check if tasks are locked based on previous task completion
  const isTask2Locked = !taskCompleted.task1;
  const isTask3Locked = !taskCompleted.task2;
  const isTask4Locked = !taskCompleted.task3;
  const isTask5Locked = !taskCompleted.task4;
  const isTask6Locked = !taskCompleted.task5;

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
      sessionName: "Adult",
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
      const res = await apiRequest(
        "/adult-task/submit",
        "POST",
        submissionData
      );

      console.log("===== SUBMISSION RESPONSE =====");
      console.log(res);
      console.log("===============================");
      if (res?.success === true) {
        toast.success("Answers submitted successfully!");
        setIsSubmitted(true);
      }
    } catch (error: any) {
      toast.error(
        error?.data?.errorMessages?.[0]?.message || error?.data?.message
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle retry session
  const handleRetrySession = () => {
    // Reset all state
    setTaskData({
      task1: null,
      task2: null,
      task3: null,
      task4: null,
      task5: null,
      task6: null,
    });

    setTaskCompleted({
      task1: false,
      task2: false,
      task3: false,
      task4: false,
      task5: false,
      task6: false,
    });

    setStepCompletion({
      task1: [],
      task2: [],
      task3: [],
      task4: [],
      task5: [],
      task6: [],
    });

    setTaskTotalSteps({
      task1: 0,
      task2: 0,
      task3: 0,
      task4: 0,
      task5: 0,
      task6: 0,
    });

    setTaskResults({
      task1: null,
      task2: null,
      task3: null,
      task4: null,
      task5: null,
      task6: null,
    });

    setIsSubmitted(false);

    // Reset timer
    startTimeRef.current = Date.now();
    setTimeSpent(0);

    // Trigger Task 1 API fetch again
    const fetchTask1Data = async () => {
      if (!accessToken || !user?.id) return;

      try {
        setIsLoadingAPIs((prev) => ({ ...prev, task1: true }));
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_AI_API}/adult/auditory-discrimination/get_auditory_discrimination?user_id=${user?.id}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              authtoken: `${accessToken}`,
            },
          }
        );
        const data = await res.json();
        console.log("Task 1 API Response (Retry):", data);
        setTaskData((prev) => ({ ...prev, task1: data.word_pairs || [] }));
        setTaskTotalSteps((prev) => ({
          ...prev,
          task1: data.word_pairs?.length || 0,
        }));
      } catch (error) {
        console.error("Failed to load Task 1 data on retry", error);
      } finally {
        setIsLoadingAPIs((prev) => ({ ...prev, task1: false }));
      }
    };

    fetchTask1Data();
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
              taskData={taskData.task1}
              isFetching={isLoadingAPIs.task1}
              taskResult={taskResults.task1}
              onTaskComplete={handleTask1Complete}
              currentStepIndex={stepCompletion.task1.length}
              onStepComplete={(stepIndex) =>
                handleStepComplete("task1", stepIndex)
              }
              totalSteps={taskTotalSteps.task1}
            />
            <PhonemeGraphemeMapping
              taskData={taskData.task2}
              isFetching={isLoadingAPIs.task2}
              isLocked={isTask2Locked}
              taskResult={taskResults.task2}
              onTaskComplete={handleTask2Complete}
              currentStepIndex={stepCompletion.task2.length}
              onStepComplete={(stepIndex) =>
                handleStepComplete("task2", stepIndex)
              }
              totalSteps={taskTotalSteps.task2}
            />
            <WordFlash
              taskData={taskData.task3}
              isFetching={isLoadingAPIs.task3}
              isLocked={isTask3Locked}
              taskResult={taskResults.task3}
              onTaskComplete={handleTask3Complete}
              currentStepIndex={stepCompletion.task3.length}
              onStepComplete={(stepIndex) =>
                handleStepComplete("task3", stepIndex)
              }
              totalSteps={taskTotalSteps.task3}
            />
            <WordPartsWorkshop
              taskData={taskData.task4}
              isFetching={isLoadingAPIs.task4}
              isLocked={isTask4Locked}
              taskResult={taskResults.task4}
              onTaskComplete={handleTask4Complete}
              currentStepIndex={stepCompletion.task4.length}
              onStepComplete={(stepIndex) =>
                handleStepComplete("task4", stepIndex)
              }
              totalSteps={taskTotalSteps.task4}
            />
            <PhraseMaker
              taskData={taskData.task5}
              isFetching={isLoadingAPIs.task5}
              isLocked={isTask5Locked}
              taskResult={taskResults.task5}
              onTaskComplete={handleTask5Complete}
              currentStepIndex={stepCompletion.task5.length}
              onStepComplete={(stepIndex) =>
                handleStepComplete("task5", stepIndex)
              }
              totalSteps={taskTotalSteps.task5}
            />
            <SentenceBuilder
              taskData={taskData.task6}
              isFetching={isLoadingAPIs.task6}
              isLocked={isTask6Locked}
              taskResult={taskResults.task6}
              onTaskComplete={handleTask6Complete}
              currentStepIndex={stepCompletion.task6.length}
              onStepComplete={(stepIndex) =>
                handleStepComplete("task6", stepIndex)
              }
              totalSteps={taskTotalSteps.task6}
            />
          </div>

          {/* Submit All Button and Retry */}
          <div
            ref={submitButtonRef}
            className="w-full flex flex-col items-center justify-center gap-4">
            {isSubmitted ? (
              <>
                <button
                  onClick={handleRetrySession}
                  className="px-12 py-4 font-semibold text-lg rounded-2xl bg-gradient-brand text-white cursor-pointer hover:brightness-110 transition-all">
                  Retry Session
                </button>
                <p className="text-green-400 text-sm">
                  Time taken: {formatTime(timeSpent)}
                </p>
              </>
            ) : (
              <>
                <button
                  onClick={handleSubmitAllAnswers}
                  disabled={!allTasksCompleted || isSubmitting}
                  className={`px-12 py-4 font-semibold text-lg rounded-2xl ${
                    !allTasksCompleted || isSubmitting
                      ? "bg-[#828882] opacity-50 cursor-not-allowed"
                      : "bg-gradient-brand text-white cursor-pointer hover:brightness-110 transition-all"
                  }`}>
                  {isSubmitting ? "Submitting..." : "Submit All Answers"}
                </button>
                {!allTasksCompleted && (
                  <p className="text-gray-400 text-sm">
                    Complete all 6 tasks to submit your answers
                  </p>
                )}
              </>
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
