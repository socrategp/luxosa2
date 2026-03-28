import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Phone } from 'lucide-react';

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : '';
  }, [menuOpen]);

  useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname]);

  const navItems = [
    { label: 'La Maison', href: '/' },
    { label: 'Il Metodo', href: '/il-metodo' },
    { label: 'I Percorsi', href: '/i-percorsi' },
    { label: 'L\'Esperienza', href: '/esperienza' },
    { label: 'La Tua Soluzione', href: '/la-tua-soluzione' },
    { label: 'Sedi', href: '/sedi' },
    { label: 'Contatti', href: '/contatti' },
  ];

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-700 ${
          scrolled
            ? 'bg-ivory/25 backdrop-blur-2xl border-b border-anthracite/5 shadow-sm'
            : 'bg-transparent border-b border-transparent'
        }`}
      >
        <div className="max-w-[1400px] mx-auto px-6 md:px-10 lg:px-16">
          <div className="flex items-center justify-between h-20 md:h-24">
            <Link to="/" className="relative z-50 transition-opacity duration-300 hover:opacity-80">
              <img
                src="/images/luxosa-logo-orizzontale-bianco-tras.png"
                alt="Luxosa"
                className={`h-7 md:h-9 w-auto object-contain transition-all duration-700 ${
                  !scrolled || menuOpen ? 'brightness-0 invert' : ''
                }`}
              />
            </Link>

            <nav className="hidden lg:flex items-center gap-8 xl:gap-10">
  {navItems.map((item) => {
    const isActive = item.href === '/'
      ? location.pathname === '/'
      : location.pathname.startsWith(item.href);
    return (
      <Link
        key={item.label}
        to={item.href}
        className="relative group"
      >
        <span
          className={`text-[12.5px] tracking-[0.14em] uppercase transition-all duration-700 ${
            isActive
              ? scrolled ? 'font-normal text-anthracite' : 'font-normal text-white'
              : scrolled ? 'font-light text-anthracite/60 group-hover:text-anthracite/90' : 'font-light text-white/60 group-hover:text-white/90'
          }`}
        >
          {item.label}
        </span>
        <span
          className={`absolute -bottom-1.5 left-0 h-[1px] bg-brass transition-all duration-500 ease-out ${
            isActive ? 'w-full opacity-100' : 'w-0 opacity-0 group-hover:w-full group-hover:opacity-40'
          }`}
        />
      </Link>
    );
  })}
</nav>
            <div className="hidden lg:flex items-center">
              <Link
                to="/contatti"
                className={`text-[12px] tracking-[0.12em] uppercase font-light px-6 py-2.5 border transition-all duration-700 ${
                  scrolled
                    ? 'border-anthracite/25 text-anthracite hover:bg-anthracite hover:text-ivory'
                    : 'border-white/40 text-white hover:bg-white/15'
                }`}
              >
                Prenota
              </Link>
            </div>

            <button
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label={menuOpen ? 'Chiudi menu' : 'Apri menu'}
              aria-expanded={menuOpen}
              className={`lg:hidden relative z-50 p-2 transition-colors duration-700 ${
                menuOpen ? 'text-ivory' : scrolled ? 'text-anthracite' : 'text-white'
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
            transition={{ duration: 0.5 }}
            className="fixed inset-0 z-40 bg-charcoal flex flex-col items-center justify-center"
          >
            <nav className="flex flex-col items-center gap-7">
              {navItems.map((item, i) => (
                <motion.div
                  key={item.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 + i * 0.05, duration: 0.5 }}
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
                transition={{ delay: 0.5, duration: 0.5 }}
                className="mt-8 flex flex-col items-center gap-4"
              >
                <Link
                  to="/contatti"
                  onClick={() => setMenuOpen(false)}
                  className="text-[13px] tracking-[0.15em] uppercase text-ivory border border-ivory/30 px-8 py-3 hover:bg-ivory/10 transition-all"
                >
                  Prenota una consulenza
                </Link>
                <a href="tel:+390000000000" className="flex items-center gap-2 text-stone text-sm tracking-wider mt-4">
                  <Phone size={14} strokeWidth={1.5} />
                  +39 000 000 0000
                </a>
              </motion.div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
