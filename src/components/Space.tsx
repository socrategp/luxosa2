import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';

export default function Space() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <section id="spazio" className="py-32 md:py-48 lg:py-56 bg-ivory">
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
            className="mt-6 text-[18px] md:text-[19px] leading-[1.8] text-anthracite/70 font-light"
          >
            Lo spazio Luxosa è un'estensione del metodo: ordine, armonia, luce e comfort.<br className="hidden md:block" />
            Ogni dettaglio è pensato per accogliere, proteggere e rigenerare.
          </motion.p>
        </div>

        {/* Images Grid */}
        <div className="grid md:grid-cols-2 gap-4 md:gap-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 1.2, ease: [0.25, 0.1, 0, 1], delay: 0.3 }}
            className="aspect-[4/3] overflow-hidden"
          >
            <img
              src="/images/spazio_luxosa.webp"
              alt="Lo spazio Luxosa"
              loading="lazy"
              decoding="async"
              className="w-full h-full object-cover hover:scale-105 transition-transform duration-1000"
            />
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 1.2, ease: [0.25, 0.1, 0, 1], delay: 0.45 }}
            className="aspect-[4/3] overflow-hidden"
          >
            <img
              src="/images/hero_esperienze.webp"
              alt="Dettaglio dello spazio"
              loading="lazy"
              decoding="async"
              className="w-full h-full object-cover hover:scale-105 transition-transform duration-1000"
            />
          </motion.div>
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
