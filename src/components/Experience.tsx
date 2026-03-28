import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { Clock, Eye, Shield, Leaf, Users, HeartHandshake } from 'lucide-react';

const qualities = [
  { icon: Eye, label: 'Ascolto attento', text: 'Ogni incontro inizia dalla comprensione autentica delle esigenze e dei desideri della persona.' },
  { icon: Clock, label: 'Tempo dedicato', text: 'Nessuna fretta. Ogni appuntamento ha il tempo necessario per garantire cura e risultato.' },
  { icon: Shield, label: 'Protezione', text: 'Protocolli pensati per proteggere cute e capelli, rispettando la loro natura e il loro equilibrio.' },
  { icon: Leaf, label: 'Ritualità', text: 'Ogni gesto è parte di un rituale di benessere, studiato per offrire comfort e rigenerazione.' },
  { icon: Users, label: 'Presenza', text: 'Un team formato e attento, che accompagna la cliente con competenza e sensibilità.' },
  { icon: HeartHandshake, label: 'Continuità', text: 'La relazione non termina con il trattamento. Ogni percorso prevede un accompagnamento nel tempo.' },
];

export default function Experience() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <section id="esperienza" className="py-32 md:py-48 lg:py-56 bg-ivory-warm">
      <div className="max-w-[1400px] mx-auto px-6 md:px-10 lg:px-16" ref={ref}>
        <div className="grid lg:grid-cols-5 gap-16 lg:gap-20">
          {/* Left: Image */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 1, delay: 0.2 }}
            className="lg:col-span-2 relative"
          >
            <div className="aspect-[3/4] overflow-hidden">
              <img
                src="/images/care-hands-new.jpg"
                alt="L'esperienza Luxosa"
                className="w-full h-full object-cover"
                loading="lazy"
              />
            </div>
            <div className="absolute -top-4 -right-4 w-16 h-16 border-t border-r border-brass/25" />
          </motion.div>

          {/* Right: Content */}
          <div className="lg:col-span-3">
            <motion.span
              initial={{ opacity: 0, y: 15 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 1, ease: [0.25, 0.1, 0, 1] }}
              className="text-[11px] tracking-[0.35em] uppercase text-brass-muted font-light"
            >
              L'Esperienza
            </motion.span>
            <motion.div
              initial={{ width: 0 }}
              animate={inView ? { width: 40 } : {}}
              transition={{ duration: 1.2, ease: [0.25, 0.1, 0, 1], delay: 0.15 }}
              className="h-[1px] bg-brass mt-4 mb-8"
            />
            <motion.h2
              initial={{ opacity: 0, y: 25 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 1.2, ease: [0.25, 0.1, 0, 1], delay: 0.2 }}
              className="font-serif text-[32px] md:text-[40px] lg:text-[46px] font-light leading-[1.12] text-charcoal tracking-[0.01em] mb-6"
            >
              Sentirsi accolta,<br />
              compresa, guidata.
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 15 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 1, ease: [0.25, 0.1, 0, 1], delay: 0.35 }}
              className="text-[15px] md:text-[16px] leading-[1.8] text-anthracite/70 font-light mb-12 max-w-lg"
            >
              L'esperienza Luxosa è costruita attorno alla persona. Ogni dettaglio — dall'accoglienza al congedo — è pensato per far sentire la cliente al sicuro, vista e valorizzata.
            </motion.p>

            {/* Qualities Grid */}
            <div className="grid sm:grid-cols-2 gap-8">
              {qualities.map((q, i) => (
                <motion.div
                  key={q.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={inView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.6, delay: 0.3 + i * 0.07 }}
                  className="flex items-start gap-4"
                >
                  <q.icon size={20} strokeWidth={1.2} className="text-brass-muted flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-[14px] tracking-[0.08em] uppercase font-medium text-charcoal mb-1">
                      {q.label}
                    </h4>
                    <p className="text-[13px] md:text-[14px] leading-[1.7] text-anthracite/55 font-light">
                      {q.text}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
