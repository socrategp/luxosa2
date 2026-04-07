import { useState } from 'react';
import { motion, useInView, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { useRef } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import PageHero from '../components/PageHero';
import Percorsi from '../components/Percorsi';
import { DiagnosticTakeover } from '../components/DiagnosticTakeover';

const premiumEase: [number, number, number, number] = [0.25, 0.1, 0, 1];

function PercorsiIntro() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section className="py-32 md:py-48 lg:py-56 bg-ivory" ref={ref}>
      <div className="max-w-[1400px] mx-auto px-6 md:px-10 lg:px-16">
        <div className="max-w-2xl">
          <motion.span
            initial={{ opacity: 0, y: 15 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 1, ease: premiumEase }}
            className="text-[11px] tracking-[0.35em] uppercase text-brass-muted font-light"
          >
            I Percorsi
          </motion.span>
          <motion.div
            initial={{ width: 0 }}
            animate={inView ? { width: 40 } : {}}
            transition={{ duration: 1.2, ease: premiumEase, delay: 0.15 }}
            className="h-[1px] bg-brass mt-4 mb-8"
          />
          <motion.p
            initial={{ opacity: 0, y: 25 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 1.2, ease: premiumEase, delay: 0.25 }}
            className="text-[15px] md:text-[17px] leading-[1.85] text-anthracite/80 font-light"
          >
            C'è una differenza tra ricevere una prestazione e affidarsi a qualcuno che ti prende in carico davvero.
          </motion.p>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 1.1, ease: premiumEase, delay: 0.4 }}
            className="mt-5 text-[15px] md:text-[17px] leading-[1.85] text-anthracite/80 font-light"
          >
            Un percorso Luxosa nasce da una comprensione reale della persona, del capello e dell'obiettivo da raggiungere. Non è una formula standard, non è un pacchetto da scegliere a scaffale: è una direzione costruita con metodo, seduta dopo seduta.
          </motion.p>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 1.1, ease: premiumEase, delay: 0.5 }}
            className="mt-5 text-[15px] md:text-[17px] leading-[1.85] text-anthracite/70 font-light"
          >
            Quando il percorso è quello giusto, ogni appuntamento ha un senso. E ogni passo avvicina a un risultato che resta.
          </motion.p>
        </div>
      </div>
    </section>
  );
}

function PercorsiCinematic() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const y = useTransform(scrollYProgress, [0, 1], ['-8%', '8%']);
  const inView = useInView(ref, { once: true, margin: '-15%' });

  const words = ['"Ogni', 'capello', 'racconta', 'una', 'storia.', 'Noi', 'la', 'sappiamo', 'leggere."'];

  return (
    <section ref={ref} className="relative h-[70vh] min-h-[480px] overflow-hidden">
      <motion.div className="absolute inset-0" style={{ y }}>
        <img
          src="/images/hair-back-new.jpg"
          alt=""
          className="w-full h-[120%] -top-[10%] absolute object-cover object-center"
        />
      </motion.div>
      <div className="absolute inset-0 bg-gradient-to-r from-deep/85 via-deep/60 to-deep/30" />
      <div className="absolute inset-0 bg-gradient-to-b from-deep/20 via-transparent to-deep/50" />

      <div className="relative z-10 h-full flex items-center">
        <div className="max-w-[1400px] mx-auto px-6 md:px-10 lg:px-16 w-full">
          <motion.div
            initial={{ width: 0 }}
            animate={inView ? { width: 48 } : {}}
            transition={{ duration: 1.2, ease: premiumEase }}
            className="h-[1px] bg-brass-light mb-10"
          />
          <p className="font-serif text-[32px] md:text-[48px] lg:text-[60px] text-ivory font-light leading-[1.1] tracking-[0.01em] max-w-3xl">
            {words.map((w, i) => (
              <motion.span
                key={i}
                initial={{ opacity: 0, y: 16 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 0.2 + i * 0.08, duration: 0.65, ease: premiumEase }}
                className="inline-block mr-[0.28em]"
              >
                {w}
              </motion.span>
            ))}
          </p>
        </div>
      </div>
    </section>
  );
}

function LaTuaSoluzione({ onQuizOpen }: { onQuizOpen: () => void }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <section className="py-32 md:py-48 lg:py-56 bg-ecru/30" ref={ref}>
      <div className="max-w-[1400px] mx-auto px-6 md:px-10 lg:px-16">
        <div className="max-w-2xl">
          <motion.span
            initial={{ opacity: 0, y: 15 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 1, ease: premiumEase }}
            className="text-[11px] tracking-[0.35em] uppercase text-brass-muted font-light"
          >
            La tua soluzione
          </motion.span>
          <motion.div
            initial={{ width: 0 }}
            animate={inView ? { width: 40 } : {}}
            transition={{ duration: 1.2, ease: premiumEase, delay: 0.15 }}
            className="h-[1px] bg-brass mt-4 mb-8"
          />
          <motion.h2
            initial={{ opacity: 0, y: 25 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 1.2, ease: premiumEase, delay: 0.2 }}
            className="font-serif text-[30px] md:text-[38px] lg:text-[44px] font-light leading-[1.12] text-charcoal"
          >
            Non sai da dove iniziare?
          </motion.h2>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 1.1, ease: premiumEase, delay: 0.35 }}
            className="mt-8 space-y-4"
          >
            <p className="text-[15px] md:text-[16px] leading-[1.85] text-anthracite/70 font-light">
              Rispondi a poche domande sulla tua cute, il tuo capello, la tua storia e i tuoi obiettivi.
            </p>
            <p className="text-[15px] md:text-[16px] leading-[1.85] text-anthracite/70 font-light">
              In pochi minuti ti orienteremo verso il percorso Luxosa più adatto a te.
            </p>
            <p className="text-[14px] leading-[1.8] text-anthracite/45 font-light italic">
              Il quiz non sostituisce la consulenza: la prepara.
            </p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 1, ease: premiumEase, delay: 0.55 }}
            className="mt-12 flex flex-col sm:flex-row gap-5"
          >
            <button
              onClick={onQuizOpen}
              className="group relative overflow-hidden inline-flex items-center gap-3 bg-charcoal text-ivory text-[12px] tracking-[0.2em] uppercase font-light px-10 py-5"
            >
              <span className="absolute inset-0 bg-deep translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-[cubic-bezier(0.25,0.1,0,1)]" />
              <span className="relative z-10 flex items-center gap-3">
                Inizia da qui <ArrowRight size={15} strokeWidth={1.5} className="transition-transform duration-500 group-hover:translate-x-2" />
              </span>
            </button>
            <Link
              to="/contatti"
              className="group inline-flex items-center gap-2 text-[12px] tracking-[0.18em] uppercase text-anthracite/50 font-light hover:text-anthracite transition-colors duration-500 px-2 py-5"
            >
              Prenota il tuo primo incontro <ArrowRight size={14} strokeWidth={1.5} className="transition-transform duration-500 group-hover:translate-x-2" />
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

function EsperienzeSelezionate() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });

  const esperienze = [
    { num: '01', name: 'Rituale Rigenerante Profondo', desc: 'Un percorso completo che combina cura della cute, trattamento della fibra e piega. Per quando vuoi affidarti completamente.' },
    { num: '02', name: 'Consulenza Diagnostica Avanzata', desc: 'Il primo incontro dedicato esclusivamente alla comprensione approfondita della tua cute e del tuo capello.' },
    { num: '03', name: 'Armonia Colore & Struttura', desc: 'Colore, trattamento e forma in un unico appuntamento progettato per durare e valorizzarti.' },
  ];

  return (
    <section className="py-32 md:py-48 lg:py-56 bg-ivory" ref={ref}>
      <div className="max-w-[1400px] mx-auto px-6 md:px-10 lg:px-16">
        <div className="max-w-2xl mb-16 md:mb-20">
          <motion.span
            initial={{ opacity: 0, y: 15 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 1, ease: premiumEase }}
            className="text-[11px] tracking-[0.35em] uppercase text-brass-muted font-light"
          >
            Le esperienze
          </motion.span>
          <motion.div
            initial={{ width: 0 }}
            animate={inView ? { width: 40 } : {}}
            transition={{ duration: 1.2, ease: premiumEase, delay: 0.15 }}
            className="h-[1px] bg-brass mt-4 mb-8"
          />
          <motion.h2
            initial={{ opacity: 0, y: 25 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 1.2, ease: premiumEase, delay: 0.2 }}
            className="font-serif text-[30px] md:text-[38px] lg:text-[44px] font-light leading-[1.12] text-charcoal"
          >
            Esperienze selezionate,<br />pensate per eccellere.
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 1, ease: premiumEase, delay: 0.35 }}
            className="mt-6 text-[15px] leading-[1.8] text-anthracite/65 font-light"
          >
            Ogni esperienza Luxosa rappresenta l'incontro tra metodo e attenzione. Sono i gesti attraverso cui il percorso prende forma, ciascuno con la sua intenzione precisa.
          </motion.p>
        </div>

        <div className="space-y-0">
          {esperienze.map((e, i) => (
            <motion.div
              key={e.num}
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 1, ease: premiumEase, delay: 0.3 + i * 0.1 }}
              className="grid md:grid-cols-[80px_1fr_1fr] gap-8 py-8 border-b border-sand/40 last:border-b-0 items-start"
            >
              <div className="text-[11px] tracking-[0.2em] uppercase text-brass-muted/50 font-light pt-1">{e.num}</div>
              <h3 className="font-serif text-[22px] md:text-[24px] font-light text-charcoal leading-snug tracking-wide">{e.name}</h3>
              <p className="text-[14px] md:text-[15px] leading-[1.8] text-anthracite/60 font-light">{e.desc}</p>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 1, ease: premiumEase, delay: 0.7 }}
          className="mt-16"
        >
          <Link to="/esperienza" className="group inline-flex items-center gap-2 text-[12px] tracking-[0.18em] uppercase text-brass-muted font-light hover:text-brass transition-colors duration-500">
            Tutte le esperienze <ArrowRight size={14} strokeWidth={1.5} className="transition-transform duration-500 group-hover:translate-x-2" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}

export default function IPercorsiPage() {
  const [quizOpen, setQuizOpen] = useState(false);

  return (
    <>
      <PageHero
        label="I Percorsi"
        title="Non servizi. Percorsi."
        subtitle="C'è una differenza tra ricevere una prestazione e affidarsi a qualcuno che ti prende in carico davvero."
        image="/images/hair-back-new.jpg"
      />
      <PercorsiIntro />
      <Percorsi />
      <PercorsiCinematic />
      <LaTuaSoluzione onQuizOpen={() => setQuizOpen(true)} />
      <EsperienzeSelezionate />

      <AnimatePresence>
        {quizOpen && (
          <DiagnosticTakeover onReset={() => setQuizOpen(false)} />
        )}
      </AnimatePresence>
    </>
  );
}
