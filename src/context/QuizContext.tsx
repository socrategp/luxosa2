import { createContext, useContext, useState } from 'react';
import type { ReactNode } from 'react';

export type QuizVariant = 'legacy' | 'new';

interface QuizContextValue {
  quizOpen: boolean;
  quizVariant: QuizVariant;
  // Defaults to 'legacy' (the existing production quiz) so every current
  // caller (Header, I Percorsi) is unaffected. Only the new /luxosa-test
  // landing page passes 'new' to open the backend-integrated quiz instead.
  openQuiz: (variant?: QuizVariant) => void;
  closeQuiz: () => void;
}

const QuizContext = createContext<QuizContextValue | null>(null);

export function QuizProvider({ children }: { children: ReactNode }) {
  const [quizOpen, setQuizOpen] = useState(false);
  const [quizVariant, setQuizVariant] = useState<QuizVariant>('legacy');
  return (
    <QuizContext.Provider
      value={{
        quizOpen,
        quizVariant,
        openQuiz: (variant = 'legacy') => {
          setQuizVariant(variant);
          setQuizOpen(true);
        },
        closeQuiz: () => setQuizOpen(false),
      }}
    >
      {children}
    </QuizContext.Provider>
  );
}

export function useQuiz(): QuizContextValue {
  const ctx = useContext(QuizContext);
  if (!ctx) throw new Error('useQuiz must be used within QuizProvider');
  return ctx;
}
