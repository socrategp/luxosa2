import { motion, useInView, AnimatePresence } from 'framer-motion';
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

  // true = mobile/tablet (<1024px), modal attivo; false = desktop, solo hover
  const [isTouchLayout, setIsTouchLayout] = useState<boolean>(() =>
    typeof window !== 'undefined' ? window.matchMedia('(max-width: 1023px)').matches : false
  );
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  // Aggiorna isTouchLayout al resize e chiude il modal se si passa a desktop
  useEffect(() => {
    const mq = window.matchMedia('(max-width: 1023px)');
    const handler = (e: MediaQueryListEvent) => {
      setIsTouchLayout(e.matches);
      if (!e.matches) setActiveIndex(null);
    };
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  // ESC + body scroll lock — solo quando modal mobile/tablet è aperto
  useEffect(() => {
    if (!isTouchLayout || activeIndex === null) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setActiveIndex(null); };
    document.body.style.overflow = 'hidden';
    document.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = '';
      document.removeEventListener('keydown', onKey);
    };
  }, [activeIndex, isTouchLayout]);

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
                className={`group relative aspect-[4/5] overflow-hidden ${isTouchLayout ? 'cursor-pointer' : 'cursor-default'}`}
                role={isTouchLayout ? 'button' : undefined}
                tabIndex={isTouchLayout ? 0 : undefined}
                aria-label={isTouchLayout ? `${e.name} — leggi la descrizione` : undefined}
                aria-expanded={isTouchLayout ? activeIndex === i : undefined}
                onClick={() => { if (isTouchLayout) setActiveIndex(i); }}
                onKeyDown={(ev) => { if (isTouchLayout && (ev.key === 'Enter' || ev.key === ' ')) setActiveIndex(i); }}
                style={{
                  backgroundImage: `url(${IMAGE})`,
                  backgroundSize: `${COLS * 100}% ${ROWS * 100}%`,
                  backgroundPosition: getPos(col, row),
                  backgroundRepeat: 'no-repeat',
                }}
              >
                {/* Overlay */}
                <div className="absolute inset-0 bg-deep/80 group-hover:bg-deep/20 transition-colors duration-700 ease-[cubic-bezier(0.25,0.1,0,1)]" />

                {/* Code — top left, fixed */}
                <span className="absolute top-6 md:top-8 left-6 md:left-8 text-[10px] tracking-[0.25em] uppercase text-brass-light/50 font-light z-10">
                  {e.code}
                </span>

                {/* Title block — fixed vertical anchor so all titles align */}
                <div className="absolute left-6 md:left-8 right-6 md:right-8 z-10" style={{ top: '52%' }}>
                  <h3 className="font-serif text-[18px] md:text-[21px] font-light text-ivory leading-snug tracking-wide drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)]">
                    {e.name}
                  </h3>
                  <div className="h-[1px] w-0 bg-brass-light group-hover:w-6 transition-all duration-500 ease-[cubic-bezier(0.25,0.1,0,1)] mt-3" />
                </div>

                {/* Description — desktop hover only; hidden on mobile+tablet (modal handles it) */}
                <p className="hidden lg:block absolute bottom-8 left-8 right-8 text-[15px] leading-[1.75] text-ivory/80 font-light opacity-0 translate-y-3 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-500 ease-[cubic-bezier(0.25,0.1,0,1)] z-10">
                  {e.copy}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Modal mobile/tablet — portato su document.body per evitare stacking context della section */}
      {isTouchLayout && createPortal(
        <AnimatePresence>
          {activeIndex !== null && (
            <>
              {/* Backdrop */}
              <motion.div
                key="exp-backdrop"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                style={{ position: 'fixed', inset: 0, zIndex: 9999, background: 'rgba(28,26,23,0.75)' }}
                onClick={close}
                aria-hidden="true"
              />
              {/* Panel — bottom sheet, sempre visibile su mobile e tablet */}
              <motion.div
                key="exp-panel"
                initial={{ opacity: 0, y: 48 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 48 }}
                transition={{ duration: 0.4, ease: premiumEase }}
                style={{ position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 10000 }}
                className="bg-charcoal px-8 pt-10 pb-12"
                onClick={(ev) => ev.stopPropagation()}
                role="dialog"
                aria-modal="true"
                aria-labelledby="exp-modal-title"
              >
                <span className="text-[10px] tracking-[0.25em] uppercase text-brass-light/50 font-light block mb-4">
                  {esperienze[activeIndex].code}
                </span>
                <h3
                  id="exp-modal-title"
                  className="font-serif text-[22px] font-light text-ivory leading-snug mb-5"
                >
                  {esperienze[activeIndex].name}
                </h3>
                <div className="h-[1px] w-8 bg-brass-light/40 mb-6" />
                <p className="text-[15px] leading-[1.8] text-ivory/70 font-light mb-10">
                  {esperienze[activeIndex].copy}
                </p>
                <button
                  onClick={close}
                  className="text-[11px] tracking-[0.25em] uppercase text-brass-light/70 font-light border border-brass-light/30 px-6 py-3 hover:border-brass-light/60 transition-colors duration-300"
                >
                  Chiudi
                </button>
              </motion.div>
            </>
          )}
        </AnimatePresence>,
        document.body
      )}
    </section>
  );
}
