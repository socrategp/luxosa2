import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import PageHero from '../components/PageHero';
import Experience from '../components/Experience';
import Space from '../components/Space';

import { premiumEase } from '../lib/animations';

function EsperienzaIntro() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section className="py-32 md:py-48 lg:py-56 bg-ivory" ref={ref}>
      <div className="max-w-[1400px] mx-auto px-6 md:px-10 lg:px-16">
        <div className="max-w-3xl mx-auto text-center">
          <motion.span
            initial={{ opacity: 0, y: 15 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 1, ease: premiumEase }}
            className="text-[11px] tracking-[0.35em] uppercase text-brass-muted font-light"
          >
            L'Esperienza
          </motion.span>
          <motion.div
            initial={{ width: 0 }}
            animate={inView ? { width: 40 } : {}}
            transition={{ duration: 1.2, ease: premiumEase, delay: 0.15 }}
            className="h-[1px] bg-brass mx-auto mt-4 mb-8"
          />
          <motion.p
            initial={{ opacity: 0, y: 25 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 1.2, ease: premiumEase, delay: 0.25 }}
            className="text-[15px] md:text-[17px] leading-[1.85] text-anthracite/75 font-light"
          >
            Le esperienze Luxosa non sono voci di un listino. Sono i gesti attraverso cui il metodo prende forma, ciascuno con una propria identità, una propria intenzione, un proprio modo di prendersi cura di te.
          </motion.p>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 1.1, ease: premiumEase, delay: 0.4 }}
            className="mt-5 text-[15px] md:text-[17px] leading-[1.85] text-anthracite/75 font-light"
          >
            Qui trovi il mondo Luxosa come mappa di possibilità, non come catalogo.
          </motion.p>
        </div>
      </div>
    </section>
  );
}

function PricingNote() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <section className="py-12 md:py-16 bg-ivory" ref={ref}>
      <div className="max-w-[1400px] mx-auto px-6 md:px-10 lg:px-16">
        <motion.p
          initial={{ opacity: 0, y: 15 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 1, ease: premiumEase }}
          className="text-[14px] md:text-[15px] font-light italic text-anthracite/45 text-center max-w-2xl mx-auto leading-[1.8] border-t border-sand/50 pt-10"
        >
          I prezzi delle esperienze Luxosa sono disponibili su richiesta in sede. Ogni preventivo è personalizzato, perché ogni capello è diverso.
        </motion.p>
      </div>
    </section>
  );
}

function EsperienzaCTA() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section className="py-32 md:py-48 lg:py-64 bg-ivory-warm" ref={ref}>
      <div className="max-w-[900px] mx-auto px-6 md:px-10 lg:px-16 text-center">
        <motion.div initial={{ width: 0 }} animate={inView ? { width: 60 } : {}} transition={{ duration: 1.2, ease: premiumEase }} className="h-[1px] bg-brass mx-auto mb-12" />
        <motion.h2 initial={{ opacity: 0, y: 30 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 1.2, ease: premiumEase, delay: 0.2 }} className="font-serif text-[30px] md:text-[38px] lg:text-[44px] font-light leading-[1.12] text-charcoal">
          Prenota il tuo<br />primo incontro.
        </motion.h2>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 1, ease: premiumEase, delay: 0.4 }} className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-5">
          <Link to="/contatti" className="group relative overflow-hidden inline-flex items-center gap-3 bg-charcoal text-ivory text-[12px] tracking-[0.2em] uppercase font-light px-10 py-5">
            <span className="absolute inset-0 bg-deep translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-[cubic-bezier(0.25,0.1,0,1)]" />
            <span className="relative z-10 flex items-center gap-3">
              Prenota ora <ArrowRight size={15} strokeWidth={1.5} className="transition-transform duration-500 group-hover:translate-x-2" />
            </span>
          </Link>
          <Link to="/sedi" className="group inline-flex items-center gap-2 text-[12px] tracking-[0.18em] uppercase text-anthracite/50 font-light hover:text-anthracite transition-colors duration-500">
            Scopri dove trovarci <ArrowRight size={14} strokeWidth={1.5} className="transition-transform duration-500 group-hover:translate-x-2" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}

export default function EsperienzaPage() {
  return (
    <>
      <PageHero
        label="L'Esperienza"
        title="In Luxosa ogni gesto ha un nome."
        subtitle="Le esperienze Luxosa non sono voci di un listino. Sono i gesti attraverso cui il metodo prende forma, ciascuno con una propria intenzione."
        image="/images/care-hands-new.jpg"
      />
      <EsperienzaIntro />
      <Experience />
      <PricingNote />
      <Space />
      <EsperienzaCTA />
    </>
  );
}
