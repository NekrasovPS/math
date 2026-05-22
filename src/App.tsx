import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Layout } from "./components/Layout";
import { HomePage } from "./pages/HomePage";
import { LessonsPage } from "./pages/LessonsPage";
import { LessonPage } from "./pages/LessonPage";

function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/lessons" element={<LessonsPage />} />
          <Route path="/lesson/:id" element={<LessonPage />} />
          <Route
            path="/exercises"
            element={
              <div className="container mx-auto px-4 py-12 text-center">
                <h1 className="text-4xl font-semibold mb-4">Упражнения</h1>
                <p className="text-muted-foreground">
                  Все упражнения доступны в уроках. Выберите урок для начала
                  обучения.
                </p>
              </div>
            }
          />
          <Route
            path="/progress"
            element={
              <div className="container mx-auto px-4 py-12 text-center">
                <h1 className="text-4xl font-semibold mb-4">Ваш прогресс</h1>
                <p className="text-muted-foreground">
                  Здесь будет отображаться статистика обучения.
                </p>
              </div>
            }
          />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}

export default App;
