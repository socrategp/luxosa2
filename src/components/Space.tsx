import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';

export default function Space() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <section id="spazio" className="py-20 md:py-32 lg:py-40 bg-ivory">
      <div className="max-w-[1400px] mx-auto px-6 md:px-10 lg:px-16" ref={ref}>
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-16 md:mb-20">
          <motion.span
            initial={{ opacity: 0, y: 15 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 1, ease: [0.25, 0.1, 0, 1] }}
            className="text-[11px] tracking-[0.35em] uppercase text-brass-muted font-light"
          >
            Lo Spazio
          </motion.span>
          <motion.div
            initial={{ width: 0 }}
            animate={inView ? { width: 40 } : {}}
            transition={{ duration: 1.2, ease: [0.25, 0.1, 0, 1], delay: 0.15 }}
            className="h-[1px] bg-brass mx-auto mt-4 mb-8"
          />
          <motion.h2
            initial={{ opacity: 0, y: 25 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 1.2, ease: [0.25, 0.1, 0, 1], delay: 0.2 }}
            className="font-serif text-[32px] md:text-[40px] lg:text-[48px] font-light leading-[1.1] text-charcoal tracking-[0.01em]"
          >
            Un ambiente che parla<br />
            il linguaggio della cura.
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 1, ease: [0.25, 0.1, 0, 1], delay: 0.35 }}
            className="mt-6 text-[15px] md:text-[16px] leading-[1.8] text-anthracite/70 font-light"
          >
            Lo spazio Luxosa è un'estensione del metodo: ordine, armonia, luce e comfort.<br className="hidden md:block" />
            Ogni dettaglio è pensato per accogliere, proteggere e rigenerare.
          </motion.p>
        </div>

        {/* Images Grid — asimmetrico editoriale */}
        <div className="grid grid-cols-12 gap-4 md:gap-5">
          {/* Immagine grande sinistra — 7 colonne, portrait */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 1.2, ease: [0.25, 0.1, 0, 1], delay: 0.3 }}
            className="col-span-12 md:col-span-7 aspect-[3/2] md:aspect-auto md:h-[580px] overflow-hidden"
          >
            <img
              src="/images/space-new.jpg"
              alt="Lo spazio Luxosa"
              className="w-full h-full object-cover hover:scale-[1.04] transition-transform duration-[1200ms] ease-out"
            />
          </motion.div>

          {/* Stack destra — 5 colonne, due immagini */}
          <div className="col-span-12 md:col-span-5 flex flex-col gap-4 md:gap-5 md:h-[580px]">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 1.2, ease: [0.25, 0.1, 0, 1], delay: 0.45 }}
              className="flex-1 overflow-hidden"
            >
              <img
                src="/images/space-detail-new.jpg"
                alt="Dettaglio dello spazio"
                className="w-full h-full object-cover hover:scale-[1.04] transition-transform duration-[1200ms] ease-out"
              />
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 1.2, ease: [0.25, 0.1, 0, 1], delay: 0.6 }}
              className="flex-1 overflow-hidden"
            >
              <img
                src="/images/salon-reception-new.jpg"
                alt="Reception Luxosa"
                className="w-full h-full object-cover hover:scale-[1.04] transition-transform duration-[1200ms] ease-out"
              />
            </motion.div>
          </div>
        </div>

        {/* Atmosphere qualities */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 1.2, ease: [0.25, 0.1, 0, 1], delay: 0.6 }}
          className="mt-12 md:mt-16 flex flex-wrap justify-center gap-x-10 gap-y-4"
        >
          {['Ordine', 'Armonia', 'Luce', 'Comfort', 'Raffinatezza', 'Protezione'].map((q) => (
            <span
              key={q}
              className="text-[12px] tracking-[0.25em] uppercase text-stone font-light"
            >
              {q}
            </span>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
