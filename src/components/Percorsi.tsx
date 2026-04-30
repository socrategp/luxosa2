import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';

import { premiumEase } from '../lib/animations';

const percorsi = [
  {
    num: 'PC·01',
    name: 'BenEssere',
    focus: "Il percorso dedicato all'equilibrio reale di cute e capello.",
    intro: [
      "Quando il capello perde densità, forza e stabilità — o quando la cute non trova equilibrio nonostante trattamenti ripetuti — il problema non è quasi mai solo una questione di prodotti. È l'assenza di una lettura reale: di ciò che è accaduto nel tempo, dei trattamenti ricevuti, delle cause specifiche che nessuno ha ancora individuato con precisione.",
      "Dietro ogni frustrazione c'è quasi sempre lo stesso desiderio: non semplicemente capelli più sani, ma ritrovare — o ottenere per la prima volta — capelli di cui fidarsi davvero. Forti, stabili, pieni: capelli che non richiedano di essere nascosti o continuamente gestiti, e che restituiscano la sensazione di avere finalmente una base solida su cui costruire.",
    ],
    desc: "BenEssere parte dall'analisi approfondita di cute e fibra; individua il problema specifico, comprende la storia del capello e definisce il piano più adatto al profilo reale della persona, prima di avviare qualsiasi intervento. Con rigore, cura costante e la stabilità che ogni recupero autentico richiede.",
    image: '/images/BenEssere.png',
  },
  {
    num: 'PC·02',
    name: 'ColorLux',
    focus: 'Il percorso dedicato a luce, armonia e identità del colore.',
    intro: [
      "Quando il colore scarica troppo in fretta, vira in riflessi non desiderati o non valorizza davvero il viso, il problema non è mai solo tecnico. È l'assenza di una direzione cromatica chiara, costruita sulla persona e non su una formula standard.",
      "Dietro ogni frustrazione cromatica c'è quasi sempre lo stesso desiderio: non semplicemente un colore più bello, ma un colore in cui riconoscersi davvero — capace di valorizzare il viso, creare armonia e restituire la sensazione di essere finalmente giusta. Un risultato che non si perda dopo pochi lavaggi e che non lasci, ogni volta, la percezione che manchi ancora qualcosa.",
    ],
    desc: "ColorLux parte dall'analisi del tono naturale, dell'incarnato e dell'armocromia personale; individua il problema specifico, comprende il desiderio autentico e definisce il risultato realmente ottenibile prima di costruire il percorso più adatto. Con sensibilità, intenzione e la precisione di chi costruisce un'identità cromatica coerente nel tempo.",
    image: '/images/colorlux.png',
  },
  {
    num: 'RL·01',
    name: 'Rituale Luxosa',
    focus: "La presa in carico più completa dell'universo Luxosa.",
    intro: [
      "Quando cute, fibra, forma e colore presentano criticità diverse — e nessuna soluzione affrontata separatamente ha mai davvero risolto il quadro complessivo — il problema non è tecnico. È l'assenza di una lettura integrata: qualcuno capace di vedere tutto insieme, non un'area alla volta.",
      "Dietro ogni tentativo frammentato c'è quasi sempre lo stesso desiderio: non correggere qualcosa, ma trasformarsi davvero. Sentirsi presa in carico nella propria interezza — cute, capello, forma, colore, armonia — con la certezza che ogni scelta sia coerente con le altre e che il risultato sia costruito per durare.",
    ],
    desc: "Il Rituale Luxosa nasce da una lettura professionale completa e integrata; individua le priorità reali, comprende il desiderio autentico e costruisce un progetto bespoke — prescritto su misura, senza livelli predefiniti, con un numero di sedute stabilito dalla stilista dopo la lettura. Con visione integrata, guida completa e la coerenza profonda di un progetto costruito per durare.",
    image: '/images/rituale_luxosa.png',
  },
];

function PercorsoRow({ percorso, index }: { percorso: typeof percorsi[0]; index: number }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });
  const imageLeft = index % 2 === 0;

  return (
    <div ref={ref}>
      {/* Separator between rows */}
      {index > 0 && (
        <motion.div
          initial={{ scaleX: 0 }}
          animate={inView ? { scaleX: 1 } : {}}
          transition={{ duration: 1.2, ease: premiumEase }}
          style={{ transformOrigin: 'left' }}
          className="h-px bg-sand/50 my-20 md:my-28 lg:my-32"
        />
      )}

      <div className={`grid lg:grid-cols-2 gap-12 lg:gap-20 items-center ${!imageLeft ? 'lg:[&>*:first-child]:order-2 lg:[&>*:last-child]:order-1' : ''}`}>

        {/* Image — portrait contained, never touches neighbours */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 1.3, ease: premiumEase, delay: 0.1 }}
          className="relative overflow-hidden aspect-[4/5] w-full"
        >
          <img
            src={percorso.image}
            alt={percorso.name}
            className="w-full h-full object-cover transition-transform duration-[15000ms] hover:scale-[1.04] ease-out"
          />
          <div className="absolute inset-0 bg-deep/5" />
        </motion.div>

        {/* Text block */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 1.1, ease: premiumEase, delay: 0.25 }}
          className="w-full"
        >
          <div>
            {/* Code */}
            <span className="text-[10px] tracking-[0.2em] text-brass-muted/60 font-light">
              {percorso.num}
            </span>

            {/* Name */}
            <h3 className="font-serif text-[30px] md:text-[36px] lg:text-[42px] font-light text-charcoal leading-[1.08] tracking-[0.01em] mt-3">
              {percorso.name}
            </h3>

            {/* Accent line */}
            <div className="h-px w-8 bg-brass/40 my-6" />

            {/* Focus */}
            <p className="text-[11px] tracking-[0.2em] uppercase text-brass-muted font-light mb-8">
              {percorso.focus}
            </p>

            {/* Intro paragraphs */}
            <div className="space-y-4">
              {percorso.intro.map((p, i) => (
                <p key={i} className="text-[16px] md:text-[17px] leading-[1.9] text-anthracite/65 font-light">
                  {p}
                </p>
              ))}
            </div>

            {/* Desc */}
            <p className="text-[15px] leading-[1.85] text-anthracite/40 font-light mt-6 italic">
              {percorso.desc}
            </p>
          </div>
        </motion.div>

      </div>
    </div>
  );
}

export default function Percorsi() {
  return (
    <section className="py-32 md:py-48 lg:py-56 bg-ivory">
      <div className="max-w-[1400px] mx-auto px-6 md:px-10 lg:px-16">
        {percorsi.map((p, i) => (
          <PercorsoRow key={p.num} percorso={p} index={i} />
        ))}
      </div>
    </section>
  );
}