import PageHero from '../components/PageHero';
import Space from '../components/Space';
import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, MapPin } from 'lucide-react';

import { premiumEase } from '../lib/animations';

const SEDI = [
  { label: 'Messina Cavour', to: '/sedi/messina-cavour', attiva: true },
];

function SediHeroCTA() {
  return (
    <div className="flex flex-col sm:flex-row items-start gap-3">
      <p className="text-[10px] tracking-[0.3em] uppercase text-white/50 font-light self-center sm:mr-2">
        Sedi attive
      </p>
      {SEDI.filter(s => s.attiva).map(sede => (
        <Link
          key={sede.to}
          to={sede.to}
          className="group inline-flex items-center gap-2.5 border border-white/25 hover:border-brass-light/70 text-white/90 hover:text-white text-[11px] tracking-[0.2em] uppercase font-light px-6 py-3 transition-all duration-500"
        >
          <MapPin size={11} strokeWidth={1.5} className="text-brass-light/70 group-hover:text-brass-light transition-colors duration-500" />
          {sede.label}
          <ArrowRight size={11} strokeWidth={1.5} className="transition-transform duration-500 group-hover:translate-x-1" />
        </Link>
      ))}
    </div>
  );
}

function SediManifesto() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <section className="py-32 md:py-48 lg:py-56 bg-ivory" ref={ref}>
      <div className="max-w-[1400px] mx-auto px-6 md:px-10 lg:px-16">
        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 1.4, ease: premiumEase, delay: 0.2 }}
          className="font-serif text-[24px] md:text-[32px] lg:text-[38px] font-light leading-[1.4] text-charcoal text-center max-w-4xl mx-auto"
        >
          Ogni sede Luxosa è un'estensione fedele del metodo. Lo stesso sistema, la stessa qualità, la stessa attenzione alla persona. Ovunque.
        </motion.p>
      </div>
    </section>
  );
}

function SediPrincipi() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });

  const principi = [
    { title: 'Metodo unico', text: "Ogni sede applica lo stesso Metodo Luxosa in tutto. La coerenza è un valore non negoziabile." },
    { title: 'Standard condivisi', text: "Prodotti, protocolli, formazione e qualità dell'esperienza sono identici in ogni sede." },
    { title: 'Spazio come metodo', text: "Ogni ambiente è progettato seguendo gli stessi principi: ordine, luce, materiali naturali, comfort." },
    { title: 'Team formato', text: "Ogni professionista condivide la stessa visione, la stessa formazione, lo stesso approccio alla cura." },
  ];

  return (
    <section className="py-20 md:py-28 lg:py-32 bg-ecru/30" ref={ref}>
      <div className="max-w-[1400px] mx-auto px-6 md:px-10 lg:px-16">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 1, ease: premiumEase }}
          className="mb-12"
        >
          <span className="text-[11px] tracking-[0.35em] uppercase text-brass-muted font-light">Il principio</span>
          <div className="h-[1px] w-10 bg-brass mt-4 mb-8" />
          <h2 className="font-serif text-[26px] md:text-[32px] font-light text-charcoal">Cosa accomuna ogni sede Luxosa.</h2>
        </motion.div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-8">
          {principi.map((p, i) => (
            <motion.div
              key={p.title}
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 1, ease: premiumEase, delay: 0.15 + i * 0.1 }}
            >
              <h3 className="font-serif text-[20px] md:text-[22px] font-light text-charcoal mb-3 tracking-wide">{p.title}</h3>
              <p className="text-[16px] md:text-[17px] leading-[1.8] text-anthracite/75 font-light">{p.text}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}


function SedeFlagship() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <section className="py-32 md:py-48 lg:py-56 bg-ivory" ref={ref}>
      <div className="max-w-[1400px] mx-auto px-6 md:px-10 lg:px-16">
        <div className="grid lg:grid-cols-[1fr_1fr] gap-16 lg:gap-24 items-start">
          {/* Left: content */}
          <div>
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 1, ease: premiumEase }}
            >
              <span className="text-[11px] tracking-[0.35em] uppercase text-brass-muted font-light">Sede Flagship</span>
              <div className="h-[1px] w-10 bg-brass mt-4 mb-8" />
            </motion.div>
            <motion.h2
              initial={{ opacity: 0, y: 25 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 1.2, ease: premiumEase, delay: 0.15 }}
              className="font-serif text-[34px] md:text-[44px] lg:text-[50px] font-light leading-[1.12] text-charcoal"
            >
              Luxosa Messina Cavour
            </motion.h2>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 1.1, ease: premiumEase, delay: 0.3 }}
              className="mt-8 space-y-4"
            >
              <p className="text-[17px] md:text-[18px] leading-[1.85] text-anthracite/85 font-light">
                Luxosa si trova a Messina, in zona Cavour.
                Questo spazio è stato scelto perché riflette il metodo Luxosa: raccolto, intenzionale, curato nei dettagli. Non grande per impressionare. Esatto per accogliere.
              </p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 1, ease: premiumEase, delay: 0.5 }}
              className="mt-10"
            >
              <Link
                to="/sedi/messina-cavour"
                className="group relative overflow-hidden inline-flex items-center gap-3 bg-charcoal text-ivory text-[12px] tracking-[0.2em] uppercase font-light px-10 py-5"
              >
                <span className="absolute inset-0 bg-deep translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-[cubic-bezier(0.25,0.1,0,1)]" />
                <span className="relative z-10 flex items-center gap-3">
                  Entra nella sede <ArrowRight size={15} strokeWidth={1.5} className="transition-transform duration-500 group-hover:translate-x-2" />
                </span>
              </Link>
            </motion.div>
          </div>

          {/* Right: photo sede */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 1.2, ease: premiumEase, delay: 0.2 }}
            className="relative group overflow-hidden aspect-[4/3]"
          >
            <img
              src="/images/messina-new.webp"
              alt="Luxosa Messina — Via Cavour"
              loading="lazy"
              decoding="async"
              className="w-full h-full object-cover object-left transition-transform duration-[15000ms] group-hover:scale-[1.04] ease-out"
            />
            <div className="absolute bottom-4 left-5">
              <span className="text-[10px] tracking-[0.3em] uppercase text-ivory/65 font-light">© Messina — Via Cavour</span>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

function VisioneReplicabile() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <section className="py-32 md:py-48 lg:py-56 bg-charcoal" ref={ref}>
      <div className="max-w-[900px] mx-auto px-6 md:px-10 lg:px-16 text-center">
        <motion.div
          initial={{ width: 0 }}
          animate={inView ? { width: 40 } : {}}
          transition={{ duration: 1.2, ease: premiumEase }}
          className="h-[1px] bg-brass-light/40 mx-auto mb-12"
        />
        <motion.h2
          initial={{ opacity: 0, y: 25 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 1.2, ease: premiumEase, delay: 0.2 }}
          className="font-serif text-[34px] md:text-[44px] lg:text-[50px] font-light text-ivory/95 leading-[1.12]"
        >
          Una visione pensata<br />per crescere.
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 1.1, ease: premiumEase, delay: 0.4 }}
          className="mt-8 text-[18px] leading-[1.85] text-ivory/60 font-light max-w-xl mx-auto"
        >
          Luxosa nasce con un sistema replicabile. Ogni nuova sede sarà un'estensione fedele del metodo, della qualità e dell'esperienza. La coerenza è il fondamento della crescita.
        </motion.p>
        <motion.p
          initial={{ opacity: 0, y: 15 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 1, ease: premiumEase, delay: 0.6 }}
          className="mt-8 text-[11px] tracking-[0.35em] uppercase text-brass-light/30 font-light"
        >
          Nuove sedi · Prossimamente · In arrivo
        </motion.p>
      </div>
    </section>
  );
}

export default function SediPage() {
  return (
    <>
      <PageHero
        label="Sedi"
        title="Entrare in Luxosa inizia già prima di sedersi."
        subtitle="Ogni sede Luxosa è un'estensione fedele del metodo: ordine, armonia, luce e comfort al servizio della persona."
        video="/videos/hero_sedi_opt.mp4"
      >
        <SediHeroCTA />
      </PageHero>
      <SediManifesto />
      <SediPrincipi />
      <Space />
      <SedeFlagship />
      <VisioneReplicabile />
    </>
  );
}
