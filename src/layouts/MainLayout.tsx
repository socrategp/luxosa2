import { Outlet, useLocation } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import ScrollToTop from '../components/ScrollToTop';
import BackToTop from '../components/BackToTop';
import CustomCursor from '../components/CustomCursor';
import { AnimatePresence, motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { useEffect, useState } from 'react';

export default function MainLayout() {
  const { i18n } = useTranslation();
  const location = useLocation();
  const [language, setLanguage] = useState(i18n.language);

  useEffect(() => {
    const handleLanguageChanged = (nextLanguage: string) => setLanguage(nextLanguage);
    i18n.on('languageChanged', handleLanguageChanged);
    setLanguage(i18n.language);
    return () => i18n.off('languageChanged', handleLanguageChanged);
  }, [i18n]);
  
  return (
    <div className="min-h-screen bg-ivory">
      <ScrollToTop />
      <CustomCursor />
      <Header />
      <AnimatePresence mode="wait">
        <motion.main
          key={location.pathname}
          initial={{ opacity: 0, y: 12, filter: 'blur(3px)' }}
          animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          exit={{ opacity: 0, y: -8, filter: 'blur(3px)' }}
          transition={{ duration: 0.5, ease: [0.25, 0.1, 0, 1] }}
        >
          <Outlet key={language} />
        </motion.main>
      </AnimatePresence>
      <Footer />
      <BackToTop />
    </div>
  );
}
