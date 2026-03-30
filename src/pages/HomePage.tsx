import Hero from '../components/Hero';
import { motion, useInView, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Ear, Search, Fingerprint, Heart } from 'lucide-react';
import Authority from '../components/Authority';

const premiumEase: [number, number, number, number] = [0.25, 0.1, 0, 1];

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
              Non un salone.<br />Una visione della cura.
            </motion.h2>
            <motion.div initial={{ opacity: 0, y: 30 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 1.2, delay: 0.3, ease: premiumEase }} className="mt-8 space-y-5">
              <p className="text-[15px] md:text-[16px] leading-[1.85] text-anthracite/80 font-light">Luxosa nasce dalla convinzione che la bellezza autentica non si impone, si rivela. Ogni donna porta con sé una storia unica, un equilibrio personale, un'espressione che merita di essere compresa prima di essere valorizzata.</p>
              <p className="text-[15px] md:text-[16px] leading-[1.85] text-anthracite/80 font-light">Per questo non offriamo trattamenti standardizzati. Offriamo percorsi di cura costruiti su ascolto, analisi e personalizzazione.</p>
            </motion.div>
            <motion.div initial={{ opacity: 0, y: 20 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 1, delay: 0.45, ease: premiumEase }} className="mt-12">
              <Link to="/la-maison" className="group inline-flex items-center gap-2 text-[12px] tracking-[0.18em] uppercase text-brass-muted font-light hover:text-brass transition-colors duration-500">
                Scopri la nostra visione <ArrowRight size={14} strokeWidth={1.5} className="transition-transform duration-500 group-hover:translate-x-2" />
              </Link>
            </motion.div>
          </div>
          <motion.div initial={{ opacity: 0 }} animate={inView ? { opacity: 1 } : {}} transition={{ duration: 1.5, delay: 0.2 }} className="relative group">
            <motion.div initial={{ scale: 1.15 }} animate={inView ? { scale: 1 } : {}} transition={{ duration: 1.8, ease: premiumEase }} className="aspect-[3/4] overflow-hidden">
                <img src="/images/woman-portrait.jpg" alt="La visione Luxosa" className="w-full h-full object-cover transition-transform duration-[15s] group-hover:scale-110 ease-out" />
            </motion.div>
            <div className="absolute -bottom-6 -left-6 w-24 h-24 border-l border-b border-brass/30" />
          </motion.div>
        </div>
      </div>
    </section>
  );
}

function CinematicBreak() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const y = useTransform(scrollYProgress, [0, 1], ['-8%', '8%']);
  const inView = useInView(ref, { once: true, margin: '-15%' });

  return (
    <section ref={ref} className="relative h-[70vh] min-h-[480px] max-h-[720px] overflow-hidden">
      <motion.div className="absolute inset-0" style={{ y }}>
        <img
          src="/images/consultation-new.jpg"
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
            "La vera competenza<br />non si dimostra.<br />
            <em className="text-brass-light not-italic">Si percepisce.</em>"
          </motion.p>
        </div>
      </div>
    </section>
  );
}

function MaisonValues() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });
  const values = [
    { title: 'Competenza', text: 'Una conoscenza profonda di cute e capelli, aggiornata costantemente con i più avanzati protocolli del settore.' },
    { title: 'Personalizzazione', text: 'Nessun percorso è uguale a un altro. Ogni scelta nasce dall\'unicità della persona che abbiamo di fronte.' },
    { title: 'Accompagnamento', text: 'La relazione con la cliente non si esaurisce in un appuntamento. È un percorso continuo di cura e attenzione.' },
    { title: 'Integrità', text: 'Trasparenza, onestà e rispetto guidano ogni nostra azione. La fiducia si costruisce con i fatti.' },
  ];

  return (
    <section className="py-32 md:py-48 lg:py-56 bg-ecru/50">
      <div className="max-w-[1400px] mx-auto px-6 md:px-10 lg:px-16" ref={ref}>
        <div className="text-center max-w-2xl mx-auto mb-16 md:mb-20">
          <motion.span initial={{ opacity: 0, y: 15 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 1, ease: premiumEase }} className="text-[11px] tracking-[0.35em] uppercase text-brass-muted font-light">I Nostri Valori</motion.span>
          <motion.div initial={{ width: 0 }} animate={inView ? { width: 40 } : {}} transition={{ duration: 1.2, ease: premiumEase, delay: 0.15 }} className="h-[1px] bg-brass mx-auto mt-4 mb-8" />
          <motion.h2 initial={{ opacity: 0, y: 25 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 1.2, ease: premiumEase, delay: 0.2 }} className="font-serif text-[34px] md:text-[46px] lg:text-[56px] font-light leading-[1.08] text-charcoal">I principi che guidano<br />ogni nostra scelta.</motion.h2>
        </div>
        <div className="grid md:grid-cols-2 gap-10 lg:gap-14">
          {values.map((v, i) => (
            <motion.div key={v.title} initial={{ opacity: 0, y: 25 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 1, ease: premiumEase, delay: 0.2 + i * 0.1 }} className="border-t border-sand/60 pt-8">
              <h3 className="font-serif text-[24px] font-light text-charcoal mb-3 tracking-wide">{v.title}</h3>
              <p className="text-[14px] md:text-[15px] leading-[1.8] text-anthracite/65 font-light">{v.text}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}


function HomeMethod() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-100px' });
  const highlights = [
    { icon: Ear, title: 'Ascolto', text: 'Comprensione profonda delle esigenze e della storia della persona.' },
    { icon: Search, title: 'Analisi', text: 'Indagine accurata dello stato di cute e capelli.' },
    { icon: Fingerprint, title: 'Personalizzazione', text: 'Ogni intervento disegnato su misura.' },
    { icon: Heart, title: 'Cura', text: 'Attenzione autentica al comfort e al benessere.' },
  ];

  return (
    <section className="py-32 md:py-48 lg:py-56 bg-ecru/50">
      <div className="max-w-[1400px] mx-auto px-6 md:px-10 lg:px-16" ref={ref}>
        <div className="text-center max-w-2xl mx-auto mb-20 md:mb-28">
          <motion.span initial={{ opacity: 0, y: 20 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 1, ease: premiumEase }} className="text-[11px] tracking-[0.35em] uppercase text-brass-muted font-light">Il Metodo</motion.span>
          <motion.div initial={{ width: 0 }} animate={inView ? { width: 50 } : {}} transition={{ duration: 1.2, delay: 0.2, ease: premiumEase }} className="h-[1px] bg-brass mx-auto mt-5 mb-10" />
          <motion.h2 initial={{ opacity: 0, y: 40 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 1.2, delay: 0.25, ease: premiumEase }} className="font-serif text-[34px] md:text-[44px] lg:text-[50px] font-light leading-[1.12] text-charcoal tracking-[0.01em]">Un approccio fondato<br />sulla conoscenza.</motion.h2>
          <motion.p initial={{ opacity: 0, y: 30 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 1, delay: 0.4, ease: premiumEase }} className="mt-8 text-[15px] md:text-[17px] leading-[1.8] text-anthracite/70 font-light">Il Metodo Luxosa guida ogni percorso attraverso sette pilastri, dalla prima consulenza al risultato.</motion.p>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-10">
          {highlights.map((h, i) => (
            <motion.div key={h.title} initial={{ opacity: 0, y: 35 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 1, delay: 0.3 + i * 0.15, ease: premiumEase }} className="text-center">
              <div className="w-16 h-16 rounded-full border border-brass/25 flex items-center justify-center mx-auto mb-6 bg-ivory/40">
                <h.icon size={24} strokeWidth={1} className="text-brass-muted" />
              </div>
              <h3 className="font-serif text-[24px] font-light text-charcoal mb-3 tracking-wide">{h.title}</h3>
              <p className="text-[14px] leading-[1.8] text-anthracite/60 font-light px-2">{h.text}</p>
            </motion.div>
          ))}
        </div>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 1, delay: 0.8, ease: premiumEase }} className="mt-20 text-center">
          <Link to="/il-metodo" className="group inline-flex items-center gap-2 text-[12px] tracking-[0.18em] uppercase text-brass-muted font-light hover:text-brass transition-colors duration-500">
            Scopri il metodo completo <ArrowRight size={14} strokeWidth={1.5} className="transition-transform duration-500 group-hover:translate-x-2" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}

function HomePercorsi() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-100px' });
  const percorsi = [
    { title: 'Equilibrio & Benessere della Cute', image: '/images/ritual.jpg' },
    { title: 'Cura & Bellezza del Capello', image: '/images/hair-back.jpg' },
    { title: 'Trasformazione Colore', image: '/images/transformation.jpg' },
  ];

  return (
    <section className="py-32 md:py-48 lg:py-56 bg-ivory">
      <div className="max-w-[1400px] mx-auto px-6 md:px-10 lg:px-16" ref={ref}>
        <div className="max-w-2xl mb-20 md:mb-28">
          <motion.span initial={{ opacity: 0, y: 20 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 1, ease: premiumEase }} className="text-[11px] tracking-[0.35em] uppercase text-brass-muted font-light">I Percorsi</motion.span>
          <motion.div initial={{ width: 0 }} animate={inView ? { width: 50 } : {}} transition={{ duration: 1.2, delay: 0.15, ease: premiumEase }} className="h-[1px] bg-brass mt-5 mb-10" />
          <motion.h2 initial={{ opacity: 0, y: 40 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 1.2, delay: 0.25, ease: premiumEase }} className="font-serif text-[34px] md:text-[44px] lg:text-[50px] font-light leading-[1.12] text-charcoal tracking-[0.01em]">Non servizi, ma percorsi<br />di accompagnamento.</motion.h2>
        </div>
        <div className="grid md:grid-cols-3 gap-8 md:gap-12">
          {percorsi.map((p, i) => (
            <motion.div key={p.title} initial={{ opacity: 0, y: 50 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 1.2, delay: 0.2 + i * 0.15, ease: premiumEase }} className="group">
              <Link to="/i-percorsi" className="block w-full">
                <div className="aspect-[4/5] overflow-hidden mb-6 relative">
                    <div className="absolute inset-0 bg-deep/10 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
                    <img src={p.image} alt={p.title} className="w-full h-full object-cover transition-transform duration-[15s] group-hover:scale-110 ease-out" />
                </div>
                <h3 className="font-serif text-[22px] md:text-[24px] font-light text-charcoal tracking-wide group-hover:text-brass transition-colors duration-500 leading-snug">{p.title}</h3>
              </Link>
            </motion.div>
          ))}
        </div>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 1, delay: 0.6, ease: premiumEase }} className="mt-16">
          <Link to="/i-percorsi" className="group inline-flex items-center gap-2 text-[12px] tracking-[0.18em] uppercase text-brass-muted font-light hover:text-brass transition-colors duration-500">
            Tutti i percorsi <ArrowRight size={14} strokeWidth={1.5} className="transition-transform duration-500 group-hover:translate-x-2" />
          </Link>
        </motion.div>
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
        <motion.h2 initial={{ opacity: 0, y: 40 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 1.2, delay: 0.2, ease: premiumEase }} className="font-serif text-[34px] md:text-[44px] lg:text-[50px] font-light leading-[1.12] text-charcoal tracking-[0.01em]">Inizi da una consulenza.<br />Scopra il percorso più adatto a Lei.</motion.h2>
        <motion.p initial={{ opacity: 0, y: 30 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 1, delay: 0.4, ease: premiumEase }} className="mt-10 text-[15px] md:text-[17px] leading-[1.8] text-anthracite/65 font-light max-w-2xl mx-auto">La prima consulenza è il momento in cui ascoltiamo, osserviamo e comprendiamo. È il primo passo di un percorso di cura pensato interamente per Lei.</motion.p>
        <motion.div initial={{ opacity: 0, y: 30 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 1, delay: 0.55, ease: premiumEase }} className="mt-16 flex flex-col sm:flex-row items-center justify-center gap-6">
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} transition={{ type: "spring", stiffness: 400, damping: 25 }}>
              <Link to="/contatti" className="group inline-flex items-center gap-3 bg-charcoal text-ivory text-[12px] tracking-[0.2em] uppercase font-light px-10 py-5 hover:bg-deep shadow-xl shadow-deep/10 hover:shadow-2xl hover:shadow-deep/20 transition-all duration-500">
                Prenota una consulenza <ArrowRight size={15} strokeWidth={1.5} className="transition-transform duration-500 group-hover:translate-x-2" />
              </Link>
          </motion.div>
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} transition={{ type: "spring", stiffness: 400, damping: 25 }}>
              <Link to="/sedi" className="inline-flex items-center gap-3 text-[12px] tracking-[0.2em] uppercase text-anthracite/70 font-light border border-anthracite/20 px-10 py-5 hover:border-anthracite/40 hover:text-anthracite transition-all duration-500 bg-transparent">Le nostre sedi</Link>
          </motion.div>
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
      <CinematicBreak />
      <MaisonValues />
      <Authority />
      <HomeMethod />
      <HomePercorsi />
      <HomeCTA />
    </>
  );
}
