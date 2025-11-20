"use client";

import React, { useState, useEffect } from "react";
import Heading from "../shared/Heading";
import CompletePageFooterMessage from "../shared/CompletePageFooterMessage";
import PowerWordsPulse from "./PowerWordsPulse";
import PrecisionDrill from "./PrecisionDrill";
import ContextSpin from "./ContextSpin";
import FlowChain from "./FlowChain";
import PresentationHero from "./PresentationHero";

// Types for API integration
export interface PresentationTask {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  progress: number;
}

export interface SpeechRecognitionResult {
  transcript: string;
  confidence: number;
  isFinal: boolean;
}

export interface AIFeedback {
  score: number;
  feedback: string;
  suggestions: string[];
  pronunciationScore?: number;
  fluencyScore?: number;
  clarityScore?: number;
}

// Mock API service (replace with actual API calls)
const presentationAPI = {
  async getTasks(): Promise<PresentationTask[]> {
    // Simulate API call
    return [
      {
        id: "1",
        title: "Power Words Pulse",
        description: "Vocabulary building",
        completed: false,
        progress: 0,
      },
      {
        id: "2",
        title: "Precision Drill",
        description: "Scenario practice",
        completed: false,
        progress: 0,
      },
      {
        id: "3",
        title: "Context Spin",
        description: "Contextual speaking",
        completed: false,
        progress: 0,
      },
      {
        id: "4",
        title: "Flow Chain",
        description: "Continuous speech",
        completed: false,
        progress: 0,
      },
    ];
  },

  async submitRecording(
    taskId: string,
    audioBlob: Blob,
    transcript: string
  ): Promise<AIFeedback> {
    // Simulate API processing
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          score: Math.floor(Math.random() * 30) + 70, // 70-100
          feedback:
            "Good job! Your pronunciation was clear and confident. Try to vary your tone more for better engagement.",
          suggestions: [
            "Speak slightly slower for better clarity",
            "Use more pauses between key points",
            "Vary your pitch to maintain listener interest",
          ],
          pronunciationScore: 85,
          fluencyScore: 78,
          clarityScore: 82,
        });
      }, 2000);
    });
  },

  async getPowerWords(): Promise<
    { word: string; definition: string; example: string }[]
  > {
    return [
      {
        word: "Dynamic",
        definition: "Characterized by constant change, activity, or progress",
        example: "The dynamic presentation captivated the audience.",
      },
      {
        word: "Innovation",
        definition: "The introduction of new ideas or methods",
        example: "Their innovation in technology revolutionized the industry.",
      },
      {
        word: "Strategy",
        definition: "A plan of action designed to achieve a long-term goal",
        example: "The company's growth strategy proved highly effective.",
      },
    ];
  },
};

const PresentationContent = () => {
  const [tasks, setTasks] = useState<PresentationTask[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [overallProgress, setOverallProgress] = useState(0);
  const [allTasksCompleted, setAllTasksCompleted] = useState(false);

  // Load tasks on component mount
  useEffect(() => {
    const loadTasks = async () => {
      try {
        setIsLoading(true);
        const tasksData = await presentationAPI.getTasks();
        setTasks(tasksData);
        calculateOverallProgress(tasksData);
      } catch (error) {
        console.error("Failed to load tasks:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadTasks();
  }, []);

  // Calculate overall progress
  const calculateOverallProgress = (tasksList: PresentationTask[]) => {
    const completedCount = tasksList.filter((task) => task.completed).length;
    const totalProgress = tasksList.reduce(
      (sum, task) => sum + task.progress,
      0
    );
    const averageProgress = totalProgress / tasksList.length;

    const progress = Math.round(
      (completedCount / tasksList.length) * 50 + averageProgress * 0.5
    );
    setOverallProgress(progress);

    // Check if all tasks are completed
    const allCompleted = tasksList.every((task) => task.completed);
    setAllTasksCompleted(allCompleted);
  };

  // Update task progress
  const updateTaskProgress = (
    taskId: string,
    progress: number,
    completed: boolean = false
  ) => {
    setTasks((prev) => {
      const updatedTasks = prev.map((task) =>
        task.id === taskId
          ? { ...task, progress, completed: task.completed || completed }
          : task
      );
      calculateOverallProgress(updatedTasks);
      return updatedTasks;
    });
  };

  // Handle AI feedback submission
  const handleAIFeedback = async (
    taskId: string,
    audioBlob: Blob,
    transcript: string
  ): Promise<AIFeedback> => {
    try {
      const feedback = await presentationAPI.submitRecording(
        taskId,
        audioBlob,
        transcript
      );

      // Update task progress based on feedback score
      const progress = Math.min(100, feedback.score);
      const completed = progress >= 70; // Mark as completed if score >= 70
      updateTaskProgress(taskId, progress, completed);

      return feedback;
    } catch (error) {
      console.error("Failed to get AI feedback:", error);
      throw error;
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-section-dark flex items-center justify-center">
        <div className="text-white text-lg">Loading presentation tasks...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-section-dark">
      <PresentationHero />

      <div className="py-12 lg:py-20">
        <div className="app-container flex flex-col gap-8 lg:gap-12 w-full">
          {/* Header with Progress */}
          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6">
            <Heading
              heading="Presentation Skills"
              subheading="Complete each task to improve your presentation skills"
              specialText="Tasks"
              align="left"
            />

            {/* Overall Progress */}
            <div className="flex flex-col gap-2 min-w-[200px]">
              <div className="flex justify-between text-sm">
                <span className="text-white/80">Overall Progress</span>
                <span className="text-white font-semibold">
                  {overallProgress}%
                </span>
              </div>
              <div className="w-full bg-white/20 rounded-full h-2">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-500"
                  style={{ width: `${overallProgress}%` }}
                />
              </div>
            </div>
          </div>

          {/* Tasks Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
            <PowerWordsPulse
              onTaskUpdate={updateTaskProgress}
              onAIFeedback={handleAIFeedback}
              task={tasks.find((t) => t.id === "1")}
            />
            <PrecisionDrill
              onTaskUpdate={updateTaskProgress}
              onAIFeedback={handleAIFeedback}
              task={tasks.find((t) => t.id === "2")}
            />
            <ContextSpin
              onTaskUpdate={updateTaskProgress}
              onAIFeedback={handleAIFeedback}
              task={tasks.find((t) => t.id === "3")}
            />
            <FlowChain
              onTaskUpdate={updateTaskProgress}
              onAIFeedback={handleAIFeedback}
              task={tasks.find((t) => t.id === "4")}
            />
          </div>

          {/* Completion Message */}
          {allTasksCompleted && (
            <CompletePageFooterMessage text="Congratulations! You've completed all presentation tasks for today. Your progress is outstanding!" />
          )}
        </div>
      </div>
    </div>
  );
};

export default PresentationContent;
