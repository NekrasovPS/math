import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { LessonState, LessonContent, Figure } from "../types";

const initialState: LessonState = {
  currentLesson: null,
  currentFigure: null,
  isUnfolded: false,
  selectedFace: null,
};

const lessonSlice = createSlice({
  name: "lesson",
  initialState,
  reducers: {
    setLesson: (state, action: PayloadAction<LessonContent>) => {
      state.currentLesson = action.payload;
      state.currentFigure = action.payload.figures[0] || null;
      state.isUnfolded = false;
      state.selectedFace = null;
    },
    setCurrentFigure: (state, action: PayloadAction<Figure | null>) => {
      state.currentFigure = action.payload;
      state.isUnfolded = false;
      state.selectedFace = null;
    },
    toggleUnfold: (state) => {
      state.isUnfolded = !state.isUnfolded;
    },
    setSelectedFace: (state, action: PayloadAction<string | null>) => {
      state.selectedFace = action.payload;
    },
    clearLesson: (state) => {
      state.currentLesson = null;
      state.currentFigure = null;
      state.isUnfolded = false;
      state.selectedFace = null;
    },
  },
});

export const {
  setLesson,
  setCurrentFigure,
  toggleUnfold,
  setSelectedFace,
  clearLesson,
} = lessonSlice.actions;
export default lessonSlice.reducer;
