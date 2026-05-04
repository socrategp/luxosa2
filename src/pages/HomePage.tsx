import Hero from '../components/Hero';
import { motion, useInView, useScroll, useTransform } from 'framer-motion';
import { useRef, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { PillarSection, TestimonialsCarousel } from '../components/Authority';
import LuxosaValuesRing from '../components/LuxosaValuesRing';

import { premiumEase } from '../lib/animations';

function HomeIdentity() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section className="py-32 md:py-48 lg:py-56 bg-ivory">
      <div className="max-w-[1400px] mx-auto px-6 md:px-10 lg:px-16" ref={ref}>
        <div className="grid lg:grid-cols-2 gap-16 lg:gap-24 items-center">
          <div className="lg:pr-8">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 1, ease: premiumEase }}>
              <span className="text-[11px] tracking-[0.35em] uppercase text-brass-muted font-light">La Maison</span>
              <div className="w-10 h-[1px] bg-brass mt-4 mb-8" />
            </motion.div>
            <motion.h2 initial={{ opacity: 0, y: 40 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 1.2, delay: 0.15, ease: premiumEase }} className="font-serif text-[34px] md:text-[44px] lg:text-[50px] font-light leading-[1.12] text-charcoal tracking-[0.01em]">
              Non un salone.<br />Una maison.
            </motion.h2>
            <motion.div initial={{ opacity: 0, y: 30 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 1.2, delay: 0.3, ease: premiumEase }} className="mt-8 space-y-5">
              <p className="text-[18px] md:text-[19px] leading-[1.85] text-anthracite/80 font-light">Luxosa nasce per offrire un modo diverso di vivere la cura dei capelli.</p>
              <p className="text-[18px] md:text-[19px] leading-[1.85] text-anthracite/80 font-light">Non un servizio isolato, non una scelta veloce, non una risposta standard. Un luogo in cui ogni donna viene accolta, ascoltata e accompagnata con attenzione.</p>
              <p className="text-[18px] md:text-[19px] leading-[1.85] text-anthracite/80 font-light">Ogni gesto, ogni consulenza, ogni percorso nasce da una visione precisa: valorizzare la persona, proteggere la qualità del capello e costruire risultati coerenti nel tempo.</p>
            </motion.div>
          </div>
          <motion.div initial={{ opacity: 0 }} animate={inView ? { opacity: 1 } : {}} transition={{ duration: 1.5, delay: 0.2 }} className="relative group">
            <motion.div initial={{ scale: 1.15 }} animate={inView ? { scale: 1 } : {}} transition={{ duration: 1.8, ease: premiumEase }} className="aspect-[3/4] overflow-hidden">
              <img src="/images/nosalone_unamaison.webp" alt="La visione Luxosa" loading="lazy" decoding="async" className="w-full h-full object-cover object-center transition-transform duration-[15000ms] group-hover:scale-[1.04] ease-out" />
            </motion.div>
            <div className="absolute -bottom-6 -left-6 w-24 h-24 border-l border-b border-brass/30" />
          </motion.div>
        </div>
      </div>
    </section>
  );
}

function PerChiE() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section className="py-32 md:py-48 lg:py-56 bg-ecru/40" ref={ref}>
      <div className="max-w-[1400px] mx-auto px-6 md:px-10 lg:px-16">
        <div className="max-w-3xl mx-auto text-center">
          <motion.div
            initial={{ width: 0 }}
            animate={inView ? { width: 40 } : {}}
            transition={{ duration: 1.2, ease: premiumEase }}
            className="h-[1px] bg-brass mx-auto mb-10"
          />
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 1.2, ease: premiumEase, delay: 0.2 }}
            className="font-serif text-[26px] md:text-[32px] lg:text-[38px] font-light leading-[1.3] text-charcoal tracking-[0.01em] mb-10"
          >
            Forse non si cerca un altro salone.
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 1.1, ease: premiumEase, delay: 0.35 }}
            className="text-[18px] md:text-[19px] leading-[1.85] text-anthracite/65 font-light"
          >
            Si cerca un luogo in cui non dover ricominciare ogni volta da zero. In cui il colore non sia un tentativo. In cui il taglio non perda senso dopo pochi giorni. In cui la cute venga ascoltata prima di essere trattata. In cui nessuno proponga quello che va di moda, ma ciò che ha davvero senso.
          </motion.p>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 1.1, ease: premiumEase, delay: 0.5 }}
            className="mt-6 text-[18px] md:text-[19px] leading-[1.85] text-anthracite/65 font-light"
          >
            Una cura che non si limiti all&apos;apparenza. Un luogo in cui il capello venga osservato con attenzione, il desiderio ascoltato con rispetto, ogni scelta costruita con metodo.
          </motion.p>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 1.1, ease: premiumEase, delay: 0.65 }}
            className="mt-6 text-[18px] md:text-[19px] leading-[1.85] text-anthracite/65 font-light"
          >
            Luxosa nasce per questo.
          </motion.p>
        </div>
      </div>
    </section>
  );
}

function Appartenenza() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <section className="py-32 md:py-48 lg:py-56 bg-charcoal" ref={ref}>
      <div className="max-w-[1400px] mx-auto px-6 md:px-10 lg:px-16">
        <div className="max-w-3xl">
          <motion.span
            initial={{ opacity: 0, y: 15 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 1, ease: premiumEase }}
            className="text-[11px] tracking-[0.35em] uppercase text-brass-light/60 font-light"
          >
            Appartenenza
          </motion.span>
          <motion.div
            initial={{ width: 0 }}
            animate={inView ? { width: 40 } : {}}
            transition={{ duration: 1.2, ease: premiumEase, delay: 0.15 }}
            className="h-[1px] bg-brass-light/40 mt-4 mb-10"
          />
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 1.2, ease: premiumEase, delay: 0.25 }}
            className="font-serif text-[26px] md:text-[32px] lg:text-[38px] font-light leading-[1.4] text-ivory/80 tracking-[0.01em]"
          >
            Ci sono luoghi che frequenti. E luoghi a cui senti di appartenere.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 1.1, ease: premiumEase, delay: 0.4 }}
            className="mt-8 space-y-5"
          >
            <p className="text-[18px] md:text-[19px] leading-[1.85] text-ivory/50 font-light">              Il vero potere è decidere di prendersi cura di sé. Non più tentativi, non più risposte uguali per tutte, non più la sensazione di dover ricominciare ogni volta da capo.</p>
            <p className="text-[18px] md:text-[19px] leading-[1.85] text-ivory/50 font-light">
              Qui ogni donna viene accolta con la sua storia, i suoi desideri, il suo tempo, la sua identità. È da lì che nasce il percorso. Ed è da lì che nasce anche la fiducia.
            </p>
            <p className="text-[18px] md:text-[19px] leading-[1.85] text-ivory/50 font-light">
              Chi sceglie Luxosa non cambia soltanto luogo. Cambia standard.
            </p>
          </motion.div>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 1.2, ease: premiumEase, delay: 0.7 }}
            className="mt-12 font-serif text-[28px] md:text-[34px] font-light text-brass-light italic"
          >
            Io sono Luxosa.
          </motion.p>
        </div>
      </div>
    </section>
  );
}

const TRIADE_PAYOFF = [
  {
    word: 'Ama',
    text: 'La cura come atto d’amore verso sé stessa.',
  },
  {
    word: 'Splendi',
    text: 'Il risultato come espressione naturale di ciò che si è.',
  },
  {
    word: 'Osa',
    text: 'La scelta di non accontentarsi più.',
  },
];

const TRIADE_DELAY = 2000;
const TRIADE_PAUSE = 2800;

function CinematicPayoff() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const y = useTransform(scrollYProgress, [0, 1], ['-8%', '8%']);
  const inView = useInView(ref, { once: false, margin: '-10%' });

  const [active, setActive] = useState(0);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);

  useEffect(() => {
    timers.current.forEach(clearTimeout);

    if (!inView) {
      setActive(0);
      return;
    }

    function cycle() {
      timers.current = [
        setTimeout(() => setActive(1), 300),
        setTimeout(() => setActive(2), 300 + TRIADE_DELAY),
        setTimeout(() => setActive(3), 300 + TRIADE_DELAY * 2),
        setTimeout(() => {
          setActive(0);
          timers.current = [setTimeout(cycle, 500)];
        }, 300 + TRIADE_DELAY * 2 + TRIADE_PAUSE),
      ];
    }

    cycle();
    return () => timers.current.forEach(clearTimeout);
  }, [inView]);

  return (
    <section ref={ref} data-cursor-dark className="relative h-[68vh] min-h-[480px] overflow-hidden">
      <motion.div className="absolute inset-0" style={{ y }}>
        <img
          src="/images/triade_femminile_sfondo.webp"
          alt=""
          loading="lazy"
          decoding="async"
          className="w-full h-[120%] -top-[10%] absolute object-cover object-center"
        />
      </motion.div>
      <div className="absolute inset-0 bg-gradient-to-b from-deep/60 via-deep/40 to-deep/80" />

      <div className="absolute top-0 left-0 right-0 z-20 pt-16 md:pt-20 text-center pointer-events-none">
        <p className="text-[11px] tracking-[0.35em] uppercase text-brass-light font-light drop-shadow-[0_1px_12px_rgba(0,0,0,1)]">
          La triade del femminile
        </p>
      </div>

      <div className="absolute inset-0 z-10 grid grid-cols-3">
        {TRIADE_PAYOFF.map((item, i) => {
          const isActive = active > i;
          return (
            <div
              key={item.word}
              className="relative overflow-hidden border-r border-ivory/10 last:border-r-0"
            >
              <motion.div
                className="absolute inset-0 bg-deep"
                animate={{ opacity: isActive ? 0.15 : 0.85 }}
                transition={{ duration: 1.8, ease: premiumEase }}
              />

              <div className="absolute inset-0 flex flex-col justify-center px-8 md:px-10 pt-24 pb-6">
                <h3 className="font-serif font-light leading-none tracking-[0.01em]">
                  <motion.span
                    className="block"
                    animate={{
                      color: isActive ? '#C4AE8C' : 'rgba(249,246,241,0.85)',
                    }}
                    transition={{ duration: 1.6, ease: premiumEase }}
                    style={{ fontSize: 'clamp(44px, 5vw, 64px)', display: 'block' }}
                  >
                    {item.word}.
                  </motion.span>
                </h3>

                <motion.div
                  className="h-[1px] bg-brass-light/40 mt-5 mb-5"
                  animate={{ width: isActive ? 32 : 0 }}
                  transition={{ duration: 1.2, ease: premiumEase, delay: 0.3 }}
                />

                <motion.p
                  className="text-[15px] md:text-[16px] leading-[1.85] text-ivory/70 font-light max-w-[260px]"
                  animate={{ opacity: isActive ? 1 : 0, y: isActive ? 0 : 16 }}
                  transition={{ duration: 1.2, ease: premiumEase, delay: 0.4 }}
                >
                  {item.text}
                </motion.p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}

function CioCheDiventa() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });

  const items = [
    { title: 'Presa in carico reale', text: 'Non una cliente tra tante. Una storia da leggere con attenzione.' },
    { title: 'Ascolto autentico', text: 'Ogni percorso inizia da ciò che si dice, da ciò che si mostra, da ciò che non si riesce ancora a spiegare.' },
    { title: 'Progetto chiaro', text: 'Una direzione definita, non un servizio scelto al momento.' },
    { title: 'Risultati duraturi', text: 'Non bellezza per un giorno. Bellezza costruita per restare.' },
    { title: 'Continuità professionale', text: 'Ogni seduta è una continuazione, non un nuovo inizio.' },
    { title: 'Eleganza sostanziale', text: 'Non scenografia. Qualità reale, visibile e percepita nel tempo.' },
  ];

  return (
    <section className="py-32 md:py-48 lg:py-56 bg-ivory" ref={ref}>
      <div className="max-w-[1400px] mx-auto px-6 md:px-10 lg:px-16">
        <div className="max-w-2xl mb-20 md:mb-28">
          <motion.span initial={{ opacity: 0, y: 15 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 1, ease: premiumEase }} className="text-[11px] tracking-[0.35em] uppercase text-brass-muted font-light">
            Ciò che diventa possibile
          </motion.span>
          <motion.div initial={{ width: 0 }} animate={inView ? { width: 40 } : {}} transition={{ duration: 1.2, ease: premiumEase, delay: 0.15 }} className="h-[1px] bg-brass mt-4 mb-8" />
          <motion.h2 initial={{ opacity: 0, y: 25 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 1.2, ease: premiumEase, delay: 0.2 }} className="font-serif text-[30px] md:text-[38px] lg:text-[44px] font-light leading-[1.12] text-charcoal">
            Ciò che diventa possibile<br />scegliendo Luxosa.
          </motion.h2>
        </div>
                <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 1.1, ease: premiumEase, delay: 0.35 }}
          className="mt-0 mb-16 md:mb-20 text-[18px] md:text-[19px] leading-[1.85] text-anthracite/65 font-light max-w-2xl"
        >
          In Luxosa ogni risultato nasce da un processo: ascolto, osservazione, progettazione e cura. Non si chiede di scegliere da soli davanti a un menu. Si viene accompagnati verso la direzione più coerente con il proprio capello, il proprio stile di vita e il risultato desiderato.
        </motion.p>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-x-12 gap-y-12 lg:gap-y-14">
          {items.map((item, i) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 25 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 1, ease: premiumEase, delay: 0.2 + i * 0.08 }}
              className="border-t border-sand/60 pt-7"
            >
              <h3 className="font-serif text-[20px] md:text-[22px] font-light text-charcoal mb-3 leading-snug tracking-wide">{item.title}</h3>
              <p className="text-[17px] md:text-[18px] leading-[1.8] text-anthracite/60 font-light">{item.text}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function HomeCTA() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section className="py-32 md:py-48 lg:py-64 bg-ivory-warm relative overflow-hidden">
      <div className="absolute inset-0 opacity-[0.04]">
        <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, var(--color-anthracite) 1px, transparent 0)', backgroundSize: '40px 40px' }} />
      </div>
      <div className="max-w-[900px] mx-auto px-6 md:px-10 lg:px-16 text-center relative z-10" ref={ref}>
        <motion.div initial={{ width: 0 }} animate={inView ? { width: 60 } : {}} transition={{ duration: 1.2, delay: 0.1, ease: premiumEase }} className="h-[1px] bg-brass mx-auto mb-12" />
        <motion.p initial={{ opacity: 0, y: 20 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 1, ease: premiumEase, delay: 0.2 }} className="text-[11px] tracking-[0.35em] uppercase text-brass-muted font-light mb-8">
          Il prossimo passo
        </motion.p>
        <motion.h2 initial={{ opacity: 0, y: 40 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 1.2, delay: 0.3, ease: premiumEase }} className="font-serif text-[30px] md:text-[38px] lg:text-[44px] font-light leading-[1.12] text-charcoal tracking-[0.01em]">
          Dopo aver conosciuto Luxosa,<br />il passo successivo è entrare nel metodo.
        </motion.h2>
        <motion.p initial={{ opacity: 0, y: 20 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 1, ease: premiumEase, delay: 0.45 }} className="mt-6 text-[18px] md:text-[19px] leading-[1.85] text-anthracite/60 font-light max-w-xl mx-auto">
          Il primo incontro è il punto di partenza per conoscere il mondo Luxosa e comprendere quale direzione può essere più adatta.
        </motion.p>
        <motion.div initial={{ opacity: 0, y: 30 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 1, delay: 0.5, ease: premiumEase }} className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-5">
          <Link to="/il-metodo" className="group relative overflow-hidden inline-flex items-center gap-3 bg-charcoal text-ivory text-[12px] tracking-[0.2em] uppercase font-light px-10 py-5 transition-shadow duration-500 hover:shadow-xl hover:shadow-deep/10">
            <span className="absolute inset-0 bg-deep translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-[cubic-bezier(0.25,0.1,0,1)]" />
            <span className="relative z-10 flex items-center gap-3">
              Scopri il Metodo <ArrowRight size={15} strokeWidth={1.5} className="transition-transform duration-500 group-hover:translate-x-2" />
            </span>
          </Link>
          <Link to="/i-percorsi" className="group relative overflow-hidden inline-flex items-center gap-3 text-[12px] tracking-[0.2em] uppercase text-anthracite/70 font-light border border-anthracite/20 px-10 py-5 bg-transparent transition-colors duration-300">
            <span className="absolute inset-0 bg-charcoal translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-[cubic-bezier(0.25,0.1,0,1)]" />
            <span className="relative z-10 group-hover:text-ivory transition-colors duration-300">Esplora i Percorsi</span>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}

export default function HomePage() {
  return (
    <>
      <Hero />
      <HomeIdentity />
      <PerChiE />
      <Appartenenza />
      <LuxosaValuesRing />
      <CinematicPayoff />
      <CioCheDiventa />
      <TestimonialsCarousel />
      <PillarSection />
      <HomeCTA />
    </>
  );
}
