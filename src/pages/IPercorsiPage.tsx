import PageHero from '../components/PageHero';
import Percorsi from '../components/Percorsi';
import Signature from '../components/Signature';
import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

function PercorsiIntro() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <section className="py-28 md:py-36 bg-ivory">
      <div className="max-w-[1400px] mx-auto px-6 md:px-10 lg:px-16" ref={ref}>
        <div className="grid lg:grid-cols-2 gap-16 lg:gap-24 items-center">
          <div>
            <motion.div initial={{ opacity: 0, y: 20 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.8 }}>
              <span className="text-[11px] tracking-[0.35em] uppercase text-brass-muted font-light">La Nostra Filosofia</span>
              <div className="w-10 h-[1px] bg-brass mt-4 mb-8" />
            </motion.div>
            <motion.h2 initial={{ opacity: 0, y: 25 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.8, delay: 0.15 }} className="font-serif text-[30px] md:text-[38px] lg:text-[44px] font-light leading-[1.12] text-charcoal">
              Ogni percorso nasce<br />dall'ascolto.
            </motion.h2>
            <motion.div initial={{ opacity: 0, y: 20 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.8, delay: 0.3 }} className="mt-8 space-y-5">
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

function PercorsiCTA() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <section className="py-24 md:py-32 bg-ivory-warm">
      <div className="max-w-[900px] mx-auto px-6 md:px-10 lg:px-16 text-center" ref={ref}>
        <motion.div initial={{ width: 0 }} animate={inView ? { width: 50 } : {}} transition={{ duration: 1 }} className="h-[1px] bg-brass mx-auto mb-10" />
        <motion.h2 initial={{ opacity: 0, y: 25 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.8, delay: 0.15 }} className="font-serif text-[30px] md:text-[38px] lg:text-[44px] font-light leading-[1.1] text-charcoal">Inizi il suo percorso<br />con una consulenza.</motion.h2>
        <motion.p initial={{ opacity: 0, y: 15 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.7, delay: 0.3 }} className="mt-6 text-[15px] md:text-[16px] leading-[1.8] text-anthracite/65 font-light max-w-lg mx-auto">Insieme definiremo il percorso più adatto alle sue esigenze, ai suoi obiettivi e alla sua unicità.</motion.p>
        <motion.div initial={{ opacity: 0, y: 15 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.7, delay: 0.45 }} className="mt-10">
          <Link to="/contatti" className="group inline-flex items-center gap-3 bg-charcoal text-ivory text-[12px] tracking-[0.2em] uppercase font-light px-10 py-4.5 hover:bg-deep transition-all duration-500">Prenota una consulenza <ArrowRight size={15} strokeWidth={1.5} className="transition-transform duration-500 group-hover:translate-x-1" /></Link>
        </motion.div>
      </div>
    </section>
  );
}

export default function IPercorsiPage() {
  return (
    <>
      <PageHero label="I Percorsi" title="Percorsi di benessere per cute e capelli,non semplici servizi." subtitle="Ogni area è pensata per rispondere a un'esigenza specifica, con la profondità e l'attenzione che ogni persona merita." image="/images/hair-back.jpg" />
      <PercorsiIntro />
      <Percorsi />
      <Signature />
      <PercorsiCTA />
    </>
  );
}
