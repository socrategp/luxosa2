import { BrowserRouter, Routes, Route } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
import HomePage from './pages/HomePage';
import LaMaisonPage from './pages/LaMaisonPage';
import IlMetodoPage from './pages/IlMetodoPage';
import IPercorsiPage from './pages/IPercorsiPage';
import EsperienzaPage from './pages/EsperienzaPage';
import SediPage from './pages/SediPage';
import ContattiPage from './pages/ContattiPage';
import MessinaCavourPage from './pages/sedi/MessinaCavourPage';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<MainLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/la-maison" element={<LaMaisonPage />} />
          <Route path="/il-metodo" element={<IlMetodoPage />} />
          <Route path="/i-percorsi" element={<IPercorsiPage />} />
          <Route path="/esperienza" element={<EsperienzaPage />} />
          <Route path="/sedi" element={<SediPage />} />
          <Route path="/sedi/messina-cavour" element={<MessinaCavourPage />} />
          <Route path="/contatti" element={<ContattiPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
