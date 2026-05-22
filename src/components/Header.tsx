import { motion } from 'framer-motion';
import { useAppDispatch, useAppSelector } from '@hooks/redux';
import { toggleTheme } from '@store/themeSlice';
import { cn } from '@utils/cn';

interface HeaderProps {
  className?: string;
}

export function Header({ className }: HeaderProps) {
  const dispatch = useAppDispatch();
  const themeMode = useAppSelector((state) => state.theme.mode);

  const handleToggleTheme = () => {
    dispatch(toggleTheme());
  };

  return (
    <header
      className={cn(
        'sticky top-0 z-50 border-b bg-bg/80 backdrop-blur-md transition-colors',
        className
      )}
    >
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <motion.a
            href="/"
            className="flex items-center gap-2 text-xl font-semibold"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <svg
              className="h-8 w-8 text-accent"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M12 2L2 7l10 5 10-5-10-5z" />
              <path d="M2 17l10 5 10-5" />
              <path d="M2 12l10 5 10-5" />
            </svg>
            <span>MathViz</span>
          </motion.a>

          {/* Navigation */}
          <nav className="hidden md:flex items-center gap-6">
            <a
              href="/"
              className="text-sm font-medium transition-colors hover:text-accent"
            >
              Главная
            </a>
            <a
              href="/lessons"
              className="text-sm font-medium transition-colors hover:text-accent"
            >
              Уроки
            </a>
            <a
              href="/exercises"
              className="text-sm font-medium transition-colors hover:text-accent"
            >
              Упражнения
            </a>
            <a
              href="/progress"
              className="text-sm font-medium transition-colors hover:text-accent"
            >
              Прогресс
            </a>
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-4">
            {/* Theme Toggle */}
            <motion.button
              onClick={handleToggleTheme}
              className="p-2 rounded-lg border transition-colors hover:bg-accent-bg"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              aria-label="Переключить тему"
            >
              {themeMode === 'light' ? (
                <svg
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
                  />
                </svg>
              ) : (
                <svg
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
                  />
                </svg>
              )}
            </motion.button>

            {/* Mobile Menu Button */}
            <motion.button
              className="md:hidden p-2 rounded-lg border transition-colors"
              whileTap={{ scale: 0.95 }}
              aria-label="Открыть меню"
            >
              <svg
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </motion.button>
          </div>
        </div>
      </div>
    </header>
  );
}
