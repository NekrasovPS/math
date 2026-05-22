import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { geometryLessons } from '@utils/lessonsData';
import { cn } from '@utils/cn';

const subjectColors = {
  geometry: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
  algebra: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
  physics: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
};

const subjectNames = {
  geometry: 'Геометрия',
  algebra: 'Алгебра',
  physics: 'Физика',
};

export function LessonsPage() {
  const groupedLessons = geometryLessons.reduce((acc, lesson) => {
    if (!acc[lesson.grade]) {
      acc[lesson.grade] = [];
    }
    acc[lesson.grade].push(lesson);
    return acc;
  }, {} as Record<number, typeof geometryLessons>);

  return (
    <div className="container mx-auto px-4 py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-12"
      >
        <h1 className="text-4xl font-semibold mb-4">Все уроки</h1>
        <p className="text-muted-foreground text-lg">
          Выберите урок по классу или теме для начала обучения
        </p>
      </motion.div>

      {Object.entries(groupedLessons).map(([grade, lessons]) => (
        <motion.section
          key={grade}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <h2 className="text-2xl font-semibold mb-6 flex items-center gap-3">
            <span className="flex items-center justify-center w-10 h-10 rounded-full bg-accent text-white text-sm font-bold">
              {grade}
            </span>
            Класс
          </h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {lessons.map((lesson) => (
              <motion.div
                key={lesson.id}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={cn(
                  'p-6 rounded-xl border bg-card',
                  'hover:border-accent transition-all',
                  'hover:shadow-lg cursor-pointer'
                )}
              >
                <Link to={`/lesson/${lesson.id}`}>
                  <div className="flex items-center gap-2 mb-4">
                    <span
                      className={cn(
                        'text-xs font-medium px-2 py-1 rounded-full',
                        subjectColors[lesson.subject]
                      )}
                    >
                      {subjectNames[lesson.subject]}
                    </span>
                  </div>

                  <h3 className="text-xl font-semibold mb-3">{lesson.title}</h3>

                  <p className="text-sm text-muted-foreground line-clamp-3 mb-4">
                    {lesson.theory.replace(/[#*`]/g, '').slice(0, 150)}...
                  </p>

                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">
                      {lesson.figures.length} фигур • {lesson.exercises.length} упражнений
                    </span>
                    <span className="text-accent text-sm font-medium flex items-center gap-1">
                      Начать
                      <svg
                        className="h-4 w-4"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 5l7 7-7 7"
                        />
                      </svg>
                    </span>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </motion.section>
      ))}
    </div>
  );
}
