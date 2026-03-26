import Hero from '../components/Hero';
import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Ear, Search, Fingerprint, Heart } from 'lucide-react';

function HomeIdentity() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section className="py-28 md:py-36 lg:py-44 bg-ivory">
      <div className="max-w-[1400px] mx-auto px-6 md:px-10 lg:px-16" ref={ref}>
        <div className="grid lg:grid-cols-2 gap-16 lg:gap-24 items-center">
          <div className="lg:pr-8">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.8 }}>
              <span className="text-[11px] tracking-[0.35em] uppercase text-brass-muted font-light">La Maison</span>
              <div className="w-10 h-[1px] bg-brass mt-4 mb-8" />
            </motion.div>
            <motion.h2 initial={{ opacity: 0, y: 25 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.8, delay: 0.15 }} className="font-serif text-[32px] md:text-[40px] lg:text-[46px] font-light leading-[1.12] text-charcoal tracking-[0.01em]">
              Non un salone.<br />Una visione della cura.
            </motion.h2>
            <motion.div initial={{ opacity: 0, y: 20 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.8, delay: 0.3 }} className="mt-8 space-y-5">
              <p className="text-[15px] md:text-[16px] leading-[1.8] text-anthracite/80 font-light">Luxosa nasce dalla convinzione che la bellezza autentica non si impone, si rivela. Ogni donna porta con sé una storia unica, un equilibrio personale, un'espressione che merita di essere compresa prima di essere valorizzata.</p>
              <p className="text-[15px] md:text-[16px] leading-[1.8] text-anthracite/80 font-light">Per questo non offriamo trattamenti standardizzati. Offriamo percorsi di cura costruiti su ascolto, analisi e personalizzazione.</p>
            </motion.div>
            <motion.div initial={{ opacity: 0, y: 15 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.8, delay: 0.5 }} className="mt-10">
              <Link to="/la-maison" className="group inline-flex items-center gap-2 text-[12px] tracking-[0.18em] uppercase text-brass-muted font-light hover:text-brass transition-colors duration-500">
                Scopri la nostra visione <ArrowRight size={14} strokeWidth={1.5} className="transition-transform duration-500 group-hover:translate-x-1" />
              </Link>
            </motion.div>
          </div>
          <motion.div initial={{ opacity: 0, x: 30 }} animate={inView ? { opacity: 1, x: 0 } : {}} transition={{ duration: 1, delay: 0.3 }} className="relative">
            <div className="aspect-[3/4] overflow-hidden"><img src="/images/woman-portrait.jpg" alt="La visione Luxosa" className="w-full h-full object-cover" /></div>
            <div className="absolute -bottom-4 -left-4 w-20 h-20 border-l border-b border-brass/30" />
          </motion.div>
        </div>
      </div>
    </section>
  );
}

function HomeMethod() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });
  const highlights = [
    { icon: Ear, title: 'Ascolto', text: 'Comprensione profonda delle esigenze e della storia della persona.' },
    { icon: Search, title: 'Analisi', text: 'Indagine accurata dello stato di cute e capelli.' },
    { icon: Fingerprint, title: 'Personalizzazione', text: 'Ogni intervento disegnato su misura.' },
    { icon: Heart, title: 'Cura', text: 'Attenzione autentica al comfort e al benessere.' },
  ];

  return (
    <section className="py-28 md:py-36 lg:py-44 bg-ecru/50">
      <div className="max-w-[1400px] mx-auto px-6 md:px-10 lg:px-16" ref={ref}>
        <div className="text-center max-w-2xl mx-auto mb-16 md:mb-20">
          <motion.span initial={{ opacity: 0, y: 15 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.7 }} className="text-[11px] tracking-[0.35em] uppercase text-brass-muted font-light">Il Metodo</motion.span>
          <motion.div initial={{ width: 0 }} animate={inView ? { width: 40 } : {}} transition={{ duration: 0.8, delay: 0.2 }} className="h-[1px] bg-brass mx-auto mt-4 mb-8" />
          <motion.h2 initial={{ opacity: 0, y: 25 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.8, delay: 0.2 }} className="font-serif text-[32px] md:text-[40px] lg:text-[48px] font-light leading-[1.1] text-charcoal tracking-[0.01em]">Un approccio fondato<br />sulla conoscenza.</motion.h2>
          <motion.p initial={{ opacity: 0, y: 15 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.7, delay: 0.35 }} className="mt-6 text-[15px] md:text-[16px] leading-[1.8] text-anthracite/70 font-light">Il Metodo Luxosa guida ogni percorso attraverso sette pilastri, dalla prima consulenza al risultato.</motion.p>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-10">
          {highlights.map((h, i) => (
            <motion.div key={h.title} initial={{ opacity: 0, y: 25 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.7, delay: 0.2 + i * 0.1 }} className="text-center">
              <div className="w-14 h-14 rounded-full border border-brass/25 flex items-center justify-center mx-auto mb-5">
                <h.icon size={22} strokeWidth={1.2} className="text-brass-muted" />
              </div>
              <h3 className="font-serif text-[22px] font-light text-charcoal mb-2 tracking-wide">{h.title}</h3>
              <p className="text-[14px] leading-[1.75] text-anthracite/60 font-light">{h.text}</p>
            </motion.div>
          ))}
        </div>
        <motion.div initial={{ opacity: 0, y: 15 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.7, delay: 0.6 }} className="mt-16 text-center">
          <Link to="/il-metodo" className="group inline-flex items-center gap-2 text-[12px] tracking-[0.18em] uppercase text-brass-muted font-light hover:text-brass transition-colors duration-500">
            Scopri il metodo completo <ArrowRight size={14} strokeWidth={1.5} className="transition-transform duration-500 group-hover:translate-x-1" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}

function HomePercorsi() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });
  const percorsi = [
    { title: 'Equilibrio & Benessere della Cute', image: '/images/ritual.jpg' },
    { title: 'Cura & Bellezza del Capello', image: '/images/hair-back.jpg' },
    { title: 'Trasformazione Colore', image: '/images/transformation.jpg' },
  ];

  return (
    <section className="py-28 md:py-36 lg:py-44 bg-ivory">
      <div className="max-w-[1400px] mx-auto px-6 md:px-10 lg:px-16" ref={ref}>
        <div className="max-w-2xl mb-16 md:mb-20">
          <motion.span initial={{ opacity: 0, y: 15 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.7 }} className="text-[11px] tracking-[0.35em] uppercase text-brass-muted font-light">I Percorsi</motion.span>
          <motion.div initial={{ width: 0 }} animate={inView ? { width: 40 } : {}} transition={{ duration: 0.8, delay: 0.15 }} className="h-[1px] bg-brass mt-4 mb-8" />
          <motion.h2 initial={{ opacity: 0, y: 25 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.8, delay: 0.2 }} className="font-serif text-[32px] md:text-[40px] lg:text-[48px] font-light leading-[1.1] text-charcoal tracking-[0.01em]">Non servizi, ma percorsi<br />di accompagnamento.</motion.h2>
        </div>
        <div className="grid md:grid-cols-3 gap-6 md:gap-8">
          {percorsi.map((p, i) => (
            <motion.div key={p.title} initial={{ opacity: 0, y: 30 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.7, delay: 0.15 + i * 0.1 }} className="group">
              <Link to="/i-percorsi">
                <div className="aspect-[4/3] overflow-hidden mb-5"><img src={p.image} alt={p.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" /></div>
                <h3 className="font-serif text-[20px] md:text-[22px] font-light text-charcoal tracking-wide group-hover:text-brass-muted transition-colors duration-500">{p.title}</h3>
              </Link>
            </motion.div>
          ))}
        </div>
        <motion.div initial={{ opacity: 0, y: 15 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.7, delay: 0.5 }} className="mt-12">
          <Link to="/i-percorsi" className="group inline-flex items-center gap-2 text-[12px] tracking-[0.18em] uppercase text-brass-muted font-light hover:text-brass transition-colors duration-500">
            Tutti i percorsi <ArrowRight size={14} strokeWidth={1.5} className="transition-transform duration-500 group-hover:translate-x-1" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}

function HomeCTA() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <section className="py-28 md:py-36 lg:py-44 bg-ivory-warm relative overflow-hidden">
      <div className="absolute inset-0 opacity-[0.03]">
        <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, var(--color-anthracite) 1px, transparent 0)', backgroundSize: '40px 40px' }} />
      </div>
      <div className="max-w-[900px] mx-auto px-6 md:px-10 lg:px-16 text-center relative" ref={ref}>
        <motion.div initial={{ width: 0 }} animate={inView ? { width: 50 } : {}} transition={{ duration: 1, delay: 0.1 }} className="h-[1px] bg-brass mx-auto mb-10" />
        <motion.h2 initial={{ opacity: 0, y: 30 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.9, delay: 0.2 }} className="font-serif text-[32px] md:text-[42px] lg:text-[52px] font-light leading-[1.1] text-charcoal tracking-[0.01em]">Inizi da una consulenza.<br />Scopra il percorso più adatto a Lei.</motion.h2>
        <motion.p initial={{ opacity: 0, y: 15 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.7, delay: 0.4 }} className="mt-8 text-[15px] md:text-[17px] leading-[1.8] text-anthracite/65 font-light max-w-xl mx-auto">La prima consulenza è il momento in cui ascoltiamo, osserviamo e comprendiamo. È il primo passo di un percorso di cura pensato interamente per Lei.</motion.p>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.7, delay: 0.55 }} className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-5">
          <Link to="/contatti" className="group inline-flex items-center gap-3 bg-charcoal text-ivory text-[12px] tracking-[0.2em] uppercase font-light px-10 py-4.5 hover:bg-deep transition-all duration-500">
            Prenota una consulenza <ArrowRight size={15} strokeWidth={1.5} className="transition-transform duration-500 group-hover:translate-x-1" />
          </Link>
          <Link to="/sedi" className="inline-flex items-center gap-3 text-[12px] tracking-[0.2em] uppercase text-anthracite/70 font-light border border-anthracite/20 px-10 py-4.5 hover:border-anthracite/40 hover:text-anthracite transition-all duration-500">Le nostre sedi</Link>
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
      <HomeMethod />
      <HomePercorsi />
      <HomeCTA />
    </>
  );
}
