import { createContext, useContext, useState } from 'react';
import type { ReactNode } from 'react';

export type QuizVariant = 'legacy' | 'new';

interface QuizContextValue {
  quizOpen: boolean;
  quizVariant: QuizVariant;
  // Defaults to 'new' (the backend-integrated quiz): a caller that omits the
  // variant can never open the legacy quiz. 'legacy' stays in the code but no
  // button requests it.
  openQuiz: (variant?: QuizVariant) => void;
  closeQuiz: () => void;
}

const QuizContext = createContext<QuizContextValue | null>(null);

export function QuizProvider({ children }: { children: ReactNode }) {
  const [quizOpen, setQuizOpen] = useState(false);
  const [quizVariant, setQuizVariant] = useState<QuizVariant>('new');
  return (
    <QuizContext.Provider
      value={{
        quizOpen,
        quizVariant,
        openQuiz: (variant = 'new') => {
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
