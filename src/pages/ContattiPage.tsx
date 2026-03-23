import PageHero from '../components/PageHero';
import { motion, useInView } from 'framer-motion';
import { useRef, useState } from 'react';
import { Phone, Mail, MapPin, Clock, Send } from 'lucide-react';

function ContactForm() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });
  const [submitted, setSubmitted] = useState(false);

  return (
    <section className="py-28 md:py-36 bg-ivory">
      <div className="max-w-[1400px] mx-auto px-6 md:px-10 lg:px-16" ref={ref}>
        <div className="grid lg:grid-cols-2 gap-16 lg:gap-24">
          {/* Form */}
          <div>
            <motion.div initial={{ opacity: 0, y: 20 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.8 }}>
              <span className="text-[11px] tracking-[0.35em] uppercase text-brass-muted font-light">Scriva a Luxosa</span>
              <div className="w-10 h-[1px] bg-brass mt-4 mb-8" />
            </motion.div>
            <motion.h2 initial={{ opacity: 0, y: 25 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.8, delay: 0.15 }} className="font-serif text-[30px] md:text-[38px] font-light leading-[1.12] text-charcoal mb-8">
              Prenoti una consulenza<br />o richieda informazioni.
            </motion.h2>

            {submitted ? (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-ecru/50 p-10 text-center">
                <p className="font-serif text-[22px] text-charcoal font-light mb-3">Grazie per averci contattata.</p>
                <p className="text-[14px] text-anthracite/60 font-light">Le risponderemo entro 24 ore.</p>
              </motion.div>
            ) : (
              <motion.form initial={{ opacity: 0, y: 20 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.8, delay: 0.3 }} onSubmit={(e) => { e.preventDefault(); setSubmitted(true); }} className="space-y-6">
                <div className="grid sm:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-[11px] tracking-[0.2em] uppercase text-anthracite/50 font-light mb-2">Nome</label>
                    <input type="text" required className="w-full bg-transparent border-b border-sand focus:border-brass outline-none py-3 text-[15px] font-light text-charcoal placeholder:text-stone/50 transition-colors" placeholder="Il suo nome" />
                  </div>
                  <div>
                    <label className="block text-[11px] tracking-[0.2em] uppercase text-anthracite/50 font-light mb-2">Cognome</label>
                    <input type="text" required className="w-full bg-transparent border-b border-sand focus:border-brass outline-none py-3 text-[15px] font-light text-charcoal placeholder:text-stone/50 transition-colors" placeholder="Il suo cognome" />
                  </div>
                </div>
                <div className="grid sm:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-[11px] tracking-[0.2em] uppercase text-anthracite/50 font-light mb-2">Email</label>
                    <input type="email" required className="w-full bg-transparent border-b border-sand focus:border-brass outline-none py-3 text-[15px] font-light text-charcoal placeholder:text-stone/50 transition-colors" placeholder="La sua email" />
                  </div>
                  <div>
                    <label className="block text-[11px] tracking-[0.2em] uppercase text-anthracite/50 font-light mb-2">Telefono</label>
                    <input type="tel" className="w-full bg-transparent border-b border-sand focus:border-brass outline-none py-3 text-[15px] font-light text-charcoal placeholder:text-stone/50 transition-colors" placeholder="Il suo numero" />
                  </div>
                </div>
                <div>
                  <label className="block text-[11px] tracking-[0.2em] uppercase text-anthracite/50 font-light mb-2">Sede di riferimento</label>
                  <select className="w-full bg-transparent border-b border-sand focus:border-brass outline-none py-3 text-[15px] font-light text-charcoal transition-colors">
                    <option value="">Seleziona una sede</option>
                    <option value="messina-cavour">Luxosa Messina Cavour</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[11px] tracking-[0.2em] uppercase text-anthracite/50 font-light mb-2">Messaggio</label>
                  <textarea rows={4} className="w-full bg-transparent border-b border-sand focus:border-brass outline-none py-3 text-[15px] font-light text-charcoal placeholder:text-stone/50 transition-colors resize-none" placeholder="Come possiamo aiutarla?" />
                </div>
                <div className="pt-4">
                  <button type="submit" className="group inline-flex items-center gap-3 bg-charcoal text-ivory text-[12px] tracking-[0.2em] uppercase font-light px-10 py-4.5 hover:bg-deep transition-all duration-500">
                    Invia richiesta <Send size={14} strokeWidth={1.5} className="transition-transform duration-500 group-hover:translate-x-1" />
                  </button>
                </div>
              </motion.form>
            )}
          </div>

          {/* Info */}
          <motion.div initial={{ opacity: 0, x: 30 }} animate={inView ? { opacity: 1, x: 0 } : {}} transition={{ duration: 0.8, delay: 0.3 }} className="lg:pt-16">
            <div className="bg-ecru/40 p-8 md:p-10 mb-8">
              <h3 className="font-serif text-[22px] font-light text-charcoal mb-6">Luxosa Messina Cavour</h3>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <MapPin size={16} strokeWidth={1.3} className="text-brass-muted flex-shrink-0 mt-0.5" />
                  <p className="text-[14px] font-light text-anthracite/70">Via Cavour<br />98122 Messina (ME), Italia</p>
                </div>
                <div className="flex items-center gap-3">
                  <Phone size={16} strokeWidth={1.3} className="text-brass-muted" />
                  <a href="tel:+390000000000" className="text-[14px] font-light text-anthracite/70 hover:text-anthracite transition-colors">+39 000 000 0000</a>
                </div>
                <div className="flex items-center gap-3">
                  <Mail size={16} strokeWidth={1.3} className="text-brass-muted" />
                  <a href="mailto:messina@luxosa.it" className="text-[14px] font-light text-anthracite/70 hover:text-anthracite transition-colors">messina@luxosa.it</a>
                </div>
                <div className="flex items-start gap-3">
                  <Clock size={16} strokeWidth={1.3} className="text-brass-muted flex-shrink-0 mt-0.5" />
                  <div className="text-[14px] font-light text-anthracite/70">
                    <p>Martedì — Sabato</p>
                    <p>09:00 — 19:00</p>
                    <p className="text-anthracite/40 mt-1">Domenica e Lunedì chiuso</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="border-t border-sand/60 pt-8">
              <p className="font-serif text-[18px] italic text-charcoal/55 font-light leading-relaxed mb-4">"La prima consulenza è il momento in cui ascoltiamo, osserviamo e comprendiamo."</p>
              <p className="text-[13px] text-anthracite/50 font-light">La consulenza iniziale è senza impegno e ha una durata di circa 30 minuti.</p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

export default function ContattiPage() {
  return (
    <>
      <PageHero label="Contatti" title="Siamo qui per Lei." subtitle="Prenoti una consulenza, richieda informazioni o semplicemente ci scriva. Saremo liete di accoglierla." image="/images/salon-reception-new.jpg" />
      <ContactForm />
    </>
  );
}
