import { motion, useInView, AnimatePresence } from 'framer-motion';
import { useRef, useState, useEffect } from 'react';

const premiumEase: [number, number, number, number] = [0.25, 0.1, 0, 1];

const fasi = [
  {
    num: '01',
    name: 'Ascolto',
    accade: 'Raccogliamo storia, abitudini, desideri, aspettative e tutto ciò che conta davvero.',
    sente: 'Finalmente qualcuno che vuole capire davvero.',
  },
  {
    num: '02',
    name: 'Osservazione',
    accade: 'Leggiamo in modo approfondito cute, capello, struttura e segnali utili a orientare il percorso.',
    sente: 'Vedono ciò che io non sapevo di avere.',
  },
  {
    num: '03',
    name: 'Progetto',
    accade: 'Definiamo insieme un obiettivo, una direzione e i passi necessari per arrivarci.',
    sente: 'Ho un piano. Non sto improvvisando più.',
  },
  {
    num: '04',
    name: 'Costruzione',
    accade: 'Ogni seduta diventa parte di un disegno coerente, pensato per generare un risultato concreto.',
    sente: 'Ogni volta che torno, c\'è continuità.',
  },
  {
    num: '05',
    name: 'Trasformazione',
    accade: 'Il risultato emerge nel tempo, si consolida e apre una nuova fase di ascolto e crescita.',
    sente: 'Non sono la stessa di quando sono entrata.',
  },
];

// Circle positions: 5 nodi a 72° partendo da -90° (top)
const getPhasePosition = (index: number) => {
  const angle = -90 + index * 72;
  const rad = (angle * Math.PI) / 180;
  const radius = 130;
  const cx = 250;
  const cy = 250;
  return {
    x: cx + radius * Math.cos(rad),
    y: cy + radius * Math.sin(rad),
  };
};

// SVG arc path from phase i to phase i+1
const getArcPath = (index: number) => {
  const pos1 = getPhasePosition(index);
  const pos2 = getPhasePosition((index + 1) % 5);
  return `M ${pos1.x} ${pos1.y} A 130,130 0 0,1 ${pos2.x} ${pos2.y}`;
};

// Label position (further out for readability)
const getLabelPosition = (index: number) => {
  const angle = -90 + index * 72;
  const rad = (angle * Math.PI) / 180;
  const radius = 175;
  const cx = 250;
  const cy = 250;
  return {
    x: cx + radius * Math.cos(rad),
    y: cy + radius * Math.sin(rad),
    angle,
  };
};

function usePhasesCycle(active: boolean) {
  const [phase, setPhase] = useState(0);
  const [drawnArcs, setDrawnArcs] = useState<Set<number>>(new Set());
  const [drawingArc, setDrawingArc] = useState<number | null>(null);
  const [cycleCount, setCycleCount] = useState(0);

  useEffect(() => {
    if (!active) return;

    const timings = {
      PHASE_HOLD: 2800,
      ARC_DRAW: 2000,
      RESTART_DELAY: 1200,
    };

    let timeoutId: ReturnType<typeof setTimeout>;

    const nextPhase = (phase + 1) % 5;

    // Start drawing the arc from current phase to next
    timeoutId = setTimeout(() => {
      setDrawingArc(phase);
    }, timings.PHASE_HOLD);

    // After arc is drawn, mark it as complete
    const arcCompleteTimeout = setTimeout(() => {
      setDrawnArcs((prev) => new Set(prev).add(phase));
      setDrawingArc(null);

      if (nextPhase === 0) {
        // End of cycle — restart after delay
        const restartTimeout = setTimeout(() => {
          setPhase(0);
          setDrawnArcs(new Set());
          setCycleCount((c) => c + 1);
        }, timings.RESTART_DELAY);
        return () => clearTimeout(restartTimeout);
      } else {
        // Move to next phase
        setPhase(nextPhase);
      }
    }, timings.PHASE_HOLD + timings.ARC_DRAW);

    return () => {
      clearTimeout(timeoutId);
      clearTimeout(arcCompleteTimeout);
    };
  }, [phase, active]);

  return { phase, drawnArcs, drawingArc, cycleCount };
}

function CircleViz({
  activePhase,
  drawnArcs,
  drawingArc,
  cycleCount,
}: {
  activePhase: number;
  drawnArcs: Set<number>;
  drawingArc: number | null;
  cycleCount: number;
}) {
  const cycleColor = cycleCount % 2 === 0 ? '#C4AE8C' : '#F9F6F1'; // brass-light or ivory

  return (
    <svg
      viewBox="0 0 500 500"
      className="w-full max-w-[680px] mx-auto"
      style={{ overflow: 'visible' }}
    >
      {/* Guide circle */}
      <circle cx={250} cy={250} r={130} stroke="rgba(249,246,241,0.08)" strokeWidth="0.6" fill="none" />

      {/* Arcs */}
      {fasi.map((_, i) => {
        const isDrawn = drawnArcs.has(i);
        const isDrawing = drawingArc === i;

        return (
          <motion.path
            key={`arc-${i}-${cycleCount}`}
            d={getArcPath(i)}
            stroke={cycleColor}
            strokeWidth="1.2"
            fill="none"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={
              isDrawn ? { pathLength: 1, opacity: 1 } : isDrawing ? { pathLength: 1, opacity: 1 } : { pathLength: 0, opacity: 0 }
            }
            transition={{
              pathLength: {
                duration: isDrawing ? 2 : 0,
                ease: premiumEase,
              },
              opacity: { duration: 0.3 },
            }}
          />
        );
      })}

      {/* Phase dots and rings */}
      {fasi.map((_, i) => {
        const pos = getPhasePosition(i);
        const isActive = i === activePhase;

        return (
          <g key={`phase-${i}`}>
            {/* Ring (outer glow when active) */}
            <motion.circle
              cx={pos.x}
              cy={pos.y}
              animate={{
                r: isActive ? 12 : 0,
                opacity: isActive ? 0.4 : 0,
              }}
              stroke={cycleColor}
              strokeWidth="0.6"
              fill="none"
              transition={{ duration: 0.8, ease: premiumEase }}
            />

            {/* Dot */}
            <motion.circle
              cx={pos.x}
              cy={pos.y}
              animate={{
                r: isActive ? 6.5 : 3.5,
                fillOpacity: isActive ? 1 : 0.25,
              }}
              fill={cycleColor}
              transition={{ duration: 0.8, ease: premiumEase }}
            />
          </g>
        );
      })}

      {/* Phase labels (SVG text) */}
      {fasi.map((fase, i) => {
        const label = getLabelPosition(i);
        const isActive = i === activePhase;
        const textAnchor = label.angle > -60 && label.angle < 60 ? 'start' : label.angle > 120 || label.angle < -120 ? 'end' : 'middle';

        return (
          <motion.text
            key={`label-${i}`}
            x={label.x}
            y={label.y}
            textAnchor={textAnchor}
            fontFamily="Jost, sans-serif"
            fontSize="12"
            letterSpacing="0.16em"
            fontWeight="300"
            fill={cycleColor}
            animate={{
              fillOpacity: isActive ? 1 : 0.3,
            }}
            transition={{ duration: 0.6 }}
            dominantBaseline="middle"
          >
            {isActive ? fase.name.toUpperCase() : fase.name}
          </motion.text>
        );
      })}
    </svg>
  );
}

export default function Method() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });
  const { phase, drawnArcs, drawingArc, cycleCount } = usePhasesCycle(inView);

  return (
    <section id="metodo" className="py-32 md:py-48 lg:py-56 bg-charcoal">
      <div className="max-w-[1400px] mx-auto px-6 md:px-10 lg:px-16" ref={ref}>
        {/* Header */}
        <div className="mb-10 md:mb-14">
          <motion.span
            initial={{ opacity: 0, y: 15 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 1, ease: premiumEase }}
            className="text-[11px] tracking-[0.35em] uppercase text-brass-light/60 font-light"
          >
            Le fasi
          </motion.span>
          <motion.div
            initial={{ width: 0 }}
            animate={inView ? { width: 40 } : {}}
            transition={{ duration: 1.2, ease: premiumEase, delay: 0.15 }}
            className="h-[1px] bg-brass-light/40 mt-4 mb-6"
          />
        </div>

        {/* Main content: Circle + Phase Info */}
        <div className="grid lg:grid-cols-[1.3fr_1fr] gap-12 lg:gap-20 items-start">
          {/* Left: Circle visualization */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 1.2, ease: premiumEase, delay: 0.2 }}
          >
            <CircleViz activePhase={phase} drawnArcs={drawnArcs} drawingArc={drawingArc} cycleCount={cycleCount} />
          </motion.div>

          {/* Right: Phase info panel */}
          <div className="lg:pt-20">
            <AnimatePresence mode="wait">
              <motion.div
                key={`phase-${phase}-${cycleCount}`}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.6, ease: premiumEase }}
                className="space-y-5"
              >
                {/* Phase number label */}
                <div className="text-[10px] tracking-[0.35em] uppercase text-brass-light/50 font-light">
                  {fasi[phase].num} / 05
                </div>

                {/* Phase name */}
                <h3 className="font-serif text-[28px] md:text-[32px] lg:text-[38px] text-ivory font-light tracking-[0.02em] leading-none">
                  {fasi[phase].name.toUpperCase()}
                </h3>

                {/* Decorative line */}
                <div className="h-[1px] bg-brass-light/40 w-8" />

                {/* Phase description */}
                <div className="space-y-5">
                  <p className="text-[13px] md:text-[14px] lg:text-[14px] leading-[1.8] text-ivory/65 font-light">
                    {fasi[phase].accade}
                  </p>

                  <p className="text-[13px] md:text-[14px] lg:text-[14px] leading-[1.8] text-brass-light/70 font-light italic">
                    "{fasi[phase].sente}"
                  </p>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        {/* Quote footer */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 1.2, ease: premiumEase, delay: 0.9 }}
          className="mt-20 md:mt-28 border-t border-brass-light/20 pt-10"
        >
          <p className="font-serif text-[18px] md:text-[22px] italic text-ivory/50 font-light leading-[1.6] max-w-2xl">
            "Trasformazione non è un punto finale. È una soglia. Per questo Luxosa costruisce relazioni nel tempo, non appuntamenti isolati."
          </p>
        </motion.div>
      </div>
    </section>
  );
}
