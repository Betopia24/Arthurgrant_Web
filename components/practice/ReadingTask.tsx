"use client";
import React, { useState } from "react";
import Heading from "../shared/Heading";
import Task3DragAndMatch from "./Reading/TaskThree";
import Task4ReadingComprehension from "./Reading/TaskFour";
import Task1PhonemeFlashcards from "./Reading/TaskOne";
import Task2SightWordPractice from "./Reading/TaskTwo";
import PracticeHero from "./PracticeHero2";

const ReadingTasksPage = () => {
  const [taskResults, setTaskResults] = useState({
    task1: null as boolean | null,
    task2: null as boolean | null,
    task3: null as boolean | null,
    task4: null as boolean | null,
  });

  const handleTaskComplete = (taskNum: number, passed: boolean | null) => {
    setTaskResults((prev) => ({ ...prev, [taskNum]: passed }));
  };

  const handleSubmitAll = () => {
    console.log("Final Results:", taskResults);
    // Your API call here
  };

  return (
    <>
      <PracticeHero
        heading="Today's Reading Adventure"
        subheading="Complete each challenge, unlock rewards, and become a stronger reader!"
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
          <Heading
            heading="Reading Tasks"
            subheading="Complete each task to improve your English reading skill "
            specialText="Tasks"
            align="left"
          />

          <Task1PhonemeFlashcards
            taskResult={taskResults.task1}
            onTaskComplete={(passed) => handleTaskComplete(1, passed)}
          />
          <Task2SightWordPractice
            isLocked={taskResults.task1 !== true}
            taskResult={taskResults.task2}
            onTaskComplete={(passed) => handleTaskComplete(2, passed)}
          />
          <Task3DragAndMatch
            isLocked={taskResults.task2 !== true}
            taskResult={taskResults.task3}
            onTaskComplete={(passed) => handleTaskComplete(3, passed)}
          />
          <Task4ReadingComprehension
            isLocked={taskResults.task3 !== true}
            onSubmitAll={handleSubmitAll}
          />
        </div>
      </div>
    </>
  );
};

export default ReadingTasksPage;
