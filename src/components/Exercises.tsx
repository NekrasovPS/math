import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAppDispatch } from "../hooks/redux";
import { updateExerciseProgress } from "../store/progressSlice";
import type { Exercise } from "../types";
import { cn } from "../utils/cn";

interface ExerciseCardProps {
  exercise: Exercise;
  onComplete?: (isCorrect: boolean) => void;
}

export function ExerciseCard({ exercise, onComplete }: ExerciseCardProps) {
  const dispatch = useAppDispatch();
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [inputAnswer, setInputAnswer] = useState<string>("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [showExplanation, setShowExplanation] = useState(false);

  const isCorrect = useCallback(() => {
    if (exercise.type === "choice") {
      return selectedAnswer === String(exercise.correctAnswer);
    }
    return inputAnswer === String(exercise.correctAnswer);
  }, [exercise, selectedAnswer, inputAnswer]);

  const handleSubmit = () => {
    if (isSubmitted) {
      setShowExplanation(!showExplanation);
      return;
    }

    const correct = isCorrect();
    setIsSubmitted(true);
    setShowExplanation(true);

    dispatch(
      updateExerciseProgress({
        exerciseId: exercise.id,
        correct,
      }),
    );

    if (onComplete) {
      onComplete(correct);
    }
  };

  const handleReset = () => {
    setSelectedAnswer(null);
    setInputAnswer("");
    setIsSubmitted(false);
    setShowExplanation(false);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-6 rounded-xl border bg-card"
    >
      {/* Question */}
      <h3 className="text-lg font-semibold mb-4">{exercise.question}</h3>

      {/* Answer Options */}
      {exercise.type === "choice" && exercise.options && (
        <div className="space-y-2 mb-4">
          {exercise.options.map((option) => (
            <motion.button
              key={option}
              onClick={() => !isSubmitted && setSelectedAnswer(option)}
              disabled={isSubmitted}
              className={cn(
                "w-full p-4 rounded-lg border text-left transition-all",
                "hover:border-accent hover:bg-accent-bg/50",
                selectedAnswer === option && "border-accent bg-accent-bg",
                isSubmitted &&
                  option === String(exercise.correctAnswer) &&
                  "border-green-500 bg-green-500/10",
                isSubmitted &&
                  selectedAnswer === option &&
                  selectedAnswer !== String(exercise.correctAnswer) &&
                  "border-red-500 bg-red-500/10",
              )}
              whileHover={{ scale: isSubmitted ? 1 : 1.01 }}
              whileTap={{ scale: isSubmitted ? 1 : 0.99 }}
            >
              <span className="flex items-center justify-between">
                <span>{option}</span>
                {isSubmitted && option === String(exercise.correctAnswer) && (
                  <svg
                    className="h-5 w-5 text-green-500"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                )}
                {isSubmitted &&
                  selectedAnswer === option &&
                  option !== String(exercise.correctAnswer) && (
                    <svg
                      className="h-5 w-5 text-red-500"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  )}
              </span>
            </motion.button>
          ))}
        </div>
      )}

      {/* Input Answer */}
      {exercise.type === "input" && (
        <div className="mb-4">
          <input
            type="text"
            value={inputAnswer}
            onChange={(e) => !isSubmitted && setInputAnswer(e.target.value)}
            disabled={isSubmitted}
            placeholder="Введите ваш ответ"
            className={cn(
              "w-full p-4 rounded-lg border bg-background",
              "focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20",
              isSubmitted && isCorrect() && "border-green-500",
              isSubmitted && !isCorrect() && "border-red-500",
            )}
          />
        </div>
      )}

      {/* Submit Button */}
      <div className="flex gap-2">
        {!isSubmitted ? (
          <motion.button
            onClick={handleSubmit}
            className={cn(
              "px-6 py-2 rounded-lg font-medium",
              "bg-accent text-white",
              "hover:bg-accent-dark transition-colors",
            )}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            Проверить
          </motion.button>
        ) : (
          <>
            <motion.button
              onClick={handleReset}
              className={cn(
                "px-6 py-2 rounded-lg font-medium border",
                "hover:bg-muted transition-colors",
              )}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              Попробовать снова
            </motion.button>
            <motion.button
              onClick={() => setShowExplanation(!showExplanation)}
              className={cn(
                "px-6 py-2 rounded-lg font-medium text-accent",
                "hover:bg-accent-bg transition-colors",
              )}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {showExplanation ? "Скрыть" : "Объяснение"}
            </motion.button>
          </>
        )}
      </div>

      {/* Result */}
      <AnimatePresence>
        {isSubmitted && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className={cn(
              "mt-4 p-4 rounded-lg",
              isCorrect()
                ? "bg-green-500/10 border border-green-500"
                : "bg-red-500/10 border border-red-500",
            )}
          >
            <div className="flex items-center gap-2 mb-2">
              {isCorrect() ? (
                <>
                  <svg
                    className="h-5 w-5 text-green-500"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  <span className="font-semibold text-green-500">
                    Правильно!
                  </span>
                </>
              ) : (
                <>
                  <svg
                    className="h-5 w-5 text-red-500"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  <span className="font-semibold text-red-500">
                    Неправильно
                  </span>
                </>
              )}
            </div>

            {!isCorrect() && (
              <p className="text-sm text-muted-foreground">
                Правильный ответ:{" "}
                <span className="font-medium">{exercise.correctAnswer}</span>
              </p>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Explanation */}
      <AnimatePresence>
        {showExplanation && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="mt-4 p-4 rounded-lg bg-accent-bg border border-accent"
          >
            <h4 className="text-sm font-semibold text-accent mb-2">
              Объяснение:
            </h4>
            <p className="text-sm">{exercise.explanation}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

interface ExercisesListProps {
  exercises: Exercise[];
  onComplete?: (exerciseId: string, isCorrect: boolean) => void;
}

export function ExercisesList({ exercises, onComplete }: ExercisesListProps) {
  if (exercises.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        <p>В этом уроке пока нет упражнений</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {exercises.map((exercise) => (
        <ExerciseCard
          key={exercise.id}
          exercise={exercise}
          onComplete={(isCorrect) => onComplete?.(exercise.id, isCorrect)}
        />
      ))}
    </div>
  );
}
