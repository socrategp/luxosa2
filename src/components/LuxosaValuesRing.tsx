import { motion, useInView, AnimatePresence } from 'framer-motion';
import { useRef, useState, useEffect } from 'react';

import { premiumEase } from '../lib/animations';

const valori = [
  {
    title: 'Unicità',
    text: 'Non esiste uno standard di bellezza, ma la naturale espressione di ogni singola persona. Valorizziamo ciò che ti rende unica.',
  },
  {
    title: 'Cura',
    text: 'Attenzione ai dettagli, delicatezza nel tocco e rispetto assoluto per il benessere di cute e capelli in ogni istante del percorso.',
  },
  {
    title: 'Competenza',
    text: 'Una conoscenza profonda, aggiornata e rigorosa. Perché la fiducia nasce da risultati concreti e solide basi professionali.',
  },
  {
    title: 'Esclusività',
    text: 'Esperienze pensate su misura, protocolli dedicati e un ambiente intimo dove il tempo si ferma solo per te.',
  },
  {
    title: 'Trasformazione',
    text: 'Non cambiamo chi sei, ne sveliamo la versione migliore. Un percorso graduale, rispettoso e profondamente empatico.',
  },
  {
    title: 'Audacia',
    text: 'Il coraggio di consigliare ciò che è giusto, di uscire dalle convenzioni per raggiungere l\'eccellenza senza compromessi.',
  },
  {
    title: 'Disciplina',
    text: 'Metodo, precisione e dedizione costante. La perfezione si ottiene solo attraverso un approccio rigoroso e misurato.',
  },
];

// SVG ViewBox: 750 x 750 — center at 375,375
const CX = 375;
const CY = 375;
const RING_R = 250;   // main ring radius
const LABEL_R = 325;  // radius at which labels are placed (outside the ring)

export default function LuxosaValuesRing() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });
  const [activeIndex, setActiveIndex] = useState(0);
  const [userInteracted, setUserInteracted] = useState(false);

  // Auto-rotate — starts after entry anims (~3s), then every 4s
  useEffect(() => {
    if (!inView || userInteracted) return;

    let iv: ReturnType<typeof setInterval> | null = null;
    const boot = setTimeout(() => {
      iv = setInterval(() => {
        setActiveIndex((p) => (p + 1) % valori.length);
      }, 4000);
    }, 3200);

    return () => {
      clearTimeout(boot);
      if (iv) clearInterval(iv);
    };
  }, [inView, userInteracted]);

  // Resume after 8s inactivity
  useEffect(() => {
    if (!userInteracted) return;
    const t = setTimeout(() => setUserInteracted(false), 8000);
    return () => clearTimeout(t);
  }, [userInteracted, activeIndex]);

  const handleSelect = (i: number) => {
    setActiveIndex(i);
    setUserInteracted(true);
  };

  return (
    <section className="py-32 md:py-48 lg:py-56 bg-ivory overflow-hidden">
      <div className="max-w-[1400px] mx-auto px-6 md:px-10 lg:px-16" ref={ref}>

        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-24 md:mb-32">
          <motion.span
            initial={{ opacity: 0, y: 15 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 1, ease: premiumEase }}
            className="text-[11px] tracking-[0.35em] uppercase text-brass-muted font-light"
          >
            I Nostri Valori
          </motion.span>
          <motion.div
            initial={{ width: 0 }}
            animate={inView ? { width: 40 } : {}}
            transition={{ duration: 1.2, ease: premiumEase, delay: 0.15 }}
            className="h-[1px] bg-brass mx-auto mt-4 mb-8"
          />
          <motion.h2
            initial={{ opacity: 0, y: 25 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 1.2, ease: premiumEase, delay: 0.2 }}
            className="font-serif text-[30px] md:text-[38px] lg:text-[44px] font-light leading-[1.08] text-charcoal"
          >
            I valori che guidano<br />ogni nostro passo.
          </motion.h2>
        </div>

        {/* Ring + Content panel */}
        <div className="flex flex-col lg:flex-row items-center justify-center gap-12 lg:gap-20 xl:gap-28">

          {/* ─── SVG Ring ─────────────────────────────────────── */}
          <div className="shrink-0 w-full max-w-[680px]">
            <svg
              viewBox="0 0 750 750"
              className="w-full h-auto"
              style={{ overflow: 'visible' }}
              role="group"
              aria-label="I valori Luxosa"
            >
              {/* Outer atmospheric ring */}
              <motion.circle
                cx={CX} cy={CY} r={RING_R + 18}
                fill="none"
                stroke="#B09872"
                strokeOpacity={0.07}
                strokeWidth={1}
                initial={{ pathLength: 0 }}
                animate={inView ? { pathLength: 1 } : {}}
                transition={{ duration: 3.5, ease: 'easeInOut', delay: 0.4 }}
              />

              {/* Main ring */}
              <motion.circle
                cx={CX} cy={CY} r={RING_R}
                fill="none"
                stroke="#B09872"
                strokeOpacity={0.25}
                strokeWidth={0.75}
                initial={{ pathLength: 0 }}
                animate={inView ? { pathLength: 1 } : {}}
                transition={{ duration: 3, ease: 'easeInOut', delay: 0.7 }}
              />

              {/* Inner ring */}
              <motion.circle
                cx={CX} cy={CY} r={88}
                fill="none"
                stroke="#B09872"
                strokeOpacity={0.12}
                strokeWidth={0.5}
                initial={{ pathLength: 0 }}
                animate={inView ? { pathLength: 1 } : {}}
                transition={{ duration: 2.5, ease: 'easeInOut', delay: 1 }}
              />

              {/* Active indicator tick on the ring */}
              {inView && (() => {
                const ang = ((activeIndex * (360 / 7)) - 90) * Math.PI / 180;
                return (
                  <motion.line
                    key={activeIndex}
                    x1={CX + (RING_R - 9) * Math.cos(ang)}
                    y1={CY + (RING_R - 9) * Math.sin(ang)}
                    x2={CX + (RING_R + 9) * Math.cos(ang)}
                    y2={CY + (RING_R + 9) * Math.sin(ang)}
                    stroke="#B09872"
                    strokeOpacity={0.85}
                    strokeWidth={1.5}
                    strokeLinecap="round"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.7 }}
                  />
                );
              })()}

              {/* Values labels */}
              {valori.map((v, i) => {
                const ang = (i * (360 / 7) - 90) * Math.PI / 180;
                const lx = CX + LABEL_R * Math.cos(ang);
                const ly = CY + LABEL_R * Math.sin(ang);
                const isActive = i === activeIndex;

                return (
                  <motion.g
                    key={v.title}
                    initial={{ opacity: 0 }}
                    animate={inView ? { opacity: 1 } : {}}
                    transition={{ duration: 0.9, ease: premiumEase, delay: 1.3 + i * 0.1 }}
                    style={{ cursor: 'pointer' }}
                    onClick={() => handleSelect(i)}
                  >
                    {/* Invisible hit area */}
                    <circle cx={lx} cy={ly} r={30} fill="transparent" />

                    <motion.text
                      x={lx}
                      y={ly}
                      textAnchor="middle"
                      dominantBaseline="middle"
                      fontFamily="Jost, sans-serif"
                      fontWeight={isActive ? '400' : '300'}
                      letterSpacing="0.16em"
                      fontSize="19"
                      animate={{
                        fillOpacity: isActive ? 1 : 0.55,
                      }}
                      fill={isActive ? '#B09872' : '#282520'}
                      transition={{ duration: 0.9, ease: premiumEase }}
                    >
                      {isActive ? v.title.toUpperCase() : v.title}
                    </motion.text>

                    {/* Active dot */}
                    <motion.circle
                      cx={lx}
                      cy={ly + 13}
                      r={1.8}
                      fill="#B09872"
                      animate={{ opacity: isActive ? 0.6 : 0 }}
                      transition={{ duration: 0.7 }}
                    />
                  </motion.g>
                );
              })}

              {/* Center: Luxosa monogram */}
              <motion.g
                initial={{ opacity: 0 }}
                animate={inView ? { opacity: 1 } : {}}
                transition={{ duration: 1.6, ease: premiumEase, delay: 1.2 }}
                style={{ pointerEvents: 'none' }}
              >
                <image
                  href="/images/luxosa-monogram.png"
                  x={CX - 55}
                  y={CY - 55}
                  width={110}
                  height={110}
                  preserveAspectRatio="xMidYMid meet"
                />
              </motion.g>
            </svg>
          </div>

          {/* ─── Content Panel ────────────────────────────────── */}
          <div className="max-w-[340px] w-full text-center lg:text-left">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeIndex}
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.8, ease: premiumEase }}
              >
                <div className="w-8 h-[1px] bg-brass mb-7 mx-auto lg:mx-0" />
                <p className="text-[10px] tracking-[0.35em] uppercase text-brass-muted font-light mb-4">
                  Valore {activeIndex + 1} di {valori.length}
                </p>
                <h4 className="font-serif text-[30px] md:text-[36px] font-light text-charcoal mb-5 leading-tight tracking-wide">
                  {valori[activeIndex].title}
                </h4>
                <p className="text-[17px] md:text-[18px] leading-[1.9] text-anthracite/65 font-light">
                  {valori[activeIndex].text}
                </p>
              </motion.div>
            </AnimatePresence>
          </div>

        </div>
      </div>
    </section>
  );
}
