import type { LessonContent } from "../types";

export const geometryLessons: LessonContent[] = [
  {
    id: "cube-basics",
    title: "Куб и его свойства",
    grade: 5,
    subject: "geometry",
    theory: `
## Куб

**Куб** — это правильная трёхмерная фигура, у которой все грани являются квадратами.

### Свойства куба:
- 6 граней (все квадраты)
- 12 рёбер (все равны)
- 8 вершин

### Формулы:
- **Площадь поверхности**: S = 6a²
- **Объём**: V = a³
- **Диагональ куба**: d = a√3

где **a** — длина ребра куба.
    `,
    figures: [
      {
        id: "cube-1",
        name: "Куб",
        type: "cube",
        description:
          "Правильная трёхмерная фигура с шестью квадратными гранями",
        formulas: {
          surfaceArea: "S = 6a^2",
          volume: "V = a^3",
        },
        parameters: {
          side: 2,
        },
      },
    ],
    exercises: [
      {
        id: "cube-ex-1",
        question: "Чему равна площадь поверхности куба со стороной a = 3 см?",
        type: "input",
        correctAnswer: 54,
        explanation: "S = 6a² = 6 × 3² = 6 × 9 = 54 см²",
      },
      {
        id: "cube-ex-2",
        question: "Чему равен объём куба со стороной a = 4 см?",
        type: "input",
        correctAnswer: 64,
        explanation: "V = a³ = 4³ = 64 см³",
      },
      {
        id: "cube-ex-3",
        question: "Сколько граней у куба?",
        type: "choice",
        options: ["4", "6", "8", "12"],
        correctAnswer: "6",
        explanation: "У куба 6 граней, каждая из которых является квадратом",
      },
    ],
  },
  {
    id: "pyramid-basics",
    title: "Пирамида",
    grade: 7,
    subject: "geometry",
    theory: `
## Пирамида

**Пирамида** — это многогранник, основание которого — многоугольник, а боковые грани — треугольники, сходящиеся в одной вершине.

### Виды пирамид:
- Треугольная (в основании треугольник)
- Четырёхугольная (в основании четырёхугольник)
- Правильная (в основании правильный многоугольник)

### Формулы:
- **Площадь поверхности**: S = S_осн + S_бок
- **Объём**: V = (1/3) × S_осн × h
    `,
    figures: [
      {
        id: "pyramid-1",
        name: "Четырёхугольная пирамида",
        type: "pyramid",
        description: "Пирамида с квадратным основанием",
        formulas: {
          surfaceArea: "S = S_{осн} + S_{бок}",
          volume: "V = \\frac{1}{3} \\times S_{осн} \\times h",
        },
        parameters: {
          side: 2,
          height: 3,
        },
      },
    ],
    exercises: [],
  },
  {
    id: "cylinder-basics",
    title: "Цилиндр",
    grade: 9,
    subject: "geometry",
    theory: `
## Цилиндр

**Цилиндр** — это тело вращения, образованное вращением прямоугольника вокруг одной из его сторон.

### Элементы цилиндра:
- Основания (два равных круга)
- Высота h
- Радиус основания r
- Образующая

### Формулы:
- **Площадь боковой поверхности**: S_бок = 2πrh
- **Площадь полной поверхности**: S = 2πr(r + h)
- **Объём**: V = πr²h
    `,
    figures: [
      {
        id: "cylinder-1",
        name: "Цилиндр",
        type: "cylinder",
        description: "Тело вращения с двумя параллельными круглыми основаниями",
        formulas: {
          surfaceArea: "S = 2\\pi r(r + h)",
          volume: "V = \\pi r^2 h",
        },
        parameters: {
          radius: 1.5,
          height: 3,
        },
      },
    ],
    exercises: [],
  },
];

export const getLessonById = (id: string): LessonContent | undefined => {
  return geometryLessons.find((lesson) => lesson.id === id);
};

export const getLessonsByGrade = (grade: number): LessonContent[] => {
  return geometryLessons.filter((lesson) => lesson.grade === grade);
};

export const getLessonsBySubject = (
  subject: "geometry" | "algebra" | "physics",
): LessonContent[] => {
  return geometryLessons.filter((lesson) => lesson.subject === subject);
};
