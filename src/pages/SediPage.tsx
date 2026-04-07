import PageHero from '../components/PageHero';
import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

const premiumEase: [number, number, number, number] = [0.25, 0.1, 0, 1];

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
    { title: 'Team formato', text: "Ogni professionista condivide le stesse visione, la stessa formazione, lo stesso approccio alla cura." },
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
              <p className="text-[13px] md:text-[14px] leading-[1.8] text-anthracite/60 font-light">{p.text}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function MessinaImage() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <section ref={ref} className="relative overflow-hidden">
      <motion.div
        initial={{ opacity: 0 }}
        animate={inView ? { opacity: 1 } : {}}
        transition={{ duration: 1.2, ease: premiumEase }}
        className="relative aspect-[16/7] overflow-hidden"
      >
        <img
          src="/images/messina-new.jpg"
          alt="Messina — Via Cavour"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-deep/20" />
        <div className="absolute bottom-6 left-8">
          <span className="text-[10px] tracking-[0.3em] uppercase text-ivory/50 font-light">© Messina — Via Cavour</span>
        </div>
      </motion.div>
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
              className="font-serif text-[30px] md:text-[38px] lg:text-[44px] font-light leading-[1.12] text-charcoal"
            >
              Luxosa Messina Cavour
            </motion.h2>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 1.1, ease: premiumEase, delay: 0.3 }}
              className="mt-8 space-y-4"
            >
              <p className="text-[14px] md:text-[15px] leading-[1.85] text-anthracite/70 font-light">
                La prima sede Luxosa. Situata nel cuore di Messina, lungo la storica Via Cavour, rappresenta l'espressione più completa della visione Luxosa: un luogo dove la cura evoluta di cute e capelli incontra l'eleganza e la tradizione della Sicilia orientale.
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

          {/* Right: photos */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 1.2, ease: premiumEase, delay: 0.2 }}
            className="grid grid-cols-2 gap-4"
          >
            <div className="aspect-[3/4] overflow-hidden">
              <img src="/images/space-new.jpg" alt="Luxosa Messina" className="w-full h-full object-cover" />
            </div>
            <div className="aspect-[3/4] overflow-hidden mt-8">
              <img src="/images/space-detail-new.jpg" alt="Luxosa Messina dettaglio" className="w-full h-full object-cover" />
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
          className="font-serif text-[30px] md:text-[38px] lg:text-[44px] font-light text-ivory/85 leading-[1.12]"
        >
          Una visione pensata<br />per crescere.
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 1.1, ease: premiumEase, delay: 0.4 }}
          className="mt-8 text-[15px] leading-[1.85] text-ivory/45 font-light max-w-xl mx-auto"
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
        title="I luoghi della cura."
        subtitle="Ogni sede Luxosa è un'estensione fedele del metodo: ordine, armonia, luce e comfort al servizio della persona."
        image="/images/space-new.jpg"
      />
      <SediManifesto />
      <SediPrincipi />
      <MessinaImage />
      <SedeFlagship />
      <VisioneReplicabile />
    </>
  );
}
