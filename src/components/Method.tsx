import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { Ear, Search, Fingerprint, Route, RefreshCw, Heart, Sparkles } from 'lucide-react';

const pillars = [
  {
    icon: Ear,
    title: 'Ascolto',
    description: 'Ogni percorso inizia dalla comprensione profonda delle esigenze, della storia e delle aspettative della persona.',
  },
  {
    icon: Search,
    title: 'Analisi',
    description: 'Un\'indagine accurata dello stato di cute e capelli, per costruire una base di conoscenza solida e personalizzata.',
  },
  {
    icon: Fingerprint,
    title: 'Personalizzazione',
    description: 'Nessun protocollo standard. Ogni intervento viene disegnato su misura, rispettando l\'unicità della cliente.',
  },
  {
    icon: Route,
    title: 'Percorso',
    description: 'Non un singolo trattamento, ma un cammino strutturato verso il risultato desiderato, con tappe chiare e misurabili.',
  },
  {
    icon: RefreshCw,
    title: 'Continuità',
    description: 'La cura autentica richiede costanza. Accompagniamo la cliente nel tempo, adattando il percorso alla sua evoluzione.',
  },
  {
    icon: Heart,
    title: 'Cura',
    description: 'Attenzione autentica alla persona, al suo comfort, al suo benessere. Ogni gesto è pensato per proteggere e valorizzare.',
  },
  {
    icon: Sparkles,
    title: 'Risultato',
    description: 'Una bellezza che si rivela naturalmente, frutto di competenza, metodo e dedizione. Visibile, autentica, duratura.',
  },
];

export default function Method() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <section id="metodo" className="py-32 md:py-48 lg:py-56 bg-ecru/50">
      <div className="max-w-[1400px] mx-auto px-6 md:px-10 lg:px-16" ref={ref}>
        {/* Header — split: testo sinistra + immagine destra */}
        <div className="grid lg:grid-cols-2 gap-16 lg:gap-24 items-center mb-24 md:mb-32 lg:mb-40">
          <div>
            <motion.span
              initial={{ opacity: 0, y: 15 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 1, ease: [0.25, 0.1, 0, 1] }}
              className="text-[11px] tracking-[0.35em] uppercase text-brass-muted font-light"
            >
              Il Metodo
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
              className="font-serif text-[32px] md:text-[40px] lg:text-[48px] font-light leading-[1.1] text-charcoal tracking-[0.01em]"
            >
              Sette pilastri.<br />
              Un unico principio: la cura.
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 15 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 1, ease: [0.25, 0.1, 0, 1], delay: 0.35 }}
              className="mt-6 text-[15px] md:text-[16px] leading-[1.8] text-anthracite/70 font-light"
            >
              Il Metodo Luxosa non è una formula. È un approccio fondato sulla conoscenza, costruito sull'esperienza, guidato dall'attenzione alla persona.
            </motion.p>
          </div>
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 1, delay: 0.3 }}
            className="relative group"
          >
            <div className="aspect-[3/4] overflow-hidden">
              <img
                src="/images/consultation-new.jpg"
                alt="Il Metodo Luxosa"
                className="w-full h-full object-cover transition-transform duration-[1200ms] group-hover:scale-[1.04] ease-out"
                loading="lazy"
              />
            </div>
            <div className="absolute -bottom-4 -left-4 w-16 h-16 border-b border-l border-brass/25" />
          </motion.div>
        </div>

        {/* Pillars Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-x-10 gap-y-14 lg:gap-y-16">
          {pillars.map((pillar, i) => (
            <motion.div
              key={pillar.title}
              initial={{ opacity: 0, y: 25 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 1, ease: [0.25, 0.1, 0, 1], delay: 0.2 + i * 0.08 }}
              className={`group ${
                i === 6 ? 'md:col-span-2 lg:col-span-1 md:max-w-md md:mx-auto lg:max-w-none' : ''
              }`}
            >
              <div className="flex items-start gap-5">
                <div className="flex-shrink-0 w-12 h-12 rounded-full border border-brass/25 flex items-center justify-center group-hover:border-brass/50 transition-colors duration-500">
                  <pillar.icon size={20} strokeWidth={1.2} className="text-brass-muted" />
                </div>
                <div>
                  <h3 className="font-serif text-[22px] md:text-[24px] font-light text-charcoal mb-2 tracking-wide">
                    {pillar.title}
                  </h3>
                  <p className="text-[14px] md:text-[15px] leading-[1.75] text-anthracite/65 font-light">
                    {pillar.description}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Bottom Statement */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 1.2, ease: [0.25, 0.1, 0, 1], delay: 0.8 }}
          className="mt-20 md:mt-28 text-center"
        >
          <div className="inline-block border-t border-b border-sand/60 py-6 px-8 md:px-16">
            <p className="font-serif text-[18px] md:text-[21px] italic text-charcoal/65 font-light leading-relaxed">
              Da Luxosa, nulla è casuale, standard o improvvisato.<br className="hidden md:block" />
              Ogni scelta è il frutto di competenza, analisi e rispetto per la persona.
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
