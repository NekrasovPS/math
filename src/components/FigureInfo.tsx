import { motion, AnimatePresence } from "framer-motion";
import { InlineMath, BlockMath } from "react-katex";
import { cn } from "../utils/cn";
import type { Figure } from "../types";

interface FormulaCardProps {
  title: string;
  formula: string;
  description?: string;
  delay?: number;
}

export function FormulaCard({
  title,
  formula,
  description,
  delay = 0,
}: FormulaCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      transition={{ delay, duration: 0.3 }}
      className="p-4 rounded-lg border bg-card hover:border-accent transition-colors"
    >
      <h4 className="text-sm font-medium mb-2">{title}</h4>
      <div className="mb-2">
        <BlockMath math={formula} className="text-lg" />
      </div>
      {description && (
        <p className="text-xs text-muted-foreground">{description}</p>
      )}
    </motion.div>
  );
}

interface FaceTooltipProps {
  faceName: string;
  position: { x: number; y: number };
  formula?: string;
}

export function FaceTooltip({ faceName, position, formula }: FaceTooltipProps) {
  const faceTitles: { [key: string]: string } = {
    front: "Передняя грань",
    back: "Задняя грань",
    left: "Левая грань",
    right: "Правая грань",
    top: "Верхняя грань",
    bottom: "Нижняя грань",
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8, y: 10 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.8, y: 10 }}
      className="absolute z-10 p-3 rounded-lg bg-accent text-white shadow-lg pointer-events-none"
      style={{
        left: position.x,
        top: position.y,
        transform: "translate(-50%, -100%)",
      }}
    >
      <p className="text-sm font-medium">{faceTitles[faceName]}</p>
      {formula && (
        <div className="mt-1 text-xs opacity-90">
          <InlineMath math={formula} />
        </div>
      )}
      <div className="absolute left-1/2 -bottom-2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-l-transparent border-r-transparent border-t-accent transform -translate-x-1/2" />
    </motion.div>
  );
}

interface FigureInfoPanelProps {
  figure: Figure | null;
  selectedFace: string | null;
  className?: string;
}

export function FigureInfoPanel({
  figure,
  selectedFace,
  className,
}: FigureInfoPanelProps) {
  if (!figure) {
    return (
      <div className={cn("p-6 text-center text-muted-foreground", className)}>
        <p>Выберите фигуру для отображения информации</p>
      </div>
    );
  }

  return (
    <div className={cn("space-y-4", className)}>
      {/* Figure Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="pb-4 border-b"
      >
        <h3 className="text-2xl font-semibold mb-2">{figure.name}</h3>
        <p className="text-muted-foreground">{figure.description}</p>
      </motion.div>

      {/* Selected Face Info */}
      <AnimatePresence>
        {selectedFace && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="p-4 rounded-lg bg-accent-bg border border-accent"
          >
            <h4 className="text-sm font-semibold text-accent mb-2">
              {selectedFace === "front"
                ? "Передняя грань"
                : selectedFace === "back"
                  ? "Задняя грань"
                  : selectedFace === "left"
                    ? "Левая грань"
                    : selectedFace === "right"
                      ? "Правая грань"
                      : selectedFace === "top"
                        ? "Верхняя грань"
                        : "Нижняя грань"}
            </h4>
            <p className="text-sm">
              Площадь грани: <InlineMath math="S = a^2" />
            </p>
            {figure.parameters.side && (
              <p className="text-sm mt-1">
                При a = {figure.parameters.side}: S ={" "}
                {figure.parameters.side ** 2}
              </p>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Formulas */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="space-y-3"
      >
        <h4 className="text-lg font-semibold">Формулы</h4>

        <FormulaCard
          title="Площадь поверхности"
          formula={figure.formulas.surfaceArea.replace("S = ", "")}
          description="Сумма площадей всех граней фигуры"
          delay={0.2}
        />

        <FormulaCard
          title="Объём"
          formula={figure.formulas.volume.replace("V = ", "")}
          description="Количество пространства, занимаемого фигурой"
          delay={0.3}
        />
      </motion.div>

      {/* Parameters */}
      {Object.keys(figure.parameters).length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="pt-4 border-t"
        >
          <h4 className="text-lg font-semibold mb-3">Параметры</h4>
          <div className="grid grid-cols-2 gap-3">
            {Object.entries(figure.parameters).map(([key, value]) => (
              <div key={key} className="p-3 rounded-lg bg-muted text-center">
                <p className="text-xs text-muted-foreground capitalize">
                  {key}
                </p>
                <p className="text-lg font-semibold">{value}</p>
              </div>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  );
}
