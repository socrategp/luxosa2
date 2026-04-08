import PageHero from '../components/PageHero';
import { motion, useInView } from 'framer-motion';
import { useRef, useState } from 'react';
import { Send } from 'lucide-react';

import { premiumEase } from '../lib/animations';

function ContactMain() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({
    nome: '',
    cognome: '',
    telefono: '',
    email: '',
    richiesta: '',
    preferenza: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  const inputClass = "w-full bg-transparent border-b border-sand/60 py-3 text-[14px] font-light text-anthracite placeholder:text-anthracite/30 focus:outline-none focus:border-brass/60 transition-colors duration-400";
  const labelClass = "block text-[10px] tracking-[0.25em] uppercase text-anthracite/40 font-light mb-2";

  return (
    <section className="py-32 md:py-48 lg:py-56 bg-ivory" ref={ref}>
      <div className="max-w-[1400px] mx-auto px-6 md:px-10 lg:px-16">
        <div className="grid lg:grid-cols-[1.2fr_1fr] gap-16 lg:gap-24">

          {/* Form */}
          <div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 1, ease: premiumEase }}
              className="mb-12"
            >
              <span className="text-[11px] tracking-[0.35em] uppercase text-brass-muted font-light">Modulo di prenotazione</span>
              <div className="h-[1px] w-10 bg-brass mt-4 mb-6" />
              <p className="text-[14px] leading-[1.8] text-anthracite/60 font-light">Compila i campi qui sotto. Ti risponderemo entro 24 ore.</p>
            </motion.div>

            {submitted ? (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: premiumEase }}
                className="py-12 border-t border-sand/40"
              >
                <div className="h-[1px] w-8 bg-brass mb-6" />
                <p className="font-serif text-[24px] md:text-[28px] font-light text-charcoal mb-4">Grazie.</p>
                <p className="text-[14px] leading-[1.8] text-anthracite/65 font-light">Abbiamo ricevuto la tua richiesta. Ti risponderemo entro 24 ore.</p>
              </motion.div>
            ) : (
              <motion.form
                initial={{ opacity: 0, y: 20 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 1, ease: premiumEase, delay: 0.2 }}
                onSubmit={handleSubmit}
                className="space-y-8"
              >
                <div className="grid sm:grid-cols-2 gap-6">
                  <div>
                    <label className={labelClass}>Nome</label>
                    <input type="text" required placeholder="Il tuo nome" className={inputClass} value={form.nome} onChange={e => setForm({ ...form, nome: e.target.value })} />
                  </div>
                  <div>
                    <label className={labelClass}>Cognome</label>
                    <input type="text" required placeholder="Il tuo cognome" className={inputClass} value={form.cognome} onChange={e => setForm({ ...form, cognome: e.target.value })} />
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-6">
                  <div>
                    <label className={labelClass}>Telefono</label>
                    <input type="tel" required placeholder="Il tuo numero" className={inputClass} value={form.telefono} onChange={e => setForm({ ...form, telefono: e.target.value })} />
                  </div>
                  <div>
                    <label className={labelClass}>Email</label>
                    <input type="email" required placeholder="La tua email" className={inputClass} value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} />
                  </div>
                </div>

                <div>
                  <label className={labelClass}>Qual è la tua richiesta principale?</label>
                  <textarea
                    rows={4}
                    placeholder="Raccontaci in poche righe cosa cerchi..."
                    className={`${inputClass} resize-none`}
                    value={form.richiesta}
                    onChange={e => setForm({ ...form, richiesta: e.target.value })}
                  />
                </div>

                <div>
                  <label className={labelClass}>Preferenza giorno/orario <span className="normal-case text-anthracite/30">(non vincolante)</span></label>
                  <input type="text" placeholder="Es. martedì mattina, venerdì pomeriggio" className={inputClass} value={form.preferenza} onChange={e => setForm({ ...form, preferenza: e.target.value })} />
                </div>

                <div className="pt-4">
                  <button
                    type="submit"
                    className="group relative overflow-hidden inline-flex items-center gap-3 bg-charcoal text-ivory text-[12px] tracking-[0.2em] uppercase font-light px-10 py-5"
                  >
                    <span className="absolute inset-0 bg-deep translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-[cubic-bezier(0.25,0.1,0,1)]" />
                    <span className="relative z-10 flex items-center gap-3">
                      Invia la tua richiesta <Send size={14} strokeWidth={1.5} className="transition-transform duration-500 group-hover:translate-x-1" />
                    </span>
                  </button>
                </div>
              </motion.form>
            )}
          </div>

          {/* Contact channels */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 1, ease: premiumEase, delay: 0.3 }}
          >
            <span className="text-[11px] tracking-[0.35em] uppercase text-brass-muted font-light">Canali di contatto</span>
            <div className="h-[1px] w-10 bg-brass mt-4 mb-10" />

            <div className="space-y-6">
              {[
                { label: 'Telefono', value: '+39 090 240 3220', href: 'tel:+390902403220' },
                { label: 'WhatsApp', value: '+39 090 240 3220 — risposta entro 24h nei giorni lavorativi', href: 'https://wa.me/390902403220' },
                { label: 'Instagram', value: '@luxosa — seguici e contattaci in DM', href: '#' },
                { label: 'Email', value: 'messinacavour@luxosa.it — per richieste specifiche', href: 'mailto:messinacavour@luxosa.it' },
              ].map((c) => (
                <div key={c.label} className="grid grid-cols-[90px_1fr] gap-4 border-t border-sand/30 pt-5">
                  <span className="text-[10px] tracking-[0.25em] uppercase text-anthracite/35 font-light pt-0.5">{c.label}</span>
                  <a href={c.href} className="text-[14px] font-light text-anthracite/70 hover:text-anthracite transition-colors duration-400 leading-[1.7]">{c.value}</a>
                </div>
              ))}
            </div>

            <div className="mt-12 border-t border-sand/30 pt-8">
              <p className="font-serif text-[18px] md:text-[20px] italic text-anthracite/50 font-light leading-[1.6]">
                "La prima consulenza è il momento in cui ascoltiamo, osserviamo e comprendiamo."
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

function ContactClose() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <section className="py-32 md:py-48 lg:py-64 bg-charcoal" ref={ref}>
      <div className="max-w-[900px] mx-auto px-6 md:px-10 lg:px-16 text-center">
        <motion.div
          initial={{ width: 0 }}
          animate={inView ? { width: 40 } : {}}
          transition={{ duration: 1.2, ease: premiumEase }}
          className="h-[1px] bg-brass-light/40 mx-auto mb-12"
        />
        <motion.p
          initial={{ opacity: 0, y: 25 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 1.2, ease: premiumEase, delay: 0.2 }}
          className="font-serif text-[30px] md:text-[38px] lg:text-[44px] font-light text-ivory/85 leading-[1.2]"
        >
          Non sei una prenotazione.<br />
          Sei l'inizio di un percorso.
        </motion.p>
        <motion.p
          initial={{ opacity: 0, y: 15 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 1, ease: premiumEase, delay: 0.5 }}
          className="mt-8 text-[11px] tracking-[0.35em] uppercase text-brass-light/60 font-light"
        >
          Ama. Splendi. Osa.
        </motion.p>
      </div>
    </section>
  );
}

export default function ContattiPage() {
  return (
    <>
      <PageHero
        label="Contatti"
        title="Prenota il tuo incontro."
        subtitle="La tua prima esperienza Luxosa inizia con un incontro. Non arriviamo con un menu pronto. Arriviamo con attenzione."
        image="/images/salon-reception-new.jpg"
      />
      <ContactMain />
      <ContactClose />
    </>
  );
}
