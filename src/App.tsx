import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { lazy, Suspense } from 'react';
import { AnimatePresence } from 'framer-motion';
import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/react';
import MainLayout from './layouts/MainLayout';
import { QuizProvider, useQuiz } from './context/QuizContext';
import CookieConsentBanner from './components/CookieConsentBanner';
const DiagnosticTakeover = lazy(() => import('./components/DiagnosticTakeover').then(m => ({ default: m.DiagnosticTakeover })));

const HomePage = lazy(() => import('./pages/HomePage'));
const IlMetodoPage = lazy(() => import('./pages/IlMetodoPage'));
const IPercorsiPage = lazy(() => import('./pages/IPercorsiPage'));
const EsperienzaPage = lazy(() => import('./pages/EsperienzaPage'));
const SediPage = lazy(() => import('./pages/SediPage'));
const MessinaCavourPage = lazy(() => import('./pages/sedi/MessinaCavourPage'));
const PrivacyPolicyPage = lazy(() => import('./pages/PrivacyPolicyPage'));
const CookiePolicyPage = lazy(() => import('./pages/CookiePolicyPage'));

function QuizOverlay() {
  const { quizOpen, closeQuiz } = useQuiz();
  return (
    <Suspense fallback={null}>
      <AnimatePresence>
        {quizOpen && <DiagnosticTakeover onReset={closeQuiz} />}
      </AnimatePresence>
    </Suspense>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <QuizProvider>
        <Suspense fallback={null}>
          <Routes>
            <Route element={<MainLayout />}>
              <Route path="/" element={<HomePage />} />
              <Route path="/il-metodo" element={<IlMetodoPage />} />
              <Route path="/i-percorsi" element={<IPercorsiPage />} />
              <Route path="/le-esperienze" element={<EsperienzaPage />} />
              <Route path="/sedi" element={<SediPage />} />
              <Route path="/sedi/messina-cavour" element={<MessinaCavourPage />} />
              <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />
              <Route path="/cookie-policy" element={<CookiePolicyPage />} />
            </Route>
          </Routes>
        </Suspense>
        <QuizOverlay />
        <CookieConsentBanner />
        <Analytics />
        <SpeedInsights />
      </QuizProvider>
    </BrowserRouter>
  );
}
