import { useState } from 'react';
import { motion, useInView, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { useRef } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import PageHero from '../components/PageHero';
import Percorsi from '../components/Percorsi';
import { DiagnosticTakeover } from '../components/DiagnosticTakeover';

import { premiumEase } from '../lib/animations';

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
            className="text-[18px] md:text-[20px] leading-[1.85] text-anthracite/80 font-light"
          >
            C'è una differenza tra ricevere una prestazione e affidarsi a qualcuno che prende davvero in carico.
          </motion.p>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 1.1, ease: premiumEase, delay: 0.4 }}
            className="mt-5 text-[18px] md:text-[20px] leading-[1.85] text-anthracite/80 font-light"
          >
            Un percorso Luxosa nasce da una comprensione reale della persona, del capello e dell'obiettivo da raggiungere. Non è una formula standard, non è un pacchetto da scegliere a scaffale: è una direzione costruita con metodo, seduta dopo seduta.
          </motion.p>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 1.1, ease: premiumEase, delay: 0.5 }}
            className="mt-5 text-[18px] md:text-[20px] leading-[1.85] text-anthracite/70 font-light"
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
          src="/images/sfondo_ipercorsi_scritta.png"
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
            <p className="text-[18px] md:text-[19px] leading-[1.85] text-anthracite/70 font-light">
              Rispondi a poche domande sulla tua cute, il tuo capello, la tua storia e i tuoi obiettivi.
            </p>
            <p className="text-[18px] md:text-[19px] leading-[1.85] text-anthracite/70 font-light">
              In pochi minuti ti orienteremo verso il percorso Luxosa più adatto a te.
            </p>
            <p className="text-[17px] leading-[1.8] text-anthracite/45 font-light italic">
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

function IlPrimoPasso() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <section className="py-32 md:py-48 lg:py-56 bg-ecru" ref={ref}>
      <div className="max-w-[1400px] mx-auto px-6 md:px-10 lg:px-16">
        <div className="max-w-2xl">
          <motion.span
            initial={{ opacity: 0, y: 15 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 1, ease: premiumEase }}
            className="text-[11px] tracking-[0.35em] uppercase text-brass-muted font-light"
          >
            Il Primo Passo
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
            className="text-[18px] md:text-[20px] leading-[1.85] text-anthracite/80 font-light"
          >
            Le Esperienze Luxosa sono il primo ingresso possibile per chi desidera avvicinarsi al mondo Luxosa attraverso un gesto singolo, costruito con la stessa attenzione.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 1, ease: premiumEase, delay: 0.45 }}
            className="mt-10"
          >
            <Link
              to="/le-esperienze"
              className="group inline-flex items-center gap-2 text-[12px] tracking-[0.18em] uppercase text-brass-muted font-light hover:text-brass transition-colors duration-500"
            >
              Scopri le Esperienze <ArrowRight size={14} strokeWidth={1.5} className="transition-transform duration-500 group-hover:translate-x-2" />
            </Link>
          </motion.div>
        </div>
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
        subtitle="Dove la relazione diventa metodo, continuità e trasformazione."
        image="/images/hero_ipercorsi.png"
      />
      <PercorsiIntro />
      <Percorsi />
      <PercorsiCinematic />
      <IlPrimoPasso />
      <LaTuaSoluzione onQuizOpen={() => setQuizOpen(true)} />

      <AnimatePresence>
        {quizOpen && (
          <DiagnosticTakeover onReset={() => setQuizOpen(false)} />
        )}
      </AnimatePresence>
    </>
  );
}
