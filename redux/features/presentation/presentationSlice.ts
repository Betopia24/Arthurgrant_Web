import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type Feedback = {
  score: number;
  feedback: string;
  status: string;
  message: string;
};

interface TaskState {
  isComplete: boolean;
  feedback: Feedback | null;
}

interface PresentationState {
  task_1: TaskState;
  task_2: TaskState;
  task_3: TaskState;
  task_4: TaskState;
}

const taskDefault: TaskState = {
  isComplete: false,
  feedback: null,
};

const initialState: PresentationState = {
  task_1: { ...taskDefault },
  task_2: { ...taskDefault },
  task_3: { ...taskDefault },
  task_4: { ...taskDefault },
};

type TaskKey = keyof PresentationState;

const presentationSlice = createSlice({
  name: "presentation",
  initialState,
  reducers: {
    setTaskComplete: (
      state,
      action: PayloadAction<{ task: TaskKey; feedback: Feedback }>
    ) => {
      const { task, feedback } = action.payload;
      state[task].isComplete = true;
      state[task].feedback = feedback;
    },

    resetSpecificTask: (state, action: PayloadAction<{ task: TaskKey }>) => {
      const { task } = action.payload;
      state[task] = { ...taskDefault };
    },

    resetPresentation: () => initialState,
  },
});

export const { setTaskComplete, resetSpecificTask, resetPresentation } =
  presentationSlice.actions;

export default presentationSlice.reducer;
