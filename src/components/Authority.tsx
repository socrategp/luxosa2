import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import SharedCarousel from './TestimonialsCarousel';
import type { TestimonialItem } from './TestimonialsCarousel';

const premiumEase: [number, number, number, number] = [0.25, 0.1, 0, 1];

const pillars = [
  {
    num: '01',
    label: 'Analisi',
    title: 'Analisi approfondita',
    text: 'Ogni percorso nasce da una lettura approfondita della persona, della storia del capello, del desiderio e di ciò che oggi richiede davvero attenzione. Non osserviamo solo il visibile: leggiamo l\'insieme per comprendere la direzione corretta.',
  },
  {
    num: '02',
    label: 'Metodo',
    title: 'Metodo Luxosa',
    text: 'Il Metodo Luxosa non improvvisa e non standardizza. Attraverso protocolli professionali collaudati, in continua evoluzione, permette di costruire un percorso realmente su misura, con coerenza, precisione e continuità nel tempo.',
  },
  {
    num: '03',
    label: 'Risultato',
    title: 'Risultati visibili',
    text: 'Ogni scelta è orientata a un risultato visibile, credibile e costruito per durare. Non un effetto momentaneo, ma un cambiamento reale che prende forma con rigore, visione e attenzione costante.',
  },
];

const testimonials: TestimonialItem[] = [
  {
    quote: 'La cosa che mi ha colpito è che nessuno mi ha mai venduto niente. Ero abituata a saloni dove a ogni appuntamento ti propongono un trattamento, un prodotto, un extra. Qui è diverso: mi hanno detto chiaramente che la mia fibra era compromessa dalle decolorazioni e che prima di fare qualsiasi cosa serviva ricostruire. Tre mesi. Niente colore, solo cura. In nessun altro posto avrebbero rinunciato a un servizio per dirti la verità.',
    name: 'Alessandra P.',
    role: '39 anni',
    percorso: 'BenEssere',
    valore: 'Competenza',
  },
  {
    quote: 'Sono una persona che ha bisogno di prevedibilità. Nel mio lavoro e nella vita. La cosa che mi ha conquistato di Luxosa è che prima di iniziare mi hanno mostrato un progetto scritto. Obiettivi, tempistiche, risultati attesi. Non promesse vaghe, non un colore scelto da una cartella. Un piano costruito sulla mia cute, sul mio capello, sulle mie abitudini. Per una come me, è tutto.',
    name: 'Valeria C.',
    role: '46 anni',
    percorso: 'ColorLux',
    valore: 'Metodo',
  },
  {
    quote: 'Ho una cute reattiva e per anni ho provato prodotti su consiglio di colleghe, farmacisti, internet. Quando sono arrivata qui ero rassegnata: pensavo fosse una cosa con cui convivere. La prima domanda che mi hanno fatto non è stata sui capelli ma su come mi sentivo. Quella domanda ha cambiato tutto. Dopo sei sedute non ho più prurito, non ho più irritazione. Ho solo la tranquillità di sapere che qualcuno si occupa di me, non del problema.',
    name: 'Marina L.',
    role: '43 anni',
    percorso: 'BenEssere',
    valore: 'Ascolto',
  },
  {
    quote: 'Il diradamento è una cosa di cui non si parla volentieri. Io l\'ho nascosto per anni con il colore, con le pieghe più voluminose, con le fasce. Poi un\'amica mi ha detto: vai da Luxosa. Mi hanno fatto una lettura della cute che nessun salone mi aveva mai proposto. Per la prima volta qualcuno mi ha detto: possiamo lavorarci. Non possiamo fare miracoli, ma possiamo lavorarci. Quella onestà mi ha fatto piangere. E i risultati dopo quattro mesi mi hanno fatto sorridere.',
    name: 'Carmela V.',
    role: '57 anni',
    percorso: 'BenEssere',
    valore: 'Presa in carico',
  },
  {
    quote: 'A sessant\'anni pensavo che certe cose non si potessero più cambiare. Che i capelli sottili e spenti fossero il mio destino. Mia figlia mi ha regalato una consulenza da Luxosa per il compleanno. Non sapevo cosa aspettarmi. Oggi, otto mesi dopo, mia figlia mi dice che sembro più giovane. Ma non è questione di apparenza. È che mi sento di nuovo me stessa.',
    name: 'Patrizia G.',
    role: '59 anni',
    percorso: 'BenEssere',
    valore: 'Trasformazione',
  },
  {
    quote: 'Ho fatto il colore ogni mese per trent\'anni. Sempre uguale: arrivi, scegli dalla cartella, esci. Quando da Luxosa mi hanno detto che il mio colore non era sbagliato ma era gestito male, ho capito che c\'era un modo diverso di fare le cose. Non vado più a fare il colore. Seguo un percorso colore. La differenza la vedo io allo specchio, ma la vedono anche le mie clienti in farmacia.',
    name: 'Angela F.',
    role: '55 anni',
    percorso: 'ColorLux',
    valore: 'Percorso',
  },
  {
    quote: 'Avevo smesso di credere che ci fosse una soluzione unica. La cute secca, il colore che non teneva, il volume che calava: li affrontavo separatamente da anni, senza mai risolvere davvero niente. Quando mi hanno spiegato il Rituale Luxosa, la prima cosa che ho pensato è stata: finalmente qualcuno che vede tutto insieme. Non mi hanno venduto un servizio. Mi hanno costruito un progetto. Sei mesi dopo, guardo i miei capelli e mi riconosco.',
    name: 'Sara M.',
    role: '48 anni',
    percorso: 'Rituale Luxosa',
    valore: 'Visione integrata',
  },
];

function PillarSection() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <section className="py-32 md:py-48 lg:py-56 bg-ivory" ref={ref}>
      <div className="max-w-[1400px] mx-auto px-6 md:px-10 lg:px-16">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 1, ease: premiumEase }}
          className="mb-20 md:mb-28"
        >
          <span className="text-[11px] tracking-[0.35em] uppercase text-brass-muted font-light">
            Perché affidarsi a Luxosa
          </span>
          <div className="h-[1px] w-10 bg-brass mt-4" />
        </motion.div>

        {/* Cards */}
        <div className="grid md:grid-cols-3 gap-16 md:gap-10 lg:gap-16 items-start">
          {pillars.map((p, i) => (
            <motion.div
              key={p.label}
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 1.1, ease: premiumEase, delay: 0.15 + i * 0.12 }}
              className="flex flex-col"
            >
              <div className="mb-7">
                <span className="text-[13px] tracking-[0.35em] uppercase text-brass-muted font-light block">
                  {p.label}
                </span>
              </div>
              <div className="h-[1px] w-full bg-sand mb-7" />
              <h3 className="font-serif text-[20px] md:text-[22px] font-light text-charcoal mb-4 leading-snug tracking-wide">
                {p.title}
              </h3>
              <p className="text-[17px] md:text-[18px] leading-[1.8] text-anthracite/75 font-light">
                {p.text}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function TestimonialsCarousel() {
  return <SharedCarousel testimonials={testimonials} label="Voci di chi si è affidata" />;
}

export { PillarSection };

export default function Authority() {
  return (
    <>
      <PillarSection />
      <TestimonialsCarousel />
    </>
  );
}
