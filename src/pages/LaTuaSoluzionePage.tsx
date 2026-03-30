import { motion, useInView, AnimatePresence } from 'framer-motion';
import { useRef, useState, useCallback, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ArrowLeft, Sparkles, RotateCcw, X } from 'lucide-react';
import PageHero from '../components/PageHero';

/* ═══════════════════════════════════════════════════════════════
   DATA
   ═══════════════════════════════════════════════════════════════ */

interface Question {
  id: string;
  label: string;
  question: string;
  subtitle: string;
  options: { id: string; text: string; subtext: string }[];
}

const questions: Question[] = [
  {
    id: 'focus',
    label: 'Area di interesse',
    question: 'Qual è la sua priorità principale?',
    subtitle: 'Ci aiuti a capire da dove partire.',
    options: [
      { id: 'cute', text: 'La salute della mia cute', subtext: 'Sensibilità, secchezza, irritazione, eccesso di sebo, forfora' },
      { id: 'capello', text: 'La bellezza del mio capello', subtext: 'Forza, luminosità, elasticità, volume, morbidezza' },
      { id: 'colore', text: 'Il colore ideale', subtext: 'Trasformazione, armonia cromatica, copertura, riflessatura' },
      { id: 'globale', text: 'Un percorso completo', subtext: 'Cute, capello e colore in un approccio integrato' },
    ],
  },
  {
    id: 'stato',
    label: 'Stato attuale',
    question: 'Come descriverebbe lo stato attuale dei suoi capelli?',
    subtitle: 'Ogni percorso parte dalla comprensione.',
    options: [
      { id: 'fragili', text: 'Fragili e sottili', subtext: 'Si spezzano facilmente, mancano di corpo e resistenza' },
      { id: 'secchi', text: 'Secchi e opachi', subtext: 'Mancano di idratazione, appaiono spenti e ruvidi al tatto' },
      { id: 'grassi', text: 'Tendenza al grasso', subtext: 'Radici oleose, necessità di lavaggi frequenti' },
      { id: 'buono', text: 'In buono stato, ma voglio di più', subtext: 'Cerco un livello superiore di cura e risultato' },
    ],
  },
  {
    id: 'obiettivo',
    label: 'Obiettivo',
    question: 'Quale risultato desidera raggiungere?',
    subtitle: "Il percorso si costruisce sull'obiettivo.",
    options: [
      { id: 'risolvere', text: 'Risolvere un problema specifico', subtext: 'Un disagio concreto che richiede intervento mirato' },
      { id: 'migliorare', text: 'Migliorare la qualità generale', subtext: 'Elevare lo stato di salute e bellezza complessivo' },
      { id: 'trasformare', text: 'Una trasformazione visibile', subtext: 'Un cambiamento evidente, studiato e personalizzato' },
      { id: 'mantenere', text: 'Mantenere e proteggere', subtext: 'Preservare i risultati ottenuti nel tempo' },
    ],
  },
  {
    id: 'tempo',
    label: 'Impegno',
    question: 'Che tipo di impegno immagina?',
    subtitle: 'Ogni percorso ha il suo ritmo.',
    options: [
      { id: 'singolo', text: "Un'esperienza singola e intensa", subtext: 'Un rituale completo in un unico appuntamento' },
      { id: 'breve', text: 'Un percorso breve e mirato', subtext: '3-5 sedute per un obiettivo specifico' },
      { id: 'continuativo', text: 'Un accompagnamento continuativo', subtext: 'Un percorso evoluto che si sviluppa nel tempo' },
      { id: 'non_so', text: 'Non so ancora, vorrei capire', subtext: 'La consulenza mi aiuterà a definire il percorso' },
    ],
  },
];

interface Solution {
  title: string;
  subtitle: string;
  description: string;
  percorso: string;
  highlights: string[];
  image: string;
  cta: string;
}

function getSolution(answers: Record<string, string>): Solution {
  const { focus, obiettivo, tempo } = answers;

  if (focus === 'cute') {
    return {
      title: 'Percorso Equilibrio Cute',
      subtitle: 'Il fondamento di ogni bellezza',
      description: 'Un percorso dedicato al riequilibrio del cuoio capelluto, pensato per affrontare sensibilità, secchezza, eccesso di sebo e micro-infiammazioni. La cute sana è la base di ogni capello bello.',
      percorso: 'Cute & Benessere',
      highlights: ['Analisi approfondita del cuoio capelluto', 'Protocolli personalizzati di riequilibrio', 'Trattamenti lenitivi e rigeneranti', 'Follow-up e monitoraggio nel tempo'],
      image: '/images/ritual-new.jpg',
      cta: 'Prenota la consulenza Cute & Benessere',
    };
  }
  if (focus === 'colore') {
    return {
      title: 'Percorso Trasformazione Colore',
      subtitle: 'Il colore giusto non si sceglie. Si comprende.',
      description: 'Un approccio al colore fondato su analisi cromatica, rispetto della struttura e personalizzazione assoluta. Studio del sottotono, della texture e dello stile di vita per un risultato naturale e sofisticato.',
      percorso: 'Trasformazione Colore',
      highlights: ['Analisi cromatica personalizzata', 'Studio del sottotono e della texture', 'Rispetto della struttura naturale', 'Armonia tra colore, pelle e personalità'],
      image: '/images/transformation-new.jpg',
      cta: 'Prenota la consulenza Colore',
    };
  }
  if (focus === 'globale' || (obiettivo === 'trasformare' && tempo === 'continuativo')) {
    return {
      title: 'Percorso Integrato Luxosa',
      subtitle: 'La cura più completa',
      description: 'Un percorso che abbraccia cute, capello e colore in un approccio integrato e personalizzato. Per chi desidera il livello più alto di cura e trasformazione, con accompagnamento continuativo nel tempo.',
      percorso: 'Percorso Completo',
      highlights: ['Diagnosi completa cute e capello', 'Piano integrato multi-obiettivo', 'Trattamenti sinergici e progressivi', 'Accompagnamento continuativo personalizzato'],
      image: '/images/consultation-new.jpg',
      cta: 'Prenota la consulenza completa',
    };
  }
  if (tempo === 'singolo') {
    return {
      title: 'Esperienza Signature',
      subtitle: 'Un rituale di cura profonda',
      description: "Un'esperienza unica e rigenerante che unisce trattamento professionale, benessere sensoriale e cura profonda in un unico appuntamento. L'espressione più alta del metodo Luxosa.",
      percorso: 'Esperienze Signature',
      highlights: ['Rituale completo in un unico appuntamento', 'Trattamento personalizzato cute e capello', 'Esperienza sensoriale e rigenerante', 'Styling consapevole incluso'],
      image: '/images/care-hands-new.jpg',
      cta: "Prenota un'esperienza Signature",
    };
  }
  if (obiettivo === 'mantenere') {
    return {
      title: 'Percorso Mantenimento Evoluto',
      subtitle: 'Proteggere ciò che si è costruito',
      description: 'Un piano di cura continuativa per preservare e potenziare i risultati nel tempo. Protocolli adattivi, consulenze periodiche e un accompagnamento che evolve con Lei.',
      percorso: 'Mantenimento Evoluto',
      highlights: ['Protocolli adattivi e personalizzati', 'Consulenze periodiche di monitoraggio', 'Aggiornamento continuo del piano', 'Risultati preservati e potenziati'],
      image: '/images/texture-new.jpg',
      cta: 'Prenota la consulenza Mantenimento',
    };
  }
  return {
    title: 'Percorso Cura del Capello',
    subtitle: 'Restituire ciò che il tempo ha tolto',
    description: 'Un programma strutturato per restituire forza, elasticità e luminosità alla fibra capillare. Rispettando la natura e la storia di ogni capello, costruiamo un percorso che porta a risultati visibili e duraturi.',
    percorso: 'Cura & Bellezza del Capello',
    highlights: ['Analisi della fibra capillare', 'Protocolli di ricostruzione personalizzati', 'Trattamenti di idratazione profonda', 'Progressione monitorata verso il risultato'],
    image: '/images/hair-back-new.jpg',
    cta: 'Prenota la consulenza Capello',
  };
}

const premiumEase: [number, number, number, number] = [0.25, 0.1, 0, 1];

/* ═══════════════════════════════════════════════════════════════
   QUIZ OVERLAY — fullscreen modal
   ═══════════════════════════════════════════════════════════════ */

function QuizOverlay({ onClose }: { onClose: () => void }) {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [showResult, setShowResult] = useState(false);
  const [direction, setDirection] = useState(1);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, []);

  // Scroll to top when step or result changes
  useEffect(() => {
    scrollRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
  }, [step, showResult]);

  const currentQ = questions[step];
  const totalSteps = questions.length;
  const progress = ((step + 1) / totalSteps) * 100;

  const selectOption = useCallback((optionId: string) => {
    const newAnswers = { ...answers, [currentQ.id]: optionId };
    setAnswers(newAnswers);
    setTimeout(() => {
      if (step < totalSteps - 1) {
        setDirection(1);
        setStep(step + 1);
      } else {
        setShowResult(true);
      }
    }, 300);
  }, [answers, currentQ, step, totalSteps]);

  const goBack = useCallback(() => {
    if (showResult) {
      setShowResult(false);
    } else if (step > 0) {
      setDirection(-1);
      setStep(step - 1);
    }
  }, [step, showResult]);

  const reset = useCallback(() => {
    setStep(0);
    setAnswers({});
    setShowResult(false);
    setDirection(1);
  }, []);

  const solution = showResult ? getSolution(answers) : null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.45, ease: premiumEase }}
      className="fixed inset-0 z-[60] bg-ivory flex flex-col"
    >
      {/* ── Top bar ── */}
      <div className="flex-shrink-0 border-b border-sand/40 bg-ivory">
        <div className="max-w-[1400px] mx-auto px-6 md:px-10 lg:px-16 h-[68px] flex items-center gap-6">
          {/* Label / step info */}
          <span className="text-[11px] tracking-[0.35em] uppercase text-brass-muted font-light flex-shrink-0">
            {showResult ? 'La tua soluzione' : 'Il Tuo Viaggio'}
          </span>

          {/* Progress bar — visibile solo durante il quiz */}
          {!showResult && (
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-[10px] tracking-[0.18em] uppercase text-anthracite/35 font-light truncate">
                  {currentQ.label}
                </span>
                <span className="text-[10px] text-anthracite/25 font-light flex-shrink-0 ml-4">
                  {step + 1} / {totalSteps}
                </span>
              </div>
              <div className="h-[1px] bg-sand/60 w-full">
                <motion.div
                  className="h-full bg-brass"
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 0.5, ease: 'easeOut' }}
                />
              </div>
            </div>
          )}

          {showResult && <div className="flex-1" />}

          {/* Close button */}
          <button
            onClick={onClose}
            aria-label="Chiudi"
            className="flex-shrink-0 flex items-center gap-2 text-[11px] tracking-[0.15em] uppercase text-anthracite/35 font-light hover:text-anthracite/70 transition-colors duration-300 p-1"
          >
            <X size={18} strokeWidth={1} />
            <span className="hidden sm:inline">Chiudi</span>
          </button>
        </div>
      </div>

      {/* ── Scrollable content ── */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto">
        <div className="min-h-full flex flex-col justify-center py-16 md:py-20 lg:py-24">
          <AnimatePresence mode="wait">
            {/* ── QUESTION ── */}
            {!showResult && (
              <motion.div
                key={`q-${step}`}
                initial={{ opacity: 0, x: direction * 40 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: direction * -40 }}
                transition={{ duration: 0.4, ease: 'easeOut' }}
                className="max-w-[680px] mx-auto px-6 md:px-10 w-full"
              >
                <motion.h2
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, ease: premiumEase }}
                  className="font-serif text-[28px] md:text-[36px] lg:text-[42px] font-light leading-[1.15] text-charcoal text-center mb-3"
                >
                  {currentQ.question}
                </motion.h2>
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5, ease: premiumEase, delay: 0.1 }}
                  className="text-[14px] text-anthracite/45 font-light text-center mb-10 md:mb-14 tracking-wide"
                >
                  {currentQ.subtitle}
                </motion.p>

                <div className="space-y-3">
                  {currentQ.options.map((opt, i) => (
                    <motion.button
                      key={opt.id}
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.1 + i * 0.07, duration: 0.4 }}
                      onClick={() => selectOption(opt.id)}
                      className={`w-full text-left p-5 md:p-6 border transition-all duration-500 group ${
                        answers[currentQ.id] === opt.id
                          ? 'border-brass bg-brass/[0.05]'
                          : 'border-sand/50 bg-white/20 hover:border-brass/30 hover:bg-white/50'
                      }`}
                    >
                      <div className="flex items-start gap-4">
                        <div className={`w-5 h-5 rounded-full border-2 flex-shrink-0 mt-0.5 flex items-center justify-center transition-all duration-300 ${
                          answers[currentQ.id] === opt.id
                            ? 'border-brass bg-brass'
                            : 'border-sand group-hover:border-brass/40'
                        }`}>
                          {answers[currentQ.id] === opt.id && (
                            <div className="w-2 h-2 rounded-full bg-ivory" />
                          )}
                        </div>
                        <div>
                          <p className="text-[15px] md:text-[16px] font-light text-charcoal mb-1">{opt.text}</p>
                          <p className="text-[13px] leading-[1.6] text-anthracite/45 font-light">{opt.subtext}</p>
                        </div>
                      </div>
                    </motion.button>
                  ))}
                </div>

                {step > 0 && (
                  <div className="mt-10 text-center">
                    <button
                      onClick={goBack}
                      className="inline-flex items-center gap-2 text-[12px] tracking-[0.15em] uppercase text-anthracite/30 font-light hover:text-anthracite/55 transition-colors"
                    >
                      <ArrowLeft size={14} strokeWidth={1.5} /> Domanda precedente
                    </button>
                  </div>
                )}
              </motion.div>
            )}

            {/* ── RESULT ── */}
            {showResult && solution && (
              <motion.div
                key="result"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: premiumEase }}
                className="w-full"
              >
                {/* Result header */}
                <div className="text-center mb-12 md:mb-16 px-6">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.2, type: 'spring', stiffness: 200, damping: 15 }}
                    className="w-14 h-14 rounded-full border border-brass/30 flex items-center justify-center mx-auto mb-6"
                  >
                    <Sparkles size={22} strokeWidth={1.2} className="text-brass" />
                  </motion.div>
                  <p className="text-[11px] tracking-[0.35em] uppercase text-brass-muted font-light mb-4">
                    La sua soluzione
                  </p>
                  <h2 className="font-serif text-[30px] md:text-[44px] lg:text-[52px] font-light leading-[1.1] text-charcoal">
                    {solution.title}
                  </h2>
                  <p className="mt-3 font-serif text-[17px] md:text-[20px] italic text-charcoal/45 font-light">
                    {solution.subtitle}
                  </p>
                </div>

                {/* Result content — image + text */}
                <div className="max-w-[1200px] mx-auto px-6 md:px-10 lg:px-16">
                  <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-start">
                    <div className="aspect-[4/3] lg:aspect-[3/4] overflow-hidden">
                      <img
                        src={solution.image}
                        alt={solution.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex flex-col justify-center lg:py-4">
                      <div className="mb-6">
                        <span className="text-[11px] tracking-[0.2em] uppercase text-brass-muted font-light border border-brass/20 px-3 py-1.5">
                          {solution.percorso}
                        </span>
                      </div>
                      <p className="text-[15px] md:text-[16px] leading-[1.8] text-anthracite/70 font-light mb-8">
                        {solution.description}
                      </p>
                      <h4 className="text-[11px] tracking-[0.25em] uppercase text-brass-muted font-light mb-5">
                        Cosa include
                      </h4>
                      <div className="space-y-3.5 mb-10">
                        {solution.highlights.map((h, i) => (
                          <div key={i} className="flex items-center gap-3">
                            <div className="w-1.5 h-1.5 rounded-full bg-brass/50 flex-shrink-0" />
                            <span className="text-[14px] text-anthracite/60 font-light">{h}</span>
                          </div>
                        ))}
                      </div>
                      <div className="flex flex-col sm:flex-row gap-3">
                        <Link
                          to="/contatti"
                          onClick={onClose}
                          className="group inline-flex items-center justify-center gap-3 bg-charcoal text-ivory text-[12px] tracking-[0.2em] uppercase font-light px-8 py-4 hover:bg-deep transition-all duration-500"
                        >
                          {solution.cta}
                          <ArrowRight size={14} strokeWidth={1.5} className="group-hover:translate-x-1 transition-transform" />
                        </Link>
                        <Link
                          to="/i-percorsi"
                          onClick={onClose}
                          className="inline-flex items-center justify-center gap-2 text-[12px] tracking-[0.18em] uppercase text-anthracite/50 font-light border border-sand/60 px-8 py-4 hover:border-anthracite/20 hover:text-anthracite/70 transition-all duration-500"
                        >
                          Esplora tutti i percorsi
                        </Link>
                      </div>
                    </div>
                  </div>

                  {/* Bottom actions */}
                  <div className="mt-14 md:mt-20 pt-10 border-t border-sand/40 flex flex-col sm:flex-row items-center justify-between gap-6">
                    <button
                      onClick={reset}
                      className="inline-flex items-center gap-2 text-[12px] tracking-[0.15em] uppercase text-anthracite/30 font-light hover:text-anthracite/55 transition-colors"
                    >
                      <RotateCcw size={14} strokeWidth={1.5} /> Ricomincia
                    </button>
                    <button
                      onClick={onClose}
                      className="inline-flex items-center gap-2 text-[12px] tracking-[0.15em] uppercase text-anthracite/30 font-light hover:text-anthracite/55 transition-colors"
                    >
                      <ArrowLeft size={14} strokeWidth={1.5} /> Torna alla pagina
                    </button>
                  </div>
                </div>

                <div className="pb-16 md:pb-24" />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   PAGE SECTIONS
   ═══════════════════════════════════════════════════════════════ */

function SoluzioneIntro({ onStart }: { onStart: () => void }) {
  const ref = useRef(null);
  const v = useInView(ref, { once: true, margin: '-80px' });
  return (
    <section className="py-28 md:py-40 lg:py-48 bg-ivory">
      <div className="max-w-[800px] mx-auto px-6 md:px-10 lg:px-16 text-center" ref={ref}>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={v ? { opacity: 1, y: 0 } : {}} transition={{ duration: 1.2, ease: premiumEase }}>
          <span className="text-[11px] tracking-[0.35em] uppercase text-brass-muted font-light">Inizia il Tuo Viaggio</span>
          <div className="w-10 h-[1px] bg-brass mx-auto mt-4 mb-8" />
          <p className="font-serif text-[24px] md:text-[30px] lg:text-[34px] font-light leading-[1.3] text-charcoal">
            Ogni donna ha esigenze uniche. Risponda a poche domande e la guideremo verso il percorso di cura più adatto a lei.
          </p>
          <p className="mt-6 text-[14px] md:text-[15px] leading-[1.8] text-anthracite/55 font-light max-w-lg mx-auto">
            Questo strumento non sostituisce la consulenza. La prepara. Le permette di arrivare al primo incontro con maggiore consapevolezza.
          </p>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={v ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 1, ease: premiumEase, delay: 0.4 }}
          className="mt-10"
        >
          <button
            onClick={onStart}
            className="group inline-flex items-center gap-3 bg-charcoal text-ivory text-[12px] tracking-[0.22em] uppercase font-light px-12 py-5 hover:bg-deep transition-all duration-500"
          >
            Inizia subito
            <ArrowRight size={15} strokeWidth={1.5} className="group-hover:translate-x-1.5 transition-transform duration-500" />
          </button>
        </motion.div>
      </div>
    </section>
  );
}

function Rassicurazione() {
  const ref = useRef(null);
  const v = useInView(ref, { once: true, margin: '-80px' });
  return (
    <section className="py-28 md:py-40 lg:py-48 bg-ecru/40">
      <div className="max-w-[1400px] mx-auto px-6 md:px-10 lg:px-16" ref={ref}>
        <div className="grid md:grid-cols-3 gap-10 md:gap-8">
          {[
            { title: 'Non è un test clinico', text: 'Questo strumento la orienta. La consulenza in sede, con ascolto e analisi professionale, definirà il percorso reale.' },
            { title: 'La consulenza è senza impegno', text: 'Dura circa 30 minuti. Non è una vendita: è un momento di comprensione reciproca per costruire fiducia.' },
            { title: 'Ogni percorso è personalizzato', text: 'Nessun protocollo standard. Il piano di cura viene costruito su misura, rispettando la sua unicità.' },
          ].map((item, i) => (
            <motion.div key={item.title} initial={{ opacity: 0, y: 25 }} animate={v ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.8, ease: premiumEase, delay: 0.1 + i * 0.1 }} className="border-t border-brass/15 pt-6">
              <h3 className="font-serif text-[20px] md:text-[22px] font-light text-charcoal mb-3">{item.title}</h3>
              <p className="text-[14px] leading-[1.75] text-anthracite/55 font-light">{item.text}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function SoluzioneCTA() {
  const ref = useRef(null);
  const v = useInView(ref, { once: true, margin: '-80px' });
  return (
    <section className="py-28 md:py-40 lg:py-48 bg-charcoal text-ivory">
      <div className="max-w-[900px] mx-auto px-6 md:px-10 lg:px-16 text-center" ref={ref}>
        <motion.div initial={{ width: 0 }} animate={v ? { width: 50 } : {}} transition={{ duration: 1 }} className="h-[1px] bg-brass mx-auto mb-10" />
        <motion.h2 initial={{ opacity: 0, y: 20 }} animate={v ? { opacity: 1, y: 0 } : {}} transition={{ duration: 1.2, ease: premiumEase, delay: 0.15 }} className="font-serif text-[28px] md:text-[36px] lg:text-[42px] font-light leading-[1.12] text-ivory">
          Il percorso giusto inizia<br />da una conversazione.
        </motion.h2>
        <motion.p initial={{ opacity: 0, y: 15 }} animate={v ? { opacity: 1, y: 0 } : {}} transition={{ duration: 1, ease: premiumEase, delay: 0.3 }} className="mt-6 text-[15px] leading-[1.8] text-ivory/45 font-light max-w-lg mx-auto">
          La consulenza Luxosa è il momento in cui ascoltiamo, osserviamo e comprendiamo. È il primo passo verso la cura che merita.
        </motion.p>
        <motion.div initial={{ opacity: 0, y: 15 }} animate={v ? { opacity: 1, y: 0 } : {}} transition={{ duration: 1, ease: premiumEase, delay: 0.45 }} className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-5">
          <Link to="/contatti" className="group inline-flex items-center gap-3 bg-ivory text-charcoal text-[12px] tracking-[0.2em] uppercase font-light px-10 py-4 hover:bg-brass-light transition-all duration-500">
            Prenota la sua consulenza <ArrowRight size={14} strokeWidth={1.5} className="group-hover:translate-x-1 transition-transform" />
          </Link>
          <Link to="/il-metodo" className="inline-flex items-center gap-3 text-[12px] tracking-[0.2em] uppercase text-ivory/50 font-light border border-ivory/15 px-10 py-4 hover:border-ivory/30 hover:text-ivory/80 transition-all duration-500">
            Scopri il metodo
          </Link>
        </motion.div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════════
   PAGE
   ═══════════════════════════════════════════════════════════════ */
export default function LaTuaSoluzionePage() {
  const [quizOpen, setQuizOpen] = useState(false);

  return (
    <>
      <PageHero
        label="La Tua Soluzione"
        title="Trovi il percorso pensato per lei."
        subtitle="Risponda a poche domande. La guideremo verso la cura più adatta alle sue esigenze."
        image="/images/soluzione-hero.jpg"
      />
      <SoluzioneIntro onStart={() => setQuizOpen(true)} />
      <Rassicurazione />
      <SoluzioneCTA />

      <AnimatePresence>
        {quizOpen && (
          <QuizOverlay onClose={() => setQuizOpen(false)} />
        )}
      </AnimatePresence>
    </>
  );
}
