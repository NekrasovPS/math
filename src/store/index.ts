import { configureStore } from '@reduxjs/toolkit';
import themeReducer from './themeSlice';
import progressReducer from './progressSlice';
import lessonReducer from './lessonSlice';

export const store = configureStore({
  reducer: {
    theme: themeReducer,
    progress: progressReducer,
    lesson: lessonReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
