// Типы для темы приложения
export type ThemeMode = 'light' | 'dark';

export interface ThemeState {
  mode: ThemeMode;
}

// Типы для прогресса обучения
export interface LessonProgress {
  lessonId: string;
  completed: boolean;
  score: number;
  completedAt?: string;
}

export interface ExerciseProgress {
  exerciseId: string;
  correct: boolean;
  attempts: number;
}

export interface ProgressState {
  lessons: Record<string, LessonProgress>;
  exercises: Record<string, ExerciseProgress>;
  totalScore: number;
}

// Типы для текущего урока
export interface Figure {
  id: string;
  name: string;
  type: 'cube' | 'pyramid' | 'cylinder' | 'cone' | 'sphere';
  description: string;
  formulas: {
    surfaceArea: string;
    volume: string;
  };
  parameters: {
    side?: number;
    radius?: number;
    height?: number;
  };
}

export interface LessonContent {
  id: string;
  title: string;
  grade: number;
  subject: 'geometry' | 'algebra' | 'physics';
  theory: string;
  figures: Figure[];
  exercises: Exercise[];
}

export interface Exercise {
  id: string;
  question: string;
  type: 'input' | 'choice';
  options?: string[];
  correctAnswer: string | number;
  explanation: string;
}

export interface LessonState {
  currentLesson: LessonContent | null;
  currentFigure: Figure | null;
  isUnfolded: boolean;
  selectedFace: string | null;
}

// Объединённый тип для всего состояния приложения
export interface AppState {
  theme: ThemeState;
  progress: ProgressState;
  lesson: LessonState;
}
