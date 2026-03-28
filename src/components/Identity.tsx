import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef } from 'react';

export default function Identity() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section id="identita" className="py-32 md:py-48 lg:py-56 bg-ivory">
      <div className="max-w-[1400px] mx-auto px-6 md:px-10 lg:px-16" ref={ref}>
        <div className="grid lg:grid-cols-2 gap-16 lg:gap-24 items-center">
          {/* Text */}
          <div className="lg:pr-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 1.2, ease: [0.25, 0.1, 0, 1] }}
            >
              <span className="text-[11px] tracking-[0.35em] uppercase text-brass-muted font-light">
                La Maison
              </span>
              <div className="w-10 h-[1px] bg-brass mt-4 mb-8" />
            </motion.div>

            <motion.h2
              initial={{ opacity: 0, y: 25 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 1.2, ease: [0.25, 0.1, 0, 1], delay: 0.15 }}
              className="font-serif text-[32px] md:text-[40px] lg:text-[46px] font-light leading-[1.12] text-charcoal tracking-[0.01em]"
            >
              Non un salone.<br />
              Una visione della cura.
            </motion.h2>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 1.2, ease: [0.25, 0.1, 0, 1], delay: 0.3 }}
              className="mt-8 space-y-5"
            >
              <p className="text-[15px] md:text-[16px] leading-[1.8] text-anthracite/80 font-light">
                Luxosa nasce dalla convinzione che la bellezza autentica non si impone, si rivela. Ogni donna porta con sé una storia unica, un equilibrio personale, un'espressione che merita di essere compresa prima di essere valorizzata.
              </p>
              <p className="text-[15px] md:text-[16px] leading-[1.8] text-anthracite/80 font-light">
                Per questo non offriamo trattamenti standardizzati. Offriamo percorsi di cura costruiti su ascolto, analisi e personalizzazione: un approccio che unisce la competenza professionale più rigorosa alla sensibilità più attenta verso la persona.
              </p>
              <p className="text-[15px] md:text-[16px] leading-[1.8] text-anthracite/80 font-light">
                Luxosa è una maison italiana dove la cura di cute e capelli diventa scienza, metodo e accompagnamento.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 1.2, ease: [0.25, 0.1, 0, 1], delay: 0.5 }}
              className="mt-10 pt-8 border-t border-sand/60"
            >
              <p className="font-serif text-[20px] md:text-[22px] italic text-charcoal/70 font-light leading-relaxed">
                "La vera competenza non si dimostra. Si percepisce."
              </p>
            </motion.div>
          </div>

          {/* Image */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 1, delay: 0.3 }}
            className="relative"
          >
            <div className="aspect-[3/4] overflow-hidden">
              <img
                src="/images/woman-portrait-new.jpg"
                alt="La visione Luxosa"
                className="w-full h-full object-cover"
              />
            </div>
            {/* Decorative brass corner */}
            <div className="absolute -bottom-4 -left-4 w-20 h-20 border-l border-b border-brass/30" />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
