import type { ReactNode } from "react";
import { Header } from "./Header";

interface LayoutProps {
  children: ReactNode;
}

export function Layout({ children }: LayoutProps) {
  return (
    <div className="min-h-screen bg-background transition-colors">
      <Header />
      <main className="flex-1">{children}</main>
      <footer className="border-t py-8 mt-auto">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>© 2026 MathViz. Интерактивный учебник математики.</p>
          <p className="mt-2">
            Создано с <span className="text-accent">❤</span> для изучения
            геометрии, алгебры и физики
          </p>
        </div>
      </footer>
    </div>
  );
}
