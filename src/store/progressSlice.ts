import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { ProgressState } from "../types";

const initialState: ProgressState = {
  lessons: {},
  exercises: {},
  totalScore: 0,
};

const progressSlice = createSlice({
  name: "progress",
  initialState,
  reducers: {
    completeLesson: (
      state,
      action: PayloadAction<{ lessonId: string; score: number }>,
    ) => {
      const { lessonId, score } = action.payload;
      state.lessons[lessonId] = {
        lessonId,
        completed: true,
        score,
        completedAt: new Date().toISOString(),
      };
      state.totalScore += score;
    },
    updateExerciseProgress: (
      state,
      action: PayloadAction<{ exerciseId: string; correct: boolean }>,
    ) => {
      const { exerciseId, correct } = action.payload;
      const existing = state.exercises[exerciseId];

      if (existing) {
        existing.attempts += 1;
        if (correct && !existing.correct) {
          existing.correct = true;
          state.totalScore += 10;
        }
      } else {
        state.exercises[exerciseId] = {
          exerciseId,
          correct,
          attempts: 1,
        };
        if (correct) {
          state.totalScore += 10;
        }
      }
    },
    resetProgress: (state) => {
      state.lessons = {};
      state.exercises = {};
      state.totalScore = 0;
    },
  },
});

export const { completeLesson, updateExerciseProgress, resetProgress } =
  progressSlice.actions;
export default progressSlice.reducer;
