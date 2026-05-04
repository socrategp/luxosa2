import { motion, useInView } from 'framer-motion';
import { useRef, useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Phone, Mail, Clock, ArrowRight, ArrowLeft, Ear, Search, Fingerprint, Shield, Sparkles, ChevronLeft, ChevronRight } from 'lucide-react';

/* ============================================================
   LUXOSA MESSINA CAVOUR — Mini-sito onepage
   ============================================================ */

// --- Hero ---
function MCHero() {
  return (
    <section className="relative h-[75vh] min-h-[550px] max-h-[850px] overflow-hidden">
      <div className="absolute inset-0">
        <img src="/images/messina-new.webp" alt="Luxosa Messina Cavour" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-b from-deep/55 via-deep/30 to-deep/65" />
        <div className="absolute inset-0 bg-gradient-to-r from-deep/30 to-transparent" />
      </div>
      <div className="relative h-full flex flex-col justify-end pb-20 md:pb-28">
        <div className="max-w-[1400px] mx-auto px-6 md:px-10 lg:px-16 w-full">
          <motion.div initial={{ width: 0 }} animate={{ width: 50 }} transition={{ duration: 1, delay: 0.2 }} className="h-[1px] bg-brass-light mb-6" />
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, ease: [0.25, 0.1, 0, 1], delay: 0.3 }} className="flex items-center gap-2 mb-4">
            <MapPin size={14} strokeWidth={1.3} className="text-brass-light" />
            <span className="text-[11px] md:text-[12px] tracking-[0.3em] uppercase text-brass-light font-light">Messina — Via Cavour</span>
          </motion.div>
          <motion.h1 initial={{ opacity: 0, y: 25 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, delay: 0.5, ease: [0.25, 0.1, 0, 1] }} className="font-serif text-[36px] md:text-[52px] lg:text-[64px] text-white font-light leading-[1.08] tracking-[0.02em] max-w-3xl">
            Luxosa<br />Messina Cavour.
          </motion.h1>
          <motion.p initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, ease: [0.25, 0.1, 0, 1], delay: 0.75 }} className="mt-5 text-white/60 text-[18px] md:text-[20px] font-light leading-relaxed max-w-xl tracking-wide">
            Un luogo esclusivo nel cuore della città in cui competenza, metodo e accoglienza si incontrano.
          </motion.p>
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, ease: [0.25, 0.1, 0, 1], delay: 0.95 }} className="mt-8 flex flex-col sm:flex-row gap-4">
            <a href="#mc-contatti" className="inline-flex items-center justify-center text-[12px] tracking-[0.2em] uppercase font-light text-deep bg-ivory hover:bg-ecru px-8 py-4 transition-all duration-500">Prenota una consulenza</a>
            <a href="#mc-metodo" className="inline-flex items-center justify-center text-[12px] tracking-[0.2em] uppercase font-light text-white/80 border border-white/25 hover:border-white/50 hover:text-white px-8 py-4 transition-all duration-500">Scopri la sede</a>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

// --- Back link ---
function MCBackLink() {
  return (
    <div className="bg-ivory border-b border-sand/40">
      <div className="max-w-[1400px] mx-auto px-6 md:px-10 lg:px-16 py-4">
        <Link to="/sedi" className="inline-flex items-center gap-2 text-[12px] tracking-[0.15em] uppercase text-stone hover:text-brass-muted font-light transition-colors">
          <ArrowLeft size={14} strokeWidth={1.5} /> Tutte le sedi
        </Link>
      </div>
    </div>
  );
}

// --- About ---
function MCAbout() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <section id="mc-about" className="py-28 md:py-40 lg:py-48 bg-ivory">
      <div className="max-w-[1400px] mx-auto px-6 md:px-10 lg:px-16" ref={ref}>
        <div className="grid lg:grid-cols-2 gap-16 lg:gap-24 items-center">
          <div>
            <motion.div initial={{ opacity: 0, y: 20 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 1.2, ease: [0.25, 0.1, 0, 1] }}>
              <span className="text-[11px] tracking-[0.35em] uppercase text-brass-muted font-light">La Sede</span>
              <div className="w-10 h-[1px] bg-brass mt-4 mb-8" />
            </motion.div>
            <motion.h2 initial={{ opacity: 0, y: 25 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 1.2, ease: [0.25, 0.1, 0, 1], delay: 0.15 }} className="font-serif text-[30px] md:text-[38px] lg:text-[44px] font-light leading-[1.12] text-charcoal">
              Un punto di riferimento<br />per la cura evoluta.
            </motion.h2>
            <motion.div initial={{ opacity: 0, y: 20 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 1.2, ease: [0.25, 0.1, 0, 1], delay: 0.3 }} className="mt-8 space-y-5">
              <p className="text-[18px] md:text-[19px] leading-[1.8] text-anthracite/80 font-light">
                A Messina Cavour, Luxosa prende forma nella sua espressione più fedele. Non come un salone costruito per impressionare, ma come uno spazio pensato per lavorare bene: accogliere con misura, osservare con attenzione, curare con metodo.
              </p>
              <p className="text-[18px] md:text-[19px] leading-[1.8] text-anthracite/80 font-light">
                Qui ogni dettaglio nasce da una scelta precisa. La luce, i materiali, il ritmo, l'ordine, il comfort. Tutto è progettato per creare le condizioni giuste alla consulenza, alla lettura, al trattamento e alla continuità.
              </p>
              <p className="text-[18px] md:text-[19px] leading-[1.8] text-anthracite/80 font-light">
                Messina Cavour non è solo un indirizzo. È il luogo in cui una donna entra e comprende, fin dai primi minuti, che non sarà trattata come una cliente tra tante.
              </p>
            </motion.div>
          </div>
          <motion.div initial={{ opacity: 0, x: 30 }} animate={inView ? { opacity: 1, x: 0 } : {}} transition={{ duration: 1, delay: 0.3 }} className="relative">
            <div className="aspect-[3/4] overflow-hidden">
              <img src="/images/reception.webp" alt="Interno Luxosa Messina Cavour" loading="lazy" decoding="async" className="w-full h-full object-cover" />
            </div>
            <div className="absolute -bottom-4 -left-4 w-20 h-20 border-l border-b border-brass/30" />
          </motion.div>
        </div>
      </div>
    </section>
  );
}

// --- Lo Spazio ---
function MCSpace() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <section id="mc-spazio" className="py-28 md:py-40 lg:py-48 bg-ecru/50">
      <div className="max-w-[1400px] mx-auto px-6 md:px-10 lg:px-16" ref={ref}>
        <div className="text-center max-w-2xl mx-auto mb-14 md:mb-20">
          <motion.span initial={{ opacity: 0, y: 15 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 1, ease: [0.25, 0.1, 0, 1] }} className="text-[11px] tracking-[0.35em] uppercase text-brass-muted font-light">Lo Spazio</motion.span>
          <motion.div initial={{ width: 0 }} animate={inView ? { width: 40 } : {}} transition={{ duration: 1.2, ease: [0.25, 0.1, 0, 1], delay: 0.15 }} className="h-[1px] bg-brass mx-auto mt-4 mb-8" />
          <motion.h2 initial={{ opacity: 0, y: 25 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 1.2, ease: [0.25, 0.1, 0, 1], delay: 0.2 }} className="font-serif text-[30px] md:text-[38px] lg:text-[44px] font-light leading-[1.1] text-charcoal">
            Progettato per accogliere,<br />proteggere, rigenerare.
          </motion.h2>
        </div>

        <div className="grid md:grid-cols-3 gap-4 md:gap-5">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 1.2, ease: [0.25, 0.1, 0, 1], delay: 0.25 }} className="aspect-[3/4] md:aspect-auto md:row-span-2 overflow-hidden">
            <img src="/images/zona-consulenza.webp" alt="Zona consulenza" loading="lazy" decoding="async" className="w-full h-full object-cover hover:scale-[1.04] transition-transform duration-[1200ms] ease-out" />
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 30 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 1.2, ease: [0.25, 0.1, 0, 1], delay: 0.35 }} className="aspect-[4/3] overflow-hidden">
            <img src="/images/zona-tecnica.webp" alt="Zona tecnica" loading="lazy" decoding="async" className="w-full h-full object-cover hover:scale-[1.04] transition-transform duration-[1200ms] ease-out" />
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 30 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 1.2, ease: [0.25, 0.1, 0, 1], delay: 0.45 }} className="aspect-[4/3] overflow-hidden">
            <img src="/images/lavaggi.webp" alt="Area lavaggi" loading="lazy" decoding="async" className="w-full h-full object-cover hover:scale-[1.04] transition-transform duration-[1200ms] ease-out" />
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 30 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 1.2, ease: [0.25, 0.1, 0, 1], delay: 0.55 }} className="aspect-[4/3] overflow-hidden">
            <img src="/images/zona-tecnica2.webp" alt="Zona tecnica" loading="lazy" decoding="async" className="w-full h-full object-cover hover:scale-[1.04] transition-transform duration-[1200ms] ease-out" />
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 30 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 1.2, ease: [0.25, 0.1, 0, 1], delay: 0.65 }} className="aspect-[4/3] overflow-hidden">
            <img src="/images/lavaggio2.webp" alt="Area lavaggi" loading="lazy" decoding="async" className="w-full h-full object-cover hover:scale-[1.04] transition-transform duration-[1200ms] ease-out" />
          </motion.div>
        </div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 1, ease: [0.25, 0.1, 0, 1], delay: 0.7 }} className="mt-12 flex flex-wrap justify-center gap-x-10 gap-y-4">
          {['Ordine', 'Luce', 'Armonia', 'Comfort'].map((q) => (
            <span key={q} className="text-[12px] tracking-[0.25em] uppercase text-stone font-light">{q}</span>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

// --- Il Metodo nella Sede ---
function MCMethod() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });

  const steps = [
    { icon: Ear, title: 'Ascolto', text: 'Il primo incontro è dedicato alla conoscenza. La storia del capello, le abitudini quotidiane, i desideri reali: tutto viene ascoltato prima di qualsiasi valutazione.' },
    { icon: Search, title: 'Osservazione', text: 'Attraverso strumenti professionali, cute e fibra vengono letti con precisione. Non impressioni: dati.' },
    { icon: Fingerprint, title: 'Progetto', text: 'Ogni percorso nasce da un progetto scritto. Obiettivi chiari, tappe definite, risultati misurabili.' },
    { icon: Shield, title: 'Costruzione', text: 'Ogni seduta è un passo deliberato. Nessun gesto è casuale: ogni scelta costruisce il risultato previsto.' },
    { icon: Sparkles, title: 'Trasformazione', text: 'Il cambiamento reale non avviene in una seduta. Si costruisce nel tempo, con continuità e attenzione costante.' },
  ];

  return (
    <section id="mc-metodo" className="py-28 md:py-40 lg:py-48 bg-ivory">
      <div className="max-w-[1400px] mx-auto px-6 md:px-10 lg:px-16" ref={ref}>
        <div className="text-center max-w-2xl mx-auto mb-16 md:mb-20">
          <motion.span initial={{ opacity: 0, y: 15 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 1, ease: [0.25, 0.1, 0, 1] }} className="text-[11px] tracking-[0.35em] uppercase text-brass-muted font-light">Il Metodo</motion.span>
          <motion.div initial={{ width: 0 }} animate={inView ? { width: 40 } : {}} transition={{ duration: 1.2, ease: [0.25, 0.1, 0, 1], delay: 0.15 }} className="h-[1px] bg-brass mx-auto mt-4 mb-8" />
          <motion.h2 initial={{ opacity: 0, y: 25 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 1.2, ease: [0.25, 0.1, 0, 1], delay: 0.2 }} className="font-serif text-[30px] md:text-[38px] lg:text-[44px] font-light leading-[1.1] text-charcoal">Il Metodo Luxosa<br />a Messina.</motion.h2>
          <motion.p initial={{ opacity: 0, y: 15 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 1, ease: [0.25, 0.1, 0, 1], delay: 0.35 }} className="mt-6 text-[18px] md:text-[19px] leading-[1.8] text-anthracite/70 font-light">Il Metodo Luxosa viene applicato con lo stesso rigore e la stessa sensibilità in ogni sede.</motion.p>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-10">
          {steps.map((s, i) => (
            <motion.div key={s.title} initial={{ opacity: 0, y: 25 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 1, ease: [0.25, 0.1, 0, 1], delay: 0.2 + i * 0.08 }} className="group">
              <div className="flex items-start gap-5">
                <div className="flex-shrink-0 w-12 h-12 rounded-full border border-brass/25 flex items-center justify-center group-hover:border-brass/50 transition-colors duration-500">
                  <s.icon size={20} strokeWidth={1.2} className="text-brass-muted" />
                </div>
                <div>
                  <h3 className="font-serif text-[20px] md:text-[22px] font-light text-charcoal mb-2 tracking-wide">{s.title}</h3>
                  <p className="text-[17px] leading-[1.75] text-anthracite/60 font-light">{s.text}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// --- Master Responsabile ---
function MCTeam() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <section id="mc-master" className="py-28 md:py-40 lg:py-48 bg-charcoal text-ivory">
      <div className="max-w-[1400px] mx-auto px-6 md:px-10 lg:px-16" ref={ref}>
        <div className="grid lg:grid-cols-2 gap-16 lg:gap-24 items-center">
          <div>
            <motion.span initial={{ opacity: 0, y: 15 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 1, ease: [0.25, 0.1, 0, 1] }} className="text-[11px] tracking-[0.35em] uppercase text-brass-light font-light">Master Responsabile</motion.span>
            <motion.div initial={{ width: 0 }} animate={inView ? { width: 40 } : {}} transition={{ duration: 1.2, ease: [0.25, 0.1, 0, 1], delay: 0.15 }} className="h-[1px] bg-brass mt-4 mb-8" />
            <motion.h2 initial={{ opacity: 0, y: 25 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 1.2, ease: [0.25, 0.1, 0, 1], delay: 0.2 }} className="font-serif text-[30px] md:text-[38px] lg:text-[44px] font-light leading-[1.1] text-ivory">
              Lucia Cotugno
            </motion.h2>
            <motion.div initial={{ opacity: 0, y: 20 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 1.2, ease: [0.25, 0.1, 0, 1], delay: 0.35 }} className="mt-8 space-y-5">
              <p className="text-[18px] md:text-[19px] leading-[1.8] text-ivory/65 font-light">
                Lucia Cotugno guida la sede Luxosa di Messina Cavour custodendone il metodo, la qualità dell'esperienza e la coerenza operativa. Il suo ruolo è garantire che ogni donna trovi non soltanto accoglienza e competenza, ma una presa in carico reale, ordinata e continua nel tempo.
              </p>
              <p className="text-[18px] md:text-[19px] leading-[1.8] text-ivory/65 font-light">
                Nella sede supervisiona l'esperienza, sostiene il percorso della cliente e presidia gli standard che rendono Luxosa riconoscibile: ascolto autentico, metodo, misura, attenzione al dettaglio e cura responsabile.
              </p>
            </motion.div>
            <motion.p initial={{ opacity: 0, y: 15 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 1, ease: [0.25, 0.1, 0, 1], delay: 0.5 }} className="mt-10 font-serif text-[18px] md:text-[20px] italic text-brass-light/70 font-light leading-[1.7]">
              "Ogni donna deve sentirsi vista, compresa e accompagnata. È da qui che nasce il vero cambiamento."
            </motion.p>
          </div>
          <motion.div initial={{ opacity: 0, x: 30 }} animate={inView ? { opacity: 1, x: 0 } : {}} transition={{ duration: 1, delay: 0.3 }} className="relative">
            <div className="aspect-[3/4] overflow-hidden">
              <img src="/images/team-master.webp" alt="Lucia Cotugno — Master Responsabile Luxosa Messina" loading="lazy" decoding="async" className="w-full h-full object-cover" />
            </div>
            <div className="absolute -top-4 -right-4 w-16 h-16 border-t border-r border-brass/25" />
            <div className="absolute bottom-4 right-4 flex items-center gap-2 bg-deep/80 backdrop-blur-sm px-4 py-3 rounded-sm border border-brass/25">
              <div className="w-8 h-8 rounded-full border border-brass flex items-center justify-center flex-shrink-0">
                <span className="text-[8px] tracking-[0.1em] uppercase text-brass font-light">L.C.</span>
              </div>
              <div>
                <p className="text-[11px] tracking-[0.15em] uppercase text-brass-light font-light">Lucia Cotugno</p>
                <p className="text-[10px] text-brass-light/60">Master Responsabile</p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

// --- Percorsi ed Esperienze ---
function MCServices() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <section id="mc-servizi" className="py-28 md:py-40 lg:py-48 bg-ivory-warm">
      <div className="max-w-[1400px] mx-auto px-6 md:px-10 lg:px-16" ref={ref}>
        <div className="max-w-2xl">
          <motion.span initial={{ opacity: 0, y: 15 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 1, ease: [0.25, 0.1, 0, 1] }} className="text-[11px] tracking-[0.35em] uppercase text-brass-muted font-light">Percorsi ed Esperienze</motion.span>
          <motion.div initial={{ width: 0 }} animate={inView ? { width: 40 } : {}} transition={{ duration: 1.2, ease: [0.25, 0.1, 0, 1], delay: 0.15 }} className="h-[1px] bg-brass mt-4 mb-8" />
          <motion.p initial={{ opacity: 0, y: 20 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 1.1, ease: [0.25, 0.1, 0, 1], delay: 0.25 }} className="text-[18px] md:text-[19px] leading-[1.85] text-anthracite/70 font-light">
            Tutti i percorsi e le esperienze disponibili presso questa sede sono illustrati nelle sezioni dedicate.
          </motion.p>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 1, ease: [0.25, 0.1, 0, 1], delay: 0.4 }} className="mt-10 flex flex-col sm:flex-row gap-8">
            <Link to="/i-percorsi" className="group inline-flex items-center gap-2 text-[12px] tracking-[0.18em] uppercase text-anthracite/60 font-light hover:text-anthracite transition-colors duration-500">
              I Percorsi <ArrowRight size={14} strokeWidth={1.5} className="transition-transform duration-500 group-hover:translate-x-2" />
            </Link>
            <Link to="/esperienza" className="group inline-flex items-center gap-2 text-[12px] tracking-[0.18em] uppercase text-anthracite/60 font-light hover:text-anthracite transition-colors duration-500">
              Le Esperienze <ArrowRight size={14} strokeWidth={1.5} className="transition-transform duration-500 group-hover:translate-x-2" />
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

// --- Testimonials ---
const MC_CARD_RATIO = 0.72;
const MC_CARD_GAP = 28;

const mcTestimonials = [
  {
    quote: 'Ho cambiato quattro saloni in cinque anni. Nessuno si ricordava che colore avevo fatto la volta prima, figuriamoci la mia storia. Da Luxosa la mia professionista conosce ogni centimetro della mia testa. Sa che il mio colore tende a ossidarsi sulle punte, sa che ho capelli misti, più porosi in alcune parti. Non devo rispiegare nulla ogni volta. Questa continuità per me vale più di qualsiasi tecnica o scena da tiktok.',
    name: 'Francesca M.',
    role: 'Avvocato, Messina — 44 anni',
    percorso: 'ColorLux',
    valore: 'Continuità professionale',
  },
  {
    quote: 'Gestisco un team di trenta persone. Non ho tempo da perdere, e non ho pazienza per chi improvvisa. Quando sono entrata da Luxosa la prima volta, mi hanno fatto un\'analisi che è durata venticinque minuti. Nessuno mi aveva mai fatto sedere così a lungo prima di toccarmi i capelli. Quel giorno ho capito la differenza tra un parrucchiere e un posto serio. Due percorsi dopo, il mio capello è un altro. Ma soprattutto io sono un\'altra quando mi guardo allo specchio la mattina.',
    name: 'Claudia T.',
    role: 'Direttrice commerciale, Messina — 41 anni',
    percorso: 'Rituale Luxosa',
    valore: 'Il Metodo',
  },
  {
    quote: 'Sono arrivata da Luxosa con i capelli distrutti. Decolorazioni fatte in casa, tinte da supermercato, una lisciatura che mi aveva bruciato le punte. Mi vergognavo. La prima cosa che mi hanno detto è stata: non ti preoccupare, ci lavoriamo. Nessun rimprovero, nessuno sguardo. Solo un piano chiaro per ricostruire quello che avevo rovinato. Ci sono voluti cinque mesi. Oggi ho i capelli più sani della mia vita adulta.',
    name: 'Serena R.',
    role: 'Designer, Messina — 32 anni',
    percorso: 'BenEssere',
    valore: 'Nessun giudizio',
  },
  {
    quote: 'Ho i ricci. Una vita a sentirmi dire di lisciarli, di domarli, di tenerli legati. Poi sono entrata da Luxosa e per la prima volta qualcuno mi ha detto: i tuoi ricci sono belli, ma lavorano contro la tua cute. Costruiamo un percorso che li valorizzi senza stressare niente. Non mi avevano mai parlato così dei miei capelli. Come se fossero una cosa seria. Perché lo sono.',
    name: 'Giulia S.',
    role: 'Architetto, Messina — 29 anni',
    percorso: 'EX·05 RicciOsa',
    valore: 'Progetto personale',
  },
  {
    quote: 'Ho capito la differenza tra salone e Luxosa quando mi hanno detto: il colore che vuoi richiede tre passaggi in due mesi. In qualsiasi altro posto me lo avrebbero fatto subito, in una seduta, bruciando tutto per accontentarmi. Qui hanno avuto il coraggio di dirmi no, non oggi. E quel no mi ha fatto più fiducia di mille sì.',
    name: 'Roberta I.',
    role: "Architetto d'interni, Messina — 48 anni",
    percorso: 'ColorLux',
    valore: 'Percorso, non appuntamento',
  },
  {
    quote: 'Come medico so che i risultati si ottengono con la costanza, non con l\'intervento singolo. Il metodo di Luxosa funziona esattamente così: non promette il miracolo in una seduta. Propone un percorso serio, con tappe, verifiche, adattamenti. In un anno i miei capelli si sono trasformati. Non per una singola cosa che hanno fatto. Per la somma di tutte le cose fatte bene, nel tempo.',
    name: 'Teresa P.',
    role: 'Medico di base, Messina — 52 anni',
    percorso: 'Rituale Luxosa',
    valore: 'Disciplina e costanza',
  },
  {
    quote: 'Sono una che vuole i numeri. Non mi basta che mi dicano sta migliorando. Quando da Luxosa mi hanno mostrato le immagini della mia cute prima e dopo quattro sedute, ho visto la differenza con i miei occhi. Non opinioni. Fatti. Per una come me abituata ai bilanci, questo approccio è stato decisivo. So esattamente a che punto sono e dove sto andando.',
    name: 'Giuseppina R.',
    role: 'Commercialista, Messina — 53 anni',
    percorso: 'BenEssere',
    valore: 'Risultato verificato',
  },
  {
    quote: 'Ho completato il mio primo percorso l\'anno scorso. Ero tentata di fermarmi, come faccio sempre: ottengo il risultato e poi smetto. La mia professionista mi ha spiegato con calma perché la continuità fa la differenza. Nessuna pressione. Solo chiarezza. Ho continuato, e sei mesi dopo i miei capelli sono migliori di quanto siano mai stati. Ho capito che la bellezza non si raggiunge. Si mantiene.',
    name: 'Concetta M.',
    role: 'Ex dirigente scolastica, Messina — 58 anni',
    percorso: 'Rituale Luxosa',
    valore: 'Costanza che trasforma',
  },
];

function MCTestimonials() {
  const [active, setActive] = useState(0);
  const [containerWidth, setContainerWidth] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const sectionRef = useRef(null);
  const inView = useInView(sectionRef, { once: true, margin: '-80px' });

  const total = mcTestimonials.length;

  const resetInterval = useCallback(() => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    intervalRef.current = setInterval(() => setActive(a => (a + 1) % total), 8000);
  }, [total]);

  useEffect(() => {
    const update = () => { if (containerRef.current) setContainerWidth(containerRef.current.offsetWidth); };
    update();
    const ro = new ResizeObserver(update);
    if (containerRef.current) ro.observe(containerRef.current);
    return () => ro.disconnect();
  }, []);

  useEffect(() => {
    resetInterval();
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [resetInterval]);

  const cardWidth = containerWidth * MC_CARD_RATIO;
  const trackX = containerWidth * (1 - MC_CARD_RATIO) / 2 - active * (cardWidth + MC_CARD_GAP);

  const goTo = (i: number) => { setActive(i); resetInterval(); };
  const prev = () => goTo((active - 1 + total) % total);
  const next = () => goTo((active + 1) % total);

  return (
    <section ref={sectionRef} className="py-28 md:py-40 lg:py-48 bg-charcoal overflow-hidden">
      <div className="max-w-[1400px] mx-auto px-6 md:px-10 lg:px-16">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 1, ease: [0.25, 0.1, 0, 1] }}
          className="mb-20 md:mb-24 flex items-end justify-between"
        >
          <div>
            <span className="text-[11px] tracking-[0.35em] uppercase text-brass-light/60 font-light">Voci dalla Sede</span>
            <div className="h-[1px] w-10 bg-brass-light/30 mt-4" />
          </div>
          <div className="hidden md:flex items-center gap-4">
            <button onClick={prev} aria-label="Precedente" className="w-11 h-11 border border-ivory/15 flex items-center justify-center text-ivory/40 hover:text-ivory/80 hover:border-ivory/30 transition-colors duration-400">
              <ChevronLeft size={16} strokeWidth={1.2} />
            </button>
            <button onClick={next} aria-label="Successiva" className="w-11 h-11 border border-ivory/15 flex items-center justify-center text-ivory/40 hover:text-ivory/80 hover:border-ivory/30 transition-colors duration-400">
              <ChevronRight size={16} strokeWidth={1.2} />
            </button>
          </div>
        </motion.div>
      </div>

      <motion.div initial={{ opacity: 0 }} animate={inView ? { opacity: 1 } : {}} transition={{ duration: 1.2, ease: [0.25, 0.1, 0, 1], delay: 0.2 }}>
        <div ref={containerRef} className="relative mx-auto max-w-[1400px] px-6 md:px-10 lg:px-16">
          <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-charcoal to-transparent z-10 pointer-events-none" />
          <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-charcoal to-transparent z-10 pointer-events-none" />
          <div className="overflow-hidden">
            <motion.div
              className="flex"
              style={{ gap: MC_CARD_GAP }}
              animate={{ x: containerWidth > 0 ? trackX : 0 }}
              transition={{ duration: 0.8, ease: [0.25, 0.1, 0, 1] }}
            >
              {mcTestimonials.map((t, i) => {
                const dist = Math.min(Math.abs(i - active), total - Math.abs(i - active));
                const opacity = dist === 0 ? 1 : dist === 1 ? 0.35 : 0.12;
                const scale = dist === 0 ? 1 : dist === 1 ? 0.97 : 0.94;
                return (
                  <motion.div
                    key={t.name}
                    style={{ width: containerWidth > 0 ? cardWidth : `${MC_CARD_RATIO * 100}%`, flexShrink: 0 }}
                    animate={{ opacity, scale }}
                    transition={{ duration: 0.7, ease: [0.25, 0.1, 0, 1] }}
                    className="py-12 md:py-16 px-8 md:px-12 border border-ivory/10 cursor-pointer select-none"
                    onClick={() => i !== active && goTo(i)}
                  >
                    <div className="flex items-center gap-3 mb-8">
                      <span className="text-[9px] tracking-[0.35em] uppercase text-brass-light/50 font-light">{t.percorso}</span>
                      <div className="h-[1px] flex-1 bg-ivory/10" />
                      <span className="text-[9px] tracking-[0.25em] uppercase text-ivory/20 font-light">{t.valore}</span>
                    </div>
                    <p className="font-serif text-[18px] md:text-[20px] lg:text-[21px] italic font-light leading-[1.8] text-ivory/70 mb-10">"{t.quote}"</p>
                    <div className="flex items-center gap-4">
                      <div className="h-[1px] w-6 bg-brass-light/30 flex-shrink-0" />
                      <div>
                        <p className="text-[12px] tracking-[0.18em] uppercase text-ivory/70 font-light">{t.name}</p>
                        <p className="text-[11px] text-ivory/30 font-light mt-0.5 tracking-wide">{t.role}</p>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </motion.div>
          </div>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={inView ? { opacity: 1 } : {}}
        transition={{ duration: 1, ease: [0.25, 0.1, 0, 1], delay: 0.5 }}
        className="flex items-center justify-center gap-2.5 mt-12"
      >
        {mcTestimonials.map((_, i) => (
          <button key={i} onClick={() => goTo(i)} aria-label={`Testimonianza ${i + 1}`} className="relative w-6 h-[1px] bg-ivory/15 transition-all duration-500">
            <motion.span
              className="absolute inset-0 bg-brass-light/70"
              initial={{ scaleX: 0 }}
              animate={{ scaleX: i === active ? 1 : 0 }}
              style={{ transformOrigin: 'left' }}
              transition={{ duration: i === active ? 8 : 0.4, ease: i === active ? 'linear' : [0.25, 0.1, 0, 1] }}
            />
          </button>
        ))}
      </motion.div>
    </section>
  );
}

// --- Contact & Info ---
function MCContact() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <section id="mc-contatti" className="py-28 md:py-40 lg:py-48 bg-ivory">
      <div className="max-w-[1400px] mx-auto px-6 md:px-10 lg:px-16" ref={ref}>
        <div className="grid lg:grid-cols-2 gap-16 lg:gap-24">
          {/* Map / Info */}
          <div>
            <motion.div initial={{ opacity: 0, y: 20 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 1.2, ease: [0.25, 0.1, 0, 1] }}>
              <span className="text-[11px] tracking-[0.35em] uppercase text-brass-muted font-light">Dove Trovarci</span>
              <div className="w-10 h-[1px] bg-brass mt-4 mb-8" />
            </motion.div>
            <motion.h2 initial={{ opacity: 0, y: 25 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 1.2, ease: [0.25, 0.1, 0, 1], delay: 0.15 }} className="font-serif text-[30px] md:text-[38px] font-light leading-[1.12] text-charcoal mb-8">
              Luxosa Messina Cavour
            </motion.h2>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 1.2, ease: [0.25, 0.1, 0, 1], delay: 0.3 }} className="space-y-5">
              <div className="flex items-start gap-4">
                <MapPin size={18} strokeWidth={1.3} className="text-brass-muted flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-[18px] font-light text-charcoal">Via Cavour, 1</p>
                  <p className="text-[17px] font-light text-anthracite/60">98122 Messina (ME), Italia</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <Phone size={18} strokeWidth={1.3} className="text-brass-muted" />
                <a href="tel:+390902403220" className="text-[18px] font-light text-charcoal hover:text-brass-muted transition-colors">+39 090 240 3220</a>
              </div>
              <div className="flex items-center gap-4">
                <Mail size={18} strokeWidth={1.3} className="text-brass-muted" />
                <a href="mailto:messinacavour@luxosa.it" className="text-[18px] font-light text-charcoal hover:text-brass-muted transition-colors">messinacavour@luxosa.it</a>
              </div>
              <div className="flex items-start gap-4">
                <Clock size={18} strokeWidth={1.3} className="text-brass-muted flex-shrink-0 mt-0.5" />
                <div className="text-[18px] font-light text-charcoal">
                  <p>Martedì — Venerdì: 09:00 — 18:30</p>
                  <p>Sabato: 09:00 — 19:00</p>
                </div>
              </div>
            </motion.div>

            {/* Map embed placeholder */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 1.2, ease: [0.25, 0.1, 0, 1], delay: 0.45 }} className="mt-10 aspect-[16/9] bg-ecru overflow-hidden">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3132.5!2d15.5544!3d38.1937!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMzjCsDExJzM3LjMiTiAxNcKwMzMnMTUuOCJF!5e0!3m2!1sit!2sit!4v1700000000000!5m2!1sit!2sit"
                width="100%"
                height="100%"
                style={{ border: 0, filter: 'grayscale(30%) contrast(95%)' }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Luxosa Messina Cavour"
              />
            </motion.div>
          </div>

          {/* CTA */}
          <div className="lg:pt-16">
            <motion.div initial={{ opacity: 0, y: 25 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 1.2, ease: [0.25, 0.1, 0, 1], delay: 0.3 }} className="bg-charcoal text-ivory p-10 md:p-12 mb-8">
              <h3 className="font-serif text-[24px] md:text-[28px] font-light text-ivory mb-4">Prenoti una consulenza</h3>
              <p className="text-[17px] md:text-[18px] leading-[1.8] text-ivory/55 font-light mb-8">La prima consulenza è il momento in cui ascoltiamo, osserviamo e comprendiamo. È il primo passo di un percorso di cura pensato interamente per Lei.</p>
              <div className="space-y-4">
                <Link to="/contatti" className="group flex items-center justify-center gap-3 bg-ivory text-charcoal text-[12px] tracking-[0.2em] uppercase font-light px-8 py-4 hover:bg-brass-light transition-all duration-500 w-full">
                  Prenota online <ArrowRight size={14} strokeWidth={1.5} className="transition-transform duration-500 group-hover:translate-x-1" />
                </Link>
                <a href="tel:+390902403220" className="flex items-center justify-center gap-3 text-[12px] tracking-[0.2em] uppercase text-ivory/70 font-light border border-ivory/20 px-8 py-4 hover:border-ivory/40 hover:text-ivory transition-all duration-500 w-full">
                  <Phone size={14} strokeWidth={1.5} /> Chiama ora
                </a>
              </div>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 1.2, ease: [0.25, 0.1, 0, 1], delay: 0.45 }} className="bg-ecru/50 p-8 md:p-10">
              <h4 className="text-[11px] tracking-[0.3em] uppercase text-brass-muted font-light mb-4">Informazioni Utili</h4>
              <div className="space-y-4 text-[17px] font-light text-anthracite/65">
                <p>• La consulenza iniziale ha una durata di circa 30 minuti</p>
                <p>• Si consiglia di arrivare 5 minuti prima dell'appuntamento</p>
                <p>• Parcheggio convenzionato nelle vicinanze</p>
                <p>• Accessibilità garantita per persone con mobilità ridotta</p>
              </div>
            </motion.div>

            <motion.div initial={{ opacity: 0 }} animate={inView ? { opacity: 1 } : {}} transition={{ duration: 1, ease: [0.25, 0.1, 0, 1], delay: 0.6 }} className="mt-8 pt-8 border-t border-sand/50 text-center">
              <p className="font-serif text-[20px] italic text-charcoal/50 font-light">Si affidi a un metodo di cura pensato per Lei.</p>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}

// --- Main Page Component ---
export default function MessinaCavourPage() {
  return (
    <>
      <MCHero />
      <MCBackLink />
      <MCAbout />
      <MCSpace />
      <MCMethod />
      <MCTeam />
      <MCServices />
      <MCTestimonials />
      <MCContact />
    </>
  );
}
