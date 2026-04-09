import { motion, useInView, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import PageHero from '../components/PageHero';
import Method from '../components/Method';

import { premiumEase } from '../lib/animations';

function MethodIntro() {
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
            Il Metodo
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
            In Luxosa il risultato non nasce dall'intuizione del momento, ma da un metodo chiaro, professionale e costruito per accompagnarti nel tempo.
          </motion.p>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 1.1, ease: premiumEase, delay: 0.4 }}
            className="mt-5 text-[18px] md:text-[20px] leading-[1.85] text-anthracite/80 font-light"
          >
            Ogni donna entra in un sistema di lavoro che osserva, comprende, definisce una direzione e la sviluppa con continuità. Non una procedura rigida: un modo preciso di prendersi cura di te.
          </motion.p>
        </div>
      </div>
    </section>
  );
}

function MethodCinematic() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const y = useTransform(scrollYProgress, [0, 1], ['-8%', '8%']);
  const inView = useInView(ref, { once: true, margin: '-15%' });

  const words = ['"La', 'cura', 'autentica', 'inizia', "dall'ascolto.", 'Non', 'dalla', 'risposta."'];

  return (
    <section ref={ref} className="relative h-[70vh] min-h-[480px] overflow-hidden">
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

function PrimoIncontro() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section className="py-32 md:py-48 lg:py-56 bg-ivory" ref={ref}>
      <div className="max-w-[1400px] mx-auto px-6 md:px-10 lg:px-16">
        <div className="grid lg:grid-cols-2 gap-16 lg:gap-24 items-center">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 1.2, ease: premiumEase }}
            className="relative group order-2 lg:order-1"
          >
            <div className="aspect-[4/3] overflow-hidden">
              <img
                src="/images/consultation-new.jpg"
                alt="Il primo incontro"
                className="w-full h-full object-cover transition-transform duration-[15000ms] group-hover:scale-[1.04] ease-out"
              />
            </div>
            <div className="absolute -top-6 -right-6 w-20 h-20 border-t border-r border-brass/30" />
          </motion.div>

          <div className="order-1 lg:order-2">
            <motion.span
              initial={{ opacity: 0, y: 15 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 1, ease: premiumEase }}
              className="text-[11px] tracking-[0.35em] uppercase text-brass-muted font-light"
            >
              La consulenza Luxosa
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
              className="font-serif text-[30px] md:text-[38px] lg:text-[44px] font-light leading-[1.12] text-charcoal tracking-[0.01em]"
            >
              Il primo incontro.
            </motion.h2>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 1.1, ease: premiumEase, delay: 0.35 }}
              className="mt-8 space-y-5"
            >
              <p className="text-[18px] md:text-[19px] leading-[1.85] text-anthracite/75 font-light">
                Il primo incontro in Luxosa è un momento di conoscenza approfondita. Non una valutazione rapida, ma il tempo necessario per ascoltare la tua storia, osservare il tuo capello, capire le tue abitudini e chiarire dove desideri arrivare.
              </p>
              <p className="text-[18px] md:text-[19px] leading-[1.85] text-anthracite/75 font-light">
                Da qui nasce la direzione del percorso. Ogni informazione rilevante viene custodita e aggiornata nel tempo, così che nulla si perda tra una seduta e l'altra e ogni passo successivo abbia continuità.
              </p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 1, ease: premiumEase, delay: 0.55 }}
              className="mt-12 flex flex-col sm:flex-row gap-8"
            >
              <Link to="/i-percorsi" className="group inline-flex items-center gap-2 text-[12px] tracking-[0.18em] uppercase text-brass-muted font-light hover:text-brass transition-colors duration-500">
                Scopri i Percorsi <ArrowRight size={14} strokeWidth={1.5} className="transition-transform duration-500 group-hover:translate-x-2" />
              </Link>
              <Link to="/contatti" className="group inline-flex items-center gap-2 text-[12px] tracking-[0.18em] uppercase text-anthracite/50 font-light hover:text-anthracite transition-colors duration-500">
                Prenota il primo incontro <ArrowRight size={14} strokeWidth={1.5} className="transition-transform duration-500 group-hover:translate-x-2" />
              </Link>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}

function MetodoCTA() {
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
        </motion.div>
      </div>
    </section>
  );
}

export default function IlMetodoPage() {
  return (
    <>
      <PageHero
        label="Il Metodo"
        title="Ogni scelta nasce da una visione."
        subtitle="In Luxosa il risultato non nasce dall'intuizione del momento, ma da un metodo chiaro, professionale e costruito per accompagnarti nel tempo."
        image="/images/texture-new.jpg"
      />
      <MethodIntro />
      <Method />
      <MethodCinematic />
      <PrimoIncontro />
      <MetodoCTA />
    </>
  );
}
