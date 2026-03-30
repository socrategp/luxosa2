import { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Phone } from 'lucide-react';

// Pagine senza hero scura: il header parte già in modalità solid ivory
const LIGHT_TOP_PAGES = ['/privacy-policy', '/cookie-policy'];

export default function Header() {
  const location = useLocation();
  const isLightTop = LIGHT_TOP_PAGES.includes(location.pathname);

  const [scrolled, setScrolled] = useState(isLightTop);
  const [hidden, setHidden] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const lastScrollY = useRef(0);

  // Reset header state ad ogni cambio pagina
  useEffect(() => {
    setMenuOpen(false);
    setHidden(false);
    lastScrollY.current = 0;
    // Solid su pagine light, trasparente su pagine con hero scura
    setScrolled(LIGHT_TOP_PAGES.includes(location.pathname));
  }, [location.pathname]);

  useEffect(() => {
    const handleScroll = () => {
      const currentY = window.scrollY;
      const isScrollingDown = currentY > lastScrollY.current;

      if (currentY < 10) {
        // Torna trasparente in cima solo su pagine con hero scura
        if (!isLightTop) setScrolled(false);
        setHidden(false);
      } else if (isScrollingDown) {
        // Scorrendo verso il basso: nasconde dopo soglia, NON cambia stile
        if (currentY > 100) setHidden(true);
      } else {
        // Scorrendo verso l'alto: mostra con sfondo ivory pieno
        setHidden(false);
        setScrolled(true);
      }

      lastScrollY.current = currentY;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isLightTop]);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : '';
    if (menuOpen) setHidden(false);
  }, [menuOpen]);

  const navItems = [
    { label: 'La Maison', href: '/' },
    { label: 'Il Metodo', href: '/il-metodo' },
    { label: 'I Percorsi', href: '/i-percorsi' },
    { label: 'L\'Esperienza', href: '/esperienza' },
    { label: 'La Tua Soluzione', href: '/la-tua-soluzione' },
    { label: 'Sedi', href: '/sedi' },
    { label: 'Contatti', href: '/contatti' },
  ];

  // solid = true → barra ivory + logo nero; false → trasparente + logo bianco
  const solid = scrolled || isLightTop;
  const logoFilter = (solid && !menuOpen) ? 'brightness-0' : 'brightness-0 invert';

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ease-[cubic-bezier(0.25,0.1,0,1)] ${
          hidden && !menuOpen ? '-translate-y-full' : 'translate-y-0'
        } ${
          solid
            ? 'bg-ivory border-b border-anthracite/10'
            : 'bg-transparent border-b border-transparent'
        }`}
      >
        <div className="max-w-[1400px] mx-auto px-6 md:px-10 lg:px-16">
          <div className="flex items-center justify-between h-[72px] md:h-[80px] lg:h-[88px]">

            {/* Logo — centrato su mobile, a sinistra su desktop */}
            <Link
              to="/"
              className="relative z-50 transition-opacity duration-300 hover:opacity-70 lg:static absolute left-1/2 -translate-x-1/2 lg:translate-x-0"
            >
              <img
                src="/images/luxosa-logo-orizzontale-bianco-tras.png"
                alt="Luxosa"
                className={`h-7 md:h-8 w-auto object-contain transition-all duration-500 ${logoFilter}`}
              />
            </Link>

            {/* Nav desktop */}
            <nav className="hidden lg:flex items-center gap-8 xl:gap-10">
              {navItems.map((item) => {
                const isActive = item.href === '/'
                  ? location.pathname === '/'
                  : location.pathname.startsWith(item.href);
                return (
                  <Link key={item.label} to={item.href} className="relative group">
                    <span
                      className={`text-[12px] tracking-[0.14em] uppercase transition-all duration-500 ${
                        isActive
                          ? solid ? 'font-normal text-anthracite' : 'font-normal text-white'
                          : solid
                            ? 'font-light text-anthracite/55 group-hover:text-anthracite/90'
                            : 'font-light text-white/55 group-hover:text-white/90'
                      }`}
                    >
                      {item.label}
                    </span>
                    <span
                      className={`absolute -bottom-1.5 left-0 h-[1px] transition-all duration-500 ease-out ${
                        solid ? 'bg-brass' : 'bg-brass-light'
                      } ${
                        isActive ? 'w-full opacity-100' : 'w-0 opacity-0 group-hover:w-full group-hover:opacity-40'
                      }`}
                    />
                  </Link>
                );
              })}
            </nav>

            {/* CTA desktop */}
            <div className="hidden lg:flex items-center">
              <Link
                to="/contatti"
                className={`text-[11.5px] tracking-[0.14em] uppercase font-light px-6 py-2.5 border transition-all duration-500 ${
                  solid
                    ? 'border-anthracite/25 text-anthracite hover:bg-anthracite hover:text-ivory'
                    : 'border-white/35 text-white/90 hover:border-white/60 hover:text-white'
                }`}
              >
                Prenota
              </Link>
            </div>

            {/* Hamburger mobile */}
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label={menuOpen ? 'Chiudi menu' : 'Apri menu'}
              aria-expanded={menuOpen}
              className={`lg:hidden relative z-50 p-2 transition-colors duration-500 ${
                menuOpen ? 'text-ivory' : solid ? 'text-anthracite' : 'text-white'
              }`}
            >
              {menuOpen ? <X size={22} strokeWidth={1} /> : <Menu size={22} strokeWidth={1} />}
            </button>

          </div>
        </div>
      </header>

      {/* Menu mobile fullscreen */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.45, ease: [0.25, 0.1, 0, 1] }}
            className="fixed inset-0 z-40 bg-deep/96 backdrop-blur-2xl flex flex-col items-center justify-center"
          >
            <nav className="flex flex-col items-center gap-6">
              {navItems.map((item, i) => (
                <motion.div
                  key={item.label}
                  initial={{ opacity: 0, y: 18 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.08 + i * 0.05, duration: 0.5, ease: [0.25, 0.1, 0, 1] }}
                >
                  <Link
                    to={item.href}
                    onClick={() => setMenuOpen(false)}
                    className={`font-serif text-4xl md:text-5xl tracking-[0.08em] font-light transition-colors duration-400 ${
                      location.pathname === item.href ? 'text-brass-light' : 'text-ivory/75 hover:text-brass-light'
                    }`}
                  >
                    {item.label}
                  </Link>
                </motion.div>
              ))}

              <motion.div
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.48, duration: 0.5, ease: [0.25, 0.1, 0, 1] }}
                className="mt-10 flex flex-col items-center gap-4"
              >
                <Link
                  to="/contatti"
                  onClick={() => setMenuOpen(false)}
                  className="text-[12px] tracking-[0.18em] uppercase text-ivory border border-ivory/25 px-8 py-3 hover:bg-ivory/10 transition-all duration-400"
                >
                  Prenota una consulenza
                </Link>
                <a
                  href="tel:+390902403220"
                  className="flex items-center gap-2 text-stone/70 text-[13px] tracking-wider mt-2 hover:text-stone transition-colors"
                >
                  <Phone size={13} strokeWidth={1.5} />
                  +39 090 240 3220
                </a>
              </motion.div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
