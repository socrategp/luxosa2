import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { ArrowRight } from 'lucide-react';

export default function CTAFinal() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <section id="contatti" className="py-32 md:py-48 lg:py-56 bg-ivory-warm relative overflow-hidden">
      {/* Subtle background texture */}
      <div className="absolute inset-0 opacity-[0.03]">
        <div className="absolute inset-0" style={{
          backgroundImage: 'radial-gradient(circle at 1px 1px, var(--color-anthracite) 1px, transparent 0)',
          backgroundSize: '40px 40px'
        }} />
      </div>

      <div className="max-w-[900px] mx-auto px-6 md:px-10 lg:px-16 text-center relative" ref={ref}>
        <motion.div
          initial={{ width: 0 }}
          animate={inView ? { width: 50 } : {}}
          transition={{ duration: 1, delay: 0.1 }}
          className="h-[1px] bg-brass mx-auto mb-10"
        />

        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.9, delay: 0.2 }}
          className="font-serif text-[32px] md:text-[42px] lg:text-[52px] font-light leading-[1.1] text-charcoal tracking-[0.01em]"
        >
          Inizi da una consulenza.<br />
          Scopra il percorso più adatto a Lei.
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 15 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 1, ease: [0.25, 0.1, 0, 1], delay: 0.4 }}
          className="mt-8 text-[18px] md:text-[20px] leading-[1.8] text-anthracite/65 font-light max-w-xl mx-auto"
        >
          La prima consulenza è il momento in cui ascoltiamo, osserviamo e comprendiamo.
          È il primo passo di un percorso di cura pensato interamente per Lei.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 1, ease: [0.25, 0.1, 0, 1], delay: 0.55 }}
          className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-5"
        >
          <a
            href="#"
            className="group inline-flex items-center gap-3 bg-charcoal text-ivory text-[12px] tracking-[0.2em] uppercase font-light px-10 py-4.5 hover:bg-deep transition-all duration-500"
          >
            Prenota una consulenza
            <ArrowRight size={15} strokeWidth={1.5} className="transition-transform duration-500 group-hover:translate-x-1" />
          </a>
          <a
            href="#"
            className="inline-flex items-center gap-3 text-[12px] tracking-[0.2em] uppercase text-anthracite/70 font-light border border-anthracite/20 px-10 py-4.5 hover:border-anthracite/40 hover:text-anthracite transition-all duration-500"
          >
            Richiedi informazioni
          </a>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 1, ease: [0.25, 0.1, 0, 1], delay: 0.75 }}
          className="mt-16 pt-10 border-t border-sand/50"
        >
          <p className="font-serif text-[20px] md:text-[19px] italic text-charcoal/50 font-light">
            Si affidi a un metodo di cura pensato per Lei.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
