import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface TaskState {
  isComplete: boolean;
  score: number | null;
}

interface PresentationState {
  task_1: TaskState;
  task_2: TaskState;
  task_3: TaskState;
  task_4: TaskState;
}

const taskDefault: TaskState = {
  isComplete: false,
  score: null,
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
      action: PayloadAction<{ task: TaskKey; score: number }>
    ) => {
      const { task, score } = action.payload;
      state[task].isComplete = true;
      state[task].score = score;
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
