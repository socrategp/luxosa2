import PageHero from '../components/PageHero';
import Percorsi from '../components/Percorsi';
import Signature from '../components/Signature';
import { DiagnosticTakeover } from '../components/DiagnosticTakeover';
import { motion, useInView, useScroll, useTransform } from 'framer-motion';
import { useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

const premiumEase: [number, number, number, number] = [0.25, 0.1, 0, 1];

function CinematicBreak() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const y = useTransform(scrollYProgress, [0, 1], ['-8%', '8%']);
  const inView = useInView(ref, { once: true, margin: '-15%' });

  return (
    <section ref={ref} className="relative h-[65vh] min-h-[480px] max-h-[720px] overflow-hidden">
      <motion.div className="absolute inset-0" style={{ y }}>
        <img
          src="/images/ritual-new.jpg"
          alt=""
          className="w-full h-[120%] -top-[10%] absolute object-cover object-center"
        />
      </motion.div>
      <div className="absolute inset-0 bg-gradient-to-r from-deep/85 via-deep/60 to-deep/30" />
      <div className="absolute inset-0 bg-gradient-to-b from-deep/20 via-transparent to-deep/40" />
      <div className="relative z-10 h-full flex items-center">
        <div className="max-w-[1400px] mx-auto px-6 md:px-10 lg:px-16 w-full">
          <motion.div
            initial={{ width: 0 }}
            animate={inView ? { width: 48 } : {}}
            transition={{ duration: 1.2, ease: premiumEase }}
            className="h-[1px] bg-brass-light mb-10"
          />
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 1.4, ease: premiumEase, delay: 0.2 }}
            className="font-serif text-[32px] md:text-[48px] lg:text-[64px] xl:text-[76px] text-white font-light leading-[1.1] tracking-[0.01em] max-w-3xl"
          >
            "Ogni capello racconta<br />una storia.<br />
            <em className="text-brass-light not-italic">Noi la sappiamo leggere.</em>"
          </motion.p>
        </div>
      </div>
    </section>
  );
}

function PercorsiIntro() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <section className="py-20 md:py-32 lg:py-40 bg-ivory">
      <div className="max-w-[1400px] mx-auto px-6 md:px-10 lg:px-16" ref={ref}>
        <div className="grid lg:grid-cols-2 gap-16 lg:gap-24 items-center">
          <div>
            <motion.div initial={{ opacity: 0, y: 20 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 1.2, ease: [0.25, 0.1, 0, 1] }}>
              <span className="text-[11px] tracking-[0.35em] uppercase text-brass-muted font-light">La Nostra Filosofia</span>
              <div className="w-10 h-[1px] bg-brass mt-4 mb-8" />
            </motion.div>
            <motion.h2 initial={{ opacity: 0, y: 25 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 1.2, ease: [0.25, 0.1, 0, 1], delay: 0.15 }} className="font-serif text-[30px] md:text-[38px] lg:text-[44px] font-light leading-[1.12] text-charcoal">
              Ogni percorso nasce<br />dall'ascolto.
            </motion.h2>
            <motion.div initial={{ opacity: 0, y: 20 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 1.2, ease: [0.25, 0.1, 0, 1], delay: 0.3 }} className="mt-8 space-y-5">
              <p className="text-[15px] md:text-[16px] leading-[1.8] text-anthracite/80 font-light">Non crediamo nei servizi standardizzati. Crediamo nei percorsi costruiti attorno alla persona, alle sue esigenze e ai suoi obiettivi.</p>
              <p className="text-[15px] md:text-[16px] leading-[1.8] text-anthracite/80 font-light">Ogni area è organizzata per obiettivo, non per singolo trattamento. Perché la cura autentica non è un gesto isolato: è un cammino strutturato.</p>
            </motion.div>
          </div>
          <motion.div initial={{ opacity: 0, x: 30 }} animate={inView ? { opacity: 1, x: 0 } : {}} transition={{ duration: 1, delay: 0.3 }} className="relative">
            <div className="aspect-[4/3] overflow-hidden"><img src="/images/care-hands.jpg" alt="Percorsi Luxosa" className="w-full h-full object-cover" /></div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

function LaTuaSoluzione() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });
  const [quizOpen, setQuizOpen] = useState(false);

  return (
    <>
      {quizOpen && <DiagnosticTakeover onReset={() => setQuizOpen(false)} />}
      <section className="py-20 md:py-32 lg:py-40 bg-ecru/40" ref={ref}>
        <div className="max-w-[900px] mx-auto px-6 md:px-10 lg:px-16 text-center">
          <motion.div initial={{ width: 0 }} animate={inView ? { width: 50 } : {}} transition={{ duration: 1.2, ease: premiumEase }} className="h-[1px] bg-brass mx-auto mb-10" />
          <motion.span initial={{ opacity: 0, y: 15 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 1, ease: premiumEase }} className="text-[11px] tracking-[0.35em] uppercase text-brass-muted font-light">La tua soluzione</motion.span>
          <motion.h2 initial={{ opacity: 0, y: 25 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 1.2, ease: premiumEase, delay: 0.15 }} className="mt-6 font-serif text-[30px] md:text-[38px] lg:text-[44px] font-light leading-[1.1] text-charcoal">Non sai da dove iniziare?</motion.h2>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 1.2, ease: premiumEase, delay: 0.3 }} className="mt-8 space-y-4">
            <p className="text-[15px] md:text-[16px] leading-[1.8] text-anthracite/70 font-light max-w-xl mx-auto">Rispondi a poche domande sulla tua cute, il tuo capello, la tua storia e i tuoi obiettivi.</p>
            <p className="text-[15px] md:text-[16px] leading-[1.8] text-anthracite/70 font-light max-w-xl mx-auto">In pochi minuti ti orienteremo verso il percorso Luxosa più adatto a te.</p>
            <p className="text-[13px] md:text-[14px] leading-[1.8] text-anthracite/40 font-light italic">Il quiz non sostituisce la consulenza: la prepara.</p>
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 1, ease: premiumEase, delay: 0.45 }} className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-5">
            <button
              onClick={() => setQuizOpen(true)}
              className="relative overflow-hidden group inline-flex items-center gap-3 bg-charcoal text-ivory text-[12px] tracking-[0.2em] uppercase font-light px-10 py-[18px] transition-shadow duration-500"
            >
              <span className="absolute inset-0 bg-deep translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-[cubic-bezier(0.25,0.1,0,1)]" />
              <span className="relative z-10 flex items-center gap-3">
                Inizia da qui
                <ArrowRight size={15} strokeWidth={1.5} className="transition-transform duration-500 group-hover:translate-x-1" />
              </span>
            </button>
            <Link to="/contatti" className="relative overflow-hidden group inline-flex items-center gap-3 text-[12px] tracking-[0.2em] uppercase text-anthracite/70 font-light border border-anthracite/20 px-10 py-[18px] transition-colors duration-300">
              <span className="absolute inset-0 bg-charcoal translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-[cubic-bezier(0.25,0.1,0,1)]" />
              <span className="relative z-10 group-hover:text-ivory transition-colors duration-300">Prenota il primo incontro</span>
            </Link>
          </motion.div>
        </div>
      </section>
    </>
  );
}


export default function IPercorsiPage() {
  return (
    <>
      <PageHero
        label="I Percorsi"
        title={"Non servizi.\nPercorsi."}
        subtitle="C'è una differenza tra ricevere una prestazione e affidarsi a qualcuno che ti prende in carico davvero."
        image="/images/hair-back.jpg"
      />
      <PercorsiIntro />
      <Percorsi />
      <CinematicBreak />
      <LaTuaSoluzione />
      <Signature />
    </>
  );
}
