import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { lazy, Suspense } from 'react';
import MainLayout from './layouts/MainLayout';

const HomePage = lazy(() => import('./pages/HomePage'));
const IlMetodoPage = lazy(() => import('./pages/IlMetodoPage'));
const IPercorsiPage = lazy(() => import('./pages/IPercorsiPage'));
const EsperienzaPage = lazy(() => import('./pages/EsperienzaPage'));
const SediPage = lazy(() => import('./pages/SediPage'));
const ContattiPage = lazy(() => import('./pages/ContattiPage'));
const MessinaCavourPage = lazy(() => import('./pages/sedi/MessinaCavourPage'));
const PrivacyPolicyPage = lazy(() => import('./pages/PrivacyPolicyPage'));
const CookiePolicyPage = lazy(() => import('./pages/CookiePolicyPage'));

export default function App() {
  return (
    <BrowserRouter>
      <Suspense fallback={null}>
        <Routes>
          <Route element={<MainLayout />}>
            <Route path="/" element={<HomePage />} />
            <Route path="/il-metodo" element={<IlMetodoPage />} />
            <Route path="/i-percorsi" element={<IPercorsiPage />} />
            <Route path="/le-esperienze" element={<EsperienzaPage />} />
            <Route path="/sedi" element={<SediPage />} />
            <Route path="/sedi/messina-cavour" element={<MessinaCavourPage />} />
            <Route path="/contatti" element={<ContattiPage />} />
            <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />
            <Route path="/cookie-policy" element={<CookiePolicyPage />} />

          </Route>
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}
