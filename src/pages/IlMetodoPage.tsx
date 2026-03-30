import PageHero from '../components/PageHero';
import Method from '../components/Method';
import Signature from '../components/Signature';
import { motion, useInView, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';
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
          src="/images/care-hands-new.jpg"
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
            "La cura autentica<br />inizia dall'ascolto.<br />
            <em className="text-brass-light not-italic">Non dalla risposta.</em>"
          </motion.p>
        </div>
      </div>
    </section>
  );
}

function MethodApproach() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <section className="py-32 md:py-48 lg:py-56 bg-ivory">
      <div className="max-w-[1400px] mx-auto px-6 md:px-10 lg:px-16" ref={ref}>
        <div className="grid lg:grid-cols-2 gap-16 lg:gap-24 items-center">
          <motion.div initial={{ opacity: 0, x: -30 }} animate={inView ? { opacity: 1, x: 0 } : {}} transition={{ duration: 1, delay: 0.2 }} className="relative">
            <div className="aspect-[4/3] overflow-hidden"><img src="/images/analysis.jpg" alt="Analisi Luxosa" className="w-full h-full object-cover transition-transform duration-[12s] hover:scale-105 ease-out" loading="lazy" /></div>
            <div className="absolute -top-4 -right-4 w-16 h-16 border-t border-r border-brass/25" />
          </motion.div>
          <div>
            <motion.div initial={{ opacity: 0, y: 20 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 1.2, ease: [0.25, 0.1, 0, 1] }}>
              <span className="text-[11px] tracking-[0.35em] uppercase text-brass-muted font-light">L'Approccio</span>
              <div className="w-10 h-[1px] bg-brass mt-4 mb-8" />
            </motion.div>
            <motion.h2 initial={{ opacity: 0, y: 25 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 1.2, ease: [0.25, 0.1, 0, 1], delay: 0.15 }} className="font-serif text-[30px] md:text-[38px] lg:text-[44px] font-light leading-[1.12] text-charcoal tracking-[0.01em]">
              Prima comprendere.<br />Poi agire.
            </motion.h2>
            <motion.div initial={{ opacity: 0, y: 20 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 1.2, ease: [0.25, 0.1, 0, 1], delay: 0.3 }} className="mt-8 space-y-5">
              <p className="text-[15px] md:text-[16px] leading-[1.8] text-anthracite/80 font-light">Il Metodo Luxosa non è una formula applicata in modo meccanico. È un approccio fondato sulla conoscenza, costruito sull'esperienza, guidato dall'attenzione alla persona.</p>
              <p className="text-[15px] md:text-[16px] leading-[1.8] text-anthracite/80 font-light">Ogni percorso inizia dalla comprensione: ascoltiamo, osserviamo, analizziamo. Solo dopo aver compreso la situazione nella sua complessità, proponiamo un piano di cura personalizzato.</p>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}

function MethodCTA() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <section className="py-24 md:py-32 lg:py-40 bg-ivory-warm">
      <div className="max-w-[900px] mx-auto px-6 md:px-10 lg:px-16 text-center" ref={ref}>
        <motion.div initial={{ width: 0 }} animate={inView ? { width: 50 } : {}} transition={{ duration: 1 }} className="h-[1px] bg-brass mx-auto mb-10" />
        <motion.h2 initial={{ opacity: 0, y: 25 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 1.2, ease: [0.25, 0.1, 0, 1], delay: 0.15 }} className="font-serif text-[30px] md:text-[38px] lg:text-[44px] font-light leading-[1.1] text-charcoal">Scopra il percorso<br />più adatto a Lei.</motion.h2>
        <motion.div initial={{ opacity: 0, y: 15 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 1, ease: [0.25, 0.1, 0, 1], delay: 0.35 }} className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-5">
          <Link to="/contatti" className="group inline-flex items-center gap-3 bg-charcoal text-ivory text-[12px] tracking-[0.2em] uppercase font-light px-10 py-4.5 hover:bg-deep transition-all duration-500">Prenota una consulenza <ArrowRight size={15} strokeWidth={1.5} className="transition-transform duration-500 group-hover:translate-x-1" /></Link>
          <Link to="/i-percorsi" className="inline-flex items-center gap-3 text-[12px] tracking-[0.2em] uppercase text-anthracite/70 font-light border border-anthracite/20 px-10 py-4.5 hover:border-anthracite/40 hover:text-anthracite transition-all duration-500">Esplora i percorsi</Link>
        </motion.div>
      </div>
    </section>
  );
}

export default function IlMetodoPage() {
  return (
    <>
      <PageHero label="Il Metodo" title="Sette pilastri.\nUn unico principio." subtitle="Un approccio fondato sulla conoscenza, costruito sull'esperienza, guidato dall'attenzione alla persona." image="/images/texture.jpg" />
      <MethodApproach />
      <Method />
      <CinematicBreak />
      <Signature />
      <MethodCTA />
    </>
  );
}
