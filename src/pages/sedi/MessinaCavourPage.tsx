import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Phone, Mail, Clock, ArrowRight, ArrowLeft, Ear, Search, Fingerprint, Heart, Shield, Sparkles } from 'lucide-react';

/* ============================================================
   LUXOSA MESSINA CAVOUR — Mini-sito onepage
   ============================================================ */

// --- Hero ---
function MCHero() {
  return (
    <section className="relative h-[75vh] min-h-[550px] max-h-[850px] overflow-hidden">
      <div className="absolute inset-0">
        <img src="/images/messina-new.jpg" alt="Luxosa Messina Cavour" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-b from-deep/55 via-deep/30 to-deep/65" />
        <div className="absolute inset-0 bg-gradient-to-r from-deep/30 to-transparent" />
      </div>
      <div className="relative h-full flex flex-col justify-end pb-20 md:pb-28">
        <div className="max-w-[1400px] mx-auto px-6 md:px-10 lg:px-16 w-full">
          <motion.div initial={{ width: 0 }} animate={{ width: 50 }} transition={{ duration: 1, delay: 0.2 }} className="h-[1px] bg-brass-light mb-6" />
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.3 }} className="flex items-center gap-2 mb-4">
            <MapPin size={14} strokeWidth={1.3} className="text-brass-light" />
            <span className="text-[11px] md:text-[12px] tracking-[0.3em] uppercase text-brass-light font-light">Messina — Via Cavour</span>
          </motion.div>
          <motion.h1 initial={{ opacity: 0, y: 25 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, delay: 0.5, ease: [0.25, 0.1, 0, 1] }} className="font-serif text-[36px] md:text-[52px] lg:text-[64px] text-white font-light leading-[1.08] tracking-[0.02em] max-w-3xl">
            Luxosa<br />Messina Cavour.
          </motion.h1>
          <motion.p initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.75 }} className="mt-5 text-white/60 text-[15px] md:text-[17px] font-light leading-relaxed max-w-xl tracking-wide">
            La cura evoluta nel cuore della Sicilia orientale. Un luogo dove competenza, metodo e accoglienza si incontrano.
          </motion.p>
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.95 }} className="mt-8 flex flex-col sm:flex-row gap-4">
            <a href="#mc-contatti" className="inline-flex items-center justify-center text-[12px] tracking-[0.2em] uppercase font-light text-deep bg-ivory hover:bg-white px-8 py-4 transition-all duration-500">Prenota una consulenza</a>
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
    <section id="mc-about" className="py-24 md:py-32 bg-ivory">
      <div className="max-w-[1400px] mx-auto px-6 md:px-10 lg:px-16" ref={ref}>
        <div className="grid lg:grid-cols-2 gap-16 lg:gap-24 items-center">
          <div>
            <motion.div initial={{ opacity: 0, y: 20 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.8 }}>
              <span className="text-[11px] tracking-[0.35em] uppercase text-brass-muted font-light">La Sede</span>
              <div className="w-10 h-[1px] bg-brass mt-4 mb-8" />
            </motion.div>
            <motion.h2 initial={{ opacity: 0, y: 25 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.8, delay: 0.15 }} className="font-serif text-[30px] md:text-[38px] lg:text-[44px] font-light leading-[1.12] text-charcoal">
              Un punto di riferimento<br />per la cura evoluta.
            </motion.h2>
            <motion.div initial={{ opacity: 0, y: 20 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.8, delay: 0.3 }} className="mt-8 space-y-5">
              <p className="text-[15px] md:text-[16px] leading-[1.8] text-anthracite/80 font-light">
                Luxosa Messina Cavour è la prima sede della maison. Situata nel cuore di Messina, lungo la storica Via Cavour, rappresenta l'espressione più completa della visione Luxosa: un luogo dove la cura di cute e capelli diventa scienza, metodo e accompagnamento.
              </p>
              <p className="text-[15px] md:text-[16px] leading-[1.8] text-anthracite/80 font-light">
                Lo spazio è stato progettato per offrire un'esperienza di accoglienza totale: ambienti luminosi, materiali naturali, un'atmosfera che comunica ordine, raffinatezza e protezione. Ogni dettaglio riflette il metodo Luxosa.
              </p>
              <p className="text-[15px] md:text-[16px] leading-[1.8] text-anthracite/80 font-light">
                Qui, un team altamente formato accoglie ogni cliente con competenza e sensibilità, costruendo percorsi personalizzati fondati sull'ascolto, sull'analisi e sulla continuità della relazione.
              </p>
            </motion.div>
          </div>
          <motion.div initial={{ opacity: 0, x: 30 }} animate={inView ? { opacity: 1, x: 0 } : {}} transition={{ duration: 1, delay: 0.3 }} className="relative">
            <div className="aspect-[3/4] overflow-hidden">
              <img src="/images/space-new.jpg" alt="Interno Luxosa Messina Cavour" className="w-full h-full object-cover" />
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
    <section id="mc-spazio" className="py-24 md:py-32 bg-ecru/50">
      <div className="max-w-[1400px] mx-auto px-6 md:px-10 lg:px-16" ref={ref}>
        <div className="text-center max-w-2xl mx-auto mb-14 md:mb-20">
          <motion.span initial={{ opacity: 0, y: 15 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.7 }} className="text-[11px] tracking-[0.35em] uppercase text-brass-muted font-light">Lo Spazio</motion.span>
          <motion.div initial={{ width: 0 }} animate={inView ? { width: 40 } : {}} transition={{ duration: 0.8, delay: 0.15 }} className="h-[1px] bg-brass mx-auto mt-4 mb-8" />
          <motion.h2 initial={{ opacity: 0, y: 25 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.8, delay: 0.2 }} className="font-serif text-[30px] md:text-[38px] lg:text-[44px] font-light leading-[1.1] text-charcoal">
            Progettato per accogliere,<br />proteggere, rigenerare.
          </motion.h2>
        </div>

        <div className="grid md:grid-cols-3 gap-4 md:gap-5">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.8, delay: 0.25 }} className="aspect-[3/4] md:aspect-auto md:row-span-2 overflow-hidden">
            <img src="/images/space-new.jpg" alt="Salone" className="w-full h-full object-cover hover:scale-105 transition-transform duration-1000" />
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 30 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.8, delay: 0.35 }} className="aspect-[4/3] overflow-hidden">
            <img src="/images/salon-reception-new.jpg" alt="Reception" className="w-full h-full object-cover hover:scale-105 transition-transform duration-1000" />
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 30 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.8, delay: 0.45 }} className="aspect-[4/3] overflow-hidden">
            <img src="/images/space-detail-new.jpg" alt="Dettaglio" className="w-full h-full object-cover hover:scale-105 transition-transform duration-1000" />
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 30 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.8, delay: 0.55 }} className="aspect-[4/3] overflow-hidden">
            <img src="/images/salon-wash-new.jpg" alt="Area lavaggio" className="w-full h-full object-cover hover:scale-105 transition-transform duration-1000" />
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 30 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.8, delay: 0.65 }} className="aspect-[4/3] overflow-hidden">
            <img src="/images/stylist-work-new.jpg" alt="Ambiente" className="w-full h-full object-cover hover:scale-105 transition-transform duration-1000" />
          </motion.div>
        </div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.7, delay: 0.7 }} className="mt-12 flex flex-wrap justify-center gap-x-10 gap-y-4">
          {['Luce naturale', 'Materiali pregiati', 'Comfort acustico', 'Aria purificata', 'Design italiano'].map((q) => (
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
    { icon: Ear, title: 'Ascolto', text: 'Il primo incontro è dedicato alla conoscenza. Ascoltiamo la storia dei suoi capelli, le sue abitudini e i suoi desideri.' },
    { icon: Search, title: 'Analisi', text: 'Attraverso strumenti professionali, analizziamo lo stato di cute e capelli per costruire una base solida.' },
    { icon: Fingerprint, title: 'Percorso personalizzato', text: 'Definiamo insieme un piano di cura su misura, con obiettivi chiari e tappe misurabili.' },
    { icon: Heart, title: 'Trattamento', text: 'Ogni gesto è parte di un rituale di cura studiato per offrire risultato e benessere.' },
    { icon: Shield, title: 'Protezione', text: 'Protocolli pensati per proteggere e rispettare la natura di cute e capelli.' },
    { icon: Sparkles, title: 'Continuità', text: 'La relazione non termina con l\'appuntamento. Accompagniamo la cliente nel tempo.' },
  ];

  return (
    <section id="mc-metodo" className="py-24 md:py-32 bg-ivory">
      <div className="max-w-[1400px] mx-auto px-6 md:px-10 lg:px-16" ref={ref}>
        <div className="text-center max-w-2xl mx-auto mb-16 md:mb-20">
          <motion.span initial={{ opacity: 0, y: 15 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.7 }} className="text-[11px] tracking-[0.35em] uppercase text-brass-muted font-light">Il Metodo</motion.span>
          <motion.div initial={{ width: 0 }} animate={inView ? { width: 40 } : {}} transition={{ duration: 0.8, delay: 0.15 }} className="h-[1px] bg-brass mx-auto mt-4 mb-8" />
          <motion.h2 initial={{ opacity: 0, y: 25 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.8, delay: 0.2 }} className="font-serif text-[30px] md:text-[38px] lg:text-[44px] font-light leading-[1.1] text-charcoal">Come lavoriamo<br />nella sede di Messina.</motion.h2>
          <motion.p initial={{ opacity: 0, y: 15 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.7, delay: 0.35 }} className="mt-6 text-[15px] md:text-[16px] leading-[1.8] text-anthracite/70 font-light">Il Metodo Luxosa viene applicato con la stessa rigore e la stessa sensibilità in ogni sede.</motion.p>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-10">
          {steps.map((s, i) => (
            <motion.div key={s.title} initial={{ opacity: 0, y: 25 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.7, delay: 0.2 + i * 0.08 }} className="group">
              <div className="flex items-start gap-5">
                <div className="flex-shrink-0 w-12 h-12 rounded-full border border-brass/25 flex items-center justify-center group-hover:border-brass/50 transition-colors duration-500">
                  <s.icon size={20} strokeWidth={1.2} className="text-brass-muted" />
                </div>
                <div>
                  <h3 className="font-serif text-[20px] md:text-[22px] font-light text-charcoal mb-2 tracking-wide">{s.title}</h3>
                  <p className="text-[14px] leading-[1.75] text-anthracite/60 font-light">{s.text}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// --- Il Team ---
function MCTeam() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <section id="mc-team" className="py-24 md:py-32 bg-charcoal text-ivory">
      <div className="max-w-[1400px] mx-auto px-6 md:px-10 lg:px-16" ref={ref}>
        <div className="grid lg:grid-cols-2 gap-16 lg:gap-24 items-center">
          <div>
            <motion.span initial={{ opacity: 0, y: 15 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.7 }} className="text-[11px] tracking-[0.35em] uppercase text-brass-light font-light">Il Team</motion.span>
            <motion.div initial={{ width: 0 }} animate={inView ? { width: 40 } : {}} transition={{ duration: 0.8, delay: 0.15 }} className="h-[1px] bg-brass mt-4 mb-8" />
            <motion.h2 initial={{ opacity: 0, y: 25 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.8, delay: 0.2 }} className="font-serif text-[30px] md:text-[38px] lg:text-[44px] font-light leading-[1.1] text-ivory">
              Professioniste dedicate<br />alla cura.
            </motion.h2>
            <motion.div initial={{ opacity: 0, y: 20 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.8, delay: 0.35 }} className="mt-8 space-y-5">
              <p className="text-[15px] md:text-[16px] leading-[1.8] text-ivory/65 font-light">
                Il team di Luxosa Messina Cavour è composto da professioniste selezionate per competenza, sensibilità e dedizione. Ogni membro del team condivide la visione Luxosa e ne incarna i valori.
              </p>
              <p className="text-[15px] md:text-[16px] leading-[1.8] text-ivory/65 font-light">
                La formazione è continua e costante: aggiornamento tecnico, approfondimento metodologico, sviluppo della capacità di ascolto e relazione con la cliente.
              </p>
            </motion.div>
            <motion.div initial={{ opacity: 0, y: 15 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.7, delay: 0.5 }} className="mt-10 flex flex-wrap gap-6">
              {['Formazione continua', 'Competenza certificata', 'Ascolto empatico'].map((q) => (
                <span key={q} className="text-[11px] tracking-[0.2em] uppercase text-brass-light/60 font-light border border-brass/20 px-4 py-2">{q}</span>
              ))}
            </motion.div>
          </div>
          <motion.div initial={{ opacity: 0, x: 30 }} animate={inView ? { opacity: 1, x: 0 } : {}} transition={{ duration: 1, delay: 0.3 }} className="relative">
            <div className="aspect-[3/4] overflow-hidden">
              <img src="/images/team-new.jpg" alt="Il team Luxosa Messina" className="w-full h-full object-cover" />
            </div>
            <div className="absolute -top-4 -right-4 w-16 h-16 border-t border-r border-brass/25" />
          </motion.div>
        </div>
      </div>
    </section>
  );
}

// --- Servizi della sede ---
function MCServices() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });

  const services = [
    { title: 'Consulenza Diagnostica', desc: 'Analisi approfondita dello stato di cute e capelli. Il punto di partenza di ogni percorso.' },
    { title: 'Percorsi Cute & Benessere', desc: 'Trattamenti mirati al riequilibrio del cuoio capelluto e alla prevenzione.' },
    { title: 'Cura del Capello', desc: 'Programmi per restituire forza, elasticità e luminosità alla fibra capillare.' },
    { title: 'Trasformazione Colore', desc: 'Studio cromatico personalizzato nel rispetto della struttura naturale.' },
    { title: 'Rituali Signature', desc: 'Esperienze esclusive che uniscono trattamento e benessere sensoriale.' },
    { title: 'Mantenimento Evoluto', desc: 'Piani continuativi per preservare e potenziare i risultati nel tempo.' },
  ];

  return (
    <section id="mc-servizi" className="py-24 md:py-32 bg-ivory-warm">
      <div className="max-w-[1400px] mx-auto px-6 md:px-10 lg:px-16" ref={ref}>
        <div className="max-w-2xl mb-14 md:mb-20">
          <motion.span initial={{ opacity: 0, y: 15 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.7 }} className="text-[11px] tracking-[0.35em] uppercase text-brass-muted font-light">I Percorsi Disponibili</motion.span>
          <motion.div initial={{ width: 0 }} animate={inView ? { width: 40 } : {}} transition={{ duration: 0.8, delay: 0.15 }} className="h-[1px] bg-brass mt-4 mb-8" />
          <motion.h2 initial={{ opacity: 0, y: 25 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.8, delay: 0.2 }} className="font-serif text-[30px] md:text-[38px] lg:text-[44px] font-light leading-[1.12] text-charcoal">
            Cosa offriamo<br />nella sede di Messina.
          </motion.h2>
        </div>

        <div className="space-y-0">
          {services.map((s, i) => (
            <motion.div key={s.title} initial={{ opacity: 0, y: 20 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.6, delay: 0.2 + i * 0.08 }} className="group border-t border-sand/60 py-8 md:py-10">
              <div className="grid md:grid-cols-12 gap-4 md:gap-8 items-center">
                <div className="md:col-span-1">
                  <span className="font-serif text-[24px] md:text-[28px] text-brass/35 font-light">{String(i + 1).padStart(2, '0')}</span>
                </div>
                <div className="md:col-span-4">
                  <h3 className="font-serif text-[20px] md:text-[24px] font-light text-charcoal tracking-wide">{s.title}</h3>
                </div>
                <div className="md:col-span-6">
                  <p className="text-[14px] leading-[1.75] text-anthracite/60 font-light">{s.desc}</p>
                </div>
                <div className="md:col-span-1 flex justify-end">
                  <ArrowRight size={16} strokeWidth={1.2} className="text-brass/30 group-hover:text-brass group-hover:translate-x-1 transition-all duration-500" />
                </div>
              </div>
            </motion.div>
          ))}
          <div className="border-t border-sand/60" />
        </div>
      </div>
    </section>
  );
}

// --- Testimonials ---
function MCTestimonials() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });

  const testimonials = [
    { quote: 'Da Luxosa Messina ho trovato qualcosa che non avevo mai trovato altrove: qualcuno che ha davvero ascoltato i miei capelli prima di toccarli.', name: 'Francesca M.', detail: 'Cliente dal 2022' },
    { quote: 'Non è solo un trattamento. È un percorso che ti accompagna, ti spiega, ti rassicura. Mi sono sentita compresa fin dal primo momento.', name: 'Giulia R.', detail: 'Percorso Equilibrio Cute' },
    { quote: 'La competenza si percepisce in ogni dettaglio. Dopo anni di tentativi, finalmente i miei capelli hanno trovato il loro equilibrio.', name: 'Elena D.', detail: 'Cliente dal 2021' },
  ];

  return (
    <section className="py-24 md:py-32 bg-ecru/40">
      <div className="max-w-[1400px] mx-auto px-6 md:px-10 lg:px-16" ref={ref}>
        <div className="text-center mb-14 md:mb-20">
          <motion.span initial={{ opacity: 0, y: 15 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.7 }} className="text-[11px] tracking-[0.35em] uppercase text-brass-muted font-light">Voci dalla Sede</motion.span>
          <motion.div initial={{ width: 0 }} animate={inView ? { width: 40 } : {}} transition={{ duration: 0.8, delay: 0.15 }} className="h-[1px] bg-brass mx-auto mt-4 mb-8" />
          <motion.h2 initial={{ opacity: 0, y: 25 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.8, delay: 0.2 }} className="font-serif text-[30px] md:text-[38px] lg:text-[44px] font-light leading-[1.1] text-charcoal">Chi si è affidata a noi.</motion.h2>
        </div>
        <div className="grid md:grid-cols-3 gap-10 md:gap-8">
          {testimonials.map((t, i) => (
            <motion.div key={t.name} initial={{ opacity: 0, y: 20 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.7, delay: 0.25 + i * 0.1 }} className="text-center">
              <p className="font-serif text-[17px] md:text-[18px] italic font-light leading-[1.7] text-charcoal/60 mb-5">"{t.quote}"</p>
              <p className="text-[13px] tracking-[0.1em] uppercase text-charcoal/80 font-light">{t.name}</p>
              <p className="text-[11px] tracking-[0.15em] text-stone font-light mt-1">{t.detail}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// --- Contact & Info ---
function MCContact() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <section id="mc-contatti" className="py-24 md:py-32 bg-ivory">
      <div className="max-w-[1400px] mx-auto px-6 md:px-10 lg:px-16" ref={ref}>
        <div className="grid lg:grid-cols-2 gap-16 lg:gap-24">
          {/* Map / Info */}
          <div>
            <motion.div initial={{ opacity: 0, y: 20 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.8 }}>
              <span className="text-[11px] tracking-[0.35em] uppercase text-brass-muted font-light">Dove Trovarci</span>
              <div className="w-10 h-[1px] bg-brass mt-4 mb-8" />
            </motion.div>
            <motion.h2 initial={{ opacity: 0, y: 25 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.8, delay: 0.15 }} className="font-serif text-[30px] md:text-[38px] font-light leading-[1.12] text-charcoal mb-8">
              Luxosa Messina Cavour
            </motion.h2>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.8, delay: 0.3 }} className="space-y-5">
              <div className="flex items-start gap-4">
                <MapPin size={18} strokeWidth={1.3} className="text-brass-muted flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-[15px] font-light text-charcoal">Via Cavour</p>
                  <p className="text-[14px] font-light text-anthracite/60">98122 Messina (ME), Italia</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <Phone size={18} strokeWidth={1.3} className="text-brass-muted" />
                <a href="tel:+390000000000" className="text-[15px] font-light text-charcoal hover:text-brass-muted transition-colors">+39 000 000 0000</a>
              </div>
              <div className="flex items-center gap-4">
                <Mail size={18} strokeWidth={1.3} className="text-brass-muted" />
                <a href="mailto:messina@luxosa.it" className="text-[15px] font-light text-charcoal hover:text-brass-muted transition-colors">messina@luxosa.it</a>
              </div>
              <div className="flex items-start gap-4">
                <Clock size={18} strokeWidth={1.3} className="text-brass-muted flex-shrink-0 mt-0.5" />
                <div className="text-[15px] font-light text-charcoal">
                  <p>Martedì — Sabato: 09:00 — 19:00</p>
                  <p className="text-anthracite/50 text-[13px] mt-1">Domenica e Lunedì chiuso · Su appuntamento</p>
                </div>
              </div>
            </motion.div>

            {/* Map embed placeholder */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.8, delay: 0.45 }} className="mt-10 aspect-[16/9] bg-ecru overflow-hidden">
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
            <motion.div initial={{ opacity: 0, y: 25 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.8, delay: 0.3 }} className="bg-charcoal text-ivory p-10 md:p-12 mb-8">
              <h3 className="font-serif text-[24px] md:text-[28px] font-light text-ivory mb-4">Prenoti una consulenza</h3>
              <p className="text-[14px] md:text-[15px] leading-[1.8] text-ivory/55 font-light mb-8">La prima consulenza è il momento in cui ascoltiamo, osserviamo e comprendiamo. È il primo passo di un percorso di cura pensato interamente per Lei.</p>
              <div className="space-y-4">
                <Link to="/contatti" className="group flex items-center justify-center gap-3 bg-ivory text-charcoal text-[12px] tracking-[0.2em] uppercase font-light px-8 py-4 hover:bg-brass-light transition-all duration-500 w-full">
                  Prenota online <ArrowRight size={14} strokeWidth={1.5} className="transition-transform duration-500 group-hover:translate-x-1" />
                </Link>
                <a href="tel:+390000000000" className="flex items-center justify-center gap-3 text-[12px] tracking-[0.2em] uppercase text-ivory/70 font-light border border-ivory/20 px-8 py-4 hover:border-ivory/40 hover:text-ivory transition-all duration-500 w-full">
                  <Phone size={14} strokeWidth={1.5} /> Chiama ora
                </a>
              </div>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.8, delay: 0.45 }} className="bg-ecru/50 p-8 md:p-10">
              <h4 className="text-[11px] tracking-[0.3em] uppercase text-brass-muted font-light mb-4">Informazioni Utili</h4>
              <div className="space-y-4 text-[14px] font-light text-anthracite/65">
                <p>• La consulenza iniziale ha una durata di circa 30 minuti</p>
                <p>• Si consiglia di arrivare 5 minuti prima dell'appuntamento</p>
                <p>• Parcheggio convenzionato nelle vicinanze</p>
                <p>• Accessibilità garantita per persone con mobilità ridotta</p>
              </div>
            </motion.div>

            <motion.div initial={{ opacity: 0 }} animate={inView ? { opacity: 1 } : {}} transition={{ duration: 0.7, delay: 0.6 }} className="mt-8 pt-8 border-t border-sand/50 text-center">
              <p className="font-serif text-[17px] italic text-charcoal/50 font-light">Si affidi a un metodo di cura pensato per Lei.</p>
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
