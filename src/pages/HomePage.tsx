import { motion } from "framer-motion";
import { cn } from "../utils/cn";
import { geometryLessons } from "../utils/lessonsData";

const features = [
  {
    icon: (
      <svg
        className="h-6 w-6"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
        />
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
        />
      </svg>
    ),
    title: "3D Визуализация",
    description:
      "Интерактивные трёхмерные модели для глубокого понимания геометрических фигур",
  },
  {
    icon: (
      <svg
        className="h-6 w-6"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
        />
      </svg>
    ),
    title: "Пошаговые объяснения",
    description: "Подробные теоретические материалы с формулами и примерами",
  },
  {
    icon: (
      <svg
        className="h-6 w-6"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"
        />
      </svg>
    ),
    title: "Упражнения с проверкой",
    description: "Мгновенная обратная связь и визуализация результатов",
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
    },
  },
};

export function HomePage() {
  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 md:py-32">
        <div className="absolute inset-0 bg-gradient-to-br from-accent-bg via-transparent to-accent-bg/30" />
        <div className="container mx-auto px-4 relative">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-4xl mx-auto"
          >
            <h1 className="text-4xl md:text-5xl font-semibold mb-6">
              Математика в 3D
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Интерактивный учебник по геометрии, алгебре и физике с красивой
              визуализацией и глубоким погружением в материал
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <motion.a
                href="/lessons"
                className={cn(
                  "inline-flex items-center px-6 py-3 rounded-lg",
                  "bg-accent text-white font-medium",
                  "hover:bg-accent-dark transition-colors",
                )}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Начать обучение
                <svg
                  className="ml-2 h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 7l5 5m0 0l-5 5m5-5H6"
                  />
                </svg>
              </motion.a>
              <motion.a
                href="#features"
                className={cn(
                  "inline-flex items-center px-6 py-3 rounded-lg",
                  "border font-medium",
                  "hover:bg-accent-bg transition-colors",
                )}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Узнать больше
              </motion.a>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-semibold mb-4">
              Почему MathViz?
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Мы делаем математику понятной и увлекательной через интерактивную
              визуализацию
            </p>
          </motion.div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid md:grid-cols-3 gap-6"
          >
            {features.map((feature) => (
              <motion.div
                key={feature.title}
                variants={itemVariants}
                className={cn(
                  "p-6 rounded-xl border bg-card",
                  "hover:border-accent transition-colors",
                  "hover:shadow-lg",
                )}
              >
                <div className="h-12 w-12 rounded-lg bg-accent-bg flex items-center justify-center text-accent mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Lessons Preview Section */}
      <section className="py-20 bg-accent-bg/30">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-semibold mb-4">
              Доступные уроки
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Начните с основ геометрии и продвигайтесь к сложным темам
            </p>
          </motion.div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid md:grid-cols-3 gap-6"
          >
            {geometryLessons.map((lesson) => (
              <motion.div
                key={lesson.id}
                variants={itemVariants}
                className={cn(
                  "p-6 rounded-xl border bg-card",
                  "hover:border-accent transition-all",
                  "hover:shadow-lg cursor-pointer",
                )}
              >
                <a href={`/lesson/${lesson.id}`}>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-sm font-medium px-2 py-1 rounded bg-accent-bg text-accent">
                      {lesson.grade} класс
                    </span>
                    <span className="text-xs text-muted-foreground capitalize">
                      {lesson.subject === "geometry"
                        ? "Геометрия"
                        : lesson.subject === "algebra"
                          ? "Алгебра"
                          : "Физика"}
                    </span>
                  </div>
                  <h3 className="text-xl font-semibold mb-2">{lesson.title}</h3>
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {lesson.theory.replace(/[#*`]/g, "").slice(0, 100)}...
                  </p>
                  <div className="mt-4 flex items-center text-accent text-sm font-medium">
                    Начать урок
                    <svg
                      className="ml-1 h-4 w-4"
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
                  </div>
                </a>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="max-w-2xl mx-auto p-8 rounded-2xl bg-gradient-to-br from-accent to-accent-dark text-white"
          >
            <h2 className="text-3xl font-semibold mb-4">Готовы начать?</h2>
            <p className="mb-6 opacity-90">
              Присоединяйтесь к тысячам учеников, которые уже изучают математику
              по-новому
            </p>
            <motion.a
              href="/lessons"
              className="inline-flex items-center px-8 py-3 rounded-lg bg-white text-accent font-medium hover:bg-gray-100 transition-colors"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Начать бесплатно
            </motion.a>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
