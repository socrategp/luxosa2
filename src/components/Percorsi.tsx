import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';

import { premiumEase } from '../lib/animations';

const percorsi = [
  {
    num: '01',
    name: 'Equilibrio della Cute',
    focus: 'Salute del cuoio capelluto',
    desc: 'Per chi sente che tutto parte da lì e desidera restituire equilibrio alle fondamenta.',
    image: '/images/ritual-new.jpg',
  },
  {
    num: '02',
    name: 'Rinascita del Capello',
    focus: 'Struttura e idratazione',
    desc: 'Per chi vuole ricostruire forza, elasticità e luce in una fibra stanca o fragilizzata.',
    image: '/images/hair-back-new.jpg',
  },
  {
    num: '03',
    name: 'Armonia del Colore',
    focus: 'Colore e luminosità',
    desc: 'Per chi desidera un colore che non svanisca, ma evolva con cura e intelligenza.',
    image: '/images/transformation-new.jpg',
  },
  {
    num: '04',
    name: 'Armonia della Forma',
    focus: 'Volume, ricci, mossi, disciplina',
    desc: 'Per chi cerca la forma giusta del proprio capello e vuole valorizzarla senza snaturarla.',
    image: '/images/care-hands-new.jpg',
  },
  {
    num: '05',
    name: 'Rituale Luxosa',
    focus: 'Percorso completo',
    desc: "Per chi desidera l'esperienza Luxosa nella sua espressione più completa, personalizzata e immersiva.",
    image: '/images/space-new.jpg',
  },
  {
    num: '06',
    name: 'Continuità Luxosa',
    focus: 'Mantenimento nel tempo',
    desc: "Per chi ha già vissuto un percorso e vuole preservarne i risultati con costanza.",
    image: '/images/space-detail-new.jpg',
  },
];

export default function Percorsi() {
  return (
    <section className="py-32 md:py-48 lg:py-56 bg-ivory">
      <div className="max-w-[1400px] mx-auto px-6 md:px-10 lg:px-16">
        <div className="space-y-0">
          {percorsi.map((p, i) => (
            <PercorsoRow key={p.num} percorso={p} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}

function PercorsoRow({ percorso, index }: { percorso: typeof percorsi[0]; index: number }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });
  const imageLeft = index % 2 === 0;

  return (
    <div
      ref={ref}
      className="grid lg:grid-cols-2 gap-0 border-b border-sand/40 last:border-b-0"
    >
      {/* Image */}
      <motion.div
        initial={{ opacity: 0, x: imageLeft ? -20 : 20 }}
        animate={inView ? { opacity: 1, x: 0 } : {}}
        transition={{ duration: 1.2, ease: premiumEase, delay: 0.1 }}
        className={`relative group overflow-hidden aspect-[4/3] ${imageLeft ? 'lg:order-1' : 'lg:order-2'}`}
      >
        <img
          src={percorso.image}
          alt={percorso.name}
          className="w-full h-full object-cover transition-transform duration-[15000ms] group-hover:scale-[1.04] ease-out"
        />
        <div className="absolute inset-0 bg-deep/5 group-hover:bg-deep/0 transition-colors duration-700" />
      </motion.div>

      {/* Content */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 1.1, ease: premiumEase, delay: 0.2 }}
        className={`flex flex-col justify-center py-16 md:py-20 lg:py-0 ${imageLeft ? 'lg:order-2 lg:pl-20 xl:pl-28' : 'lg:order-1 lg:pr-20 xl:pr-28'}`}
      >
        <div className="text-[10px] tracking-[0.35em] uppercase text-brass-muted/60 font-light mb-4">{percorso.num}</div>
        <h3 className="font-serif text-[28px] md:text-[34px] lg:text-[38px] font-light text-charcoal leading-[1.1] tracking-[0.01em] mb-4">
          {percorso.name}
        </h3>
        <div className="h-[1px] w-8 bg-brass/50 mb-5" />
        <p className="text-[11px] tracking-[0.2em] uppercase text-brass-muted font-light mb-5">{percorso.focus}</p>
        <p className="text-[17px] md:text-[18px] leading-[1.85] text-anthracite/65 font-light max-w-sm">
          {percorso.desc}
        </p>
      </motion.div>
    </div>
  );
}
