import { useCallback, useEffect, useRef } from 'react';
import { useQuiz } from '../../context/QuizContext';

/**
 * Opens the single global Luxosa Test popup (same instance used by Header and
 * I Percorsi). The popup scrolls the window to top when it mounts, so the
 * landing remembers where the visitor clicked and returns there on close.
 * Never navigates: path and query string (UTM, fbclid, gclid…) stay untouched.
 */
export function useLandingTestCta(): () => void {
  const { quizOpen, openQuiz } = useQuiz();
  const savedScrollY = useRef<number | null>(null);
  const wasOpen = useRef(quizOpen);

  useEffect(() => {
    if (wasOpen.current && !quizOpen && savedScrollY.current !== null) {
      const top = savedScrollY.current;
      savedScrollY.current = null;
      requestAnimationFrame(() => window.scrollTo({ top, behavior: 'instant' }));
    }
    wasOpen.current = quizOpen;
  }, [quizOpen]);

  return useCallback(() => {
    savedScrollY.current = window.scrollY;
    openQuiz();
  }, [openQuiz]);
}
