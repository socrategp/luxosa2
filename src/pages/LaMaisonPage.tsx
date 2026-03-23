import PageHero from '../components/PageHero';
import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import Authority from '../components/Authority';

function MaisonVision() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <section className="py-28 md:py-36 bg-ivory">
      <div className="max-w-[1400px] mx-auto px-6 md:px-10 lg:px-16" ref={ref}>
        <div className="grid lg:grid-cols-2 gap-16 lg:gap-24 items-center">
          <div>
            <motion.div initial={{ opacity: 0, y: 20 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.8 }}>
              <span className="text-[11px] tracking-[0.35em] uppercase text-brass-muted font-light">La Nostra Visione</span>
              <div className="w-10 h-[1px] bg-brass mt-4 mb-8" />
            </motion.div>
            <motion.h2 initial={{ opacity: 0, y: 25 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.8, delay: 0.15 }} className="font-serif text-[30px] md:text-[38px] lg:text-[44px] font-light leading-[1.12] text-charcoal tracking-[0.01em]">
              La bellezza autentica<br />non si impone. Si rivela.
            </motion.h2>
            <motion.div initial={{ opacity: 0, y: 20 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.8, delay: 0.3 }} className="mt-8 space-y-5">
              <p className="text-[15px] md:text-[16px] leading-[1.8] text-anthracite/80 font-light">Luxosa nasce dalla convinzione che ogni donna porta con sé una storia unica, un equilibrio personale, un'espressione che merita di essere compresa prima di essere valorizzata.</p>
              <p className="text-[15px] md:text-[16px] leading-[1.8] text-anthracite/80 font-light">Per questo non offriamo trattamenti standardizzati. Offriamo percorsi di cura costruiti su ascolto, analisi e personalizzazione: un approccio che unisce la competenza professionale più rigorosa alla sensibilità più attenta verso la persona.</p>
              <p className="text-[15px] md:text-[16px] leading-[1.8] text-anthracite/80 font-light">Luxosa è una maison italiana dove la cura di cute e capelli diventa scienza, metodo e accompagnamento. Un luogo in cui la bellezza viene affrontata con intelligenza, sensibilità e metodo.</p>
            </motion.div>
          </div>
          <motion.div initial={{ opacity: 0, x: 30 }} animate={inView ? { opacity: 1, x: 0 } : {}} transition={{ duration: 1, delay: 0.3 }} className="relative">
            <div className="aspect-[3/4] overflow-hidden"><img src="/images/woman-portrait-new.jpg" alt="La visione Luxosa" className="w-full h-full object-cover" /></div>
            <div className="absolute -bottom-4 -left-4 w-20 h-20 border-l border-b border-brass/30" />
          </motion.div>
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
    <section className="py-28 md:py-36 bg-ecru/50">
      <div className="max-w-[1400px] mx-auto px-6 md:px-10 lg:px-16" ref={ref}>
        <div className="text-center max-w-2xl mx-auto mb-16 md:mb-20">
          <motion.span initial={{ opacity: 0, y: 15 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.7 }} className="text-[11px] tracking-[0.35em] uppercase text-brass-muted font-light">I Nostri Valori</motion.span>
          <motion.div initial={{ width: 0 }} animate={inView ? { width: 40 } : {}} transition={{ duration: 0.8, delay: 0.15 }} className="h-[1px] bg-brass mx-auto mt-4 mb-8" />
          <motion.h2 initial={{ opacity: 0, y: 25 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.8, delay: 0.2 }} className="font-serif text-[30px] md:text-[38px] lg:text-[44px] font-light leading-[1.1] text-charcoal">I principi che guidano<br />ogni nostra scelta.</motion.h2>
        </div>
        <div className="grid md:grid-cols-2 gap-10 lg:gap-14">
          {values.map((v, i) => (
            <motion.div key={v.title} initial={{ opacity: 0, y: 25 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.7, delay: 0.2 + i * 0.1 }} className="border-t border-sand/60 pt-8">
              <h3 className="font-serif text-[24px] font-light text-charcoal mb-3 tracking-wide">{v.title}</h3>
              <p className="text-[14px] md:text-[15px] leading-[1.8] text-anthracite/65 font-light">{v.text}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function MaisonQuote() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <section className="py-24 md:py-32 bg-ivory">
      <div className="max-w-[900px] mx-auto px-6 md:px-10 lg:px-16 text-center" ref={ref}>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.8 }}>
          <div className="inline-block border-t border-b border-sand/60 py-8 px-6 md:px-16">
            <p className="font-serif text-[20px] md:text-[24px] italic text-charcoal/65 font-light leading-relaxed">"La vera competenza non si dimostra. Si percepisce.<br className="hidden md:block" />E si traduce in fiducia, risultato e benessere."</p>
          </div>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 15 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.7, delay: 0.3 }} className="mt-12">
          <Link to="/il-metodo" className="group inline-flex items-center gap-2 text-[12px] tracking-[0.18em] uppercase text-brass-muted font-light hover:text-brass transition-colors duration-500">
            Scopri il nostro metodo <ArrowRight size={14} strokeWidth={1.5} className="transition-transform duration-500 group-hover:translate-x-1" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}

export default function LaMaisonPage() {
  return (
    <>
      <PageHero label="La Maison" title="Chi è Luxosa." subtitle="Una maison italiana dedicata alla trasformazione della donna attraverso percorsi evoluti di cura, benessere e bellezza." image="/images/consultation-new.jpg" />
      <MaisonVision />
      <MaisonValues />
      <Authority />
      <MaisonQuote />
    </>
  );
}
