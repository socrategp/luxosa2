import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { Award, BookOpen, Microscope, Star } from 'lucide-react';

const proofs = [
  {
    icon: Microscope,
    title: 'Approccio Consulenziale',
    text: 'Ogni percorso nasce da una consulenza approfondita: analisi dello stato di cute e capelli, comprensione delle abitudini, definizione degli obiettivi.',
  },
  {
    icon: BookOpen,
    title: 'Formazione Continua',
    text: 'Il team Luxosa investe costantemente nella formazione, aggiornando le proprie competenze con i più avanzati protocolli nel settore hair wellness.',
  },
  {
    icon: Award,
    title: 'Standard Qualitativi',
    text: 'Selezioniamo esclusivamente prodotti e tecnologie che rispettano i più alti standard di qualità, sicurezza e rispetto per cute e capelli.',
  },
  {
    icon: Star,
    title: 'Risultati Misurabili',
    text: 'Documentiamo l\'evoluzione di ogni percorso per garantire alla cliente una visibilità chiara dei progressi e dei risultati ottenuti.',
  },
];

const testimonials = [
  {
    quote: 'Da Luxosa ho trovato qualcosa che non avevo mai trovato altrove: qualcuno che ha davvero ascoltato i miei capelli prima di toccarli.',
    name: 'Francesca M.',
    detail: 'Cliente dal 2022',
  },
  {
    quote: 'Non è solo un trattamento. È un percorso che ti accompagna, ti spiega, ti rassicura. Mi sono sentita compresa fin dal primo momento.',
    name: 'Giulia R.',
    detail: 'Percorso Equilibrio Cute',
  },
  {
    quote: 'La competenza si percepisce in ogni dettaglio. Dopo anni di tentativi, finalmente i miei capelli hanno trovato il loro equilibrio.',
    name: 'Elena D.',
    detail: 'Cliente dal 2021',
  },
];

export default function Authority() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <section className="py-28 md:py-36 lg:py-44 bg-charcoal text-ivory">
      <div className="max-w-[1400px] mx-auto px-6 md:px-10 lg:px-16" ref={ref}>
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-20 md:mb-28">
          <motion.span
            initial={{ opacity: 0, y: 15 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7 }}
            className="text-[11px] tracking-[0.35em] uppercase text-brass-light font-light"
          >
            La Nostra Autorevolezza
          </motion.span>
          <motion.div
            initial={{ width: 0 }}
            animate={inView ? { width: 40 } : {}}
            transition={{ duration: 0.8, delay: 0.15 }}
            className="h-[1px] bg-brass mx-auto mt-4 mb-8"
          />
          <motion.h2
            initial={{ opacity: 0, y: 25 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="font-serif text-[32px] md:text-[40px] lg:text-[48px] font-light leading-[1.1] text-ivory tracking-[0.01em]"
          >
            La fiducia si costruisce<br />
            con i fatti.
          </motion.h2>
        </div>

        {/* Proofs Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-8 mb-24 md:mb-32">
          {proofs.map((p, i) => (
            <motion.div
              key={p.title}
              initial={{ opacity: 0, y: 25 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7, delay: 0.2 + i * 0.1 }}
              className="text-center"
            >
              <div className="w-14 h-14 rounded-full border border-brass/30 flex items-center justify-center mx-auto mb-5">
                <p.icon size={22} strokeWidth={1.2} className="text-brass-light" />
              </div>
              <h3 className="font-serif text-[19px] md:text-[20px] font-light text-ivory mb-3 tracking-wide">
                {p.title}
              </h3>
              <p className="text-[13px] md:text-[14px] leading-[1.75] text-ivory/50 font-light">
                {p.text}
              </p>
            </motion.div>
          ))}
        </div>

        {/* Testimonials */}
        <div className="border-t border-ivory/10 pt-16 md:pt-20">
          <motion.p
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 1 } : {}}
            transition={{ duration: 0.7, delay: 0.5 }}
            className="text-[11px] tracking-[0.35em] uppercase text-brass-light/70 font-light text-center mb-12"
          >
            Voci di chi si è affidata
          </motion.p>
          <div className="grid md:grid-cols-3 gap-10 md:gap-8">
            {testimonials.map((t, i) => (
              <motion.div
                key={t.name}
                initial={{ opacity: 0, y: 20 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.7, delay: 0.6 + i * 0.1 }}
                className="text-center"
              >
                <p className="font-serif text-[17px] md:text-[18px] italic font-light leading-[1.7] text-ivory/70 mb-5">
                  "{t.quote}"
                </p>
                <p className="text-[13px] tracking-[0.1em] uppercase text-ivory/90 font-light">
                  {t.name}
                </p>
                <p className="text-[11px] tracking-[0.15em] text-ivory/40 font-light mt-1">
                  {t.detail}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
