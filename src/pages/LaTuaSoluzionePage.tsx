import { motion, useInView, AnimatePresence } from 'framer-motion';
import { useRef, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ArrowLeft, Sparkles, RotateCcw } from 'lucide-react';
import PageHero from '../components/PageHero';

/* ═══════════════════════════════════════════════════════════════
   DATA — Diagnostic questions & solution mapping
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

/* ═══ Solution mapping ═══ */
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

/* ═══════════════════════════════════════════════════════════════
   COMPONENTS
   ═══════════════════════════════════════════════════════════════ */

/* ─── Intro with "Inizia Adesso" gate ─── */
function SoluzioneIntro({ onStart }: { onStart: () => void }) {
  const ref = useRef(null);
  const v = useInView(ref, { once: true, margin: '-80px' });
  return (
    <section className="py-24 md:py-32 bg-ivory">
      <div className="max-w-[800px] mx-auto px-6 md:px-10 lg:px-16 text-center" ref={ref}>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={v ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.8 }}>
          <span className="text-[11px] tracking-[0.35em] uppercase text-brass-muted font-light">Inizia il Tuo Viaggio</span>
          <div className="w-10 h-[1px] bg-brass mx-auto mt-4 mb-8" />
          <p className="font-serif text-[24px] md:text-[30px] lg:text-[34px] font-light leading-[1.3] text-charcoal">
            Ogni donna ha esigenze uniche. Risponda a poche domande e la guideremo verso il percorso di cura più adatto a Lei.
          </p>
          <p className="mt-6 text-[14px] md:text-[15px] leading-[1.8] text-anthracite/55 font-light max-w-lg mx-auto">
            Questo strumento non sostituisce la consulenza. La prepara. Le permette di arrivare al primo incontro con maggiore consapevolezza.
          </p>
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={v ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.4 }}
            className="mt-10"
          >
            <button
              onClick={onStart}
              className="group inline-flex items-center gap-3 bg-charcoal text-ivory text-[12px] tracking-[0.22em] uppercase font-light px-12 py-5 hover:bg-deep transition-all duration-500"
            >
              Inizia adesso
              <ArrowRight size={15} strokeWidth={1.5} className="group-hover:translate-x-1.5 transition-transform duration-500" />
            </button>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

/* ─── Diagnostic Tool ─── */
function DiagnosticTool() {
  const ref = useRef(null);
  const v = useInView(ref, { once: true, margin: '-60px' });
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [showResult, setShowResult] = useState(false);
  const [direction, setDirection] = useState(1);

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
    setDirection(-1);
  }, []);

  const solution = showResult ? getSolution(answers) : null;

  return (
    <section className="py-16 md:py-24 bg-ecru/30" ref={ref}>
      <div className="max-w-[1400px] mx-auto px-6 md:px-10 lg:px-16">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={v ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
        >
          {/* Progress bar */}
          {!showResult && (
            <div className="max-w-[700px] mx-auto mb-12 md:mb-16">
              <div className="flex items-center justify-between mb-3">
                <span className="text-[11px] tracking-[0.2em] uppercase text-anthracite/40 font-light">
                  {currentQ.label}
                </span>
                <span className="text-[11px] tracking-[0.15em] text-anthracite/30 font-light">
                  {step + 1} / {totalSteps}
                </span>
              </div>
              <div className="h-[2px] bg-sand/60 w-full">
                <motion.div
                  className="h-full bg-brass"
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 0.5, ease: 'easeOut' }}
                />
              </div>
            </div>
          )}

          {/* Question / Result */}
          <AnimatePresence mode="wait">
            {!showResult ? (
              <motion.div
                key={`q-${step}`}
                initial={{ opacity: 0, x: direction * 40 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: direction * -40 }}
                transition={{ duration: 0.4, ease: 'easeOut' }}
                className="max-w-[700px] mx-auto"
              >
                <h2 className="font-serif text-[28px] md:text-[36px] lg:text-[40px] font-light leading-[1.15] text-charcoal text-center mb-3">
                  {currentQ.question}
                </h2>
                <p className="text-[14px] text-anthracite/50 font-light text-center mb-10 md:mb-14">
                  {currentQ.subtitle}
                </p>

                {/* Options */}
                <div className="space-y-3">
                  {currentQ.options.map((opt, i) => (
                    <motion.button
                      key={opt.id}
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.1 + i * 0.06, duration: 0.4 }}
                      onClick={() => selectOption(opt.id)}
                      className={`w-full text-left p-5 md:p-6 border transition-all duration-500 group ${
                        answers[currentQ.id] === opt.id
                          ? 'border-brass bg-brass/8'
                          : 'border-sand/50 bg-ivory/50 hover:border-brass/30 hover:bg-ivory'
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
                          <h3 className="text-[15px] md:text-[16px] font-light text-charcoal mb-1">{opt.text}</h3>
                          <p className="text-[13px] leading-[1.6] text-anthracite/45 font-light">{opt.subtext}</p>
                        </div>
                      </div>
                    </motion.button>
                  ))}
                </div>

                {/* Back button */}
                {step > 0 && (
                  <div className="mt-8 text-center">
                    <button
                      onClick={goBack}
                      className="inline-flex items-center gap-2 text-[12px] tracking-[0.15em] uppercase text-anthracite/35 font-light hover:text-anthracite/60 transition-colors"
                    >
                      <ArrowLeft size={14} strokeWidth={1.5} /> Domanda precedente
                    </button>
                  </div>
                )}
              </motion.div>
            ) : solution && (
              <motion.div
                key="result"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
              >
                {/* Result header */}
                <div className="text-center mb-12 md:mb-16">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.2, type: 'spring', stiffness: 200, damping: 15 }}
                    className="w-14 h-14 rounded-full border border-brass/30 flex items-center justify-center mx-auto mb-6"
                  >
                    <Sparkles size={22} strokeWidth={1.2} className="text-brass" />
                  </motion.div>
                  <p className="text-[11px] tracking-[0.35em] uppercase text-brass-muted font-light mb-4">La sua soluzione</p>
                  <h2 className="font-serif text-[32px] md:text-[42px] lg:text-[48px] font-light leading-[1.1] text-charcoal">
                    {solution.title}
                  </h2>
                  <p className="mt-3 font-serif text-[18px] md:text-[20px] italic text-charcoal/50 font-light">
                    {solution.subtitle}
                  </p>
                </div>

                {/* Result content */}
                <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 max-w-[1200px] mx-auto">
                  <div className="aspect-[4/3] overflow-hidden">
                    <img src={solution.image} alt={solution.title} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex flex-col justify-center">
                    <div className="mb-3">
                      <span className="text-[11px] tracking-[0.2em] uppercase text-brass-muted font-light border border-brass/20 px-3 py-1">
                        {solution.percorso}
                      </span>
                    </div>
                    <p className="text-[15px] md:text-[16px] leading-[1.8] text-anthracite/70 font-light mb-8">
                      {solution.description}
                    </p>

                    <h4 className="text-[11px] tracking-[0.25em] uppercase text-brass-muted font-light mb-4">
                      Cosa include
                    </h4>
                    <div className="space-y-3 mb-10">
                      {solution.highlights.map((h, i) => (
                        <div key={i} className="flex items-center gap-3">
                          <div className="w-1.5 h-1.5 rounded-full bg-brass/50" />
                          <span className="text-[14px] text-anthracite/60 font-light">{h}</span>
                        </div>
                      ))}
                    </div>

                    <div className="flex flex-col sm:flex-row gap-3">
                      <Link
                        to="/contatti"
                        className="group inline-flex items-center justify-center gap-3 bg-charcoal text-ivory text-[12px] tracking-[0.2em] uppercase font-light px-8 py-4 hover:bg-deep transition-all duration-500"
                      >
                        {solution.cta}
                        <ArrowRight size={14} strokeWidth={1.5} className="group-hover:translate-x-1 transition-transform" />
                      </Link>
                      <Link
                        to="/i-percorsi"
                        className="inline-flex items-center justify-center gap-2 text-[12px] tracking-[0.18em] uppercase text-anthracite/50 font-light border border-sand/60 px-8 py-4 hover:border-anthracite/20 hover:text-anthracite/70 transition-all duration-500"
                      >
                        Esplora tutti i percorsi
                      </Link>
                    </div>
                  </div>
                </div>

                {/* Actions below result */}
                <div className="mt-14 md:mt-20 pt-10 border-t border-sand/40 max-w-[1200px] mx-auto">
                  <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
                    <button
                      onClick={reset}
                      className="inline-flex items-center gap-2 text-[12px] tracking-[0.15em] uppercase text-anthracite/35 font-light hover:text-anthracite/60 transition-colors"
                    >
                      <RotateCcw size={14} strokeWidth={1.5} /> Ricomincia il percorso
                    </button>
                    <p className="text-[13px] text-anthracite/40 font-light text-center sm:text-right max-w-sm">
                      Questo risultato è indicativo. La consulenza in sede definirà il percorso su misura per Lei.
                    </p>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  );
}

/* ─── Rassicurazione ─── */
function Rassicurazione() {
  const ref = useRef(null);
  const v = useInView(ref, { once: true, margin: '-80px' });
  return (
    <section className="py-24 md:py-32 bg-ivory">
      <div className="max-w-[1400px] mx-auto px-6 md:px-10 lg:px-16" ref={ref}>
        <div className="grid md:grid-cols-3 gap-10 md:gap-8">
          {[
            { title: 'Non è un test clinico', text: 'Questo strumento la orienta. La consulenza in sede, con ascolto e analisi professionale, definirà il percorso reale.' },
            { title: 'La consulenza è senza impegno', text: 'Dura circa 30 minuti. Non è una vendita: è un momento di comprensione reciproca per costruire fiducia.' },
            { title: 'Ogni percorso è personalizzato', text: 'Nessun protocollo standard. Il piano di cura viene costruito su misura, rispettando la sua unicità.' },
          ].map((item, i) => (
            <motion.div key={item.title} initial={{ opacity: 0, y: 25 }} animate={v ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.6, delay: 0.1 + i * 0.1 }} className="border-t border-brass/15 pt-6">
              <h3 className="font-serif text-[20px] md:text-[22px] font-light text-charcoal mb-3">{item.title}</h3>
              <p className="text-[14px] leading-[1.75] text-anthracite/55 font-light">{item.text}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─── CTA Finale ─── */
function SoluzioneCTA() {
  const ref = useRef(null);
  const v = useInView(ref, { once: true, margin: '-80px' });
  return (
    <section className="py-24 md:py-32 bg-charcoal text-ivory">
      <div className="max-w-[900px] mx-auto px-6 md:px-10 lg:px-16 text-center" ref={ref}>
        <motion.div initial={{ width: 0 }} animate={v ? { width: 50 } : {}} transition={{ duration: 1 }} className="h-[1px] bg-brass mx-auto mb-10" />
        <motion.h2 initial={{ opacity: 0, y: 20 }} animate={v ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.8, delay: 0.15 }} className="font-serif text-[28px] md:text-[36px] lg:text-[42px] font-light leading-[1.12] text-ivory">
          Il percorso giusto inizia<br />da una conversazione.
        </motion.h2>
        <motion.p initial={{ opacity: 0, y: 15 }} animate={v ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.7, delay: 0.3 }} className="mt-6 text-[15px] leading-[1.8] text-ivory/45 font-light max-w-lg mx-auto">
          La consulenza Luxosa è il momento in cui ascoltiamo, osserviamo e comprendiamo. È il primo passo verso la cura che merita.
        </motion.p>
        <motion.div initial={{ opacity: 0, y: 15 }} animate={v ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.7, delay: 0.45 }} className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-5">
          <Link to="/contatti" className="group inline-flex items-center gap-3 bg-ivory text-charcoal text-[12px] tracking-[0.2em] uppercase font-light px-10 py-4.5 hover:bg-brass-light transition-all duration-500">
            Prenota la sua consulenza <ArrowRight size={14} strokeWidth={1.5} className="group-hover:translate-x-1 transition-transform" />
          </Link>
          <Link to="/il-metodo" className="inline-flex items-center gap-3 text-[12px] tracking-[0.2em] uppercase text-ivory/50 font-light border border-ivory/15 px-10 py-4.5 hover:border-ivory/30 hover:text-ivory/80 transition-all duration-500">
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
  const [started, setStarted] = useState(false);
  const diagnosticRef = useRef<HTMLDivElement>(null);

  const handleStart = () => {
    setStarted(true);
    // Smooth scroll to diagnostic after a brief delay for the animation
    setTimeout(() => {
      diagnosticRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
  };

  return (
    <>
      <PageHero
        label="La Tua Soluzione"
        title="Trovi il percorso<br>pensato per Lei."
        subtitle="Risponda a poche domande. La guideremo verso la cura più adatta alle sue esigenze."
        image="/images/soluzione-hero.jpg"
        height="medium"
      />
      <SoluzioneIntro onStart={handleStart} />

      {/* Diagnostic appears only after clicking "Inizia Adesso" */}
      <div ref={diagnosticRef}>
        <AnimatePresence>
          {started && (
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: [0.25, 0.1, 0, 1] }}
            >
              <DiagnosticTool />
              <Rassicurazione />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <SoluzioneCTA />
    </>
  );
}
