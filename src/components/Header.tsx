import { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Menu, X } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useQuiz } from '../context/QuizContext';
import { SUPPORTED_LANGUAGES, type SupportedLanguage } from '../i18n/config';
import { premiumEase } from '../lib/animations';

const LIGHT_TOP_PAGES = ['/privacy-policy', '/cookie-policy'];

const LANGUAGE_LABELS: Record<SupportedLanguage, string> = {
  it: 'Italiano',
  en: 'English',
  fr: 'Français',
  de: 'Deutsch',
  es: 'Español',
  ru: 'Русский',
  ja: '日本語',
};

export default function Header() {
  const { t, i18n } = useTranslation();
  const [scrollY, setScrollY] = useState(0);
  const [revealed, setRevealed] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [languageOpen, setLanguageOpen] = useState(false);
  const { quizOpen, openQuiz } = useQuiz();
  const location = useLocation();
  const lastScrollY = useRef(0);
  const desktopLanguageRef = useRef<HTMLDivElement>(null);
  const mobileLanguageRef = useRef<HTMLDivElement>(null);

  const isLightTop = LIGHT_TOP_PAGES.includes(location.pathname);
  const currentLanguage = SUPPORTED_LANGUAGES.includes(i18n.language as SupportedLanguage)
    ? (i18n.language as SupportedLanguage)
    : 'it';
  const navItems = [
    { label: t('common:header.003'), href: '/' },
    { label: t('common:header.004'), href: '/il-metodo' },
    { label: t('common:header.005'), href: '/i-percorsi' },
    { label: t('common:header.006'), href: '/le-esperienze' },
    { label: t('common:header.007'), href: '/sedi' },
  ];

  const handleLanguageChange = (language: SupportedLanguage) => {
    window.localStorage.setItem('luxosa-language', language);
    void i18n.changeLanguage(language);
    setLanguageOpen(false);
  };

  useEffect(() => {
    const handleScroll = () => {
      const current = window.scrollY;
      if (current < 10) {
        setScrollY(current);
        setRevealed(false);
      } else if (current < lastScrollY.current) {
        setScrollY(current);
        setRevealed(true);
      } else {
        setScrollY(current);
        setRevealed(false);
      }
      lastScrollY.current = current;
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : '';
  }, [menuOpen]);

  useEffect(() => {
    setMenuOpen(false);
    setLanguageOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      if (!desktopLanguageRef.current?.contains(target) && !mobileLanguageRef.current?.contains(target)) {
        setLanguageOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const atTop = scrollY < 10;
  const isScrolled = !atTop && revealed;

  const onLight = isLightTop ? true : isScrolled;

  const headerBg = atTop && !isLightTop
    ? 'bg-transparent'
    : isScrolled || isLightTop
      ? 'bg-ivory'
      : '-translate-y-full';

  const logoFilter = onLight ? 'brightness-0' : 'brightness-0 invert';
  const navColor = onLight ? 'text-anthracite' : 'text-white';
  const navHoverColor = onLight ? 'text-anthracite/95' : 'text-white/95';
  const navMutedColor = onLight ? 'text-anthracite/75' : 'text-white/75';

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${headerBg} ${quizOpen ? 'invisible' : ''} ${!isScrolled && !atTop && !isLightTop ? '-translate-y-full' : ''}`}
        style={{ transitionProperty: 'transform, background-color' }}
      >
        <div className="max-w-[1400px] mx-auto px-6 md:px-10 lg:px-16">
          <div className="flex items-center justify-between h-20 md:h-24">
            <Link to="/" className="relative z-50 transition-opacity duration-300 hover:opacity-80">
              <img
                src="/images/luxosa-logo-orizzontale-bianco-tras.png"
                alt={t('common:header.009')}
                width={1000}
                height={300}
                className={`h-7 md:h-9 w-auto object-contain transition-all duration-500 ${menuOpen ? 'brightness-0 invert' : logoFilter}`}
              />
            </Link>

            <nav className="hidden lg:flex items-center gap-8 xl:gap-10">
              {navItems.map((item) => {
                const isActive = item.href === '/'
                  ? location.pathname === '/'
                  : location.pathname.startsWith(item.href);
                return (
                  <Link key={item.label} to={item.href} className="relative group">
                    <span className={`text-[12.5px] tracking-[0.14em] uppercase font-light transition-all duration-500 ${
                      isActive ? `font-normal ${navColor}` : `${navMutedColor} hover:${navHoverColor}`
                    }`}>
                      {item.label}
                    </span>
                    <span className={`absolute -bottom-1.5 left-0 h-[1px] bg-brass transition-all duration-500 ease-out ${
                      isActive ? 'w-full opacity-100' : 'w-0 opacity-0 group-hover:w-full group-hover:opacity-40'
                    }`} />
                  </Link>
                );
              })}
            </nav>

            <div className="hidden lg:flex items-center gap-5">
              <button
                onClick={openQuiz}
                className={`text-[12px] tracking-[0.12em] uppercase font-light px-6 py-2.5 border transition-all duration-500 ${
                  onLight
                    ? 'border-anthracite/25 text-anthracite hover:bg-anthracite hover:text-ivory'
                    : 'border-white/40 text-white hover:bg-white/15'
                }`}
              >{t('common:header.015')}</button>
              <div ref={desktopLanguageRef} className="relative" aria-label="Language selector">
                <button
                  type="button"
                  onClick={() => setLanguageOpen((open) => !open)}
                  aria-expanded={languageOpen}
                  className={`flex h-10 min-w-14 items-center justify-center gap-1.5 border px-3 text-[10px] font-light uppercase tracking-[0.18em] transition-all duration-500 ${
                    onLight
                      ? 'border-anthracite/15 text-anthracite/75 hover:border-anthracite/30 hover:text-anthracite'
                      : 'border-white/25 text-white/75 hover:border-white/45 hover:text-white'
                  }`}
                >
                  {currentLanguage.toUpperCase()}
                  <ChevronDown
                    size={12}
                    strokeWidth={1.4}
                    className={`transition-transform duration-300 ${languageOpen ? 'rotate-180' : ''}`}
                  />
                </button>
                <AnimatePresence>
                  {languageOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -6 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -6 }}
                      transition={{ duration: 0.25, ease: premiumEase }}
                      className="absolute right-0 top-12 w-40 border border-sand/60 bg-ivory/95 py-2 shadow-[0_18px_45px_rgba(30,26,22,0.12)] backdrop-blur-md"
                    >
                      {SUPPORTED_LANGUAGES.map((language) => (
                        <button
                          key={language}
                          type="button"
                          onClick={() => handleLanguageChange(language)}
                          className={`block w-full px-4 py-2.5 text-left text-[12px] font-light tracking-[0.08em] transition-colors duration-300 ${
                            currentLanguage === language
                              ? 'text-brass-muted'
                              : 'text-anthracite/70 hover:text-anthracite'
                          }`}
                          aria-current={currentLanguage === language ? 'true' : undefined}
                        >
                          {LANGUAGE_LABELS[language]}
                        </button>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>

            <button
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label={menuOpen ?t('common:header.016') :t('common:header.017')}
              aria-expanded={menuOpen}
              className={`lg:hidden relative z-50 p-2 transition-colors duration-500 ${
                menuOpen ? 'text-ivory' : onLight ? 'text-anthracite' : 'text-white'
              }`}
            >
              {menuOpen ? <X size={24} strokeWidth={1} /> : <Menu size={24} strokeWidth={1} />}
            </button>
          </div>
        </div>
      </header>

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5, ease: premiumEase }}
            className="fixed inset-0 z-40 bg-charcoal flex flex-col items-center justify-center"
          >
            <nav className="flex flex-col items-center gap-7">
              {navItems.map((item, i) => (
                <motion.div
                  key={item.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 + i * 0.05, duration: 0.5, ease: premiumEase }}
                >
                  <Link
                    to={item.href}
                    onClick={() => setMenuOpen(false)}
                    className={`font-serif text-3xl tracking-[0.1em] font-light transition-colors duration-300 ${
                      location.pathname === item.href ? 'text-brass-light' : 'text-ivory/95 hover:text-brass-light'
                    }`}
                  >
                    {item.label}
                  </Link>
                </motion.div>
              ))}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.45, duration: 0.5, ease: premiumEase }}
                className="mt-5 flex flex-col items-center gap-8"
              >
                <div ref={mobileLanguageRef} className="flex flex-col items-center gap-3" aria-label="Language selector">
                  <button
                    type="button"
                    onClick={() => setLanguageOpen((open) => !open)}
                    aria-expanded={languageOpen}
                    className="flex h-11 min-w-16 items-center justify-center gap-2 border border-ivory/25 px-4 text-[11px] font-light uppercase tracking-[0.24em] text-ivory transition-all duration-300 hover:border-ivory/45"
                  >
                    {currentLanguage.toUpperCase()}
                    <ChevronDown
                      size={13}
                      strokeWidth={1.4}
                      className={`transition-transform duration-300 ${languageOpen ? 'rotate-180' : ''}`}
                    />
                  </button>
                  <AnimatePresence>
                    {languageOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: -8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -8 }}
                        transition={{ duration: 0.3, ease: premiumEase }}
                        className="grid grid-cols-1 gap-1 text-center"
                      >
                        {SUPPORTED_LANGUAGES.map((language) => (
                          <button
                            key={language}
                            type="button"
                            onClick={() => handleLanguageChange(language)}
                            className={`px-4 py-1.5 text-[13px] font-light tracking-[0.12em] transition-colors duration-300 ${
                              currentLanguage === language ? 'text-brass-light' : 'text-ivory/60 hover:text-ivory'
                            }`}
                            aria-current={currentLanguage === language ? 'true' : undefined}
                          >
                            {LANGUAGE_LABELS[language]}
                          </button>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
                <button
                  onClick={() => { setMenuOpen(false); openQuiz(); }}
                  className="text-[16px] tracking-[0.15em] uppercase text-ivory border border-ivory/30 px-8 py-3 hover:bg-ivory/10 transition-all duration-300"
                >{t('common:header.020')}</button>
              </motion.div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>

    </>
  );
}
