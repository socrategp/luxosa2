import PageHero from '../components/PageHero';
import Experience from '../components/Experience';
import Space from '../components/Space';
import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

function EsperienzaIntro() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <section className="py-20 md:py-32 lg:py-40 bg-ivory">
      <div className="max-w-[1000px] mx-auto px-6 md:px-10 lg:px-16 text-center" ref={ref}>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 1.2, ease: [0.25, 0.1, 0, 1] }}>
          <span className="text-[11px] tracking-[0.35em] uppercase text-brass-muted font-light">La Qualità dell'Esperienza</span>
          <div className="w-10 h-[1px] bg-brass mx-auto mt-4 mb-8" />
        </motion.div>
        <motion.h2 initial={{ opacity: 0, y: 25 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 1.2, ease: [0.25, 0.1, 0, 1], delay: 0.15 }} className="font-serif text-[30px] md:text-[38px] lg:text-[44px] font-light leading-[1.12] text-charcoal">
          Ogni dettaglio è pensato<br />per il suo benessere.
        </motion.h2>
        <motion.p initial={{ opacity: 0, y: 15 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 1, ease: [0.25, 0.1, 0, 1], delay: 0.3 }} className="mt-6 text-[15px] md:text-[16px] leading-[1.8] text-anthracite/70 font-light max-w-2xl mx-auto">
          L'esperienza Luxosa va oltre il trattamento. È un momento di cura autentica, dove la cliente viene accolta in uno spazio protetto, accompagnata con competenza e trattata con la sensibilità che merita.
        </motion.p>
      </div>
    </section>
  );
}

function EsperienzaCTA() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <section className="py-16 md:py-20 lg:py-40 bg-ivory-warm">
      <div className="max-w-[900px] mx-auto px-6 md:px-10 lg:px-16 text-center" ref={ref}>
        <motion.div initial={{ width: 0 }} animate={inView ? { width: 50 } : {}} transition={{ duration: 1 }} className="h-[1px] bg-brass mx-auto mb-10" />
        <motion.h2 initial={{ opacity: 0, y: 25 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 1.2, ease: [0.25, 0.1, 0, 1], delay: 0.15 }} className="font-serif text-[30px] md:text-[38px] lg:text-[44px] font-light leading-[1.1] text-charcoal">Viva l'esperienza Luxosa.</motion.h2>
        <motion.p initial={{ opacity: 0, y: 15 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 1, ease: [0.25, 0.1, 0, 1], delay: 0.3 }} className="mt-6 text-[15px] md:text-[16px] leading-[1.8] text-anthracite/65 font-light max-w-lg mx-auto">Si affidi a un metodo di cura pensato per Lei. Prenoti la sua prima consulenza.</motion.p>
        <motion.div initial={{ opacity: 0, y: 15 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 1, ease: [0.25, 0.1, 0, 1], delay: 0.45 }} className="mt-10">
          <Link to="/contatti" className="group inline-flex items-center gap-3 bg-charcoal text-ivory text-[12px] tracking-[0.2em] uppercase font-light px-10 py-4.5 hover:bg-deep transition-all duration-500">Prenota una consulenza <ArrowRight size={15} strokeWidth={1.5} className="transition-transform duration-500 group-hover:translate-x-1" /></Link>
        </motion.div>
      </div>
    </section>
  );
}

export default function EsperienzaPage() {
  return (
    <>
      <PageHero label="L'Esperienza" title="Sentirsi accolta,\ncompresa, guidata." subtitle="Ogni momento è pensato per far sentire la cliente al sicuro, vista e valorizzata." image="/images/care-hands-new.jpg" />
      <EsperienzaIntro />
      <Experience />
      <Space />
      <EsperienzaCTA />
    </>
  );
}
