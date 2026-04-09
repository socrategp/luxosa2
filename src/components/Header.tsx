import { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X } from 'lucide-react';
import { DiagnosticTakeover } from './DiagnosticTakeover';

const LIGHT_TOP_PAGES = ['/privacy-policy', '/cookie-policy'];

const navItems = [
  { label: 'La Maison', href: '/' },
  { label: 'Il Metodo', href: '/il-metodo' },
  { label: 'I Percorsi', href: '/i-percorsi' },
  { label: "L'Esperienza", href: '/esperienza' },
  { label: 'Sedi', href: '/sedi' },
  { label: 'Contatti', href: '/contatti' },
];

import { premiumEase } from '../lib/animations';

export default function Header() {
  const [scrollY, setScrollY] = useState(0);
  const [revealed, setRevealed] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [quizOpen, setQuizOpen] = useState(false);
  const location = useLocation();
  const lastScrollY = useRef(0);

  const isLightTop = LIGHT_TOP_PAGES.includes(location.pathname);

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
    document.body.style.overflow = (menuOpen || quizOpen) ? 'hidden' : '';
  }, [menuOpen, quizOpen]);

  useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname]);

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
  const navHoverColor = onLight ? 'text-anthracite/90' : 'text-white/90';
  const navMutedColor = onLight ? 'text-anthracite/60' : 'text-white/60';

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
                alt="Luxosa"
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

            <div className="hidden lg:flex items-center">
              <button
                onClick={() => setQuizOpen(true)}
                className={`text-[12px] tracking-[0.12em] uppercase font-light px-6 py-2.5 border transition-all duration-500 ${
                  onLight
                    ? 'border-anthracite/25 text-anthracite hover:bg-anthracite hover:text-ivory'
                    : 'border-white/40 text-white hover:bg-white/15'
                }`}
              >
                La tua soluzione
              </button>
            </div>

            <button
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label={menuOpen ? 'Chiudi menu' : 'Apri menu'}
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
                    className={`font-serif text-3xl tracking-[0.1em] font-light transition-colors ${
                      location.pathname === item.href ? 'text-brass-light' : 'text-ivory/90 hover:text-brass-light'
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
                className="mt-8"
              >
                <button
                  onClick={() => { setMenuOpen(false); setQuizOpen(true); }}
                  className="text-[16px] tracking-[0.15em] uppercase text-ivory border border-ivory/30 px-8 py-3 hover:bg-ivory/10 transition-all"
                >
                  La tua soluzione
                </button>
              </motion.div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {quizOpen && (
          <DiagnosticTakeover onReset={() => setQuizOpen(false)} />
        )}
      </AnimatePresence>
    </>
  );
}
