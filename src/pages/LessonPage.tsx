import { useState, useCallback, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useAppDispatch, useAppSelector } from "../hooks/redux";
import {
  setLesson,
  setCurrentFigure,
  toggleUnfold,
  setSelectedFace,
  clearLesson,
} from "../store/lessonSlice";
import { completeLesson } from "../store/progressSlice";
import { getLessonById } from "../utils/lessonsData";
import { FigureInfoPanel } from "../components/FigureInfo";
import { ExercisesList } from "../components/Exercises";
import { Scene } from "../scenes/Scene";
import { cn } from "../utils/cn";

export function LessonPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const currentLesson = useAppSelector((state) => state.lesson.currentLesson);
  const currentFigure = useAppSelector((state) => state.lesson.currentFigure);
  const isUnfolded = useAppSelector((state) => state.lesson.isUnfolded);
  const selectedFace = useAppSelector((state) => state.lesson.selectedFace);

  const [activeTab, setActiveTab] = useState<"theory" | "exercises">("theory");
  const [completedExercises, setCompletedExercises] = useState<Set<string>>(
    new Set(),
  );
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (id) {
      const lesson = getLessonById(id);
      if (lesson) {
        dispatch(setLesson(lesson));
        setIsLoading(false);
      } else {
        navigate("/lessons");
      }
    }

    return () => {
      dispatch(clearLesson());
    };
  }, [id, dispatch, navigate]);

  const handleFigureChange = useCallback(
    (figureId: string) => {
      const figure = currentLesson?.figures.find((f) => f.id === figureId);
      if (figure) {
        dispatch(setCurrentFigure(figure));
      }
    },
    [currentLesson, dispatch],
  );

  const handleFaceClick = useCallback(
    (faceId: string) => {
      dispatch(setSelectedFace(selectedFace === faceId ? null : faceId));
    },
    [dispatch, selectedFace],
  );

  const handleToggleUnfold = useCallback(() => {
    dispatch(toggleUnfold());
    dispatch(setSelectedFace(null));
  }, [dispatch]);

  const handleExerciseComplete = useCallback(
    (exerciseId: string, isCorrect: boolean) => {
      setCompletedExercises((prev) => {
        const newSet = new Set(prev);
        if (isCorrect) {
          newSet.add(exerciseId);
        }
        return newSet;
      });
    },
    [],
  );

  const handleCompleteLesson = useCallback(() => {
    if (currentLesson) {
      const score = completedExercises.size * 10;
      dispatch(completeLesson({ lessonId: currentLesson.id, score }));
    }
  }, [currentLesson, completedExercises, dispatch]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center gap-4">
          <div className="h-12 w-12 border-4 border-accent border-t-transparent rounded-full animate-spin" />
          <p className="text-sm text-muted-foreground animate-pulse">
            Загрузка урока...
          </p>
        </div>
      </div>
    );
  }

  if (!currentLesson) {
    return null;
  }

  const progress =
    currentLesson.exercises.length > 0
      ? Math.round(
          (completedExercises.size / currentLesson.exercises.length) * 100,
        )
      : 0;

  return (
    <div className="flex flex-col lg:flex-row h-[calc(100vh-4rem)]">
      {/* Left Panel - 3D Scene */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="flex-1 relative bg-gradient-to-br from-background to-muted"
      >
        {/* Scene Controls */}
        <div className="absolute top-4 left-4 z-10 flex gap-2">
          <motion.button
            onClick={handleToggleUnfold}
            className={cn(
              "px-4 py-2 rounded-lg font-medium text-sm backdrop-blur-md",
              "bg-accent text-white",
              "hover:bg-accent-dark transition-colors",
            )}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {isUnfolded ? "Собрать" : "Развёртка"}
          </motion.button>
        </div>

        {/* Figure Selector */}
        {currentLesson.figures.length > 1 && (
          <div className="absolute top-4 right-4 z-10">
            <select
              value={currentFigure?.id || ""}
              onChange={(e) => handleFigureChange(e.target.value)}
              className="px-4 py-2 rounded-lg border bg-background/80 backdrop-blur-md focus:border-accent focus:outline-none"
            >
              {currentLesson.figures.map((figure) => (
                <option key={figure.id} value={figure.id}>
                  {figure.name}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* 3D Scene */}
        <Scene
          side={currentFigure?.parameters.side || 2}
          radius={currentFigure?.parameters.radius || 1.5}
          height={currentFigure?.parameters.height || 3}
          figureType={currentFigure?.type || "cube"}
          isUnfolded={isUnfolded}
          selectedFace={selectedFace}
          onFaceClick={handleFaceClick}
          autoRotate={!isUnfolded}
          className="h-full w-full"
        />

        {/* Hints */}
        <div className="absolute bottom-4 left-4 z-10 max-w-xs">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-3 rounded-lg bg-background/80 backdrop-blur-md border text-sm"
          >
            <p className="flex items-center gap-2">
              <svg
                className="h-4 w-4 text-accent"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              {isUnfolded
                ? "Развёртка показана. Кликните на грань для выделения."
                : "Вращайте фигуру мышкой. Кликните на грань для информации."}
            </p>
          </motion.div>
        </div>
      </motion.div>

      {/* Right Panel - Theory & Exercises */}
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        className="w-full lg:w-[450px] border-l bg-background overflow-y-auto scrollbar-thin"
      >
        {/* Header */}
        <div className="p-6 border-b">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium px-2 py-1 rounded bg-accent-bg text-accent">
              {currentLesson.grade} класс
            </span>
            {currentLesson.exercises.length > 0 && (
              <div className="flex items-center gap-2">
                <div className="w-24 h-2 rounded-full bg-muted overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                    className="h-full bg-accent"
                  />
                </div>
                <span className="text-xs text-muted-foreground">
                  {progress}%
                </span>
              </div>
            )}
          </div>
          <h1 className="text-2xl font-semibold">{currentLesson.title}</h1>
        </div>

        {/* Tabs */}
        <div className="flex border-b">
          <button
            onClick={() => setActiveTab("theory")}
            className={cn(
              "flex-1 px-4 py-3 text-sm font-medium transition-colors",
              activeTab === "theory"
                ? "text-accent border-b-2 border-accent"
                : "text-muted-foreground hover:text-foreground",
            )}
          >
            Теория
          </button>
          <button
            onClick={() => setActiveTab("exercises")}
            className={cn(
              "flex-1 px-4 py-3 text-sm font-medium transition-colors",
              activeTab === "exercises"
                ? "text-accent border-b-2 border-accent"
                : "text-muted-foreground hover:text-foreground",
            )}
          >
            Упражнения
            {currentLesson.exercises.length > 0 && (
              <span className="ml-2 px-2 py-0.5 rounded-full bg-accent-bg text-accent text-xs">
                {currentLesson.exercises.length}
              </span>
            )}
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {activeTab === "theory" ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-6"
            >
              {/* Theory Text */}
              <div className="prose prose-sm dark:prose-invert max-w-none">
                {currentLesson.theory.split("\n").map((paragraph, index) => {
                  if (paragraph.startsWith("## ")) {
                    return (
                      <h2
                        key={index}
                        className="text-xl font-semibold mt-6 mb-3"
                      >
                        {paragraph.replace("## ", "")}
                      </h2>
                    );
                  }
                  if (paragraph.startsWith("### ")) {
                    return (
                      <h3
                        key={index}
                        className="text-lg font-semibold mt-4 mb-2"
                      >
                        {paragraph.replace("### ", "")}
                      </h3>
                    );
                  }
                  if (paragraph.startsWith("- ")) {
                    return (
                      <li key={index} className="ml-4">
                        {paragraph.replace("- ", "")}
                      </li>
                    );
                  }
                  if (paragraph.startsWith("**") && paragraph.endsWith("**")) {
                    return (
                      <p key={index} className="font-semibold">
                        {paragraph.replace(/\*\*/g, "")}
                      </p>
                    );
                  }
                  if (paragraph.trim()) {
                    return (
                      <p key={index} className="text-muted-foreground">
                        {paragraph}
                      </p>
                    );
                  }
                  return null;
                })}
              </div>

              {/* Figure Info */}
              {currentFigure && (
                <FigureInfoPanel
                  figure={currentFigure}
                  selectedFace={selectedFace}
                />
              )}
            </motion.div>
          ) : (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <ExercisesList
                exercises={currentLesson.exercises}
                onComplete={handleExerciseComplete}
              />

              {completedExercises.size === currentLesson.exercises.length &&
                currentLesson.exercises.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-6 p-6 rounded-xl bg-gradient-to-br from-accent to-accent-dark text-white text-center"
                  >
                    <h3 className="text-xl font-semibold mb-2">
                      🎉 Поздравляем!
                    </h3>
                    <p className="mb-4 opacity-90">
                      Вы выполнили все упражнения в этом уроке
                    </p>
                    <motion.button
                      onClick={handleCompleteLesson}
                      className="px-6 py-3 rounded-lg bg-white text-accent font-medium hover:bg-gray-100 transition-colors"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      Завершить урок
                    </motion.button>
                  </motion.div>
                )}
            </motion.div>
          )}
        </div>
      </motion.div>
    </div>
  );
}
