import TaskHeader from "@/components/shared/TaskHeader";
import React from "react";

interface TaskCardProps {
  taskNumber: number;
  currentTask: number;
  title: string;
  description: string;
  content: React.ReactNode;
}

const TaskCard: React.FC<TaskCardProps> = ({
  taskNumber,
  currentTask,
  title,
  description,
  content,
}) => {
  return (
    <div
      className={`w-full bg-[#2D2F4A] text-white p-5 md:p-6 rounded-xl shadow-lg flex flex-col gap-5 md:gap-6 transition-all duration-300 ${
        currentTask === taskNumber ? "ring-2 ring-blue-400" : "opacity-90"
      }`}>
      <TaskHeader
        title={title}
        description={description}
        taskNumber={taskNumber}
      />
      {content}
    </div>
  );
};

export default TaskCard;
