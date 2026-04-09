import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';

import { premiumEase } from '../lib/animations';

const esperienze = [
  { name: 'Piega Lux', copy: `Non una semplice piega. Un gesto che nutre, valorizza e restituisce luce al capello nel suo miglior momento.` },
  { name: 'Taglio Signature', copy: `Un taglio che nasce dall'osservazione e dalla visione. Non routine, ma progetto.` },
  { name: 'Nuances', copy: `Il colore nella sua espressione più raffinata: luce, profondità e naturalezza.` },
  { name: 'Luce Signature', copy: `Schiariture costruite con precisione, per un risultato sofisticato e mai forzato.` },
  { name: 'RicciOsa', copy: `Il gesto dedicato al capello riccio quando definizione, elasticità e rispetto diventano una priorità.` },
  { name: 'RicciOso', copy: `Per mossi e wavy che cercano equilibrio, forma e durata.` },
  { name: 'Cheratina Pro', copy: `Per chi desidera ordine, morbidezza e controllo senza rinunciare al movimento.` },
  { name: 'Area Cura', copy: `Quando la salute del capello torna a essere il primo obiettivo.` },
  { name: 'Consulenza ColorLux', copy: `Un momento dedicato esclusivamente al colore, prima ancora di sceglierlo.` },
];

export default function Experience() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <section className="py-32 md:py-48 lg:py-56 bg-ivory" ref={ref}>
      <div className="max-w-[1400px] mx-auto px-6 md:px-10 lg:px-16">
        <div className="max-w-2xl mb-16 md:mb-20">
          <motion.span
            initial={{ opacity: 0, y: 15 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 1, ease: premiumEase }}
            className="text-[11px] tracking-[0.35em] uppercase text-brass-muted font-light"
          >
            Le esperienze
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
            transition={{ duration: 1.2, ease: premiumEase, delay: 0.2 }}
            className="text-[18px] md:text-[20px] leading-[1.85] text-anthracite/70 font-light"
          >
            Non le scegli come si sfoglia un menu. Le scopri insieme a noi, nel contesto del percorso che stai costruendo.
          </motion.p>
        </div>

        <div className="grid md:grid-cols-3 gap-x-10 gap-y-0">
          {esperienze.map((e, i) => (
            <motion.div
              key={e.name}
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 1, ease: premiumEase, delay: 0.2 + i * 0.07 }}
              className="border-t border-sand/50 py-8"
            >
              <h3 className="font-serif text-[22px] md:text-[24px] font-light text-charcoal mb-3 tracking-wide">{e.name}</h3>
              <p className="text-[17px] leading-[1.8] text-anthracite/60 font-light">{e.copy}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
