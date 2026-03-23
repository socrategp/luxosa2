import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { ArrowRight } from 'lucide-react';

const percorsi = [
  {
    title: 'Equilibrio & Benessere della Cute',
    description: 'Percorsi dedicati al riequilibrio del cuoio capelluto, alla prevenzione e al trattamento di sensibilità, secchezza, eccesso di sebo e micro-infiammazioni.',
    image: '/images/ritual-new.jpg',
  },
  {
    title: 'Cura & Bellezza del Capello',
    description: 'Programmi strutturati per restituire forza, elasticità e luminosità alla fibra capillare, rispettando la natura e la storia di ogni capello.',
    image: '/images/hair-back-new.jpg',
  },
  {
    title: 'Trasformazione Colore',
    description: 'Un approccio al colore fondato su analisi cromatica, rispetto della struttura e personalizzazione assoluta. Perché il colore giusto non si sceglie: si comprende.',
    image: '/images/transformation-new.jpg',
  },
  {
    title: 'Mantenimento Evoluto',
    description: 'Piani di cura continuativa per preservare e potenziare i risultati nel tempo, con protocolli adattivi e consulenze periodiche.',
    image: '/images/texture-new.jpg',
  },
  {
    title: 'Esperienze Signature',
    description: 'Rituali esclusivi che uniscono trattamento, benessere sensoriale e cura profonda in un\'esperienza unica e rigenerante.',
    image: '/images/care-hands-new.jpg',
  },
  {
    title: 'Percorsi Continuativi',
    description: 'Programmi a lungo termine costruiti sulla relazione e sulla fiducia, per accompagnare la cliente nella sua evoluzione personale.',
    image: '/images/consultation-new.jpg',
  },
];

export default function Percorsi() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <section id="percorsi" className="py-28 md:py-36 lg:py-44 bg-ivory">
      <div className="max-w-[1400px] mx-auto px-6 md:px-10 lg:px-16" ref={ref}>
        {/* Header */}
        <div className="max-w-2xl mb-16 md:mb-24">
          <motion.span
            initial={{ opacity: 0, y: 15 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7 }}
            className="text-[11px] tracking-[0.35em] uppercase text-brass-muted font-light"
          >
            I Percorsi
          </motion.span>
          <motion.div
            initial={{ width: 0 }}
            animate={inView ? { width: 40 } : {}}
            transition={{ duration: 0.8, delay: 0.15 }}
            className="h-[1px] bg-brass mt-4 mb-8"
          />
          <motion.h2
            initial={{ opacity: 0, y: 25 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="font-serif text-[32px] md:text-[40px] lg:text-[48px] font-light leading-[1.1] text-charcoal tracking-[0.01em]"
          >
            Non servizi, ma percorsi<br />
            di accompagnamento.
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.35 }}
            className="mt-6 text-[15px] md:text-[16px] leading-[1.8] text-anthracite/70 font-light"
          >
            Ogni area è pensata per rispondere a un'esigenza specifica, con la profondità e l'attenzione che ogni persona merita.
          </motion.p>
        </div>

        {/* Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {percorsi.map((p, i) => (
            <motion.div
              key={p.title}
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7, delay: 0.15 + i * 0.08 }}
              className="group cursor-pointer"
            >
              <div className="aspect-[4/3] overflow-hidden mb-5">
                <img
                  src={p.image}
                  alt={p.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
              </div>
              <h3 className="font-serif text-[20px] md:text-[22px] font-light text-charcoal tracking-wide mb-2">
                {p.title}
              </h3>
              <p className="text-[14px] leading-[1.75] text-anthracite/60 font-light mb-4">
                {p.description}
              </p>
              <span className="inline-flex items-center gap-2 text-[12px] tracking-[0.15em] uppercase text-brass-muted font-light group-hover:text-brass transition-colors duration-500">
                Scopri di più
                <ArrowRight size={14} strokeWidth={1.5} className="transition-transform duration-500 group-hover:translate-x-1" />
              </span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
