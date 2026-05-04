import { motion, useInView } from 'framer-motion';
import { useRef, useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { premiumEase } from '../lib/animations';

const esperienze = [
  { code: 'EX·01', name: 'PiegaLux', copy: 'Non una semplice piega. Un gesto che nutre, valorizza e restituisce luce al capello nel suo miglior momento.' },
  { code: 'EX·02', name: 'Taglio Signature', copy: "Un taglio che nasce dall'osservazione e dalla visione. Non routine, ma progetto." },
  { code: 'EX·03', name: 'Nuances', copy: 'Il colore nella sua espressione più raffinata: luce, profondità e naturalezza.' },
  { code: 'EX·04', name: 'Luce Signature', copy: 'Schiariture costruite con precisione — Airtouch, Babylight, Degradé e altri — per un risultato sofisticato e mai forzato.' },
  { code: 'EX·05', name: 'RicciOsa', copy: 'Il gesto dedicato al capello riccio quando definizione, elasticità e rispetto diventano una priorità. Un trattamento specifico con prodotti mirati per garantire il riccio desiderato.' },
  { code: 'EX·06', name: 'RicciOso', copy: 'Il taglio sartoriale per capelli ricci, eseguito a capello asciutto per garantire la tenuta del riccio e il rispetto della forma. Un progetto che legge e valorizza ogni movimento naturale.' },
  { code: 'EX·07', name: 'Cheratina Nutrizione Pro', copy: 'Un trattamento che restituisce ordine, morbidezza e vitalità al capello — senza sacrificare il movimento naturale.' },
  { code: 'EX·08', name: 'Area Benessere', copy: 'Trattamenti mirati dedicati a cute, fibra e riequilibrio del capello. Un inizio mirato e professionale che pone le basi per la salute autentica dei capelli.' },
  { code: 'EX·09', name: 'Consulenze Specialistiche', copy: "Prima di ogni scelta, c'è una lettura. Consulenze dedicate all'estetica del colore e dell'immagine, al benessere di cute e capello, o a entrambe le dimensioni insieme — per costruire una direzione reale prima di procedere." },
];

const IMAGE = '/images/esperienze-puzzle.png';
const COLS = 3;
const ROWS = 3;

function getPos(col: number, row: number) {
  const x = col === 0 ? 0 : col === COLS - 1 ? 100 : 50;
  const y = row === 0 ? 0 : row === ROWS - 1 ? 100 : 50;
  return `${x}% ${y}%`;
}

export default function Experience() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  useEffect(() => {
    if (activeIndex === null) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setActiveIndex(null); };
    document.body.style.overflow = 'hidden';
    document.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = '';
      document.removeEventListener('keydown', onKey);
    };
  }, [activeIndex]);

  const close = () => setActiveIndex(null);

  return (
    <section ref={ref} className="py-32 md:py-48 lg:py-56 bg-deep">
      <div className="max-w-[1400px] mx-auto px-6 md:px-10 lg:px-16">
        <div className="max-w-2xl mb-16 md:mb-20">
          <motion.span
            initial={{ opacity: 0, y: 15 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 1, ease: premiumEase }}
            className="text-[11px] tracking-[0.35em] uppercase text-brass-light/50 font-light"
          >
            Le esperienze
          </motion.span>
          <motion.div
            initial={{ width: 0 }}
            animate={inView ? { width: 40 } : {}}
            transition={{ duration: 1.2, ease: premiumEase, delay: 0.15 }}
            className="h-[1px] bg-brass-light/40 mt-4 mb-8"
          />
          <motion.p
            initial={{ opacity: 0, y: 25 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 1.2, ease: premiumEase, delay: 0.2 }}
            className="text-[18px] md:text-[20px] leading-[1.85] text-ivory/55 font-light"
          >
            Non le scegli come si sfoglia un menu. Le scopri insieme a noi, nel contesto del percorso che stai costruendo.
          </motion.p>
        </div>

        <div className="grid grid-cols-3 gap-px bg-deep/80">
          {esperienze.map((e, i) => {
            const col = i % COLS;
            const row = Math.floor(i / COLS);
            return (
              <motion.div
                key={e.name}
                initial={{ opacity: 0 }}
                animate={inView ? { opacity: 1 } : {}}
                transition={{ duration: 1.2, ease: premiumEase, delay: 0.1 + i * 0.07 }}
                className="group relative aspect-[4/5] overflow-hidden cursor-pointer"
                onClick={() => setActiveIndex(i)}
                style={{
                  backgroundImage: `url(${IMAGE})`,
                  backgroundSize: `${COLS * 100}% ${ROWS * 100}%`,
                  backgroundPosition: getPos(col, row),
                  backgroundRepeat: 'no-repeat',
                }}
              >
                <div className="absolute inset-0 bg-deep/80 group-hover:bg-deep/20 transition-colors duration-700 ease-[cubic-bezier(0.25,0.1,0,1)]" />

                <span className="absolute top-6 md:top-8 left-6 md:left-8 text-[10px] tracking-[0.25em] uppercase text-brass-light/50 font-light z-10">
                  {e.code}
                </span>

                <div className="absolute left-6 md:left-8 right-6 md:right-8 z-10" style={{ top: '52%' }}>
                  <h3 className="font-serif text-[18px] md:text-[21px] font-light text-ivory leading-snug tracking-wide drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)]">
                    {e.name}
                  </h3>
                  <div className="h-[1px] w-0 bg-brass-light group-hover:w-6 transition-all duration-500 ease-[cubic-bezier(0.25,0.1,0,1)] mt-3" />
                </div>

                <p className="hidden lg:block absolute bottom-8 left-8 right-8 text-[15px] leading-[1.75] text-ivory/80 font-light opacity-0 translate-y-3 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-500 ease-[cubic-bezier(0.25,0.1,0,1)] z-10">
                  {e.copy}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>

      {activeIndex !== null && createPortal(
        <div
          onClick={close}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: 9999,
            backgroundColor: 'rgba(28,26,23,0.82)',
            display: 'flex',
            alignItems: 'flex-end',
            WebkitTapHighlightColor: 'transparent',
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              backgroundColor: '#282520',
              width: '100%',
              maxHeight: '80vh',
              overflowY: 'auto',
              padding: '2.5rem 2rem 3rem',
              boxSizing: 'border-box',
            }}
          >
            <p style={{
              fontSize: '10px',
              letterSpacing: '0.25em',
              textTransform: 'uppercase',
              color: 'rgba(196,174,140,0.55)',
              fontWeight: 300,
              marginBottom: '1rem',
              fontFamily: 'Jost, sans-serif',
            }}>
              {esperienze[activeIndex].code}
            </p>
            <h3 style={{
              fontFamily: 'Cormorant Garamond, serif',
              fontSize: '22px',
              fontWeight: 300,
              color: '#F9F6F1',
              lineHeight: 1.25,
              marginBottom: '1.25rem',
            }}>
              {esperienze[activeIndex].name}
            </h3>
            <div style={{
              height: '1px',
              width: '2rem',
              backgroundColor: 'rgba(196,174,140,0.4)',
              marginBottom: '1.5rem',
            }} />
            <p style={{
              fontSize: '15px',
              lineHeight: 1.8,
              color: 'rgba(249,246,241,0.72)',
              fontWeight: 300,
              marginBottom: '2.5rem',
              fontFamily: 'Jost, sans-serif',
            }}>
              {esperienze[activeIndex].copy}
            </p>
            <button
              onClick={close}
              style={{
                fontSize: '11px',
                letterSpacing: '0.22em',
                textTransform: 'uppercase',
                color: 'rgba(196,174,140,0.7)',
                fontWeight: 300,
                border: '1px solid rgba(196,174,140,0.35)',
                padding: '0.75rem 1.5rem',
                backgroundColor: 'transparent',
                cursor: 'pointer',
                fontFamily: 'Jost, sans-serif',
                WebkitAppearance: 'none',
              }}
            >
              Chiudi
            </button>
          </div>
        </div>,
        document.body
      )}
    </section>
  );
}
