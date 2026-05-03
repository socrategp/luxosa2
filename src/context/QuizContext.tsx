import { createContext, useContext, useState } from 'react';
import type { ReactNode } from 'react';

interface QuizContextValue {
  quizOpen: boolean;
  openQuiz: () => void;
  closeQuiz: () => void;
}

const QuizContext = createContext<QuizContextValue | null>(null);

export function QuizProvider({ children }: { children: ReactNode }) {
  const [quizOpen, setQuizOpen] = useState(false);
  return (
    <QuizContext.Provider value={{ quizOpen, openQuiz: () => setQuizOpen(true), closeQuiz: () => setQuizOpen(false) }}>
      {children}
    </QuizContext.Provider>
  );
}

export function useQuiz(): QuizContextValue {
  const ctx = useContext(QuizContext);
  if (!ctx) throw new Error('useQuiz must be used within QuizProvider');
  return ctx;
}
